# Naturheilpraxis Peter Rauch – Complete Project Restore Point

**Date:** 2026-02-22
**Project:** Patient App & Practice Management System

## Restore-Dokumentation (aufgeteilt in 5 Teile)

Aufgrund von Dateigrößen-Limitierungen ist die vollständige Dokumentation in einzelne Dateien aufgeteilt:

| Teil | Datei | Inhalt |
|------|-------|--------|
| 1 | [01-overview-and-config.md](restore/01-overview-and-config.md) | Tech Stack, ENV, Dependencies, Configs |
| 2 | [02-database-schema.md](restore/02-database-schema.md) | Alle Tabellen, Enums, RLS Policies, Functions |
| 3 | [03-frontend-core.md](restore/03-frontend-core.md) | App.tsx, AuthContext, ProtectedRoute, LanguageContext, File Structure |
| 4 | [04-edge-functions.md](restore/04-edge-functions.md) | request-verification-code, verify-code, submit-anamnesis (komplett) |
| 5 | [05-styling-and-design.md](restore/05-styling-and-design.md) | index.css, tailwind.config.ts, Design System (komplett) |

## Zusätzliche Dokumentation im Projekt

- `docs/PROJECT-DOCUMENTATION.md` – Projektübersicht (deutsch)
- `docs/design-specification.md` – Design-Spezifikation
- `docs/mail-relay-v2.php` – PHP Mail-Relay Quellcode (liegt auf Server)
- `supabase/functions/` – Edge Functions Quellcode (wird automatisch deployed)

## Schnelle Wiederherstellung

1. **Datenbank:** SQL aus `02-database-schema.md` ausführen
2. **Edge Functions:** Dateien in `supabase/functions/` sind im Repo
3. **Frontend:** `npm install && npm run build`
4. **Secrets:** RELAY_SECRET und SUPABASE_SERVICE_ROLE_KEY setzen
5. **Mail-Relay:** `docs/mail-relay-v2.php` auf Server kopieren nach `/var/www/vhosts/rauch-heilpraktiker.de/httpdocs/mail-relay.php`

## GitHub-Verbindung (empfohlen)

Für einen vollständigen Download aller Dateien:
1. Klicke auf den **Projektnamen** (oben links)
2. → **Settings** → **GitHub** → **Connect project**
3. Nach dem Verbinden: `git clone <repo-url>`
