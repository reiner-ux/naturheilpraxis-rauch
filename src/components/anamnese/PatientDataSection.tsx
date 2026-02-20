import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { RadioGroup, RadioGroupItem } from "@/components/ui/radio-group";
import { Checkbox } from "@/components/ui/checkbox";
import { useLanguage } from "@/contexts/LanguageContext";
import { AnamneseFormData } from "@/lib/anamneseFormData";
import { Separator } from "@/components/ui/separator";
import { Button } from "@/components/ui/button";
import { Plus, Trash2 } from "lucide-react";
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "@/components/ui/select";

interface PatientDataSectionProps {
  formData: AnamneseFormData;
  updateFormData: (field: string, value: any) => void;
}

const PatientDataSection = ({ formData, updateFormData }: PatientDataSectionProps) => {
  const { language } = useLanguage();

  const sanitizeName = (raw: string) => {
    // Letters incl. German umlauts, spaces, hyphen, apostrophe
    const cleaned = raw
      .replace(/[^\p{L}\s'\-]/gu, "")
      .replace(/\s{2,}/g, " ")
      .trimStart();
    return cleaned;
  };

  const toggleInfoSource = (value: string, checked: boolean) => {
    const current = Array.isArray(formData.informationsquelle) ? formData.informationsquelle : [];
    const next = checked ? Array.from(new Set([...current, value])) : current.filter((v) => v !== value);
    updateFormData("informationsquelle", next);
  };

  const sanitizeIntInRange = (raw: string, min: number, max: number) => {
    const digitsOnly = raw.replace(/\D+/g, "");
    if (!digitsOnly) return "";
    const n = Number.parseInt(digitsOnly, 10);
    if (Number.isNaN(n)) return "";
    return String(Math.min(max, Math.max(min, n)));
  };

  return (
    <div className="space-y-8">
      {/* A. Personalia */}
      <div>
        <h3 className="text-lg font-semibold mb-4">
          {language === "de" ? "A. Personalia" : "A. Personal Information"}
        </h3>
        <div className="grid gap-4 md:grid-cols-2">
          <div className="space-y-2">
            <Label htmlFor="nachname">{language === "de" ? "Nachname" : "Last Name"} *</Label>
            <Input 
              id="nachname" 
              value={formData.nachname} 
              onChange={(e) => updateFormData("nachname", sanitizeName(e.target.value))} 
              required 
            />
          </div>
          <div className="space-y-2">
            <Label htmlFor="vorname">{language === "de" ? "Vorname" : "First Name"} *</Label>
            <Input 
              id="vorname" 
              value={formData.vorname} 
              onChange={(e) => updateFormData("vorname", sanitizeName(e.target.value))} 
              required 
            />
          </div>
          <div className="space-y-2">
            <Label htmlFor="geburtsdatum">{language === "de" ? "Geburtsdatum" : "Date of Birth"} *</Label>
            <Input 
              id="geburtsdatum" 
              type="date" 
              value={formData.geburtsdatum} 
              onChange={(e) => updateFormData("geburtsdatum", e.target.value)} 
              required 
            />
          </div>
          <div className="space-y-2">
            <Label htmlFor="nationalitaet">{language === "de" ? "Nationalität" : "Nationality"}</Label>
            <Input 
              id="nationalitaet" 
              value={formData.nationalitaet} 
              onChange={(e) => updateFormData("nationalitaet", e.target.value)} 
            />
          </div>
          <div className="space-y-3">
            <Label>{language === "de" ? "Geschlecht" : "Gender"}</Label>
            <RadioGroup 
              value={formData.geschlecht} 
              onValueChange={(value) => updateFormData("geschlecht", value)}
              className="flex flex-wrap gap-4"
            >
              <div className="flex items-center space-x-2">
                <RadioGroupItem value="maennlich" id="maennlich" />
                <Label htmlFor="maennlich" className="font-normal">{language === "de" ? "männlich" : "male"}</Label>
              </div>
              <div className="flex items-center space-x-2">
                <RadioGroupItem value="weiblich" id="weiblich" />
                <Label htmlFor="weiblich" className="font-normal">{language === "de" ? "weiblich" : "female"}</Label>
              </div>
              <div className="flex items-center space-x-2">
                <RadioGroupItem value="divers" id="divers" />
                <Label htmlFor="divers" className="font-normal">{language === "de" ? "divers" : "diverse"}</Label>
              </div>
            </RadioGroup>
          </div>
          <div className="space-y-3">
            <Label>{language === "de" ? "Zivilstand" : "Marital Status"}</Label>
            <RadioGroup 
              value={formData.zivilstand} 
              onValueChange={(value) => updateFormData("zivilstand", value)}
              className="flex flex-wrap gap-4"
            >
              <div className="flex items-center space-x-2">
                <RadioGroupItem value="ledig" id="ledig" />
                <Label htmlFor="ledig" className="font-normal">{language === "de" ? "ledig" : "single"}</Label>
              </div>
              <div className="flex items-center space-x-2">
                <RadioGroupItem value="verheiratet" id="verheiratet" />
                <Label htmlFor="verheiratet" className="font-normal">{language === "de" ? "verheiratet" : "married"}</Label>
              </div>
              <div className="flex items-center space-x-2">
                <RadioGroupItem value="geschieden" id="geschieden" />
                <Label htmlFor="geschieden" className="font-normal">{language === "de" ? "geschieden" : "divorced"}</Label>
              </div>
              <div className="flex items-center space-x-2">
                <RadioGroupItem value="verwitwet" id="verwitwet" />
                <Label htmlFor="verwitwet" className="font-normal">{language === "de" ? "verwitwet" : "widowed"}</Label>
              </div>
            </RadioGroup>
          </div>
        </div>
      </div>

      <Separator />

      {/* B. Kontaktdaten */}
      <div>
        <h3 className="text-lg font-semibold mb-4">
          {language === "de" ? "B. Kontaktdaten" : "B. Contact Information"}
        </h3>
        <div className="grid gap-4 md:grid-cols-2">
          <div className="space-y-2 md:col-span-2">
            <Label htmlFor="strasse">{language === "de" ? "Straße, Hausnummer" : "Street, House Number"}</Label>
            <Input 
              id="strasse" 
              value={formData.strasse} 
              onChange={(e) => updateFormData("strasse", e.target.value)} 
            />
          </div>
          <div className="space-y-2">
            <Label htmlFor="plz">{language === "de" ? "PLZ" : "Postal Code"}</Label>
            <Input 
              id="plz" 
              value={formData.plz} 
              onChange={(e) => updateFormData("plz", e.target.value)} 
            />
          </div>
          <div className="space-y-2">
            <Label htmlFor="wohnort">{language === "de" ? "Wohnort" : "City"}</Label>
            <Input 
              id="wohnort" 
              value={formData.wohnort} 
              onChange={(e) => updateFormData("wohnort", e.target.value)} 
            />
          </div>
          <div className="space-y-2">
            <Label htmlFor="telefonPrivat">{language === "de" ? "Telefon privat" : "Private Phone"}</Label>
            <Input 
              id="telefonPrivat" 
              type="tel"
              value={formData.telefonPrivat} 
              onChange={(e) => updateFormData("telefonPrivat", e.target.value)} 
            />
          </div>
          <div className="space-y-2">
            <Label htmlFor="telefonBeruflich">{language === "de" ? "Telefon beruflich" : "Work Phone"}</Label>
            <Input 
              id="telefonBeruflich" 
              type="tel"
              value={formData.telefonBeruflich} 
              onChange={(e) => updateFormData("telefonBeruflich", e.target.value)} 
            />
          </div>
          <div className="space-y-2">
            <Label htmlFor="mobil">{language === "de" ? "Mobil" : "Mobile"}</Label>
            <Input 
              id="mobil" 
              type="tel"
              value={formData.mobil} 
              onChange={(e) => updateFormData("mobil", e.target.value)} 
            />
          </div>
          <div className="space-y-2">
            <Label htmlFor="email">{language === "de" ? "E-Mail" : "Email"} *</Label>
            <Input 
              id="email" 
              type="email"
              value={formData.email} 
              onChange={(e) => updateFormData("email", e.target.value)} 
              required
            />
          </div>
        </div>
      </div>

      <Separator />

      {/* C. Versicherungsdaten */}
      <div>
        <h3 className="text-lg font-semibold mb-4">
          {language === "de" ? "C. Versicherungsdaten" : "C. Insurance Information"}
        </h3>
        <div className="space-y-4">
          <RadioGroup 
            value={formData.versicherungstyp} 
            onValueChange={(value) => updateFormData("versicherungstyp", value)}
            className="space-y-4"
          >
            <div className="flex items-start space-x-3 p-4 border rounded-lg">
              <RadioGroupItem value="privat" id="privat" className="mt-1" />
              <div className="space-y-2 flex-1">
                <Label htmlFor="privat" className="font-medium">
                  {language === "de" ? "Privatversichert (auch Zusatzversicherungen)" : "Private Insurance (including supplementary)"}
                </Label>
                {formData.versicherungstyp === "privat" && (
                  <div className="grid gap-4 md:grid-cols-2 mt-3">
                    <div className="space-y-2">
                      <Label htmlFor="versicherungsname" className="text-sm">{language === "de" ? "Versicherungsname" : "Insurance Name"}</Label>
                      <Input 
                        id="versicherungsname" 
                        value={formData.versicherungsname} 
                        onChange={(e) => updateFormData("versicherungsname", e.target.value)} 
                      />
                    </div>
                    <div className="space-y-2">
                      <Label htmlFor="versicherungsnummer" className="text-sm">{language === "de" ? "Versicherungsnummer" : "Insurance Number"}</Label>
                      <Input 
                        id="versicherungsnummer" 
                        value={formData.versicherungsnummer} 
                        onChange={(e) => updateFormData("versicherungsnummer", e.target.value)} 
                      />
                    </div>
                    <div className="space-y-2">
                      <Label htmlFor="tarif" className="text-sm">{language === "de" ? "Tarif" : "Tariff"}</Label>
                      <Input 
                        id="tarif" 
                        value={formData.tarif} 
                        onChange={(e) => updateFormData("tarif", e.target.value)} 
                      />
                    </div>
                    <div className="flex items-center space-x-2 self-end pb-2">
                      <Checkbox 
                        id="kostenuebernahme" 
                        checked={formData.kostenuebernahmeNaturheilkunde}
                        onCheckedChange={(checked) => updateFormData("kostenuebernahmeNaturheilkunde", checked)}
                      />
                      <Label htmlFor="kostenuebernahme" className="text-sm font-normal">
                        {language === "de" ? "Kostenübernahme für Naturheilkunde" : "Coverage for naturopathy"}
                      </Label>
                    </div>
                  </div>
                )}
              </div>
            </div>
            <div className="flex items-start space-x-3 p-4 border rounded-lg">
              <RadioGroupItem value="gesetzlich" id="gesetzlich" className="mt-1" />
              <div className="space-y-2 flex-1">
                <Label htmlFor="gesetzlich" className="font-medium">
                  {language === "de" ? "Gesetzlich versichert" : "Statutory Health Insurance"}
                </Label>
                <p className="text-sm text-muted-foreground">
                  {language === "de" 
                    ? "Bitte beachten: Die gesetzliche Krankenversicherung übernimmt in der Regel keine Kosten für Heilpraktiker-Leistungen. Sie sind Selbstzahler."
                    : "Please note: Statutory health insurance usually does not cover costs for naturopathic services. You are a self-payer."}
                </p>
              </div>
            </div>
          </RadioGroup>
        </div>
      </div>

      <Separator />

      {/* D. Berufliche Situation */}
      <div>
        <h3 className="text-lg font-semibold mb-4">
          {language === "de" ? "D. Berufliche Situation" : "D. Professional Situation"}
        </h3>
        <div className="grid gap-4 md:grid-cols-2">
          <div className="space-y-2">
            <Label htmlFor="beruf">{language === "de" ? "Ausgeübte Tätigkeit" : "Occupation"}</Label>
            <Input 
              id="beruf" 
              value={formData.beruf} 
              onChange={(e) => updateFormData("beruf", e.target.value)} 
            />
          </div>
          <div className="space-y-2">
            <Label htmlFor="arbeitgeber">{language === "de" ? "Arbeitgeber/Firma" : "Employer/Company"}</Label>
            <Input 
              id="arbeitgeber" 
              value={formData.arbeitgeber} 
              onChange={(e) => updateFormData("arbeitgeber", e.target.value)} 
            />
          </div>
          <div className="space-y-2">
            <Label htmlFor="branche">{language === "de" ? "Branche/Sektor" : "Industry/Sector"}</Label>
            <Input 
              id="branche" 
              value={formData.branche} 
              onChange={(e) => updateFormData("branche", e.target.value)} 
            />
          </div>
          <div className="space-y-2">
            <Label htmlFor="arbeitsunfaehigSeit">{language === "de" ? "Arbeitsunfähig seit" : "Incapacitated since"}</Label>
            <Input 
              id="arbeitsunfaehigSeit" 
              value={formData.arbeitsunfaehigSeit} 
              onChange={(e) => updateFormData("arbeitsunfaehigSeit", e.target.value)} 
              placeholder={language === "de" ? "falls zutreffend" : "if applicable"}
            />
          </div>
        </div>
      </div>

      <Separator />

      {/* E. Körperliche Grunddaten */}
      <div>
        <h3 className="text-lg font-semibold mb-4">
          {language === "de" ? "E. Körperliche Grunddaten" : "E. Physical Data"}
        </h3>
        <div className="grid gap-4 md:grid-cols-3">
          <div className="space-y-2">
            <Label htmlFor="koerpergroesse">{language === "de" ? "Körpergröße (cm)" : "Height (cm)"}</Label>
            <Input 
              id="koerpergroesse" 
              type="number"
              inputMode="numeric"
              pattern="[0-9]*"
              min={0}
              max={210}
              step={1}
              list="height-options"
              value={formData.koerpergroesse} 
              onChange={(e) => updateFormData("koerpergroesse", sanitizeIntInRange(e.target.value, 0, 210))} 
            />
            <datalist id="height-options">
              {Array.from({ length: 211 }, (_, i) => (
                <option key={i} value={i} />
              ))}
            </datalist>
          </div>
          <div className="space-y-2">
            <Label htmlFor="gewicht">{language === "de" ? "Gewicht (kg)" : "Weight (kg)"}</Label>
            <Input 
              id="gewicht" 
              type="number"
              inputMode="numeric"
              pattern="[0-9]*"
              min={1}
              max={200}
              step={1}
              list="weight-options"
              value={formData.gewicht} 
              onChange={(e) => updateFormData("gewicht", sanitizeIntInRange(e.target.value, 1, 200))} 
            />
            <datalist id="weight-options">
              {Array.from({ length: 200 }, (_, i) => (
                <option key={i + 1} value={i + 1} />
              ))}
            </datalist>
          </div>
          <div className="space-y-2">
            <Label>{language === "de" ? "BMI (berechnet)" : "BMI (calculated)"}</Label>
            <div className="h-10 px-3 py-2 border rounded-md bg-muted flex items-center">
              {formData.koerpergroesse && formData.gewicht 
                ? (Number(formData.gewicht) / Math.pow(Number(formData.koerpergroesse) / 100, 2)).toFixed(1)
                : "—"}
            </div>
          </div>
        </div>
      </div>

      <Separator />

      {/* F. Informationsquelle */}
      <div>
        <h3 className="text-lg font-semibold mb-4">
          {language === "de" ? "F. Wie haben Sie unsere Praxis gefunden?" : "F. How did you find our practice?"}
        </h3>
        <div className="grid gap-2 md:grid-cols-2">
          {[
            { value: "presse", labelDe: "Durch Presse/Internet", labelEn: "Through press/internet" },
            { value: "empfehlung", labelDe: "Durch Empfehlung", labelEn: "Through recommendation" },
            { value: "bni", labelDe: "Durch eine BNI Empfehlung", labelEn: "Through a BNI recommendation" },
            { value: "telefonbuch", labelDe: "Telefonbuch/Branchenbuch", labelEn: "Phone book/directory" },
            { value: "suchmaschine", labelDe: "Suchmaschine", labelEn: "Search engine" },
            { value: "mundpropaganda", labelDe: "Mundpropaganda/Freunde", labelEn: "Word of mouth/friends" },
            { value: "andere", labelDe: "Andere", labelEn: "Other" },
          ].map((option) => {
            const checked = (formData.informationsquelle || []).includes(option.value);
            return (
              <div key={option.value} className="flex items-center space-x-2">
                <Checkbox
                  id={`info-${option.value}`}
                  checked={checked}
                  onCheckedChange={(next) => toggleInfoSource(option.value, !!next)}
                />
                <Label htmlFor={`info-${option.value}`} className="font-normal">
                  {language === "de" ? option.labelDe : option.labelEn}
                </Label>
              </div>
            );
          })}
        </div>

        {(formData.informationsquelle || []).includes("empfehlung") || (formData.informationsquelle || []).includes("bni") ? (
          <div className="mt-3 space-y-2">
            <Label htmlFor="empfehlungVon">{language === "de" ? "Von wem?" : "From whom?"}</Label>
            <Input 
              id="empfehlungVon" 
              value={formData.empfehlungVon} 
              onChange={(e) => updateFormData("empfehlungVon", e.target.value)} 
            />
          </div>
        ) : null}
      </div>

      <Separator />

      {/* G. Vorbehandler */}
      <div>
        <h3 className="text-lg font-semibold mb-4">
          {language === "de" ? "G. Vorbehandler (falls zutreffend)" : "G. Previous Practitioners (if applicable)"}
        </h3>
        <div className="grid gap-4 md:grid-cols-2">
          <div className="space-y-2">
            <Label htmlFor="hausarzt">{language === "de" ? "Hausarzt (Name)" : "Family Doctor (Name)"}</Label>
            <Input 
              id="hausarzt" 
              value={formData.hausarzt} 
              onChange={(e) => updateFormData("hausarzt", sanitizeName(e.target.value))} 
            />
          </div>
          <div className="space-y-2">
            <Label htmlFor="heilpraktiker">{language === "de" ? "Naturheilkundler/Heilpraktiker" : "Naturopath"}</Label>
            <Input 
              id="heilpraktiker" 
              value={formData.heilpraktiker} 
              onChange={(e) => updateFormData("heilpraktiker", sanitizeName(e.target.value))} 
            />
          </div>
          <div className="space-y-2">
            <Label htmlFor="physiotherapeut">{language === "de" ? "Physiotherapeut" : "Physiotherapist"}</Label>
            <Input 
              id="physiotherapeut" 
              value={formData.physiotherapeut} 
              onChange={(e) => updateFormData("physiotherapeut", sanitizeName(e.target.value))} 
            />
          </div>
          <div className="space-y-2">
            <Label htmlFor="psychotherapeut">{language === "de" ? "Psychotherapeut" : "Psychotherapist"}</Label>
            <Input 
              id="psychotherapeut" 
              value={formData.psychotherapeut} 
              onChange={(e) => updateFormData("psychotherapeut", sanitizeName(e.target.value))} 
            />
          </div>
          <div className="space-y-2">
            <Label htmlFor="sonstigeTherapeutenn">{language === "de" ? "Sonstige Therapeuten" : "Other Therapists"}</Label>
            <Input 
              id="sonstigeTherapeutenn" 
              value={formData.sonstigeTherapeutenn} 
              onChange={(e) => updateFormData("sonstigeTherapeutenn", e.target.value)} 
            />
          </div>
        </div>

        {/* Multi-Entry Fachärzte */}
        <div className="mt-6">
          <div className="flex items-center justify-between mb-3">
            <Label className="text-base font-medium">
              {language === "de" ? "Fachärzte" : "Specialists"}
            </Label>
            <Button
              type="button"
              variant="outline"
              size="sm"
              onClick={() => {
                const current = Array.isArray((formData as any).facharztListe) ? (formData as any).facharztListe : [];
                updateFormData("facharztListe", [...current, { fachrichtung: "", name: "" }]);
              }}
            >
              <Plus className="h-4 w-4 mr-1" />
              {language === "de" ? "Facharzt hinzufügen" : "Add Specialist"}
            </Button>
          </div>
          {(Array.isArray((formData as any).facharztListe) ? (formData as any).facharztListe : []).map((entry: any, index: number) => (
            <div key={index} className="flex gap-3 items-start mb-3 p-3 border rounded-lg">
              <div className="flex-1 grid gap-3 md:grid-cols-2">
                <div className="space-y-1">
                  <Label className="text-xs text-muted-foreground">{language === "de" ? "Fachrichtung" : "Specialty"}</Label>
                  <Select
                    value={entry.fachrichtung || ""}
                    onValueChange={(v) => {
                      const list = [...(formData as any).facharztListe];
                      list[index] = { ...list[index], fachrichtung: v };
                      updateFormData("facharztListe", list);
                    }}
                  >
                    <SelectTrigger>
                      <SelectValue placeholder={language === "de" ? "Fachrichtung wählen" : "Select specialty"} />
                    </SelectTrigger>
                    <SelectContent>
                      {[
                        { value: "orthopaedie", de: "Orthopädie", en: "Orthopedics" },
                        { value: "kardiologie", de: "Kardiologie", en: "Cardiology" },
                        { value: "neurologie", de: "Neurologie", en: "Neurology" },
                        { value: "dermatologie", de: "Dermatologie", en: "Dermatology" },
                        { value: "hno", de: "HNO", en: "ENT" },
                        { value: "augenheilkunde", de: "Augenheilkunde", en: "Ophthalmology" },
                        { value: "urologie", de: "Urologie", en: "Urology" },
                        { value: "gynaekologie", de: "Gynäkologie", en: "Gynecology" },
                        { value: "gastroenterologie", de: "Gastroenterologie", en: "Gastroenterology" },
                        { value: "endokrinologie", de: "Endokrinologie", en: "Endocrinology" },
                        { value: "pneumologie", de: "Pneumologie", en: "Pulmonology" },
                        { value: "onkologie", de: "Onkologie", en: "Oncology" },
                        { value: "psychiatrie", de: "Psychiatrie", en: "Psychiatry" },
                        { value: "rheumatologie", de: "Rheumatologie", en: "Rheumatology" },
                        { value: "chirurgie", de: "Chirurgie", en: "Surgery" },
                        { value: "radiologie", de: "Radiologie", en: "Radiology" },
                        { value: "sonstige", de: "Sonstige", en: "Other" },
                      ].map(opt => (
                        <SelectItem key={opt.value} value={opt.value}>
                          {language === "de" ? opt.de : opt.en}
                        </SelectItem>
                      ))}
                    </SelectContent>
                  </Select>
                </div>
                <div className="space-y-1">
                  <Label className="text-xs text-muted-foreground">{language === "de" ? "Name" : "Name"}</Label>
                  <Input
                    value={entry.name || ""}
                    onChange={(e) => {
                      const list = [...(formData as any).facharztListe];
                      list[index] = { ...list[index], name: sanitizeName(e.target.value) };
                      updateFormData("facharztListe", list);
                    }}
                    placeholder={language === "de" ? "Name des Facharztes" : "Specialist name"}
                  />
                </div>
              </div>
              <Button
                type="button"
                variant="ghost"
                size="icon"
                className="text-destructive mt-5"
                onClick={() => {
                  const list = [...(formData as any).facharztListe];
                  list.splice(index, 1);
                  updateFormData("facharztListe", list);
                }}
              >
                <Trash2 className="h-4 w-4" />
              </Button>
            </div>
          ))}
          {(!Array.isArray((formData as any).facharztListe) || (formData as any).facharztListe.length === 0) && (
            <p className="text-sm text-muted-foreground italic">
              {language === "de" ? "Noch keine Fachärzte hinzugefügt. Klicken Sie auf 'Facharzt hinzufügen'." : "No specialists added yet. Click 'Add Specialist'."}
            </p>
          )}
        </div>
      </div>
    </div>
  );
};

export default PatientDataSection;
