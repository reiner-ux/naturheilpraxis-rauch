# Restore Part 8: PDF-Export-System – Vollständige Dokumentation

**Datum:** 04.03.2026

---

## Übersicht

| Modul | Datei | Zeilen | Zweck |
|-------|-------|--------|-------|
| Basis-Export | `src/lib/pdfExport.ts` | 12 | Wrapper → delegiert an Enhanced |
| Enhanced-Export | `src/lib/pdfExportEnhanced.ts` | **1337** | Vollständiger Anamnesebogen-PDF |
| ICD-10-Export | `src/lib/icd10PdfExport.ts` | 235 | ICD-10-Diagnoseübersicht-PDF |
| Datenschutz-Export | `src/lib/datenschutzPdfExport.ts` | 259 | DSGVO-Einwilligungserklärung-PDF |

---

## src/lib/pdfExport.ts (12 Zeilen – Wrapper)

```typescript
import { AnamneseFormData } from "./anamneseFormData";
import { generateEnhancedAnamnesePdf } from "./pdfExportEnhanced";

interface PdfExportOptions {
  formData: AnamneseFormData;
  language: "de" | "en";
}

/** Simple PDF export - delegates to the enhanced version which now covers all sections */
export const generateAnamnesePdf = ({ formData, language }: PdfExportOptions) => {
  generateEnhancedAnamnesePdf({ formData, language });
};
```

---

## src/lib/pdfExportEnhanced.ts (1337 Zeilen)

### WICHTIG: Dies ist die umfangreichste und arbeitsintensivste Datei des Projekts.

Der vollständige Quellcode befindet sich im Repository. Hier die architektonische Dokumentation:

### Klasse: AnamnesePdfBuilder

**Bibliothek:** jsPDF
**Format:** A4 (210×297mm)
**Margins:** 20mm
**Header:** 35mm (grüner Balken mit Praxis-Logo und Kontaktdaten)
**Footer:** 25mm (Seitenzahl, Webseite, Datum, Rechtshinweis)

### Farbkonstanten
```typescript
const BRAND_PRIMARY = { r: 76, g: 140, b: 74 };   // Sage Green
const BRAND_SECONDARY = { r: 91, g: 173, b: 88 }; // Light Green
const BRAND_TEXT = { r: 51, g: 51, b: 51 };        // Dark Gray
const BRAND_MUTED = { r: 120, g: 120, b: 120 };    // Gray
```

### Praxisdaten im PDF-Header
```typescript
const PRACTICE_INFO = {
  name: "Naturheilpraxis Peter Rauch",
  owner: "Peter Rauch, Heilpraktiker",
  street: "Friedrich-Deffner-Straße 19a",
  city: "86163 Augsburg",
  phone: "0821-2621462",
  email: "info@rauch-heilpraktiker.de",
  web: "www.rauch-heilpraktiker.de"
};
```

### Kern-Methoden (Zeilen 29-180)
- `constructor(language)` → jsPDF init, Dimensionen berechnen
- `t(de, en)` → Sprach-Helper
- `addHeader()` → Grüner Header-Balken mit Praxis-Kontaktdaten
- `addFooter(pageNum, totalPages)` → Seitenzahl + Rechtshinweis
- `checkPageBreak(requiredSpace)` → Automatischer Seitenumbruch
- `addSectionHeader(text, emoji)` → Hellgrüne Box mit Emoji und Trennlinie
- `addSubHeader(text)` → Grüner Untertitel
- `addField(label, value, indent)` → Schlüssel-Wert-Paar (überspringt leere)
- `addFieldAlways(label, value)` → Zeigt auch "–" für leere Werte
- `addCheckboxField(label, checked, indent)` → Grüne Checkbox-Grafik
- `addNoData(text)` → Kursiver "Keine Angaben" Hinweis
- `addSpacing(space)` → Vertikaler Abstand

### prettifyKey() – Medizinisches Label-Mapping (Zeilen 182-291)
100+ camelCase-Schlüssel werden in lesbare DE/EN-Labels übersetzt.
Beispiele:
- `grauerStar` → "Grauer Star" / "Cataract"
- `vorhofflimmern` → "Vorhofflimmern" / "Atrial Fibrillation"
- `hashimoto` → "Hashimoto" / "Hashimoto's"

### renderCondition() – Rekursive Zustandsanzeige (Zeilen 293-351)
Verarbeitet medizinische Zustände mit:
- Zeitinfo (seit/bis Jahr/Monat, Legacy + neues Format)
- Status (noch vorhanden / geendet)
- Boolean-Sub-Felder (z.B. vater, mutter, grosseltern)
- Verschachtelte Objekte (z.B. Prothese-Kiefer, Schweregrade)
- Freitext (sonstige, details, welche, grund)

### renderConditionGroup() – Gruppen-Rendering (Zeilen 353-369)

### buildDocument() – Haupt-Orchestrierung (Zeilen 373-437)
Ruft alle 25 Sektionsmethoden in fester Reihenfolge auf:
```
I. Patientendaten → II. Familiengeschichte → III. Kopf & Sinne →
IV. Herz & Kreislauf → V. Lunge → VI. Magen & Darm →
VII. Leber & Galle → VIII. Niere & Blase → IX. Hormone →
X. Bewegungsapparat → XI. Frauengesundheit/Männergesundheit →
XII. Unfälle & Operationen → XIII. Krebs → XIV. Allergien →
XV. Medikamente → XVI. Lebensweise → XVII. Zahngesundheit →
XVIII. Umweltbelastungen → XIX. Infektionen → XX. Impfstatus →
XXI. Beschwerden → XXII. Behandlungspräferenzen → XXIII. Persönliches →
XXIV. IAA (Trikombin) → XXV. Unterschrift
```

### Sektion XVII: Zahngesundheit (Zeilen 955-998)
Besonders komplex wegen:
- FDI-Schema Zahnbefunde (Zahn-für-Zahn mit Diagnosen)
- Prothesen-Kiefer-Zuordnung
- Kiefergelenk (Knacken/Schmerzen/Einschränkung)
- Bruxismus (Nachts/Tagsüber/Schiene)

### Sektion XXIV: IAA – Trikombin (Zeilen 1235-1293)
- Skala 1-6 (sehr leicht bis extrem)
- Kategorien aus `iaaCategories`
- Nur beantwortete Fragen werden gedruckt
- Summe der bewerteten Symptome am Ende

### Sektion XXV: Unterschrift (Zeilen 1295-1309)
- Ort, Datum, Name in Druckbuchstaben
- Datenschutzbestätigung, DSGVO-Einwilligung, Patientenaufklärung
- 2FA-Bestätigung
- Erziehungsberechtigter (optional)

### Public API (Zeilen 1325-1337)
```typescript
export const generateEnhancedAnamnesePdf = async ({ formData, language, iaaData }) => {
  const builder = new AnamnesePdfBuilder(language);
  builder.buildDocument(formData, iaaData);
  builder.save(formData); // Löst Download aus
};

export const generateAnamnesePdfBase64 = async ({ formData, language, iaaData }): Promise<string> => {
  const builder = new AnamnesePdfBuilder(language);
  builder.buildDocument(formData, iaaData);
  return builder.toBase64(); // Für E-Mail-Anhang
};
```

### toBase64() (Zeile 1319-1322)
```typescript
toBase64(): string {
  const dataUri = this.doc.output('datauristring');
  return dataUri.split(',')[1];
}
```

---

## PDF-zu-E-Mail-Pipeline (End-to-End)

```
1. Benutzer klickt "Absenden" im Anamnesebogen
2. handleSubmit() → Edge Function "submit-anamnesis" action:submit
3. Code-E-Mail an Patient
4. Patient gibt Code ein → handleVerifyCode()
5. generateAnamnesePdfBase64() → Base64-String erzeugt
6. Edge Function "submit-anamnesis" action:confirm mit pdfBase64
7. Edge Function baut pdfAttachment: { filename, base64, contentType }
8. sendEmail() → PHP-Relay → SMTP → 3 E-Mails mit PDF
```

### Fallback bei PDF-Fehler
```typescript
// In Anamnesebogen.tsx handleVerifyCode():
let pdfBase64: string | undefined;
try {
  pdfBase64 = await generateAnamnesePdfBase64({ formData, language, iaaData });
} catch (e) {
  console.warn("PDF generation failed, sending without attachment:", e);
}
// Sende trotzdem – smtp.ts fügt Hinweistext hinzu wenn kein Anhang
```

---

## Bekannte Probleme
- Sporadische Layout-Überlappungen bei sehr langen Freitextfeldern
- PDF-Dateigröße kann bei vielen Zahnbefunden > 500KB werden (chunked SMTP nötig)
