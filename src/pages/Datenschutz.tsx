import { Layout } from "@/components/layout/Layout";
import { useLanguage } from "@/contexts/LanguageContext";
import { Shield, Lock, Database, Share2, Clock, UserCheck, Mail, Phone, MapPin } from "lucide-react";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";

export default function Datenschutz() {
  const { t } = useLanguage();

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
      icon: Share2,
      title: t("Wer bekommt Ihre Daten?", "Who Receives Your Data?"),
      content: t(
        "Nur andere Ärzte/Heilpraktiker (wenn nötig), Krankenkassen oder Steuerberater – sonst niemand ohne Ihre Zustimmung.",
        "Only other doctors/practitioners (if necessary), health insurance companies or tax advisors – no one else without your consent."
      ),
    },
    {
      icon: Clock,
      title: t("Wie lange speichern wir?", "Storage Duration"),
      content: t(
        "Mindestens 10 Jahre (Gesetz), danach löschen wir alles.",
        "At least 10 years (legal requirement), after which we delete everything."
      ),
    },
    {
      icon: UserCheck,
      title: t("Ihre Rechte", "Your Rights"),
      content: t(
        "Jederzeit fragen, ändern oder löschen lassen (nach 10 Jahren). Einfach per Mail oder Brief an uns – kostenlos. Beschwerde? An die Datenschutzbehörde Bayern.",
        "You can request, modify or delete your data at any time (after 10 years). Simply contact us by email or letter – free of charge. Complaints can be directed to the Bavarian Data Protection Authority."
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
        </div>

        {/* Practice Info */}
        <Card className="mx-auto mb-8 max-w-4xl border-primary/20 bg-sage-50">
          <CardContent className="pt-6">
            <div className="text-center">
              <h2 className="font-serif text-xl font-semibold text-foreground">
                Naturheilpraxis Peter Rauch
              </h2>
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
                  "Ich erlaube, dass meine Gesundheitsdaten (inkl. Messungen Metatron/Vieva Pro/EAV/Trikombin) für meine Behandlung gespeichert werden. E-Mail-Kommunikation (Rechnungen, Termine) ist ok. Kann jederzeit kündigen (per Mail).",
                  "I allow my health data (including Metatron/Vieva Pro/EAV/Trikombin measurements) to be stored for my treatment. Email communication (invoices, appointments) is acceptable. I can withdraw consent at any time (via email)."
                )}
              </p>
              <p className="text-sm text-muted-foreground italic">
                {t(
                  "Die Einwilligung erfolgt digital im Rahmen des Anamnesebogens.",
                  "Consent is given digitally as part of the medical history form."
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
