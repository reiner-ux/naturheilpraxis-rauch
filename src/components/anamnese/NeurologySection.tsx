import { useState } from "react";
import { Checkbox } from "@/components/ui/checkbox";
import { Label } from "@/components/ui/label";
import { Textarea } from "@/components/ui/textarea";
import { useLanguage } from "@/contexts/LanguageContext";
import { AnamneseFormData } from "@/lib/anamneseFormData";
import { Collapsible, CollapsibleContent, CollapsibleTrigger } from "@/components/ui/collapsible";
import { Button } from "@/components/ui/button";
import { ChevronDown } from "lucide-react";
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "@/components/ui/select";
import SubConditionList from "./shared/SubConditionList";
import TemporalStatusSelect from "./shared/TemporalStatusSelect";

interface NeurologySectionProps {
  formData: AnamneseFormData;
  updateFormData: (field: string, value: any) => void;
}

const NeurologySection = ({ formData, updateFormData }: NeurologySectionProps) => {
  const { language } = useLanguage();
  const [expandedSections, setExpandedSections] = useState<Record<string, boolean>>({});

  const birthYear = formData.geburtsdatum ? new Date(formData.geburtsdatum).getFullYear() : undefined;
  const kopfData = (formData.kopfErkrankungen || {}) as any;
  const schlafData = (formData.schlafSymptome || {}) as any;

  const setSectionOpen = (section: string, open: boolean) => {
    setExpandedSections(prev => ({ ...prev, [section]: open }));
  };

  const handleSubItemChange = (section: string, parentKey: string, subKey: string, subField: string, value: any) => {
    const current = (formData as any)[section] || {};
    const parent = current[parentKey] || {};
    const subItem = parent[subKey];
    const currentSub = (typeof subItem === 'boolean')
      ? { ja: subItem, seit: "", status: "", bisJahr: "" }
      : { seit: "", status: "", bisJahr: "", ...(subItem || {}) };
    updateFormData(section, {
      ...current,
      [parentKey]: { ...parent, [subKey]: { ...currentSub, [subField]: value } }
    });
  };

  const updateSectionField = (section: string, field: string, value: any) => {
    const current = (formData as any)[section] || {};
    updateFormData(section, { ...current, [field]: value });
  };

  const parseYearMonth = (raw: string) => {
    if (!raw) return { year: "", month: "" };
    const m = raw.match(/^(\d{4})(?:-(\d{2}))?$/);
    if (!m) return { year: "", month: "" };
    return { year: m[1] ?? "", month: m[2] ?? "" };
  };

  const handleSchlafSubItemChange = (subKey: string, subField: string, value: any) => {
    const current = schlafData || {};
    const subItem = current[subKey] || {};
    updateFormData("schlafSymptome", {
      ...current,
      [subKey]: { ...subItem, [subField]: value }
    });
  };

  const setSchlafYearMonth = (subKey: string, timeKey: string, next: { year?: string; month?: string }) => {
    const current = schlafData?.[subKey] || {};
    const raw = String(current[timeKey] || "");
    const parsed = parseYearMonth(raw);
    const year = (next.year ?? parsed.year).slice(0, 4);
    const month = (next.month ?? parsed.month).slice(0, 2);
    const combined = month ? `${year}-${month}` : year;
    handleSchlafSubItemChange(subKey, timeKey, combined);
  };

  const renderCollapsibleSection = (
    sectionKey: string,
    emoji: string,
    labelDe: string,
    labelEn: string,
    parentKey: string,
    items: { key: string; labelDe: string; labelEn: string }[]
  ) => (
    <Collapsible open={!!expandedSections[sectionKey]} onOpenChange={(open) => setSectionOpen(sectionKey, open)}>
      <CollapsibleTrigger asChild>
        <Button variant="ghost" className="w-full justify-between p-4 border rounded-lg">
          <span className="font-medium">{language === "de" ? `${emoji} ${labelDe}` : `${emoji} ${labelEn}`}</span>
          <ChevronDown className={`h-4 w-4 transition-transform ${expandedSections[sectionKey] ? 'rotate-180' : ''}`} />
        </Button>
      </CollapsibleTrigger>
      <CollapsibleContent className="pt-4">
        <SubConditionList
          items={items}
          parentData={kopfData[parentKey] || {}}
          onSubItemChange={(subKey, subField, value) => handleSubItemChange("kopfErkrankungen", parentKey, subKey, subField, value)}
          birthYear={birthYear}
        />
      </CollapsibleContent>
    </Collapsible>
  );

  const wakeUpHours = Array.from({ length: 7 }, (_, i) => ({
    value: String(i).padStart(2, '0'),
    label: `${String(i).padStart(2, '0')}:00`
  }));

  return (
    <div className="space-y-6">
      <p className="text-muted-foreground">
        {language === "de"
          ? "Bitte geben Sie an, ob Sie Erkrankungen des Kopfes, der Sinnesorgane oder des Nervensystems haben oder hatten:"
          : "Please indicate if you have or had any conditions of the head, senses, or nervous system:"}
      </p>

      {renderCollapsibleSection("augen", "👁️", "Augenerkrankungen", "Eye Diseases", "augenerkrankung", [
        { key: "netzhaut", labelDe: "Netzhautablösung", labelEn: "Retinal Detachment" },
        { key: "grauerStar", labelDe: "Grauer Star", labelEn: "Cataracts" },
        { key: "gruenerStar", labelDe: "Grüner Star (Glaukom)", labelEn: "Glaucoma" },
        { key: "makula", labelDe: "Makuladegeneration", labelEn: "Macular Degeneration" },
        { key: "bindehautentzuendung", labelDe: "Bindehautentzündung", labelEn: "Conjunctivitis" },
        { key: "hornhautentzuendung", labelDe: "Hornhautentzündung", labelEn: "Keratitis" },
        { key: "iritis", labelDe: "Regenbogenhautentzündung", labelEn: "Iritis" },
        { key: "sehnerventzuendung", labelDe: "Sehnervenentzündung", labelEn: "Optic Neuritis" },
        { key: "trockeneAugen", labelDe: "Trockene Augen", labelEn: "Dry Eyes" },
        { key: "sehstoerung", labelDe: "Sehstörung", labelEn: "Vision Impairment" },
      ])}

      {renderCollapsibleSection("kopfschmerzen", "🤕", "Kopfschmerzen", "Headaches", "kopfschmerzen", [
        { key: "migraene", labelDe: "Migräne", labelEn: "Migraine" },
        { key: "spannungskopfschmerz", labelDe: "Spannungskopfschmerz", labelEn: "Tension Headache" },
        { key: "clusterkopfschmerz", labelDe: "Clusterkopfschmerz", labelEn: "Cluster Headache" },
        { key: "medikamenteninduziert", labelDe: "Medikamenteninduziert", labelEn: "Medication-induced" },
        { key: "rechts", labelDe: "Rechtsseitig", labelEn: "Right side" },
        { key: "links", labelDe: "Linksseitig", labelEn: "Left side" },
        { key: "hinterkopf", labelDe: "Hinterkopf", labelEn: "Back of head" },
        { key: "stirn", labelDe: "Stirn", labelEn: "Forehead" },
      ])}

      {renderCollapsibleSection("schwindel", "🌀", "Schwindel", "Dizziness", "schwindel", [
        { key: "lagerung", labelDe: "Lagerungsschwindel", labelEn: "Positional vertigo" },
        { key: "dreh", labelDe: "Drehschwindel", labelEn: "Rotational vertigo" },
        { key: "schwank", labelDe: "Schwankschwindel", labelEn: "Swaying vertigo" },
        { key: "vestibularisausfall", labelDe: "Vestibularisausfall", labelEn: "Vestibular failure" },
        { key: "phobischerSchwankschwindel", labelDe: "Phobischer Schwankschwindel", labelEn: "Phobic postural vertigo" },
      ])}

      {renderCollapsibleSection("hoeren", "👂", "Hörprobleme & Ohrenerkrankungen", "Hearing & Ear Diseases", "ohrenerkrankung", [
        { key: "tinnitus", labelDe: "Tinnitus", labelEn: "Tinnitus" },
        { key: "hoersturz", labelDe: "Hörsturz", labelEn: "Sudden Hearing Loss" },
        { key: "mittelohrentzuendung", labelDe: "Mittelohrentzündung", labelEn: "Otitis Media" },
        { key: "morbusMeniere", labelDe: "Morbus Menière", labelEn: "Meniere's Disease" },
        { key: "otosklerose", labelDe: "Otosklerose", labelEn: "Otosclerosis" },
        { key: "gehoergangentzuendung", labelDe: "Gehörgangentzündung", labelEn: "Otitis Externa" },
        { key: "trommelfell", labelDe: "Trommelfellerkrankung", labelEn: "Eardrum Disease" },
      ])}

      {renderCollapsibleSection("neuralgien", "⚡", "Neuralgien", "Neuralgias", "neuralgien", [
        { key: "trigeminus", labelDe: "Trigeminusneuralgie", labelEn: "Trigeminal Neuralgia" },
        { key: "glossopharyngeus", labelDe: "Glossopharyngeusneuralgie", labelEn: "Glossopharyngeal Neuralgia" },
        { key: "occipitalis", labelDe: "Okzipitalisneuralgie", labelEn: "Occipital Neuralgia" },
        { key: "postzoster", labelDe: "Postzosterneuralgie", labelEn: "Postherpetic Neuralgia" },
        { key: "atypischerGesichtsschmerz", labelDe: "Atypischer Gesichtsschmerz", labelEn: "Atypical Facial Pain" },
      ])}

      {/* Weitere: Sinusitis, Mandelentzündung */}
      <div className="grid gap-4 mt-2">
        <SubConditionList
          items={[
            { key: "sinusitis", labelDe: "Nasennebenhöhlenentzündung (Sinusitis)", labelEn: "Sinusitis" },
            { key: "mandelentzuendung", labelDe: "Mandelentzündung", labelEn: "Tonsillitis" },
          ]}
          parentData={kopfData}
          onSubItemChange={(subKey, subField, value) => {
            const current = kopfData;
            const subItem = current[subKey];
            const currentSub = (typeof subItem === 'boolean')
              ? { ja: subItem, seit: "", status: "", bisJahr: "" }
              : { seit: "", status: "", bisJahr: "", ...(subItem || {}) };
            updateFormData("kopfErkrankungen", {
              ...current,
              [subKey]: { ...currentSub, [subField]: value }
            });
          }}
          birthYear={birthYear}
        />
      </div>

      {/* Schlaf & Psyche */}
      <h4 className="font-semibold mt-8">{language === "de" ? "Schlaf & Psyche" : "Sleep & Mental Health"}</h4>

      {/* Schlafstörungen - special handling */}
      <div className="border rounded-lg p-4">
        <div className="flex items-center gap-2 mb-3">
          <Checkbox
            checked={Boolean(schlafData?.schlafstörung?.ja)}
            onCheckedChange={(checked) => handleSchlafSubItemChange("schlafstörung", "ja", !!checked)}
          />
          <Label className="font-medium">{language === "de" ? "Schlafstörungen" : "Sleep Disorders"}</Label>
        </div>
        {schlafData?.schlafstörung?.ja && (
          <div className="ml-6 space-y-4">
            <div className="space-y-2">
              <Label className="text-sm text-muted-foreground">
                {language === "de" ? "Art der Schlafstörung:" : "Type of sleep disorder:"}
              </Label>
              <div className="space-y-2">
                {[
                  { key: "einschlaf", labelDe: "Einschlafstörung", labelEn: "Difficulty falling asleep" },
                  { key: "durchschlaf", labelDe: "Durchschlafstörung", labelEn: "Difficulty staying asleep" },
                  { key: "einUndDurchschlaf", labelDe: "Ein- und Durchschlafstörung", labelEn: "Both falling and staying asleep" },
                ].map(type => (
                  <div key={type.key}>
                    <div className="flex items-center gap-2">
                      <Checkbox
                        checked={Boolean(schlafData?.schlafstörung?.[type.key])}
                        onCheckedChange={(checked) => handleSchlafSubItemChange("schlafstörung", type.key, !!checked)}
                      />
                      <Label className="font-normal text-sm">{language === "de" ? type.labelDe : type.labelEn}</Label>
                    </div>
                    {(type.key === "durchschlaf" || type.key === "einUndDurchschlaf") && schlafData?.schlafstörung?.[type.key] && (
                      <div className="ml-6 mt-2 p-3 bg-muted/30 rounded-md">
                        <Label className="text-xs text-muted-foreground mb-1 block">
                          {language === "de" ? "Wann wachen Sie auf? (Zeitfenster 00:00–06:00)" : "When do you wake up? (00:00–06:00)"}
                        </Label>
                        <Select
                          value={schlafData?.schlafstörung?.aufwachZeit || ""}
                          onValueChange={(v) => handleSchlafSubItemChange("schlafstörung", "aufwachZeit", v)}
                        >
                          <SelectTrigger className="w-[120px]">
                            <SelectValue placeholder={language === "de" ? "Uhrzeit" : "Time"} />
                          </SelectTrigger>
                          <SelectContent>
                            {wakeUpHours.map(h => (
                              <SelectItem key={h.value} value={h.value}>{h.label}</SelectItem>
                            ))}
                          </SelectContent>
                        </Select>
                      </div>
                    )}
                  </div>
                ))}
              </div>
            </div>
            <TemporalStatusSelect
              prefix="schlafstörung"
              seitYear={parseYearMonth(schlafData?.schlafstörung?.seit || "").year}
              seitMonth={parseYearMonth(schlafData?.schlafstörung?.seit || "").month}
              status={schlafData?.schlafstörung?.status || ""}
              bisYear={parseYearMonth(schlafData?.schlafstörung?.bisJahr || "").year}
              bisMonth={parseYearMonth(schlafData?.schlafstörung?.bisJahr || "").month}
              onSeitYearChange={(v) => setSchlafYearMonth("schlafstörung", "seit", { year: v })}
              onSeitMonthChange={(v) => setSchlafYearMonth("schlafstörung", "seit", { month: v })}
              onStatusChange={(v) => handleSchlafSubItemChange("schlafstörung", "status", v)}
              onBisYearChange={(v) => setSchlafYearMonth("schlafstörung", "bisJahr", { year: v })}
              onBisMonthChange={(v) => setSchlafYearMonth("schlafstörung", "bisJahr", { month: v })}
              birthYear={birthYear}
            />
          </div>
        )}
      </div>

      {/* Other Schlaf & Psyche items */}
      <div className="grid gap-4">
        {[
          { key: "muedigkeit", labelDe: "Müdigkeit/Erschöpfung", labelEn: "Fatigue/Exhaustion" },
          { key: "konzentrationsstörung", labelDe: "Konzentrationsstörung", labelEn: "Concentration Problems" },
          { key: "angstzustaende", labelDe: "Angstzustände", labelEn: "Anxiety" },
          { key: "depression", labelDe: "Depression", labelEn: "Depression" },
          { key: "vergesslichkeit", labelDe: "Vergesslichkeit", labelEn: "Forgetfulness" },
          { key: "stress", labelDe: "Stress", labelEn: "Stress" },
        ].map(item => {
          const fieldData = schlafData?.[item.key] || {};
          const isChecked = Boolean(fieldData?.ja);
          const seitParsed = parseYearMonth(fieldData?.seit || "");
          const bisParsed = parseYearMonth(fieldData?.bisJahr || "");

          return (
            <div key={item.key} className="border rounded-lg p-4">
              <div className="flex items-start gap-3">
                <Checkbox
                  checked={isChecked}
                  onCheckedChange={(checked) => handleSchlafSubItemChange(item.key, "ja", !!checked)}
                />
                <div className="space-y-2 flex-1">
                  <Label>{language === "de" ? item.labelDe : item.labelEn}</Label>
                  {isChecked && (
                    <div className="mt-2">
                      <TemporalStatusSelect
                        prefix={`schlaf-${item.key}`}
                        seitYear={seitParsed.year}
                        seitMonth={seitParsed.month}
                        status={fieldData?.status || ""}
                        bisYear={bisParsed.year}
                        bisMonth={bisParsed.month}
                        onSeitYearChange={(v) => setSchlafYearMonth(item.key, "seit", { year: v })}
                        onSeitMonthChange={(v) => setSchlafYearMonth(item.key, "seit", { month: v })}
                        onStatusChange={(v) => handleSchlafSubItemChange(item.key, "status", v)}
                        onBisYearChange={(v) => setSchlafYearMonth(item.key, "bisJahr", { year: v })}
                        onBisMonthChange={(v) => setSchlafYearMonth(item.key, "bisJahr", { month: v })}
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
          value={kopfData?.sonstige || ""}
          onChange={(e) => updateSectionField("kopfErkrankungen", "sonstige", e.target.value)}
          className="mt-2"
          rows={2}
        />
      </div>
    </div>
  );
};

export default NeurologySection;
