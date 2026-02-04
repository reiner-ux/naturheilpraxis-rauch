import { Label } from "@/components/ui/label";
import { Textarea } from "@/components/ui/textarea";
import { RadioGroup, RadioGroupItem } from "@/components/ui/radio-group";
import { Checkbox } from "@/components/ui/checkbox";
import { useLanguage } from "@/contexts/LanguageContext";
import { AnamneseFormData } from "@/lib/anamneseFormData";
import { Separator } from "@/components/ui/separator";
import { Slider } from "@/components/ui/slider";
import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from "@/components/ui/select";
import MultiSelectCheckbox from "./shared/MultiSelectCheckbox";
import YearMonthSelect from "./shared/YearMonthSelect";
import {
  passiveSmokingOptions,
  alcoholTypes,
  sportsTypes,
  walkingDistanceOptions,
  sleepDurationOptions,
  eatingHabitsOptions,
} from "@/lib/medicalOptions";
import { Cigarette, Wine, Dumbbell, Moon, Activity, Utensils } from "lucide-react";
import NumericInput from "./shared/NumericInput";

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

  const updateAlkoholTyp = (typ: string, checked: boolean, menge: string = "") => {
    const current = formData.lebensweise?.alkohol?.typen || [];
    if (checked) {
      updateNestedField("alkohol", "typen", [...current, { typ, menge }]);
    } else {
      updateNestedField("alkohol", "typen", current.filter((t: any) => t.typ !== typ));
    }
  };

  const updateAlkoholMenge = (typ: string, menge: string) => {
    const current = formData.lebensweise?.alkohol?.typen || [];
    updateNestedField("alkohol", "typen", current.map((t: any) => 
      t.typ === typ ? { ...t, menge } : t
    ));
  };

  const getAlkoholMenge = (typ: string): string => {
    const found = (formData.lebensweise?.alkohol?.typen || []).find((t: any) => t.typ === typ);
    return found?.menge || "";
  };

  const isAlkoholTypSelected = (typ: string): boolean => {
    return (formData.lebensweise?.alkohol?.typen || []).some((t: any) => t.typ === typ);
  };

  return (
    <div className="space-y-8">
      {/* Rauchen */}
      <div className="space-y-4">
        <h3 className="text-lg font-medium flex items-center gap-2">
          <Cigarette className="w-5 h-5 text-muted-foreground" />
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
              <YearMonthSelect
                yearValue={formData.lebensweise?.raucherSeitWann || ""}
                onYearChange={(value) => updateLebensweise("raucherSeitWann", value)}
                showMonth={false}
              />
            </div>
            <div className="space-y-2">
              <Label>{language === "de" ? "Zigaretten pro Tag" : "Cigarettes per day"}</Label>
              <NumericInput
                value={formData.lebensweise?.zigarettenProTag || ""}
                onChange={(value) => updateLebensweise("zigarettenProTag", value)}
                min={1}
                max={100}
                placeholder={language === "de" ? "z.B. 10" : "e.g. 10"}
              />
            </div>
          </div>
        )}

        {formData.lebensweise?.raucher === "ehemals" && (
          <div className="space-y-2 pl-6">
            <Label>{language === "de" ? "Aufgehört wann?" : "Quit when?"}</Label>
            <YearMonthSelect
              yearValue={formData.lebensweise?.exRaucherBisWann || ""}
              onYearChange={(value) => updateLebensweise("exRaucherBisWann", value)}
              showMonth={false}
            />
          </div>
        )}

        <div className="space-y-2">
          <Label>{language === "de" ? "Passivrauch-Exposition" : "Passive smoke exposure"}</Label>
          <MultiSelectCheckbox
            options={passiveSmokingOptions}
            selectedValues={formData.lebensweise?.passivRauchenTypen || []}
            onChange={(values) => updateLebensweise("passivRauchenTypen", values)}
            allowOther={true}
            otherValue={formData.lebensweise?.passivRauchenSonstiges || ""}
            onOtherChange={(value) => updateLebensweise("passivRauchenSonstiges", value)}
            otherPlaceholderDe="Sonstige Exposition..."
            otherPlaceholderEn="Other exposure..."
            columns={2}
          />
        </div>
      </div>

      <Separator />

      {/* Alkohol */}
      <div className="space-y-4">
        <h3 className="text-lg font-medium flex items-center gap-2">
          <Wine className="w-5 h-5 text-muted-foreground" />
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
          <div className="space-y-4 pl-6">
            <div className="space-y-2">
              <Label>{language === "de" ? "Seit wann?" : "Since when?"}</Label>
              <YearMonthSelect
                yearValue={formData.lebensweise?.alkohol?.seitWann || ""}
                onYearChange={(value) => updateNestedField("alkohol", "seitWann", value)}
                showMonth={false}
              />
            </div>

            <div className="space-y-3">
              <Label>{language === "de" ? "Art des Alkohols & Menge pro Woche" : "Type of alcohol & amount per week"}</Label>
              <div className="grid gap-3 md:grid-cols-2">
                {alcoholTypes.map((alcohol) => (
                  <div key={alcohol.value} className="flex items-start space-x-2 p-3 bg-muted/30 rounded-lg">
                    <Checkbox
                      id={`alkohol-${alcohol.value}`}
                      checked={isAlkoholTypSelected(alcohol.value)}
                      onCheckedChange={(checked) => updateAlkoholTyp(alcohol.value, !!checked)}
                    />
                    <div className="flex-1 space-y-2">
                      <Label htmlFor={`alkohol-${alcohol.value}`} className="font-normal cursor-pointer">
                        {language === "de" ? alcohol.labelDe : alcohol.labelEn}
                        <span className="text-xs text-muted-foreground ml-1">({alcohol.glassSize}/Glas)</span>
                      </Label>
                      {isAlkoholTypSelected(alcohol.value) && (
                        <Select
                          value={getAlkoholMenge(alcohol.value)}
                          onValueChange={(value) => updateAlkoholMenge(alcohol.value, value)}
                        >
                          <SelectTrigger className="w-full h-8 text-sm">
                            <SelectValue placeholder={language === "de" ? "Gläser/Woche" : "Glasses/week"} />
                          </SelectTrigger>
                          <SelectContent>
                            {["1-2", "3-5", "6-10", "11-20", ">20"].map((amount) => (
                              <SelectItem key={amount} value={amount}>
                                {amount} {language === "de" ? "Gläser/Woche" : "glasses/week"}
                              </SelectItem>
                            ))}
                          </SelectContent>
                        </Select>
                      )}
                    </div>
                  </div>
                ))}
              </div>
            </div>
          </div>
        )}
      </div>

      <Separator />

      {/* Bewegung & Sport */}
      <div className="space-y-4">
        <h3 className="text-lg font-medium flex items-center gap-2">
          <Dumbbell className="w-5 h-5 text-muted-foreground" />
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
            <div className="space-y-4 pl-6">
              <div className="space-y-2">
                <Label>{language === "de" ? "Wie oft pro Woche?" : "How often per week?"}</Label>
                <Select
                  value={formData.lebensweise?.sport?.proWoche || ""}
                  onValueChange={(value) => updateNestedField("sport", "proWoche", value)}
                >
                  <SelectTrigger className="w-32">
                    <SelectValue placeholder={language === "de" ? "Auswählen" : "Select"} />
                  </SelectTrigger>
                  <SelectContent>
                    {["1x", "2x", "3x", "4x", "5x", "6x", "7x", ">7x"].map((freq) => (
                      <SelectItem key={freq} value={freq}>{freq}</SelectItem>
                    ))}
                  </SelectContent>
                </Select>
              </div>
              <div className="space-y-2">
                <Label>{language === "de" ? "Welche Sportarten?" : "Which sports?"}</Label>
                <MultiSelectCheckbox
                  options={sportsTypes}
                  selectedValues={formData.lebensweise?.sport?.arten || []}
                  onChange={(values) => updateNestedField("sport", "arten", values)}
                  allowOther={true}
                  otherValue={formData.lebensweise?.sport?.sonstige || ""}
                  onOtherChange={(value) => updateNestedField("sport", "sonstige", value)}
                  otherPlaceholderDe="Andere Sportarten..."
                  otherPlaceholderEn="Other sports..."
                  columns={3}
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
                <Select
                  value={formData.lebensweise?.spaziergang?.proWoche || ""}
                  onValueChange={(value) => updateNestedField("spaziergang", "proWoche", value)}
                >
                  <SelectTrigger className="w-32">
                    <SelectValue placeholder={language === "de" ? "Auswählen" : "Select"} />
                  </SelectTrigger>
                  <SelectContent>
                    {["1x", "2x", "3x", "4x", "5x", "6x", "7x", "täglich"].map((freq) => (
                      <SelectItem key={freq} value={freq}>{freq}</SelectItem>
                    ))}
                  </SelectContent>
                </Select>
              </div>
              <div className="space-y-2">
                <Label>{language === "de" ? "Dauer in Minuten" : "Duration in minutes"}</Label>
                <Select
                  value={formData.lebensweise?.spaziergang?.dauerMinuten || ""}
                  onValueChange={(value) => updateNestedField("spaziergang", "dauerMinuten", value)}
                >
                  <SelectTrigger className="w-32">
                    <SelectValue placeholder={language === "de" ? "Auswählen" : "Select"} />
                  </SelectTrigger>
                  <SelectContent>
                    {["15", "30", "45", "60", "90", "120", ">120"].map((min) => (
                      <SelectItem key={min} value={min}>{min} min</SelectItem>
                    ))}
                  </SelectContent>
                </Select>
              </div>
            </div>
          )}
        </div>

        <div className="space-y-2">
          <Label>{language === "de" ? "Geschätzte tägliche Gehstrecke" : "Estimated daily walking distance"}</Label>
          <Select
            value={formData.lebensweise?.meterZuFuss || ""}
            onValueChange={(value) => updateLebensweise("meterZuFuss", value)}
          >
            <SelectTrigger className="w-64">
              <SelectValue placeholder={language === "de" ? "Bitte auswählen" : "Please select"} />
            </SelectTrigger>
            <SelectContent>
              {walkingDistanceOptions.map((option) => (
                <SelectItem key={option.value} value={option.value}>
                  {language === "de" ? option.labelDe : option.labelEn}
                </SelectItem>
              ))}
            </SelectContent>
          </Select>
        </div>
      </div>

      <Separator />

      {/* Schlaf */}
      <div className="space-y-4">
        <h3 className="text-lg font-medium flex items-center gap-2">
          <Moon className="w-5 h-5 text-muted-foreground" />
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
            <Label>{language === "de" ? "Durchschnittliche Schlafdauer" : "Average sleep duration"}</Label>
            <Select
              value={formData.lebensweise?.schlafDauer || ""}
              onValueChange={(value) => updateLebensweise("schlafDauer", value)}
            >
              <SelectTrigger className="w-48">
                <SelectValue placeholder={language === "de" ? "Bitte auswählen" : "Please select"} />
              </SelectTrigger>
              <SelectContent>
                {sleepDurationOptions.map((option) => (
                  <SelectItem key={option.value} value={option.value}>
                    {language === "de" ? option.labelDe : option.labelEn}
                  </SelectItem>
                ))}
              </SelectContent>
            </Select>
          </div>
        </div>
      </div>

      <Separator />

      {/* Stress */}
      <div className="space-y-4">
        <h3 className="text-lg font-medium flex items-center gap-2">
          <Activity className="w-5 h-5 text-muted-foreground" />
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
        <h3 className="text-lg font-medium flex items-center gap-2">
          <Utensils className="w-5 h-5 text-muted-foreground" />
          {language === "de" ? "Ernährung" : "Nutrition"}
        </h3>

        <div className="space-y-2">
          <Label>{language === "de" ? "Ernährungsgewohnheiten" : "Eating habits"}</Label>
          <MultiSelectCheckbox
            options={eatingHabitsOptions}
            selectedValues={formData.lebensweise?.ernaehrungsTypen || []}
            onChange={(values) => updateLebensweise("ernaehrungsTypen", values)}
            allowOther={true}
            otherValue={formData.lebensweise?.ernaehrungSonstiges || ""}
            onOtherChange={(value) => updateLebensweise("ernaehrungSonstiges", value)}
            otherPlaceholderDe="Weitere Ernährungsgewohnheiten..."
            otherPlaceholderEn="Other eating habits..."
            columns={3}
          />
        </div>

        <div className="space-y-2">
          <Label htmlFor="ernaehrungsDetails">
            {language === "de" ? "Zusätzliche Anmerkungen zur Ernährung" : "Additional nutrition notes"}
          </Label>
          <Textarea
            id="ernaehrungsDetails"
            value={formData.lebensweise?.ernaehrungsgewohnheiten || ""}
            onChange={(e) => updateLebensweise("ernaehrungsgewohnheiten", e.target.value)}
            placeholder={language === "de" 
              ? "z.B. bestimmte Essenszeiten, Mahlzeitenanzahl, Besonderheiten..."
              : "e.g. specific meal times, number of meals, special considerations..."}
            rows={2}
          />
        </div>
      </div>
    </div>
  );
};

export default LifestyleSection;
