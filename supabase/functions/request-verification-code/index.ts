import { serve } from "https://deno.land/std@0.190.0/http/server.ts";
import { createClient } from "https://esm.sh/@supabase/supabase-js@2";
import { SMTPClient } from "https://deno.land/x/denomailer@1.6.0/mod.ts";

const corsHeaders = {
  "Access-Control-Allow-Origin": "*",
  "Access-Control-Allow-Headers": "authorization, x-client-info, apikey, content-type",
};

interface VerificationRequest {
  email: string;
  type: "login" | "registration" | "password_reset";
  userId?: string; // For 2FA after password auth
}

function generateCode(): string {
  return Math.floor(100000 + Math.random() * 900000).toString();
}

async function sendVerificationEmail(email: string, code: string, type: "login" | "registration" | "password_reset"): Promise<void> {
  const smtpHost = Deno.env.get("SMTP_HOST");
  const smtpPort = parseInt(Deno.env.get("SMTP_PORT") || "587");
  const smtpUser = Deno.env.get("SMTP_USER");
  const smtpPassword = Deno.env.get("SMTP_PASSWORD");

  if (!smtpHost || !smtpUser || !smtpPassword) {
    throw new Error("SMTP configuration is incomplete");
  }

  const client = new SMTPClient({
    connection: {
      hostname: smtpHost,
      port: 587,
      tls: false,
      auth: {
        username: smtpUser,
        password: smtpPassword,
      },
    },
    debug: {
      log: true,
      allowUnsecure: true,
    },
  });

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

  await client.send({
    from: "info@rauch-heilpraktiker.de",
    to: email,
    subject: subject,
    content: "auto",
    html: htmlContent,
  });

  await client.close();
}

const handler = async (req: Request): Promise<Response> => {
  if (req.method === "OPTIONS") {
    return new Response(null, { headers: corsHeaders });
  }

  try {
    const { email, type, userId: providedUserId }: VerificationRequest = await req.json();

    if (!email) {
      throw new Error("Email is required");
    }

    const supabaseUrl = Deno.env.get("SUPABASE_URL")!;
    const supabaseServiceKey = Deno.env.get("SUPABASE_SERVICE_ROLE_KEY")!;
    const supabase = createClient(supabaseUrl, supabaseServiceKey);

    // Check if user exists
    const { data: usersData } = await supabase.auth.admin.listUsers();
    const existingUser = usersData?.users?.find(u => u.email === email);

    let userId: string;

    if (type === "login") {
      // For login 2FA, user must exist and userId should be provided
      if (!existingUser) {
        return new Response(
          JSON.stringify({ error: "Benutzer nicht gefunden. Bitte registrieren Sie sich zuerst." }),
          { status: 404, headers: { "Content-Type": "application/json", ...corsHeaders } }
        );
      }
      userId = providedUserId || existingUser.id;
    } else if (type === "registration") {
      // For registration, user must NOT exist
      if (existingUser) {
        return new Response(
          JSON.stringify({ error: "Diese E-Mail-Adresse ist bereits registriert." }),
          { status: 409, headers: { "Content-Type": "application/json", ...corsHeaders } }
        );
      }
      // Don't create user yet - just return success so frontend can collect password
      // User will be created after password is set and code is verified
      userId = "pending"; // Placeholder for registration flow
    } else if (type === "password_reset") {
      // For password reset, user must exist
      if (!existingUser) {
        // Don't reveal if email exists or not for security
        return new Response(
          JSON.stringify({ success: true, message: "Falls ein Konto existiert, wurde ein Code gesendet." }),
          { status: 200, headers: { "Content-Type": "application/json", ...corsHeaders } }
        );
      }
      userId = existingUser.id;
    } else {
      throw new Error("Invalid type");
    }

    // Generate 6-digit code
    const code = generateCode();
    const expiresAt = new Date(Date.now() + 10 * 60 * 1000); // 10 minutes

    // For registration, we store the code with email as identifier (no user yet)
    if (type === "registration") {
      // Delete any existing pending registration codes for this email
      await supabase
        .from("verification_codes")
        .delete()
        .eq("type", "registration")
        .eq("used", false);
      
      // Store code with a special pending user ID format
      const { error: insertError } = await supabase
        .from("verification_codes")
        .insert({
          user_id: crypto.randomUUID(), // Temporary ID
          code,
          type,
          expires_at: expiresAt.toISOString(),
        });

      if (insertError) {
        throw insertError;
      }

      // Store the email-to-code mapping in the code itself via a workaround
      // We'll use the type field to store email temporarily
      await supabase
        .from("verification_codes")
        .update({ type: `registration:${email}` })
        .eq("code", code)
        .eq("type", "registration");

    } else {
      // For login and password_reset, user exists
      await supabase
        .from("verification_codes")
        .delete()
        .eq("user_id", userId)
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
        throw insertError;
      }
    }

    // Send verification email
    await sendVerificationEmail(email, code, type);

    console.log(`Verification code sent to ${email} for ${type}`);

    return new Response(
      JSON.stringify({ 
        success: true, 
        message: "Bestätigungscode wurde gesendet",
        userId: type !== "registration" ? userId : undefined
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
