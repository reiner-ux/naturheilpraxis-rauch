import { Checkbox } from "@/components/ui/checkbox";
import { Label } from "@/components/ui/label";
import { Textarea } from "@/components/ui/textarea";
import { useLanguage } from "@/contexts/LanguageContext";
import { AnamneseFormData } from "@/lib/anamneseFormData";
import TemporalStatusSelect from "./shared/TemporalStatusSelect";

interface LiverSectionProps {
  formData: AnamneseFormData;
  updateFormData: (field: string, value: any) => void;
}

const LiverSection = ({ formData, updateFormData }: LiverSectionProps) => {
  const { language } = useLanguage();
  const birthYear = formData.geburtsdatum ? new Date(formData.geburtsdatum).getFullYear() : undefined;
  const lgData = (formData.leberGalle || {}) as any;

  const parseYearMonth = (raw: string) => {
    if (!raw) return { year: "", month: "" };
    const m = raw.match(/^(\d{4})(?:-(\d{2}))?$/);
    if (!m) return { year: "", month: "" };
    return { year: m[1] ?? "", month: m[2] ?? "" };
  };

  const updateField = (field: string, subfield: string, value: any) => {
    const fieldData = lgData[field] || {};
    updateFormData("leberGalle", {
      ...lgData,
      [field]: { ...fieldData, [subfield]: value }
    });
  };

  const setYearMonth = (field: string, timeKey: string, next: { year?: string; month?: string }) => {
    const fieldData = lgData[field] || {};
    const current = parseYearMonth(String(fieldData[timeKey] ?? ""));
    const year = (next.year ?? current.year).slice(0, 4);
    const month = (next.month ?? current.month).slice(0, 2);
    const combined = month ? `${year}-${month}` : year;
    updateField(field, timeKey, combined);
  };

  const conditions = [
    { key: "fettleber", labelDe: "Fettleber", labelEn: "Fatty Liver" },
    { key: "lebererkrankung", labelDe: "Lebererkrankung (allgemein)", labelEn: "Liver Disease (general)" },
    { key: "hepatitisA", labelDe: "Hepatitis A", labelEn: "Hepatitis A" },
    { key: "hepatitisB", labelDe: "Hepatitis B", labelEn: "Hepatitis B" },
    { key: "hepatitisC", labelDe: "Hepatitis C", labelEn: "Hepatitis C" },
    { key: "leberzirrhose", labelDe: "Leberzirrhose", labelEn: "Liver Cirrhosis" },
    { key: "leberkrebs", labelDe: "Leberkrebs", labelEn: "Liver Cancer" },
    { key: "gelbsucht", labelDe: "Gelbsucht (Ikterus)", labelEn: "Jaundice" },
    { key: "haemochromatose", labelDe: "Hämochromatose (Eisenspeicherkrankheit)", labelEn: "Hemochromatosis" },
    { key: "morbuswilson", labelDe: "Morbus Wilson (Kupferspeicherkrankheit)", labelEn: "Wilson's Disease" },
    { key: "gallensteine", labelDe: "Gallensteine", labelEn: "Gallstones" },
    { key: "gallenkolik", labelDe: "Gallenkolik", labelEn: "Biliary Colic" },
    { key: "gallenleiden", labelDe: "Gallenleiden (allgemein)", labelEn: "Gallbladder Disease" },
    { key: "gallenblasenentfernung", labelDe: "Gallenblasenentfernung", labelEn: "Cholecystectomy" },
    { key: "gallengangentzuendung", labelDe: "Gallengangentzündung (Cholangitis)", labelEn: "Cholangitis" },
    { key: "bauchspeicheldruesenentzuendung", labelDe: "Bauchspeicheldrüsenentzündung (Pankreatitis)", labelEn: "Pancreatitis" },
  ];

  return (
    <div className="space-y-6">
      <p className="text-muted-foreground">
        {language === "de"
          ? "Bitte geben Sie an, ob Sie eine der folgenden Leber-, Gallen- oder Bauchspeicheldrüsenerkrankungen haben oder hatten:"
          : "Please indicate if you have or had any of the following liver, gallbladder, or pancreatic conditions:"}
      </p>

      <div className="grid gap-4">
        {conditions.map((item) => {
          const fieldData = lgData?.[item.key] || {};
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
                        prefix={`leber-${item.key}`}
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
          {language === "de" ? "Sonstige Leber-/Gallenerkrankungen" : "Other liver/gallbladder conditions"}
        </Label>
        <Textarea
          placeholder={language === "de" ? "Bitte beschreiben Sie weitere Erkrankungen..." : "Please describe other conditions..."}
          value={lgData?.sonstige || ""}
          onChange={(e) => updateFormData("leberGalle", { ...lgData, sonstige: e.target.value })}
          className="mt-2"
          rows={2}
        />
      </div>
    </div>
  );
};

export default LiverSection;
