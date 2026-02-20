import { Checkbox } from "@/components/ui/checkbox";
import { Label } from "@/components/ui/label";
import { Textarea } from "@/components/ui/textarea";
import { useLanguage } from "@/contexts/LanguageContext";
import { AnamneseFormData } from "@/lib/anamneseFormData";
import TemporalStatusSelect from "./shared/TemporalStatusSelect";

interface KidneySectionProps {
  formData: AnamneseFormData;
  updateFormData: (field: string, value: any) => void;
}

const KidneySection = ({ formData, updateFormData }: KidneySectionProps) => {
  const { language } = useLanguage();
  const birthYear = formData.geburtsdatum ? new Date(formData.geburtsdatum).getFullYear() : undefined;
  const nbData = (formData.niereBlase || {}) as any;

  const parseYearMonth = (raw: string) => {
    if (!raw) return { year: "", month: "" };
    const m = raw.match(/^(\d{4})(?:-(\d{2}))?$/);
    if (!m) return { year: "", month: "" };
    return { year: m[1] ?? "", month: m[2] ?? "" };
  };

  const updateField = (field: string, subfield: string, value: any) => {
    const fieldData = nbData[field] || {};
    updateFormData("niereBlase", {
      ...nbData,
      [field]: { ...fieldData, [subfield]: value }
    });
  };

  const setYearMonth = (field: string, timeKey: string, next: { year?: string; month?: string }) => {
    const fieldData = nbData[field] || {};
    const current = parseYearMonth(String(fieldData[timeKey] ?? ""));
    const year = (next.year ?? current.year).slice(0, 4);
    const month = (next.month ?? current.month).slice(0, 2);
    const combined = month ? `${year}-${month}` : year;
    updateField(field, timeKey, combined);
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
          const fieldData = nbData?.[item.key] || {};
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
                        prefix={`niere-${item.key}`}
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
          {language === "de" ? "Sonstige Nieren-/Blasenerkrankungen" : "Other kidney/bladder conditions"}
        </Label>
        <Textarea
          placeholder={language === "de" ? "Bitte beschreiben Sie weitere Erkrankungen..." : "Please describe other conditions..."}
          value={nbData?.sonstige || ""}
          onChange={(e) => updateFormData("niereBlase", { ...nbData, sonstige: e.target.value })}
          className="mt-2"
          rows={2}
        />
      </div>
    </div>
  );
};

export default KidneySection;
