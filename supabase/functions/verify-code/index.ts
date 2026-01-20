import { serve } from "https://deno.land/std@0.190.0/http/server.ts";
import { createClient } from "https://esm.sh/@supabase/supabase-js@2";

const corsHeaders = {
  "Access-Control-Allow-Origin": "*",
  "Access-Control-Allow-Headers": "authorization, x-client-info, apikey, content-type",
};

interface VerifyCodeRequest {
  email: string;
  code: string;
  type: "login" | "registration" | "password_reset";
  password?: string; // Required for registration
  newPassword?: string; // Required for password_reset
}

const handler = async (req: Request): Promise<Response> => {
  if (req.method === "OPTIONS") {
    return new Response(null, { headers: corsHeaders });
  }

  try {
    const { email, code, type, password, newPassword }: VerifyCodeRequest = await req.json();

    if (!email || !code) {
      throw new Error("Email and code are required");
    }

    const supabaseUrl = Deno.env.get("SUPABASE_URL")!;
    const supabaseServiceKey = Deno.env.get("SUPABASE_SERVICE_ROLE_KEY")!;
    const supabase = createClient(supabaseUrl, supabaseServiceKey);

    if (type === "registration") {
      // Resolve userId via profiles table
      const normalizedEmail = email.trim().toLowerCase();
      const { data: profile, error: profileError } = await supabase
        .from("profiles")
        .select("user_id")
        .eq("email", normalizedEmail)
        .maybeSingle();

      if (profileError) {
        console.error("profile lookup error:", profileError);
        throw new Error("Benutzerprüfung fehlgeschlagen");
      }

      if (!profile?.user_id) {
        return new Response(
          JSON.stringify({ error: "Benutzer nicht gefunden" }),
          { status: 404, headers: { "Content-Type": "application/json", ...corsHeaders } }
        );
      }

      // Find valid verification code
      const { data: verificationCode, error: codeError } = await supabase
        .from("verification_codes")
        .select("*")
        .eq("user_id", profile.user_id)
        .eq("code", code)
        .eq("type", "registration")
        .eq("used", false)
        .gt("expires_at", new Date().toISOString())
        .single();

      if (codeError || !verificationCode) {
        return new Response(
          JSON.stringify({ error: "Ungültiger oder abgelaufener Code" }),
          { status: 400, headers: { "Content-Type": "application/json", ...corsHeaders } }
        );
      }

      // Mark code as used
      await supabase
        .from("verification_codes")
        .update({ used: true })
        .eq("id", verificationCode.id);

      // Confirm email
      const { error: confirmError } = await supabase.auth.admin.updateUserById(profile.user_id, {
        email_confirm: true,
      });

      if (confirmError) {
        throw confirmError;
      }

      console.log(`User verified successfully: ${normalizedEmail}`);

      return new Response(
        JSON.stringify({
          success: true,
          message: "Registrierung erfolgreich",
          userId: profile.user_id,
        }),
        { status: 200, headers: { "Content-Type": "application/json", ...corsHeaders } }
      );

    } else if (type === "login") {
      const normalizedEmail = email.trim().toLowerCase();
      const { data: profile, error: profileError } = await supabase
        .from("profiles")
        .select("user_id")
        .eq("email", normalizedEmail)
        .maybeSingle();

      if (profileError) {
        console.error("profile lookup error:", profileError);
        throw new Error("Benutzerprüfung fehlgeschlagen");
      }

      if (!profile?.user_id) {
        return new Response(
          JSON.stringify({ error: "Benutzer nicht gefunden" }),
          { status: 404, headers: { "Content-Type": "application/json", ...corsHeaders } }
        );
      }

      // Find valid verification code
      const { data: verificationCode, error: codeError } = await supabase
        .from("verification_codes")
        .select("*")
        .eq("user_id", profile.user_id)
        .eq("code", code)
        .eq("type", "login")
        .eq("used", false)
        .gt("expires_at", new Date().toISOString())
        .single();

      if (codeError || !verificationCode) {
        return new Response(
          JSON.stringify({ error: "Ungültiger oder abgelaufener Code" }),
          { status: 400, headers: { "Content-Type": "application/json", ...corsHeaders } }
        );
      }

      // Mark code as used
      await supabase
        .from("verification_codes")
        .update({ used: true })
        .eq("id", verificationCode.id);

      // Generate a magic link for sign-in
      const { data: linkData, error: linkError } = await supabase.auth.admin.generateLink({
        type: "magiclink",
        email: normalizedEmail,
      });

      if (linkError) {
        throw linkError;
      }

      const token = linkData.properties.hashed_token;

      console.log(`2FA verified successfully for ${normalizedEmail}`);

      return new Response(
        JSON.stringify({
          success: true,
          message: "2FA erfolgreich verifiziert",
          token,
          userId: profile.user_id,
        }),
        { status: 200, headers: { "Content-Type": "application/json", ...corsHeaders } }
      );

    } else if (type === "password_reset") {
      const normalizedEmail = email.trim().toLowerCase();
      const { data: profile, error: profileError } = await supabase
        .from("profiles")
        .select("user_id")
        .eq("email", normalizedEmail)
        .maybeSingle();

      if (profileError) {
        console.error("profile lookup error:", profileError);
        throw new Error("Benutzerprüfung fehlgeschlagen");
      }

      if (!profile?.user_id) {
        return new Response(
          JSON.stringify({ error: "Benutzer nicht gefunden" }),
          { status: 404, headers: { "Content-Type": "application/json", ...corsHeaders } }
        );
      }

      // Find valid verification code
      const { data: verificationCode, error: codeError } = await supabase
        .from("verification_codes")
        .select("*")
        .eq("user_id", profile.user_id)
        .eq("code", code)
        .eq("type", "password_reset")
        .eq("used", false)
        .gt("expires_at", new Date().toISOString())
        .single();

      if (codeError || !verificationCode) {
        return new Response(
          JSON.stringify({ error: "Ungültiger oder abgelaufener Code" }),
          { status: 400, headers: { "Content-Type": "application/json", ...corsHeaders } }
        );
      }

      if (!newPassword || newPassword.length < 8) {
        return new Response(
          JSON.stringify({ error: "Neues Passwort muss mindestens 8 Zeichen lang sein" }),
          { status: 400, headers: { "Content-Type": "application/json", ...corsHeaders } }
        );
      }

      // Mark code as used
      await supabase
        .from("verification_codes")
        .update({ used: true })
        .eq("id", verificationCode.id);

      // Update password
      const { error: updateError } = await supabase.auth.admin.updateUserById(profile.user_id, {
        password: newPassword,
      });

      if (updateError) {
        throw updateError;
      }

      console.log(`Password reset successfully for ${normalizedEmail}`);

      return new Response(
        JSON.stringify({
          success: true,
          message: "Passwort erfolgreich zurückgesetzt",
        }),
        { status: 200, headers: { "Content-Type": "application/json", ...corsHeaders } }
      );

    } else {
      throw new Error("Invalid type");
    }
  } catch (error: any) {
    console.error("Error verifying code:", error);
    return new Response(
      JSON.stringify({ error: error.message }),
      { status: 500, headers: { "Content-Type": "application/json", ...corsHeaders } }
    );
  }
};

serve(handler);
