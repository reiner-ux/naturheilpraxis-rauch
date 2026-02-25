# Naturheilpraxis Peter Rauch – Projektdokumentation

**Stand:** 25.02.2026
**Version:** 1.1.0 (Produktiv – SMTP Mail-Relay V3)

## 1. Projektübersicht
Diese Anwendung ist eine digitale Patienten-Plattform für die Naturheilpraxis Peter Rauch. Sie ermöglicht Patienten die sichere Übermittlung von Anamnese-Daten, die Durchführung von Analysen (IAA) und die Verwaltung ihrer Stammdaten.

## 2. Architektur
- **Frontend:** Single Page Application (SPA) mit React & Vite
- **Styling:** Tailwind CSS mit Shadcn/UI Komponenten
- **Backend:** Lovable Cloud (PostgreSQL, Auth, Edge Functions)
- **Mail:** PHP Mail-Relay V3 (SMTP Auth) auf rauch-heilpraktiker.de
- **Sicherheit:** Row Level Security (RLS), 2-Faktor-Authentifizierung für Signaturen

## 3. Hauptfunktionen
1. **Anamnesebogen:** 25-teiliger Fragebogen mit Wizard/Accordion-Ansicht und PDF-Export.
2. **IAA-Analyse:** Spezialisierter Fragebogen für Trikombin-Geräte.
3. **Erstanmeldung:** Geführter Prozess inkl. Datenschutz & Patientenaufklärung.
4. **Authentifizierung:** E-Mail-Login mit 2FA, Registrierung und Passwort-Reset.
5. **Admin-Dashboard:** Verwaltung von FAQs, Praxis-Infos und Preisen.
6. **E-Mail-System:** Automatischer Versand von Bestätigungscodes und PDF-Anhängen.

## 4. Wichtige Dateipfade
- `src/lib/anamneseFormData.ts`: Datenmodell des Anamnesebogens
- `src/lib/iaaQuestions.ts`: Fragenkatalog IAA
- `supabase/functions/`: Backend-Logik (4 Edge Functions + 1 Shared Module)
- `supabase/functions/_shared/smtp.ts`: E-Mail-Versand via PHP-Relay
- `docs/mail-relay-v3-smtp.php`: PHP-Relay Quellcode (auf Server kopieren)
- `src/pages/`: Hauptansichten der App (18 Seiten)

## 5. E-Mail-Infrastruktur
```
Edge Function → HTTPS POST → mail-relay.php → SMTP Auth (Port 587) → Empfänger
                (X-Relay-Token)                (STARTTLS)
```

*Weitere Details siehe `docs/FULL-PROJECT-RESTORE-2026-02-25.md` für technische Wiederherstellung.*
