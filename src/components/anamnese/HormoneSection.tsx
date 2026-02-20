import { useState } from "react";
import { Checkbox } from "@/components/ui/checkbox";
import { Label } from "@/components/ui/label";
import { Textarea } from "@/components/ui/textarea";
import { useLanguage } from "@/contexts/LanguageContext";
import { AnamneseFormData } from "@/lib/anamneseFormData";
import { Collapsible, CollapsibleContent, CollapsibleTrigger } from "@/components/ui/collapsible";
import { Button } from "@/components/ui/button";
import { ChevronDown } from "lucide-react";
import SubConditionList from "./shared/SubConditionList";
import TemporalStatusSelect from "./shared/TemporalStatusSelect";

interface HormoneSectionProps {
  formData: AnamneseFormData;
  updateFormData: (field: string, value: any) => void;
}

const HormoneSection = ({ formData, updateFormData }: HormoneSectionProps) => {
  const { language } = useLanguage();
  const [expandedSections, setExpandedSections] = useState<Record<string, boolean>>({});

  const birthYear = formData.geburtsdatum ? new Date(formData.geburtsdatum).getFullYear() : undefined;
  const hormonData = (formData.hormongesundheit || {}) as any;

  const setSectionOpen = (section: string, open: boolean) => {
    setExpandedSections((prev) => ({ ...prev, [section]: open }));
  };

  const handleSubItemChange = (parentKey: string, subKey: string, subField: string, value: any) => {
    const parent = hormonData[parentKey] || {};
    const subItem = parent[subKey];
    const currentSub = (typeof subItem === 'boolean')
      ? { ja: subItem, seit: "", status: "", bisJahr: "" }
      : { seit: "", status: "", bisJahr: "", ...(subItem || {}) };
    updateFormData("hormongesundheit", {
      ...hormonData,
      [parentKey]: { ...parent, [subKey]: { ...currentSub, [subField]: value } }
    });
  };

  const renderCollapsibleWithSubConditions = (
    sectionKey: string,
    emoji: string,
    labelDe: string,
    labelEn: string,
    items: { key: string; labelDe: string; labelEn: string }[]
  ) => (
    <Collapsible
      key={sectionKey}
      open={!!expandedSections[sectionKey]}
      onOpenChange={(open) => setSectionOpen(sectionKey, open)}
    >
      <CollapsibleTrigger asChild>
        <Button variant="ghost" className="w-full justify-between p-4 border rounded-lg">
          <span className="font-medium">{language === "de" ? `${emoji} ${labelDe}` : `${emoji} ${labelEn}`}</span>
          <ChevronDown className={`h-4 w-4 transition-transform ${expandedSections[sectionKey] ? 'rotate-180' : ''}`} />
        </Button>
      </CollapsibleTrigger>
      <CollapsibleContent className="pt-4">
        <SubConditionList
          items={items}
          parentData={hormonData[sectionKey] || {}}
          onSubItemChange={(subKey, subField, value) => handleSubItemChange(sectionKey, subKey, subField, value)}
          birthYear={birthYear}
        />
      </CollapsibleContent>
    </Collapsible>
  );

  return (
    <div className="space-y-6">
      <p className="text-muted-foreground">
        {language === "de"
          ? "Bitte geben Sie an, ob Sie hormonelle Erkrankungen haben oder hatten:"
          : "Please indicate if you have or had any hormonal conditions:"}
      </p>

      {renderCollapsibleWithSubConditions("schilddruese", "🦋", "Schilddrüsenerkrankungen", "Thyroid Diseases", [
        { key: "unterfunktion", labelDe: "Unterfunktion (Hypothyreose)", labelEn: "Hypothyroidism" },
        { key: "ueberfunktion", labelDe: "Überfunktion (Hyperthyreose)", labelEn: "Hyperthyroidism" },
        { key: "hashimoto", labelDe: "Hashimoto-Thyreoiditis", labelEn: "Hashimoto's Thyroiditis" },
        { key: "basedow", labelDe: "Morbus Basedow", labelEn: "Graves' Disease" },
        { key: "knoten", labelDe: "Schilddrüsenknoten", labelEn: "Thyroid Nodules" },
        { key: "schilddruesenkrebs", labelDe: "Schilddrüsenkrebs", labelEn: "Thyroid Cancer" },
        { key: "schilddruesenop", labelDe: "Schilddrüsen-OP", labelEn: "Thyroid Surgery" },
        { key: "radiojodtherapie", labelDe: "Radiojodtherapie", labelEn: "Radioiodine Therapy" },
      ])}

      {renderCollapsibleWithSubConditions("hypophyse", "🧠", "Hypophysenerkrankungen", "Pituitary Diseases", [
        { key: "hypophysenadenom", labelDe: "Hypophysenadenom", labelEn: "Pituitary Adenoma" },
        { key: "prolaktinom", labelDe: "Prolaktinom", labelEn: "Prolactinoma" },
        { key: "akromegalie", labelDe: "Akromegalie", labelEn: "Acromegaly" },
        { key: "hypophyseninsuffizienz", labelDe: "Hypophyseninsuffizienz", labelEn: "Hypopituitarism" },
        { key: "diabetesInsipidus", labelDe: "Diabetes insipidus", labelEn: "Diabetes Insipidus" },
      ])}

      {renderCollapsibleWithSubConditions("nebenniere", "⚡", "Nebennierenerkrankungen", "Adrenal Diseases", [
        { key: "nebenniereninsuffizienz", labelDe: "Nebenniereninsuffizienz (Morbus Addison)", labelEn: "Adrenal Insufficiency" },
        { key: "cushingSyndrom", labelDe: "Cushing-Syndrom", labelEn: "Cushing's Syndrome" },
        { key: "phaeochromozytom", labelDe: "Phäochromozytom", labelEn: "Pheochromocytoma" },
        { key: "nebennierenerschoepfung", labelDe: "Nebennierenerschöpfung", labelEn: "Adrenal Fatigue" },
      ])}

      {renderCollapsibleWithSubConditions("diabetes", "🩸", "Diabetes & Stoffwechsel", "Diabetes & Metabolism", [
        { key: "diabetesTyp1", labelDe: "Diabetes Typ 1", labelEn: "Type 1 Diabetes" },
        { key: "diabetesTyp2", labelDe: "Diabetes Typ 2", labelEn: "Type 2 Diabetes" },
        { key: "prediabetes", labelDe: "Prädiabetes / gestörte Glukosetoleranz", labelEn: "Prediabetes" },
        { key: "insulinresistenz", labelDe: "Insulinresistenz", labelEn: "Insulin Resistance" },
      ])}

      <div className="border rounded-lg p-4 bg-muted/30">
        <Label className="text-base font-medium">
          {language === "de" ? "Sonstige hormonelle Erkrankungen" : "Other hormonal conditions"}
        </Label>
        <Textarea
          placeholder={language === "de" ? "Bitte beschreiben Sie weitere Erkrankungen..." : "Please describe other conditions..."}
          value={hormonData?.sonstige || ""}
          onChange={(e) => updateFormData("hormongesundheit", { ...hormonData, sonstige: e.target.value })}
          className="mt-2"
          rows={2}
        />
      </div>
    </div>
  );
};

export default HormoneSection;
