import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { Textarea } from "@/components/ui/textarea";
import { RadioGroup, RadioGroupItem } from "@/components/ui/radio-group";
import { Checkbox } from "@/components/ui/checkbox";
import { useLanguage } from "@/contexts/LanguageContext";
import { AnamneseFormData } from "@/lib/anamneseFormData";
import { Separator } from "@/components/ui/separator";
import { Slider } from "@/components/ui/slider";

interface ComplaintsSectionProps {
  formData: AnamneseFormData;
  updateFormData: (field: string, value: any) => void;
}

const ComplaintsSection = ({ formData, updateFormData }: ComplaintsSectionProps) => {
  const { language } = useLanguage();

  const updateBeschwerden = (field: string, value: any) => {
    updateFormData("beschwerden", {
      ...formData.beschwerden,
      [field]: value
    });
  };

  const toggleArrayValue = (field: string, value: string) => {
    const currentArray = formData.beschwerden[field as keyof typeof formData.beschwerden] as string[] || [];
    if (currentArray.includes(value)) {
      updateBeschwerden(field, currentArray.filter(v => v !== value));
    } else {
      updateBeschwerden(field, [...currentArray, value]);
    }
  };

  return (
    <div className="space-y-8">
      <div className="space-y-4">
        <div className="space-y-2">
          <Label htmlFor="hauptbeschwerde" className="text-base font-medium">
            {language === "de" ? "Hauptbeschwerde(n) *" : "Main Complaint(s) *"}
          </Label>
          <p className="text-sm text-muted-foreground">
            {language === "de"
              ? "In eigenen Worten – beschreiben Sie Ihre Beschwerden und warum Sie uns aufgesucht haben:"
              : "In your own words – describe your complaints and why you came to see us:"}
          </p>
          <Textarea
            id="hauptbeschwerde"
            value={formData.beschwerden?.hauptbeschwerde || ""}
            onChange={(e) => updateBeschwerden("hauptbeschwerde", e.target.value)}
            rows={4}
            required
          />
        </div>

        <div className="space-y-2">
          <Label htmlFor="weitereBeschwerden">
            {language === "de" ? "Weitere Beschwerden" : "Additional Complaints"}
          </Label>
          <Textarea
            id="weitereBeschwerden"
            value={formData.beschwerden?.weitereBeschwerden || ""}
            onChange={(e) => updateBeschwerden("weitereBeschwerden", e.target.value)}
            rows={3}
          />
        </div>

        <div className="grid gap-4 md:grid-cols-2">
          <div className="space-y-2">
            <Label htmlFor="beginnDerBeschwerden">
              {language === "de" ? "Beginn der Beschwerden (ungefähr)" : "Onset of Complaints (approximately)"}
            </Label>
            <Input
              id="beginnDerBeschwerden"
              value={formData.beschwerden?.beginnDerBeschwerden || ""}
              onChange={(e) => updateBeschwerden("beginnDerBeschwerden", e.target.value)}
              placeholder={language === "de" ? "z.B. vor 3 Monaten" : "e.g. 3 months ago"}
            />
          </div>

          <div className="space-y-2">
            <Label>{language === "de" ? "Verlauf seit Beginn" : "Course Since Onset"}</Label>
            <RadioGroup
              value={formData.beschwerden?.verlauf || ""}
              onValueChange={(value) => updateBeschwerden("verlauf", value)}
              className="flex flex-wrap gap-3"
            >
              {[
                { value: "konstant", labelDe: "konstant", labelEn: "constant" },
                { value: "zunehmend", labelDe: "zunehmend", labelEn: "increasing" },
                { value: "abnehmend", labelDe: "abnehmend", labelEn: "decreasing" },
                { value: "wechselhaft", labelDe: "wechselhaft", labelEn: "variable" },
              ].map((option) => (
                <div key={option.value} className="flex items-center space-x-2">
                  <RadioGroupItem value={option.value} id={`verlauf-${option.value}`} />
                  <Label htmlFor={`verlauf-${option.value}`} className="font-normal text-sm">
                    {language === "de" ? option.labelDe : option.labelEn}
                  </Label>
                </div>
              ))}
            </RadioGroup>
          </div>
        </div>
      </div>

      <Separator />

      <div className="space-y-4">
        <Label className="text-base font-medium">
          {language === "de" ? "Auftreten der Beschwerden" : "Occurrence of Complaints"}
        </Label>
        <div className="flex flex-wrap gap-4">
          {[
            { value: "staendig", labelDe: "ständig", labelEn: "constantly" },
            { value: "tagsueber", labelDe: "tagsüber", labelEn: "during the day" },
            { value: "nachts", labelDe: "nachts", labelEn: "at night" },
            { value: "nachMahlzeiten", labelDe: "nach Mahlzeiten", labelEn: "after meals" },
            { value: "beiBelastung", labelDe: "bei Belastung", labelEn: "during exertion" },
            { value: "inRuhe", labelDe: "in Ruhephasen", labelEn: "at rest" },
            { value: "unregelmaessig", labelDe: "unregelmäßig", labelEn: "irregularly" },
          ].map((option) => (
            <div key={option.value} className="flex items-center space-x-2">
              <Checkbox
                id={`auftreten-${option.value}`}
                checked={(formData.beschwerden?.auftreten || []).includes(option.value)}
                onCheckedChange={() => toggleArrayValue("auftreten", option.value)}
              />
              <Label htmlFor={`auftreten-${option.value}`} className="font-normal text-sm">
                {language === "de" ? option.labelDe : option.labelEn}
              </Label>
            </div>
          ))}
        </div>
      </div>

      <div className="space-y-4">
        <Label className="text-base font-medium">
          {language === "de" ? "Art der Beschwerden" : "Type of Complaints"}
        </Label>
        <div className="flex flex-wrap gap-4">
          {[
            { value: "schmerz", labelDe: "Schmerz", labelEn: "Pain" },
            { value: "koerperlicheStoerung", labelDe: "körperliche Störung", labelEn: "Physical disorder" },
            { value: "funktionsstoerung", labelDe: "Funktionsstörung", labelEn: "Functional disorder" },
            { value: "psychischeBelastung", labelDe: "psychische Belastung", labelEn: "Psychological burden" },
          ].map((option) => (
            <div key={option.value} className="flex items-center space-x-2">
              <Checkbox
                id={`art-${option.value}`}
                checked={(formData.beschwerden?.artDerBeschwerden || []).includes(option.value)}
                onCheckedChange={() => toggleArrayValue("artDerBeschwerden", option.value)}
              />
              <Label htmlFor={`art-${option.value}`} className="font-normal text-sm">
                {language === "de" ? option.labelDe : option.labelEn}
              </Label>
            </div>
          ))}
        </div>
      </div>

      <Separator />

      {(formData.beschwerden?.artDerBeschwerden || []).includes("schmerz") && (
        <>
          <div className="space-y-4">
            <Label className="text-base font-medium">
              {language === "de" ? "Schmerzqualität" : "Pain Quality"}
            </Label>
            <div className="flex flex-wrap gap-4">
              {[
                { value: "dumpf", labelDe: "dumpf", labelEn: "dull" },
                { value: "stechend", labelDe: "stechend", labelEn: "stabbing" },
                { value: "brennend", labelDe: "brennend", labelEn: "burning" },
                { value: "ziehend", labelDe: "ziehend", labelEn: "pulling" },
                { value: "krampfartig", labelDe: "krampfartig", labelEn: "cramping" },
                { value: "elektrisierend", labelDe: "elektrisierend", labelEn: "electric" },
              ].map((option) => (
                <div key={option.value} className="flex items-center space-x-2">
                  <Checkbox
                    id={`qualitaet-${option.value}`}
                    checked={(formData.beschwerden?.schmerzqualitaet || []).includes(option.value)}
                    onCheckedChange={() => toggleArrayValue("schmerzqualitaet", option.value)}
                  />
                  <Label htmlFor={`qualitaet-${option.value}`} className="font-normal text-sm">
                    {language === "de" ? option.labelDe : option.labelEn}
                  </Label>
                </div>
              ))}
            </div>
          </div>

          <div className="space-y-4">
            <Label className="text-base font-medium">
              {language === "de" ? "Schmerzintensität (0 = keine, 10 = unerträglich)" : "Pain Intensity (0 = none, 10 = unbearable)"}
            </Label>
            <div className="flex items-center gap-4">
              <span className="text-sm text-muted-foreground">0</span>
              <Slider
                value={[Number(formData.beschwerden?.schmerzintensitaet) || 0]}
                onValueChange={(value) => updateBeschwerden("schmerzintensitaet", String(value[0]))}
                max={10}
                step={1}
                className="flex-1"
              />
              <span className="text-sm text-muted-foreground">10</span>
              <span className="w-8 text-center font-semibold">
                {formData.beschwerden?.schmerzintensitaet || "0"}
              </span>
            </div>
          </div>
        </>
      )}

      <div className="space-y-2">
        <Label htmlFor="ausstrahlung">
          {language === "de" ? "Ausstrahlung – Wohin strahlen Beschwerden aus?" : "Radiation – Where do complaints radiate to?"}
        </Label>
        <Input
          id="ausstrahlung"
          value={formData.beschwerden?.ausstrahlung || ""}
          onChange={(e) => updateBeschwerden("ausstrahlung", e.target.value)}
        />
      </div>

      <Separator />

      <div className="space-y-4">
        <Label className="text-base font-medium">
          {language === "de" ? "Auslösende Faktoren (Verschlimmerung)" : "Triggering Factors (Worsening)"}
        </Label>
        <div className="flex flex-wrap gap-4">
          {[
            { value: "kaelte", labelDe: "Kälte", labelEn: "Cold" },
            { value: "waerme", labelDe: "Wärme", labelEn: "Heat" },
            { value: "anstrengung", labelDe: "Anstrengung", labelEn: "Exertion" },
            { value: "ruhe", labelDe: "Ruhe", labelEn: "Rest" },
            { value: "mahlzeiten", labelDe: "Mahlzeiten", labelEn: "Meals" },
            { value: "bestimmteNahrung", labelDe: "bestimmte Nahrung", labelEn: "Specific food" },
            { value: "stress", labelDe: "Stress", labelEn: "Stress" },
            { value: "wetter", labelDe: "Wetter", labelEn: "Weather" },
            { value: "tageszeit", labelDe: "Tageszeit", labelEn: "Time of day" },
          ].map((option) => (
            <div key={option.value} className="flex items-center space-x-2">
              <Checkbox
                id={`verschlimmerung-${option.value}`}
                checked={(formData.beschwerden?.verschlimmerung || []).includes(option.value)}
                onCheckedChange={() => toggleArrayValue("verschlimmerung", option.value)}
              />
              <Label htmlFor={`verschlimmerung-${option.value}`} className="font-normal text-sm">
                {language === "de" ? option.labelDe : option.labelEn}
              </Label>
            </div>
          ))}
        </div>
      </div>

      <div className="space-y-4">
        <Label className="text-base font-medium">
          {language === "de" ? "Lindernde Faktoren (Verbesserung)" : "Relieving Factors (Improvement)"}
        </Label>
        <div className="flex flex-wrap gap-4">
          {[
            { value: "kaelte", labelDe: "Kälte", labelEn: "Cold" },
            { value: "waerme", labelDe: "Wärme", labelEn: "Heat" },
            { value: "bewegung", labelDe: "Bewegung", labelEn: "Movement" },
            { value: "ruhe", labelDe: "Ruhe", labelEn: "Rest" },
            { value: "spezifischeNahrung", labelDe: "spezifische Nahrung", labelEn: "Specific food" },
            { value: "lagerung", labelDe: "Lagerung", labelEn: "Positioning" },
            { value: "meditation", labelDe: "Meditation", labelEn: "Meditation" },
            { value: "bestimmteAktivitaet", labelDe: "bestimmte Aktivität", labelEn: "Specific activity" },
          ].map((option) => (
            <div key={option.value} className="flex items-center space-x-2">
              <Checkbox
                id={`verbesserung-${option.value}`}
                checked={(formData.beschwerden?.verbesserung || []).includes(option.value)}
                onCheckedChange={() => toggleArrayValue("verbesserung", option.value)}
              />
              <Label htmlFor={`verbesserung-${option.value}`} className="font-normal text-sm">
                {language === "de" ? option.labelDe : option.labelEn}
              </Label>
            </div>
          ))}
        </div>
      </div>

      <Separator />

      <div className="space-y-4">
        <div className="space-y-2">
          <Label htmlFor="bisherigeBehandlungen">
            {language === "de" ? "Bereits versuchte Behandlungen" : "Previously Tried Treatments"}
          </Label>
          <Textarea
            id="bisherigeBehandlungen"
            value={formData.beschwerden?.bisherigeBehandlungen || ""}
            onChange={(e) => updateBeschwerden("bisherigeBehandlungen", e.target.value)}
            rows={3}
          />
        </div>

        <div className="space-y-2">
          <Label>{language === "de" ? "Ergebnis bisheriger Behandlungen" : "Result of Previous Treatments"}</Label>
          <RadioGroup
            value={formData.beschwerden?.ergebnisBisherigerBehandlungen || ""}
            onValueChange={(value) => updateBeschwerden("ergebnisBisherigerBehandlungen", value)}
            className="flex flex-wrap gap-4"
          >
            {[
              { value: "gutGeholfen", labelDe: "gut geholfen", labelEn: "helped well" },
              { value: "teilweiseGeholfen", labelDe: "teilweise geholfen", labelEn: "partially helped" },
              { value: "nichtGeholfen", labelDe: "nicht geholfen", labelEn: "did not help" },
              { value: "verschlimmert", labelDe: "verschlimmert", labelEn: "worsened" },
            ].map((option) => (
              <div key={option.value} className="flex items-center space-x-2">
                <RadioGroupItem value={option.value} id={`ergebnis-${option.value}`} />
                <Label htmlFor={`ergebnis-${option.value}`} className="font-normal text-sm">
                  {language === "de" ? option.labelDe : option.labelEn}
                </Label>
              </div>
            ))}
          </RadioGroup>
        </div>
      </div>
    </div>
  );
};

export default ComplaintsSection;
