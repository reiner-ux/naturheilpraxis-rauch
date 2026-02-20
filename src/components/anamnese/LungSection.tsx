import { Checkbox } from "@/components/ui/checkbox";
import { Label } from "@/components/ui/label";
import { Textarea } from "@/components/ui/textarea";
import { useLanguage } from "@/contexts/LanguageContext";
import { AnamneseFormData } from "@/lib/anamneseFormData";
import TemporalStatusSelect from "./shared/TemporalStatusSelect";

interface LungSectionProps {
  formData: AnamneseFormData;
  updateFormData: (field: string, value: any) => void;
}

const LungSection = ({ formData, updateFormData }: LungSectionProps) => {
  const { language } = useLanguage();
  const birthYear = formData.geburtsdatum ? new Date(formData.geburtsdatum).getFullYear() : undefined;
  const lungeData = (formData.lungeAtmung || {}) as any;

  const parseYearMonth = (raw: string) => {
    if (!raw) return { year: "", month: "" };
    const m = raw.match(/^(\d{4})(?:-(\d{2}))?$/);
    if (!m) return { year: "", month: "" };
    return { year: m[1] ?? "", month: m[2] ?? "" };
  };

  const updateField = (field: string, subfield: string, value: any) => {
    const fieldData = lungeData[field] || {};
    updateFormData("lungeAtmung", {
      ...lungeData,
      [field]: { ...fieldData, [subfield]: value }
    });
  };

  const setYearMonth = (field: string, timeKey: string, next: { year?: string; month?: string }) => {
    const fieldData = lungeData[field] || {};
    const current = parseYearMonth(String(fieldData[timeKey] ?? ""));
    const year = (next.year ?? current.year).slice(0, 4);
    const month = (next.month ?? current.month).slice(0, 2);
    const combined = month ? `${year}-${month}` : year;
    updateField(field, timeKey, combined);
  };

  const conditions = [
    { key: "asthma", labelDe: "Asthma bronchiale", labelEn: "Bronchial Asthma" },
    { key: "lungenentzuendung", labelDe: "Lungenentzündung", labelEn: "Pneumonia" },
    { key: "bronchitis", labelDe: "Chronische Bronchitis", labelEn: "Chronic Bronchitis" },
    { key: "copd", labelDe: "COPD", labelEn: "COPD" },
    { key: "lungenemphysem", labelDe: "Lungenemphysem", labelEn: "Pulmonary Emphysema" },
    { key: "lungenembolie", labelDe: "Lungenembolie", labelEn: "Pulmonary Embolism" },
    { key: "tuberkulose", labelDe: "Tuberkulose", labelEn: "Tuberculosis" },
    { key: "sarkoidose", labelDe: "Sarkoidose", labelEn: "Sarcoidosis" },
    { key: "lungenfibrose", labelDe: "Lungenfibrose", labelEn: "Pulmonary Fibrosis" },
    { key: "pleuritis", labelDe: "Rippenfellentzündung (Pleuritis)", labelEn: "Pleurisy" },
    { key: "pneumothorax", labelDe: "Pneumothorax", labelEn: "Pneumothorax" },
    { key: "schlafapnoe", labelDe: "Schlafapnoe", labelEn: "Sleep Apnea" },
    { key: "husten", labelDe: "Chronischer Husten", labelEn: "Chronic Cough" },
    { key: "atemnot", labelDe: "Atemnot (Dyspnoe)", labelEn: "Shortness of Breath" },
  ];

  return (
    <div className="space-y-6">
      <p className="text-muted-foreground">
        {language === "de"
          ? "Bitte geben Sie an, ob Sie eine der folgenden Lungenerkrankungen haben oder hatten:"
          : "Please indicate if you have or had any of the following lung conditions:"}
      </p>

      <div className="grid gap-4">
        {conditions.map((item) => {
          const fieldData = lungeData?.[item.key] || {};
          const isChecked = Boolean(fieldData?.ja);
          const timeKey = fieldData?.seit !== undefined ? "seit" : "jahr";
          const seitParsed = parseYearMonth(String(fieldData?.[timeKey] || ""));
          const bisParsed = parseYearMonth(String(fieldData?.bisJahr || ""));

          return (
            <div key={item.key} className="border rounded-lg p-4">
              <div className="flex items-start gap-3">
                <Checkbox
                  checked={isChecked}
                  onCheckedChange={(checked) => updateField(item.key, "ja", !!checked)}
                />
                <div className="space-y-2 flex-1">
                  <Label>{language === "de" ? item.labelDe : item.labelEn}</Label>
                  {isChecked && (
                    <div className="mt-2">
                      <TemporalStatusSelect
                        prefix={`lunge-${item.key}`}
                        seitYear={seitParsed.year}
                        seitMonth={seitParsed.month}
                        status={fieldData?.status || ""}
                        bisYear={bisParsed.year}
                        bisMonth={bisParsed.month}
                        onSeitYearChange={(v) => setYearMonth(item.key, timeKey, { year: v })}
                        onSeitMonthChange={(v) => setYearMonth(item.key, timeKey, { month: v })}
                        onStatusChange={(v) => updateField(item.key, "status", v)}
                        onBisYearChange={(v) => setYearMonth(item.key, "bisJahr", { year: v })}
                        onBisMonthChange={(v) => setYearMonth(item.key, "bisJahr", { month: v })}
                        birthYear={birthYear}
                      />
                    </div>
                  )}
                </div>
              </div>
            </div>
          );
        })}
      </div>

      <div className="border rounded-lg p-4 bg-muted/30">
        <Label className="text-base font-medium">
          {language === "de" ? "Sonstige Lungenerkrankungen" : "Other lung conditions"}
        </Label>
        <Textarea
          placeholder={language === "de" ? "Bitte beschreiben Sie weitere Erkrankungen..." : "Please describe other conditions..."}
          value={lungeData?.sonstige || ""}
          onChange={(e) => updateFormData("lungeAtmung", { ...lungeData, sonstige: e.target.value })}
          className="mt-2"
          rows={2}
        />
      </div>
    </div>
  );
};

export default LungSection;
