import { Layout } from "@/components/layout/Layout";
import { useLanguage } from "@/contexts/LanguageContext";
import { Shield, Lock, Database, Share2, Clock, UserCheck, Mail, Phone, MapPin, Scale, ShieldCheck, AlertCircle, Download } from "lucide-react";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { generateDatenschutzPdf } from "@/lib/datenschutzPdfExport";

export default function Datenschutz() {
  const { t, language } = useLanguage();

  const handleDownloadPdf = () => {
    generateDatenschutzPdf({ language });
  };

  const sections = [
    {
      icon: Database,
      title: t("Was wir von Ihnen haben", "What We Collect"),
      content: t(
        "Name, Adresse, E-Mail, Gesundheitsdaten (Anamnese, Diagnosen, Therapien), Messwerte von Geräten (Metatron, Vieva Pro, EAV, Trikombin).",
        "Name, address, email, health data (medical history, diagnoses, therapies), measurements from devices (Metatron, Vieva Pro, EAV, Trikombin)."
      ),
    },
    {
      icon: Shield,
      title: t("Wofür wir Ihre Daten brauchen", "Purpose of Data Collection"),
      content: t(
        "Behandlung, Rechnungsversand per E-Mail, Kommunikation (Termine, Infos etc.).",
        "Treatment, sending invoices via email, communication (appointments, information, etc.)."
      ),
    },
    {
      icon: Scale,
      title: t("Rechtsgrundlage", "Legal Basis"),
      content: t(
        "Die Verarbeitung Ihrer Gesundheitsdaten erfolgt auf Grundlage von Art. 6 Abs. 1 lit. b DSGVO (Behandlungsvertrag) sowie Art. 9 Abs. 2 lit. h DSGVO (Gesundheitsversorgung). Für die 2-Faktor-Authentifizierung: Art. 6 Abs. 1 lit. f DSGVO (berechtigtes Interesse an Datensicherheit).",
        "Processing of your health data is based on Art. 6(1)(b) GDPR (treatment contract) and Art. 9(2)(h) GDPR (healthcare provision). For 2-factor authentication: Art. 6(1)(f) GDPR (legitimate interest in data security)."
      ),
    },
    {
      icon: ShieldCheck,
      title: t("Datensicherheit", "Data Security"),
      content: t(
        "Ihre Daten werden durch folgende Maßnahmen geschützt: TLS-Verschlüsselung bei der Übertragung, verschlüsselte Speicherung in der Datenbank, Zwei-Faktor-Authentifizierung (2FA) per E-Mail, automatische Sitzungsbeendigung und Zugriffskontrolle nach dem Minimalprinzip (nur Sie und der Behandler haben Zugriff).",
        "Your data is protected by: TLS encryption during transmission, encrypted database storage, two-factor authentication (2FA) via email, automatic session termination, and access control based on the principle of least privilege (only you and the practitioner have access)."
      ),
    },
    {
      icon: Share2,
      title: t("Wer bekommt Ihre Daten?", "Who Receives Your Data?"),
      content: t(
        "Nur andere Ärzte/Heilpraktiker (wenn nötig und mit Ihrer Zustimmung), Krankenkassen oder Steuerberater – sonst niemand ohne Ihre ausdrückliche Einwilligung. Ihre Daten werden nicht an Drittländer übermittelt.",
        "Only other doctors/practitioners (if necessary and with your consent), health insurance companies or tax advisors – no one else without your explicit consent. Your data is not transferred to third countries."
      ),
    },
    {
      icon: Clock,
      title: t("Wie lange speichern wir?", "Storage Duration"),
      content: t(
        "Gemäß der berufsrechtlichen Aufbewahrungspflicht für Heilpraktiker: mindestens 10 Jahre nach Abschluss der Behandlung. Danach werden alle Daten sicher gelöscht.",
        "According to professional retention requirements for naturopaths: at least 10 years after completion of treatment. After that, all data will be securely deleted."
      ),
    },
    {
      icon: UserCheck,
      title: t("Ihre Rechte", "Your Rights"),
      content: t(
        "Sie haben das Recht auf: Auskunft (Art. 15 DSGVO), Berichtigung (Art. 16), Löschung nach Ablauf der Aufbewahrungsfrist (Art. 17), Einschränkung der Verarbeitung (Art. 18), Datenübertragbarkeit (Art. 20), Widerspruch (Art. 21) und Widerruf Ihrer Einwilligung jederzeit mit Wirkung für die Zukunft.",
        "You have the right to: Access (Art. 15 GDPR), Rectification (Art. 16), Deletion after expiry of retention period (Art. 17), Restriction of processing (Art. 18), Data portability (Art. 20), Objection (Art. 21), and withdrawal of your consent at any time with effect for the future."
      ),
    },
    {
      icon: AlertCircle,
      title: t("Beschwerderecht", "Right to Complain"),
      content: t(
        "Sie haben das Recht, sich bei der zuständigen Aufsichtsbehörde zu beschweren: Bayerisches Landesamt für Datenschutzaufsicht (BayLDA), Promenade 18, 91522 Ansbach, www.lda.bayern.de",
        "You have the right to lodge a complaint with the supervisory authority: Bavarian State Office for Data Protection Supervision (BayLDA), Promenade 18, 91522 Ansbach, Germany, www.lda.bayern.de"
      ),
    },
  ];

  return (
    <Layout>
      <div className="container py-12 md:py-16">
        {/* Header */}
        <div className="mb-12 text-center">
          <div className="mb-4 inline-flex items-center justify-center rounded-full bg-primary/10 p-3">
            <Shield className="h-8 w-8 text-primary" />
          </div>
          <h1 className="font-serif text-3xl font-bold text-foreground md:text-4xl">
            {t("Ihre Daten in unserer Praxis", "Your Data in Our Practice")}
          </h1>
          <p className="mt-4 text-lg text-muted-foreground">
            {t("Ganz einfach erklärt", "Simply explained")}
          </p>
          <Button 
            onClick={handleDownloadPdf}
            variant="outline"
            className="mt-6 gap-2"
          >
            <Download className="h-4 w-4" />
            {t("Als PDF herunterladen", "Download as PDF")}
          </Button>
        </div>

        {/* Practice Info */}
        <Card className="mx-auto mb-8 max-w-4xl border-primary/20 bg-sage-50">
          <CardContent className="pt-6">
            <div className="text-center">
              <h2 className="font-serif text-xl font-semibold text-foreground">
                Naturheilpraxis Peter Rauch
              </h2>
              <p className="mt-1 text-sm text-muted-foreground">
                {t("Verantwortlicher gemäß Art. 4 Abs. 7 DSGVO", "Data Controller according to Art. 4(7) GDPR")}
              </p>
              <div className="mt-3 flex flex-col items-center gap-2 text-muted-foreground sm:flex-row sm:justify-center sm:gap-6">
                <span className="flex items-center gap-2">
                  <MapPin className="h-4 w-4" />
                  Friedrich-Deffner-Straße 19a, 86163 Augsburg
                </span>
                <span className="flex items-center gap-2">
                  <Phone className="h-4 w-4" />
                  0821-2621462
                </span>
                <span className="flex items-center gap-2">
                  <Mail className="h-4 w-4" />
                  info@rauch-heilpraktiker.de
                </span>
              </div>
            </div>
          </CardContent>
        </Card>

        {/* Introduction */}
        <div className="mx-auto mb-8 max-w-4xl">
          <Card className="border-sage-200">
            <CardContent className="pt-6">
              <p className="text-lg leading-relaxed text-foreground">
                {t(
                  "Liebe Patientin, lieber Patient, wir brauchen Ihre Daten, um Sie richtig zu behandeln. Ohne diese Daten dürfen wir Sie gesetzlich (DSGVO) nicht behandeln. Hier steht, wofür wir was brauchen und welche Rechte Sie haben.",
                  "Dear Patient, we need your data to treat you properly. Without this data, we are legally (GDPR) not allowed to treat you. Here you can find what we need your data for and what rights you have."
                )}
              </p>
            </CardContent>
          </Card>
        </div>

        {/* DSGVO Badge */}
        <div className="mb-8 flex justify-center">
          <div className="inline-flex items-center gap-2 rounded-full bg-sage-100 px-4 py-2 text-sm font-medium text-primary">
            <Lock className="h-4 w-4" />
            {t("DSGVO-konform · TLS-verschlüsselt · 2FA-geschützt", "GDPR Compliant · TLS Encrypted · 2FA Protected")}
          </div>
        </div>

        {/* Content Sections */}
        <div className="mx-auto max-w-4xl space-y-6">
          {sections.map((section, index) => (
            <Card key={index} className="border-sage-200">
              <CardHeader className="flex flex-row items-center gap-4 pb-2">
                <div className="flex h-10 w-10 items-center justify-center rounded-full bg-primary/10">
                  <section.icon className="h-5 w-5 text-primary" />
                </div>
                <CardTitle className="font-serif text-xl">{section.title}</CardTitle>
              </CardHeader>
              <CardContent className="pl-[4.5rem]">
                <p className="text-muted-foreground leading-relaxed">{section.content}</p>
              </CardContent>
            </Card>
          ))}

          {/* Consent Section */}
          <Card className="border-primary/30 bg-sage-50">
            <CardHeader>
              <CardTitle className="font-serif text-xl">
                {t("Einwilligung für Behandlungsdaten", "Consent for Treatment Data")}
              </CardTitle>
            </CardHeader>
            <CardContent className="space-y-4">
              <p className="text-muted-foreground leading-relaxed">
                {t(
                  "Ich erlaube, dass meine Gesundheitsdaten (inkl. Messungen Metatron/Vieva Pro/EAV/Trikombin) für meine Behandlung gespeichert werden. E-Mail-Kommunikation (Rechnungen, Termine, Fragen, Anfragen für eine Bewertung) ist ok. Ich kann meine Einwilligung jederzeit mit Wirkung für die Zukunft widerrufen (per Mail an info@rauch-heilpraktiker.de).",
                  "I allow my health data (including Metatron/Vieva Pro/EAV/Trikombin measurements) to be stored for my treatment. Email communication (invoices, appointments, questions, review requests) is acceptable. I can withdraw my consent at any time with effect for the future (via email to info@rauch-heilpraktiker.de)."
                )}
              </p>
              <p className="text-sm text-muted-foreground italic">
                {t(
                  "Die Einwilligung erfolgt digital im Rahmen des Anamnesebogens mit 2-Faktor-Bestätigung gemäß § 126a BGB.",
                  "Consent is given digitally as part of the medical history form with 2-factor confirmation according to § 126a BGB."
                )}
              </p>
            </CardContent>
          </Card>

          {/* Contact Section */}
          <Card className="border-primary/20 bg-sage-50">
            <CardHeader>
              <CardTitle className="font-serif text-xl">
                {t("Kontakt für Datenschutzanfragen", "Contact for Privacy Inquiries")}
              </CardTitle>
            </CardHeader>
            <CardContent className="space-y-4">
              <p className="text-muted-foreground">
                {t(
                  "Bei Fragen zum Datenschutz oder zur Ausübung Ihrer Rechte wenden Sie sich bitte an:",
                  "For questions about data protection or to exercise your rights, please contact:"
                )}
              </p>
              <div className="flex flex-col gap-3 sm:flex-row sm:gap-6">
                <a
                  href="mailto:info@rauch-heilpraktiker.de"
                  className="inline-flex items-center gap-2 text-primary hover:underline"
                >
                  <Mail className="h-4 w-4" />
                  info@rauch-heilpraktiker.de
                </a>
                <a
                  href="tel:+498212621462"
                  className="inline-flex items-center gap-2 text-primary hover:underline"
                >
                  <Phone className="h-4 w-4" />
                  0821-2621462
                </a>
              </div>
            </CardContent>
          </Card>

          {/* Last Updated */}
          <p className="text-center text-sm text-muted-foreground">
            {t("Stand: Januar 2026", "Last updated: January 2026")}
          </p>
        </div>
      </div>
    </Layout>
  );
}
