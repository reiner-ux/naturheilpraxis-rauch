import { serve } from "https://deno.land/std@0.190.0/http/server.ts";
import { createClient } from "https://esm.sh/@supabase/supabase-js@2";

const corsHeaders = {
  "Access-Control-Allow-Origin": "*",
  "Access-Control-Allow-Headers": "authorization, x-client-info, apikey, content-type",
};

interface VerifyCodeRequest {
  email: string;
  code: string;
  type: "login" | "registration";
}

const handler = async (req: Request): Promise<Response> => {
  if (req.method === "OPTIONS") {
    return new Response(null, { headers: corsHeaders });
  }

  try {
    const { email, code, type }: VerifyCodeRequest = await req.json();

    if (!email || !code) {
      throw new Error("Email and code are required");
    }

    const supabaseUrl = Deno.env.get("SUPABASE_URL")!;
    const supabaseServiceKey = Deno.env.get("SUPABASE_SERVICE_ROLE_KEY")!;
    const supabase = createClient(supabaseUrl, supabaseServiceKey);

    // Get user by email using listUsers
    const { data: usersData } = await supabase.auth.admin.listUsers();
    const userData = usersData?.users?.find(u => u.email === email);
    
    if (!userData) {
      return new Response(
        JSON.stringify({ error: "Benutzer nicht gefunden" }),
        {
          status: 404,
          headers: { "Content-Type": "application/json", ...corsHeaders },
        }
      );
    }

    const userId = userData.id;

    // Find valid verification code
    const { data: verificationCode, error: codeError } = await supabase
      .from("verification_codes")
      .select("*")
      .eq("user_id", userId)
      .eq("code", code)
      .eq("type", type)
      .eq("used", false)
      .gt("expires_at", new Date().toISOString())
      .single();

    if (codeError || !verificationCode) {
      return new Response(
        JSON.stringify({ error: "Ungültiger oder abgelaufener Code" }),
        {
          status: 400,
          headers: { "Content-Type": "application/json", ...corsHeaders },
        }
      );
    }

    // Mark code as used
    await supabase
      .from("verification_codes")
      .update({ used: true })
      .eq("id", verificationCode.id);

    // For registration, confirm the email
    if (type === "registration") {
      await supabase.auth.admin.updateUserById(userId, {
        email_confirm: true,
      });
    }

    // Generate a magic link for passwordless sign-in
    const { data: linkData, error: linkError } = await supabase.auth.admin.generateLink({
      type: "magiclink",
      email,
    });

    if (linkError) {
      throw linkError;
    }

    // Extract the token from the link
    const token = linkData.properties.hashed_token;

    console.log(`Code verified successfully for ${email}`);

    return new Response(
      JSON.stringify({ 
        success: true, 
        message: "Code erfolgreich verifiziert",
        token,
        userId
      }),
      {
        status: 200,
        headers: { "Content-Type": "application/json", ...corsHeaders },
      }
    );
  } catch (error: any) {
    console.error("Error verifying code:", error);
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
