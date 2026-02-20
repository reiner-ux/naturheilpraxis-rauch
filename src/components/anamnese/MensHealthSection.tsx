import { Checkbox } from "@/components/ui/checkbox";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { Textarea } from "@/components/ui/textarea";
import { useLanguage } from "@/contexts/LanguageContext";
import { AnamneseFormData } from "@/lib/anamneseFormData";
import { Separator } from "@/components/ui/separator";
import TemporalStatusSelect from "./shared/TemporalStatusSelect";

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

  const parseYearMonth = (raw: string) => {
    if (!raw) return { year: "", month: "" };
    const m = raw.match(/^(\d{4})(?:-(\d{2}))?$/);
    if (!m) return { year: "", month: "" };
    return { year: m[1] ?? "", month: m[2] ?? "" };
  };

  const setYearMonth = (parentField: string, timeKey: string, next: { year?: string; month?: string }) => {
    const parent = formData.maennergesundheit?.[parentField as keyof typeof formData.maennergesundheit] as any || {};
    const currentRaw = String(parent?.[timeKey] || parent?.jahr || "");
    const current = parseYearMonth(currentRaw);
    const year = (next.year ?? current.year).slice(0, 4);
    const month = (next.month ?? current.month).slice(0, 2);
    const combined = month ? `${year}-${month}` : year;
    updateNestedField(parentField, timeKey, combined);
  };

  const renderConditionWithTemporal = (
    parentField: string,
    emoji: string,
    labelDe: string,
    labelEn: string,
    subOptions: { key: string; labelDe: string; labelEn: string }[],
    extraContent?: React.ReactNode
  ) => {
    const parent = formData.maennergesundheit?.[parentField as keyof typeof formData.maennergesundheit] as any || {};
    const seitParsed = parseYearMonth(parent?.seit || parent?.jahr || "");
    const bisParsed = parseYearMonth(parent?.bisJahr || "");

    return (
      <div className="border rounded-lg p-4">
        <div className="flex items-start gap-3">
          <Checkbox
            checked={parent?.ja || false}
            onCheckedChange={(checked) => updateNestedField(parentField, "ja", checked)}
          />
          <div className="space-y-2 flex-1">
            <Label className="text-lg font-medium cursor-pointer">
              {language === "de" ? `${emoji} ${labelDe}` : `${emoji} ${labelEn}`}
            </Label>
            {parent?.ja && (
              <div className="space-y-4 mt-4 pl-2 border-l-2 border-primary/20">
                <div className="flex flex-wrap gap-4">
                  {subOptions.map((option) => (
                    <div key={option.key} className="flex items-center gap-2">
                      <Checkbox
                        checked={getNestedBoolean(parentField, option.key)}
                        onCheckedChange={(checked) => updateNestedField(parentField, option.key, !!checked)}
                      />
                      <Label className="font-normal text-sm">{language === "de" ? option.labelDe : option.labelEn}</Label>
                    </div>
                  ))}
                </div>
                {extraContent}
                <TemporalStatusSelect
                  prefix={parentField}
                  seitYear={seitParsed.year}
                  seitMonth={seitParsed.month}
                  status={parent?.status || ""}
                  bisYear={bisParsed.year}
                  bisMonth={bisParsed.month}
                  onSeitYearChange={(v) => setYearMonth(parentField, "seit", { year: v })}
                  onSeitMonthChange={(v) => setYearMonth(parentField, "seit", { month: v })}
                  onStatusChange={(v) => updateNestedField(parentField, "status", v)}
                  onBisYearChange={(v) => setYearMonth(parentField, "bisJahr", { year: v })}
                  onBisMonthChange={(v) => setYearMonth(parentField, "bisJahr", { month: v })}
                  birthYear={birthYear}
                />
                <Input
                  placeholder={language === "de" ? "Sonstiges (bitte beschreiben)" : "Other (please describe)"}
                  value={parent?.sonstige || ""}
                  onChange={(e) => updateNestedField(parentField, "sonstige", e.target.value)}
                />
              </div>
            )}
          </div>
        </div>
      </div>
    );
  };

  return (
    <div className="space-y-8">
      <p className="text-sm text-muted-foreground italic">
        {language === "de" 
          ? "Dieser Abschnitt ist nur für männliche Patienten relevant. Patientinnen können diesen Bereich überspringen."
          : "This section is only relevant for male patients. Female patients may skip this section."}
      </p>

      {/* Prostata */}
      {renderConditionWithTemporal("prostata", "🔵", "Prostataerkrankungen", "Prostate Diseases", [
        { key: "bph", labelDe: "Gutartige Vergrößerung (BPH)", labelEn: "Benign Prostatic Hyperplasia (BPH)" },
        { key: "prostatitis", labelDe: "Prostatitis (Entzündung)", labelEn: "Prostatitis (Inflammation)" },
        { key: "prostatakarzinom", labelDe: "Prostatakarzinom", labelEn: "Prostate Cancer" },
      ], (
        <div className="space-y-2">
          <Label className="text-sm">{language === "de" ? "PSA-Wert (falls bekannt)" : "PSA value (if known)"}</Label>
          <Input
            placeholder={language === "de" ? "z.B. 2.5 ng/ml" : "e.g. 2.5 ng/ml"}
            value={formData.maennergesundheit?.prostata?.psa || ""}
            onChange={(e) => updateNestedField("prostata", "psa", e.target.value)}
            className="w-48"
          />
        </div>
      ))}

      <Separator />

      {/* Hoden */}
      {renderConditionWithTemporal("hoden", "🔴", "Hodenerkrankungen", "Testicular Diseases", [
        { key: "hodenentzuendung", labelDe: "Hodenentzündung (Orchitis)", labelEn: "Orchitis" },
        { key: "hodentorsion", labelDe: "Hodentorsion", labelEn: "Testicular Torsion" },
        { key: "hodenkrebs", labelDe: "Hodenkrebs", labelEn: "Testicular Cancer" },
        { key: "varikozele", labelDe: "Varikozele (Krampfadern)", labelEn: "Varicocele" },
        { key: "hydrozele", labelDe: "Hydrozele (Wasserbruch)", labelEn: "Hydrocele" },
      ])}

      <Separator />

      {/* Nebenhoden */}
      {renderConditionWithTemporal("nebenhoden", "🟠", "Nebenhodenerkrankungen", "Epididymal Diseases", [
        { key: "epididymitis", labelDe: "Nebenhodenentzündung (Epididymitis)", labelEn: "Epididymitis" },
        { key: "nebenhodenzyste", labelDe: "Nebenhodenzyste (Spermatozele)", labelEn: "Spermatocele" },
      ])}

      <Separator />

      {/* Erektionsstörung */}
      {(() => {
        const parent = formData.maennergesundheit?.erektionsstoerung as any || {};
        const seitParsed = parseYearMonth(parent?.seit || "");
        const bisParsed = parseYearMonth(parent?.bisJahr || "");
        return (
          <div className="border rounded-lg p-4">
            <div className="flex items-start gap-3">
              <Checkbox
                checked={parent?.ja || false}
                onCheckedChange={(checked) => updateNestedField("erektionsstoerung", "ja", checked)}
              />
              <div className="space-y-2 flex-1">
                <Label className="text-lg font-medium cursor-pointer">
                  {language === "de" ? "Erektionsstörung" : "Erectile Dysfunction"}
                </Label>
                {parent?.ja && (
                  <div className="mt-4 pl-2 border-l-2 border-primary/20">
                    <TemporalStatusSelect
                      prefix="erektionsstoerung"
                      seitYear={seitParsed.year}
                      seitMonth={seitParsed.month}
                      status={parent?.status || ""}
                      bisYear={bisParsed.year}
                      bisMonth={bisParsed.month}
                      onSeitYearChange={(v) => setYearMonth("erektionsstoerung", "seit", { year: v })}
                      onSeitMonthChange={(v) => setYearMonth("erektionsstoerung", "seit", { month: v })}
                      onStatusChange={(v) => updateNestedField("erektionsstoerung", "status", v)}
                      onBisYearChange={(v) => setYearMonth("erektionsstoerung", "bisJahr", { year: v })}
                      onBisMonthChange={(v) => setYearMonth("erektionsstoerung", "bisJahr", { month: v })}
                      birthYear={birthYear}
                    />
                  </div>
                )}
              </div>
            </div>
          </div>
        );
      })()}

      <Separator />

      {/* Sonstige */}
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
