# Full Project Restore – 2026-03-11

## Status
- PDF-Speicherungsbug behoben (await statt fire-and-forget)
- Temporal-Validierung (Enddatum ≥ Startdatum) implementiert
- Unterschriftsdatum readOnly auf heute fixiert
- 4 Sicherheits-/Qualitätsempfehlungen werden implementiert

## Kritische Edge Functions

### supabase/functions/_shared/smtp.ts
- PHP-Relay basierter E-Mail-Versand (v3.6)
- CRLF-Zeilenenden für QMail-Kompatibilität
- Fallback: Sendet ohne Anhang bei Fehler
- RFC 2047 Encoding für UTF-8 Subjects

### supabase/functions/submit-anamnesis/index.ts (700 Zeilen)
- Zod-validierte Eingaben
- 2FA-Verifizierung (6-stelliger OTP, 10 Min)
- Rate-Limiting (5 Submits/15 Min, 10 Verifies/60 Min)
- ICD-10 Generierung (feste Mappings + Gemini AI)
- 3 PDF-Versionen: Praxis-komplett, Patient-ohne-IAA, IAA-separat
- PDF-Storage in `anamnesis-pdfs` Bucket (JETZT mit await)
- E-Mail-Routing: anamnese@, iaa@, Patient

### supabase/functions/resend-submission/index.ts (440 Zeilen)
- Admin-Auth-Check via has_role RPC
- Holt gespeicherte PDFs aus Storage
- Regeneriert ICD-10 Codes
- Sendet alle 3 E-Mails erneut

### supabase/functions/get-patients/index.ts
- Service-Role-Key für RLS-Bypass
- Aggregiert Profiles + Login-Counts + Submissions

## Frontend-Kernkomponenten

### src/pages/Anamnesebogen.tsx (1005 Zeilen)
- Wizard + Accordion Layout-Auswahl
- 25 Sektionen, geschlechtsbasierte Filterung
- Draft-Autosave (LocalStorage + E-Mail-Cache)
- PDF-Generierung im Browser vor Absenden
- VerificationDialog für 2FA

### src/components/anamnese/SignatureSection.tsx (437 Zeilen)
- Auto-Datum (readOnly, heute)
- Auto-Ort aus Kontaktdaten
- Minderjährigen-Logik (Sorgeberechtigter)
- DSGVO-Einwilligung + Patientenaufklärung

### src/components/anamnese/shared/TemporalStatusSelect.tsx
- Seit/Bis Validierung (Enddatum ≥ Startdatum)
- Visueller Fehlerhinweis

### src/components/layout/Header.tsx (268 Zeilen)
- Dev-Admin-Bypass (nur Nicht-Produktion)
- SessionStorage-basierter Bypass-Status
- Admin-Navigation (Dashboard, Patienten)

### src/components/ProtectedRoute.tsx
- Dev-Bypass via ?dev=true (nur Nicht-Produktion)

## Datenbank-Schema
- profiles, user_roles, verification_codes
- anamnesis_submissions, iaa_submissions
- audit_log, faqs, practice_info, practice_pricing
- Storage Bucket: anamnesis-pdfs (privat)

## Konfiguration
- config.toml: verify_jwt=false für alle Functions
- Secrets: RELAY_SECRET, SMTP_*, LOVABLE_API_KEY
- E-Mail-Relay: rauch-heilpraktiker.de/mail-relay.php
