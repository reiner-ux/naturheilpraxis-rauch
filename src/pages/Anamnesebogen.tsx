import { useState } from "react";
import { Layout } from "@/components/layout/Layout";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Textarea } from "@/components/ui/textarea";
import { Label } from "@/components/ui/label";
import { Checkbox } from "@/components/ui/checkbox";
import { RadioGroup, RadioGroupItem } from "@/components/ui/radio-group";
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
  Brain,
  Leaf,
  Droplets,
  Wind,
  Users,
  MessageSquare,
  ChevronLeft,
  ChevronRight,
  Check,
  Sparkles,
  LayoutList
} from "lucide-react";

type LayoutType = "wizard" | "accordion" | null;

// Form sections configuration
const formSections = [
  { id: "personal", title: "Persönliche Daten", emoji: "👤", icon: User, color: "bg-blue-100 dark:bg-blue-950/30", iconColor: "text-blue-500" },
  { id: "complaints", title: "Aktuelle Beschwerden", emoji: "🩺", icon: AlertCircle, color: "bg-orange-100 dark:bg-orange-950/30", iconColor: "text-orange-500" },
  { id: "history", title: "Vorerkrankungen", emoji: "❤️", icon: Heart, color: "bg-red-100 dark:bg-red-950/30", iconColor: "text-red-500" },
  { id: "medications", title: "Medikamente", emoji: "💊", icon: Pill, color: "bg-purple-100 dark:bg-purple-950/30", iconColor: "text-purple-500" },
  { id: "lifestyle", title: "Lebensgewohnheiten", emoji: "🌿", icon: Leaf, color: "bg-green-100 dark:bg-green-950/30", iconColor: "text-green-500" },
  { id: "family", title: "Familienanamnese", emoji: "👨‍👩‍👧", icon: Users, color: "bg-cyan-100 dark:bg-cyan-950/30", iconColor: "text-cyan-500" },
  { id: "other", title: "Sonstiges", emoji: "💬", icon: MessageSquare, color: "bg-slate-100 dark:bg-slate-950/30", iconColor: "text-slate-500" },
];

const Anamnesebogen = () => {
  const [selectedLayout, setSelectedLayout] = useState<LayoutType>(null);
  const [wizardStep, setWizardStep] = useState(0);
  const [formData, setFormData] = useState({
    // Persönliche Daten
    vorname: "",
    nachname: "",
    geburtsdatum: "",
    telefon: "",
    email: "",
    adresse: "",
    beruf: "",
    
    // Aktuelle Beschwerden
    hauptbeschwerden: "",
    beschwerdenbeginn: "",
    schmerzintensitaet: "",
    
    // Vorerkrankungen
    vorerkrankungen: "",
    operationen: "",
    allergien: "",
    
    // Medikamente
    aktuelle_medikamente: "",
    
    // Lebensgewohnheiten
    raucher: false,
    alkohol: "",
    bewegung: "",
    schlaf: "",
    stress: "",
    ernaehrung: "",
    
    // Familienanamnese
    familienanamnese: "",
    
    // Sonstiges
    sonstiges: "",
  });

  const handleInputChange = (e: React.ChangeEvent<HTMLInputElement | HTMLTextAreaElement>) => {
    const { name, value } = e.target;
    setFormData((prev) => ({ ...prev, [name]: value }));
  };

  const handleCheckboxChange = (name: string, checked: boolean) => {
    setFormData((prev) => ({ ...prev, [name]: checked }));
  };

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    console.log("Anamnesebogen Daten:", formData);
    toast.success("Anamnesebogen erfolgreich gesendet!", {
      description: "Vielen Dank! Wir werden Ihre Angaben vor dem Termin prüfen.",
    });
  };

  const handleBack = () => {
    setSelectedLayout(null);
    setWizardStep(0);
  };

  // Layout Selection Screen
  const LayoutSelector = () => (
    <div className="container py-12">
      <div className="mx-auto max-w-4xl">
        <div className="text-center mb-10">
          <h2 className="text-2xl font-serif font-semibold text-foreground mb-4">
            Wie möchten Sie das Formular ausfüllen?
          </h2>
          <p className="text-muted-foreground">
            Wählen Sie die Darstellung, die Ihnen am besten gefällt. Sie können jederzeit wechseln.
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
                    Schritt für Schritt
                  </CardTitle>
                  <CardDescription>mit Emojis 👤 ❤️ 🧠</CardDescription>
                </div>
              </div>
            </CardHeader>
            <CardContent className="space-y-4">
              <div className="flex gap-2 justify-center">
                {["👤", "❤️", "🧠", "💊", "🌿"].map((emoji, i) => (
                  <div 
                    key={i}
                    className="w-10 h-10 rounded-full bg-muted flex items-center justify-center text-lg"
                  >
                    {emoji}
                  </div>
                ))}
              </div>
              
              <div className="bg-muted/50 rounded-lg p-4 space-y-2">
                <p className="text-sm font-medium text-foreground">✅ Vorteile:</p>
                <ul className="text-sm text-muted-foreground space-y-1">
                  <li>• Geführte Eingabe – immer wissen, wo Sie sind</li>
                  <li>• Fortschrittsanzeige zeigt bereits ausgefüllte Bereiche</li>
                  <li>• Ideal für Smartphones und Tablets</li>
                  <li>• Übersichtlich bei vielen Fragen</li>
                </ul>
              </div>

              <p className="text-sm text-muted-foreground text-center">
                <strong>Empfohlen für:</strong> Wer Schritt für Schritt durch das Formular geführt werden möchte
              </p>

              <Button className="w-full" variant="outline">
                Diese Variante wählen
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
                    Alle Bereiche sichtbar
                  </CardTitle>
                  <CardDescription>mit Icons und Farben</CardDescription>
                </div>
              </div>
            </CardHeader>
            <CardContent className="space-y-4">
              <div className="flex gap-2 justify-center">
                {[User, Heart, Brain, Pill, Leaf].map((Icon, i) => (
                  <div 
                    key={i}
                    className="w-10 h-10 rounded-full bg-muted flex items-center justify-center"
                  >
                    <Icon className="w-5 h-5 text-muted-foreground" />
                  </div>
                ))}
              </div>
              
              <div className="bg-muted/50 rounded-lg p-4 space-y-2">
                <p className="text-sm font-medium text-foreground">✅ Vorteile:</p>
                <ul className="text-sm text-muted-foreground space-y-1">
                  <li>• Komplette Übersicht aller Bereiche</li>
                  <li>• Beliebig zwischen Abschnitten wechseln</li>
                  <li>• Professionelles, klares Design</li>
                  <li>• Schneller Zugriff auf jeden Bereich</li>
                </ul>
              </div>

              <p className="text-sm text-muted-foreground text-center">
                <strong>Empfohlen für:</strong> Wer gerne alles im Blick hat und frei navigieren möchte
              </p>

              <Button className="w-full" variant="outline">
                Diese Variante wählen
                <ChevronRight className="w-4 h-4 ml-2" />
              </Button>
            </CardContent>
          </Card>
        </div>
      </div>
    </div>
  );

  // Render form section content
  const renderSectionContent = (sectionId: string) => {
    switch (sectionId) {
      case "personal":
        return (
          <div className="grid gap-4 md:grid-cols-2">
            <div className="space-y-2">
              <Label htmlFor="vorname">Vorname *</Label>
              <Input id="vorname" name="vorname" value={formData.vorname} onChange={handleInputChange} required />
            </div>
            <div className="space-y-2">
              <Label htmlFor="nachname">Nachname *</Label>
              <Input id="nachname" name="nachname" value={formData.nachname} onChange={handleInputChange} required />
            </div>
            <div className="space-y-2">
              <Label htmlFor="geburtsdatum">Geburtsdatum *</Label>
              <Input id="geburtsdatum" name="geburtsdatum" type="date" value={formData.geburtsdatum} onChange={handleInputChange} required />
            </div>
            <div className="space-y-2">
              <Label htmlFor="telefon">Telefon</Label>
              <Input id="telefon" name="telefon" type="tel" value={formData.telefon} onChange={handleInputChange} />
            </div>
            <div className="space-y-2 md:col-span-2">
              <Label htmlFor="email">E-Mail</Label>
              <Input id="email" name="email" type="email" value={formData.email} onChange={handleInputChange} />
            </div>
            <div className="space-y-2 md:col-span-2">
              <Label htmlFor="adresse">Adresse</Label>
              <Input id="adresse" name="adresse" value={formData.adresse} onChange={handleInputChange} />
            </div>
            <div className="space-y-2 md:col-span-2">
              <Label htmlFor="beruf">Beruf</Label>
              <Input id="beruf" name="beruf" value={formData.beruf} onChange={handleInputChange} />
            </div>
          </div>
        );
      case "complaints":
        return (
          <div className="space-y-4">
            <div className="space-y-2">
              <Label htmlFor="hauptbeschwerden">Hauptbeschwerden / Grund des Besuchs *</Label>
              <Textarea id="hauptbeschwerden" name="hauptbeschwerden" value={formData.hauptbeschwerden} onChange={handleInputChange} placeholder="Beschreiben Sie Ihre aktuellen Beschwerden..." rows={4} required />
            </div>
            <div className="space-y-2">
              <Label htmlFor="beschwerdenbeginn">Seit wann bestehen die Beschwerden?</Label>
              <Input id="beschwerdenbeginn" name="beschwerdenbeginn" value={formData.beschwerdenbeginn} onChange={handleInputChange} placeholder="z.B. seit 3 Monaten, seit Kindheit..." />
            </div>
            <div className="space-y-3">
              <Label>Schmerzintensität (falls zutreffend)</Label>
              <RadioGroup value={formData.schmerzintensitaet} onValueChange={(value) => setFormData((prev) => ({ ...prev, schmerzintensitaet: value }))} className="flex flex-wrap gap-4">
                {["Leicht", "Mittel", "Stark", "Sehr stark"].map((level) => (
                  <div key={level} className="flex items-center space-x-2">
                    <RadioGroupItem value={level.toLowerCase()} id={`schmerz-${level}`} />
                    <Label htmlFor={`schmerz-${level}`} className="font-normal">{level}</Label>
                  </div>
                ))}
              </RadioGroup>
            </div>
          </div>
        );
      case "history":
        return (
          <div className="space-y-4">
            <div className="space-y-2">
              <Label htmlFor="vorerkrankungen">Bekannte Vorerkrankungen</Label>
              <Textarea id="vorerkrankungen" name="vorerkrankungen" value={formData.vorerkrankungen} onChange={handleInputChange} placeholder="z.B. Bluthochdruck, Diabetes, Schilddrüsenerkrankung..." rows={3} />
            </div>
            <div className="space-y-2">
              <Label htmlFor="operationen">Frühere Operationen</Label>
              <Textarea id="operationen" name="operationen" value={formData.operationen} onChange={handleInputChange} placeholder="Jahr und Art der Operation..." rows={2} />
            </div>
            <div className="space-y-2">
              <Label htmlFor="allergien">Allergien / Unverträglichkeiten</Label>
              <Textarea id="allergien" name="allergien" value={formData.allergien} onChange={handleInputChange} placeholder="z.B. Medikamente, Lebensmittel, Pollen..." rows={2} />
            </div>
          </div>
        );
      case "medications":
        return (
          <div className="space-y-2">
            <Label htmlFor="aktuelle_medikamente">Medikamente und Dosierung</Label>
            <Textarea id="aktuelle_medikamente" name="aktuelle_medikamente" value={formData.aktuelle_medikamente} onChange={handleInputChange} placeholder="Medikament, Dosierung, wie oft täglich..." rows={4} />
          </div>
        );
      case "lifestyle":
        return (
          <div className="space-y-4">
            <div className="flex items-center space-x-2">
              <Checkbox id="raucher" checked={formData.raucher} onCheckedChange={(checked) => handleCheckboxChange("raucher", checked as boolean)} />
              <Label htmlFor="raucher" className="font-normal">Ich bin Raucher/in</Label>
            </div>
            <div className="grid gap-4 md:grid-cols-2">
              <div className="space-y-2">
                <Label htmlFor="alkohol">Alkoholkonsum</Label>
                <Input id="alkohol" name="alkohol" value={formData.alkohol} onChange={handleInputChange} placeholder="z.B. selten, gelegentlich, täglich" />
              </div>
              <div className="space-y-2">
                <Label htmlFor="bewegung">Bewegung / Sport</Label>
                <Input id="bewegung" name="bewegung" value={formData.bewegung} onChange={handleInputChange} placeholder="z.B. 2x pro Woche Joggen" />
              </div>
              <div className="space-y-2">
                <Label htmlFor="schlaf">Schlafqualität</Label>
                <Input id="schlaf" name="schlaf" value={formData.schlaf} onChange={handleInputChange} placeholder="z.B. gut, Einschlafprobleme" />
              </div>
              <div className="space-y-2">
                <Label htmlFor="stress">Stresslevel</Label>
                <Input id="stress" name="stress" value={formData.stress} onChange={handleInputChange} placeholder="z.B. niedrig, mittel, hoch" />
              </div>
            </div>
            <div className="space-y-2">
              <Label htmlFor="ernaehrung">Ernährungsgewohnheiten</Label>
              <Textarea id="ernaehrung" name="ernaehrung" value={formData.ernaehrung} onChange={handleInputChange} placeholder="z.B. vegetarisch, viel Gemüse, wenig Zeit zum Kochen..." rows={2} />
            </div>
          </div>
        );
      case "family":
        return (
          <div className="space-y-2">
            <Label htmlFor="familienanamnese">Bekannte Erkrankungen bei Eltern, Großeltern, Geschwistern</Label>
            <Textarea id="familienanamnese" name="familienanamnese" value={formData.familienanamnese} onChange={handleInputChange} placeholder="z.B. Vater: Herzerkrankung, Mutter: Diabetes..." rows={3} />
          </div>
        );
      case "other":
        return (
          <Textarea id="sonstiges" name="sonstiges" value={formData.sonstiges} onChange={handleInputChange} placeholder="Weitere Informationen, Fragen oder Wünsche..." rows={4} />
        );
      default:
        return null;
    }
  };

  // Wizard Layout
  const WizardLayout = () => {
    const currentSection = formSections[wizardStep];
    
    return (
      <div className="container py-8">
        <div className="mx-auto max-w-3xl">
          {/* Back Button */}
          <Button variant="ghost" onClick={handleBack} className="mb-6">
            <ChevronLeft className="w-4 h-4 mr-2" />
            Layout ändern
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
                  <div className={`w-12 h-12 rounded-full flex items-center justify-center text-2xl mb-1 transition-all ${
                    wizardStep === index 
                      ? "bg-primary text-primary-foreground shadow-lg" 
                      : wizardStep > index
                      ? "bg-green-500 text-white"
                      : "bg-muted"
                  }`}>
                    {wizardStep > index ? <Check className="w-6 h-6" /> : section.emoji}
                  </div>
                  <span className={`text-xs text-center max-w-[70px] hidden sm:block ${
                    wizardStep === index ? "font-semibold" : ""
                  }`}>
                    {section.title}
                  </span>
                </div>
                {index < formSections.length - 1 && (
                  <div className={`w-6 md:w-10 h-1 mx-1 rounded ${
                    wizardStep > index ? "bg-green-500" : "bg-muted"
                  }`} />
                )}
              </div>
            ))}
          </div>

          {/* Form Content */}
          <form onSubmit={handleSubmit}>
            <Card className="shadow-card mb-6">
              <CardHeader>
                <div className="flex items-center gap-3">
                  <div className={`w-12 h-12 rounded-full ${currentSection.color} flex items-center justify-center text-2xl`}>
                    {currentSection.emoji}
                  </div>
                  <div>
                    <CardTitle className="font-serif text-xl">{currentSection.title}</CardTitle>
                    <CardDescription>Schritt {wizardStep + 1} von {formSections.length}</CardDescription>
                  </div>
                </div>
              </CardHeader>
              <CardContent>
                {renderSectionContent(currentSection.id)}
              </CardContent>
            </Card>

            {/* Navigation */}
            <div className="flex justify-between">
              <Button 
                type="button"
                variant="outline" 
                onClick={() => setWizardStep(Math.max(0, wizardStep - 1))}
                disabled={wizardStep === 0}
              >
                <ChevronLeft className="w-4 h-4 mr-2" />
                Zurück
              </Button>
              
              {wizardStep === formSections.length - 1 ? (
                <Button type="submit" variant="hero">
                  <Send className="mr-2 h-5 w-5" />
                  Absenden
                </Button>
              ) : (
                <Button 
                  type="button"
                  onClick={() => setWizardStep(Math.min(formSections.length - 1, wizardStep + 1))}
                >
                  Weiter
                  <ChevronRight className="w-4 h-4 ml-2" />
                </Button>
              )}
            </div>
          </form>
        </div>
      </div>
    );
  };

  // Accordion Layout
  const AccordionLayout = () => (
    <div className="container py-8">
      <div className="mx-auto max-w-3xl">
        {/* Back Button */}
        <Button variant="ghost" onClick={handleBack} className="mb-6">
          <ChevronLeft className="w-4 h-4 mr-2" />
          Layout ändern
        </Button>

        <form onSubmit={handleSubmit}>
          <Accordion type="single" collapsible defaultValue="personal" className="space-y-4">
            {formSections.map((section) => {
              const IconComponent = section.icon;
              return (
                <AccordionItem 
                  key={section.id} 
                  value={section.id}
                  className="border rounded-lg bg-card shadow-card overflow-hidden"
                >
                  <AccordionTrigger className="hover:no-underline px-6 py-4">
                    <div className="flex items-center gap-3">
                      <div className={`w-10 h-10 rounded-full ${section.color} flex items-center justify-center`}>
                        <IconComponent className={`w-5 h-5 ${section.iconColor}`} />
                      </div>
                      <span className="font-serif font-medium text-lg">{section.title}</span>
                    </div>
                  </AccordionTrigger>
                  <AccordionContent className="px-6 pb-6">
                    <div className={`p-4 rounded-lg ${section.color} mb-4`}>
                      <div className="flex items-center gap-2">
                        <IconComponent className={`w-6 h-6 ${section.iconColor}`} />
                        <span className="text-sm font-medium">Bitte füllen Sie alle relevanten Felder aus</span>
                      </div>
                    </div>
                    {renderSectionContent(section.id)}
                  </AccordionContent>
                </AccordionItem>
              );
            })}
          </Accordion>

          {/* Submit Button */}
          <div className="flex justify-center mt-8">
            <Button type="submit" variant="hero" size="xl">
              <Send className="mr-2 h-5 w-5" />
              Anamnesebogen absenden
            </Button>
          </div>
        </form>
      </div>
    </div>
  );

  return (
    <Layout>
      <div className="bg-sage-50 py-12 md:py-16">
        <div className="container">
          <div className="mx-auto max-w-3xl text-center">
            <h1 className="mb-4 font-serif text-3xl font-semibold text-foreground md:text-4xl">
              Anamnesebogen
            </h1>
            <p className="text-lg text-muted-foreground">
              Bitte füllen Sie diesen Fragebogen sorgfältig aus. Ihre Angaben helfen mir,
              Sie bestmöglich zu behandeln.
            </p>
          </div>
        </div>
      </div>

      {selectedLayout === null && <LayoutSelector />}
      {selectedLayout === "wizard" && <WizardLayout />}
      {selectedLayout === "accordion" && <AccordionLayout />}
    </Layout>
  );
};

export default Anamnesebogen;
