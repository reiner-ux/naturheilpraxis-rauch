import { Layout } from "@/components/layout/Layout";
import { useLanguage } from "@/contexts/LanguageContext";
import { Shield, Lock, Eye, FileText, UserCheck, Clock, Mail, Phone } from "lucide-react";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";

export default function Datenschutz() {
  const { t } = useLanguage();

  const sections = [
    {
      icon: Shield,
      title: t("Verantwortlicher", "Data Controller"),
      content: t(
        "Verantwortlich für die Datenverarbeitung ist: Peter Rauch, Naturheilpraxis Rauch. Kontakt: info@rauch-heilpraktiker.de",
        "Responsible for data processing: Peter Rauch, Naturheilpraxis Rauch. Contact: info@rauch-heilpraktiker.de"
      ),
    },
    {
      icon: FileText,
      title: t("Erhobene Daten", "Data Collected"),
      content: t(
        "Im Rahmen des Anamnesebogens erheben wir: Persönliche Daten (Name, Geburtsdatum, Kontaktdaten), Gesundheitsdaten (Vorerkrankungen, Medikamente, Beschwerden), sowie Ihre digitale Unterschrift zur Bestätigung.",
        "As part of the medical history form, we collect: Personal data (name, date of birth, contact details), health data (pre-existing conditions, medications, complaints), and your digital signature for confirmation."
      ),
    },
    {
      icon: Lock,
      title: t("Zweck der Verarbeitung", "Purpose of Processing"),
      content: t(
        "Ihre Daten werden ausschließlich zur Vorbereitung und Durchführung der heilpraktischen Behandlung verwendet. Eine Weitergabe an Dritte erfolgt nicht ohne Ihre ausdrückliche Einwilligung.",
        "Your data is used exclusively for the preparation and execution of naturopathic treatment. No disclosure to third parties without your explicit consent."
      ),
    },
    {
      icon: UserCheck,
      title: t("Rechtsgrundlage", "Legal Basis"),
      content: t(
        "Die Verarbeitung erfolgt auf Grundlage von Art. 6 Abs. 1 lit. b DSGVO (Vertragserfüllung) sowie Art. 9 Abs. 2 lit. h DSGVO (Gesundheitsversorgung). Für die 2FA-Authentifizierung: Art. 6 Abs. 1 lit. f DSGVO (berechtigtes Interesse an Datensicherheit).",
        "Processing is based on Art. 6(1)(b) GDPR (contract performance) and Art. 9(2)(h) GDPR (healthcare). For 2FA authentication: Art. 6(1)(f) GDPR (legitimate interest in data security)."
      ),
    },
    {
      icon: Clock,
      title: t("Speicherdauer", "Storage Duration"),
      content: t(
        "Gemäß der berufsrechtlichen Aufbewahrungspflicht für Heilpraktiker werden Ihre Behandlungsdaten für 10 Jahre nach Abschluss der Behandlung aufbewahrt. Danach werden sie sicher gelöscht.",
        "In accordance with professional retention requirements for naturopaths, your treatment data will be stored for 10 years after completion of treatment. After that, they will be securely deleted."
      ),
    },
    {
      icon: Eye,
      title: t("Ihre Rechte", "Your Rights"),
      content: t(
        "Sie haben das Recht auf: Auskunft über Ihre gespeicherten Daten, Berichtigung unrichtiger Daten, Löschung (soweit keine Aufbewahrungspflicht besteht), Einschränkung der Verarbeitung, Datenübertragbarkeit, sowie Widerspruch gegen die Verarbeitung.",
        "You have the right to: Access your stored data, Rectification of incorrect data, Deletion (where no retention obligation exists), Restriction of processing, Data portability, and Objection to processing."
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
            {t("Datenschutzverordnung", "Privacy Policy")}
          </h1>
          <p className="mt-4 text-lg text-muted-foreground">
            {t(
              "Informationen zum Schutz Ihrer personenbezogenen Daten gemäß DSGVO",
              "Information on the protection of your personal data according to GDPR"
            )}
          </p>
        </div>

        {/* DSGVO Badge */}
        <div className="mb-8 flex justify-center">
          <div className="inline-flex items-center gap-2 rounded-full bg-sage-100 px-4 py-2 text-sm font-medium text-primary">
            <Lock className="h-4 w-4" />
            {t("DSGVO-konform", "GDPR Compliant")}
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
                  href="tel:+4912345678"
                  className="inline-flex items-center gap-2 text-primary hover:underline"
                >
                  <Phone className="h-4 w-4" />
                  {t("Telefonisch erreichbar", "Available by phone")}
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
