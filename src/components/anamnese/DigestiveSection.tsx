import { Checkbox } from "@/components/ui/checkbox";
import { Label } from "@/components/ui/label";
import { Textarea } from "@/components/ui/textarea";
import { useLanguage } from "@/contexts/LanguageContext";
import { AnamneseFormData } from "@/lib/anamneseFormData";
import TemporalStatusSelect from "./shared/TemporalStatusSelect";

interface DigestiveSectionProps {
  formData: AnamneseFormData;
  updateFormData: (field: string, value: any) => void;
}

const DigestiveSection = ({ formData, updateFormData }: DigestiveSectionProps) => {
  const { language } = useLanguage();
  const birthYear = formData.geburtsdatum ? new Date(formData.geburtsdatum).getFullYear() : undefined;
  const mdData = (formData.magenDarm || {}) as any;

  const parseYearMonth = (raw: string) => {
    if (!raw) return { year: "", month: "" };
    const m = raw.match(/^(\d{4})(?:-(\d{2}))?$/);
    if (!m) return { year: "", month: "" };
    return { year: m[1] ?? "", month: m[2] ?? "" };
  };

  const updateField = (field: string, subfield: string, value: any) => {
    const fieldData = mdData[field] || {};
    updateFormData("magenDarm", {
      ...mdData,
      [field]: { ...fieldData, [subfield]: value }
    });
  };

  const setYearMonth = (field: string, timeKey: string, next: { year?: string; month?: string }) => {
    const fieldData = mdData[field] || {};
    const current = parseYearMonth(String(fieldData[timeKey] ?? ""));
    const year = (next.year ?? current.year).slice(0, 4);
    const month = (next.month ?? current.month).slice(0, 2);
    const combined = month ? `${year}-${month}` : year;
    updateField(field, timeKey, combined);
  };

  const conditions = [
    { key: "sodbrennen", labelDe: "Sodbrennen/Reflux", labelEn: "Heartburn/Reflux" },
    { key: "gastritis", labelDe: "Magenschleimhautentzündung (Gastritis)", labelEn: "Gastritis" },
    { key: "magengeschwuer", labelDe: "Magengeschwür", labelEn: "Stomach Ulcer" },
    { key: "zwoelffingerdarmgeschwuer", labelDe: "Zwölffingerdarmgeschwür", labelEn: "Duodenal Ulcer" },
    { key: "helicobacter", labelDe: "Helicobacter pylori Infektion", labelEn: "H. pylori Infection" },
    { key: "uebelkeit", labelDe: "Häufige Übelkeit", labelEn: "Frequent Nausea" },
    { key: "erbrechen", labelDe: "Häufiges Erbrechen", labelEn: "Frequent Vomiting" },
    { key: "verstopfung", labelDe: "Verstopfung (Obstipation)", labelEn: "Constipation" },
    { key: "durchfall", labelDe: "Häufiger Durchfall", labelEn: "Frequent Diarrhea" },
    { key: "blaehungen", labelDe: "Blähungen/Meteorismus", labelEn: "Bloating/Flatulence" },
    { key: "bauchschmerzen", labelDe: "Bauchschmerzen/-krämpfe", labelEn: "Abdominal Pain/Cramps" },
    { key: "reizdarm", labelDe: "Reizdarmsyndrom (IBS)", labelEn: "Irritable Bowel Syndrome" },
    { key: "morbusCrohn", labelDe: "Morbus Crohn", labelEn: "Crohn's Disease" },
    { key: "colitis", labelDe: "Colitis ulcerosa", labelEn: "Ulcerative Colitis" },
    { key: "zoeliakie", labelDe: "Zöliakie/Glutenunverträglichkeit", labelEn: "Celiac Disease" },
    { key: "laktoseintoleranz", labelDe: "Laktoseintoleranz", labelEn: "Lactose Intolerance" },
    { key: "fruktoseintoleranz", labelDe: "Fruktoseintoleranz", labelEn: "Fructose Intolerance" },
    { key: "histaminintoleranz", labelDe: "Histaminintoleranz", labelEn: "Histamine Intolerance" },
    { key: "divertikel", labelDe: "Darmdivertikel/Divertikulitis", labelEn: "Diverticulosis/Diverticulitis" },
    { key: "haemorrhoiden", labelDe: "Hämorrhoiden", labelEn: "Hemorrhoids" },
    { key: "darmpolypen", labelDe: "Darmpolypen", labelEn: "Intestinal Polyps" },
  ];

  return (
    <div className="space-y-6">
      <p className="text-muted-foreground">
        {language === "de"
          ? "Bitte geben Sie an, ob Sie eine der folgenden Magen-Darm-Erkrankungen haben oder hatten:"
          : "Please indicate if you have or had any of the following digestive conditions:"}
      </p>

      <div className="grid gap-4">
        {conditions.map((item) => {
          const fieldData = mdData?.[item.key] || {};
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
                        prefix={`md-${item.key}`}
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
          {language === "de" ? "Sonstige Magen-Darm-Erkrankungen" : "Other digestive conditions"}
        </Label>
        <Textarea
          placeholder={language === "de" ? "Bitte beschreiben Sie weitere Erkrankungen..." : "Please describe other conditions..."}
          value={mdData?.sonstige || ""}
          onChange={(e) => updateFormData("magenDarm", { ...mdData, sonstige: e.target.value })}
          className="mt-2"
          rows={2}
        />
      </div>
    </div>
  );
};

export default DigestiveSection;
