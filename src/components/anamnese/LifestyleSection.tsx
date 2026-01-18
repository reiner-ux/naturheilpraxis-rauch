import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { Textarea } from "@/components/ui/textarea";
import { RadioGroup, RadioGroupItem } from "@/components/ui/radio-group";
import { Checkbox } from "@/components/ui/checkbox";
import { useLanguage } from "@/contexts/LanguageContext";
import { AnamneseFormData } from "@/lib/anamneseFormData";
import { Separator } from "@/components/ui/separator";
import { Slider } from "@/components/ui/slider";

interface LifestyleSectionProps {
  formData: AnamneseFormData;
  updateFormData: (field: string, value: any) => void;
}

const LifestyleSection = ({ formData, updateFormData }: LifestyleSectionProps) => {
  const { language } = useLanguage();

  const updateLebensweise = (field: string, value: any) => {
    updateFormData("lebensweise", {
      ...formData.lebensweise,
      [field]: value
    });
  };

  const updateNestedField = (parentField: string, field: string, value: any) => {
    updateFormData("lebensweise", {
      ...formData.lebensweise,
      [parentField]: {
        ...(formData.lebensweise[parentField as keyof typeof formData.lebensweise] as object),
        [field]: value
      }
    });
  };

  return (
    <div className="space-y-8">
      {/* Rauchen */}
      <div className="space-y-4">
        <h3 className="text-lg font-medium">
          {language === "de" ? "Rauchen" : "Smoking"}
        </h3>

        <RadioGroup
          value={formData.lebensweise?.raucher || ""}
          onValueChange={(value) => updateLebensweise("raucher", value)}
          className="space-y-3"
        >
          {[
            { value: "nein", labelDe: "Ich rauche nicht", labelEn: "I don't smoke" },
            { value: "aktiv", labelDe: "Ich rauche aktiv", labelEn: "I smoke actively" },
            { value: "ehemals", labelDe: "Ich habe früher geraucht", labelEn: "I used to smoke" },
          ].map((option) => (
            <div key={option.value} className="flex items-center space-x-2">
              <RadioGroupItem value={option.value} id={`raucher-${option.value}`} />
              <Label htmlFor={`raucher-${option.value}`} className="font-normal">
                {language === "de" ? option.labelDe : option.labelEn}
              </Label>
            </div>
          ))}
        </RadioGroup>

        {formData.lebensweise?.raucher === "aktiv" && (
          <div className="grid gap-4 md:grid-cols-2 pl-6">
            <div className="space-y-2">
              <Label>{language === "de" ? "Rauche seit wann?" : "Smoking since when?"}</Label>
              <Input
                value={formData.lebensweise?.raucherSeitWann || ""}
                onChange={(e) => updateLebensweise("raucherSeitWann", e.target.value)}
                placeholder={language === "de" ? "z.B. seit 2010" : "e.g. since 2010"}
              />
            </div>
            <div className="space-y-2">
              <Label>{language === "de" ? "Zigaretten pro Tag" : "Cigarettes per day"}</Label>
              <Input
                value={formData.lebensweise?.zigarettenProTag || ""}
                onChange={(e) => updateLebensweise("zigarettenProTag", e.target.value)}
                placeholder={language === "de" ? "z.B. 10" : "e.g. 10"}
              />
            </div>
          </div>
        )}

        {formData.lebensweise?.raucher === "ehemals" && (
          <div className="space-y-2 pl-6">
            <Label>{language === "de" ? "Aufgehört wann?" : "Quit when?"}</Label>
            <Input
              className="max-w-xs"
              value={formData.lebensweise?.exRaucherBisWann || ""}
              onChange={(e) => updateLebensweise("exRaucherBisWann", e.target.value)}
              placeholder={language === "de" ? "z.B. 2020" : "e.g. 2020"}
            />
          </div>
        )}

        <div className="space-y-2">
          <Label>{language === "de" ? "Passivrauch-Exposition" : "Passive smoke exposure"}</Label>
          <Input
            value={formData.lebensweise?.passivRauchen || ""}
            onChange={(e) => updateLebensweise("passivRauchen", e.target.value)}
            placeholder={language === "de" ? "z.B. Partner raucht, Arbeitsplatz" : "e.g. Partner smokes, workplace"}
          />
        </div>
      </div>

      <Separator />

      {/* Alkohol */}
      <div className="space-y-4">
        <h3 className="text-lg font-medium">
          {language === "de" ? "Alkohol" : "Alcohol"}
        </h3>

        <div className="flex items-center space-x-2">
          <Checkbox
            id="alkohol"
            checked={formData.lebensweise?.alkohol?.ja || false}
            onCheckedChange={(checked) => updateNestedField("alkohol", "ja", checked)}
          />
          <Label htmlFor="alkohol">
            {language === "de" ? "Ich trinke regelmäßig Alkohol" : "I drink alcohol regularly"}
          </Label>
        </div>

        {formData.lebensweise?.alkohol?.ja && (
          <div className="grid gap-4 md:grid-cols-3 pl-6">
            <div className="space-y-2">
              <Label>{language === "de" ? "Seit wann?" : "Since when?"}</Label>
              <Input
                value={formData.lebensweise?.alkohol?.seitWann || ""}
                onChange={(e) => updateNestedField("alkohol", "seitWann", e.target.value)}
              />
            </div>
            <div className="space-y-2">
              <Label>{language === "de" ? "Menge pro Tag/Woche" : "Amount per day/week"}</Label>
              <Input
                value={formData.lebensweise?.alkohol?.mengeProTag || ""}
                onChange={(e) => updateNestedField("alkohol", "mengeProTag", e.target.value)}
                placeholder={language === "de" ? "z.B. 2 Gläser Wein/Woche" : "e.g. 2 glasses wine/week"}
              />
            </div>
            <div className="space-y-2">
              <Label>{language === "de" ? "Art des Alkohols" : "Type of alcohol"}</Label>
              <Input
                value={formData.lebensweise?.alkohol?.typ || ""}
                onChange={(e) => updateNestedField("alkohol", "typ", e.target.value)}
                placeholder={language === "de" ? "z.B. Wein, Bier" : "e.g. Wine, Beer"}
              />
            </div>
          </div>
        )}
      </div>

      <Separator />

      {/* Bewegung & Sport */}
      <div className="space-y-4">
        <h3 className="text-lg font-medium">
          {language === "de" ? "Bewegung & Sport" : "Exercise & Sports"}
        </h3>

        <div className="space-y-4">
          <div className="flex items-center space-x-2">
            <Checkbox
              id="sport"
              checked={formData.lebensweise?.sport?.ja || false}
              onCheckedChange={(checked) => updateNestedField("sport", "ja", checked)}
            />
            <Label htmlFor="sport">
              {language === "de" ? "Ich treibe regelmäßig Sport" : "I exercise regularly"}
            </Label>
          </div>

          {formData.lebensweise?.sport?.ja && (
            <div className="grid gap-4 md:grid-cols-2 pl-6">
              <div className="space-y-2">
                <Label>{language === "de" ? "Wie oft pro Woche?" : "How often per week?"}</Label>
                <Input
                  value={formData.lebensweise?.sport?.proWoche || ""}
                  onChange={(e) => updateNestedField("sport", "proWoche", e.target.value)}
                  placeholder={language === "de" ? "z.B. 3x" : "e.g. 3x"}
                />
              </div>
              <div className="space-y-2">
                <Label>{language === "de" ? "Welche Sportarten?" : "Which sports?"}</Label>
                <Input
                  value={formData.lebensweise?.sport?.art || ""}
                  onChange={(e) => updateNestedField("sport", "art", e.target.value)}
                  placeholder={language === "de" ? "z.B. Joggen, Schwimmen" : "e.g. Jogging, Swimming"}
                />
              </div>
            </div>
          )}
        </div>

        <div className="space-y-4">
          <div className="flex items-center space-x-2">
            <Checkbox
              id="spaziergang"
              checked={formData.lebensweise?.spaziergang?.ja || false}
              onCheckedChange={(checked) => updateNestedField("spaziergang", "ja", checked)}
            />
            <Label htmlFor="spaziergang">
              {language === "de" ? "Regelmäßige Spaziergänge" : "Regular walks"}
            </Label>
          </div>

          {formData.lebensweise?.spaziergang?.ja && (
            <div className="grid gap-4 md:grid-cols-2 pl-6">
              <div className="space-y-2">
                <Label>{language === "de" ? "Wie oft pro Woche?" : "How often per week?"}</Label>
                <Input
                  value={formData.lebensweise?.spaziergang?.proWoche || ""}
                  onChange={(e) => updateNestedField("spaziergang", "proWoche", e.target.value)}
                />
              </div>
              <div className="space-y-2">
                <Label>{language === "de" ? "Dauer in Minuten" : "Duration in minutes"}</Label>
                <Input
                  value={formData.lebensweise?.spaziergang?.dauerMinuten || ""}
                  onChange={(e) => updateNestedField("spaziergang", "dauerMinuten", e.target.value)}
                />
              </div>
            </div>
          )}
        </div>

        <div className="space-y-2">
          <Label>{language === "de" ? "Geschätzte tägliche Gehstrecke (Meter)" : "Estimated daily walking distance (meters)"}</Label>
          <Input
            value={formData.lebensweise?.meterZuFuss || ""}
            onChange={(e) => updateLebensweise("meterZuFuss", e.target.value)}
            placeholder={language === "de" ? "z.B. 3000" : "e.g. 3000"}
            className="max-w-xs"
          />
        </div>
      </div>

      <Separator />

      {/* Schlaf */}
      <div className="space-y-4">
        <h3 className="text-lg font-medium">
          {language === "de" ? "Schlaf" : "Sleep"}
        </h3>

        <div className="grid gap-4 md:grid-cols-2">
          <div className="space-y-2">
            <Label>{language === "de" ? "Schlafqualität" : "Sleep quality"}</Label>
            <RadioGroup
              value={formData.lebensweise?.schlafQualitaet || ""}
              onValueChange={(value) => updateLebensweise("schlafQualitaet", value)}
              className="flex flex-wrap gap-4"
            >
              {[
                { value: "gut", labelDe: "Gut", labelEn: "Good" },
                { value: "maessig", labelDe: "Mäßig", labelEn: "Fair" },
                { value: "schlecht", labelDe: "Schlecht", labelEn: "Poor" },
              ].map((option) => (
                <div key={option.value} className="flex items-center space-x-2">
                  <RadioGroupItem value={option.value} id={`schlaf-${option.value}`} />
                  <Label htmlFor={`schlaf-${option.value}`} className="font-normal">
                    {language === "de" ? option.labelDe : option.labelEn}
                  </Label>
                </div>
              ))}
            </RadioGroup>
          </div>

          <div className="space-y-2">
            <Label>{language === "de" ? "Durchschnittliche Schlafdauer (Stunden)" : "Average sleep duration (hours)"}</Label>
            <Input
              value={formData.lebensweise?.schlafDauer || ""}
              onChange={(e) => updateLebensweise("schlafDauer", e.target.value)}
              placeholder={language === "de" ? "z.B. 7" : "e.g. 7"}
            />
          </div>
        </div>
      </div>

      <Separator />

      {/* Stress */}
      <div className="space-y-4">
        <h3 className="text-lg font-medium">
          {language === "de" ? "Stress" : "Stress"}
        </h3>

        <div className="space-y-2">
          <Label>{language === "de" ? "Stresslevel (1 = niedrig, 10 = sehr hoch)" : "Stress level (1 = low, 10 = very high)"}</Label>
          <div className="flex items-center gap-4 max-w-md">
            <span className="text-sm text-muted-foreground">1</span>
            <Slider
              value={[Number(formData.lebensweise?.stressLevel) || 5]}
              onValueChange={(value) => updateLebensweise("stressLevel", String(value[0]))}
              max={10}
              min={1}
              step={1}
              className="flex-1"
            />
            <span className="text-sm text-muted-foreground">10</span>
            <span className="w-8 text-center font-semibold">
              {formData.lebensweise?.stressLevel || "5"}
            </span>
          </div>
        </div>
      </div>

      <Separator />

      {/* Ernährung */}
      <div className="space-y-4">
        <h3 className="text-lg font-medium">
          {language === "de" ? "Ernährung" : "Nutrition"}
        </h3>

        <div className="space-y-2">
          <Label htmlFor="ernaehrungsgewohnheiten">
            {language === "de" ? "Ernährungsgewohnheiten" : "Eating habits"}
          </Label>
          <Textarea
            id="ernaehrungsgewohnheiten"
            value={formData.lebensweise?.ernaehrungsgewohnheiten || ""}
            onChange={(e) => updateLebensweise("ernaehrungsgewohnheiten", e.target.value)}
            placeholder={language === "de" 
              ? "z.B. vegetarisch, vegan, mediterran, Low-Carb, regelmäßige Mahlzeiten..."
              : "e.g. vegetarian, vegan, Mediterranean, low-carb, regular meals..."}
            rows={3}
          />
        </div>
      </div>
    </div>
  );
};

export default LifestyleSection;
