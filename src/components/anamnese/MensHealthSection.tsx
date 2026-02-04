import { Checkbox } from "@/components/ui/checkbox";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { Textarea } from "@/components/ui/textarea";
import { useLanguage } from "@/contexts/LanguageContext";
import { AnamneseFormData } from "@/lib/anamneseFormData";
import { Separator } from "@/components/ui/separator";
import YearMonthSelect from "./shared/YearMonthSelect";

interface MensHealthSectionProps {
  formData: AnamneseFormData;
  updateFormData: (field: string, value: any) => void;
}

const MensHealthSection = ({ formData, updateFormData }: MensHealthSectionProps) => {
  const { language } = useLanguage();

  const birthYear = formData.geburtsdatum
    ? new Date(formData.geburtsdatum).getFullYear()
    : undefined;

  const updateMaennergesundheit = (field: string, value: any) => {
    updateFormData("maennergesundheit", {
      ...formData.maennergesundheit,
      [field]: value
    });
  };

  const updateNestedField = (parentField: string, field: string, value: any) => {
    updateFormData("maennergesundheit", {
      ...formData.maennergesundheit,
      [parentField]: {
        ...(formData.maennergesundheit[parentField as keyof typeof formData.maennergesundheit] as object),
        [field]: value
      }
    });
  };

  const getNestedBoolean = (parentField: string, key: string): boolean => {
    const parent = formData.maennergesundheit?.[parentField as keyof typeof formData.maennergesundheit] as any;
    const value = parent?.[key];
    return typeof value === 'boolean' ? value : false;
  };

  return (
    <div className="space-y-8">
      <p className="text-sm text-muted-foreground italic">
        {language === "de" 
          ? "Dieser Abschnitt ist nur für männliche Patienten relevant. Patientinnen können diesen Bereich überspringen."
          : "This section is only relevant for male patients. Female patients may skip this section."}
      </p>

      {/* Prostata */}
      <div className="border rounded-lg p-4">
        <div className="flex items-start gap-3">
          <Checkbox
            id="prostata-ja"
            checked={formData.maennergesundheit?.prostata?.ja || false}
            onCheckedChange={(checked) => updateNestedField("prostata", "ja", checked)}
          />
          <div className="space-y-2 flex-1">
            <Label htmlFor="prostata-ja" className="text-lg font-medium cursor-pointer">
              {language === "de" ? "🔵 Prostataerkrankungen" : "🔵 Prostate Diseases"}
            </Label>
            {formData.maennergesundheit?.prostata?.ja && (
              <div className="space-y-4 mt-4 pl-2 border-l-2 border-primary/20">
                <YearMonthSelect
                  yearValue={formData.maennergesundheit?.prostata?.jahr || ""}
                  onYearChange={(value) => updateNestedField("prostata", "jahr", value)}
                  showMonth={false}
                  birthYear={birthYear}
                />
                <div className="flex flex-wrap gap-4">
                  {[
                    { key: "bph", labelDe: "Gutartige Vergrößerung (BPH)", labelEn: "Benign Prostatic Hyperplasia (BPH)" },
                    { key: "prostatitis", labelDe: "Prostatitis (Entzündung)", labelEn: "Prostatitis (Inflammation)" },
                    { key: "prostatakarzinom", labelDe: "Prostatakarzinom", labelEn: "Prostate Cancer" },
                  ].map((option) => (
                    <div key={option.key} className="flex items-center gap-2">
                      <Checkbox
                        checked={getNestedBoolean("prostata", option.key)}
                        onCheckedChange={(checked) => updateNestedField("prostata", option.key, !!checked)}
                      />
                      <Label className="font-normal text-sm">{language === "de" ? option.labelDe : option.labelEn}</Label>
                    </div>
                  ))}
                </div>
                <div className="space-y-2">
                  <Label className="text-sm">{language === "de" ? "PSA-Wert (falls bekannt)" : "PSA value (if known)"}</Label>
                  <Input
                    placeholder={language === "de" ? "z.B. 2.5 ng/ml" : "e.g. 2.5 ng/ml"}
                    value={formData.maennergesundheit?.prostata?.psa || ""}
                    onChange={(e) => updateNestedField("prostata", "psa", e.target.value)}
                    className="w-48"
                  />
                </div>
                <Input
                  placeholder={language === "de" ? "Sonstiges (bitte beschreiben)" : "Other (please describe)"}
                  value={formData.maennergesundheit?.prostata?.sonstige || ""}
                  onChange={(e) => updateNestedField("prostata", "sonstige", e.target.value)}
                />
              </div>
            )}
          </div>
        </div>
      </div>

      <Separator />

      {/* Hoden */}
      <div className="border rounded-lg p-4">
        <div className="flex items-start gap-3">
          <Checkbox
            id="hoden-ja"
            checked={formData.maennergesundheit?.hoden?.ja || false}
            onCheckedChange={(checked) => updateNestedField("hoden", "ja", checked)}
          />
          <div className="space-y-2 flex-1">
            <Label htmlFor="hoden-ja" className="text-lg font-medium cursor-pointer">
              {language === "de" ? "🔴 Hodenerkrankungen" : "🔴 Testicular Diseases"}
            </Label>
            {formData.maennergesundheit?.hoden?.ja && (
              <div className="space-y-4 mt-4 pl-2 border-l-2 border-primary/20">
                <YearMonthSelect
                  yearValue={formData.maennergesundheit?.hoden?.jahr || ""}
                  onYearChange={(value) => updateNestedField("hoden", "jahr", value)}
                  showMonth={false}
                  birthYear={birthYear}
                />
                <div className="flex flex-wrap gap-4">
                  {[
                    { key: "hodenentzuendung", labelDe: "Hodenentzündung (Orchitis)", labelEn: "Orchitis" },
                    { key: "hodentorsion", labelDe: "Hodentorsion", labelEn: "Testicular Torsion" },
                    { key: "hodenkrebs", labelDe: "Hodenkrebs", labelEn: "Testicular Cancer" },
                    { key: "varikozele", labelDe: "Varikozele (Krampfadern)", labelEn: "Varicocele" },
                    { key: "hydrozele", labelDe: "Hydrozele (Wasserbruch)", labelEn: "Hydrocele" },
                  ].map((option) => (
                    <div key={option.key} className="flex items-center gap-2">
                      <Checkbox
                        checked={getNestedBoolean("hoden", option.key)}
                        onCheckedChange={(checked) => updateNestedField("hoden", option.key, !!checked)}
                      />
                      <Label className="font-normal text-sm">{language === "de" ? option.labelDe : option.labelEn}</Label>
                    </div>
                  ))}
                </div>
                <Input
                  placeholder={language === "de" ? "Sonstiges (bitte beschreiben)" : "Other (please describe)"}
                  value={formData.maennergesundheit?.hoden?.sonstige || ""}
                  onChange={(e) => updateNestedField("hoden", "sonstige", e.target.value)}
                />
              </div>
            )}
          </div>
        </div>
      </div>

      <Separator />

      {/* Nebenhoden */}
      <div className="border rounded-lg p-4">
        <div className="flex items-start gap-3">
          <Checkbox
            id="nebenhoden-ja"
            checked={formData.maennergesundheit?.nebenhoden?.ja || false}
            onCheckedChange={(checked) => updateNestedField("nebenhoden", "ja", checked)}
          />
          <div className="space-y-2 flex-1">
            <Label htmlFor="nebenhoden-ja" className="text-lg font-medium cursor-pointer">
              {language === "de" ? "🟠 Nebenhodenerkrankungen" : "🟠 Epididymal Diseases"}
            </Label>
            {formData.maennergesundheit?.nebenhoden?.ja && (
              <div className="space-y-4 mt-4 pl-2 border-l-2 border-primary/20">
                <YearMonthSelect
                  yearValue={formData.maennergesundheit?.nebenhoden?.jahr || ""}
                  onYearChange={(value) => updateNestedField("nebenhoden", "jahr", value)}
                  showMonth={false}
                  birthYear={birthYear}
                />
                <div className="flex flex-wrap gap-4">
                  {[
                    { key: "epididymitis", labelDe: "Nebenhodenentzündung (Epididymitis)", labelEn: "Epididymitis" },
                    { key: "nebenhodenzyste", labelDe: "Nebenhodenzyste (Spermatozele)", labelEn: "Spermatocele" },
                  ].map((option) => (
                    <div key={option.key} className="flex items-center gap-2">
                      <Checkbox
                        checked={getNestedBoolean("nebenhoden", option.key)}
                        onCheckedChange={(checked) => updateNestedField("nebenhoden", option.key, !!checked)}
                      />
                      <Label className="font-normal text-sm">{language === "de" ? option.labelDe : option.labelEn}</Label>
                    </div>
                  ))}
                </div>
                <Input
                  placeholder={language === "de" ? "Sonstiges (bitte beschreiben)" : "Other (please describe)"}
                  value={formData.maennergesundheit?.nebenhoden?.sonstige || ""}
                  onChange={(e) => updateNestedField("nebenhoden", "sonstige", e.target.value)}
                />
              </div>
            )}
          </div>
        </div>
      </div>

      <Separator />

      {/* Erektionsstörung */}
      <div className="border rounded-lg p-4">
        <div className="flex items-start gap-3">
          <Checkbox
            id="erektionsstoerung-ja"
            checked={formData.maennergesundheit?.erektionsstoerung?.ja || false}
            onCheckedChange={(checked) => updateNestedField("erektionsstoerung", "ja", checked)}
          />
          <div className="space-y-2 flex-1">
            <Label htmlFor="erektionsstoerung-ja" className="text-lg font-medium cursor-pointer">
              {language === "de" ? "Erektionsstörung" : "Erectile Dysfunction"}
            </Label>
            {formData.maennergesundheit?.erektionsstoerung?.ja && (
              <div className="mt-4 pl-2 border-l-2 border-primary/20">
                <Label className="text-sm mb-2 block">{language === "de" ? "Seit wann?" : "Since when?"}</Label>
                <YearMonthSelect
                  yearValue={formData.maennergesundheit?.erektionsstoerung?.seit || ""}
                  onYearChange={(value) => updateNestedField("erektionsstoerung", "seit", value)}
                  showMonth={true}
                  birthYear={birthYear}
                />
              </div>
            )}
          </div>
        </div>
      </div>

      <Separator />

      {/* Sonstige Erkrankungen */}
      <div className="border rounded-lg p-4 bg-muted/30">
        <Label className="text-base font-medium">
          {language === "de" ? "Sonstige Erkrankungen der Männergesundheit" : "Other Men's Health Conditions"}
        </Label>
        <Textarea
          placeholder={language === "de" ? "Bitte beschreiben Sie weitere Erkrankungen, die hier nicht aufgeführt sind..." : "Please describe any other conditions not listed here..."}
          value={formData.maennergesundheit?.sonstige || ""}
          onChange={(e) => updateMaennergesundheit("sonstige", e.target.value)}
          className="mt-2"
          rows={2}
        />
      </div>
    </div>
  );
};

export default MensHealthSection;
