import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { Textarea } from "@/components/ui/textarea";
import { RadioGroup, RadioGroupItem } from "@/components/ui/radio-group";
import { Checkbox } from "@/components/ui/checkbox";
import { useLanguage } from "@/contexts/LanguageContext";
import { AnamneseFormData } from "@/lib/anamneseFormData";
import { Separator } from "@/components/ui/separator";

interface WomenHealthSectionProps {
  formData: AnamneseFormData;
  updateFormData: (field: string, value: any) => void;
}

const WomenHealthSection = ({ formData, updateFormData }: WomenHealthSectionProps) => {
  const { language } = useLanguage();

  const updateFrauengesundheit = (field: string, value: any) => {
    updateFormData("frauengesundheit", {
      ...formData.frauengesundheit,
      [field]: value
    });
  };

  const updateNestedField = (parentField: string, field: string, value: any) => {
    updateFormData("frauengesundheit", {
      ...formData.frauengesundheit,
      [parentField]: {
        ...(formData.frauengesundheit[parentField as keyof typeof formData.frauengesundheit] as object),
        [field]: value
      }
    });
  };

  return (
    <div className="space-y-8">
      <p className="text-sm text-muted-foreground italic">
        {language === "de" 
          ? "Dieser Abschnitt ist nur für Patientinnen relevant. Männliche Patienten können diesen Bereich überspringen."
          : "This section is only relevant for female patients. Male patients may skip this section."}
      </p>

      {/* Geburtsgewicht & Frühgeburt */}
      <div className="space-y-4">
        <h3 className="text-lg font-medium">
          {language === "de" ? "Geburt" : "Birth"}
        </h3>
        
        <div className="grid gap-4 md:grid-cols-2">
          <div className="space-y-2">
            <Label htmlFor="geburtsgewicht">
              {language === "de" ? "Eigenes Geburtsgewicht (falls bekannt)" : "Own birth weight (if known)"}
            </Label>
            <Input
              id="geburtsgewicht"
              value={formData.frauengesundheit?.geburtsgewicht || ""}
              onChange={(e) => updateFrauengesundheit("geburtsgewicht", e.target.value)}
              placeholder={language === "de" ? "z.B. 3200g" : "e.g. 3200g"}
            />
          </div>

          <div className="space-y-2">
            <div className="flex items-center space-x-2">
              <Checkbox
                id="fruehgeburt"
                checked={formData.frauengesundheit?.fruehgeburt?.ja || false}
                onCheckedChange={(checked) => updateNestedField("fruehgeburt", "ja", checked)}
              />
              <Label htmlFor="fruehgeburt">
                {language === "de" ? "Frühgeburt" : "Premature birth"}
              </Label>
            </div>
            {formData.frauengesundheit?.fruehgeburt?.ja && (
              <Input
                placeholder={language === "de" ? "Welche Woche?" : "Which week?"}
                value={formData.frauengesundheit?.fruehgeburt?.woche || ""}
                onChange={(e) => updateNestedField("fruehgeburt", "woche", e.target.value)}
              />
            )}
          </div>
        </div>
      </div>

      <Separator />

      {/* Gynäkologische Erkrankungen */}
      <div className="space-y-4">
        <h3 className="text-lg font-medium">
          {language === "de" ? "Gynäkologische Erkrankungen" : "Gynecological Conditions"}
        </h3>

        <div className="space-y-4">
          <div className="flex items-center space-x-2">
            <Checkbox
              id="gebaermuttererkrankung"
              checked={formData.frauengesundheit?.gebaermuttererkrankung?.ja || false}
              onCheckedChange={(checked) => updateNestedField("gebaermuttererkrankung", "ja", checked)}
            />
            <Label htmlFor="gebaermuttererkrankung">
              {language === "de" ? "Gebärmuttererkrankung" : "Uterine condition"}
            </Label>
          </div>
          {formData.frauengesundheit?.gebaermuttererkrankung?.ja && (
            <Input
              placeholder={language === "de" ? "Welche Erkrankung?" : "Which condition?"}
              value={formData.frauengesundheit?.gebaermuttererkrankung?.welche || ""}
              onChange={(e) => updateNestedField("gebaermuttererkrankung", "welche", e.target.value)}
            />
          )}
        </div>
      </div>

      <Separator />

      {/* Hormone & Verhütung */}
      <div className="space-y-4">
        <h3 className="text-lg font-medium">
          {language === "de" ? "Hormone & Verhütung" : "Hormones & Contraception"}
        </h3>

        <div className="grid gap-4 md:grid-cols-2">
          <div className="space-y-2">
            <div className="flex items-center space-x-2">
              <Checkbox
                id="pille"
                checked={formData.frauengesundheit?.pille?.ja || false}
                onCheckedChange={(checked) => updateNestedField("pille", "ja", checked)}
              />
              <Label htmlFor="pille">
                {language === "de" ? "Pille eingenommen" : "Took contraceptive pill"}
              </Label>
            </div>
            {formData.frauengesundheit?.pille?.ja && (
              <div className="grid gap-2 grid-cols-2 pl-6">
                <Input
                  placeholder={language === "de" ? "Von (Jahr)" : "From (year)"}
                  value={formData.frauengesundheit?.pille?.von || ""}
                  onChange={(e) => updateNestedField("pille", "von", e.target.value)}
                />
                <Input
                  placeholder={language === "de" ? "Bis (Jahr)" : "To (year)"}
                  value={formData.frauengesundheit?.pille?.bis || ""}
                  onChange={(e) => updateNestedField("pille", "bis", e.target.value)}
                />
              </div>
            )}
          </div>

          <div className="space-y-2">
            <div className="flex items-center space-x-2">
              <Checkbox
                id="hormonbehandlung"
                checked={formData.frauengesundheit?.hormonbehandlung?.ja || false}
                onCheckedChange={(checked) => updateNestedField("hormonbehandlung", "ja", checked)}
              />
              <Label htmlFor="hormonbehandlung">
                {language === "de" ? "Hormonbehandlung" : "Hormone treatment"}
              </Label>
            </div>
            {formData.frauengesundheit?.hormonbehandlung?.ja && (
              <Input
                className="pl-6"
                placeholder={language === "de" ? "Welche Behandlung?" : "Which treatment?"}
                value={formData.frauengesundheit?.hormonbehandlung?.welche || ""}
                onChange={(e) => updateNestedField("hormonbehandlung", "welche", e.target.value)}
              />
            )}
          </div>
        </div>
      </div>

      <Separator />

      {/* Menstruation */}
      <div className="space-y-4">
        <h3 className="text-lg font-medium">
          {language === "de" ? "Menstruation" : "Menstruation"}
        </h3>

        <div className="space-y-4">
          <div className="flex items-center space-x-2">
            <Checkbox
              id="periodeNormal"
              checked={formData.frauengesundheit?.periodeNormal?.ja || false}
              onCheckedChange={(checked) => updateNestedField("periodeNormal", "ja", checked)}
            />
            <Label htmlFor="periodeNormal">
              {language === "de" ? "Normale/regelmäßige Periode" : "Normal/regular period"}
            </Label>
          </div>
          {formData.frauengesundheit?.periodeNormal?.ja && (
            <Input
              className="max-w-xs"
              placeholder={language === "de" ? "Zykluslänge in Tagen" : "Cycle length in days"}
              value={formData.frauengesundheit?.periodeNormal?.zyklusTage || ""}
              onChange={(e) => updateNestedField("periodeNormal", "zyklusTage", e.target.value)}
            />
          )}

          <div className="flex flex-wrap gap-4">
            <div className="flex items-center space-x-2">
              <Checkbox
                id="periodeSchwach"
                checked={formData.frauengesundheit?.periodeSchwach?.ja || false}
                onCheckedChange={(checked) => updateNestedField("periodeSchwach", "ja", checked)}
              />
              <Label htmlFor="periodeSchwach" className="font-normal">
                {language === "de" ? "Schwache Periode" : "Light period"}
              </Label>
            </div>

            <div className="flex items-center space-x-2">
              <Checkbox
                id="periodeStark"
                checked={formData.frauengesundheit?.periodeStark || false}
                onCheckedChange={(checked) => updateFrauengesundheit("periodeStark", checked)}
              />
              <Label htmlFor="periodeStark" className="font-normal">
                {language === "de" ? "Starke Periode" : "Heavy period"}
              </Label>
            </div>

            <div className="flex items-center space-x-2">
              <Checkbox
                id="periodeUnregelmaessig"
                checked={formData.frauengesundheit?.periodeUnregelmaessig?.ja || false}
                onCheckedChange={(checked) => updateNestedField("periodeUnregelmaessig", "ja", checked)}
              />
              <Label htmlFor="periodeUnregelmaessig" className="font-normal">
                {language === "de" ? "Unregelmäßige Periode" : "Irregular period"}
              </Label>
            </div>
          </div>

          {/* Periodenbeschwerden */}
          <div className="space-y-2">
            <div className="flex items-center space-x-2">
              <Checkbox
                id="periodenbeschwerden"
                checked={formData.frauengesundheit?.periodenbeschwerden?.ja || false}
                onCheckedChange={(checked) => updateNestedField("periodenbeschwerden", "ja", checked)}
              />
              <Label htmlFor="periodenbeschwerden">
                {language === "de" ? "Periodenbeschwerden" : "Menstrual complaints"}
              </Label>
            </div>
            {formData.frauengesundheit?.periodenbeschwerden?.ja && (
              <div className="flex flex-wrap gap-4 pl-6">
                {[
                  { field: "schmerz", labelDe: "Schmerzen", labelEn: "Pain" },
                  { field: "uebelkeit", labelDe: "Übelkeit", labelEn: "Nausea" },
                  { field: "kopf", labelDe: "Kopfschmerzen", labelEn: "Headache" },
                  { field: "sonstige", labelDe: "Sonstige", labelEn: "Other" },
                ].map((option) => (
                  <div key={option.field} className="flex items-center space-x-2">
                    <Checkbox
                      id={`periodenbeschwerden-${option.field}`}
                      checked={formData.frauengesundheit?.periodenbeschwerden?.[option.field as keyof typeof formData.frauengesundheit.periodenbeschwerden] || false}
                      onCheckedChange={(checked) => updateNestedField("periodenbeschwerden", option.field, checked)}
                    />
                    <Label htmlFor={`periodenbeschwerden-${option.field}`} className="font-normal text-sm">
                      {language === "de" ? option.labelDe : option.labelEn}
                    </Label>
                  </div>
                ))}
              </div>
            )}
          </div>
        </div>
      </div>

      <Separator />

      {/* Menopause */}
      <div className="space-y-4">
        <div className="flex items-center space-x-2">
          <Checkbox
            id="menopause"
            checked={formData.frauengesundheit?.menopause?.ja || false}
            onCheckedChange={(checked) => updateNestedField("menopause", "ja", checked)}
          />
          <Label htmlFor="menopause" className="text-lg font-medium">
            {language === "de" ? "Menopause / Wechseljahre" : "Menopause"}
          </Label>
        </div>
        {formData.frauengesundheit?.menopause?.ja && (
          <div className="grid gap-4 md:grid-cols-2 pl-6">
            <Input
              placeholder={language === "de" ? "Beginn (Jahr/Alter)" : "Onset (year/age)"}
              value={formData.frauengesundheit?.menopause?.beginn || ""}
              onChange={(e) => updateNestedField("menopause", "beginn", e.target.value)}
            />
            <Input
              placeholder={language === "de" ? "Symptome (z.B. Hitzewallungen)" : "Symptoms (e.g. hot flashes)"}
              value={formData.frauengesundheit?.menopause?.symptome || ""}
              onChange={(e) => updateNestedField("menopause", "symptome", e.target.value)}
            />
          </div>
        )}
      </div>

      <Separator />

      {/* Schwangerschaften & Geburten */}
      <div className="space-y-4">
        <h3 className="text-lg font-medium">
          {language === "de" ? "Schwangerschaften & Geburten" : "Pregnancies & Births"}
        </h3>

        <div className="grid gap-4 md:grid-cols-2">
          <div className="space-y-2">
            <Label>{language === "de" ? "Anzahl Schwangerschaften" : "Number of pregnancies"}</Label>
            <Input
              value={formData.frauengesundheit?.schwangerschaften?.anzahl || ""}
              onChange={(e) => updateNestedField("schwangerschaften", "anzahl", e.target.value)}
              placeholder="0"
            />
          </div>
          <div className="space-y-2">
            <Label>{language === "de" ? "Letzte Schwangerschaft (Jahr)" : "Last pregnancy (year)"}</Label>
            <Input
              value={formData.frauengesundheit?.schwangerschaften?.letzte || ""}
              onChange={(e) => updateNestedField("schwangerschaften", "letzte", e.target.value)}
            />
          </div>
        </div>

        <div className="grid gap-4 md:grid-cols-2">
          <div className="space-y-2">
            <Label>{language === "de" ? "Anzahl Fehlgeburten" : "Number of miscarriages"}</Label>
            <Input
              value={formData.frauengesundheit?.fehlgeburten?.anzahl || ""}
              onChange={(e) => updateNestedField("fehlgeburten", "anzahl", e.target.value)}
              placeholder="0"
            />
          </div>
          <div className="space-y-2">
            <Label>{language === "de" ? "Wann (Jahr)" : "When (year)"}</Label>
            <Input
              value={formData.frauengesundheit?.fehlgeburten?.wann || ""}
              onChange={(e) => updateNestedField("fehlgeburten", "wann", e.target.value)}
            />
          </div>
        </div>

        <div className="grid gap-4 md:grid-cols-2">
          <div className="space-y-2">
            <Label>{language === "de" ? "Anzahl Geburten" : "Number of births"}</Label>
            <Input
              value={formData.frauengesundheit?.geburten?.anzahl || ""}
              onChange={(e) => updateNestedField("geburten", "anzahl", e.target.value)}
              placeholder="0"
            />
          </div>
          <div className="flex flex-wrap gap-4 items-end">
            <div className="flex items-center space-x-2">
              <Checkbox
                id="vaginal"
                checked={formData.frauengesundheit?.geburten?.vaginal || false}
                onCheckedChange={(checked) => updateNestedField("geburten", "vaginal", checked)}
              />
              <Label htmlFor="vaginal" className="font-normal">
                {language === "de" ? "Vaginal" : "Vaginal"}
              </Label>
            </div>
            <div className="flex items-center space-x-2">
              <Checkbox
                id="kaiserschnitt"
                checked={formData.frauengesundheit?.geburten?.kaiserschnitt || false}
                onCheckedChange={(checked) => updateNestedField("geburten", "kaiserschnitt", checked)}
              />
              <Label htmlFor="kaiserschnitt" className="font-normal">
                {language === "de" ? "Kaiserschnitt" : "C-section"}
              </Label>
            </div>
          </div>
        </div>

        {/* Wochenbettdepression */}
        <div className="space-y-2">
          <div className="flex items-center space-x-2">
            <Checkbox
              id="wochenbettdepression"
              checked={formData.frauengesundheit?.wochenbettdepression?.ja || false}
              onCheckedChange={(checked) => updateNestedField("wochenbettdepression", "ja", checked)}
            />
            <Label htmlFor="wochenbettdepression">
              {language === "de" ? "Wochenbettdepression" : "Postpartum depression"}
            </Label>
          </div>
          {formData.frauengesundheit?.wochenbettdepression?.ja && (
            <Input
              className="max-w-xs"
              placeholder={language === "de" ? "Nach welcher Geburt?" : "After which birth?"}
              value={formData.frauengesundheit?.wochenbettdepression?.nachGeburt || ""}
              onChange={(e) => updateNestedField("wochenbettdepression", "nachGeburt", e.target.value)}
            />
          )}
        </div>
      </div>
    </div>
  );
};

export default WomenHealthSection;
