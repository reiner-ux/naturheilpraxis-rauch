import { serve } from "https://deno.land/std@0.190.0/http/server.ts";
import { createClient } from "https://esm.sh/@supabase/supabase-js@2";
import { z } from "https://deno.land/x/zod@v3.22.4/mod.ts";

const corsHeaders = {
  "Access-Control-Allow-Origin": "*",
  "Access-Control-Allow-Headers":
    "authorization, x-client-info, apikey, content-type, x-supabase-client-platform, x-supabase-client-platform-version, x-supabase-client-runtime, x-supabase-client-runtime-version",
};

const requestSchema = z.object({
  action: z.enum(["submit", "confirm"]),
  email: z
    .string()
    .email("Ungültige E-Mail-Adresse")
    .max(255)
    .transform((v) => v.trim().toLowerCase()),
  formData: z.record(z.any()).optional(),
  code: z
    .string()
    .length(6)
    .regex(/^\d{6}$/)
    .optional(),
  submissionId: z.string().uuid().optional().nullable(),
  tempUserId: z.string().uuid().optional().nullable(),
});

// In-memory rate limiting
const rateLimitMap = new Map<
  string,
  { count: number; resetTime: number }
>();

function checkRateLimit(
  key: string,
  max = 5,
  windowMs = 15 * 60 * 1000
): boolean {
  const now = Date.now();
  const r = rateLimitMap.get(key);
  if (!r || now > r.resetTime) {
    rateLimitMap.set(key, { count: 1, resetTime: now + windowMs });
    return true;
  }
  if (r.count >= max) return false;
  r.count++;
  return true;
}

function generateCode(): string {
  return Math.floor(100000 + Math.random() * 900000).toString();
}

async function sendViaRelay(
  to: string,
  subject: string,
  html: string
): Promise<void> {
  const relaySecret = Deno.env.get("RELAY_SECRET");
  if (!relaySecret) throw new Error("Email service not configured");

  const resp = await fetch("https://rauch-heilpraktiker.de/mail-relay.php", {
    method: "POST",
    headers: {
      "Content-Type": "application/json",
      "X-Relay-Token": relaySecret,
    },
    body: JSON.stringify({
      to,
      subject,
      html,
      from: "noreply@rauch-heilpraktiker.de",
    }),
  });

  const text = await resp.text();
  if (!resp.ok || text.trim().startsWith("<!DOCTYPE") || text.trim().startsWith("<html")) {
    console.error("Relay error:", resp.status, text.substring(0, 200));
    throw new Error("Email delivery failed");
  }

  let result;
  try {
    result = JSON.parse(text);
  } catch {
    console.error("Failed to parse relay response");
    throw new Error("Email service response error");
  }

  if (!result.success) throw new Error("Email delivery failed");
  console.log("Email sent successfully to", to);
}

function escapeHtml(str: string): string {
  return String(str)
    .replace(/&/g, "&amp;")
    .replace(/</g, "&lt;")
    .replace(/>/g, "&gt;")
    .replace(/"/g, "&quot;");
}

serve(async (req) => {
  if (req.method === "OPTIONS") {
    return new Response(null, { headers: corsHeaders });
  }

  try {
    let rawBody: unknown;
    try {
      rawBody = await req.json();
    } catch {
      return new Response(
        JSON.stringify({ error: "Ungültiges Anfrageformat" }),
        {
          status: 400,
          headers: { ...corsHeaders, "Content-Type": "application/json" },
        }
      );
    }

    const parseResult = requestSchema.safeParse(rawBody);
    if (!parseResult.success) {
      const firstError =
        parseResult.error.errors[0]?.message || "Ungültige Eingabe";
      console.error("Validation error:", parseResult.error.errors);
      return new Response(JSON.stringify({ error: firstError }), {
        status: 400,
        headers: { ...corsHeaders, "Content-Type": "application/json" },
      });
    }

    const { action, email, formData, code, submissionId, tempUserId } =
      parseResult.data;

    const supabaseUrl = Deno.env.get("SUPABASE_URL")!;
    const supabaseServiceKey = Deno.env.get("SUPABASE_SERVICE_ROLE_KEY")!;
    const supabase = createClient(supabaseUrl, supabaseServiceKey);

    // Try to get userId from auth header
    let userId: string | null = null;
    const authHeader = req.headers.get("Authorization");
    if (authHeader?.startsWith("Bearer ")) {
      try {
        const token = authHeader.replace("Bearer ", "");
        const {
          data: { user },
        } = await supabase.auth.getUser(token);
        userId = user?.id || null;
      } catch {
        /* not authenticated - ok for dev mode */
      }
    }

    // ── ACTION: SUBMIT ──────────────────────────────────────────────
    if (action === "submit") {
      if (!formData) {
        return new Response(
          JSON.stringify({ error: "Formulardaten fehlen" }),
          {
            status: 400,
            headers: { ...corsHeaders, "Content-Type": "application/json" },
          }
        );
      }

      if (!checkRateLimit(`submit:${email}`)) {
        return new Response(
          JSON.stringify({
            error:
              "Zu viele Anfragen. Bitte warten Sie 15 Minuten.",
          }),
          {
            status: 429,
            headers: { ...corsHeaders, "Content-Type": "application/json" },
          }
        );
      }

      // Use existing tempUserId if resending, or create new
      const effectiveUserId =
        userId || tempUserId || crypto.randomUUID();
      let submId: string | null = null;

      // Save to database if authenticated
      if (userId) {
        // Check if a draft already exists for this user
        const { data: existing } = await supabase
          .from("anamnesis_submissions")
          .select("id")
          .eq("user_id", userId)
          .in("status", ["draft", "pending_verification"])
          .order("submitted_at", { ascending: false })
          .limit(1)
          .maybeSingle();

        if (existing) {
          // Update existing draft
          const { error: updateError } = await supabase
            .from("anamnesis_submissions")
            .update({
              form_data: formData,
              status: "pending_verification",
            })
            .eq("id", existing.id);

          if (updateError) {
            console.error("DB update error:", updateError);
            throw new Error("Failed to save submission");
          }
          submId = existing.id;
        } else {
          const { data: sub, error: subError } = await supabase
            .from("anamnesis_submissions")
            .insert({
              user_id: userId,
              form_data: formData,
              status: "pending_verification",
            })
            .select("id")
            .single();

          if (subError) {
            console.error("DB insert error:", subError);
            throw new Error("Failed to save submission");
          }
          submId = sub.id;
        }
      }

      // Generate 6-digit verification code
      const verCode = generateCode();
      const expiresAt = new Date(Date.now() + 10 * 60 * 1000);

      // Clean old unused codes
      await supabase
        .from("verification_codes")
        .delete()
        .eq("user_id", effectiveUserId)
        .eq("type", "anamnesis")
        .eq("used", false);

      const { error: codeError } = await supabase
        .from("verification_codes")
        .insert({
          user_id: effectiveUserId,
          code: verCode,
          type: "anamnesis",
          expires_at: expiresAt.toISOString(),
        });

      if (codeError) {
        console.error("Code insert error:", codeError);
        throw new Error("Failed to create verification code");
      }

      // Send verification code email
      const patientName =
        `${formData.vorname || ""} ${formData.nachname || ""}`.trim() ||
        "Patient";

      await sendViaRelay(
        email,
        "Ihr Bestätigungscode – Anamnesebogen – Naturheilpraxis Rauch",
        `<!DOCTYPE html>
<html><head><meta charset="utf-8">
<style>
  body { font-family: Arial, sans-serif; line-height: 1.6; color: #333; }
  .container { max-width: 600px; margin: 0 auto; padding: 20px; }
  .header { text-align: center; padding: 20px 0; border-bottom: 2px solid #4a7c59; }
  .code-box { background: #f5f5f5; border: 2px solid #4a7c59; border-radius: 8px; padding: 20px; text-align: center; margin: 30px 0; }
  .code { font-size: 32px; font-weight: bold; letter-spacing: 4px; color: #4a7c59; }
  .footer { margin-top: 30px; padding-top: 20px; border-top: 1px solid #ddd; font-size: 12px; color: #666; }
</style>
</head><body>
<div class="container">
  <div class="header"><h1 style="color: #4a7c59; margin: 0;">Naturheilpraxis Rauch</h1></div>
  <p>Guten Tag ${escapeHtml(patientName)},</p>
  <p>vielen Dank für das Ausfüllen des Anamnesebogens. Um Ihre digitale Unterschrift rechtssicher zu bestätigen (§&nbsp;126a BGB), verwenden Sie bitte den folgenden Code:</p>
  <div class="code-box"><div class="code">${verCode}</div></div>
  <p>Dieser Code ist <strong>10 Minuten</strong> gültig.</p>
  <p>Falls Sie diesen Anamnesebogen nicht ausgefüllt haben, können Sie diese E-Mail ignorieren.</p>
  <div class="footer"><p>Mit freundlichen Grüßen,<br>Ihre Naturheilpraxis Rauch</p></div>
</div></body></html>`
      );

      console.log("Anamnesis verification code sent for", email);

      return new Response(
        JSON.stringify({
          success: true,
          submissionId: submId,
          tempUserId: userId ? undefined : effectiveUserId,
          message: "Bestätigungscode wurde gesendet",
        }),
        {
          status: 200,
          headers: { ...corsHeaders, "Content-Type": "application/json" },
        }
      );
    }

    // ── ACTION: CONFIRM ─────────────────────────────────────────────
    if (action === "confirm") {
      if (!code) {
        return new Response(
          JSON.stringify({ error: "Code ist erforderlich" }),
          {
            status: 400,
            headers: { ...corsHeaders, "Content-Type": "application/json" },
          }
        );
      }

      if (!checkRateLimit(`verify:${email}`, 10, 60 * 60 * 1000)) {
        return new Response(
          JSON.stringify({
            error: "Zu viele Versuche. Bitte warten Sie eine Stunde.",
          }),
          {
            status: 429,
            headers: { ...corsHeaders, "Content-Type": "application/json" },
          }
        );
      }

      const effectiveUserId = userId || tempUserId;
      if (!effectiveUserId) {
        return new Response(
          JSON.stringify({ error: "Benutzer-Identifikation fehlt" }),
          {
            status: 400,
            headers: { ...corsHeaders, "Content-Type": "application/json" },
          }
        );
      }

      // Verify code
      const { data: vc, error: vcError } = await supabase
        .from("verification_codes")
        .select("*")
        .eq("user_id", effectiveUserId)
        .eq("code", code)
        .eq("type", "anamnesis")
        .eq("used", false)
        .gt("expires_at", new Date().toISOString())
        .single();

      if (vcError || !vc) {
        return new Response(
          JSON.stringify({
            error: "Ungültiger oder abgelaufener Code",
          }),
          {
            status: 400,
            headers: { ...corsHeaders, "Content-Type": "application/json" },
          }
        );
      }

      // Mark code as used
      await supabase
        .from("verification_codes")
        .update({ used: true })
        .eq("id", vc.id);

      // Update submission status if exists
      if (submissionId) {
        await supabase
          .from("anamnesis_submissions")
          .update({
            status: "verified",
            signature_data: JSON.stringify({
              verified_at: new Date().toISOString(),
              method: "email_2fa",
              legal_basis: "§ 126a BGB",
            }),
          })
          .eq("id", submissionId);
      }

      // Extract patient info
      const fd = formData || {};
      const patientName =
        `${fd.vorname || ""} ${fd.nachname || ""}`.trim() || "Unbekannt";
      const patientEmail = email;
      const patientPhone =
        String(fd.telefon || fd.mobil || "-");
      const patientDob = String(fd.geburtsdatum || "-");
      const submittedAt = new Date().toLocaleString("de-DE", {
        timeZone: "Europe/Berlin",
      });

      // Build HTML summary of all form fields
      function renderValue(val: unknown, depth = 0): string {
        if (val === null || val === undefined || val === "") return "-";
        if (typeof val === "boolean") return val ? "Ja" : "Nein";
        if (Array.isArray(val)) {
          const filtered = val.filter((v) => v !== null && v !== undefined && v !== "");
          if (filtered.length === 0) return "-";
          if (typeof filtered[0] === "object") {
            return filtered.map((item, i) => `<div style="margin-left:${depth*12}px;margin-bottom:4px;"><strong>#${i+1}</strong><br/>${renderValue(item, depth+1)}</div>`).join("");
          }
          return filtered.map((v) => escapeHtml(String(v))).join(", ");
        }
        if (typeof val === "object") {
          const entries = Object.entries(val as Record<string, unknown>).filter(([, v]) => v !== null && v !== undefined && v !== "" && !(Array.isArray(v) && v.length === 0));
          if (entries.length === 0) return "-";
          return entries.map(([k, v]) => `<tr><td style="padding:4px 8px;vertical-align:top;font-weight:bold;white-space:nowrap;border-bottom:1px solid #eee;">${escapeHtml(k)}</td><td style="padding:4px 8px;border-bottom:1px solid #eee;">${renderValue(v, depth+1)}</td></tr>`).join("");
        }
        return escapeHtml(String(val));
      }

      // Build the summary table
      const formEntries = Object.entries(fd).filter(([, v]) => v !== null && v !== undefined && v !== "" && !(Array.isArray(v) && v.length === 0));
      let summaryHtml = '<table style="width:100%;border-collapse:collapse;font-size:13px;">';
      for (const [key, value] of formEntries) {
        if (typeof value === "object" && !Array.isArray(value) && value !== null) {
          // Nested object: render sub-table
          const subRows = renderValue(value, 1);
          summaryHtml += `<tr><td colspan="2" style="padding:10px 8px 4px;font-weight:bold;color:#4a7c59;font-size:14px;border-bottom:2px solid #4a7c59;">${escapeHtml(key)}</td></tr>${subRows}`;
        } else {
          summaryHtml += `<tr><td style="padding:4px 8px;vertical-align:top;font-weight:bold;white-space:nowrap;border-bottom:1px solid #eee;">${escapeHtml(key)}</td><td style="padding:4px 8px;border-bottom:1px solid #eee;">${renderValue(value)}</td></tr>`;
        }
      }
      summaryHtml += '</table>';

      // ── Send notification to practice ──
      await sendViaRelay(
        "info@rauch-heilpraktiker.de",
        `Neuer Anamnesebogen eingegangen: ${escapeHtml(patientName)}`,
        `<!DOCTYPE html>
<html><head><meta charset="utf-8">
<style>
  body { font-family: Arial, sans-serif; line-height: 1.6; color: #333; }
  .container { max-width: 800px; margin: 0 auto; padding: 20px; }
  .header { text-align: center; padding: 20px 0; border-bottom: 2px solid #4a7c59; }
  .info-box { background: #f0f7f0; border: 1px solid #4a7c59; border-radius: 8px; padding: 15px; margin: 20px 0; }
  .label { font-weight: bold; color: #4a7c59; }
  .summary { margin-top: 30px; }
  .footer { margin-top: 30px; padding-top: 20px; border-top: 1px solid #ddd; font-size: 12px; color: #666; }
</style>
</head><body>
<div class="container">
  <div class="header"><h1 style="color: #4a7c59; margin: 0;">Neuer Anamnesebogen</h1></div>
  <p>Ein neuer Anamnesebogen wurde eingereicht und digital verifiziert:</p>
  <div class="info-box">
    <p><span class="label">Patient:</span> ${escapeHtml(patientName)}</p>
    <p><span class="label">E-Mail:</span> ${escapeHtml(patientEmail)}</p>
    <p><span class="label">Telefon:</span> ${escapeHtml(patientPhone)}</p>
    <p><span class="label">Geburtsdatum:</span> ${escapeHtml(patientDob)}</p>
    <p><span class="label">Eingereicht am:</span> ${escapeHtml(submittedAt)}</p>
    <p><span class="label">Status:</span> ✅ Digital verifiziert (§&nbsp;126a BGB)</p>
  </div>
  <div class="summary">
    <h2 style="color: #4a7c59; border-bottom: 2px solid #4a7c59; padding-bottom: 8px;">Vollständige Angaben</h2>
    ${summaryHtml}
  </div>
  <div class="footer"><p>Automatische Benachrichtigung – Naturheilpraxis Rauch</p></div>
</div></body></html>`
      );

      // ── Send confirmation to patient ──
      await sendViaRelay(
        patientEmail,
        "Bestätigung: Ihr Anamnesebogen wurde erfolgreich übermittelt – Naturheilpraxis Rauch",
        `<!DOCTYPE html>
<html><head><meta charset="utf-8">
<style>
  body { font-family: Arial, sans-serif; line-height: 1.6; color: #333; }
  .container { max-width: 600px; margin: 0 auto; padding: 20px; }
  .header { text-align: center; padding: 20px 0; border-bottom: 2px solid #4a7c59; }
  .success-box { background: #f0f7f0; border: 2px solid #4a7c59; border-radius: 8px; padding: 20px; text-align: center; margin: 30px 0; }
  .footer { margin-top: 30px; padding-top: 20px; border-top: 1px solid #ddd; font-size: 12px; color: #666; }
</style>
</head><body>
<div class="container">
  <div class="header"><h1 style="color: #4a7c59; margin: 0;">Naturheilpraxis Rauch</h1></div>
  <p>Guten Tag ${escapeHtml(patientName)},</p>
  <div class="success-box">
    <h2 style="color: #4a7c59;">✅ Anamnesebogen erfolgreich übermittelt</h2>
    <p>Ihr Anamnesebogen wurde am ${escapeHtml(submittedAt)} erfolgreich übermittelt und digital verifiziert.</p>
  </div>
  <p>Ihre Angaben werden vor Ihrem Termin von Peter Rauch geprüft, um eine optimale Behandlung zu gewährleisten.</p>
  <p>Bei Fragen erreichen Sie uns unter:</p>
  <ul>
    <li>E-Mail: info@rauch-heilpraktiker.de</li>
    <li>Telefon: 0821-4504050</li>
  </ul>
  <div class="footer">
    <p>Mit freundlichen Grüßen,<br>Ihre Naturheilpraxis Rauch</p>
    <p style="font-size: 11px; color: #999;">Diese E-Mail wurde automatisch generiert. Ihre Gesundheitsdaten werden gemäß DSGVO geschützt und mit einer Aufbewahrungsfrist von 10 Jahren gespeichert.</p>
  </div>
</div></body></html>`
      );

      console.log("Anamnesis confirmed and emails sent for", email);

      return new Response(
        JSON.stringify({
          success: true,
          message: "Anamnesebogen erfolgreich übermittelt",
        }),
        {
          status: 200,
          headers: { ...corsHeaders, "Content-Type": "application/json" },
        }
      );
    }

    return new Response(JSON.stringify({ error: "Ungültige Aktion" }), {
      status: 400,
      headers: { ...corsHeaders, "Content-Type": "application/json" },
    });
  } catch (error: unknown) {
    console.error("Error in submit-anamnesis:", error);
    return new Response(
      JSON.stringify({
        error:
          "Ein Fehler ist aufgetreten. Bitte versuchen Sie es später erneut.",
      }),
      {
        status: 500,
        headers: { ...corsHeaders, "Content-Type": "application/json" },
      }
    );
  }
});
