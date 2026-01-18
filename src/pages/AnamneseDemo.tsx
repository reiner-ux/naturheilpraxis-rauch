import { useState } from "react";
import { Layout } from "@/components/layout/Layout";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { Checkbox } from "@/components/ui/checkbox";
import { Textarea } from "@/components/ui/textarea";
import { 
  Accordion,
  AccordionContent,
  AccordionItem,
  AccordionTrigger,
} from "@/components/ui/accordion";
import { 
  Heart, 
  Brain, 
  Leaf, 
  Droplets, 
  Wind, 
  Eye,
  ChevronLeft,
  ChevronRight,
  Check
} from "lucide-react";

// Demo data for both examples
const wizardSteps = [
  { id: 1, title: "Persönliche Daten", emoji: "👤", icon: null },
  { id: 2, title: "Herz & Kreislauf", emoji: "❤️", icon: Heart },
  { id: 3, title: "Nervensystem", emoji: "🧠", icon: Brain },
  { id: 4, title: "Verdauung", emoji: "🍃", icon: Leaf },
  { id: 5, title: "Nieren & Blase", emoji: "💧", icon: Droplets },
  { id: 6, title: "Atemwege", emoji: "🌬️", icon: Wind },
];

const accordionSections = [
  { id: "personal", title: "Persönliche Daten", icon: Eye, color: "text-blue-500" },
  { id: "heart", title: "Herz & Kreislauf", icon: Heart, color: "text-red-500" },
  { id: "brain", title: "Nervensystem", icon: Brain, color: "text-purple-500" },
  { id: "digestion", title: "Verdauung", icon: Leaf, color: "text-green-500" },
  { id: "kidneys", title: "Nieren & Blase", icon: Droplets, color: "text-cyan-500" },
  { id: "respiratory", title: "Atemwege", icon: Wind, color: "text-sky-500" },
];

export default function AnamneseDemo() {
  const [wizardStep, setWizardStep] = useState(1);
  const [selectedDemo, setSelectedDemo] = useState<"wizard" | "accordion" | null>(null);

  const WizardDemo = () => (
    <Card className="border-2 border-primary/20">
      <CardHeader className="bg-gradient-to-r from-primary/10 to-primary/5">
        <CardTitle className="text-xl flex items-center gap-2">
          <span className="text-2xl">📋</span>
          Option 1: Wizard mit Emojis
        </CardTitle>
        <p className="text-sm text-muted-foreground mt-2">
          Schrittweise Eingabe - ideal für mobile Geräte
        </p>
      </CardHeader>
      <CardContent className="p-6">
        {/* Progress Steps */}
        <div className="flex items-center justify-between mb-8 overflow-x-auto pb-4">
          {wizardSteps.map((step, index) => (
            <div key={step.id} className="flex items-center">
              <div 
                className={`flex flex-col items-center cursor-pointer transition-all ${
                  wizardStep === step.id 
                    ? "scale-110" 
                    : wizardStep > step.id 
                    ? "opacity-60" 
                    : "opacity-40"
                }`}
                onClick={() => setWizardStep(step.id)}
              >
                <div className={`w-12 h-12 rounded-full flex items-center justify-center text-2xl mb-1 transition-all ${
                  wizardStep === step.id 
                    ? "bg-primary text-primary-foreground shadow-lg" 
                    : wizardStep > step.id
                    ? "bg-green-500 text-white"
                    : "bg-muted"
                }`}>
                  {wizardStep > step.id ? <Check className="w-6 h-6" /> : step.emoji}
                </div>
                <span className={`text-xs text-center max-w-[80px] ${
                  wizardStep === step.id ? "font-semibold" : ""
                }`}>
                  {step.title}
                </span>
              </div>
              {index < wizardSteps.length - 1 && (
                <div className={`w-8 h-1 mx-1 rounded ${
                  wizardStep > step.id ? "bg-green-500" : "bg-muted"
                }`} />
              )}
            </div>
          ))}
        </div>

        {/* Form Content */}
        <div className="bg-muted/30 rounded-lg p-6 min-h-[200px] animate-fade-in">
          {wizardStep === 1 && (
            <div className="space-y-4">
              <h3 className="text-lg font-semibold flex items-center gap-2">
                <span className="text-2xl">👤</span> Persönliche Daten
              </h3>
              <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                <div className="space-y-2">
                  <Label>Vorname</Label>
                  <Input placeholder="Max" />
                </div>
                <div className="space-y-2">
                  <Label>Nachname</Label>
                  <Input placeholder="Mustermann" />
                </div>
                <div className="space-y-2">
                  <Label>Geburtsdatum</Label>
                  <Input type="date" />
                </div>
                <div className="space-y-2">
                  <Label>Telefon</Label>
                  <Input placeholder="+49 123 456789" />
                </div>
              </div>
            </div>
          )}
          {wizardStep === 2 && (
            <div className="space-y-4">
              <h3 className="text-lg font-semibold flex items-center gap-2">
                <span className="text-2xl">❤️</span> Herz & Kreislauf
              </h3>
              <div className="space-y-3">
                <div className="flex items-center space-x-2">
                  <Checkbox id="heart1" />
                  <Label htmlFor="heart1">Herzrasen / Herzklopfen</Label>
                </div>
                <div className="flex items-center space-x-2">
                  <Checkbox id="heart2" />
                  <Label htmlFor="heart2">Bluthochdruck</Label>
                </div>
                <div className="flex items-center space-x-2">
                  <Checkbox id="heart3" />
                  <Label htmlFor="heart3">Niedriger Blutdruck</Label>
                </div>
                <div className="flex items-center space-x-2">
                  <Checkbox id="heart4" />
                  <Label htmlFor="heart4">Herzrhythmusstörungen</Label>
                </div>
              </div>
            </div>
          )}
          {wizardStep === 3 && (
            <div className="space-y-4">
              <h3 className="text-lg font-semibold flex items-center gap-2">
                <span className="text-2xl">🧠</span> Nervensystem
              </h3>
              <div className="space-y-3">
                <div className="flex items-center space-x-2">
                  <Checkbox id="nerve1" />
                  <Label htmlFor="nerve1">Kopfschmerzen / Migräne</Label>
                </div>
                <div className="flex items-center space-x-2">
                  <Checkbox id="nerve2" />
                  <Label htmlFor="nerve2">Schwindel</Label>
                </div>
                <div className="flex items-center space-x-2">
                  <Checkbox id="nerve3" />
                  <Label htmlFor="nerve3">Schlafstörungen</Label>
                </div>
                <div className="flex items-center space-x-2">
                  <Checkbox id="nerve4" />
                  <Label htmlFor="nerve4">Konzentrationsprobleme</Label>
                </div>
              </div>
            </div>
          )}
          {wizardStep >= 4 && (
            <div className="space-y-4">
              <h3 className="text-lg font-semibold flex items-center gap-2">
                <span className="text-2xl">{wizardSteps[wizardStep - 1]?.emoji}</span> 
                {wizardSteps[wizardStep - 1]?.title}
              </h3>
              <p className="text-muted-foreground">
                Weitere Fragen zu diesem Bereich...
              </p>
              <div className="space-y-3">
                <div className="flex items-center space-x-2">
                  <Checkbox />
                  <Label>Beispiel Symptom 1</Label>
                </div>
                <div className="flex items-center space-x-2">
                  <Checkbox />
                  <Label>Beispiel Symptom 2</Label>
                </div>
              </div>
            </div>
          )}
        </div>

        {/* Navigation */}
        <div className="flex justify-between mt-6">
          <Button 
            variant="outline" 
            onClick={() => setWizardStep(Math.max(1, wizardStep - 1))}
            disabled={wizardStep === 1}
          >
            <ChevronLeft className="w-4 h-4 mr-2" />
            Zurück
          </Button>
          <Button 
            onClick={() => setWizardStep(Math.min(wizardSteps.length, wizardStep + 1))}
            disabled={wizardStep === wizardSteps.length}
          >
            Weiter
            <ChevronRight className="w-4 h-4 ml-2" />
          </Button>
        </div>
      </CardContent>
    </Card>
  );

  const AccordionDemo = () => (
    <Card className="border-2 border-secondary/20">
      <CardHeader className="bg-gradient-to-r from-secondary/10 to-secondary/5">
        <CardTitle className="text-xl flex items-center gap-2">
          <Leaf className="w-6 h-6 text-green-500" />
          Option 2: Akkordeon mit Illustrationen
        </CardTitle>
        <p className="text-sm text-muted-foreground mt-2">
          Alle Bereiche auf einer Seite - aufklappbar
        </p>
      </CardHeader>
      <CardContent className="p-6">
        <Accordion type="single" collapsible className="w-full space-y-3">
          {accordionSections.map((section) => {
            const IconComponent = section.icon;
            return (
              <AccordionItem 
                key={section.id} 
                value={section.id}
                className="border rounded-lg px-4 bg-card hover:bg-muted/50 transition-colors"
              >
                <AccordionTrigger className="hover:no-underline">
                  <div className="flex items-center gap-3">
                    <div className={`w-10 h-10 rounded-full bg-muted flex items-center justify-center ${section.color}`}>
                      <IconComponent className="w-5 h-5" />
                    </div>
                    <span className="font-medium">{section.title}</span>
                  </div>
                </AccordionTrigger>
                <AccordionContent className="pt-4 pb-6">
                  {section.id === "personal" ? (
                    <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                      <div className="space-y-2">
                        <Label>Vorname</Label>
                        <Input placeholder="Max" />
                      </div>
                      <div className="space-y-2">
                        <Label>Nachname</Label>
                        <Input placeholder="Mustermann" />
                      </div>
                      <div className="space-y-2">
                        <Label>Geburtsdatum</Label>
                        <Input type="date" />
                      </div>
                      <div className="space-y-2">
                        <Label>Telefon</Label>
                        <Input placeholder="+49 123 456789" />
                      </div>
                    </div>
                  ) : section.id === "heart" ? (
                    <div className="space-y-3">
                      <div className="flex items-start gap-3 p-3 rounded-lg bg-red-50 dark:bg-red-950/20">
                        <Heart className="w-8 h-8 text-red-500 mt-1" />
                        <div className="space-y-2 flex-1">
                          <div className="flex items-center space-x-2">
                            <Checkbox id="acc-heart1" />
                            <Label htmlFor="acc-heart1">Herzrasen / Herzklopfen</Label>
                          </div>
                          <div className="flex items-center space-x-2">
                            <Checkbox id="acc-heart2" />
                            <Label htmlFor="acc-heart2">Bluthochdruck</Label>
                          </div>
                          <div className="flex items-center space-x-2">
                            <Checkbox id="acc-heart3" />
                            <Label htmlFor="acc-heart3">Herzrhythmusstörungen</Label>
                          </div>
                        </div>
                      </div>
                      <div className="space-y-2">
                        <Label>Bemerkungen zu Herz & Kreislauf</Label>
                        <Textarea placeholder="Weitere Angaben..." />
                      </div>
                    </div>
                  ) : section.id === "brain" ? (
                    <div className="space-y-3">
                      <div className="flex items-start gap-3 p-3 rounded-lg bg-purple-50 dark:bg-purple-950/20">
                        <Brain className="w-8 h-8 text-purple-500 mt-1" />
                        <div className="space-y-2 flex-1">
                          <div className="flex items-center space-x-2">
                            <Checkbox id="acc-brain1" />
                            <Label htmlFor="acc-brain1">Kopfschmerzen / Migräne</Label>
                          </div>
                          <div className="flex items-center space-x-2">
                            <Checkbox id="acc-brain2" />
                            <Label htmlFor="acc-brain2">Schwindel</Label>
                          </div>
                          <div className="flex items-center space-x-2">
                            <Checkbox id="acc-brain3" />
                            <Label htmlFor="acc-brain3">Schlafstörungen</Label>
                          </div>
                        </div>
                      </div>
                    </div>
                  ) : (
                    <div className="space-y-3">
                      <div className={`flex items-start gap-3 p-3 rounded-lg bg-muted/50`}>
                        <IconComponent className={`w-8 h-8 ${section.color} mt-1`} />
                        <div className="space-y-2 flex-1">
                          <div className="flex items-center space-x-2">
                            <Checkbox />
                            <Label>Beispiel Symptom 1</Label>
                          </div>
                          <div className="flex items-center space-x-2">
                            <Checkbox />
                            <Label>Beispiel Symptom 2</Label>
                          </div>
                        </div>
                      </div>
                    </div>
                  )}
                </AccordionContent>
              </AccordionItem>
            );
          })}
        </Accordion>
      </CardContent>
    </Card>
  );

  return (
    <Layout>
      <div className="container mx-auto px-4 py-8 max-w-6xl">
        <div className="text-center mb-8">
          <h1 className="text-3xl font-bold mb-4">
            🎨 Layout-Vergleich: Anamnesebogen
          </h1>
          <p className="text-muted-foreground max-w-2xl mx-auto">
            Hier sehen Sie beide Optionen im Vergleich. 
            Klicken Sie durch die Beispiele, um zu sehen, wie das Formular aussehen würde.
          </p>
        </div>

        <div className="grid grid-cols-1 lg:grid-cols-2 gap-8 mb-8">
          <WizardDemo />
          <AccordionDemo />
        </div>

        {/* Comparison Table */}
        <Card className="mb-8">
          <CardHeader>
            <CardTitle>📊 Vergleich der Optionen</CardTitle>
          </CardHeader>
          <CardContent>
            <div className="overflow-x-auto">
              <table className="w-full border-collapse">
                <thead>
                  <tr className="border-b">
                    <th className="text-left p-3 font-semibold">Eigenschaft</th>
                    <th className="text-left p-3 font-semibold">
                      <span className="text-2xl mr-2">📋</span>Wizard + Emojis
                    </th>
                    <th className="text-left p-3 font-semibold">
                      <Leaf className="inline w-5 h-5 mr-2 text-green-500" />
                      Akkordeon + Icons
                    </th>
                  </tr>
                </thead>
                <tbody>
                  <tr className="border-b">
                    <td className="p-3 font-medium">Mobile-Freundlich</td>
                    <td className="p-3 text-green-600">⭐⭐⭐⭐⭐ Exzellent</td>
                    <td className="p-3 text-green-600">⭐⭐⭐⭐ Sehr gut</td>
                  </tr>
                  <tr className="border-b">
                    <td className="p-3 font-medium">Übersicht</td>
                    <td className="p-3">Fokussiert auf einen Bereich</td>
                    <td className="p-3">Alle Bereiche sichtbar</td>
                  </tr>
                  <tr className="border-b">
                    <td className="p-3 font-medium">Benutzerführung</td>
                    <td className="p-3 text-green-600">Schritt für Schritt geführt</td>
                    <td className="p-3">Freie Navigation</td>
                  </tr>
                  <tr className="border-b">
                    <td className="p-3 font-medium">Visueller Stil</td>
                    <td className="p-3">Verspielt mit Emojis 👤❤️🧠</td>
                    <td className="p-3">Professionell mit Icons</td>
                  </tr>
                  <tr className="border-b">
                    <td className="p-3 font-medium">Fortschrittsanzeige</td>
                    <td className="p-3 text-green-600">✅ Klar sichtbar</td>
                    <td className="p-3">Durch auf/zu erkennbar</td>
                  </tr>
                  <tr>
                    <td className="p-3 font-medium">Empfehlung für</td>
                    <td className="p-3">Lange Formulare, ältere Nutzer</td>
                    <td className="p-3">Erfahrene Nutzer, Desktop</td>
                  </tr>
                </tbody>
              </table>
            </div>
          </CardContent>
        </Card>

        {/* Selection */}
        <Card className="bg-gradient-to-br from-primary/5 to-secondary/5 border-2">
          <CardContent className="p-8 text-center">
            <h2 className="text-2xl font-bold mb-4">Welche Option gefällt Ihnen besser?</h2>
            <p className="text-muted-foreground mb-6">
              Klicken Sie auf eine Option, um sie auszuwählen
            </p>
            <div className="flex flex-col sm:flex-row gap-4 justify-center">
              <Button 
                size="lg" 
                variant={selectedDemo === "wizard" ? "default" : "outline"}
                className="text-lg px-8 py-6"
                onClick={() => setSelectedDemo("wizard")}
              >
                <span className="text-2xl mr-2">📋</span>
                Wizard mit Emojis
              </Button>
              <Button 
                size="lg" 
                variant={selectedDemo === "accordion" ? "default" : "outline"}
                className="text-lg px-8 py-6"
                onClick={() => setSelectedDemo("accordion")}
              >
                <Leaf className="w-6 h-6 mr-2" />
                Akkordeon mit Icons
              </Button>
            </div>
            {selectedDemo && (
              <div className="mt-6 p-4 bg-green-100 dark:bg-green-900/30 rounded-lg animate-fade-in">
                <p className="text-green-700 dark:text-green-300 font-medium">
                  ✅ Sie haben "{selectedDemo === "wizard" ? "Wizard mit Emojis" : "Akkordeon mit Icons"}" ausgewählt!
                </p>
                <p className="text-sm text-muted-foreground mt-2">
                  Teilen Sie mir Ihre Wahl im Chat mit, und ich implementiere den vollständigen Anamnesebogen.
                </p>
              </div>
            )}
          </CardContent>
        </Card>
      </div>
    </Layout>
  );
}
