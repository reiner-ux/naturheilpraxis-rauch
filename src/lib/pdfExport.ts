import jsPDF from "jspdf";
import { AnamneseFormData } from "./anamneseFormData";

interface PdfExportOptions {
  formData: AnamneseFormData;
  language: "de" | "en";
}

export const generateAnamnesePdf = ({ formData, language }: PdfExportOptions) => {
  const doc = new jsPDF();
  const pageWidth = doc.internal.pageSize.getWidth();
  const margin = 20;
  const contentWidth = pageWidth - margin * 2;
  let yPos = 20;
  const lineHeight = 7;

  const t = (de: string, en: string) => (language === "de" ? de : en);

  // Helper functions
  const addTitle = (text: string) => {
    doc.setFontSize(18);
    doc.setFont("helvetica", "bold");
    doc.text(text, pageWidth / 2, yPos, { align: "center" });
    yPos += 12;
  };

  const addSectionHeader = (text: string) => {
    checkPageBreak(20);
    doc.setFontSize(14);
    doc.setFont("helvetica", "bold");
    doc.setTextColor(59, 130, 246); // Blue color
    doc.text(text, margin, yPos);
    yPos += 2;
    doc.setDrawColor(59, 130, 246);
    doc.line(margin, yPos, pageWidth - margin, yPos);
    yPos += 8;
    doc.setTextColor(0, 0, 0);
  };

  const addSubHeader = (text: string) => {
    checkPageBreak(15);
    doc.setFontSize(11);
    doc.setFont("helvetica", "bold");
    doc.text(text, margin, yPos);
    yPos += lineHeight;
  };

  const addField = (label: string, value: string | boolean | undefined | null) => {
    checkPageBreak(10);
    doc.setFontSize(10);
    doc.setFont("helvetica", "normal");
    const displayValue = value === true ? t("Ja", "Yes") : value === false ? t("Nein", "No") : value || "-";
    const text = `${label}: ${displayValue}`;
    const lines = doc.splitTextToSize(text, contentWidth);
    doc.text(lines, margin, yPos);
    yPos += lines.length * lineHeight;
  };

  const addCheckboxField = (label: string, checked: boolean | undefined) => {
    checkPageBreak(10);
    doc.setFontSize(10);
    doc.setFont("helvetica", "normal");
    const checkbox = checked ? "☑" : "☐";
    doc.text(`${checkbox} ${label}`, margin + 5, yPos);
    yPos += lineHeight;
  };

  const checkPageBreak = (requiredSpace: number) => {
    if (yPos + requiredSpace > doc.internal.pageSize.getHeight() - 20) {
      doc.addPage();
      yPos = 20;
    }
  };

  const addSpacing = (space: number = lineHeight) => {
    yPos += space;
  };

  // Document Header
  addTitle(t("Anamnesebogen", "Medical History Form"));
  doc.setFontSize(10);
  doc.setFont("helvetica", "normal");
  doc.text(t(`Erstellt am: ${new Date().toLocaleDateString("de-DE")}`, `Created on: ${new Date().toLocaleDateString("en-US")}`), pageWidth / 2, yPos, { align: "center" });
  yPos += 15;

  // I. Patient Data
  addSectionHeader(t("I. Patientendaten", "I. Patient Data"));
  addField(t("Name", "Name"), `${formData.vorname} ${formData.nachname}`);
  addField(t("Geburtsdatum", "Date of Birth"), formData.geburtsdatum);
  addField(t("Geschlecht", "Gender"), formData.geschlecht);
  addField(t("Nationalität", "Nationality"), formData.nationalitaet);
  addField(t("Zivilstand", "Marital Status"), formData.zivilstand);
  addSpacing();
  
  addSubHeader(t("Kontaktdaten", "Contact Information"));
  addField(t("Straße", "Street"), formData.strasse);
  addField(t("PLZ / Wohnort", "ZIP / City"), `${formData.plz} ${formData.wohnort}`);
  addField(t("E-Mail", "Email"), formData.email);
  addField(t("Telefon privat", "Phone (private)"), formData.telefonPrivat);
  addField(t("Telefon beruflich", "Phone (work)"), formData.telefonBeruflich);
  addField(t("Mobil", "Mobile"), formData.mobil);
  addSpacing();

  addSubHeader(t("Versicherung", "Insurance"));
  addField(t("Versicherungstyp", "Insurance Type"), formData.versicherungstyp);
  addField(t("Versicherungsname", "Insurance Name"), formData.versicherungsname);
  addField(t("Versicherungsnummer", "Insurance Number"), formData.versicherungsnummer);
  addSpacing();

  addSubHeader(t("Berufliche Situation", "Professional Situation"));
  addField(t("Beruf", "Occupation"), formData.beruf);
  addField(t("Arbeitgeber", "Employer"), formData.arbeitgeber);
  addField(t("Körpergröße", "Height"), formData.koerpergroesse);
  addField(t("Gewicht", "Weight"), formData.gewicht);
  addSpacing(10);

  // II. Family History
  addSectionHeader(t("II. Familiengeschichte", "II. Family History"));
  const familyConditions = [
    { key: "hoherBlutdruck", de: "Hoher Blutdruck", en: "High Blood Pressure" },
    { key: "herzinfarkt", de: "Herzinfarkt", en: "Heart Attack" },
    { key: "schlaganfall", de: "Schlaganfall", en: "Stroke" },
    { key: "diabetes", de: "Diabetes", en: "Diabetes" },
    { key: "krebs", de: "Krebs", en: "Cancer" },
    { key: "allergien", de: "Allergien", en: "Allergies" },
  ];
  
  familyConditions.forEach(({ key, de, en }) => {
    const condition = formData.familyHistory?.[key as keyof typeof formData.familyHistory];
    if (condition && typeof condition === 'object' && 'ja' in condition && condition.ja) {
      const relatives: string[] = [];
      if ('vater' in condition && condition.vater) relatives.push(t("Vater", "Father"));
      if ('mutter' in condition && condition.mutter) relatives.push(t("Mutter", "Mother"));
      if ('grosseltern' in condition && condition.grosseltern) relatives.push(t("Großeltern", "Grandparents"));
      if ('geschwister' in condition && condition.geschwister) relatives.push(t("Geschwister", "Siblings"));
      addField(t(de, en), relatives.join(", ") || t("Ja", "Yes"));
    }
  });
  addSpacing(10);

  // III. Medical History (selected highlights)
  addSectionHeader(t("III. Eigene Erkrankungen", "III. Medical History"));
  
  // Herz & Kreislauf
  if (formData.herzKreislauf) {
    addSubHeader(t("Herz & Kreislauf", "Heart & Circulation"));
    if (formData.herzKreislauf.blutdruckHoch?.ja) addCheckboxField(t("Hoher Blutdruck", "High Blood Pressure"), true);
    if (formData.herzKreislauf.herzrhythmusstörung?.ja) addCheckboxField(t("Herzrhythmusstörung", "Heart Arrhythmia"), true);
    if (formData.herzKreislauf.herzinfarkt?.ja) addCheckboxField(t("Herzinfarkt", "Heart Attack"), true);
    if (formData.herzKreislauf.thrombose?.ja) addCheckboxField(t("Thrombose", "Thrombosis"), true);
  }

  // Magen & Darm
  if (formData.magenDarm) {
    addSubHeader(t("Magen & Darm", "Stomach & Intestines"));
    if (formData.magenDarm.sodbrennen?.ja) addCheckboxField(t("Sodbrennen", "Heartburn"), true);
    if (formData.magenDarm.reizdarm?.ja) addCheckboxField(t("Reizdarm", "Irritable Bowel"), true);
    if (formData.magenDarm.morbusCrohn?.ja) addCheckboxField(t("Morbus Crohn", "Crohn's Disease"), true);
  }
  addSpacing(10);

  // V. Surgeries & Special Treatments
  addSectionHeader(t("V. Unfälle & Operationen", "V. Accidents & Surgeries"));
  
  if (formData.unfaelleOperationen?.unfall?.ja) {
    addField(t("Unfall", "Accident"), `${formData.unfaelleOperationen.unfall.jahr || ""} - ${formData.unfaelleOperationen.unfall.lokalisation || ""}`);
  }
  if (formData.unfaelleOperationen?.knochenbruch?.ja) {
    addField(t("Knochenbruch", "Bone Fracture"), formData.unfaelleOperationen.knochenbruch.welcher);
  }
  
  // Operations
  if (formData.unfaelleOperationen?.operationen?.length > 0) {
    addSubHeader(t("Operationen", "Surgeries"));
    formData.unfaelleOperationen.operationen.forEach((op, i) => {
      addField(`${i + 1}.`, `${op.jahr} - ${op.grund}`);
    });
  }

  // Nuclear Medicine
  addSubHeader(t("Nuklearmedizinische Untersuchungen", "Nuclear Medicine Examinations"));
  if (formData.unfaelleOperationen?.szintigraphie?.ja) {
    addField(t("Szintigraphie", "Scintigraphy"), formData.unfaelleOperationen.szintigraphie.grund);
  }
  if (formData.unfaelleOperationen?.petCt?.ja) {
    addField("PET-CT", (formData.unfaelleOperationen.petCt as any)?.grund);
  }
  if (formData.unfaelleOperationen?.radioiodtherapie?.ja) {
    addField(t("Radioiodtherapie", "Radioiodine Therapy"), (formData.unfaelleOperationen.radioiodtherapie as any)?.grund);
  }
  addSpacing(10);

  // VII. Allergies
  addSectionHeader(t("VII. Allergien & Unverträglichkeiten", "VII. Allergies & Intolerances"));
  if (formData.allergien?.inhalation?.ja) {
    const types: string[] = [];
    if (formData.allergien.inhalation.pollen) types.push(t("Pollen", "Pollen"));
    if (formData.allergien.inhalation.staub) types.push(t("Staub", "Dust"));
    if (formData.allergien.inhalation.tierhaare) types.push(t("Tierhaare", "Animal Hair"));
    addField(t("Inhalationsallergien", "Inhalation Allergies"), types.join(", "));
  }
  if (formData.allergien?.nahrungsmittel?.ja) {
    addField(t("Nahrungsmittelallergien", "Food Allergies"), formData.allergien.nahrungsmittel.details);
  }
  if (formData.allergien?.medikamente?.ja) {
    addField(t("Medikamentenallergien", "Drug Allergies"), formData.allergien.medikamente.details);
  }
  if (formData.allergien?.laktose?.ja) addCheckboxField(t("Laktoseintoleranz", "Lactose Intolerance"), true);
  if (formData.allergien?.gluten?.ja) addCheckboxField(t("Glutenunverträglichkeit", "Gluten Intolerance"), true);
  if (formData.allergien?.histamin?.ja) addCheckboxField(t("Histaminintoleranz", "Histamine Intolerance"), true);
  addSpacing(10);

  // VIII. Medications
  addSectionHeader(t("VIII. Medikamente", "VIII. Medications"));
  if (formData.medikamente?.aktuelle?.length > 0) {
    addSubHeader(t("Aktuelle Medikamente", "Current Medications"));
    formData.medikamente.aktuelle.forEach((med, i) => {
      addField(`${i + 1}. ${med.name}`, `${med.dosierung} - ${med.grund}`);
    });
  } else {
    doc.setFontSize(10);
    doc.text(t("Keine aktuellen Medikamente angegeben", "No current medications specified"), margin, yPos);
    yPos += lineHeight;
  }
  addSpacing(10);

  // IX. Lifestyle
  addSectionHeader(t("IX. Lebensweise", "IX. Lifestyle"));
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
  addSectionHeader(t("XVI. Unterschrift", "XVI. Signature"));
  addField(t("Datum", "Date"), formData.unterschrift?.datum);
  addField(t("Name in Druckbuchstaben", "Name in Block Letters"), formData.unterschrift?.nameInDruckbuchstaben);
  addCheckboxField(t("Datenschutzerklärung bestätigt", "Privacy Policy Confirmed"), formData.unterschrift?.bestaetigung);

  // Footer on last page
  const pageCount = doc.internal.pages.length - 1;
  for (let i = 1; i <= pageCount; i++) {
    doc.setPage(i);
    doc.setFontSize(8);
    doc.setTextColor(128, 128, 128);
    doc.text(
      t(`Seite ${i} von ${pageCount}`, `Page ${i} of ${pageCount}`),
      pageWidth / 2,
      doc.internal.pageSize.getHeight() - 10,
      { align: "center" }
    );
  }

  // Generate filename
  const patientName = `${formData.nachname}_${formData.vorname}`.replace(/[^a-zA-Z0-9]/g, "_") || "Patient";
  const date = new Date().toISOString().split("T")[0];
  const filename = `Anamnesebogen_${patientName}_${date}.pdf`;

  // Save the PDF
  doc.save(filename);
};
