# Restore Part 4: Edge Functions (Complete Source)

## supabase/functions/request-verification-code/index.ts
```typescript
import { serve } from "https://deno.land/std@0.190.0/http/server.ts";
import { createClient } from "https://esm.sh/@supabase/supabase-js@2";
import { z } from "https://deno.land/x/zod@v3.22.4/mod.ts";

const corsHeaders = {
  "Access-Control-Allow-Origin": "*",
  "Access-Control-Allow-Headers": "authorization, x-client-info, apikey, content-type",
};

const verificationRequestSchema = z.object({
  email: z.string().email("Ungültige E-Mail-Adresse").max(255).transform(val => val.trim().toLowerCase()),
  type: z.enum(["login", "registration", "password_reset"], {
    errorMap: () => ({ message: "Ungültiger Anfrage-Typ" })
  }),
  password: z.string().min(8).max(128).optional(),
  userId: z.string().uuid().optional(),
});

type VerificationRequest = z.infer<typeof verificationRequestSchema>;

const rateLimitMap = new Map<string, { count: number; resetTime: number }>();
const RATE_LIMIT_WINDOW_MS = 15 * 60 * 1000;
const MAX_REQUESTS_PER_WINDOW = 5;

function checkRateLimit(identifier: string): boolean {
  const now = Date.now();
  const record = rateLimitMap.get(identifier);
  if (!record || now > record.resetTime) {
    rateLimitMap.set(identifier, { count: 1, resetTime: now + RATE_LIMIT_WINDOW_MS });
    return true;
  }
  if (record.count >= MAX_REQUESTS_PER_WINDOW) return false;
  record.count++;
  return true;
}

function cleanupRateLimitMap() {
  const now = Date.now();
  for (const [key, value] of rateLimitMap.entries()) {
    if (now > value.resetTime) rateLimitMap.delete(key);
  }
}

function generateCode(): string {
  return Math.floor(100000 + Math.random() * 900000).toString();
}

async function sendVerificationEmail(email: string, code: string, type: "login" | "registration" | "password_reset"): Promise<void> {
  const relaySecret = Deno.env.get("RELAY_SECRET");
  if (!relaySecret) throw new Error("Email service not configured");

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

  const htmlContent = `<!DOCTYPE html><html><head><meta charset="utf-8">
<style>
  body { font-family: Arial, sans-serif; line-height: 1.6; color: #333; }
  .container { max-width: 600px; margin: 0 auto; padding: 20px; }
  .header { text-align: center; padding: 20px 0; border-bottom: 2px solid #4a7c59; }
  .code-box { background: #f5f5f5; border: 2px solid #4a7c59; border-radius: 8px; padding: 20px; text-align: center; margin: 30px 0; }
  .code { font-size: 32px; font-weight: bold; letter-spacing: 4px; color: #4a7c59; }
  .footer { margin-top: 30px; padding-top: 20px; border-top: 1px solid #ddd; font-size: 12px; color: #666; }
</style></head><body>
<div class="container">
  <div class="header"><h1 style="color: #4a7c59; margin: 0;">Naturheilpraxis Rauch</h1></div>
  <p>Guten Tag,</p>
  <p>${bodyText}</p>
  <div class="code-box"><div class="code">${code}</div></div>
  <p>Dieser Code ist <strong>10 Minuten</strong> gültig.</p>
  <p>Falls Sie diese Anfrage nicht gestellt haben, können Sie diese E-Mail ignorieren.</p>
  <div class="footer"><p>Mit freundlichen Grüßen,<br>Ihre Naturheilpraxis Rauch</p></div>
</div></body></html>`;

  const relayUrl = "https://rauch-heilpraktiker.de/mail-relay.php";
  console.log(`[relay] sending ${type} code`);
  
  const response = await fetch(relayUrl, {
    method: "POST",
    headers: { "Content-Type": "application/json", "X-Relay-Token": relaySecret },
    body: JSON.stringify({
      to: email, subject, html: htmlContent,
      from: "info@rauch-heilpraktiker.de",
      meta: { type, source: "lovable-cloud-request-verification-code" },
    }),
  });

  const responseText = await response.text();
  if (responseText.trim().startsWith("<!DOCTYPE") || responseText.trim().startsWith("<html")) {
    console.error("Relay returned HTML instead of JSON");
    throw new Error("Email service temporarily unavailable");
  }
  if (!response.ok) { console.error("Relay error:", response.status); throw new Error("Email service error"); }

  let result;
  try { result = JSON.parse(responseText); } catch { throw new Error("Email service response error"); }
  if (!result.success) throw new Error("Email delivery failed");
  console.log("Email sent successfully");
}

const handler = async (req: Request): Promise<Response> => {
  cleanupRateLimitMap();
  if (req.method === "OPTIONS") return new Response(null, { headers: corsHeaders });

  try {
    let rawBody: unknown;
    try { rawBody = await req.json(); } catch {
      return new Response(JSON.stringify({ error: "Ungültiges Anfrageformat" }),
        { status: 400, headers: { "Content-Type": "application/json", ...corsHeaders } });
    }

    const parseResult = verificationRequestSchema.safeParse(rawBody);
    if (!parseResult.success) {
      const firstError = parseResult.error.errors[0]?.message || "Ungültige Eingabe";
      return new Response(JSON.stringify({ error: firstError }),
        { status: 400, headers: { "Content-Type": "application/json", ...corsHeaders } });
    }

    const { email, type, password, userId: providedUserId } = parseResult.data;

    const rateLimitKey = `${email}:${type}`;
    if (!checkRateLimit(rateLimitKey)) {
      return new Response(JSON.stringify({ error: "Zu viele Anfragen. Bitte warten Sie 15 Minuten." }),
        { status: 429, headers: { "Content-Type": "application/json", ...corsHeaders } });
    }

    const supabaseUrl = Deno.env.get("SUPABASE_URL")!;
    const supabaseServiceKey = Deno.env.get("SUPABASE_SERVICE_ROLE_KEY")!;
    const supabase = createClient(supabaseUrl, supabaseServiceKey);

    const { data: profile, error: profileError } = await supabase
      .from("profiles").select("user_id").eq("email", email).maybeSingle();

    if (profileError) { console.error("profile lookup error:", profileError); throw new Error("User verification failed"); }

    const existingUserId = profile?.user_id || null;
    let userId: string;

    if (type === "login") {
      userId = providedUserId || existingUserId || "";
      if (!userId) {
        return new Response(JSON.stringify({ error: "Benutzer nicht gefunden. Bitte registrieren Sie sich zuerst." }),
          { status: 404, headers: { "Content-Type": "application/json", ...corsHeaders } });
      }
    } else if (type === "registration") {
      if (existingUserId) {
        return new Response(JSON.stringify({ error: "Diese E-Mail-Adresse ist bereits registriert." }),
          { status: 409, headers: { "Content-Type": "application/json", ...corsHeaders } });
      }
      if (!password || password.length < 8) {
        return new Response(JSON.stringify({ error: "Passwort muss mindestens 8 Zeichen lang sein" }),
          { status: 400, headers: { "Content-Type": "application/json", ...corsHeaders } });
      }
      const { data: created, error: createError } = await supabase.auth.admin.createUser({
        email, password, email_confirm: false,
      });
      if (createError || !created?.user?.id) {
        if (createError?.message?.toLowerCase().includes("already") || createError?.message?.toLowerCase().includes("registered")) {
          return new Response(JSON.stringify({ error: "Diese E-Mail-Adresse ist bereits registriert." }),
            { status: 409, headers: { "Content-Type": "application/json", ...corsHeaders } });
        }
        throw new Error("Registration failed");
      }
      userId = created.user.id;
    } else if (type === "password_reset") {
      if (!existingUserId) {
        return new Response(JSON.stringify({ success: true, message: "Falls ein Konto existiert, wurde ein Code gesendet." }),
          { status: 200, headers: { "Content-Type": "application/json", ...corsHeaders } });
      }
      userId = existingUserId;
    } else {
      throw new Error("Invalid request type");
    }

    const code = generateCode();
    const expiresAt = new Date(Date.now() + 10 * 60 * 1000);

    await supabase.from("verification_codes").delete()
      .eq("user_id", userId).eq("type", type).eq("used", false);

    const { error: insertError } = await supabase.from("verification_codes").insert({
      user_id: userId, code, type, expires_at: expiresAt.toISOString(),
    });
    if (insertError) throw insertError;

    await sendVerificationEmail(email, code, type);

    return new Response(JSON.stringify({ success: true, message: "Bestätigungscode wurde gesendet", userId }),
      { status: 200, headers: { "Content-Type": "application/json", ...corsHeaders } });
  } catch (error: unknown) {
    console.error("Error requesting verification code:", error);
    return new Response(JSON.stringify({ error: "Ein Fehler ist aufgetreten. Bitte versuchen Sie es später erneut." }),
      { status: 500, headers: { "Content-Type": "application/json", ...corsHeaders } });
  }
};

serve(handler);
```

## supabase/functions/verify-code/index.ts

_Complete source: see `supabase/functions/verify-code/index.ts` (324 lines)_

**Key logic:**
1. Validates 6-digit code against DB (user_id, type, used=false, not expired)
2. Rate limits: 10 attempts per hour per email
3. **Registration:** Confirms email via `admin.updateUserById({ email_confirm: true })`
4. **Login:** Generates magic link via `admin.generateLink({ type: "magiclink" })`, returns `hashed_token`
5. **Password Reset:** Updates password via `admin.updateUserById({ password })`

## supabase/functions/submit-anamnesis/index.ts

_Complete source: see `supabase/functions/submit-anamnesis/index.ts` (555 lines)_

**Key logic:**
1. **"submit" action:** Saves form data to `anamnesis_submissions`, generates 6-digit code, sends code email via PHP relay
2. **"confirm" action:** Verifies code, marks submission as `verified`, adds digital signature metadata (§ 126a BGB), sends PDF via email to both patient and practice
3. Supports unauthenticated submissions via `tempUserId`
4. PDF attachment with fallback (sends without PDF if relay fails with attachment)
5. RFC 2047 subject encoding for UTF-8 umlauts
