# Naturheilpraxis Peter Rauch – Projektdokumentation

**Stand:** 22.02.2026
**Version:** 1.0.0 (Produktiv)

## 1. Projektübersicht
Diese Anwendung ist eine digitale Patienten-Plattform für die Naturheilpraxis Peter Rauch. Sie ermöglicht Patienten die sichere Übermittlung von Anamnese-Daten, die Durchführung von Analysen (IAA) und die Verwaltung ihrer Stammdaten.

## 2. Architektur
- **Frontend:** Single Page Application (SPA) mit React & Vite
- **Styling:** Tailwind CSS mit Shadcn/UI Komponenten
- **Backend:** Supabase (PostgreSQL, Auth, Edge Functions)
- **Sicherheit:** Row Level Security (RLS), 2-Faktor-Authentifizierung für Signaturen

## 3. Hauptfunktionen
1. **Anamnesebogen:** 25-teiliger Fragebogen mit Wizard/Accordion-Ansicht und PDF-Export.
2. **IAA-Analyse:** Spezialisierter Fragebogen für Trikombin-Geräte.
3. **Erstanmeldung:** Geführter Prozess inkl. Datenschutz & Patientenaufklärung.
4. **Authentifizierung:** E-Mail-Login mit optionaler 2FA und Passwort-Reset.
5. **Admin-Dashboard:** Verwaltung von FAQs, Praxis-Infos und Preisen.

## 4. Wichtige Dateipfade
- `src/lib/anamneseFormData.ts`: Datenmodell des Anamnesebogens
- `src/lib/iaaQuestions.ts`: Fragenkatalog IAA
- `supabase/functions/`: Backend-Logik für Mails und Verifizierung
- `src/pages/`: Hauptansichten der App

*Weitere Details siehe `docs/FULL-PROJECT-RESTORE-2026-02-22.md` für technische Wiederherstellung.*
