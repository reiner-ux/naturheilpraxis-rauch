import { useState, useRef } from "react";
import { Layout } from "@/components/layout/Layout";
import { Button } from "@/components/ui/button";
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card";
import { 
  Accordion,
  AccordionContent,
  AccordionItem,
  AccordionTrigger,
} from "@/components/ui/accordion";
import { toast } from "sonner";
import { 
  Send, 
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
  LayoutList,
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
  type LucideIcon,
} from "lucide-react";
import { useLanguage } from "@/contexts/LanguageContext";
import { formSections as formSectionsData, initialFormData, AnamneseFormData } from "@/lib/anamneseFormData";
import { generateEnhancedAnamnesePdf } from "@/lib/pdfExportEnhanced";
import PrintView from "@/components/anamnese/PrintView";
import FilteredSummaryView from "@/components/anamnese/FilteredSummaryView";
import SEOHead from "@/components/seo/SEOHead";

// Import section components
import IntroSection from "@/components/anamnese/IntroSection";
import PatientDataSection from "@/components/anamnese/PatientDataSection";
import FamilyHistorySection from "@/components/anamnese/FamilyHistorySection";
import MedicalHistorySection from "@/components/anamnese/MedicalHistorySection";
import WomenHealthSection from "@/components/anamnese/WomenHealthSection";
import MensHealthSection from "@/components/anamnese/MensHealthSection";
import SurgeriesSection from "@/components/anamnese/SurgeriesSection";
import CancerSection from "@/components/anamnese/CancerSection";
import AllergiesSection from "@/components/anamnese/AllergiesSection";
import MedicationsSection from "@/components/anamnese/MedicationsSection";
import LifestyleSection from "@/components/anamnese/LifestyleSection";
import EnvironmentSection from "@/components/anamnese/EnvironmentSection";
import InfectionsSection from "@/components/anamnese/InfectionsSection";
import VaccinationsSection from "@/components/anamnese/VaccinationsSection";
import ComplaintsSection from "@/components/anamnese/ComplaintsSection";
import PreferencesSection from "@/components/anamnese/PreferencesSection";
import SocialSection from "@/components/anamnese/SocialSection";
import SignatureSection from "@/components/anamnese/SignatureSection";

type LayoutType = "wizard" | "accordion" | null;

// Icon mapping for dynamic icon rendering
const iconMap: Record<string, LucideIcon> = {
  Sparkles,
  User,
  Users,
  Stethoscope,
  Heart,
  Building2,
  AlertTriangle,
  ShieldAlert,
  Pill,
  Leaf,
  Globe,
  Bug,
  Syringe,
  ClipboardList,
  Wand2,
  Home,
  PenTool,
};

// Form sections with components
const formSections = formSectionsData.map(section => ({
  ...section,
  Icon: iconMap[section.icon] || AlertCircle,
}));

const Anamnesebogen = () => {
  const { language } = useLanguage();
  const [selectedLayout, setSelectedLayout] = useState<LayoutType>(null);
  const [wizardStep, setWizardStep] = useState(0);
  const [formData, setFormData] = useState<AnamneseFormData>(initialFormData);
  const [showPrintView, setShowPrintView] = useState(false);
  const [showFilteredSummary, setShowFilteredSummary] = useState(false);
  const [openAccordionItems, setOpenAccordionItems] = useState<string[]>(["intro"]);
  const printRef = useRef<HTMLDivElement>(null);

  const updateFormData = (field: string, value: any) => {
    setFormData((prev) => ({ ...prev, [field]: value }));
  };

  const isSignatureComplete = () => {
    return !!(
      formData.unterschrift?.bestaetigung &&
      formData.unterschrift?.datum &&
      formData.unterschrift?.nameInDruckbuchstaben
    );
  };

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    
    // Validate required fields
    if (!formData.nachname || !formData.vorname || !formData.email) {
      toast.error(language === "de" ? "Bitte füllen Sie alle Pflichtfelder aus" : "Please fill in all required fields");
      return;
    }
    
    // Check signature completeness with friendly message
    if (!isSignatureComplete()) {
      toast.error(
        language === "de" 
          ? "Unterschrift erforderlich" 
          : "Signature required",
        {
          description: language === "de"
            ? "Liebe Patientin, lieber Patient, für die rechtssichere Übermittlung Ihrer Daten benötigen wir Ihre vollständige Unterschrift am Ende des Formulars. Bitte füllen Sie das Datum, Ihren Namen in Druckbuchstaben aus und bestätigen Sie die Datenschutzerklärung. Vielen Dank für Ihr Verständnis!"
            : "Dear patient, for the legally secure transmission of your data, we require your complete signature at the end of the form. Please fill in the date, your name in block letters, and confirm the privacy policy. Thank you for your understanding!",
          duration: 8000,
        }
      );
      return;
    }
    
    // Form data is handled securely - no logging of sensitive medical information
    toast.success(
      language === "de" ? "Anamnesebogen erfolgreich gesendet!" : "Medical history form submitted successfully!", 
      {
        description: language === "de" 
          ? "Vielen Dank! Wir werden Ihre Angaben vor dem Termin prüfen."
          : "Thank you! We will review your information before the appointment.",
      }
    );
  };

  const handleExportPdf = () => {
    try {
      generateEnhancedAnamnesePdf({ formData, language: language as "de" | "en" });
      toast.success(
        language === "de" ? "PDF erstellt!" : "PDF created!",
        {
          description: language === "de"
            ? "Der Anamnesebogen wurde als PDF heruntergeladen."
            : "The medical history form has been downloaded as a PDF.",
        }
      );
    } catch (error) {
      console.error("PDF export error:", error);
      toast.error(
        language === "de" ? "PDF-Export fehlgeschlagen" : "PDF export failed"
      );
    }
  };

  const handlePrint = () => {
    setShowPrintView(true);
    setTimeout(() => {
      window.print();
      setTimeout(() => setShowPrintView(false), 500);
    }, 100);
  };

  const handleBack = () => {
    setSelectedLayout(null);
    setWizardStep(0);
  };

  // Render section content based on section ID
  const renderSectionContent = (sectionId: string) => {
    switch (sectionId) {
      case "intro":
        return <IntroSection />;
      case "patientData":
        return <PatientDataSection formData={formData} updateFormData={updateFormData} />;
      case "familyHistory":
        return <FamilyHistorySection formData={formData} updateFormData={updateFormData} />;
      case "medicalHistory":
        return <MedicalHistorySection formData={formData} updateFormData={updateFormData} />;
      case "complaints":
        return <ComplaintsSection formData={formData} updateFormData={updateFormData} />;
      case "womenHealth":
        return <WomenHealthSection formData={formData} updateFormData={updateFormData} />;
      case "mensHealth":
        return <MensHealthSection formData={formData} updateFormData={updateFormData} />;
      case "surgeries":
        return <SurgeriesSection formData={formData} updateFormData={updateFormData} />;
      case "cancer":
        return <CancerSection formData={formData} updateFormData={updateFormData} />;
      case "allergies":
        return <AllergiesSection formData={formData} updateFormData={updateFormData} />;
      case "medications":
        return <MedicationsSection formData={formData} updateFormData={updateFormData} />;
      case "lifestyle":
        return <LifestyleSection formData={formData} updateFormData={updateFormData} />;
      case "environment":
        return <EnvironmentSection formData={formData} updateFormData={updateFormData} />;
      case "infections":
        return <InfectionsSection formData={formData} updateFormData={updateFormData} />;
      case "vaccinations":
        return <VaccinationsSection formData={formData} updateFormData={updateFormData} />;
      case "preferences":
        return <PreferencesSection formData={formData} updateFormData={updateFormData} />;
      case "social":
        return <SocialSection formData={formData} updateFormData={updateFormData} />;
      case "signature":
        return <SignatureSection formData={formData} updateFormData={updateFormData} />;
      default:
        return null;
    }
  };

  // Layout Selection Screen
  const LayoutSelector = () => (
    <div className="container py-12">
      <div className="mx-auto max-w-4xl">
        <div className="text-center mb-10">
          <h2 className="text-2xl font-serif font-semibold text-foreground mb-4">
            {language === "de" ? "Wie möchten Sie das Formular ausfüllen?" : "How would you like to fill out the form?"}
          </h2>
          <p className="text-muted-foreground">
            {language === "de" 
              ? "Wählen Sie die Darstellung, die Ihnen am besten gefällt. Sie können jederzeit wechseln."
              : "Choose the display that suits you best. You can switch at any time."}
          </p>
        </div>

        <div className="grid md:grid-cols-2 gap-6">
          {/* Wizard Option */}
          <Card 
            className="cursor-pointer transition-all hover:shadow-lg hover:border-primary/50 group"
            onClick={() => setSelectedLayout("wizard")}
          >
            <CardHeader className="pb-4">
              <div className="flex items-center gap-3 mb-2">
                <div className="w-12 h-12 rounded-full bg-primary/10 flex items-center justify-center">
                  <Sparkles className="w-6 h-6 text-primary" />
                </div>
                <div>
                  <CardTitle className="font-serif text-xl group-hover:text-primary transition-colors">
                    {language === "de" ? "Schritt für Schritt" : "Step by Step"}
                  </CardTitle>
                  <CardDescription>
                    {language === "de" ? "mit Emojis 👤 ❤️ 🧠" : "with Emojis 👤 ❤️ 🧠"}
                  </CardDescription>
                </div>
              </div>
            </CardHeader>
            <CardContent className="space-y-4">
              <div className="flex gap-2 justify-center">
                {["👋", "👤", "👨‍👩‍👧", "🩺", "💊"].map((emoji, i) => (
                  <div 
                    key={i}
                    className="w-10 h-10 rounded-full bg-muted flex items-center justify-center text-lg"
                  >
                    {emoji}
                  </div>
                ))}
              </div>
              
              <div className="bg-muted/50 rounded-lg p-4 space-y-2">
                <p className="text-sm font-medium text-foreground">✅ {language === "de" ? "Vorteile:" : "Benefits:"}</p>
                <ul className="text-sm text-muted-foreground space-y-1">
                  <li>• {language === "de" ? "Geführte Eingabe – immer wissen, wo Sie sind" : "Guided input – always know where you are"}</li>
                  <li>• {language === "de" ? "Fortschrittsanzeige zeigt bereits ausgefüllte Bereiche" : "Progress indicator shows completed sections"}</li>
                  <li>• {language === "de" ? "Ideal für Smartphones und Tablets" : "Ideal for smartphones and tablets"}</li>
                  <li>• {language === "de" ? "Übersichtlich bei vielen Fragen" : "Clear overview with many questions"}</li>
                </ul>
              </div>

              <p className="text-sm text-muted-foreground text-center">
                <strong>{language === "de" ? "Empfohlen für:" : "Recommended for:"}</strong> {language === "de" ? "Wer Schritt für Schritt durch das Formular geführt werden möchte" : "Those who want to be guided through the form step by step"}
              </p>

              <Button className="w-full" variant="outline">
                {language === "de" ? "Diese Variante wählen" : "Choose this option"}
                <ChevronRight className="w-4 h-4 ml-2" />
              </Button>
            </CardContent>
          </Card>

          {/* Accordion Option */}
          <Card 
            className="cursor-pointer transition-all hover:shadow-lg hover:border-primary/50 group"
            onClick={() => setSelectedLayout("accordion")}
          >
            <CardHeader className="pb-4">
              <div className="flex items-center gap-3 mb-2">
                <div className="w-12 h-12 rounded-full bg-secondary/10 flex items-center justify-center">
                  <LayoutList className="w-6 h-6 text-secondary-foreground" />
                </div>
                <div>
                  <CardTitle className="font-serif text-xl group-hover:text-primary transition-colors">
                    {language === "de" ? "Alle Bereiche sichtbar" : "All sections visible"}
                  </CardTitle>
                  <CardDescription>
                    {language === "de" ? "mit Icons und Farben" : "with icons and colors"}
                  </CardDescription>
                </div>
              </div>
            </CardHeader>
            <CardContent className="space-y-4">
              <div className="flex gap-2 justify-center">
                {[User, Heart, Stethoscope, Pill, Leaf].map((IconComp, i) => (
                  <div 
                    key={i}
                    className="w-10 h-10 rounded-full bg-muted flex items-center justify-center"
                  >
                    <IconComp className="w-5 h-5 text-muted-foreground" />
                  </div>
                ))}
              </div>
              
              <div className="bg-muted/50 rounded-lg p-4 space-y-2">
                <p className="text-sm font-medium text-foreground">✅ {language === "de" ? "Vorteile:" : "Benefits:"}</p>
                <ul className="text-sm text-muted-foreground space-y-1">
                  <li>• {language === "de" ? "Komplette Übersicht aller Bereiche" : "Complete overview of all sections"}</li>
                  <li>• {language === "de" ? "Beliebig zwischen Abschnitten wechseln" : "Switch freely between sections"}</li>
                  <li>• {language === "de" ? "Professionelles, klares Design" : "Professional, clear design"}</li>
                  <li>• {language === "de" ? "Schneller Zugriff auf jeden Bereich" : "Quick access to every section"}</li>
                </ul>
              </div>

              <p className="text-sm text-muted-foreground text-center">
                <strong>{language === "de" ? "Empfohlen für:" : "Recommended for:"}</strong> {language === "de" ? "Wer gerne alles im Blick hat und frei navigieren möchte" : "Those who like to have an overview and navigate freely"}
              </p>

              <Button className="w-full" variant="outline">
                {language === "de" ? "Diese Variante wählen" : "Choose this option"}
                <ChevronRight className="w-4 h-4 ml-2" />
              </Button>
            </CardContent>
          </Card>
        </div>
      </div>
    </div>
  );

  // Wizard Layout
  const WizardLayout = () => {
    const currentSection = formSections[wizardStep];
    const Icon = currentSection?.Icon || AlertCircle;
    
    return (
      <div className="container py-8">
        <div className="mx-auto max-w-3xl">
          {/* Back Button */}
          <Button variant="ghost" onClick={handleBack} className="mb-6">
            <ChevronLeft className="w-4 h-4 mr-2" />
            {language === "de" ? "Layout ändern" : "Change layout"}
          </Button>

          {/* Progress Steps */}
          <div className="flex items-center justify-between mb-8 overflow-x-auto pb-4">
            {formSections.map((section, index) => (
              <div key={section.id} className="flex items-center">
                <div 
                  className={`flex flex-col items-center cursor-pointer transition-all ${
                    wizardStep === index 
                      ? "scale-110" 
                      : wizardStep > index 
                      ? "opacity-70" 
                      : "opacity-40"
                  }`}
                  onClick={() => setWizardStep(index)}
                >
                  <div className={`w-10 h-10 sm:w-12 sm:h-12 rounded-full flex items-center justify-center text-xl sm:text-2xl mb-1 transition-all ${
                    wizardStep === index 
                      ? "bg-primary text-primary-foreground shadow-lg" 
                      : wizardStep > index
                      ? "bg-green-500 text-white"
                      : "bg-muted"
                  }`}>
                    {wizardStep > index ? <Check className="w-5 h-5 sm:w-6 sm:h-6" /> : section.emoji}
                  </div>
                  <span className="text-[10px] sm:text-xs text-center hidden md:block max-w-[60px] truncate">
                    {language === "de" ? section.titleDe.replace(/^[IVX]+\.\s*/, "") : section.titleEn.replace(/^[IVX]+\.\s*/, "")}
                  </span>
                </div>
                {index < formSections.length - 1 && (
                  <div className={`h-0.5 w-4 sm:w-8 mx-1 sm:mx-2 ${
                    wizardStep > index ? "bg-green-500" : "bg-muted"
                  }`} />
                )}
              </div>
            ))}
          </div>

          {/* Current Section */}
          <Card className={`${currentSection.color} border-2`}>
            <CardHeader>
              <div className="flex items-center gap-3">
                <div className={`w-12 h-12 rounded-full bg-background/80 flex items-center justify-center`}>
                  <Icon className={`w-6 h-6 ${currentSection.iconColor}`} />
                </div>
                <div>
                  <CardTitle className="font-serif text-xl">
                    {language === "de" ? currentSection.titleDe : currentSection.titleEn}
                  </CardTitle>
                  <CardDescription>
                    {language === "de" 
                      ? `Schritt ${wizardStep + 1} von ${formSections.length}`
                      : `Step ${wizardStep + 1} of ${formSections.length}`}
                  </CardDescription>
                </div>
              </div>
            </CardHeader>
            <CardContent className="bg-background rounded-b-lg">
              <form onSubmit={handleSubmit}>
                {renderSectionContent(currentSection.id)}
                
                {/* Navigation Buttons */}
                <div className="flex justify-between mt-8 pt-6 border-t">
                  <Button
                    type="button"
                    variant="outline"
                    onClick={() => setWizardStep(Math.max(0, wizardStep - 1))}
                    disabled={wizardStep === 0}
                  >
                    <ChevronLeft className="w-4 h-4 mr-2" />
                    {language === "de" ? "Zurück" : "Back"}
                  </Button>
                  
                  <div className="flex flex-wrap gap-2">
                    <Button
                      type="button"
                      variant="outline"
                      onClick={() => setShowFilteredSummary(true)}
                      className="gap-2"
                    >
                      <ListFilter className="w-4 h-4" />
                      {language === "de" ? "Zusammenfassung" : "Summary"}
                    </Button>
                    <Button
                      type="button"
                      variant="outline"
                      onClick={handlePrint}
                      className="gap-2"
                    >
                      <Printer className="w-4 h-4" />
                      {language === "de" ? "Drucken" : "Print"}
                    </Button>
                    <Button
                      type="button"
                      variant="outline"
                      onClick={handleExportPdf}
                      className="gap-2"
                    >
                      <FileDown className="w-4 h-4" />
                      PDF
                    </Button>
                    {wizardStep === formSections.length - 1 ? (
                      <Button type="submit" className="gap-2">
                        <Send className="w-4 h-4" />
                        {language === "de" ? "Absenden" : "Submit"}
                      </Button>
                    ) : (
                      <Button
                        type="button"
                        onClick={() => setWizardStep(Math.min(formSections.length - 1, wizardStep + 1))}
                      >
                        {language === "de" ? "Weiter" : "Next"}
                        <ChevronRight className="w-4 h-4 ml-2" />
                      </Button>
                    )}
                  </div>
                </div>
              </form>
            </CardContent>
          </Card>
        </div>
      </div>
    );
  };

  // Accordion Layout
  const AccordionLayout = () => (
    <div className="container py-8">
      <div className="mx-auto max-w-4xl">
        {/* Back Button */}
        <Button variant="ghost" onClick={handleBack} className="mb-6">
          <ChevronLeft className="w-4 h-4 mr-2" />
          {language === "de" ? "Layout ändern" : "Change layout"}
        </Button>

        <form onSubmit={handleSubmit}>
          <Accordion 
            type="multiple" 
            value={openAccordionItems} 
            onValueChange={setOpenAccordionItems}
            className="space-y-4"
          >
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
                    <div className="pt-4">
                      {renderSectionContent(section.id)}
                    </div>
                  </AccordionContent>
                </AccordionItem>
              );
            })}
          </Accordion>

          {/* Action Buttons */}
          <div className="mt-8 flex flex-col sm:flex-row justify-center gap-4">
            <Button
              type="button"
              variant="outline"
              size="lg"
              onClick={() => setShowFilteredSummary(true)}
              className="gap-2"
            >
              <ListFilter className="w-5 h-5" />
              {language === "de" ? "Zusammenfassung" : "Summary"}
            </Button>
            <Button
              type="button"
              variant="outline"
              size="lg"
              onClick={handlePrint}
              className="gap-2"
            >
              <Printer className="w-5 h-5" />
              {language === "de" ? "Drucken" : "Print"}
            </Button>
            <Button
              type="button"
              variant="outline"
              size="lg"
              onClick={handleExportPdf}
              className="gap-2"
            >
              <FileDown className="w-5 h-5" />
              {language === "de" ? "Als PDF speichern" : "Save as PDF"}
            </Button>
            <Button type="submit" size="lg" className="gap-2">
              <Send className="w-5 h-5" />
              {language === "de" ? "Anamnesebogen absenden" : "Submit Medical History Form"}
            </Button>
          </div>
        </form>
      </div>
    </div>
  );

  return (
    <Layout>
      <div className="bg-gradient-to-b from-muted/30 to-background min-h-screen">
        {/* Header */}
        <div className="container py-8">
          <div className="text-center max-w-3xl mx-auto">
            <h1 className="text-3xl md:text-4xl font-serif font-semibold text-foreground mb-4">
              {language === "de" ? "Anamnesebogen" : "Medical History Form"}
            </h1>
            <p className="text-lg text-muted-foreground">
              {language === "de"
                ? "Bitte füllen Sie diesen Fragebogen vor Ihrem ersten Termin aus. Ihre Angaben helfen mir, Sie optimal zu behandeln."
                : "Please complete this questionnaire before your first appointment. Your information helps me to treat you optimally."}
            </p>
          </div>
        </div>

        {/* Content based on selected layout */}
        {selectedLayout === null && <LayoutSelector />}
        {selectedLayout === "wizard" && <WizardLayout />}
        {selectedLayout === "accordion" && <AccordionLayout />}

        {/* Hidden Print View */}
        {showPrintView && (
          <div className="fixed inset-0 z-50 bg-white">
            <PrintView
              ref={printRef}
              formData={formData}
              language={language as "de" | "en"}
            />
          </div>
        )}
        {/* Filtered Summary Modal */}
        {showFilteredSummary && (
          <div className="fixed inset-0 z-50 bg-background/95 backdrop-blur-sm overflow-auto">
            <div className="container py-8">
              <div className="max-w-4xl mx-auto">
                <div className="flex justify-between items-center mb-6">
                  <h2 className="text-2xl font-semibold">
                    {language === "de" ? "Gefilterte Zusammenfassung" : "Filtered Summary"}
                  </h2>
                  <Button variant="outline" onClick={() => setShowFilteredSummary(false)}>
                    <ChevronLeft className="w-4 h-4 mr-2" />
                    {language === "de" ? "Zurück zum Formular" : "Back to Form"}
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
      </div>
    </Layout>
  );
};

export default Anamnesebogen;
