import jsPDF from "jspdf";

type Language = "de" | "en";

interface DatenschutzPdfOptions {
  language: Language;
}

export const generateDatenschutzPdf = ({ language }: DatenschutzPdfOptions) => {
  const t = (de: string, en: string) => (language === "de" ? de : en);
  
  const doc = new jsPDF();
  const pageWidth = doc.internal.pageSize.getWidth();
  const pageHeight = doc.internal.pageSize.getHeight();
  const margin = 20;
  const contentWidth = pageWidth - 2 * margin;
  let yPosition = margin;

  // Helper functions
  const addTitle = (text: string) => {
    doc.setFontSize(18);
    doc.setFont("helvetica", "bold");
    doc.text(text, pageWidth / 2, yPosition, { align: "center" });
    yPosition += 10;
  };

  const addSubtitle = (text: string) => {
    doc.setFontSize(11);
    doc.setFont("helvetica", "normal");
    doc.text(text, pageWidth / 2, yPosition, { align: "center" });
    yPosition += 8;
  };

  const addSectionHeader = (text: string) => {
    checkPageBreak(15);
    doc.setFontSize(12);
    doc.setFont("helvetica", "bold");
    doc.text(text, margin, yPosition);
    yPosition += 7;
  };

  const addParagraph = (text: string) => {
    doc.setFontSize(10);
    doc.setFont("helvetica", "normal");
    const lines = doc.splitTextToSize(text, contentWidth);
    
    lines.forEach((line: string) => {
      checkPageBreak(6);
      doc.text(line, margin, yPosition);
      yPosition += 5;
    });
    yPosition += 3;
  };

  const addSpacing = (space: number = 5) => {
    yPosition += space;
  };

  const checkPageBreak = (requiredSpace: number) => {
    if (yPosition + requiredSpace > pageHeight - margin) {
      doc.addPage();
      yPosition = margin;
    }
  };

  const addFooter = () => {
    const pageCount = doc.getNumberOfPages();
    for (let i = 1; i <= pageCount; i++) {
      doc.setPage(i);
      doc.setFontSize(8);
      doc.setFont("helvetica", "normal");
      doc.text(
        `${t("Seite", "Page")} ${i} ${t("von", "of")} ${pageCount}`,
        pageWidth / 2,
        pageHeight - 10,
        { align: "center" }
      );
    }
  };

  // Title
  addTitle(t("Datenschutzinformation", "Privacy Policy"));
  addSubtitle(t("Naturheilpraxis Peter Rauch", "Naturheilpraxis Peter Rauch"));
  addSpacing(3);

  // Practice Info
  doc.setFontSize(9);
  doc.setFont("helvetica", "normal");
  doc.text("Friedrich-Deffner-Straße 19a, 86163 Augsburg", pageWidth / 2, yPosition, { align: "center" });
  yPosition += 5;
  doc.text("Tel: 0821-2621462 | E-Mail: info@rauch-heilpraktiker.de", pageWidth / 2, yPosition, { align: "center" });
  yPosition += 10;

  // DSGVO Badge
  doc.setFillColor(240, 245, 240);
  doc.roundedRect(margin, yPosition - 3, contentWidth, 10, 2, 2, "F");
  doc.setFontSize(9);
  doc.setFont("helvetica", "bold");
  doc.text(
    t("DSGVO-konform · TLS-verschlüsselt · 2FA-geschützt", "GDPR Compliant · TLS Encrypted · 2FA Protected"),
    pageWidth / 2,
    yPosition + 3,
    { align: "center" }
  );
  yPosition += 15;

  // Verantwortlicher
  addSectionHeader(t("Verantwortlicher (Art. 4 Abs. 7 DSGVO)", "Data Controller (Art. 4(7) GDPR)"));
  addParagraph("Peter Rauch, Heilpraktiker");
  addParagraph("Friedrich-Deffner-Straße 19a, 86163 Augsburg");
  addParagraph("Tel: 0821-2621462, E-Mail: info@rauch-heilpraktiker.de");
  addSpacing(5);

  // Introduction
  addSectionHeader(t("Einführung", "Introduction"));
  addParagraph(
    t(
      "Liebe Patientin, lieber Patient, wir brauchen Ihre Daten, um Sie richtig zu behandeln. Ohne diese Daten dürfen wir Sie gesetzlich (DSGVO) nicht behandeln. Hier steht, wofür wir was brauchen und welche Rechte Sie haben.",
      "Dear Patient, we need your data to treat you properly. Without this data, we are legally (GDPR) not allowed to treat you. Here you can find what we need your data for and what rights you have."
    )
  );

  // Sections
  const sections = [
    {
      title: t("Was wir von Ihnen haben", "What We Collect"),
      content: t(
        "Name, Adresse, E-Mail, Gesundheitsdaten (Anamnese, Diagnosen, Therapien), Messwerte von Geräten (Metatron, Vieva Pro, EAV, Trikombin).",
        "Name, address, email, health data (medical history, diagnoses, therapies), measurements from devices (Metatron, Vieva Pro, EAV, Trikombin)."
      ),
    },
    {
      title: t("Wofür wir Ihre Daten brauchen", "Purpose of Data Collection"),
      content: t(
        "Behandlung, Rechnungsversand per E-Mail, Kommunikation (Termine, Infos etc.).",
        "Treatment, sending invoices via email, communication (appointments, information, etc.)."
      ),
    },
    {
      title: t("Rechtsgrundlage", "Legal Basis"),
      content: t(
        "Die Verarbeitung Ihrer Gesundheitsdaten erfolgt auf Grundlage von Art. 6 Abs. 1 lit. b DSGVO (Behandlungsvertrag) sowie Art. 9 Abs. 2 lit. h DSGVO (Gesundheitsversorgung). Für die 2-Faktor-Authentifizierung: Art. 6 Abs. 1 lit. f DSGVO (berechtigtes Interesse an Datensicherheit).",
        "Processing of your health data is based on Art. 6(1)(b) GDPR (treatment contract) and Art. 9(2)(h) GDPR (healthcare provision). For 2-factor authentication: Art. 6(1)(f) GDPR (legitimate interest in data security)."
      ),
    },
    {
      title: t("Datensicherheit", "Data Security"),
      content: t(
        "Ihre Daten werden durch folgende Maßnahmen geschützt: TLS-Verschlüsselung bei der Übertragung, verschlüsselte Speicherung in der Datenbank, Zwei-Faktor-Authentifizierung (2FA) per E-Mail, automatische Sitzungsbeendigung und Zugriffskontrolle nach dem Minimalprinzip (nur Sie und der Behandler haben Zugriff).",
        "Your data is protected by: TLS encryption during transmission, encrypted database storage, two-factor authentication (2FA) via email, automatic session termination, and access control based on the principle of least privilege (only you and the practitioner have access)."
      ),
    },
    {
      title: t("Wer bekommt Ihre Daten?", "Who Receives Your Data?"),
      content: t(
        "Nur andere Ärzte/Heilpraktiker (wenn nötig und mit Ihrer Zustimmung), Krankenkassen oder Steuerberater – sonst niemand ohne Ihre ausdrückliche Einwilligung. Ihre Daten werden nicht an Drittländer übermittelt.",
        "Only other doctors/practitioners (if necessary and with your consent), health insurance companies or tax advisors – no one else without your explicit consent. Your data is not transferred to third countries."
      ),
    },
    {
      title: t("Wie lange speichern wir?", "Storage Duration"),
      content: t(
        "Gemäß der berufsrechtlichen Aufbewahrungspflicht für Heilpraktiker: mindestens 10 Jahre nach Abschluss der Behandlung. Danach werden alle Daten sicher gelöscht.",
        "According to professional retention requirements for naturopaths: at least 10 years after completion of treatment. After that, all data will be securely deleted."
      ),
    },
    {
      title: t("Ihre Rechte", "Your Rights"),
      content: t(
        "Sie haben das Recht auf: Auskunft (Art. 15 DSGVO), Berichtigung (Art. 16), Löschung nach Ablauf der Aufbewahrungsfrist (Art. 17), Einschränkung der Verarbeitung (Art. 18), Datenübertragbarkeit (Art. 20), Widerspruch (Art. 21) und Widerruf Ihrer Einwilligung jederzeit mit Wirkung für die Zukunft.",
        "You have the right to: Access (Art. 15 GDPR), Rectification (Art. 16), Deletion after expiry of retention period (Art. 17), Restriction of processing (Art. 18), Data portability (Art. 20), Objection (Art. 21), and withdrawal of your consent at any time with effect for the future."
      ),
    },
    {
      title: t("Beschwerderecht", "Right to Complain"),
      content: t(
        "Sie haben das Recht, sich bei der zuständigen Aufsichtsbehörde zu beschweren: Bayerisches Landesamt für Datenschutzaufsicht (BayLDA), Promenade 18, 91522 Ansbach, www.lda.bayern.de",
        "You have the right to lodge a complaint with the supervisory authority: Bavarian State Office for Data Protection Supervision (BayLDA), Promenade 18, 91522 Ansbach, Germany, www.lda.bayern.de"
      ),
    },
  ];

  sections.forEach((section) => {
    addSectionHeader(section.title);
    addParagraph(section.content);
    addSpacing(3);
  });

  // Consent Section
  addSpacing(5);
  addSectionHeader(t("Einwilligung für Behandlungsdaten", "Consent for Treatment Data"));
  addParagraph(
    t(
      "Ich erlaube, dass meine Gesundheitsdaten (inkl. Messungen Metatron/Vieva Pro/EAV/Trikombin) für meine Behandlung gespeichert werden. E-Mail-Kommunikation (Rechnungen, Termine, Fragen, Anfragen für eine Bewertung) ist ok. Ich kann meine Einwilligung jederzeit mit Wirkung für die Zukunft widerrufen (per Mail an info@rauch-heilpraktiker.de).",
      "I allow my health data (including Metatron/Vieva Pro/EAV/Trikombin measurements) to be stored for my treatment. Email communication (invoices, appointments, questions, review requests) is acceptable. I can withdraw my consent at any time with effect for the future (via email to info@rauch-heilpraktiker.de)."
    )
  );
  addParagraph(
    t(
      "Die Einwilligung erfolgt digital im Rahmen des Anamnesebogens mit 2-Faktor-Bestätigung gemäß § 126a BGB.",
      "Consent is given digitally as part of the medical history form with 2-factor confirmation according to § 126a BGB."
    )
  );

  // Contact
  addSpacing(5);
  addSectionHeader(t("Kontakt für Datenschutzanfragen", "Contact for Privacy Inquiries"));
  addParagraph(
    t(
      "Bei Fragen zum Datenschutz oder zur Ausübung Ihrer Rechte wenden Sie sich bitte an:",
      "For questions about data protection or to exercise your rights, please contact:"
    )
  );
  addParagraph("E-Mail: info@rauch-heilpraktiker.de | Tel: 0821-2621462");

  // Last Updated
  addSpacing(10);
  doc.setFontSize(9);
  doc.setFont("helvetica", "italic");
  doc.text(t("Stand: Januar 2026", "Last updated: January 2026"), pageWidth / 2, yPosition, { align: "center" });

  // Add footer with page numbers
  addFooter();

  // Save
  const fileName = t("Datenschutzinformation_Naturheilpraxis_Rauch.pdf", "Privacy_Policy_Naturheilpraxis_Rauch.pdf");
  doc.save(fileName);
};
