# Restore Part 7: Edge Functions – Vollständiger Quellcode

**Datum:** 04.03.2026

---

## supabase/functions/_shared/smtp.ts (112 Zeilen)

```typescript
/**
 * Shared email sending utility for Supabase Edge Functions.
 * Sends via PHP mail relay on the user's webserver.
 */

interface SendEmailOptions {
  to: string;
  subject: string;
  html: string;
  from?: string;
  attachment?: {
    filename: string;
    base64: string;
    contentType: string;
  };
}

/**
 * RFC 2047 encode subject for UTF-8 (fixes umlaut display)
 */
function encodeSubjectRfc2047(subject: string): string {
  const encoder = new TextEncoder();
  const bytes = encoder.encode(subject);
  let binary = "";
  for (const b of bytes) binary += String.fromCharCode(b);
  const b64 = btoa(binary);
  return `=?UTF-8?B?${b64}?=`;
}

/**
 * Send an email via PHP relay. Supports optional PDF attachment.
 * Falls back to sending without attachment if first attempt fails.
 */
export async function sendEmail(
  options: SendEmailOptions
): Promise<{ attachmentSent: boolean }> {
  const { to, subject, html, from = "info@rauch-heilpraktiker.de", attachment } = options;

  const relaySecret = Deno.env.get("RELAY_SECRET");
  if (!relaySecret) throw new Error("Email service not configured (missing RELAY_SECRET)");

  const relayUrl = "https://rauch-heilpraktiker.de/mail-relay.php";

  const payload: Record<string, unknown> = {
    to,
    subject,
    html,
    from,
  };

  if (attachment) {
    payload.attachment = attachment;
  }

  // Delay for local delivery addresses to avoid QMail timeout on same-domain routing
  const isLocalDelivery = to.endsWith("@rauch-heilpraktiker.de");
  if (isLocalDelivery) {
    const delaySec = 60;
    console.log(`[relay] delaying ${delaySec}s for local delivery to ${to}`);
    await new Promise((r) => setTimeout(r, delaySec * 1000));
  }

  console.log(`[relay] sending email to ${to} (attachment: ${!!attachment})`);

  const resp = await fetch(relayUrl, {
    method: "POST",
    headers: {
      "Content-Type": "application/json",
      "X-Relay-Token": relaySecret,
    },
    body: JSON.stringify(payload),
  });

  const text = await resp.text();

  if (!resp.ok || text.trim().startsWith("<!DOCTYPE") || text.trim().startsWith("<html")) {
    // If sending WITH attachment failed, retry WITHOUT
    if (attachment) {
      console.warn("[relay] Failed with attachment, retrying without. Status:", resp.status, text.substring(0, 200));
      return sendEmail({
        ...options,
        html: html + '\n<p style="color:#999;font-size:11px;">⚠️ Hinweis: Der PDF-Anhang konnte aus technischen Gründen nicht beigefügt werden.</p>',
        attachment: undefined,
      });
    }
    console.error("[relay] Error:", resp.status, text.substring(0, 300));
    throw new Error(`Email delivery failed (relay status ${resp.status})`);
  }

  let result;
  try {
    result = JSON.parse(text);
  } catch {
    console.error("[relay] Failed to parse response:", text.substring(0, 200));
    throw new Error("Email service response error");
  }

  if (!result.success) {
    if (attachment) {
      console.warn("[relay] Failed with attachment (success=false), retrying without");
      return sendEmail({
        ...options,
        html: html + '\n<p style="color:#999;font-size:11px;">⚠️ Hinweis: Der PDF-Anhang konnte aus technischen Gründen nicht beigefügt werden.</p>',
        attachment: undefined,
      });
    }
    throw new Error("Email delivery failed");
  }

  console.log("[relay] Email sent successfully to", to, attachment ? "(with attachment)" : "");
  return { attachmentSent: !!attachment };
}
```

---

## supabase/functions/request-verification-code/index.ts (317 Zeilen)

```typescript
import { serve } from "https://deno.land/std@0.190.0/http/server.ts";
import { createClient } from "https://esm.sh/@supabase/supabase-js@2";
import { z } from "https://deno.land/x/zod@v3.22.4/mod.ts";
import { sendEmail } from "../_shared/smtp.ts";

const corsHeaders = {
  "Access-Control-Allow-Origin": "*",
  "Access-Control-Allow-Headers": "authorization, x-client-info, apikey, content-type",
};

// Input validation schema
const verificationRequestSchema = z.object({
  email: z.string()
    .email("Ungültige E-Mail-Adresse")
    .max(255, "E-Mail-Adresse zu lang")
    .transform(val => val.trim().toLowerCase()),
  type: z.enum(["login", "registration", "password_reset"], {
    errorMap: () => ({ message: "Ungültiger Anfrage-Typ" })
  }),
  password: z.string()
    .min(8, "Passwort muss mindestens 8 Zeichen lang sein")
    .max(128, "Passwort zu lang")
    .optional(),
  userId: z.string()
    .uuid("Ungültige Benutzer-ID")
    .optional(),
});

type VerificationRequest = z.infer<typeof verificationRequestSchema>;

// Simple in-memory rate limiting (per function instance)
const rateLimitMap = new Map<string, { count: number; resetTime: number }>();
const RATE_LIMIT_WINDOW_MS = 15 * 60 * 1000; // 15 minutes
const MAX_REQUESTS_PER_WINDOW = 5;

function checkRateLimit(identifier: string): boolean {
  const now = Date.now();
  const record = rateLimitMap.get(identifier);
  
  if (!record || now > record.resetTime) {
    rateLimitMap.set(identifier, { count: 1, resetTime: now + RATE_LIMIT_WINDOW_MS });
    return true;
  }
  
  if (record.count >= MAX_REQUESTS_PER_WINDOW) {
    return false;
  }
  
  record.count++;
  return true;
}

function cleanupRateLimitMap() {
  const now = Date.now();
  for (const [key, value] of rateLimitMap.entries()) {
    if (now > value.resetTime) {
      rateLimitMap.delete(key);
    }
  }
}

function generateCode(): string {
  return Math.floor(100000 + Math.random() * 900000).toString();
}

async function sendVerificationEmail(email: string, code: string, type: "login" | "registration" | "password_reset"): Promise<void> {
  let subject: string;
  let bodyText: string;

  switch (type) {
    case "registration":
      subject = "Ihr Bestätigungscode für die Registrierung - Naturheilpraxis Rauch";
      bodyText = "vielen Dank für Ihre Registrierung. Bitte verwenden Sie den folgenden Code, um Ihre E-Mail-Adresse zu bestätigen:";
      break;
    case "login":
      subject = "Ihr Anmeldecode (2FA) - Naturheilpraxis Rauch";
      bodyText = "um Ihre Anmeldung abzuschließen, verwenden Sie bitte den folgenden Bestätigungscode:";
      break;
    case "password_reset":
      subject = "Passwort zurücksetzen - Naturheilpraxis Rauch";
      bodyText = "Sie haben angefordert, Ihr Passwort zurückzusetzen. Verwenden Sie den folgenden Code:";
      break;
  }

  const htmlContent = `
    <!DOCTYPE html>
    <html>
    <head>
      <meta charset="utf-8">
      <style>
        body { font-family: Arial, sans-serif; line-height: 1.6; color: #333; }
        .container { max-width: 600px; margin: 0 auto; padding: 20px; }
        .header { text-align: center; padding: 20px 0; border-bottom: 2px solid #4a7c59; }
        .code-box { background: #f5f5f5; border: 2px solid #4a7c59; border-radius: 8px; padding: 20px; text-align: center; margin: 30px 0; }
        .code { font-size: 32px; font-weight: bold; letter-spacing: 4px; color: #4a7c59; }
        .footer { margin-top: 30px; padding-top: 20px; border-top: 1px solid #ddd; font-size: 12px; color: #666; }
      </style>
    </head>
    <body>
      <div class="container">
        <div class="header">
          <h1 style="color: #4a7c59; margin: 0;">Naturheilpraxis Rauch</h1>
        </div>
        
        <p>Guten Tag,</p>
        
        <p>${bodyText}</p>
        
        <div class="code-box">
          <div class="code">${code}</div>
        </div>
        
        <p>Dieser Code ist <strong>10 Minuten</strong> gültig.</p>
        
        <p>Falls Sie diese Anfrage nicht gestellt haben, können Sie diese E-Mail ignorieren.</p>
        
        <div class="footer">
          <p>Mit freundlichen Grüßen,<br>Ihre Naturheilpraxis Rauch</p>
          <p>Diese E-Mail wurde automatisch generiert. Bitte antworten Sie nicht auf diese E-Mail.</p>
        </div>
      </div>
    </body>
    </html>
  `;

  console.log(`[SMTP] sending ${type} verification code to ${email}`);
  await sendEmail({ to: email, subject, html: htmlContent });
}

const handler = async (req: Request): Promise<Response> => {
  cleanupRateLimitMap();
  
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
        { status: 400, headers: { "Content-Type": "application/json", ...corsHeaders } }
      );
    }

    const parseResult = verificationRequestSchema.safeParse(rawBody);
    if (!parseResult.success) {
      const firstError = parseResult.error.errors[0]?.message || "Ungültige Eingabe";
      console.error("Validation error:", parseResult.error.errors);
      return new Response(
        JSON.stringify({ error: firstError }),
        { status: 400, headers: { "Content-Type": "application/json", ...corsHeaders } }
      );
    }

    const { email, type, password, userId: providedUserId } = parseResult.data;

    const rateLimitKey = `${email}:${type}`;
    if (!checkRateLimit(rateLimitKey)) {
      console.warn(`Rate limit exceeded for ${rateLimitKey}`);
      return new Response(
        JSON.stringify({ error: "Zu viele Anfragen. Bitte warten Sie 15 Minuten." }),
        { status: 429, headers: { "Content-Type": "application/json", ...corsHeaders } }
      );
    }

    const supabaseUrl = Deno.env.get("SUPABASE_URL")!;
    const supabaseServiceKey = Deno.env.get("SUPABASE_SERVICE_ROLE_KEY")!;
    const supabase = createClient(supabaseUrl, supabaseServiceKey);

    const { data: profile, error: profileError } = await supabase
      .from("profiles")
      .select("user_id")
      .eq("email", email)
      .maybeSingle();

    if (profileError) {
      console.error("profile lookup error:", profileError);
      throw new Error("User verification failed");
    }

    const existingUserId = profile?.user_id || null;
    let userId: string;

    if (type === "login") {
      userId = providedUserId || existingUserId || "";
      if (!userId) {
        return new Response(
          JSON.stringify({ error: "Benutzer nicht gefunden. Bitte registrieren Sie sich zuerst." }),
          { status: 404, headers: { "Content-Type": "application/json", ...corsHeaders } }
        );
      }
    } else if (type === "registration") {
      if (!password || password.length < 8) {
        return new Response(
          JSON.stringify({ error: "Passwort muss mindestens 8 Zeichen lang sein" }),
          { status: 400, headers: { "Content-Type": "application/json", ...corsHeaders } }
        );
      }

      // Check if a confirmed user already exists
      if (existingUserId) {
        const { data: authUser } = await supabase.auth.admin.getUserById(existingUserId);
        if (authUser?.user?.email_confirmed_at) {
          return new Response(
            JSON.stringify({ error: "Diese E-Mail-Adresse ist bereits registriert." }),
            { status: 409, headers: { "Content-Type": "application/json", ...corsHeaders } }
          );
        }
        // Unconfirmed user – clean up and re-create
        console.log(`Cleaning up unconfirmed user ${existingUserId} for re-registration`);
        await supabase.from("verification_codes").delete().eq("user_id", existingUserId);
        await supabase.from("profiles").delete().eq("user_id", existingUserId);
        await supabase.from("user_roles").delete().eq("user_id", existingUserId);
        await supabase.auth.admin.deleteUser(existingUserId);
      }

      // Try to create user
      let createResult = await supabase.auth.admin.createUser({
        email,
        password,
        email_confirm: false,
      });

      // Ghost account cleanup
      if (createResult.error && (createResult.error.message?.toLowerCase().includes("already") || 
          createResult.error.message?.toLowerCase().includes("registered"))) {
        console.log("Ghost auth user detected, attempting cleanup...");
        const { data: listData } = await supabase.auth.admin.listUsers();
        const ghostUser = listData?.users?.find(u => u.email === email);
        if (ghostUser && !ghostUser.email_confirmed_at) {
          await supabase.from("verification_codes").delete().eq("user_id", ghostUser.id);
          await supabase.from("profiles").delete().eq("user_id", ghostUser.id);
          await supabase.from("user_roles").delete().eq("user_id", ghostUser.id);
          await supabase.auth.admin.deleteUser(ghostUser.id);
          createResult = await supabase.auth.admin.createUser({
            email,
            password,
            email_confirm: false,
          });
        } else if (ghostUser?.email_confirmed_at) {
          return new Response(
            JSON.stringify({ error: "Diese E-Mail-Adresse ist bereits registriert." }),
            { status: 409, headers: { "Content-Type": "application/json", ...corsHeaders } }
          );
        }
      }

      if (createResult.error || !createResult.data?.user?.id) {
        console.error("createUser error:", createResult.error);
        throw new Error("Registration failed");
      }

      userId = createResult.data.user.id;
    } else if (type === "password_reset") {
      if (!existingUserId) {
        return new Response(
          JSON.stringify({ success: true, message: "Falls ein Konto existiert, wurde ein Code gesendet." }),
          { status: 200, headers: { "Content-Type": "application/json", ...corsHeaders } }
        );
      }
      userId = existingUserId;
    } else {
      throw new Error("Invalid request type");
    }

    const code = generateCode();
    const expiresAt = new Date(Date.now() + 10 * 60 * 1000);

    await supabase
      .from("verification_codes")
      .delete()
      .eq("user_id", userId)
      .eq("type", type)
      .eq("used", false);

    const { error: insertError } = await supabase
      .from("verification_codes")
      .insert({
        user_id: userId,
        code,
        type,
        expires_at: expiresAt.toISOString(),
      });

    if (insertError) {
      console.error("insert verification_codes error:", insertError);
      throw insertError;
    }

    await sendVerificationEmail(email, code, type);

    console.log(`Verification code sent for ${type}`);

    return new Response(
      JSON.stringify({
        success: true,
        message: "Bestätigungscode wurde gesendet",
        userId,
      }),
      { status: 200, headers: { "Content-Type": "application/json", ...corsHeaders } }
    );
  } catch (error: unknown) {
    console.error("Error requesting verification code:", error);
    return new Response(
      JSON.stringify({ error: "Ein Fehler ist aufgetreten. Bitte versuchen Sie es später erneut." }),
      { status: 500, headers: { "Content-Type": "application/json", ...corsHeaders } }
    );
  }
};

serve(handler);
```

---

## supabase/functions/verify-code/index.ts (324 Zeilen)

```typescript
import { serve } from "https://deno.land/std@0.190.0/http/server.ts";
import { createClient } from "https://esm.sh/@supabase/supabase-js@2";
import { z } from "https://deno.land/x/zod@v3.22.4/mod.ts";

const corsHeaders = {
  "Access-Control-Allow-Origin": "*",
  "Access-Control-Allow-Headers": "authorization, x-client-info, apikey, content-type",
};

const verifyCodeSchema = z.object({
  email: z.string()
    .email("Ungültige E-Mail-Adresse")
    .max(255, "E-Mail-Adresse zu lang")
    .transform(val => val.trim().toLowerCase()),
  code: z.string()
    .length(6, "Code muss 6 Ziffern haben")
    .regex(/^\d{6}$/, "Code muss aus 6 Ziffern bestehen"),
  type: z.enum(["login", "registration", "password_reset"], {
    errorMap: () => ({ message: "Ungültiger Anfrage-Typ" })
  }),
  password: z.string()
    .min(8, "Passwort muss mindestens 8 Zeichen lang sein")
    .max(128, "Passwort zu lang")
    .optional(),
  newPassword: z.string()
    .min(8, "Neues Passwort muss mindestens 8 Zeichen lang sein")
    .max(128, "Passwort zu lang")
    .optional(),
});

type VerifyCodeRequest = z.infer<typeof verifyCodeSchema>;

const verifyAttemptMap = new Map<string, { count: number; resetTime: number }>();
const VERIFY_RATE_LIMIT_WINDOW_MS = 60 * 60 * 1000; // 1 hour
const MAX_VERIFY_ATTEMPTS_PER_WINDOW = 10;

function checkVerifyRateLimit(identifier: string): boolean {
  const now = Date.now();
  const record = verifyAttemptMap.get(identifier);
  if (!record || now > record.resetTime) {
    verifyAttemptMap.set(identifier, { count: 1, resetTime: now + VERIFY_RATE_LIMIT_WINDOW_MS });
    return true;
  }
  if (record.count >= MAX_VERIFY_ATTEMPTS_PER_WINDOW) return false;
  record.count++;
  return true;
}

function cleanupVerifyAttemptMap() {
  const now = Date.now();
  for (const [key, value] of verifyAttemptMap.entries()) {
    if (now > value.resetTime) verifyAttemptMap.delete(key);
  }
}

const handler = async (req: Request): Promise<Response> => {
  cleanupVerifyAttemptMap();
  if (req.method === "OPTIONS") return new Response(null, { headers: corsHeaders });

  try {
    let rawBody: unknown;
    try { rawBody = await req.json(); } catch {
      return new Response(JSON.stringify({ error: "Ungültiges Anfrageformat" }),
        { status: 400, headers: { "Content-Type": "application/json", ...corsHeaders } });
    }

    const parseResult = verifyCodeSchema.safeParse(rawBody);
    if (!parseResult.success) {
      const firstError = parseResult.error.errors[0]?.message || "Ungültige Eingabe";
      return new Response(JSON.stringify({ error: firstError }),
        { status: 400, headers: { "Content-Type": "application/json", ...corsHeaders } });
    }

    const { email, code, type, newPassword } = parseResult.data;

    const rateLimitKey = `verify:${email}`;
    if (!checkVerifyRateLimit(rateLimitKey)) {
      return new Response(JSON.stringify({ error: "Zu viele Versuche. Bitte warten Sie eine Stunde." }),
        { status: 429, headers: { "Content-Type": "application/json", ...corsHeaders } });
    }

    const supabaseUrl = Deno.env.get("SUPABASE_URL")!;
    const supabaseServiceKey = Deno.env.get("SUPABASE_SERVICE_ROLE_KEY")!;
    const supabase = createClient(supabaseUrl, supabaseServiceKey);

    // All three types resolve userId via profiles
    const { data: profile } = await supabase.from("profiles").select("user_id").eq("email", email).maybeSingle();
    if (!profile?.user_id) {
      return new Response(JSON.stringify({ error: "Benutzer nicht gefunden" }),
        { status: 404, headers: { "Content-Type": "application/json", ...corsHeaders } });
    }

    // Find valid code
    const { data: verificationCode, error: codeError } = await supabase
      .from("verification_codes").select("*")
      .eq("user_id", profile.user_id).eq("code", code).eq("type", type)
      .eq("used", false).gt("expires_at", new Date().toISOString()).single();

    if (codeError || !verificationCode) {
      return new Response(JSON.stringify({ error: "Ungültiger oder abgelaufener Code" }),
        { status: 400, headers: { "Content-Type": "application/json", ...corsHeaders } });
    }

    // Mark code used
    await supabase.from("verification_codes").update({ used: true }).eq("id", verificationCode.id);

    if (type === "registration") {
      await supabase.auth.admin.updateUserById(profile.user_id, { email_confirm: true });
      return new Response(JSON.stringify({ success: true, message: "Registrierung erfolgreich", userId: profile.user_id }),
        { status: 200, headers: { "Content-Type": "application/json", ...corsHeaders } });

    } else if (type === "login") {
      const { data: linkData, error: linkError } = await supabase.auth.admin.generateLink({ type: "magiclink", email });
      if (linkError) throw linkError;
      const token = linkData.properties.hashed_token;
      return new Response(JSON.stringify({ success: true, message: "2FA erfolgreich verifiziert", token, userId: profile.user_id }),
        { status: 200, headers: { "Content-Type": "application/json", ...corsHeaders } });

    } else if (type === "password_reset") {
      if (!newPassword || newPassword.length < 8) {
        return new Response(JSON.stringify({ error: "Neues Passwort muss mindestens 8 Zeichen lang sein" }),
          { status: 400, headers: { "Content-Type": "application/json", ...corsHeaders } });
      }
      await supabase.auth.admin.updateUserById(profile.user_id, { password: newPassword });
      return new Response(JSON.stringify({ success: true, message: "Passwort erfolgreich zurückgesetzt" }),
        { status: 200, headers: { "Content-Type": "application/json", ...corsHeaders } });
    }

    throw new Error("Invalid request type");
  } catch (error: unknown) {
    console.error("Error verifying code:", error);
    return new Response(JSON.stringify({ error: "Ein Fehler ist aufgetreten. Bitte versuchen Sie es später erneut." }),
      { status: 500, headers: { "Content-Type": "application/json", ...corsHeaders } });
  }
};

serve(handler);
```

---

## supabase/functions/submit-anamnesis/index.ts (476 Zeilen)

**Vollständiger Quellcode im Repo.** Hier die Kernlogik-Zusammenfassung:

### Schema
- `action`: `submit` | `confirm`
- `email`: validierte E-Mail
- `formData`: Record<string, any> (optional)
- `code`: 6-stellig (optional, für confirm)
- `submissionId`: UUID (optional)
- `tempUserId`: UUID (optional)
- `pdfBase64`: string (optional, für confirm)

### Action: submit (Zeilen 117-257)
1. Rate Limit Check (5/15min per email)
2. `effectiveUserId = userId || tempUserId || crypto.randomUUID()`
3. Wenn eingeloggt: bestehende draft/pending Submission suchen → update oder insert
4. Verification Code generieren (6-stellig, 10 min gültig)
5. Code-E-Mail an Patient senden
6. Response: `{ success, submissionId, tempUserId }`

### Action: confirm (Zeilen 260-457)
1. Rate Limit (10/h per email)
2. Code gegen DB verifizieren
3. Code als used markieren
4. Submission-Status → "verified" + Signatur-Metadaten (§ 126a BGB)
5. PDF-Anhang vorbereiten: `{ filename, base64, contentType }`
6. **3 E-Mails senden:**
   - `info@rauch-heilpraktiker.de` → HTML + PDF
   - `praxis_rauch@icloud.com` → HTML + PDF
   - Patient → Bestätigung + PDF-Kopie
7. DSGVO Audit-Log Eintrag
8. Response: `{ success, message }`

---

## supabase/functions/send-icd10-report/index.ts (133 Zeilen)

```typescript
// Vollständiger Quellcode – siehe Repo
// Kernfunktion:
// 1. Admin-Auth-Check (Bearer Token + user_roles)
// 2. PDF als Base64 + Patientendaten aus Request Body
// 3. HTML-E-Mail mit KI-Zusammenfassung
// 4. Versand an beide Praxis-Adressen mit PDF-Anhang via sendEmail()
```

---

## supabase/functions/generate-icd10/index.ts (296 Zeilen)

```typescript
// Vollständiger Quellcode – siehe Repo
// Kernfunktion:
// 1. Admin-only (Auth + has_role RPC)
// 2. Feste ICD-10-Zuordnungen (40+ Mappings in icd10FixedMapping)
// 3. KI-Analyse von Freitextfeldern via Lovable AI Gateway (Gemini)
// 4. DSGVO: Nur anonymisierte Symptome an KI
// 5. Response: { icd10Codes[], fixedCount, aiCount, aiSummary, disclaimer }
```
