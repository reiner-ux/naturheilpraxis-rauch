import jsPDF from "jspdf";
import { AnamneseFormData } from "./anamneseFormData";

// Practice branding colors (HSL converted to RGB)
const BRAND_PRIMARY = { r: 76, g: 140, b: 74 }; // Primary green
const BRAND_SECONDARY = { r: 91, g: 173, b: 88 }; // Lighter green
const BRAND_TEXT = { r: 51, g: 51, b: 51 }; // Dark text
const BRAND_MUTED = { r: 120, g: 120, b: 120 }; // Muted text

interface PdfExportOptions {
  formData: AnamneseFormData;
  language: "de" | "en";
  logoBase64?: string;
}

const PRACTICE_INFO = {
  name: "Naturheilpraxis Peter Rauch",
  owner: "Peter Rauch, Heilpraktiker",
  street: "Friedrich-Deffner-Straße 19a",
  city: "86163 Augsburg",
  phone: "0821-2621462",
  email: "info@rauch-heilpraktiker.de",
  web: "www.rauch-heilpraktiker.de"
};

export const generateEnhancedAnamnesePdf = async ({ formData, language, logoBase64 }: PdfExportOptions) => {
  const doc = new jsPDF();
  const pageWidth = doc.internal.pageSize.getWidth();
  const pageHeight = doc.internal.pageSize.getHeight();
  const margin = 20;
  const contentWidth = pageWidth - margin * 2;
  const headerHeight = 35;
  const footerHeight = 25;
  let yPos = headerHeight + 10;
  const lineHeight = 6;

  const t = (de: string, en: string) => (language === "de" ? de : en);

  // ============ HELPER FUNCTIONS ============

  const addHeader = () => {
    // Header background with gradient effect
    doc.setFillColor(BRAND_PRIMARY.r, BRAND_PRIMARY.g, BRAND_PRIMARY.b);
    doc.rect(0, 0, pageWidth, headerHeight, "F");
    
    // Practice name
    doc.setTextColor(255, 255, 255);
    doc.setFontSize(16);
    doc.setFont("helvetica", "bold");
    doc.text(PRACTICE_INFO.name, margin, 15);
    
    // Owner name
    doc.setFontSize(10);
    doc.setFont("helvetica", "normal");
    doc.text(PRACTICE_INFO.owner, margin, 22);
    
    // Contact info on the right
    doc.setFontSize(8);
    doc.text(PRACTICE_INFO.street, pageWidth - margin, 12, { align: "right" });
    doc.text(PRACTICE_INFO.city, pageWidth - margin, 17, { align: "right" });
    doc.text(`Tel: ${PRACTICE_INFO.phone}`, pageWidth - margin, 22, { align: "right" });
    doc.text(PRACTICE_INFO.email, pageWidth - margin, 27, { align: "right" });
    
    // Decorative line
    doc.setDrawColor(BRAND_SECONDARY.r, BRAND_SECONDARY.g, BRAND_SECONDARY.b);
    doc.setLineWidth(1);
    doc.line(0, headerHeight, pageWidth, headerHeight);
  };

  const addFooter = (pageNum: number, totalPages: number) => {
    const footerY = pageHeight - footerHeight;
    
    // Footer line
    doc.setDrawColor(BRAND_PRIMARY.r, BRAND_PRIMARY.g, BRAND_PRIMARY.b);
    doc.setLineWidth(0.5);
    doc.line(margin, footerY, pageWidth - margin, footerY);
    
    // Footer text
    doc.setTextColor(BRAND_MUTED.r, BRAND_MUTED.g, BRAND_MUTED.b);
    doc.setFontSize(8);
    doc.setFont("helvetica", "normal");
    
    // Left: Practice info
    doc.text(PRACTICE_INFO.web, margin, footerY + 8);
    
    // Center: Page number
    doc.text(
      t(`Seite ${pageNum} von ${totalPages}`, `Page ${pageNum} of ${totalPages}`),
      pageWidth / 2,
      footerY + 8,
      { align: "center" }
    );
    
    // Right: Date
    const dateStr = new Date().toLocaleDateString(language === "de" ? "de-DE" : "en-US");
    doc.text(
      t(`Erstellt: ${dateStr}`, `Created: ${dateStr}`),
      pageWidth - margin,
      footerY + 8,
      { align: "right" }
    );
    
    // Disclaimer
    doc.setFontSize(7);
    doc.text(
      t(
        "Dieses Dokument wurde elektronisch erstellt und ist ohne Unterschrift gültig.",
        "This document was created electronically and is valid without signature."
      ),
      pageWidth / 2,
      footerY + 14,
      { align: "center" }
    );
  };

  const checkPageBreak = (requiredSpace: number) => {
    const maxY = pageHeight - footerHeight - 10;
    if (yPos + requiredSpace > maxY) {
      doc.addPage();
      addHeader();
      yPos = headerHeight + 10;
    }
  };

  const addSectionHeader = (text: string, emoji?: string) => {
    checkPageBreak(25);
    
    // Section background
    doc.setFillColor(245, 250, 245);
    doc.rect(margin - 2, yPos - 5, contentWidth + 4, 12, "F");
    
    // Section border
    doc.setDrawColor(BRAND_PRIMARY.r, BRAND_PRIMARY.g, BRAND_PRIMARY.b);
    doc.setLineWidth(0.3);
    doc.line(margin, yPos + 5, pageWidth - margin, yPos + 5);
    
    // Section title
    doc.setTextColor(BRAND_PRIMARY.r, BRAND_PRIMARY.g, BRAND_PRIMARY.b);
    doc.setFontSize(12);
    doc.setFont("helvetica", "bold");
    const displayText = emoji ? `${emoji}  ${text}` : text;
    doc.text(displayText, margin, yPos + 2);
    
    yPos += 15;
    doc.setTextColor(BRAND_TEXT.r, BRAND_TEXT.g, BRAND_TEXT.b);
  };

  const addSubHeader = (text: string) => {
    checkPageBreak(15);
    doc.setFontSize(10);
    doc.setFont("helvetica", "bold");
    doc.setTextColor(BRAND_SECONDARY.r, BRAND_SECONDARY.g, BRAND_SECONDARY.b);
    doc.text(text, margin, yPos);
    yPos += lineHeight + 2;
    doc.setTextColor(BRAND_TEXT.r, BRAND_TEXT.g, BRAND_TEXT.b);
  };

  const addField = (label: string, value: string | boolean | undefined | null, indent = 0) => {
    checkPageBreak(10);
    doc.setFontSize(9);
    doc.setFont("helvetica", "bold");
    doc.setTextColor(BRAND_TEXT.r, BRAND_TEXT.g, BRAND_TEXT.b);
    
    const displayValue = value === true ? t("Ja", "Yes") : value === false ? t("Nein", "No") : value || "-";
    
    // Label
    doc.text(`${label}:`, margin + indent, yPos);
    
    // Value
    doc.setFont("helvetica", "normal");
    const labelWidth = doc.getTextWidth(`${label}: `);
    const valueX = margin + indent + labelWidth;
    const maxValueWidth = contentWidth - labelWidth - indent;
    
    const lines = doc.splitTextToSize(String(displayValue), maxValueWidth);
    doc.text(lines, valueX, yPos);
    yPos += lines.length * lineHeight;
  };

  const addCheckboxField = (label: string, checked: boolean | undefined, indent = 5) => {
    checkPageBreak(8);
    doc.setFontSize(9);
    doc.setFont("helvetica", "normal");
    doc.setTextColor(BRAND_TEXT.r, BRAND_TEXT.g, BRAND_TEXT.b);
    
    // Draw checkbox
    const checkboxSize = 3;
    doc.setDrawColor(BRAND_PRIMARY.r, BRAND_PRIMARY.g, BRAND_PRIMARY.b);
    doc.rect(margin + indent, yPos - 3, checkboxSize, checkboxSize);
    
    if (checked) {
      doc.setFillColor(BRAND_PRIMARY.r, BRAND_PRIMARY.g, BRAND_PRIMARY.b);
      doc.rect(margin + indent + 0.5, yPos - 2.5, checkboxSize - 1, checkboxSize - 1, "F");
    }
    
    doc.text(label, margin + indent + checkboxSize + 3, yPos);
    yPos += lineHeight;
  };

  const addSpacing = (space: number = lineHeight) => {
    yPos += space;
  };

  // ============ BUILD DOCUMENT ============

  // First page header
  addHeader();

  // Document Title
  doc.setTextColor(BRAND_TEXT.r, BRAND_TEXT.g, BRAND_TEXT.b);
  doc.setFontSize(20);
  doc.setFont("helvetica", "bold");
  doc.text(t("Anamnesebogen", "Medical History Form"), pageWidth / 2, yPos + 5, { align: "center" });
  yPos += 15;

  // Patient info box
  if (formData.vorname || formData.nachname) {
    doc.setFillColor(240, 248, 240);
    doc.roundedRect(margin, yPos - 2, contentWidth, 18, 3, 3, "F");
    doc.setDrawColor(BRAND_PRIMARY.r, BRAND_PRIMARY.g, BRAND_PRIMARY.b);
    doc.setLineWidth(0.3);
    doc.roundedRect(margin, yPos - 2, contentWidth, 18, 3, 3, "S");
    
    doc.setFontSize(12);
    doc.setFont("helvetica", "bold");
    doc.text(
      `${t("Patient/in", "Patient")}: ${formData.vorname} ${formData.nachname}`,
      margin + 5,
      yPos + 5
    );
    
    if (formData.geburtsdatum) {
      doc.setFontSize(10);
      doc.setFont("helvetica", "normal");
      doc.text(
        `${t("Geburtsdatum", "Date of Birth")}: ${formData.geburtsdatum}`,
        margin + 5,
        yPos + 12
      );
    }
    yPos += 25;
  }

  // I. Patient Data
  addSectionHeader(t("I. Patientendaten", "I. Patient Data"), "👤");
  addField(t("Name", "Name"), `${formData.vorname} ${formData.nachname}`);
  addField(t("Geburtsdatum", "Date of Birth"), formData.geburtsdatum);
  addField(t("Geschlecht", "Gender"), formData.geschlecht);
  addField(t("Nationalität", "Nationality"), formData.nationalitaet);
  addField(t("Zivilstand", "Marital Status"), formData.zivilstand);
  addSpacing();
  
  addSubHeader(t("Kontaktdaten", "Contact Information"));
  addField(t("Adresse", "Address"), `${formData.strasse}, ${formData.plz} ${formData.wohnort}`, 5);
  addField(t("E-Mail", "Email"), formData.email, 5);
  addField(t("Telefon", "Phone"), formData.telefonPrivat || formData.mobil, 5);
  addSpacing();

  addSubHeader(t("Versicherung", "Insurance"));
  addField(t("Typ", "Type"), formData.versicherungstyp, 5);
  addField(t("Name", "Name"), formData.versicherungsname, 5);
  addSpacing();

  addSubHeader(t("Berufliche Situation", "Professional Situation"));
  addField(t("Beruf", "Occupation"), formData.beruf, 5);
  addField(t("Körpergröße / Gewicht", "Height / Weight"), `${formData.koerpergroesse} cm / ${formData.gewicht} kg`, 5);
  addSpacing(10);

  // II. Family History
  addSectionHeader(t("II. Familiengeschichte", "II. Family History"), "👨‍👩‍👧‍👦");
  const familyConditions = [
    { key: "hoherBlutdruck", de: "Hoher Blutdruck", en: "High Blood Pressure" },
    { key: "herzinfarkt", de: "Herzinfarkt", en: "Heart Attack" },
    { key: "schlaganfall", de: "Schlaganfall", en: "Stroke" },
    { key: "diabetes", de: "Diabetes", en: "Diabetes" },
    { key: "krebs", de: "Krebs", en: "Cancer" },
    { key: "allergien", de: "Allergien", en: "Allergies" },
  ];
  
  let hasFamilyHistory = false;
  familyConditions.forEach(({ key, de, en }) => {
    const condition = formData.familyHistory?.[key as keyof typeof formData.familyHistory];
    if (condition && typeof condition === 'object' && 'ja' in condition && condition.ja) {
      hasFamilyHistory = true;
      const relatives: string[] = [];
      if ('vater' in condition && condition.vater) relatives.push(t("Vater", "Father"));
      if ('mutter' in condition && condition.mutter) relatives.push(t("Mutter", "Mother"));
      if ('grosseltern' in condition && condition.grosseltern) relatives.push(t("Großeltern", "Grandparents"));
      if ('geschwister' in condition && condition.geschwister) relatives.push(t("Geschwister", "Siblings"));
      addCheckboxField(`${t(de, en)}: ${relatives.join(", ") || t("Ja", "Yes")}`, true);
    }
  });
  if (!hasFamilyHistory) {
    doc.setFontSize(9);
    doc.text(t("Keine relevanten Familienerkrankungen angegeben", "No relevant family conditions specified"), margin, yPos);
    yPos += lineHeight;
  }
  addSpacing(10);

  // III. Medical History
  addSectionHeader(t("III. Eigene Erkrankungen", "III. Medical History"), "🏥");
  
  if (formData.herzKreislauf) {
    addSubHeader(t("Herz & Kreislauf", "Heart & Circulation"));
    if (formData.herzKreislauf.blutdruckHoch?.ja) addCheckboxField(t("Hoher Blutdruck", "High Blood Pressure"), true);
    if (formData.herzKreislauf.herzrhythmusstörung?.ja) addCheckboxField(t("Herzrhythmusstörung", "Heart Arrhythmia"), true);
    if (formData.herzKreislauf.herzinfarkt?.ja) addCheckboxField(t("Herzinfarkt", "Heart Attack"), true);
    if (formData.herzKreislauf.thrombose?.ja) addCheckboxField(t("Thrombose", "Thrombosis"), true);
  }

  if (formData.magenDarm) {
    addSubHeader(t("Magen & Darm", "Stomach & Intestines"));
    if (formData.magenDarm.sodbrennen?.ja) addCheckboxField(t("Sodbrennen", "Heartburn"), true);
    if (formData.magenDarm.reizdarm?.ja) addCheckboxField(t("Reizdarm", "Irritable Bowel"), true);
    if (formData.magenDarm.morbusCrohn?.ja) addCheckboxField(t("Morbus Crohn", "Crohn's Disease"), true);
  }
  addSpacing(10);

  // V. Surgeries
  addSectionHeader(t("V. Unfälle & Operationen", "V. Accidents & Surgeries"), "🔧");
  
  if (formData.unfaelleOperationen?.unfall?.ja) {
    addField(t("Unfall", "Accident"), `${formData.unfaelleOperationen.unfall.jahr || ""} - ${formData.unfaelleOperationen.unfall.lokalisation || ""}`);
  }
  if (formData.unfaelleOperationen?.knochenbruch?.ja) {
    addField(t("Knochenbruch", "Bone Fracture"), formData.unfaelleOperationen.knochenbruch.welcher);
  }
  
  if (formData.unfaelleOperationen?.operationen?.length > 0) {
    addSubHeader(t("Operationen", "Surgeries"));
    formData.unfaelleOperationen.operationen.forEach((op, i) => {
      addField(`${i + 1}.`, `${op.jahr} - ${op.grund}`, 5);
    });
  }
  addSpacing(10);

  // VII. Allergies
  addSectionHeader(t("VII. Allergien & Unverträglichkeiten", "VII. Allergies & Intolerances"), "⚠️");
  let hasAllergies = false;
  
  if (formData.allergien?.inhalation?.ja) {
    hasAllergies = true;
    const types: string[] = [];
    if (formData.allergien.inhalation.pollen) types.push(t("Pollen", "Pollen"));
    if (formData.allergien.inhalation.staub) types.push(t("Staub", "Dust"));
    if (formData.allergien.inhalation.tierhaare) types.push(t("Tierhaare", "Animal Hair"));
    addField(t("Inhalationsallergien", "Inhalation Allergies"), types.join(", "));
  }
  if (formData.allergien?.nahrungsmittel?.ja) {
    hasAllergies = true;
    addField(t("Nahrungsmittelallergien", "Food Allergies"), formData.allergien.nahrungsmittel.details);
  }
  if (formData.allergien?.medikamente?.ja) {
    hasAllergies = true;
    addField(t("Medikamentenallergien", "Drug Allergies"), formData.allergien.medikamente.details);
  }
  if (formData.allergien?.laktose?.ja) { hasAllergies = true; addCheckboxField(t("Laktoseintoleranz", "Lactose Intolerance"), true); }
  if (formData.allergien?.gluten?.ja) { hasAllergies = true; addCheckboxField(t("Glutenunverträglichkeit", "Gluten Intolerance"), true); }
  if (formData.allergien?.histamin?.ja) { hasAllergies = true; addCheckboxField(t("Histaminintoleranz", "Histamine Intolerance"), true); }
  
  if (!hasAllergies) {
    doc.setFontSize(9);
    doc.text(t("Keine Allergien angegeben", "No allergies specified"), margin, yPos);
    yPos += lineHeight;
  }
  addSpacing(10);

  // VIII. Medications
  addSectionHeader(t("VIII. Medikamente", "VIII. Medications"), "💊");
  if (formData.medikamente?.aktuelle?.length > 0) {
    formData.medikamente.aktuelle.forEach((med, i) => {
      addField(`${i + 1}. ${med.name}`, `${med.dosierung} - ${med.grund}`);
    });
  } else {
    doc.setFontSize(9);
    doc.text(t("Keine aktuellen Medikamente", "No current medications"), margin, yPos);
    yPos += lineHeight;
  }
  addSpacing(10);

  // IX. Lifestyle
  addSectionHeader(t("IX. Lebensweise", "IX. Lifestyle"), "🏃");
  addField(t("Raucher", "Smoker"), formData.lebensweise?.raucher || t("Nein", "No"));
  if (formData.lebensweise?.alkohol?.ja) {
    addField(t("Alkohol", "Alcohol"), formData.lebensweise.alkohol.mengeProTag);
  }
  if (formData.lebensweise?.sport?.ja) {
    addField(t("Sport", "Sports"), `${formData.lebensweise.sport.art} (${formData.lebensweise.sport.proWoche}x ${t("pro Woche", "per week")})`);
  }
  addField(t("Schlafqualität", "Sleep Quality"), formData.lebensweise?.schlafQualitaet);
  addField(t("Schlafdauer", "Sleep Duration"), formData.lebensweise?.schlafDauer);
  addSpacing(10);

  // XVI. Signature
  addSectionHeader(t("XVI. Unterschrift", "XVI. Signature"), "✍️");
  addField(t("Datum", "Date"), formData.unterschrift?.datum);
  addField(t("Name in Druckbuchstaben", "Name in Block Letters"), formData.unterschrift?.nameInDruckbuchstaben);
  addCheckboxField(t("Datenschutzerklärung bestätigt", "Privacy Policy Confirmed"), formData.unterschrift?.bestaetigung);

  // Add footers to all pages
  const pageCount = doc.internal.pages.length - 1;
  for (let i = 1; i <= pageCount; i++) {
    doc.setPage(i);
    addFooter(i, pageCount);
  }

  // Generate filename
  const patientName = `${formData.nachname}_${formData.vorname}`.replace(/[^a-zA-Z0-9]/g, "_") || "Patient";
  const date = new Date().toISOString().split("T")[0];
  const filename = `Anamnesebogen_${patientName}_${date}.pdf`;

  // Save the PDF
  doc.save(filename);
};

// Export both functions for backward compatibility
export { generateEnhancedAnamnesePdf as generateAnamnesePdf };
