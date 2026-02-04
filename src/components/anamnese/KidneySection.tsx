import { Checkbox } from "@/components/ui/checkbox";
import { Label } from "@/components/ui/label";
import { Textarea } from "@/components/ui/textarea";
import { useLanguage } from "@/contexts/LanguageContext";
import { AnamneseFormData } from "@/lib/anamneseFormData";
import YearMonthSelect from "./shared/YearMonthSelect";

interface KidneySectionProps {
  formData: AnamneseFormData;
  updateFormData: (field: string, value: any) => void;
}

const KidneySection = ({ formData, updateFormData }: KidneySectionProps) => {
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
    { key: "nierenerkrankung", labelDe: "Nierenerkrankung (allgemein)", labelEn: "Kidney Disease (general)" },
    { key: "niereninsuffizienz", labelDe: "Niereninsuffizienz/Nierenversagen", labelEn: "Kidney Failure" },
    { key: "dialyse", labelDe: "Dialyse", labelEn: "Dialysis" },
    { key: "nierentransplantation", labelDe: "Nierentransplantation", labelEn: "Kidney Transplant" },
    { key: "nierensteine", labelDe: "Nierensteine", labelEn: "Kidney Stones" },
    { key: "nierenkolik", labelDe: "Nierenkolik", labelEn: "Renal Colic" },
    { key: "nierenbeckenentzuendung", labelDe: "Nierenbeckenentzündung (Pyelonephritis)", labelEn: "Pyelonephritis" },
    { key: "glomerulonephritis", labelDe: "Glomerulonephritis", labelEn: "Glomerulonephritis" },
    { key: "zystenniere", labelDe: "Zystenniere", labelEn: "Polycystic Kidney Disease" },
    { key: "blasenleiden", labelDe: "Blasenleiden (allgemein)", labelEn: "Bladder Condition (general)" },
    { key: "blasenentzuendung", labelDe: "Wiederkehrende Blasenentzündung", labelEn: "Recurrent UTI" },
    { key: "reizblase", labelDe: "Reizblase", labelEn: "Overactive Bladder" },
    { key: "nykturie", labelDe: "Nächtlicher Harndrang (Nykturie)", labelEn: "Nocturia" },
    { key: "miktionsbeschwerden", labelDe: "Miktionsbeschwerden", labelEn: "Urination Problems" },
    { key: "inkontinenz", labelDe: "Harninkontinenz", labelEn: "Urinary Incontinence" },
    { key: "harnroehrenverengung", labelDe: "Harnröhrenverengung", labelEn: "Urethral Stricture" },
  ];

  return (
    <div className="space-y-6">
      <p className="text-muted-foreground">
        {language === "de"
          ? "Bitte geben Sie an, ob Sie eine der folgenden Nieren- oder Blasenerkrankungen haben oder hatten:"
          : "Please indicate if you have or had any of the following kidney or bladder conditions:"}
      </p>

      <div className="grid gap-4">
        {conditions.map((item) => {
          const fieldData = (formData.niereBlase as any)?.[item.key];
          const isChecked = fieldData && typeof fieldData === 'object' && 'ja' in fieldData ? Boolean(fieldData.ja) : false;
          const timeValue = String(fieldData?.jahr || fieldData?.seit || "");
          const parsed = parseYearMonth(timeValue);

          return (
            <div key={item.key} className="border rounded-lg p-4">
              <div className="flex items-start gap-3">
                <Checkbox
                  checked={isChecked}
                  onCheckedChange={(checked) => updateNestedField("niereBlase", item.key, "ja", !!checked)}
                />
                <div className="space-y-2 flex-1">
                  <Label>{language === "de" ? item.labelDe : item.labelEn}</Label>
                  {isChecked && (
                    <div className="mt-2 max-w-xs">
                      <YearMonthSelect
                        yearValue={parsed.year}
                        monthValue={parsed.month}
                        onYearChange={(value) => setYearMonthCombined("niereBlase", item.key, "jahr", { year: value })}
                        onMonthChange={(value) => setYearMonthCombined("niereBlase", item.key, "jahr", { month: value })}
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
          {language === "de" ? "Sonstige Nieren-/Blasenerkrankungen" : "Other kidney/bladder conditions"}
        </Label>
        <Textarea
          placeholder={language === "de" ? "Bitte beschreiben Sie weitere Erkrankungen..." : "Please describe other conditions..."}
          value={(formData.niereBlase as any)?.sonstige || ""}
          onChange={(e) => updateSectionField("niereBlase", "sonstige", e.target.value)}
          className="mt-2"
          rows={2}
        />
      </div>
    </div>
  );
};

export default KidneySection;
