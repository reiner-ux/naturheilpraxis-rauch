# Naturheilpraxis Peter Rauch – Wiederherstellungspunkt

**Stand:** 06.03.2026
**Version:** 1.2.0

## Zusammenfassung der Änderungen seit letztem Restore-Point (04.03.2026)

### Fixes
1. **Zahnbogen (DentalChart) – White-Screen-Crash behoben:**
   - Ursache: Radix UI Checkbox mit leerem `onCheckedChange`-Handler bei kontrolliertem `checked`-State verursachte internen Konflikt
   - Lösung: Checkbox `onCheckedChange` übernimmt jetzt die Diagnose-Toggling-Logik direkt. Parent `<div>` durch `<label>` ersetzt, `onClick`/`stopPropagation`-Workaround entfernt
   - Datei: `src/components/anamnese/shared/DentalChart.tsx`

2. **Test-Button entfernt:**
   - "🧪 Test"-Link aus Header-Navigation entfernt (Admin-Button reicht aus)
   - Datei: `src/components/layout/Header.tsx`

### Neue Inhalte
3. **Vieva Pro Vitalanalyse:**
   - HTML-Präsentation unter `public/vieva-pro-vitalanalyse.html` hinzugefügt
   - In Infothek-Dropdown unter "Wissen & Therapie" eingeordnet
   - Datei: `src/components/layout/InfothekDropdown.tsx`

### Bekannte Offene Punkte
- **E-Mail-Routing:** Alle Praxis-Mails landen in `info@` statt in den jeweiligen Ziel-Postfächern (`anamnese@`, `iaa@`). Der Code sendet korrekt an die richtigen Adressen. Das Problem liegt auf dem **Plesk-Mailserver**: Die Adressen `anamnese@rauch-heilpraktiker.de` und `iaa@rauch-heilpraktiker.de` müssen als **eigenständige Postfächer** konfiguriert sein (nicht als Alias/Weiterleitung zu `info@`). Alternativ Catch-All-Regel prüfen.

## Aktive Dateien (Kernkomponenten)

### Edge Functions
- `supabase/functions/submit-anamnesis/index.ts` (656 Zeilen) – Anamnese-Einreichung + ICD-10 + E-Mail-Versand
- `supabase/functions/_shared/smtp.ts` – PHP-Relay E-Mail-Client
- `supabase/functions/generate-icd10/index.ts` – ICD-10 Einzelgenerierung
- `supabase/functions/get-patients/index.ts` – Patientenliste (Admin)
- `supabase/functions/request-verification-code/index.ts` – Verifikationscode anfordern
- `supabase/functions/resend-submission/index.ts` – Erneuter Versand
- `supabase/functions/send-icd10-report/index.ts` – ICD-10 Report per E-Mail
- `supabase/functions/send-verification-email/index.ts` – Verifikations-E-Mail
- `supabase/functions/verify-code/index.ts` – Code-Verifizierung

### Frontend-Kern
- `src/pages/Anamnesebogen.tsx` – Hauptformular
- `src/components/anamnese/DentalSection.tsx` – Zahngesundheit
- `src/components/anamnese/shared/DentalChart.tsx` – Interaktives Zahnschema (FDI)
- `src/components/layout/Header.tsx` – Navigation
- `src/components/layout/InfothekDropdown.tsx` – Infothek-Menü

### Infrastruktur
- `docs/mail-relay-v3-smtp.php` – PHP Mail-Relay Quellcode (Server-Kopie)
- Mail-Relay Version: 2026-02-26-v3.2-qmail-tlsfix

## Datenbank-Schema
Unverändert seit 04.03.2026. Siehe `docs/FULL-PROJECT-RESTORE-2026-03-04-v2.md`.
