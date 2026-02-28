import jsPDF from "jspdf";

interface ICD10Code {
  code: string;
  descDe: string;
  descEn: string;
  category: string;
  source: "fixed" | "ai";
  confidence?: number;
}

interface ICD10PdfData {
  patientName: string;
  submissionDate: string;
  codes: ICD10Code[];
  fixedCount: number;
  aiCount: number;
  aiSummary: string | null;
  language: "de" | "en";
}

export function generateICD10Pdf(data: ICD10PdfData, options?: { returnBase64?: boolean }): string | void {
  const { language: lang, codes, patientName, submissionDate, fixedCount, aiCount, aiSummary } = data;
  const doc = new jsPDF({ orientation: "portrait", unit: "mm", format: "a4" });
  const pageWidth = doc.internal.pageSize.getWidth();
  const pageHeight = doc.internal.pageSize.getHeight();
  const margin = 20;
  const contentWidth = pageWidth - 2 * margin;
  let y = margin;

  const addPageIfNeeded = (neededSpace: number) => {
    if (y + neededSpace > pageHeight - 25) {
      doc.addPage();
      y = margin;
      addFooter();
    }
  };

  const addFooter = () => {
    const pageCount = doc.getNumberOfPages();
    doc.setFontSize(8);
    doc.setTextColor(150);
    doc.text(
      `${lang === "de" ? "Seite" : "Page"} ${pageCount}`,
      pageWidth / 2,
      pageHeight - 10,
      { align: "center" }
    );
    doc.text(
      lang === "de" ? "Naturheilpraxis Peter Rauch – ICD-10 Diagnoseübersicht" : "Naturopathic Practice Peter Rauch – ICD-10 Diagnosis Overview",
      pageWidth / 2,
      pageHeight - 6,
      { align: "center" }
    );
  };

  // === Header ===
  doc.setFontSize(18);
  doc.setTextColor(60, 90, 70);
  doc.setFont("helvetica", "bold");
  doc.text(lang === "de" ? "ICD-10 Diagnoseübersicht" : "ICD-10 Diagnosis Overview", margin, y);
  y += 8;

  doc.setFontSize(10);
  doc.setTextColor(100);
  doc.setFont("helvetica", "normal");
  doc.text("Naturheilpraxis Peter Rauch", margin, y);
  y += 5;
  doc.text(`${lang === "de" ? "Erstellt am" : "Generated on"}: ${new Date().toLocaleDateString(lang === "de" ? "de-DE" : "en-US")}`, margin, y);
  y += 10;

  // === Patient Info ===
  doc.setFillColor(245, 248, 245);
  doc.roundedRect(margin, y, contentWidth, 18, 2, 2, "F");
  doc.setFontSize(10);
  doc.setTextColor(60);
  doc.setFont("helvetica", "bold");
  doc.text(`${lang === "de" ? "Patient" : "Patient"}: ${patientName}`, margin + 5, y + 7);
  doc.setFont("helvetica", "normal");
  doc.text(`${lang === "de" ? "Einreichung" : "Submission"}: ${submissionDate}`, margin + 5, y + 13);
  doc.text(`${fixedCount} ${lang === "de" ? "feste" : "fixed"} + ${aiCount} ${lang === "de" ? "KI-basierte" : "AI-based"} ${lang === "de" ? "Zuordnungen" : "mappings"}`, contentWidth - 10, y + 7, { align: "right" });
  y += 24;

  // === AI Summary ===
  if (aiSummary) {
    addPageIfNeeded(20);
    doc.setFontSize(11);
    doc.setFont("helvetica", "bold");
    doc.setTextColor(60, 90, 70);
    doc.text(lang === "de" ? "KI-Zusammenfassung" : "AI Summary", margin, y);
    y += 6;
    doc.setFontSize(9);
    doc.setFont("helvetica", "normal");
    doc.setTextColor(80);
    const summaryLines = doc.splitTextToSize(aiSummary, contentWidth - 10);
    doc.text(summaryLines, margin + 2, y);
    y += summaryLines.length * 4 + 6;
  }

  // === Table Header ===
  addPageIfNeeded(15);
  doc.setFontSize(11);
  doc.setFont("helvetica", "bold");
  doc.setTextColor(60, 90, 70);
  doc.text(lang === "de" ? "ICD-10 Codes" : "ICD-10 Codes", margin, y);
  y += 7;

  // Column layout
  const colCode = margin;
  const colDesc = margin + 22;
  const colCat = margin + contentWidth - 55;
  const colSource = margin + contentWidth - 25;
  const colConf = margin + contentWidth;

  // Table header row
  doc.setFillColor(60, 90, 70);
  doc.roundedRect(margin, y - 4, contentWidth, 8, 1, 1, "F");
  doc.setFontSize(8);
  doc.setFont("helvetica", "bold");
  doc.setTextColor(255);
  doc.text("ICD-10", colCode + 2, y);
  doc.text(lang === "de" ? "Beschreibung" : "Description", colDesc, y);
  doc.text(lang === "de" ? "Kategorie" : "Category", colCat, y);
  doc.text(lang === "de" ? "Quelle" : "Source", colSource, y);
  doc.text("%", colConf - 2, y, { align: "right" });
  y += 6;

  // === Table Rows ===
  doc.setFontSize(8);
  codes.forEach((code, idx) => {
    addPageIfNeeded(10);

    // Alternating row background
    if (idx % 2 === 0) {
      doc.setFillColor(250, 252, 250);
      doc.rect(margin, y - 3.5, contentWidth, 7, "F");
    }

    doc.setFont("helvetica", "bold");
    doc.setTextColor(40);
    doc.text(code.code, colCode + 2, y);

    doc.setFont("helvetica", "normal");
    doc.setTextColor(60);
    const desc = lang === "de" ? code.descDe : code.descEn;
    const maxDescWidth = colCat - colDesc - 3;
    const truncated = doc.getTextWidth(desc) > maxDescWidth
      ? desc.substring(0, Math.floor(desc.length * (maxDescWidth / doc.getTextWidth(desc)))) + "…"
      : desc;
    doc.text(truncated, colDesc, y);

    doc.setTextColor(100);
    doc.text(code.category, colCat, y);

    // Source badge
    const sourceLabel = code.source === "fixed"
      ? (lang === "de" ? "Fix" : "Fixed")
      : (lang === "de" ? "KI" : "AI");
    if (code.source === "ai") {
      doc.setTextColor(100, 60, 180);
    } else {
      doc.setTextColor(60, 120, 80);
    }
    doc.text(sourceLabel, colSource, y);

    doc.setTextColor(80);
    const confText = code.confidence != null ? `${Math.round(code.confidence * 100)}%` : "–";
    doc.text(confText, colConf - 2, y, { align: "right" });

    y += 7;
  });

  y += 5;

  // === Disclaimer ===
  addPageIfNeeded(25);
  doc.setFillColor(255, 248, 235);
  doc.roundedRect(margin, y, contentWidth, 22, 2, 2, "F");
  doc.setDrawColor(230, 190, 100);
  doc.roundedRect(margin, y, contentWidth, 22, 2, 2, "S");
  doc.setFontSize(8);
  doc.setFont("helvetica", "bold");
  doc.setTextColor(160, 120, 30);
  doc.text(lang === "de" ? "⚠ Hinweis:" : "⚠ Notice:", margin + 4, y + 5);
  doc.setFont("helvetica", "normal");
  doc.setTextColor(130, 95, 20);
  const disclaimerText = lang === "de"
    ? "Diese ICD-10-Codes wurden automatisch generiert und dienen ausschließlich als Vorschlag für den behandelnden Therapeuten. KI-basierte Zuordnungen sind mit einer Konfidenz versehen und müssen vom Therapeuten validiert werden. Kein Ersatz für eine ärztliche Diagnose."
    : "These ICD-10 codes were automatically generated and serve only as suggestions for the treating therapist. AI-based mappings include a confidence score and must be validated by the therapist. Not a substitute for medical diagnosis.";
  const disclaimerLines = doc.splitTextToSize(disclaimerText, contentWidth - 10);
  doc.text(disclaimerLines, margin + 4, y + 10);

  // === DSGVO Footer ===
  y += 28;
  addPageIfNeeded(10);
  doc.setFontSize(7);
  doc.setTextColor(150);
  doc.text(
    lang === "de"
      ? "DSGVO-konform erstellt. Patientendaten werden gemäß Datenschutzgrundverordnung verarbeitet."
      : "Created in GDPR compliance. Patient data is processed according to the General Data Protection Regulation.",
    margin,
    y
  );

  // Add footer to all pages
  const totalPages = doc.getNumberOfPages();
  for (let i = 1; i <= totalPages; i++) {
    doc.setPage(i);
    doc.setFontSize(8);
    doc.setTextColor(150);
    doc.text(
      `${lang === "de" ? "Seite" : "Page"} ${i}/${totalPages}`,
      pageWidth / 2,
      pageHeight - 10,
      { align: "center" }
    );
    doc.text(
      lang === "de" ? "Naturheilpraxis Peter Rauch – ICD-10 Diagnoseübersicht" : "Naturopathic Practice Peter Rauch – ICD-10 Diagnosis Overview",
      pageWidth / 2,
      pageHeight - 6,
      { align: "center" }
    );
  }

  // Save or return base64
  const safePatientName = patientName.replace(/[^a-zA-Z0-9äöüÄÖÜß\s-]/g, "").replace(/\s+/g, "_");
  const dateStr = new Date().toISOString().split("T")[0];

  if (options?.returnBase64) {
    return doc.output("datauristring").split(",")[1];
  }

  doc.save(`ICD10_${safePatientName}_${dateStr}.pdf`);
}
