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

interface NeurologySectionProps {
  formData: AnamneseFormData;
  updateFormData: (field: string, value: any) => void;
}

const NeurologySection = ({ formData, updateFormData }: NeurologySectionProps) => {
  const { language } = useLanguage();
  const [expandedSections, setExpandedSections] = useState<Record<string, boolean>>({
    augen: false,
    kopfschmerzen: false,
    schwindel: false,
    hoeren: false,
    neuralgien: false,
    geruch: false,
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
    const timeValue = String(fieldData?.seit || fieldData?.jahr || "");
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
                    onYearChange={(value) => setYearMonthCombined(section, item.key, "seit", { year: value })}
                    onMonthChange={(value) => setYearMonthCombined(section, item.key, "seit", { month: value })}
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
          ? "Bitte geben Sie an, ob Sie Erkrankungen des Kopfes, der Sinnesorgane oder des Nervensystems haben oder hatten:"
          : "Please indicate if you have or had any conditions of the head, senses, or nervous system:"}
      </p>

      {/* Augenerkrankungen */}
      <Collapsible
        open={expandedSections.augen}
        onOpenChange={(open) => {
          setSectionOpen('augen', open);
          if (open) updateNestedField('kopfErkrankungen', 'augenerkrankung', 'ja', true);
        }}
      >
        <CollapsibleTrigger asChild>
          <Button variant="ghost" className="w-full justify-between p-4 border rounded-lg">
            <span className="font-medium">{language === "de" ? "👁️ Augenerkrankungen" : "👁️ Eye Diseases"}</span>
            <ChevronDown className={`h-4 w-4 transition-transform ${expandedSections.augen ? 'rotate-180' : ''}`} />
          </Button>
        </CollapsibleTrigger>
        <CollapsibleContent className="space-y-4 pt-4">
          {renderConditionItem("kopfErkrankungen", 
            { key: "augenerkrankung", labelDe: "Augenerkrankungen", labelEn: "Eye Diseases" },
            [
              { key: "netzhaut", labelDe: "Netzhautablösung", labelEn: "Retinal Detachment" },
              { key: "grauerStar", labelDe: "Grauer Star", labelEn: "Cataracts" },
              { key: "gruenerStar", labelDe: "Grüner Star (Glaukom)", labelEn: "Glaucoma" },
              { key: "makula", labelDe: "Makuladegeneration", labelEn: "Macular Degeneration" },
              { key: "trockeneAugen", labelDe: "Trockene Augen", labelEn: "Dry Eyes" },
              { key: "sehstoerung", labelDe: "Sehstörung", labelEn: "Vision Impairment" },
            ]
          )}
        </CollapsibleContent>
      </Collapsible>

      {/* Kopfschmerzen */}
      <Collapsible
        open={expandedSections.kopfschmerzen}
        onOpenChange={(open) => {
          setSectionOpen('kopfschmerzen', open);
          if (open) updateNestedField('kopfErkrankungen', 'kopfschmerzen', 'ja', true);
        }}
      >
        <CollapsibleTrigger asChild>
          <Button variant="ghost" className="w-full justify-between p-4 border rounded-lg">
            <span className="font-medium">{language === "de" ? "🤕 Kopfschmerzen" : "🤕 Headaches"}</span>
            <ChevronDown className={`h-4 w-4 transition-transform ${expandedSections.kopfschmerzen ? 'rotate-180' : ''}`} />
          </Button>
        </CollapsibleTrigger>
        <CollapsibleContent className="space-y-4 pt-4">
          {renderConditionItem("kopfErkrankungen", 
            { key: "kopfschmerzen", labelDe: "Kopfschmerzen", labelEn: "Headaches" },
            [
              { key: "migraene", labelDe: "Migräne", labelEn: "Migraine" },
              { key: "spannungskopfschmerz", labelDe: "Spannungskopfschmerz", labelEn: "Tension headache" },
              { key: "clusterkopfschmerz", labelDe: "Clusterkopfschmerz", labelEn: "Cluster headache" },
              { key: "rechts", labelDe: "rechtsseitig", labelEn: "right side" },
              { key: "links", labelDe: "linksseitig", labelEn: "left side" },
            ]
          )}
        </CollapsibleContent>
      </Collapsible>

      {/* Schwindel */}
      <Collapsible
        open={expandedSections.schwindel}
        onOpenChange={(open) => {
          setSectionOpen('schwindel', open);
          if (open) updateNestedField('kopfErkrankungen', 'schwindel', 'ja', true);
        }}
      >
        <CollapsibleTrigger asChild>
          <Button variant="ghost" className="w-full justify-between p-4 border rounded-lg">
            <span className="font-medium">{language === "de" ? "🌀 Schwindel" : "🌀 Dizziness"}</span>
            <ChevronDown className={`h-4 w-4 transition-transform ${expandedSections.schwindel ? 'rotate-180' : ''}`} />
          </Button>
        </CollapsibleTrigger>
        <CollapsibleContent className="space-y-4 pt-4">
          {renderConditionItem("kopfErkrankungen", 
            { key: "schwindel", labelDe: "Schwindel", labelEn: "Dizziness" },
            [
              { key: "lagerung", labelDe: "Lagerungsschwindel", labelEn: "Positional vertigo" },
              { key: "dreh", labelDe: "Drehschwindel", labelEn: "Rotational vertigo" },
              { key: "schwank", labelDe: "Schwankschwindel", labelEn: "Swaying vertigo" },
            ]
          )}
        </CollapsibleContent>
      </Collapsible>

      {/* Hörprobleme */}
      <Collapsible open={expandedSections.hoeren} onOpenChange={(open) => setSectionOpen('hoeren', open)}>
        <CollapsibleTrigger asChild>
          <Button variant="ghost" className="w-full justify-between p-4 border rounded-lg">
            <span className="font-medium">{language === "de" ? "👂 Hörprobleme" : "👂 Hearing Problems"}</span>
            <ChevronDown className={`h-4 w-4 transition-transform ${expandedSections.hoeren ? 'rotate-180' : ''}`} />
          </Button>
        </CollapsibleTrigger>
        <CollapsibleContent className="space-y-4 pt-4">
          {renderConditionItem("kopfErkrankungen", 
            { key: "schwerhoerig", labelDe: "Schwerhörigkeit", labelEn: "Hearing Loss" },
            [
              { key: "links", labelDe: "links", labelEn: "left" },
              { key: "rechts", labelDe: "rechts", labelEn: "right" },
              { key: "beidseitig", labelDe: "beidseitig", labelEn: "both sides" },
            ]
          )}
          {renderConditionItem("kopfErkrankungen", 
            { key: "ohrenerkrankung", labelDe: "Ohrerkrankungen", labelEn: "Ear Diseases" },
            [
              { key: "tinnitus", labelDe: "Tinnitus", labelEn: "Tinnitus" },
              { key: "hoersturz", labelDe: "Hörsturz", labelEn: "Sudden hearing loss" },
              { key: "morbusMeniere", labelDe: "Morbus Menière", labelEn: "Meniere's disease" },
            ]
          )}
        </CollapsibleContent>
      </Collapsible>

      {/* Neuralgien */}
      <Collapsible
        open={expandedSections.neuralgien}
        onOpenChange={(open) => {
          setSectionOpen('neuralgien', open);
          if (open) updateNestedField('kopfErkrankungen', 'neuralgien', 'ja', true);
        }}
      >
        <CollapsibleTrigger asChild>
          <Button variant="ghost" className="w-full justify-between p-4 border rounded-lg">
            <span className="font-medium">{language === "de" ? "⚡ Neuralgien" : "⚡ Neuralgias"}</span>
            <ChevronDown className={`h-4 w-4 transition-transform ${expandedSections.neuralgien ? 'rotate-180' : ''}`} />
          </Button>
        </CollapsibleTrigger>
        <CollapsibleContent className="space-y-4 pt-4">
          {renderConditionItem("kopfErkrankungen", 
            { key: "neuralgien", labelDe: "Neuralgien", labelEn: "Neuralgias" },
            [
              { key: "trigeminus", labelDe: "Trigeminusneuralgie", labelEn: "Trigeminal neuralgia" },
              { key: "postzoster", labelDe: "Postzosterneuralgie", labelEn: "Postherpetic neuralgia" },
            ]
          )}
        </CollapsibleContent>
      </Collapsible>

      {/* Weitere Erkrankungen */}
      <div className="grid gap-4 mt-6">
        {renderConditionItem("kopfErkrankungen", 
          { key: "sinusitis", labelDe: "Nasennebenhöhlenentzündung (Sinusitis)", labelEn: "Sinusitis" },
          [
            { key: "chronisch", labelDe: "chronisch", labelEn: "chronic" },
            { key: "akut", labelDe: "akut", labelEn: "acute" },
          ]
        )}
        {renderConditionItem("kopfErkrankungen", 
          { key: "mandelentzuendung", labelDe: "Mandelentzündung", labelEn: "Tonsillitis" },
          []
        )}
      </div>

      {/* Schlaf & Psyche */}
      <h4 className="font-semibold mt-8">{language === "de" ? "Schlaf & Psyche" : "Sleep & Mental Health"}</h4>
      <div className="grid gap-4">
        {[
          { key: "schlafstörung", labelDe: "Schlafstörungen", labelEn: "Sleep Disorders" },
          { key: "muedigkeit", labelDe: "Müdigkeit/Erschöpfung", labelEn: "Fatigue/Exhaustion" },
          { key: "konzentrationsstörung", labelDe: "Konzentrationsstörung", labelEn: "Concentration Problems" },
          { key: "angstzustaende", labelDe: "Angstzustände", labelEn: "Anxiety" },
          { key: "depression", labelDe: "Depression", labelEn: "Depression" },
        ].map((item) => {
          const fieldData = (formData.schlafSymptome as any)?.[item.key];
          const isChecked = fieldData && typeof fieldData === 'object' && 'ja' in fieldData ? Boolean(fieldData.ja) : false;
          const timeValue = String(fieldData?.seit || "");
          const parsed = parseYearMonth(timeValue);

          return (
            <div key={item.key} className="border rounded-lg p-4">
              <div className="flex items-start gap-3">
                <Checkbox
                  checked={isChecked}
                  onCheckedChange={(checked) => updateNestedField("schlafSymptome", item.key, "ja", !!checked)}
                />
                <div className="space-y-2 flex-1">
                  <Label>{language === "de" ? item.labelDe : item.labelEn}</Label>
                  {isChecked && (
                    <div className="mt-2 max-w-xs">
                      <YearMonthSelect
                        yearValue={parsed.year}
                        monthValue={parsed.month}
                        onYearChange={(value) => setYearMonthCombined("schlafSymptome", item.key, "seit", { year: value })}
                        onMonthChange={(value) => setYearMonthCombined("schlafSymptome", item.key, "seit", { month: value })}
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
          {language === "de" ? "Sonstige Erkrankungen in diesem Bereich" : "Other conditions in this area"}
        </Label>
        <Textarea
          placeholder={language === "de" ? "Bitte beschreiben Sie weitere Erkrankungen..." : "Please describe other conditions..."}
          value={(formData.kopfErkrankungen as any)?.sonstige || ""}
          onChange={(e) => updateSectionField("kopfErkrankungen", "sonstige", e.target.value)}
          className="mt-2"
          rows={2}
        />
      </div>
    </div>
  );
};

export default NeurologySection;
