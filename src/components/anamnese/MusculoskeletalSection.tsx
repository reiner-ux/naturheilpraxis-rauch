import { Checkbox } from "@/components/ui/checkbox";
import { Label } from "@/components/ui/label";
import { Textarea } from "@/components/ui/textarea";
import { useLanguage } from "@/contexts/LanguageContext";
import { AnamneseFormData } from "@/lib/anamneseFormData";
import YearMonthSelect from "./shared/YearMonthSelect";

interface MusculoskeletalSectionProps {
  formData: AnamneseFormData;
  updateFormData: (field: string, value: any) => void;
}

const MusculoskeletalSection = ({ formData, updateFormData }: MusculoskeletalSectionProps) => {
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

  const spineConditions = [
    { key: "hws", labelDe: "HWS (Halswirbelsäule)", labelEn: "Cervical Spine" },
    { key: "bws", labelDe: "BWS (Brustwirbelsäule)", labelEn: "Thoracic Spine" },
    { key: "lws", labelDe: "LWS (Lendenwirbelsäule)", labelEn: "Lumbar Spine" },
    { key: "bandscheibenvorfall", labelDe: "Bandscheibenvorfall", labelEn: "Herniated Disc" },
    { key: "spinalkanalstenose", labelDe: "Spinalkanalstenose", labelEn: "Spinal Stenosis" },
    { key: "skoliose", labelDe: "Skoliose", labelEn: "Scoliosis" },
    { key: "morbusBechterew", labelDe: "Morbus Bechterew", labelEn: "Ankylosing Spondylitis" },
  ];

  const jointConditions = [
    { key: "schulter", labelDe: "Schultergelenke", labelEn: "Shoulder Joints", hasSymmetry: true },
    { key: "ellbogen", labelDe: "Ellbogengelenke", labelEn: "Elbow Joints", hasSymmetry: true },
    { key: "handgelenk", labelDe: "Handgelenke", labelEn: "Wrist Joints", hasSymmetry: true },
    { key: "finger", labelDe: "Fingergelenke", labelEn: "Finger Joints", hasSymmetry: true },
    { key: "huefte", labelDe: "Hüftgelenke", labelEn: "Hip Joints", hasSymmetry: true },
    { key: "knie", labelDe: "Kniegelenke", labelEn: "Knee Joints", hasSymmetry: true },
    { key: "fuss", labelDe: "Fußgelenke/Sprunggelenk", labelEn: "Ankle Joints", hasSymmetry: true },
  ];

  const rheumaConditions = [
    { key: "rheuma", labelDe: "Rheumatoide Arthritis", labelEn: "Rheumatoid Arthritis" },
    { key: "arthrose", labelDe: "Arthrose (Gelenkverschleiß)", labelEn: "Osteoarthritis" },
    { key: "gicht", labelDe: "Gicht", labelEn: "Gout" },
    { key: "fibromyalgie", labelDe: "Fibromyalgie", labelEn: "Fibromyalgia" },
    { key: "osteoporose", labelDe: "Osteoporose", labelEn: "Osteoporosis" },
    { key: "lupus", labelDe: "Lupus erythematodes", labelEn: "Lupus" },
  ];

  const renderCondition = (item: { key: string; labelDe: string; labelEn: string; hasSymmetry?: boolean }) => {
    const fieldData = (formData.wirbelsaeuleGelenke as any)?.[item.key];
    const isChecked = fieldData && typeof fieldData === 'object' && 'ja' in fieldData ? Boolean(fieldData.ja) : false;
    const timeValue = String(fieldData?.seit || fieldData?.jahr || "");
    const parsed = parseYearMonth(timeValue);

    return (
      <div key={item.key} className="border rounded-lg p-4">
        <div className="flex items-start gap-3">
          <Checkbox
            checked={isChecked}
            onCheckedChange={(checked) => updateNestedField("wirbelsaeuleGelenke", item.key, "ja", !!checked)}
          />
          <div className="space-y-2 flex-1">
            <Label>{language === "de" ? item.labelDe : item.labelEn}</Label>
            {isChecked && (
              <div className="space-y-3 mt-2">
                <div className="max-w-xs">
                  <YearMonthSelect
                    yearValue={parsed.year}
                    monthValue={parsed.month}
                    onYearChange={(value) => setYearMonthCombined("wirbelsaeuleGelenke", item.key, "seit", { year: value })}
                    onMonthChange={(value) => setYearMonthCombined("wirbelsaeuleGelenke", item.key, "seit", { month: value })}
                    showMonth={true}
                    birthYear={birthYear}
                  />
                </div>
                {item.hasSymmetry && (
                  <div className="flex flex-wrap gap-4">
                    {[
                      { key: "rechts", labelDe: "rechts", labelEn: "right" },
                      { key: "links", labelDe: "links", labelEn: "left" },
                      { key: "beidseitig", labelDe: "beidseitig", labelEn: "both sides" },
                    ].map((side) => (
                      <div key={side.key} className="flex items-center gap-2">
                        <Checkbox
                          checked={fieldData?.[side.key] || false}
                          onCheckedChange={(checked) => updateNestedField("wirbelsaeuleGelenke", item.key, side.key, !!checked)}
                        />
                        <Label className="font-normal text-sm">{language === "de" ? side.labelDe : side.labelEn}</Label>
                      </div>
                    ))}
                  </div>
                )}
              </div>
            )}
          </div>
        </div>
      </div>
    );
  };

  return (
    <div className="space-y-6">
      <p className="text-muted-foreground">
        {language === "de"
          ? "Bitte geben Sie an, ob Sie Erkrankungen der Wirbelsäule oder Gelenke haben oder hatten:"
          : "Please indicate if you have or had any spine or joint conditions:"}
      </p>

      <h4 className="font-semibold">{language === "de" ? "Wirbelsäule" : "Spine"}</h4>
      <div className="grid gap-4">
        {spineConditions.map(renderCondition)}
      </div>

      <h4 className="font-semibold mt-6">{language === "de" ? "Gelenke" : "Joints"}</h4>
      <div className="grid gap-4">
        {jointConditions.map(renderCondition)}
      </div>

      <h4 className="font-semibold mt-6">{language === "de" ? "Rheumatische Erkrankungen" : "Rheumatic Diseases"}</h4>
      <div className="grid gap-4">
        {rheumaConditions.map(renderCondition)}
      </div>

      <div className="border rounded-lg p-4 bg-muted/30">
        <Label className="text-base font-medium">
          {language === "de" ? "Sonstige Erkrankungen" : "Other conditions"}
        </Label>
        <Textarea
          placeholder={language === "de" ? "Bitte beschreiben Sie weitere Erkrankungen..." : "Please describe other conditions..."}
          value={(formData.wirbelsaeuleGelenke as any)?.sonstige || ""}
          onChange={(e) => updateSectionField("wirbelsaeuleGelenke", "sonstige", e.target.value)}
          className="mt-2"
          rows={2}
        />
      </div>
    </div>
  );
};

export default MusculoskeletalSection;
