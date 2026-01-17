import { useState } from "react";
import { Layout } from "@/components/layout/Layout";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Textarea } from "@/components/ui/textarea";
import { Label } from "@/components/ui/label";
import { Checkbox } from "@/components/ui/checkbox";
import { RadioGroup, RadioGroupItem } from "@/components/ui/radio-group";
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card";
import { toast } from "sonner";
import { Send, User, Heart, Pill, AlertCircle } from "lucide-react";

const Anamnesebogen = () => {
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

      <div className="container py-12">
        <form onSubmit={handleSubmit} className="mx-auto max-w-3xl space-y-8">
          {/* Persönliche Daten */}
          <Card className="shadow-card">
            <CardHeader>
              <div className="flex items-center gap-3">
                <div className="flex h-10 w-10 items-center justify-center rounded-lg bg-sage-100">
                  <User className="h-5 w-5 text-primary" />
                </div>
                <div>
                  <CardTitle className="font-serif">Persönliche Daten</CardTitle>
                  <CardDescription>Ihre Kontaktinformationen</CardDescription>
                </div>
              </div>
            </CardHeader>
            <CardContent className="grid gap-4 md:grid-cols-2">
              <div className="space-y-2">
                <Label htmlFor="vorname">Vorname *</Label>
                <Input
                  id="vorname"
                  name="vorname"
                  value={formData.vorname}
                  onChange={handleInputChange}
                  required
                />
              </div>
              <div className="space-y-2">
                <Label htmlFor="nachname">Nachname *</Label>
                <Input
                  id="nachname"
                  name="nachname"
                  value={formData.nachname}
                  onChange={handleInputChange}
                  required
                />
              </div>
              <div className="space-y-2">
                <Label htmlFor="geburtsdatum">Geburtsdatum *</Label>
                <Input
                  id="geburtsdatum"
                  name="geburtsdatum"
                  type="date"
                  value={formData.geburtsdatum}
                  onChange={handleInputChange}
                  required
                />
              </div>
              <div className="space-y-2">
                <Label htmlFor="telefon">Telefon</Label>
                <Input
                  id="telefon"
                  name="telefon"
                  type="tel"
                  value={formData.telefon}
                  onChange={handleInputChange}
                />
              </div>
              <div className="space-y-2 md:col-span-2">
                <Label htmlFor="email">E-Mail</Label>
                <Input
                  id="email"
                  name="email"
                  type="email"
                  value={formData.email}
                  onChange={handleInputChange}
                />
              </div>
              <div className="space-y-2 md:col-span-2">
                <Label htmlFor="adresse">Adresse</Label>
                <Input
                  id="adresse"
                  name="adresse"
                  value={formData.adresse}
                  onChange={handleInputChange}
                />
              </div>
              <div className="space-y-2 md:col-span-2">
                <Label htmlFor="beruf">Beruf</Label>
                <Input
                  id="beruf"
                  name="beruf"
                  value={formData.beruf}
                  onChange={handleInputChange}
                />
              </div>
            </CardContent>
          </Card>

          {/* Aktuelle Beschwerden */}
          <Card className="shadow-card">
            <CardHeader>
              <div className="flex items-center gap-3">
                <div className="flex h-10 w-10 items-center justify-center rounded-lg bg-terracotta/20">
                  <AlertCircle className="h-5 w-5 text-accent" />
                </div>
                <div>
                  <CardTitle className="font-serif">Aktuelle Beschwerden</CardTitle>
                  <CardDescription>Warum kommen Sie zu mir?</CardDescription>
                </div>
              </div>
            </CardHeader>
            <CardContent className="space-y-4">
              <div className="space-y-2">
                <Label htmlFor="hauptbeschwerden">Hauptbeschwerden / Grund des Besuchs *</Label>
                <Textarea
                  id="hauptbeschwerden"
                  name="hauptbeschwerden"
                  value={formData.hauptbeschwerden}
                  onChange={handleInputChange}
                  placeholder="Beschreiben Sie Ihre aktuellen Beschwerden..."
                  rows={4}
                  required
                />
              </div>
              <div className="space-y-2">
                <Label htmlFor="beschwerdenbeginn">Seit wann bestehen die Beschwerden?</Label>
                <Input
                  id="beschwerdenbeginn"
                  name="beschwerdenbeginn"
                  value={formData.beschwerdenbeginn}
                  onChange={handleInputChange}
                  placeholder="z.B. seit 3 Monaten, seit Kindheit..."
                />
              </div>
              <div className="space-y-3">
                <Label>Schmerzintensität (falls zutreffend)</Label>
                <RadioGroup
                  value={formData.schmerzintensitaet}
                  onValueChange={(value) => setFormData((prev) => ({ ...prev, schmerzintensitaet: value }))}
                  className="flex flex-wrap gap-4"
                >
                  {["Leicht", "Mittel", "Stark", "Sehr stark"].map((level) => (
                    <div key={level} className="flex items-center space-x-2">
                      <RadioGroupItem value={level.toLowerCase()} id={`schmerz-${level}`} />
                      <Label htmlFor={`schmerz-${level}`} className="font-normal">{level}</Label>
                    </div>
                  ))}
                </RadioGroup>
              </div>
            </CardContent>
          </Card>

          {/* Vorerkrankungen */}
          <Card className="shadow-card">
            <CardHeader>
              <div className="flex items-center gap-3">
                <div className="flex h-10 w-10 items-center justify-center rounded-lg bg-sage-100">
                  <Heart className="h-5 w-5 text-primary" />
                </div>
                <div>
                  <CardTitle className="font-serif">Vorerkrankungen</CardTitle>
                  <CardDescription>Ihre medizinische Geschichte</CardDescription>
                </div>
              </div>
            </CardHeader>
            <CardContent className="space-y-4">
              <div className="space-y-2">
                <Label htmlFor="vorerkrankungen">Bekannte Vorerkrankungen</Label>
                <Textarea
                  id="vorerkrankungen"
                  name="vorerkrankungen"
                  value={formData.vorerkrankungen}
                  onChange={handleInputChange}
                  placeholder="z.B. Bluthochdruck, Diabetes, Schilddrüsenerkrankung..."
                  rows={3}
                />
              </div>
              <div className="space-y-2">
                <Label htmlFor="operationen">Frühere Operationen</Label>
                <Textarea
                  id="operationen"
                  name="operationen"
                  value={formData.operationen}
                  onChange={handleInputChange}
                  placeholder="Jahr und Art der Operation..."
                  rows={2}
                />
              </div>
              <div className="space-y-2">
                <Label htmlFor="allergien">Allergien / Unverträglichkeiten</Label>
                <Textarea
                  id="allergien"
                  name="allergien"
                  value={formData.allergien}
                  onChange={handleInputChange}
                  placeholder="z.B. Medikamente, Lebensmittel, Pollen..."
                  rows={2}
                />
              </div>
            </CardContent>
          </Card>

          {/* Medikamente */}
          <Card className="shadow-card">
            <CardHeader>
              <div className="flex items-center gap-3">
                <div className="flex h-10 w-10 items-center justify-center rounded-lg bg-sage-100">
                  <Pill className="h-5 w-5 text-primary" />
                </div>
                <div>
                  <CardTitle className="font-serif">Aktuelle Medikamente</CardTitle>
                  <CardDescription>Welche Medikamente nehmen Sie ein?</CardDescription>
                </div>
              </div>
            </CardHeader>
            <CardContent>
              <div className="space-y-2">
                <Label htmlFor="aktuelle_medikamente">Medikamente und Dosierung</Label>
                <Textarea
                  id="aktuelle_medikamente"
                  name="aktuelle_medikamente"
                  value={formData.aktuelle_medikamente}
                  onChange={handleInputChange}
                  placeholder="Medikament, Dosierung, wie oft täglich..."
                  rows={4}
                />
              </div>
            </CardContent>
          </Card>

          {/* Lebensgewohnheiten */}
          <Card className="shadow-card">
            <CardHeader>
              <CardTitle className="font-serif">Lebensgewohnheiten</CardTitle>
              <CardDescription>Ihr Lebensstil beeinflusst Ihre Gesundheit</CardDescription>
            </CardHeader>
            <CardContent className="space-y-4">
              <div className="flex items-center space-x-2">
                <Checkbox
                  id="raucher"
                  checked={formData.raucher}
                  onCheckedChange={(checked) => handleCheckboxChange("raucher", checked as boolean)}
                />
                <Label htmlFor="raucher" className="font-normal">Ich bin Raucher/in</Label>
              </div>
              
              <div className="grid gap-4 md:grid-cols-2">
                <div className="space-y-2">
                  <Label htmlFor="alkohol">Alkoholkonsum</Label>
                  <Input
                    id="alkohol"
                    name="alkohol"
                    value={formData.alkohol}
                    onChange={handleInputChange}
                    placeholder="z.B. selten, gelegentlich, täglich"
                  />
                </div>
                <div className="space-y-2">
                  <Label htmlFor="bewegung">Bewegung / Sport</Label>
                  <Input
                    id="bewegung"
                    name="bewegung"
                    value={formData.bewegung}
                    onChange={handleInputChange}
                    placeholder="z.B. 2x pro Woche Joggen"
                  />
                </div>
                <div className="space-y-2">
                  <Label htmlFor="schlaf">Schlafqualität</Label>
                  <Input
                    id="schlaf"
                    name="schlaf"
                    value={formData.schlaf}
                    onChange={handleInputChange}
                    placeholder="z.B. gut, Einschlafprobleme"
                  />
                </div>
                <div className="space-y-2">
                  <Label htmlFor="stress">Stresslevel</Label>
                  <Input
                    id="stress"
                    name="stress"
                    value={formData.stress}
                    onChange={handleInputChange}
                    placeholder="z.B. niedrig, mittel, hoch"
                  />
                </div>
              </div>
              
              <div className="space-y-2">
                <Label htmlFor="ernaehrung">Ernährungsgewohnheiten</Label>
                <Textarea
                  id="ernaehrung"
                  name="ernaehrung"
                  value={formData.ernaehrung}
                  onChange={handleInputChange}
                  placeholder="z.B. vegetarisch, viel Gemüse, wenig Zeit zum Kochen..."
                  rows={2}
                />
              </div>
            </CardContent>
          </Card>

          {/* Familienanamnese */}
          <Card className="shadow-card">
            <CardHeader>
              <CardTitle className="font-serif">Familienanamnese</CardTitle>
              <CardDescription>Erkrankungen in der Familie</CardDescription>
            </CardHeader>
            <CardContent>
              <div className="space-y-2">
                <Label htmlFor="familienanamnese">Bekannte Erkrankungen bei Eltern, Großeltern, Geschwistern</Label>
                <Textarea
                  id="familienanamnese"
                  name="familienanamnese"
                  value={formData.familienanamnese}
                  onChange={handleInputChange}
                  placeholder="z.B. Vater: Herzerkrankung, Mutter: Diabetes..."
                  rows={3}
                />
              </div>
            </CardContent>
          </Card>

          {/* Sonstiges */}
          <Card className="shadow-card">
            <CardHeader>
              <CardTitle className="font-serif">Sonstige Anmerkungen</CardTitle>
              <CardDescription>Gibt es noch etwas, das ich wissen sollte?</CardDescription>
            </CardHeader>
            <CardContent>
              <Textarea
                id="sonstiges"
                name="sonstiges"
                value={formData.sonstiges}
                onChange={handleInputChange}
                placeholder="Weitere Informationen, Fragen oder Wünsche..."
                rows={4}
              />
            </CardContent>
          </Card>

          {/* Submit */}
          <div className="flex justify-center">
            <Button type="submit" variant="hero" size="xl">
              <Send className="mr-2 h-5 w-5" />
              Anamnesebogen absenden
            </Button>
          </div>
        </form>
      </div>
    </Layout>
  );
};

export default Anamnesebogen;
