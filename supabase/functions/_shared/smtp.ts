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
    subject, // Send subject as plain text (RFC 2047 encoding is done by PHP relay if needed)
    html,
    from,
  };

  if (attachment) {
    payload.attachment = attachment;
  }

  // Delay for local delivery addresses to avoid QMail timeout on same-domain routing
  // Reduced from 60s to 5s to avoid edge function timeouts when sending multiple local emails
  const isLocalDelivery = to.endsWith("@rauch-heilpraktiker.de");
  if (isLocalDelivery) {
    const delaySec = 5;
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
