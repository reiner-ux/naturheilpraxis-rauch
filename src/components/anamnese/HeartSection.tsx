import { Checkbox } from "@/components/ui/checkbox";
import { Label } from "@/components/ui/label";
import { Textarea } from "@/components/ui/textarea";
import { Input } from "@/components/ui/input";
import { useLanguage } from "@/contexts/LanguageContext";
import { AnamneseFormData } from "@/lib/anamneseFormData";
import TemporalStatusSelect from "./shared/TemporalStatusSelect";

interface HeartSectionProps {
  formData: AnamneseFormData;
  updateFormData: (field: string, value: any) => void;
}

const HeartSection = ({ formData, updateFormData }: HeartSectionProps) => {
  const { language } = useLanguage();
  const birthYear = formData.geburtsdatum ? new Date(formData.geburtsdatum).getFullYear() : undefined;
  const herzData = (formData.herzKreislauf || {}) as any;

  const parseYearMonth = (raw: string) => {
    if (!raw) return { year: "", month: "" };
    const m = raw.match(/^(\d{4})(?:-(\d{2}))?$/);
    if (!m) return { year: "", month: "" };
    return { year: m[1] ?? "", month: m[2] ?? "" };
  };

  const updateField = (field: string, subfield: string, value: any) => {
    const fieldData = herzData[field] || {};
    updateFormData("herzKreislauf", {
      ...herzData,
      [field]: { ...fieldData, [subfield]: value }
    });
  };

  const setYearMonth = (field: string, timeKey: string, next: { year?: string; month?: string }) => {
    const fieldData = herzData[field] || {};
    const current = parseYearMonth(String(fieldData[timeKey] ?? ""));
    const year = (next.year ?? current.year).slice(0, 4);
    const month = (next.month ?? current.month).slice(0, 2);
    const combined = month ? `${year}-${month}` : year;
    updateField(field, timeKey, combined);
  };

  const getBoolean = (obj: any, key: string) => {
    const v = obj?.[key];
    return typeof v === 'boolean' ? v : false;
  };

  const renderCondition = (
    key: string,
    labelDe: string,
    labelEn: string,
    subOptions?: { key: string; labelDe: string; labelEn: string }[],
    extraContent?: React.ReactNode
  ) => {
    const data = herzData[key] || {};
    const isChecked = Boolean(data.ja);
    const timeKey = data.seit !== undefined ? "seit" : "jahr";
    const seitParsed = parseYearMonth(String(data[timeKey] || ""));
    const bisParsed = parseYearMonth(String(data.bisJahr || ""));

    return (
      <div key={key} className="border rounded-lg p-4">
        <div className="flex items-start gap-3">
          <Checkbox checked={isChecked} onCheckedChange={(c) => updateField(key, "ja", !!c)} />
          <div className="space-y-2 flex-1">
            <Label>{language === "de" ? labelDe : labelEn}</Label>
            {isChecked && (
              <div className="space-y-3 mt-2">
                <TemporalStatusSelect
                  prefix={`herz-${key}`}
                  seitYear={seitParsed.year}
                  seitMonth={seitParsed.month}
                  status={data.status || ""}
                  bisYear={bisParsed.year}
                  bisMonth={bisParsed.month}
                  onSeitYearChange={(v) => setYearMonth(key, timeKey, { year: v })}
                  onSeitMonthChange={(v) => setYearMonth(key, timeKey, { month: v })}
                  onStatusChange={(v) => updateField(key, "status", v)}
                  onBisYearChange={(v) => setYearMonth(key, "bisJahr", { year: v })}
                  onBisMonthChange={(v) => setYearMonth(key, "bisJahr", { month: v })}
                  birthYear={birthYear}
                />
                {subOptions && subOptions.length > 0 && (
                  <div className="flex flex-wrap gap-4">
                    {subOptions.map(opt => (
                      <div key={opt.key} className="flex items-center gap-2">
                        <Checkbox
                          checked={getBoolean(data, opt.key)}
                          onCheckedChange={(c) => updateField(key, opt.key, !!c)}
                        />
                        <Label className="font-normal text-sm">{language === "de" ? opt.labelDe : opt.labelEn}</Label>
                      </div>
                    ))}
                  </div>
                )}
                {extraContent}
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
          ? "Bitte geben Sie an, ob Sie eine der folgenden Herz-Kreislauf-Erkrankungen haben oder hatten:"
          : "Please indicate if you have or had any of the following cardiovascular conditions:"}
      </p>

      <div className="grid gap-4">
        {renderCondition("blutdruckHoch", "Bluthochdruck", "High Blood Pressure")}
        {renderCondition("blutdruckNiedrig", "Niedriger Blutdruck", "Low Blood Pressure")}
        {renderCondition("herzrhythmusstörung", "Herzrhythmusstörung", "Heart Rhythm Disorder", [
          { key: "vorhofflimmern", labelDe: "Vorhofflimmern", labelEn: "Atrial fibrillation" },
          { key: "extrasystolen", labelDe: "Extrasystolen", labelEn: "Extrasystoles" },
        ])}
        {renderCondition("herzschmerzen", "Herzschmerzen/Angina pectoris", "Heart Pain/Angina", [
          { key: "belastung", labelDe: "Bei Belastung", labelEn: "During exertion" },
          { key: "ruhe", labelDe: "In Ruhe", labelEn: "At rest" },
        ])}
        {renderCondition("herzinfarkt", "Herzinfarkt", "Heart Attack")}
        {renderCondition("herzinsuffizienz", "Herzinsuffizienz/Herzschwäche", "Heart Failure")}
        {renderCondition("herzschrittmacher", "Herzschrittmacher", "Pacemaker")}
        {renderCondition("defibrillator", "Implantierter Defibrillator (ICD)", "Implanted Defibrillator (ICD)")}

        {/* Stent with count */}
        {renderCondition("stent", "Stent", "Stent", undefined,
          <div className="flex items-center gap-3">
            <Label className="text-sm">{language === "de" ? "Anzahl Stents:" : "Number of stents:"}</Label>
            <Input
              type="number"
              inputMode="numeric"
              min={1}
              max={10}
              className="w-20"
              value={herzData?.stent?.anzahl || ""}
              onChange={(e) => updateField("stent", "anzahl", e.target.value.replace(/\D/g, "").slice(0, 2))}
            />
          </div>
        )}

        {renderCondition("bypass", "Bypass-Operation", "Bypass Surgery")}
        {renderCondition("herzklappenfehler", "Herzklappenfehler", "Heart Valve Defect", [
          { key: "aorta", labelDe: "Aortenklappe", labelEn: "Aortic valve" },
          { key: "mitral", labelDe: "Mitralklappe", labelEn: "Mitral valve" },
          { key: "trikuspidal", labelDe: "Trikuspidalklappe", labelEn: "Tricuspid valve" },
        ])}

        {/* Herzklappenersatz with valve types */}
        {renderCondition("herzklappenersatz", "Herzklappenersatz", "Heart Valve Replacement", [
          { key: "aortenklappe", labelDe: "Aortenklappe", labelEn: "Aortic valve" },
          { key: "mitralklappe", labelDe: "Mitralklappe", labelEn: "Mitral valve" },
          { key: "trikuspidalklappe", labelDe: "Trikuspidalklappe", labelEn: "Tricuspid valve" },
          { key: "pulmonalklappe", labelDe: "Pulmonalklappe", labelEn: "Pulmonary valve" },
        ])}

        {renderCondition("herzmuskelentzuendung", "Herzmuskelentzündung (Myokarditis)", "Myocarditis")}
        {renderCondition("endokarditis", "Herzinnenhautentzündung (Endokarditis)", "Endocarditis")}

        {/* Krampfadern with locations */}
        {renderCondition("krampfadern", "Krampfadern (Varikose)", "Varicose Veins", [
          { key: "reUnterschenkel", labelDe: "Re. Unterschenkel", labelEn: "Right lower leg" },
          { key: "liUnterschenkel", labelDe: "Li. Unterschenkel", labelEn: "Left lower leg" },
          { key: "reOberschenkel", labelDe: "Re. Oberschenkel", labelEn: "Right upper leg" },
          { key: "liOberschenkel", labelDe: "Li. Oberschenkel", labelEn: "Left upper leg" },
        ])}

        {/* Thrombose with types and locations */}
        {renderCondition("thrombose", "Thrombose", "Thrombosis", [
          { key: "tiefeBeinvene", labelDe: "Tiefe Beinvenenthrombose (TVT)", labelEn: "Deep vein thrombosis (DVT)" },
          { key: "reUnterschenkel", labelDe: "Re. Unterschenkel", labelEn: "Right lower leg" },
          { key: "liUnterschenkel", labelDe: "Li. Unterschenkel", labelEn: "Left lower leg" },
          { key: "reOberschenkel", labelDe: "Re. Oberschenkel", labelEn: "Right upper leg" },
          { key: "liOberschenkel", labelDe: "Li. Oberschenkel", labelEn: "Left upper leg" },
          { key: "armvene", labelDe: "Armvenenthrombose", labelEn: "Arm vein thrombosis" },
          { key: "reArm", labelDe: "Rechter Arm", labelEn: "Right arm" },
          { key: "liArm", labelDe: "Linker Arm", labelEn: "Left arm" },
          { key: "lungenembolie", labelDe: "Lungenembolie", labelEn: "Pulmonary embolism" },
          { key: "sinusvene", labelDe: "Sinusvenenthrombose (zerebral)", labelEn: "Cerebral venous thrombosis" },
          { key: "pfortader", labelDe: "Pfortaderthrombose", labelEn: "Portal vein thrombosis" },
          { key: "mesenterialvene", labelDe: "Mesenterialvenenthrombose", labelEn: "Mesenteric vein thrombosis" },
          { key: "oberflaechlich", labelDe: "Oberflächliche Venenthrombose", labelEn: "Superficial vein thrombosis" },
        ])}

        {renderCondition("oedeme", "Geschwollene Beine/Ödeme", "Swollen Legs/Edema", [
          { key: "morgens", labelDe: "Morgens", labelEn: "Morning" },
          { key: "abends", labelDe: "Abends", labelEn: "Evening" },
          { key: "staendig", labelDe: "Ständig", labelEn: "Constant" },
        ])}
        {renderCondition("schaufensterkrankheit", "Schaufensterkrankheit (pAVK)", "Peripheral Arterial Disease")}
      </div>

      <div className="border rounded-lg p-4 bg-muted/30">
        <Label className="text-base font-medium">
          {language === "de" ? "Sonstige Herz-Kreislauf-Erkrankungen" : "Other cardiovascular conditions"}
        </Label>
        <Textarea
          placeholder={language === "de" ? "Bitte beschreiben Sie weitere Erkrankungen..." : "Please describe other conditions..."}
          value={herzData?.sonstige || ""}
          onChange={(e) => updateFormData("herzKreislauf", { ...herzData, sonstige: e.target.value })}
          className="mt-2"
          rows={2}
        />
      </div>
    </div>
  );
};

export default HeartSection;
