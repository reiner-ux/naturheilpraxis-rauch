import { serve } from "https://deno.land/std@0.190.0/http/server.ts";
import { createClient } from "https://esm.sh/@supabase/supabase-js@2";
import { SMTPClient } from "https://deno.land/x/denomailer@1.6.0/mod.ts";

const corsHeaders = {
  "Access-Control-Allow-Origin": "*",
  "Access-Control-Allow-Headers": "authorization, x-client-info, apikey, content-type",
};

interface VerificationRequest {
  email: string;
  type: "login" | "registration";
}

function generateCode(): string {
  return Math.floor(100000 + Math.random() * 900000).toString();
}

async function sendVerificationEmail(email: string, code: string, type: "login" | "registration"): Promise<void> {
  const smtpHost = Deno.env.get("SMTP_HOST");
  const smtpPort = parseInt(Deno.env.get("SMTP_PORT") || "587");
  const smtpUser = Deno.env.get("SMTP_USER");
  const smtpPassword = Deno.env.get("SMTP_PASSWORD");

  if (!smtpHost || !smtpUser || !smtpPassword) {
    throw new Error("SMTP configuration is incomplete");
  }

  // Use STARTTLS on port 587 for better compatibility with shared hosting
  const useTls = smtpPort === 465;
  
  const client = new SMTPClient({
    connection: {
      hostname: smtpHost,
      port: smtpPort,
      tls: useTls,
      auth: {
        username: smtpUser,
        password: smtpPassword,
      },
    },
  });

  const subject = type === "registration" 
    ? "Ihr Bestätigungscode für die Registrierung - Naturheilpraxis Rauch"
    : "Ihr Anmeldecode - Naturheilpraxis Rauch";

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
        
        <p>${type === "registration" 
          ? "vielen Dank für Ihre Registrierung. Bitte verwenden Sie den folgenden Code, um Ihre E-Mail-Adresse zu bestätigen:" 
          : "um Ihre Anmeldung abzuschließen, verwenden Sie bitte den folgenden Bestätigungscode:"}</p>
        
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
    const { email, type }: VerificationRequest = await req.json();

    if (!email) {
      throw new Error("Email is required");
    }

    const supabaseUrl = Deno.env.get("SUPABASE_URL")!;
    const supabaseServiceKey = Deno.env.get("SUPABASE_SERVICE_ROLE_KEY")!;
    const supabase = createClient(supabaseUrl, supabaseServiceKey);

    // Check if user exists using listUsers filter
    const { data: usersData } = await supabase.auth.admin.listUsers();
    const existingUser = usersData?.users?.find(u => u.email === email);

    if (type === "login" && !existingUser) {
      return new Response(
        JSON.stringify({ error: "Benutzer nicht gefunden. Bitte registrieren Sie sich zuerst." }),
        {
          status: 404,
          headers: { "Content-Type": "application/json", ...corsHeaders },
        }
      );
    }

    if (type === "registration" && existingUser) {
      return new Response(
        JSON.stringify({ error: "Diese E-Mail-Adresse ist bereits registriert." }),
        {
          status: 409,
          headers: { "Content-Type": "application/json", ...corsHeaders },
        }
      );
    }

    // Generate 6-digit code
    const code = generateCode();
    const expiresAt = new Date(Date.now() + 10 * 60 * 1000); // 10 minutes

    // For registration, create user first (unconfirmed)
    let userId: string;
    
    if (type === "registration") {
      const tempPassword = crypto.randomUUID();
      const { data: newUser, error: createError } = await supabase.auth.admin.createUser({
        email,
        password: tempPassword,
        email_confirm: false,
      });
      
      if (createError) {
        throw createError;
      }
      
      userId = newUser.user.id;
    } else {
      userId = existingUser!.id;
    }

    // Delete any existing unused codes for this user
    await supabase
      .from("verification_codes")
      .delete()
      .eq("user_id", userId)
      .eq("used", false);

    // Insert new verification code
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

    // Send verification email directly
    await sendVerificationEmail(email, code, type);

    console.log(`Verification code sent to ${email} for ${type}`);

    return new Response(
      JSON.stringify({ 
        success: true, 
        message: "Bestätigungscode wurde gesendet",
        userId 
      }),
      {
        status: 200,
        headers: { "Content-Type": "application/json", ...corsHeaders },
      }
    );
  } catch (error: any) {
    console.error("Error requesting verification code:", error);
    return new Response(
      JSON.stringify({ error: error.message }),
      {
        status: 500,
        headers: { "Content-Type": "application/json", ...corsHeaders },
      }
    );
  }
};

serve(handler);
