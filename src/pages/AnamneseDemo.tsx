import { useState, useRef } from "react";
import { Layout } from "@/components/layout/Layout";
import { supabase } from "@/integrations/supabase/client";
import VerificationDialog from "@/components/anamnese/VerificationDialog";
import { Button } from "@/components/ui/button";
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card";
import {
  Accordion,
  AccordionContent,
  AccordionItem,
  AccordionTrigger,
} from "@/components/ui/accordion";
import { Badge } from "@/components/ui/badge";
import {
  User,
  Heart,
  Pill,
  AlertCircle,
  Leaf,
  Users,
  ChevronLeft,
  ChevronRight,
  Check,
  Sparkles,
  Stethoscope,
  Building2,
  AlertTriangle,
  ShieldAlert,
  Globe,
  Bug,
  Syringe,
  ClipboardList,
  Wand2,
  Home,
  PenTool,
  FileDown,
  Printer,
  ListFilter,
  Brain,
  Wind,
  Apple,
  FlaskConical,
  Droplets,
  Activity,
  Bone,
  Send,
  type LucideIcon,
} from "lucide-react";
import { useLanguage } from "@/contexts/LanguageContext";
import { formSections as formSectionsData, initialFormData, AnamneseFormData } from "@/lib/anamneseFormData";
import { generateEnhancedAnamnesePdf } from "@/lib/pdfExportEnhanced";
import PrintView from "@/components/anamnese/PrintView";
import FilteredSummaryView from "@/components/anamnese/FilteredSummaryView";

// Import section components
import IntroSection from "@/components/anamnese/IntroSection";
import PatientDataSection from "@/components/anamnese/PatientDataSection";
import FamilyHistorySection from "@/components/anamnese/FamilyHistorySection";
import NeurologySection from "@/components/anamnese/NeurologySection";
import HeartSection from "@/components/anamnese/HeartSection";
import LungSection from "@/components/anamnese/LungSection";
import DigestiveSection from "@/components/anamnese/DigestiveSection";
import LiverSection from "@/components/anamnese/LiverSection";
import KidneySection from "@/components/anamnese/KidneySection";
import HormoneSection from "@/components/anamnese/HormoneSection";
import MusculoskeletalSection from "@/components/anamnese/MusculoskeletalSection";
import WomenHealthSection from "@/components/anamnese/WomenHealthSection";
import MensHealthSection from "@/components/anamnese/MensHealthSection";
import SurgeriesSection from "@/components/anamnese/SurgeriesSection";
import CancerSection from "@/components/anamnese/CancerSection";
import AllergiesSection from "@/components/anamnese/AllergiesSection";
import MedicationsSection from "@/components/anamnese/MedicationsSection";
import LifestyleSection from "@/components/anamnese/LifestyleSection";
import DentalSection from "@/components/anamnese/DentalSection";
import EnvironmentSection from "@/components/anamnese/EnvironmentSection";
import InfectionsSection from "@/components/anamnese/InfectionsSection";
import VaccinationsSection from "@/components/anamnese/VaccinationsSection";
import ComplaintsSection from "@/components/anamnese/ComplaintsSection";
import PreferencesSection from "@/components/anamnese/PreferencesSection";
import SocialSection from "@/components/anamnese/SocialSection";
import SignatureSection from "@/components/anamnese/SignatureSection";
import { toast } from "sonner";

// Icon mapping
const iconMap: Record<string, LucideIcon> = {
  Sparkles, User, Users, Stethoscope, Heart, Building2, AlertTriangle,
  ShieldAlert, Pill, Leaf, Globe, Bug, Syringe, ClipboardList, Wand2,
  Home, PenTool, Brain, Wind, Apple, FlaskConical, Droplets, Activity, Bone,
};

const formSections = formSectionsData.map(section => ({
  ...section,
  Icon: iconMap[section.icon] || AlertCircle,
}));

// ============================================================
// Pre-filled demo data for fictional patient "Xaver Lovable"
// ============================================================
const xaverDemoData: AnamneseFormData = {
  ...initialFormData,

  // I. Patientendaten
  nachname: "Lovable",
  vorname: "Xaver",
  geburtsdatum: "1976-12-01",
  nationalitaet: "deutsch",
  geschlecht: "männlich",
  zivilstand: "verheiratet",
  strasse: "Musterstraße 42",
  plz: "86150",
  wohnort: "Augsburg",
  telefonPrivat: "0821 1234567",
  mobil: "0170 9876543",
  email: "peter@rauch-heilpraktiker.de",
  versicherungstyp: "gesetzlich",
  versicherungsname: "AOK Bayern",
  versicherungsnummer: "A123456789",
  beruf: "Softwareentwickler",
  arbeitgeber: "Lovable GmbH",
  branche: "IT",
  koerpergroesse: "182",
  gewicht: "87",
  informationsquelle: ["Internet", "Empfehlung"],
  empfehlungVon: "Dr. med. Schmidt",
  hausarzt: "Dr. med. Müller, Augsburg",
  fachaerzte: "Dr. Huber (Orthopäde)",
  facharztListe: [
    { fachrichtung: "Orthopädie", name: "Dr. Huber" },
  ],

  // II. Familiengeschichte
  familyHistory: {
    ...initialFormData.familyHistory,
    hoherBlutdruck: { ja: true, vater: true, mutter: false, grosseltern: true, geschwister: false },
    diabetes: { ja: true, vater: false, mutter: true, grosseltern: true, geschwister: false },
    herzinfarkt: { ja: true, vater: true, mutter: false, grosseltern: false, geschwister: false },
    allergien: { ja: true, vater: false, mutter: true, grosseltern: false, geschwister: true },
  },

  // III. Kopf & Sinne
  kopfErkrankungen: {
    ...initialFormData.kopfErkrankungen,
    kopfschmerzen: {
      ja: true, seit: "2018",
      rechts: false, links: false, hinterkopf: true, stirn: true,
      migraene: false, spannungskopfschmerz: true, clusterkopfschmerz: false,
      medikamenteninduziert: false, sonstige: "",
    },
    sinusitis: { ja: true, jahr: "2020", chronisch: true, akut: false, sonstige: "" },
  },

  // Schlaf & Psyche
  schlafSymptome: {
    ...initialFormData.schlafSymptome,
    schlafstörung: { ja: true, seit: "2019", status: "aktuell", bisJahr: "", einschlaf: false, durchschlaf: true, einUndDurchschlaf: false, aufwachZeit: "03:30" },
    konzentrationsstörung: { ja: true, seit: "2020", status: "aktuell", bisJahr: "", morgens: false, tagsueber: true, abends: false },
    stress: { ja: true, seit: "2019", beruflich: true, privat: false, beides: false },
    muedigkeit: { ja: true, seit: "2019", staendig: false, prozentVergleich: "60" },
  },

  // IV. Herz & Kreislauf
  herzKreislauf: {
    ...initialFormData.herzKreislauf,
    blutdruckHoch: { ja: true, jahr: "2020", grad: "Grad 1" },
  },

  // VI. Magen & Darm
  magenDarm: {
    ...initialFormData.magenDarm,
    sodbrennen: { ja: true, jahr: "2021", regelmaessig: false, gelegentlich: true },
    blaehungen: { ja: true, seit: "2020", morgens: false, nachEssen: true, staendig: false },
    reizdarm: { ja: true, jahr: "2022", diarrhoe: false, obstipation: false, wechselnd: true },
  },
  durst: "normal",
  appetit: "normal",
  ernaehrungstyp: "Mischkost",

  // X. Bewegungsapparat
  wirbelsaeuleGelenke: {
    ...initialFormData.wirbelsaeuleGelenke,
    lws: { ja: true, seit: "2015", verspannung: true, bsv: true, arthrose: false },
    hws: { ja: true, seit: "2018", verspannung: true, bsv: false, arthrose: false },
    knie: { ja: true, seit: "2019", rechts: true, links: false, beidseitig: false },
  },

  // VII. Allergien
  allergien: {
    ...initialFormData.allergien,
    inhalation: { ja: true, pollen: true, staub: true, tierhaare: false, schimmel: false },
    nahrungsmittel: { ja: true, details: "Nüsse (Walnüsse, Haselnüsse)", allergene: ["Walnüsse", "Haselnüsse"] },
    histamin: { ja: true, mild: false, moderat: true, schwer: false },
  },

  // VIII. Medikamente
  medikamente: {
    inAerztlicherBehandlung: { ja: true, beiWem: "Hausarzt Dr. Müller" },
    fachaerzte: "Orthopäde Dr. Huber",
    aktuelle: [
      { name: "Ramipril", dosierung: "5mg", taeglich: true, proWoche: "", grund: "Bluthochdruck", seit: "2020" },
      { name: "Ibuprofen", dosierung: "400mg", taeglich: false, proWoche: "2-3x", grund: "Rückenschmerzen", seit: "2022" },
    ],
    unvertraeglichkeiten: [
      { name: "Penicillin", allergie: true, unvertraeglichkeit: false, reaktion: "Hautausschlag" },
    ],
  },

  // IX. Lebensweise
  lebensweise: {
    ...initialFormData.lebensweise,
    raucher: "ehemals",
    exRaucherBisWann: "2015",
    alkohol: {
      ja: true,
      seitWann: "",
      mengeProTag: "",
      typ: "",
      typen: [{ typ: "Bier", menge: "2-3 Flaschen/Woche" }],
    },
    sport: {
      ja: true,
      proWoche: "2",
      art: "",
      arten: ["Wandern", "Radfahren"],
      sonstige: "",
    },
    taeglicheBewegung: { ja: true, details: "Spaziergang mit Hund" },
    spaziergang: { ja: true, proWoche: "5", dauerMinuten: "30" },
    schlafQualitaet: "mäßig",
    schlafDauer: "6",
    stressLevel: "moderat",
    ernaehrungsgewohnheiten: "Mischkost, wenig Fast Food",
    ernaehrungsTypen: ["Mischkost"],
  },

  // Zahngesundheit
  zahngesundheit: {
    ...initialFormData.zahngesundheit,
    gebissTyp: "vollstaendig",
    zahnbefunde: {
      "16": { diagnoses: ["wurzelbehandelt", "krone"], seit: "2018" },
      "26": { diagnoses: ["wurzelbehandelt"], seit: "2020" },
      "36": { diagnoses: ["amalgam"], bemerkung: "Amalgam 2019 entfernt, jetzt Kunststoff" },
      "46": { diagnoses: ["amalgam"], bemerkung: "Amalgam 2019 entfernt, jetzt Kunststoff" },
      "37": { diagnoses: ["karies"], seit: "2025" },
      "45": { diagnoses: ["bruecke"], seit: "2017" },
    },
    parodontitis: { ja: false, seitYear: "", seitMonth: "", status: "", bisYear: "", bisMonth: "", leicht: false, mittel: false, schwer: false },
    zahnfleischbluten: { ja: true, seitYear: "2023", seitMonth: "06", status: "nochVorhanden", bisYear: "", bisMonth: "" },
    kiefergelenk: { ja: true, knacken: true, schmerzen: false, eingeschraenkt: false },
    bruxismus: { ja: true, nachts: true, tagsueber: false, schiene: true },
    letzterZahnarztbesuch: "November 2025",
    zahnarztName: "Dr. Zahn, Augsburg",
    bemerkungen: "Amalgamsanierung 2019 durchgeführt. Gelegentlich empfindliche Zahnhälse bei kalten Getränken.",
  },

  // X. Umwelt
  umweltbelastungen: {
    ...initialFormData.umweltbelastungen,
    koerperbelastungen: {
      ...initialFormData.umweltbelastungen.koerperbelastungen,
      strahlung: { ja: true, geopathie: false, elektrosmog: true, hochspannung: false, funkmasten: false, wlan: true },
      zahnherde: { ja: true, wurzelbehandlungen: true, welcheZaehne: "16, 26" },
      quecksilber: { ja: true, welcheZaehne: "36, 46 (entfernt 2019)" },
    },
  },

  // XI. Infektionen
  infektionen: {
    ...initialFormData.infektionen,
    zeckenbiss: { ja: true, seit: "2017", roterHof: true },
    borreliose: { ja: true, jahr: "2017", stadium: "Stadium I" },
    hund: { ja: true, rasse: "Labrador" },
  },

  // XII. Impfungen
  impfungen: {
    ...initialFormData.impfungen,
    tetanus: { ja: true, jahr: "2019" },
    hepatitisB: { ja: true, jahr: "1998" },
    covid: {
      ...initialFormData.impfungen.covid,
      geimpft: true,
      dosis1: { ja: true, datum: "2021-06", hersteller: "BioNTech" },
      dosis2: { ja: true, datum: "2021-07", hersteller: "BioNTech" },
      dosis3: { ja: true, datum: "2022-01", hersteller: "BioNTech" },
      dosis4: { ja: false, datum: "", hersteller: "" },
      infiziert: { ja: true, wann: "2022-10", schwere: "mild" },
    },
  },

  // V. Unfälle & OPs
  unfaelleOperationen: {
    ...initialFormData.unfaelleOperationen,
    unfall: { ja: true, jahr: "2010", lokalisation: "Motorradunfall – LWS-Prellung" },
    operationen: [
      { jahr: "2016", grund: "Bandscheiben-OP LWS L4/L5" },
      { jahr: "2020", grund: "Arthroskopie rechtes Knie (Meniskus)" },
    ],
  },

  // XIII. Beschwerden
  beschwerden: {
    hauptbeschwerde: "Chronische Rückenschmerzen im Bereich der LWS mit Ausstrahlung ins rechte Bein, verstärkt durch langes Sitzen am Schreibtisch. Zusätzlich wiederkehrende Verdauungsprobleme (Blähungen, Reizdarm) und Schlafstörungen.",
    weitereBeschwerden: "Gelegentliche Spannungskopfschmerzen, Müdigkeit tagsüber, Pollenallergie im Frühjahr",
    beginnDerBeschwerden: "Rücken: seit 2015, Verdauung: seit 2020, Schlaf: seit 2019",
    verlauf: "wechselhaft",
    auftreten: ["tagsüber", "bei Belastung", "nach Mahlzeiten"],
    ausstrahlung: "rechtes Bein bis zum Knie",
    artDerBeschwerden: ["Schmerz", "Funktionsstörung"],
    schmerzqualitaet: ["ziehend", "dumpf"],
    schmerzintensitaet: "6",
    verschlimmerung: ["Anstrengung", "Stress", "Kälte"],
    verbesserung: ["Wärme", "Bewegung", "Ruhe"],
    bisherigeBehandlungen: "Physiotherapie, Osteopathie, Ibuprofen bei Bedarf, Bandscheiben-OP 2016",
    ergebnisBisherigerBehandlungen: "teilweise geholfen",
  },

  // XIV. Präferenzen
  behandlungspraeferenzen: {
    ...initialFormData.behandlungspraeferenzen,
    homoeopathie: { interesse: true, erfahren: false },
    biophysikalisch: { interesse: true, erfahren: false },
    metatron: { interesse: true, erfahren: false },
    akupunktur: { interesse: true, erfahren: true },
    phytotherapie: { interesse: true, erfahren: false },
  },
  therapieerwartungen: "Ich erhoffe mir eine ganzheitliche Betrachtung meiner Beschwerden und Unterstützung bei der Selbstheilung. Besonders wichtig ist mir, weniger auf Schmerzmittel angewiesen zu sein.",
  gesundheitsziele: "Schmerzfreier Alltag, besserer Schlaf, weniger Verdauungsprobleme, allgemein mehr Energie und Lebensqualität.",

  // XV. Soziales
  soziales: {
    familienstand: "verheiratet",
    kinderAnzahl: "2",
    kinderAlter: "8, 11",
    wohnumfeld: "Vorstadt",
    wohntyp: "Haus",
    berufStress: "moderat",
    finanzBelastung: "mild",
    sozialesNetzwerk: "gut",
    hobbys: "Wandern, Kochen, Gitarre spielen, Lesen",
  },

  // XVI. Unterschrift
  unterschrift: {
    ort: "Augsburg",
    datum: new Date().toISOString().split("T")[0],
    nameInDruckbuchstaben: "XAVER LOVABLE",
    bestaetigung: true,
    datenschutzEinwilligung: true,
    bestaetigung2fa: true,
    erziehungsberechtigter: "",
  },
};

export default function AnamneseDemo() {
  const { language } = useLanguage();
  const [formData, setFormData] = useState<AnamneseFormData>(xaverDemoData);
  const [openAccordionItems, setOpenAccordionItems] = useState<string[]>(["patientData"]);
  const [showPrintView, setShowPrintView] = useState(false);
  const [showFilteredSummary, setShowFilteredSummary] = useState(false);
  const [showVerification, setShowVerification] = useState(false);
  const [isSubmitting, setIsSubmitting] = useState(false);
  const [submissionId, setSubmissionId] = useState<string | null>(null);
  const [tempUserId, setTempUserId] = useState<string | null>(null);
  const printRef = useRef<HTMLDivElement>(null);

  const updateFormData = (field: string, value: any) => {
    setFormData((prev) => ({ ...prev, [field]: value }));
  };

  const handleExportPdf = () => {
    try {
      generateEnhancedAnamnesePdf({ formData, language: language as "de" | "en" });
      toast.success("PDF erstellt!");
    } catch (error) {
      console.error("PDF export error:", error);
      toast.error("PDF-Export fehlgeschlagen");
    }
  };

  const handlePrint = () => {
    setShowPrintView(true);
    setTimeout(() => {
      window.print();
      setTimeout(() => setShowPrintView(false), 500);
    }, 100);
  };

  const handleSubmit = async () => {
    setIsSubmitting(true);
    try {
      const { data, error } = await supabase.functions.invoke('submit-anamnesis', {
        body: {
          action: "submit",
          email: formData.email,
          formData,
          tempUserId: tempUserId || undefined,
        },
      });
      if (error) throw error;
      if (!data?.success) throw new Error(data?.error || "Submission failed");
      setSubmissionId(data.submissionId || null);
      if (data.tempUserId) setTempUserId(data.tempUserId);
      setShowVerification(true);
      toast.success(language === "de" ? "Bestätigungscode gesendet!" : "Verification code sent!", {
        description: `Code an ${formData.email} gesendet.`,
      });
    } catch (error: any) {
      toast.error("Fehler beim Absenden", { description: error?.message });
    } finally {
      setIsSubmitting(false);
    }
  };

  const handleVerifyCode = async (code: string) => {
    setIsSubmitting(true);
    try {
      const { data, error } = await supabase.functions.invoke('submit-anamnesis', {
        body: { action: "confirm", email: formData.email, code, submissionId, tempUserId, formData },
      });
      if (error) throw error;
      if (!data?.success) throw new Error(data?.error || "Verification failed");
      setShowVerification(false);
      toast.success("Anamnesebogen erfolgreich übermittelt!", { duration: 10000 });
    } catch (error: any) {
      toast.error("Verifizierung fehlgeschlagen", { description: error?.message });
    } finally {
      setIsSubmitting(false);
    }
  };

  const handleResendCode = async () => {
    await handleSubmit();
  };

  const renderSectionContent = (sectionId: string) => {
    switch (sectionId) {
      case "intro": return <IntroSection />;
      case "patientData": return <PatientDataSection formData={formData} updateFormData={updateFormData} />;
      case "familyHistory": return <FamilyHistorySection formData={formData} updateFormData={updateFormData} />;
      case "neurology": return <NeurologySection formData={formData} updateFormData={updateFormData} />;
      case "heart": return <HeartSection formData={formData} updateFormData={updateFormData} />;
      case "lung": return <LungSection formData={formData} updateFormData={updateFormData} />;
      case "digestive": return <DigestiveSection formData={formData} updateFormData={updateFormData} />;
      case "liver": return <LiverSection formData={formData} updateFormData={updateFormData} />;
      case "kidney": return <KidneySection formData={formData} updateFormData={updateFormData} />;
      case "hormone": return <HormoneSection formData={formData} updateFormData={updateFormData} />;
      case "musculoskeletal": return <MusculoskeletalSection formData={formData} updateFormData={updateFormData} />;
      case "womenHealth": return <WomenHealthSection formData={formData} updateFormData={updateFormData} />;
      case "mensHealth": return <MensHealthSection formData={formData} updateFormData={updateFormData} />;
      case "surgeries": return <SurgeriesSection formData={formData} updateFormData={updateFormData} />;
      case "cancer": return <CancerSection formData={formData} updateFormData={updateFormData} />;
      case "allergies": return <AllergiesSection formData={formData} updateFormData={updateFormData} />;
      case "medications": return <MedicationsSection formData={formData} updateFormData={updateFormData} />;
      case "lifestyle": return <LifestyleSection formData={formData} updateFormData={updateFormData} />;
      case "dental": return <DentalSection formData={formData} updateFormData={updateFormData} />;
      case "environment": return <EnvironmentSection formData={formData} updateFormData={updateFormData} />;
      case "infections": return <InfectionsSection formData={formData} updateFormData={updateFormData} />;
      case "vaccinations": return <VaccinationsSection formData={formData} updateFormData={updateFormData} />;
      case "complaints": return <ComplaintsSection formData={formData} updateFormData={updateFormData} />;
      case "preferences": return <PreferencesSection formData={formData} updateFormData={updateFormData} />;
      case "social": return <SocialSection formData={formData} updateFormData={updateFormData} />;
      case "signature": return <SignatureSection formData={formData} updateFormData={updateFormData} />;
      default: return null;
    }
  };

  return (
    <Layout>
      <div className="bg-gradient-to-b from-muted/30 to-background min-h-screen">
        {/* Header */}
        <div className="container py-8">
          <div className="text-center max-w-3xl mx-auto">
            <Badge variant="outline" className="mb-4 text-sm px-4 py-1 border-primary/30 text-primary">
              📋 Demo – Beispielpatient
            </Badge>
            <h1 className="text-3xl md:text-4xl font-serif font-semibold text-foreground mb-4">
              Anamnesebogen – Beispiel
            </h1>
            <p className="text-lg text-muted-foreground mb-2">
              Vollständig ausgefüllter Anamnesebogen für den fiktiven Patienten <strong>Xaver Lovable</strong> (geb. 01.12.1976)
            </p>
            <p className="text-sm text-muted-foreground">
              Diagnosen: Chronische Rückenschmerzen (LWS-BSV), Reizdarm, Spannungskopfschmerzen, Bluthochdruck Grad 1, Pollenallergie, Borreliose (2017), Z.n. Bandscheiben-OP (2016)
            </p>
          </div>
        </div>

        {/* Action Bar */}
        <div className="container mb-6">
          <div className="mx-auto max-w-4xl flex flex-wrap justify-center gap-3">
            <Button variant="outline" onClick={() => setShowFilteredSummary(true)} className="gap-2">
              <ListFilter className="w-4 h-4" />
              Zusammenfassung
            </Button>
            <Button variant="outline" onClick={handlePrint} className="gap-2">
              <Printer className="w-4 h-4" />
              Drucken
            </Button>
            <Button variant="outline" onClick={handleExportPdf} className="gap-2">
              <FileDown className="w-4 h-4" />
              PDF Export
            </Button>
            <Button onClick={handleSubmit} disabled={isSubmitting} className="gap-2">
              <Send className="w-4 h-4" />
              {isSubmitting ? "Wird gesendet..." : "Absenden & Verifizieren"}
            </Button>
          </div>
        </div>

        {/* Accordion with all sections */}
        <div className="container pb-12">
          <div className="mx-auto max-w-4xl">
            <Accordion type="multiple" value={openAccordionItems} onValueChange={setOpenAccordionItems} className="space-y-4">
              {formSections.map((section) => {
                const Icon = section.Icon;
                return (
                  <AccordionItem
                    key={section.id}
                    value={section.id}
                    className={`${section.color} border-2 rounded-lg overflow-hidden`}
                  >
                    <AccordionTrigger className="px-6 py-4 hover:no-underline">
                      <div className="flex items-center gap-3">
                        <div className="w-10 h-10 rounded-full bg-background/80 flex items-center justify-center">
                          <Icon className={`w-5 h-5 ${section.iconColor}`} />
                        </div>
                        <div className="text-left">
                          <span className="font-serif text-lg block">
                            {language === "de" ? section.titleDe : section.titleEn}
                          </span>
                          <span className="text-xl">{section.emoji}</span>
                        </div>
                      </div>
                    </AccordionTrigger>
                    <AccordionContent className="px-6 pb-6 bg-background">
                      <div className="pt-4">{renderSectionContent(section.id)}</div>
                    </AccordionContent>
                  </AccordionItem>
                );
              })}
            </Accordion>
          </div>
        </div>

        {/* Hidden Print View */}
        {showPrintView && (
          <div className="fixed inset-0 z-50 bg-white">
            <PrintView ref={printRef} formData={formData} language={language as "de" | "en"} />
          </div>
        )}

        {/* Filtered Summary Modal */}
        {showFilteredSummary && (
          <div className="fixed inset-0 z-50 bg-background/95 backdrop-blur-sm overflow-auto">
            <div className="container py-8">
              <div className="max-w-4xl mx-auto">
                <div className="flex justify-between items-center mb-6">
                  <h2 className="text-2xl font-semibold">Gefilterte Zusammenfassung</h2>
                  <Button variant="outline" onClick={() => setShowFilteredSummary(false)}>
                    <ChevronLeft className="w-4 h-4 mr-2" />
                    Zurück
                  </Button>
                </div>
                <Card>
                  <CardContent className="pt-6">
                    <FilteredSummaryView formData={formData} />
                  </CardContent>
                </Card>
              </div>
            </div>
          </div>
        )}

        {/* Verification Dialog */}
        <VerificationDialog
          open={showVerification}
          onOpenChange={setShowVerification}
          email={formData.email}
          onVerify={handleVerifyCode}
          onResend={handleResendCode}
          isVerifying={isSubmitting}
        />
      </div>
    </Layout>
  );
}
