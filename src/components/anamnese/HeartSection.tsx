import { Checkbox } from "@/components/ui/checkbox";
import { Label } from "@/components/ui/label";
import { Textarea } from "@/components/ui/textarea";
import { useLanguage } from "@/contexts/LanguageContext";
import { AnamneseFormData } from "@/lib/anamneseFormData";
import YearMonthSelect from "./shared/YearMonthSelect";

interface HeartSectionProps {
  formData: AnamneseFormData;
  updateFormData: (field: string, value: any) => void;
}

const HeartSection = ({ formData, updateFormData }: HeartSectionProps) => {
  const { language } = useLanguage();

  const birthYear = formData.geburtsdatum ? new Date(formData.geburtsdatum).getFullYear() : undefined;

  const parseYearMonth = (raw: string): { year: string; month: string } => {
    if (!raw) return { year: "", month: "" };
    const m = raw.match(/^(\d{4})(?:-(\d{2}))?$/);
    if (!m) return { year: "", month: "" };
    return { year: m[1] ?? "", month: m[2] ?? "" };
  };

  const updateNestedField = (section: string, field: string, subfield: string, value: any) => {
    const current = formData[section as keyof AnamneseFormData] as any;
    const currentField = current?.[field] || {};
    updateFormData(section, {
      ...current,
      [field]: { ...currentField, [subfield]: value }
    });
  };

  const updateSectionField = (section: string, field: string, value: any) => {
    const current = formData[section as keyof AnamneseFormData] as any;
    updateFormData(section, {
      ...current,
      [field]: value
    });
  };

  const setYearMonthCombined = (section: string, field: string, timeKey: string, next: { year?: string; month?: string }) => {
    const sectionData = (formData as any)?.[section] || {};
    const fieldData = sectionData?.[field] || {};
    const current = parseYearMonth(String(fieldData?.[timeKey] ?? ""));
    const year = (next.year ?? current.year).slice(0, 4);
    const month = (next.month ?? current.month).slice(0, 2);
    const combined = month ? `${year}-${month}` : year;
    updateNestedField(section, field, timeKey, combined);
  };

  const conditions = [
    { key: "blutdruckHoch", labelDe: "Bluthochdruck", labelEn: "High Blood Pressure" },
    { key: "blutdruckNiedrig", labelDe: "Niedriger Blutdruck", labelEn: "Low Blood Pressure" },
    { key: "herzrhythmusstörung", labelDe: "Herzrhythmusstörung", labelEn: "Heart Rhythm Disorder" },
    { key: "herzschmerzen", labelDe: "Herzschmerzen/Angina pectoris", labelEn: "Heart Pain/Angina" },
    { key: "herzinfarkt", labelDe: "Herzinfarkt", labelEn: "Heart Attack" },
    { key: "herzinsuffizienz", labelDe: "Herzinsuffizienz/Herzschwäche", labelEn: "Heart Failure" },
    { key: "herzschrittmacher", labelDe: "Herzschrittmacher", labelEn: "Pacemaker" },
    { key: "defibrillator", labelDe: "Implantierter Defibrillator (ICD)", labelEn: "Implanted Defibrillator (ICD)" },
    { key: "stent", labelDe: "Stent", labelEn: "Stent" },
    { key: "bypass", labelDe: "Bypass-Operation", labelEn: "Bypass Surgery" },
    { key: "herzklappenfehler", labelDe: "Herzklappenfehler", labelEn: "Heart Valve Defect" },
    { key: "herzklappenersatz", labelDe: "Herzklappenersatz", labelEn: "Heart Valve Replacement" },
    { key: "herzmuskelentzuendung", labelDe: "Herzmuskelentzündung (Myokarditis)", labelEn: "Myocarditis" },
    { key: "endokarditis", labelDe: "Herzinnenhautentzündung (Endokarditis)", labelEn: "Endocarditis" },
    { key: "krampfadern", labelDe: "Krampfadern", labelEn: "Varicose Veins" },
    { key: "thrombose", labelDe: "Thrombose", labelEn: "Thrombosis" },
    { key: "lungenembolie", labelDe: "Lungenembolie", labelEn: "Pulmonary Embolism" },
    { key: "oedeme", labelDe: "Geschwollene Beine/Ödeme", labelEn: "Swollen Legs/Edema" },
    { key: "schaufensterkrankheit", labelDe: "Schaufensterkrankheit (pAVK)", labelEn: "Peripheral Arterial Disease" },
  ];

  return (
    <div className="space-y-6">
      <p className="text-muted-foreground">
        {language === "de"
          ? "Bitte geben Sie an, ob Sie eine der folgenden Herz-Kreislauf-Erkrankungen haben oder hatten:"
          : "Please indicate if you have or had any of the following cardiovascular conditions:"}
      </p>

      <div className="grid gap-4">
        {conditions.map((item) => {
          const fieldData = (formData.herzKreislauf as any)?.[item.key];
          const isChecked = fieldData && typeof fieldData === 'object' && 'ja' in fieldData ? Boolean(fieldData.ja) : false;
          const timeValue = String(fieldData?.jahr || fieldData?.seit || "");
          const parsed = parseYearMonth(timeValue);

          return (
            <div key={item.key} className="border rounded-lg p-4">
              <div className="flex items-start gap-3">
                <Checkbox
                  checked={isChecked}
                  onCheckedChange={(checked) => updateNestedField("herzKreislauf", item.key, "ja", !!checked)}
                />
                <div className="space-y-2 flex-1">
                  <Label>{language === "de" ? item.labelDe : item.labelEn}</Label>
                  {isChecked && (
                    <div className="mt-2 max-w-xs">
                      <YearMonthSelect
                        yearValue={parsed.year}
                        monthValue={parsed.month}
                        onYearChange={(value) => setYearMonthCombined("herzKreislauf", item.key, "jahr", { year: value })}
                        onMonthChange={(value) => setYearMonthCombined("herzKreislauf", item.key, "jahr", { month: value })}
                        showMonth={true}
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
          {language === "de" ? "Sonstige Herz-Kreislauf-Erkrankungen" : "Other cardiovascular conditions"}
        </Label>
        <Textarea
          placeholder={language === "de" ? "Bitte beschreiben Sie weitere Erkrankungen..." : "Please describe other conditions..."}
          value={(formData.herzKreislauf as any)?.sonstige || ""}
          onChange={(e) => updateSectionField("herzKreislauf", "sonstige", e.target.value)}
          className="mt-2"
          rows={2}
        />
      </div>
    </div>
  );
};

export default HeartSection;
