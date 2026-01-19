import { serve } from "https://deno.land/std@0.190.0/http/server.ts";
import { createClient } from "https://esm.sh/@supabase/supabase-js@2";

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

    // Send email via the send-verification-email function
    const emailFunctionUrl = `${supabaseUrl}/functions/v1/send-verification-email`;
    const emailResponse = await fetch(emailFunctionUrl, {
      method: "POST",
      headers: {
        "Content-Type": "application/json",
        "Authorization": `Bearer ${supabaseServiceKey}`,
      },
      body: JSON.stringify({ email, code, type }),
    });

    if (!emailResponse.ok) {
      const errorData = await emailResponse.json();
      throw new Error(errorData.error || "Failed to send email");
    }

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
