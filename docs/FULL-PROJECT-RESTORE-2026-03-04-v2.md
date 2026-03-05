# VOLLSTÄNDIGER WIEDERHERSTELLUNGSPUNKT – 2026-03-04 14:30 UTC (v2)

## Zeitstempel
- **Erstellt:** 2026-03-04T14:30:00Z
- **Anlass:** Vor Implementierung diverser Bugfixes und Validierungsverbesserungen (Punkte a–h)
- **Vorgänger:** docs/FULL-PROJECT-RESTORE-2026-03-04.md

---

## 1. Projektübersicht

### Technologie-Stack
- **Frontend:** React 18.3 + TypeScript + Vite + Tailwind CSS
- **Backend:** Lovable Cloud (Supabase) – Projekt-ID: `jmebqjadlpltnqawoipb`
- **PDF-Engine:** jsPDF 4.0 (clientseitig)
- **E-Mail-Relay:** PHP v3.2 auf `rauch-heilpraktiker.de/mail-relay.php` (Port 587, QMail-optimiert)
- **Auth:** Supabase Auth mit E-Mail-Verifizierung
- **Sprachen:** DE/EN (LanguageContext)

### Datenbank-Tabellen (Stand 2026-03-04)
1. `anamnesis_submissions` – Anamnesebogen-Einreichungen (user_id, form_data JSON, status, signature_data)
2. `audit_log` – DSGVO-Audit-Trail (user_id, action, details JSON)
3. `faqs` – FAQ-Einträge (DE/EN, sortierbar, publishable)
4. `iaa_submissions` – IAA-Fragebogen-Daten (user_id, form_data JSON, appointment_number)
5. `practice_info` – Praxisinformationen (DE/EN, slug, icon, sortierbar)
6. `practice_pricing` – Preisliste (DE/EN, service_key, sortierbar)
7. `profiles` – Benutzerprofile (user_id, email, first/last name, phone, DOB)
8. `user_roles` – Rollen (user_id, role: admin|patient)
9. `verification_codes` – 2FA-Codes (user_id, code, type, expires_at, used)

### Edge Functions (Stand 2026-03-04)
1. `submit-anamnesis` – Haupt-Einreichungsflow (submit + confirm mit 2FA)
2. `send-icd10-report` – ICD-10 PDF per E-Mail an Praxis (Admin-only)
3. `generate-icd10` – KI-basierte ICD-10 Code-Generierung
4. `request-verification-code` – Allg. Verifizierungscode anfordern
5. `send-verification-email` – Verifizierungscode per E-Mail senden
6. `verify-code` – Code verifizieren

### Secrets (konfiguriert)
LOVABLE_API_KEY, SMTP_HOST, SMTP_PORT, SMTP_USER, SMTP_PASSWORD, RELAY_SECRET, SUPABASE_URL, SUPABASE_ANON_KEY, SUPABASE_SERVICE_ROLE_KEY, SUPABASE_DB_URL, SUPABASE_PUBLISHABLE_KEY

---

## 2. Anamnesebogen – Architektur

### 25+1 Sektionen (formSections in anamneseFormData.ts)
0. Willkommen (IntroSection)
1. I. Patientendaten (PatientDataSection) – Personalia, Kontakt, Versicherung, Beruf, Sorgeberechtigter
2. II. Familie (FamilyHistorySection)
3. III. Kopf & Sinne (NeurologySection) – inkl. Schlaf & Psyche
4. IV. Herz & Kreislauf (HeartSection)
5. V. Lunge & Atmung (LungSection)
6. VI. Magen & Darm (DigestiveSection)
7. VII. Leber & Galle (LiverSection)
8. VIII. Niere & Blase (KidneySection)
9. IX. Hormone (HormoneSection)
10. X. Bewegungsapparat (MusculoskeletalSection)
11. XI. Frauengesundheit (WomenHealthSection)
12. XI. Männergesundheit (MensHealthSection)
13. XII. Unfälle & OPs (SurgeriesSection)
14. XIII. Krebs (CancerSection)
15. XIV. Allergien (AllergiesSection)
16. XV. Medikamente (MedicationsSection)
17. XVI. Lebensweise (LifestyleSection)
18. XVII. Zahngesundheit (DentalSection)
19. XVIII. Umwelt (EnvironmentSection)
20. XIX. Infektionen (InfectionsSection)
21. XX. Impfstatus (VaccinationsSection)
22. XXI. Beschwerden (ComplaintsSection)
23. XXII. Präferenzen (PreferencesSection)
24. XXIII. Persönliches (SocialSection)
25. XXIV. IAA-Fragebogen (IAAForm)
26. XXV. Unterschrift (SignatureSection)

### Sorgeberechtigten-Logik (bei Minderjährigen <18)
- **PatientDataSection:** Mutter/Vater-Auswahl, Name, Telefon, E-Mail. Optional: Abweichende Adresse + Festnetz
- **SignatureSection:** Automatische Übernahme des Sorgeberechtigten-Namens, Geburtsdatum-Prüfung ≥18 Jahre

### Validierungsregeln (Stand VOR Änderungen)
- Namensfelder: sanitizeName() – nur Buchstaben (Unicode \p{L}), Leerzeichen, Bindestrich, Apostroph
- Körpergröße: 0–210 cm, Gewicht: 1–200 kg (sanitizeIntInRange)
- E-Mail: Pflichtfeld mit Hervorhebung
- Nachname/Vorname: Pflichtfelder mit Hervorhebung
- Geburtsdatum: Pflichtfeld, keine obere/untere Grenzvalidierung implementiert
- Kontaktdaten (Telefon, Adresse): NICHT als Pflichtfelder deklariert
- Telefonfelder: type="tel" aber KEINE Eingabevalidierung gegen Buchstaben

### PDF-Export (pdfExportEnhanced.ts)
- AnamnesePdfBuilder-Klasse mit rekursivem Rendering
- Alle 25 Sektionen + IAA + Signatur
- jsPDF Helvetica-Font (keine eingebetteten Fonts → Umlaute-Problem bei manchen Zeichen)
- buildWomenHealth/buildMensHealth prüfen bereits `fd.geschlecht` für geschlechtsspezifische Filterung
- IAA-Daten werden IN das Anamnese-PDF integriert (buildIAA)

### E-Mail-Versand (submit-anamnesis Edge Function)
- **Submit-Phase:** Verifizierungscode an Patient per E-Mail
- **Confirm-Phase:**
  - PDF mit IAA an BEIDE Praxis-Adressen: info@rauch-heilpraktiker.de, praxis_rauch@icloud.com
  - Bestätigungs-E-Mail MIT PDF an Patient
  - IAA-Daten separat in iaa_submissions gespeichert (Anamnesebogen.tsx Zeile 681)

### Relay-Konfiguration (_shared/smtp.ts)
- URL: `https://rauch-heilpraktiker.de/mail-relay.php`
- Lokale Zustellung (@rauch-heilpraktiker.de): 60s Verzögerung
- Anhänge: Base64 in JSON-Payload, 8KB-Chunking im PHP-Relay
- Fallback: Bei Anhang-Fehler → Retry ohne Anhang

---

## 3. Bekannte Probleme (VOR Änderungen)
1. Kontaktdaten (Straße, PLZ, Ort, Telefone) sind KEINE Pflichtfelder
2. Telefonfelder akzeptieren Buchstaben (nur type="tel", keine Input-Sanitierung)
3. Geburtsdatum hat keine Obergrenze (>100 Jahre zurück möglich)
4. Frauengesundheit/Männergesundheit werden als Sektionen im Wizard/Accordion immer angezeigt, unabhängig vom Geschlecht
5. Unterschrift-Ort wird nicht mit Kontakt-Wohnort abgeglichen
6. Unterschrift-Name wird nicht mit Kontakt-Name abgeglichen (bei Erwachsenen)
7. PDF UTF-8: jsPDF Helvetica hat begrenzte Glyph-Unterstützung (Sonderzeichen/Emojis problematisch)
8. IAA-Daten werden im Patienten-PDF mitgesendet (enthält ICD-10 relevant Daten)
9. Alle E-Mails gehen an info@ und praxis_rauch@ statt spezialisiert

---

## 4. Kritische Dateien für Wiederherstellung

### Frontend-Kern
- `src/lib/anamneseFormData.ts` – Form-Datenstruktur (619 Zeilen)
- `src/pages/Anamnesebogen.tsx` – Haupt-Formular-Seite (930 Zeilen)
- `src/components/anamnese/PatientDataSection.tsx` – Patientendaten (772 Zeilen)
- `src/components/anamnese/SignatureSection.tsx` – Unterschrift (378 Zeilen)
- `src/lib/pdfExportEnhanced.ts` – PDF-Engine (1337 Zeilen)

### Edge Functions
- `supabase/functions/submit-anamnesis/index.ts` – Einreichungsflow (476 Zeilen)
- `supabase/functions/_shared/smtp.ts` – E-Mail-Relay (112 Zeilen)
- `supabase/functions/send-icd10-report/index.ts` – ICD-10 Report (133 Zeilen)

### Konfiguration
- `supabase/config.toml` – verify_jwt=false für alle Functions
- `.env` – VITE_SUPABASE_URL, VITE_SUPABASE_PUBLISHABLE_KEY, VITE_SUPABASE_PROJECT_ID

---

## 5. Geplante Änderungen (Punkte a–h)
a) Kontaktdaten als Pflichtfelder (Straße, PLZ, Ort, mind. 1 Telefonnummer)
b) Telefonfelder: Nur Ziffern, +, -, (, ), Leerzeichen
c) Geburtsdatum: Max 100 Jahre zurück
d) Geschlechtsspezifische Sektionen: Wizard/Accordion-Filterung
e) Unterschrift-Ort/-Name Abgleich mit Kontaktdaten
f) PDF UTF-8: Emoji-Bereinigung, Zeichenersetzung
g) IAA nicht an Patient senden, nur an Praxis
h) E-Mail-Routing: anamnese@rauch-heilpraktiker.de, iaa@rauch-heilpraktiker.de
