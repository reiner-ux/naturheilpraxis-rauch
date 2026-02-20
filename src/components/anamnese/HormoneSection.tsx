import { useState } from "react";
import { Checkbox } from "@/components/ui/checkbox";
import { Label } from "@/components/ui/label";
import { Textarea } from "@/components/ui/textarea";
import { useLanguage } from "@/contexts/LanguageContext";
import { AnamneseFormData } from "@/lib/anamneseFormData";
import { Collapsible, CollapsibleContent, CollapsibleTrigger } from "@/components/ui/collapsible";
import { Button } from "@/components/ui/button";
import { ChevronDown } from "lucide-react";
import YearMonthSelect from "./shared/YearMonthSelect";
import SubConditionList from "./shared/SubConditionList";

interface HormoneSectionProps {
  formData: AnamneseFormData;
  updateFormData: (field: string, value: any) => void;
}

const HormoneSection = ({ formData, updateFormData }: HormoneSectionProps) => {
  const { language } = useLanguage();
  const [expandedSections, setExpandedSections] = useState<Record<string, boolean>>({
    schilddruese: false,
    hypophyse: false,
    nebenniere: false,
    diabetes: false,
  });

  const birthYear = formData.geburtsdatum ? new Date(formData.geburtsdatum).getFullYear() : undefined;

  const setSectionOpen = (section: string, open: boolean) => {
    setExpandedSections((prev) => ({ ...prev, [section]: open }));
  };

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

  const getNestedBoolean = (obj: any, key: string): boolean => {
    const value = obj?.[key];
    return typeof value === 'boolean' ? value : false;
  };

  const renderConditionItem = (
    section: string,
    item: { key: string; labelDe: string; labelEn: string },
    subOptions?: { key: string; labelDe: string; labelEn: string }[]
  ) => {
    const sectionData = formData[section as keyof AnamneseFormData] as any;
    const fieldData = sectionData?.[item.key];
    const isObject = fieldData && typeof fieldData === 'object';
    const isChecked = isObject && 'ja' in fieldData ? Boolean(fieldData.ja) : false;
    const timeValue = String(fieldData?.jahr || fieldData?.seit || "");
    const parsed = parseYearMonth(timeValue);

    return (
      <div key={item.key} className="border rounded-lg p-4">
        <div className="flex items-start gap-3">
          <Checkbox
            checked={isChecked}
            onCheckedChange={(checked) => updateNestedField(section, item.key, "ja", !!checked)}
          />
          <div className="space-y-2 flex-1">
            <Label>{language === "de" ? item.labelDe : item.labelEn}</Label>
            {isChecked && (
              <div className="space-y-3 mt-2">
                <div className="max-w-xs">
                  <YearMonthSelect
                    yearValue={parsed.year}
                    monthValue={parsed.month}
                    onYearChange={(value) => setYearMonthCombined(section, item.key, "jahr", { year: value })}
                    onMonthChange={(value) => setYearMonthCombined(section, item.key, "jahr", { month: value })}
                    showMonth={true}
                    birthYear={birthYear}
                  />
                </div>
                {subOptions && subOptions.length > 0 && (
                  <div className="flex flex-wrap gap-4">
                    {subOptions.map((option) => (
                      <div key={option.key} className="flex items-center gap-2">
                        <Checkbox
                          checked={getNestedBoolean(fieldData, option.key)}
                          onCheckedChange={(checked) => updateNestedField(section, item.key, option.key, !!checked)}
                        />
                        <Label className="font-normal text-sm">{language === "de" ? option.labelDe : option.labelEn}</Label>
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
          ? "Bitte geben Sie an, ob Sie hormonelle Erkrankungen haben oder hatten:"
          : "Please indicate if you have or had any hormonal conditions:"}
      </p>

      {/* Schilddrüse - type-first pattern */}
      <Collapsible 
        open={expandedSections.schilddruese} 
        onOpenChange={(open) => setSectionOpen('schilddruese', open)}
      >
        <CollapsibleTrigger asChild>
          <Button variant="ghost" className="w-full justify-between p-4 border rounded-lg">
            <span className="font-medium">{language === "de" ? "🦋 Schilddrüsenerkrankungen" : "🦋 Thyroid Diseases"}</span>
            <ChevronDown className={`h-4 w-4 transition-transform ${expandedSections.schilddruese ? 'rotate-180' : ''}`} />
          </Button>
        </CollapsibleTrigger>
        <CollapsibleContent className="pt-4">
          <SubConditionList
            items={[
              { key: "unterfunktion", labelDe: "Unterfunktion (Hypothyreose)", labelEn: "Hypothyroidism" },
              { key: "ueberfunktion", labelDe: "Überfunktion (Hyperthyreose)", labelEn: "Hyperthyroidism" },
              { key: "hashimoto", labelDe: "Hashimoto-Thyreoiditis", labelEn: "Hashimoto's Thyroiditis" },
              { key: "basedow", labelDe: "Morbus Basedow", labelEn: "Graves' Disease" },
              { key: "knoten", labelDe: "Schilddrüsenknoten", labelEn: "Thyroid Nodules" },
              { key: "schilddruesenkrebs", labelDe: "Schilddrüsenkrebs", labelEn: "Thyroid Cancer" },
              { key: "schilddruesenop", labelDe: "Schilddrüsen-OP", labelEn: "Thyroid Surgery" },
              { key: "radiojodtherapie", labelDe: "Radiojodtherapie", labelEn: "Radioiodine Therapy" },
            ]}
            parentData={(formData.hormongesundheit as any)?.schilddruese || {}}
            onSubItemChange={(subKey, subField, value) => {
              const current = formData.hormongesundheit as any || {};
              const parent = current.schilddruese || {};
              const subItem = parent[subKey];
              const currentSub = (typeof subItem === 'boolean')
                ? { ja: subItem, seit: "", status: "", bisJahr: "" }
                : { seit: "", status: "", bisJahr: "", ...(subItem || {}) };
              updateFormData("hormongesundheit", {
                ...current,
                schilddruese: { ...parent, [subKey]: { ...currentSub, [subField]: value } }
              });
            }}
            birthYear={birthYear}
          />
        </CollapsibleContent>
      </Collapsible>

      {/* Hypophyse */}
      <Collapsible 
        open={expandedSections.hypophyse} 
        onOpenChange={(open) => setSectionOpen('hypophyse', open)}
      >
        <CollapsibleTrigger asChild>
          <Button variant="ghost" className="w-full justify-between p-4 border rounded-lg">
            <span className="font-medium">{language === "de" ? "🧠 Hypophysenerkrankungen" : "🧠 Pituitary Diseases"}</span>
            <ChevronDown className={`h-4 w-4 transition-transform ${expandedSections.hypophyse ? 'rotate-180' : ''}`} />
          </Button>
        </CollapsibleTrigger>
        <CollapsibleContent className="space-y-4 pt-4">
          {renderConditionItem("hormongesundheit", 
            { key: "hypophyse", labelDe: "Hypophysenerkrankungen", labelEn: "Pituitary Diseases" },
            [
              { key: "hypophysenadenom", labelDe: "Hypophysenadenom", labelEn: "Pituitary Adenoma" },
              { key: "prolaktinom", labelDe: "Prolaktinom", labelEn: "Prolactinoma" },
              { key: "akromegalie", labelDe: "Akromegalie", labelEn: "Acromegaly" },
              { key: "hypophyseninsuffizienz", labelDe: "Hypophyseninsuffizienz", labelEn: "Hypopituitarism" },
              { key: "diabetesInsipidus", labelDe: "Diabetes insipidus", labelEn: "Diabetes Insipidus" },
            ]
          )}
        </CollapsibleContent>
      </Collapsible>

      {/* Nebenniere */}
      <Collapsible 
        open={expandedSections.nebenniere} 
        onOpenChange={(open) => setSectionOpen('nebenniere', open)}
      >
        <CollapsibleTrigger asChild>
          <Button variant="ghost" className="w-full justify-between p-4 border rounded-lg">
            <span className="font-medium">{language === "de" ? "⚡ Nebennierenerkrankungen" : "⚡ Adrenal Diseases"}</span>
            <ChevronDown className={`h-4 w-4 transition-transform ${expandedSections.nebenniere ? 'rotate-180' : ''}`} />
          </Button>
        </CollapsibleTrigger>
        <CollapsibleContent className="space-y-4 pt-4">
          {renderConditionItem("hormongesundheit", 
            { key: "nebenniere", labelDe: "Nebennierenerkrankungen", labelEn: "Adrenal Diseases" },
            [
              { key: "nebenniereninsuffizienz", labelDe: "Nebenniereninsuffizienz (Morbus Addison)", labelEn: "Adrenal Insufficiency (Addison's Disease)" },
              { key: "cushingSyndrom", labelDe: "Cushing-Syndrom", labelEn: "Cushing's Syndrome" },
              { key: "phaeochromozytom", labelDe: "Phäochromozytom", labelEn: "Pheochromocytoma" },
              { key: "nebennierenerschoepfung", labelDe: "Nebennierenerschöpfung", labelEn: "Adrenal Fatigue" },
            ]
          )}
        </CollapsibleContent>
      </Collapsible>

      {/* Diabetes */}
      <Collapsible 
        open={expandedSections.diabetes} 
        onOpenChange={(open) => setSectionOpen('diabetes', open)}
      >
        <CollapsibleTrigger asChild>
          <Button variant="ghost" className="w-full justify-between p-4 border rounded-lg">
            <span className="font-medium">{language === "de" ? "🩸 Diabetes & Stoffwechsel" : "🩸 Diabetes & Metabolism"}</span>
            <ChevronDown className={`h-4 w-4 transition-transform ${expandedSections.diabetes ? 'rotate-180' : ''}`} />
          </Button>
        </CollapsibleTrigger>
        <CollapsibleContent className="space-y-4 pt-4">
          {renderConditionItem("hormongesundheit", 
            { key: "diabetesTyp1", labelDe: "Diabetes Typ 1", labelEn: "Type 1 Diabetes" },
            []
          )}
          {renderConditionItem("hormongesundheit", 
            { key: "diabetesTyp2", labelDe: "Diabetes Typ 2", labelEn: "Type 2 Diabetes" },
            [
              { key: "insulinpflichtig", labelDe: "Insulinpflichtig", labelEn: "Insulin-dependent" },
              { key: "tabletten", labelDe: "Tabletten", labelEn: "Oral medication" },
              { key: "diaet", labelDe: "Diät", labelEn: "Diet-controlled" },
            ]
          )}
          {renderConditionItem("hormongesundheit", 
            { key: "prediabetes", labelDe: "Prädiabetes/gestörte Glukosetoleranz", labelEn: "Prediabetes" },
            []
          )}
        </CollapsibleContent>
      </Collapsible>

      <div className="border rounded-lg p-4 bg-muted/30">
        <Label className="text-base font-medium">
          {language === "de" ? "Sonstige hormonelle Erkrankungen" : "Other hormonal conditions"}
        </Label>
        <Textarea
          placeholder={language === "de" ? "Bitte beschreiben Sie weitere Erkrankungen..." : "Please describe other conditions..."}
          value={(formData.hormongesundheit as any)?.sonstige || ""}
          onChange={(e) => updateSectionField("hormongesundheit", "sonstige", e.target.value)}
          className="mt-2"
          rows={2}
        />
      </div>
    </div>
  );
};

export default HormoneSection;
