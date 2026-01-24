import { serve } from "https://deno.land/std@0.190.0/http/server.ts";
import { createClient } from "https://esm.sh/@supabase/supabase-js@2";

const corsHeaders = {
  "Access-Control-Allow-Origin": "*",
  "Access-Control-Allow-Headers": "authorization, x-client-info, apikey, content-type",
};

interface VerificationRequest {
  email: string;
  type: "login" | "registration" | "password_reset";
  /** Only required for registration */
  password?: string;
  /** For login 2FA after password auth */
  userId?: string;
}


function generateCode(): string {
  return Math.floor(100000 + Math.random() * 900000).toString();
}

async function sendVerificationEmail(email: string, code: string, type: "login" | "registration" | "password_reset"): Promise<void> {
  const relaySecret = Deno.env.get("RELAY_SECRET");
  if (!relaySecret) {
    throw new Error("RELAY_SECRET is not configured");
  }

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

  // Call the HTTPS relay endpoint on the user's server
  const relayUrl = "https://rauch-heilpraktiker.de/api/send-email.php";
  
  const response = await fetch(relayUrl, {
    method: "POST",
    headers: {
      "Content-Type": "application/json",
      "X-Relay-Token": relaySecret,
    },
    body: JSON.stringify({
      to: email,
      subject: subject,
      html: htmlContent,
      from: "info@rauch-heilpraktiker.de",
    }),
  });

  const responseText = await response.text();
  
  // Check if response is HTML (error page) instead of JSON
  if (responseText.trim().startsWith("<!DOCTYPE") || responseText.trim().startsWith("<html")) {
    console.error("Relay returned HTML instead of JSON - likely 404 or server error");
    throw new Error("Email relay endpoint not found. Please install the PHP script on your server.");
  }

  if (!response.ok) {
    console.error("Relay error:", response.status, responseText);
    throw new Error(`Email relay failed: ${response.status}`);
  }

  let result;
  try {
    result = JSON.parse(responseText);
  } catch (parseError) {
    console.error("Failed to parse relay response:", responseText);
    throw new Error("Invalid response from email relay");
  }
  
  if (!result.success) {
    throw new Error(result.error || "Email relay returned failure");
  }

  console.log(`Email sent via relay to ${email}`);
}

const handler = async (req: Request): Promise<Response> => {
  if (req.method === "OPTIONS") {
    return new Response(null, { headers: corsHeaders });
  }

  try {
    const {
      email: rawEmail,
      type,
      password,
      userId: providedUserId,
    }: VerificationRequest = await req.json();

    const email = (rawEmail || "").trim().toLowerCase();

    if (!email) {
      throw new Error("Email is required");
    }

    const supabaseUrl = Deno.env.get("SUPABASE_URL")!;
    const supabaseServiceKey = Deno.env.get("SUPABASE_SERVICE_ROLE_KEY")!;
    const supabase = createClient(supabaseUrl, supabaseServiceKey);

    // Resolve userId by email using the profiles table (avoids unreliable listUsers scanning)
    const { data: profile, error: profileError } = await supabase
      .from("profiles")
      .select("user_id")
      .eq("email", email)
      .maybeSingle();

    if (profileError) {
      console.error("profile lookup error:", profileError);
      throw new Error("Benutzerprüfung fehlgeschlagen");
    }

    const existingUserId = profile?.user_id || null;

    let userId: string;

    if (type === "login") {
      // After password sign-in, frontend should provide the userId; fallback to profile lookup.
      userId = providedUserId || existingUserId || "";
      if (!userId) {
        return new Response(
          JSON.stringify({ error: "Benutzer nicht gefunden. Bitte registrieren Sie sich zuerst." }),
          { status: 404, headers: { "Content-Type": "application/json", ...corsHeaders } }
        );
      }
    } else if (type === "registration") {
      if (existingUserId) {
        return new Response(
          JSON.stringify({ error: "Diese E-Mail-Adresse ist bereits registriert." }),
          { status: 409, headers: { "Content-Type": "application/json", ...corsHeaders } }
        );
      }

      if (!password || password.length < 8) {
        return new Response(
          JSON.stringify({ error: "Passwort muss mindestens 8 Zeichen lang sein" }),
          { status: 400, headers: { "Content-Type": "application/json", ...corsHeaders } }
        );
      }

      // Create user now (unconfirmed), then verify via code.
      const { data: created, error: createError } = await supabase.auth.admin.createUser({
        email,
        password,
        email_confirm: false,
      });

      if (createError || !created?.user?.id) {
        console.error("createUser error:", createError);
        const msg = createError?.message || "Registrierung fehlgeschlagen";
        if (msg.toLowerCase().includes("already") || msg.toLowerCase().includes("registered")) {
          return new Response(
            JSON.stringify({ error: "Diese E-Mail-Adresse ist bereits registriert." }),
            { status: 409, headers: { "Content-Type": "application/json", ...corsHeaders } }
          );
        }
        throw new Error(msg);
      }

      userId = created.user.id;
    } else if (type === "password_reset") {
      if (!existingUserId) {
        // Don't reveal if email exists or not for security
        return new Response(
          JSON.stringify({ success: true, message: "Falls ein Konto existiert, wurde ein Code gesendet." }),
          { status: 200, headers: { "Content-Type": "application/json", ...corsHeaders } }
        );
      }
      userId = existingUserId;
    } else {
      throw new Error("Invalid type");
    }

    // Generate 6-digit code
    const code = generateCode();
    const expiresAt = new Date(Date.now() + 10 * 60 * 1000); // 10 minutes

    // Delete old unused codes for this user + type
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

    // Send verification email
    await sendVerificationEmail(email, code, type);

    console.log(`Verification code sent to ${email} for ${type}`);

    return new Response(
      JSON.stringify({
        success: true,
        message: "Bestätigungscode wurde gesendet",
        userId,
      }),
      { status: 200, headers: { "Content-Type": "application/json", ...corsHeaders } }
    );
  } catch (error: any) {
    console.error("Error requesting verification code:", error);
    return new Response(
      JSON.stringify({ error: error.message }),
      { status: 500, headers: { "Content-Type": "application/json", ...corsHeaders } }
    );
  }
};

serve(handler);
