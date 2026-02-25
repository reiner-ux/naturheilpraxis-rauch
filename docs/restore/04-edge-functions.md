# Restore Part 4: Edge Functions (Complete Source)

**Date:** 2026-02-25

## Übersicht

| Function | Status | Mail-Methode |
|----------|--------|-------------|
| `request-verification-code` | ✅ Aktiv | `_shared/smtp.ts` → PHP Relay |
| `verify-code` | ✅ Aktiv | Kein E-Mail-Versand |
| `submit-anamnesis` | ✅ Aktiv | `_shared/smtp.ts` → PHP Relay (mit PDF) |
| `send-verification-email` | ⚠️ Legacy | Direkter SMTP via denomailer (nicht aktiv genutzt) |

---

## supabase/functions/_shared/smtp.ts (NEU 2026-02-25)

Shared E-Mail-Utility, das alle Edge Functions verwenden.

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
    if (attachment) {
      console.warn("[relay] Failed with attachment, retrying without.");
      return sendEmail({
        ...options,
        html: html + '\n<p style="color:#999;font-size:11px;">⚠️ Hinweis: Der PDF-Anhang konnte aus technischen Gründen nicht beigefügt werden.</p>',
        attachment: undefined,
      });
    }
    throw new Error(`Email delivery failed (relay status ${resp.status})`);
  }

  let result;
  try {
    result = JSON.parse(text);
  } catch {
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

## supabase/functions/request-verification-code/index.ts

**317 Zeilen** – Vollständiger Quellcode im Repo.

**Änderungen 2026-02-25:**
- Nutzt `import { sendEmail } from "../_shared/smtp.ts"` statt direktem Relay-Aufruf
- Ghost-User Cleanup bei Registrierung (unbestätigte Accounts werden gelöscht und neu erstellt)
- Unterstützt `password_reset` Typ

**Key Logic:**
1. Zod-Validierung der Eingabe (email, type, password?, userId?)
2. Rate Limiting: 5 Anfragen pro 15 Min pro Email+Typ
3. **registration:** Prüft ob E-Mail existiert, löscht unbestätigte Ghost-User, erstellt neuen User via `auth.admin.createUser`
4. **login:** Prüft ob User existiert, sendet 2FA Code
5. **password_reset:** Sendet Code falls Account existiert (gibt keinen Fehler bei unbekannter E-Mail)
6. Generiert 6-stelligen Code, speichert in `verification_codes`, sendet via `sendEmail()`

---

## supabase/functions/verify-code/index.ts

**324 Zeilen** – Vollständiger Quellcode im Repo.

**Key Logic:**
1. Zod-Validierung (email, code, type, password?, newPassword?)
2. Rate Limiting: 10 Versuche pro Stunde pro Email
3. **registration:** Verifiziert Code → `admin.updateUserById({ email_confirm: true })`
4. **login:** Verifiziert Code → `admin.generateLink({ type: "magiclink" })` → gibt `hashed_token` zurück
5. **password_reset:** Verifiziert Code → `admin.updateUserById({ password: newPassword })`

---

## supabase/functions/submit-anamnesis/index.ts

**465 Zeilen** – Vollständiger Quellcode im Repo.

**Änderungen 2026-02-25:**
- Nutzt `import { sendEmail } from "../_shared/smtp.ts"`
- Sendet PDF-Anhang an **beide** Praxis-E-Mail-Adressen + Patient

**Key Logic:**

### Action: `submit`
1. Validiert Formulardaten
2. Speichert/aktualisiert `anamnesis_submissions` (Status: `pending_verification`)
3. Generiert 6-stelligen Code, speichert in `verification_codes` (Typ: `anamnesis`)
4. Sendet Code-E-Mail via `sendEmail()`
5. Gibt `submissionId` + `tempUserId` zurück

### Action: `confirm`
1. Verifiziert Code gegen DB
2. Markiert Code als used
3. Aktualisiert Submission-Status auf `verified` mit digitaler Signatur-Metadaten:
   ```json
   { "verified_at": "ISO-Date", "method": "email_2fa", "legal_basis": "§ 126a BGB" }
   ```
4. Sendet 3 E-Mails:
   - `info@rauch-heilpraktiker.de` → Mit PDF-Anhang
   - `praxis_rauch@icloud.com` → Mit PDF-Anhang
   - Patient → Bestätigung mit PDF-Anhang

---

## supabase/functions/send-verification-email/index.ts (LEGACY)

**127 Zeilen** – Nutzt `denomailer` für direkten SMTP-Versand.

⚠️ **Wird nicht mehr aktiv genutzt.** War der ursprüngliche E-Mail-Versand-Mechanismus. 
Ersetzt durch `_shared/smtp.ts` (PHP-Relay).

Benötigte Secrets (falls reaktiviert): `SMTP_HOST`, `SMTP_PORT`, `SMTP_USER`, `SMTP_PASSWORD`
