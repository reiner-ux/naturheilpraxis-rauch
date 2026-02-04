import { useState } from "react";
import { Checkbox } from "@/components/ui/checkbox";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { Textarea } from "@/components/ui/textarea";
import { useLanguage } from "@/contexts/LanguageContext";
import { AnamneseFormData } from "@/lib/anamneseFormData";
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs";
import { Brain, Heart, Wind, Droplets, Apple, Activity, Ear, FlaskConical } from "lucide-react";
import { Collapsible, CollapsibleContent, CollapsibleTrigger } from "@/components/ui/collapsible";
import { Button } from "@/components/ui/button";
import { ChevronDown } from "lucide-react";
import YearMonthSelect from "./shared/YearMonthSelect";

interface MedicalHistorySectionProps {
  formData: AnamneseFormData;
  updateFormData: (field: string, value: any) => void;
}

const MedicalHistorySection = ({ formData, updateFormData }: MedicalHistorySectionProps) => {
  const { language } = useLanguage();
  const [activeTab, setActiveTab] = useState("kopf");
  const [expandedSections, setExpandedSections] = useState<Record<string, boolean>>({
    augen: false,
    kopfschmerzen: false,
    schwindel: false,
    hoeren: false,
    neuralgien: false,
    geruch: false,
    schilddruese: false,
    hypophyse: false,
    nebenniere: false,
  });

  const setSectionOpen = (section: string, open: boolean) => {
    setExpandedSections((prev) => ({ ...prev, [section]: open }));
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

  const getNestedBoolean = (obj: any, key: string): boolean => {
    const value = obj?.[key];
    return typeof value === 'boolean' ? value : false;
  };

  const birthYear = formData.geburtsdatum ? new Date(formData.geburtsdatum).getFullYear() : undefined;

  const parseYearMonth = (raw: string): { year: string; month: string } => {
    if (!raw) return { year: "", month: "" };
    const m = raw.match(/^(\d{4})(?:-(\d{2}))?$/);
    if (!m) return { year: "", month: "" };
    return { year: m[1] ?? "", month: m[2] ?? "" };
  };

  const setYearMonthCombined = (section: string, field: string, timeKey: "jahr" | "seit", next: { year?: string; month?: string }) => {
    const sectionData = (formData as any)?.[section] || {};
    const fieldData = sectionData?.[field] || {};
    const current = parseYearMonth(String(fieldData?.[timeKey] ?? ""));
    const year = (next.year ?? current.year).slice(0, 4);
    const month = (next.month ?? current.month).slice(0, 2);
    const combined = month ? `${year}-${month}` : year;
    updateNestedField(section, field, timeKey, combined);
  };

  const tabs = [
    { id: "kopf", labelDe: "Kopf & Sinne", labelEn: "Head & Senses", icon: Brain },
    { id: "herz", labelDe: "Herz & Kreislauf", labelEn: "Heart & Circulation", icon: Heart },
    { id: "lunge", labelDe: "Lunge & Atmung", labelEn: "Lungs & Breathing", icon: Wind },
    { id: "magen", labelDe: "Magen & Darm", labelEn: "Stomach & Intestines", icon: Apple },
    { id: "leber", labelDe: "Leber & Galle", labelEn: "Liver & Gallbladder", icon: FlaskConical },
    { id: "niere", labelDe: "Niere & Blase", labelEn: "Kidney & Bladder", icon: Droplets },
    { id: "hormone", labelDe: "Hormone", labelEn: "Hormones", icon: Activity },
    { id: "gelenke", labelDe: "Wirbelsäule & Gelenke", labelEn: "Spine & Joints", icon: Activity },
  ];

  const renderConditionItem = (
    section: string,
    item: { key: string; labelDe: string; labelEn: string },
    subOptions?: { key: string; labelDe: string; labelEn: string }[],
    inputPlaceholderDe?: string,
    inputPlaceholderEn?: string
  ) => {
    const sectionData = formData[section as keyof AnamneseFormData] as any;
    const fieldData = sectionData?.[item.key];
    const isObject = fieldData && typeof fieldData === 'object';
    const isChecked = isObject && 'ja' in fieldData ? Boolean(fieldData.ja) : false;

    const timeKey: "jahr" | "seit" = isObject && 'seit' in fieldData ? "seit" : "jahr";
    const timeValue = isObject ? String(fieldData?.[timeKey] ?? "") : "";
    const parsedTime = parseYearMonth(timeValue);

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
                    yearValue={parsedTime.year}
                    monthValue={parsedTime.month}
                    onYearChange={(value) => setYearMonthCombined(section, item.key, timeKey, { year: value })}
                    onMonthChange={(value) => setYearMonthCombined(section, item.key, timeKey, { month: value })}
                    showMonth={true}
                    birthYear={birthYear}
                    placeholder={language === "de" ? (inputPlaceholderDe || "Jahr") : (inputPlaceholderEn || "Year")}
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
                {fieldData?.sonstige !== undefined && (
                  <Input
                    placeholder={language === "de" ? "Sonstiges (bitte beschreiben)" : "Other (please describe)"}
                    value={fieldData?.sonstige || ""}
                    onChange={(e) => updateNestedField(section, item.key, "sonstige", e.target.value)}
                    className="w-full"
                  />
                )}
              </div>
            )}
          </div>
        </div>
      </div>
    );
  };

  const renderSonstigesField = (section: string) => {
    const sectionData = formData[section as keyof AnamneseFormData] as any;
    return (
      <div className="border rounded-lg p-4 bg-muted/30">
        <Label className="text-base font-medium">
          {language === "de" ? "Sonstige Erkrankungen in diesem Bereich" : "Other conditions in this area"}
        </Label>
        <Textarea
          placeholder={language === "de" ? "Bitte beschreiben Sie weitere Erkrankungen, die hier nicht aufgeführt sind..." : "Please describe any other conditions not listed here..."}
          value={sectionData?.sonstige || ""}
          onChange={(e) => updateSectionField(section, "sonstige", e.target.value)}
          className="mt-2"
          rows={2}
        />
      </div>
    );
  };

  return (
    <div className="space-y-6">
      <p className="text-muted-foreground">
        {language === "de"
          ? "Bitte wählen Sie den Bereich aus, der für Ihre Beschwerden relevant ist:"
          : "Please select the area relevant to your complaints:"}
      </p>

      <Tabs value={activeTab} onValueChange={setActiveTab}>
        <TabsList className="flex flex-wrap h-auto gap-2 bg-transparent">
          {tabs.map((tab) => {
            const Icon = tab.icon;
            return (
              <TabsTrigger 
                key={tab.id} 
                value={tab.id}
                className="data-[state=active]:bg-primary data-[state=active]:text-primary-foreground gap-2"
              >
                <Icon className="w-4 h-4" />
                <span className="hidden sm:inline">{language === "de" ? tab.labelDe : tab.labelEn}</span>
              </TabsTrigger>
            );
          })}
        </TabsList>

        {/* Kopf & Sinne */}
        <TabsContent value="kopf" className="space-y-6 mt-6">
          <h4 className="font-semibold">{language === "de" ? "Kopf, Sinne & Nervensystem" : "Head, Senses & Nervous System"}</h4>
          
          {/* Augenerkrankungen */}
          <Collapsible
            open={!!expandedSections.augen}
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
                  { key: "bindehautentzuendung", labelDe: "Bindehautentzündung", labelEn: "Conjunctivitis" },
                  { key: "hornhautentzuendung", labelDe: "Hornhautentzündung", labelEn: "Keratitis" },
                  { key: "iritis", labelDe: "Regenbogenhautentzündung", labelEn: "Iritis" },
                  { key: "sehnerventzuendung", labelDe: "Sehnervenentzündung", labelEn: "Optic Neuritis" },
                  { key: "trockeneAugen", labelDe: "Trockene Augen", labelEn: "Dry Eyes" },
                  { key: "sehstoerung", labelDe: "Sehstörung", labelEn: "Vision Impairment" },
                ]
              )}
            </CollapsibleContent>
          </Collapsible>

          {/* Kopfschmerzen */}
          <Collapsible
            open={!!expandedSections.kopfschmerzen}
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
                  { key: "rechts", labelDe: "rechts", labelEn: "right" },
                  { key: "links", labelDe: "links", labelEn: "left" },
                  { key: "hinterkopf", labelDe: "Hinterkopf", labelEn: "Back of head" },
                  { key: "stirn", labelDe: "Stirn", labelEn: "Forehead" },
                  { key: "migraene", labelDe: "Migräne", labelEn: "Migraine" },
                  { key: "spannungskopfschmerz", labelDe: "Spannungskopfschmerz", labelEn: "Tension headache" },
                  { key: "clusterkopfschmerz", labelDe: "Clusterkopfschmerz", labelEn: "Cluster headache" },
                  { key: "medikamenteninduziert", labelDe: "Medikamenteninduziert", labelEn: "Medication-induced" },
                ],
                "Seit wann?", "Since when?"
              )}
            </CollapsibleContent>
          </Collapsible>

          {/* Schwindel */}
          <Collapsible
            open={!!expandedSections.schwindel}
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
                  { key: "vestibularisausfall", labelDe: "Vestibularisausfall", labelEn: "Vestibular failure" },
                  { key: "phobischerSchwankschwindel", labelDe: "Phobischer Schwankschwindel", labelEn: "Phobic postural vertigo" },
                ],
                "Seit wann?", "Since when?"
              )}
            </CollapsibleContent>
          </Collapsible>

          {/* Hörprobleme */}
          <Collapsible open={!!expandedSections.hoeren} onOpenChange={(open) => setSectionOpen('hoeren', open)}>
            <CollapsibleTrigger asChild>
              <Button variant="ghost" className="w-full justify-between p-4 border rounded-lg">
                <span className="font-medium">{language === "de" ? "👂 Hörprobleme & Ohrerkrankungen" : "👂 Hearing Problems & Ear Diseases"}</span>
                <ChevronDown className={`h-4 w-4 transition-transform ${expandedSections.hoeren ? 'rotate-180' : ''}`} />
              </Button>
            </CollapsibleTrigger>
            <CollapsibleContent className="space-y-4 pt-4">
              <div className="grid gap-4">
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
                    { key: "mittelohrentzuendung", labelDe: "Mittelohrentzündung", labelEn: "Otitis media" },
                    { key: "morbusMeniere", labelDe: "Morbus Menière", labelEn: "Meniere's disease" },
                    { key: "otosklerose", labelDe: "Otosklerose", labelEn: "Otosclerosis" },
                    { key: "gehoergangentzuendung", labelDe: "Gehörgangentzündung", labelEn: "Otitis externa" },
                  ]
                )}
              </div>
            </CollapsibleContent>
          </Collapsible>

          {/* Neuralgien */}
          <Collapsible
            open={!!expandedSections.neuralgien}
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
                  { key: "glossopharyngeus", labelDe: "Glossopharyngeusneuralgie", labelEn: "Glossopharyngeal neuralgia" },
                  { key: "occipitalis", labelDe: "Okzipitalisneuralgie", labelEn: "Occipital neuralgia" },
                  { key: "postzoster", labelDe: "Postzosterneuralgie", labelEn: "Postherpetic neuralgia" },
                  { key: "atypischerGesichtsschmerz", labelDe: "Atypischer Gesichtsschmerz", labelEn: "Atypical facial pain" },
                ],
                "Seit wann?", "Since when?"
              )}
            </CollapsibleContent>
          </Collapsible>

          {/* Geruch & Geschmack */}
          <Collapsible
            open={!!expandedSections.geruch}
            onOpenChange={(open) => {
              setSectionOpen('geruch', open);
              // Geruch/Geschmack sind 2 Items: nichts auto-checken hier.
            }}
          >
            <CollapsibleTrigger asChild>
              <Button variant="ghost" className="w-full justify-between p-4 border rounded-lg">
                <span className="font-medium">{language === "de" ? "👃 Geruch & Geschmack" : "👃 Smell & Taste"}</span>
                <ChevronDown className={`h-4 w-4 transition-transform ${expandedSections.geruch ? 'rotate-180' : ''}`} />
              </Button>
            </CollapsibleTrigger>
            <CollapsibleContent className="space-y-4 pt-4">
              <div className="grid gap-4">
                {renderConditionItem("kopfErkrankungen", 
                  { key: "geruchsminderung", labelDe: "Geruchsverlust/-minderung", labelEn: "Loss/reduction of smell" },
                  [
                    { key: "vollverlust", labelDe: "Vollständiger Verlust", labelEn: "Complete loss" },
                    { key: "teilminderung", labelDe: "Teilweise Minderung", labelEn: "Partial reduction" },
                  ],
                  "Seit wann?", "Since when?"
                )}
                {renderConditionItem("kopfErkrankungen", 
                  { key: "geschmacksminderung", labelDe: "Geschmacksverlust/-minderung", labelEn: "Loss/reduction of taste" },
                  [],
                  "Seit wann?", "Since when?"
                )}
              </div>
            </CollapsibleContent>
          </Collapsible>

          {/* Weitere Erkrankungen */}
          <div className="grid gap-4">
            {renderConditionItem("kopfErkrankungen", 
              { key: "sinusitis", labelDe: "Sinusitis (Nasennebenhöhlenentzündung)", labelEn: "Sinusitis" },
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

          {/* Schlaf & Psychische Symptome */}
          <h4 className="font-semibold mt-8">{language === "de" ? "Schlaf & Psychische Symptome" : "Sleep & Psychological Symptoms"}</h4>
          <div className="grid gap-4">
            {[
              { key: "schlafstörung", labelDe: "Schlafstörungen", labelEn: "Sleep Disorders" },
              { key: "einschlafstörung", labelDe: "Einschlafstörung", labelEn: "Difficulty Falling Asleep" },
              { key: "durchschlafstörung", labelDe: "Durchschlafstörung", labelEn: "Difficulty Staying Asleep" },
              { key: "muedigkeit", labelDe: "Müdigkeit/Erschöpfung", labelEn: "Fatigue/Exhaustion" },
              { key: "konzentrationsstörung", labelDe: "Konzentrationsstörung", labelEn: "Concentration Problems" },
              { key: "vergesslichkeit", labelDe: "Vergesslichkeit", labelEn: "Forgetfulness" },
              { key: "angstzustaende", labelDe: "Angstzustände/Panikstörung", labelEn: "Anxiety/Panic Disorder" },
              { key: "stress", labelDe: "Stress (Arbeit/Freizeit)", labelEn: "Stress (Work/Leisure)" },
            ].map((item) => (
              <div key={item.key} className="border rounded-lg p-4">
                <div className="flex items-start gap-3">
                  <Checkbox
                    checked={(formData.schlafSymptome as any)?.[item.key]?.ja || false}
                    onCheckedChange={(checked) => updateNestedField("schlafSymptome", item.key, "ja", !!checked)}
                  />
                  <div className="space-y-2 flex-1">
                    <Label>{language === "de" ? item.labelDe : item.labelEn}</Label>
                    {(formData.schlafSymptome as any)?.[item.key]?.ja && (
                      <div className="mt-2 max-w-xs">
                        {(() => {
                          const raw = String((formData.schlafSymptome as any)?.[item.key]?.seit || "");
                          const parsed = parseYearMonth(raw);
                          return (
                            <YearMonthSelect
                              yearValue={parsed.year}
                              monthValue={parsed.month}
                              onYearChange={(value) => setYearMonthCombined("schlafSymptome", item.key, "seit", { year: value })}
                              onMonthChange={(value) => setYearMonthCombined("schlafSymptome", item.key, "seit", { month: value })}
                              showMonth={true}
                              birthYear={birthYear}
                            />
                          );
                        })()}
                      </div>
                    )}
                  </div>
                </div>
              </div>
            ))}
          </div>
        </TabsContent>

        {/* Herz & Kreislauf */}
        <TabsContent value="herz" className="space-y-6 mt-6">
          <h4 className="font-semibold">{language === "de" ? "Herz & Kreislauf" : "Heart & Circulation"}</h4>
          <div className="grid gap-4">
            {[
              { key: "blutdruckHoch", labelDe: "Bluthochdruck", labelEn: "High Blood Pressure" },
              { key: "blutdruckNiedrig", labelDe: "Niedriger Blutdruck", labelEn: "Low Blood Pressure" },
              { key: "herzrhythmusstörung", labelDe: "Herzrhythmusstörung", labelEn: "Heart Rhythm Disorder" },
              { key: "herzschmerzen", labelDe: "Herzschmerzen/Angina pectoris", labelEn: "Heart Pain/Angina" },
              { key: "herzinfarkt", labelDe: "Herzinfarkt", labelEn: "Heart Attack" },
              { key: "herzschrittmacher", labelDe: "Herzschrittmacher", labelEn: "Pacemaker" },
              { key: "stent", labelDe: "Stent", labelEn: "Stent" },
              { key: "herzklappenfehler", labelDe: "Herzklappenfehler", labelEn: "Heart Valve Defect" },
              { key: "krampfadern", labelDe: "Krampfadern", labelEn: "Varicose Veins" },
              { key: "thrombose", labelDe: "Thrombose", labelEn: "Thrombosis" },
              { key: "oedeme", labelDe: "Geschwollene Beine/Ödeme", labelEn: "Swollen Legs/Edema" },
            ].map((item) => {
              const fieldData = (formData.herzKreislauf as any)?.[item.key];
              const isChecked = fieldData && typeof fieldData === 'object' && 'ja' in fieldData ? Boolean(fieldData.ja) : false;
              return (
                <div key={item.key} className="border rounded-lg p-4">
                  <div className="flex items-start gap-3">
                    <Checkbox
                      checked={isChecked}
                      onCheckedChange={(checked) => updateNestedField("herzKreislauf", item.key, "ja", !!checked)}
                    />
                    <div className="space-y-2 flex-1">
                      <Label>{language === "de" ? item.labelDe : item.labelEn}</Label>
                      {isChecked && (
                        <Input
                          placeholder={language === "de" ? "Jahr" : "Year"}
                          value={fieldData?.jahr || ""}
                          onChange={(e) => updateNestedField("herzKreislauf", item.key, "jahr", e.target.value)}
                          className="w-32 mt-2"
                        />
                      )}
                    </div>
                  </div>
                </div>
              );
            })}
          </div>
          {renderSonstigesField("herzKreislauf")}
        </TabsContent>

        {/* Lunge & Atmung */}
        <TabsContent value="lunge" className="space-y-6 mt-6">
          <h4 className="font-semibold">{language === "de" ? "Lunge & Atmung" : "Lungs & Breathing"}</h4>
          <div className="grid gap-4">
            {[
              { key: "asthma", labelDe: "Lungenasthma", labelEn: "Lung Asthma" },
              { key: "lungenentzuendung", labelDe: "Lungenentzündung", labelEn: "Pneumonia" },
              { key: "bronchitis", labelDe: "Bronchitis", labelEn: "Bronchitis" },
              { key: "copd", labelDe: "COPD", labelEn: "COPD" },
              { key: "lungenembolie", labelDe: "Lungenembolie", labelEn: "Pulmonary Embolism" },
              { key: "tuberkulose", labelDe: "Tuberkulose", labelEn: "Tuberculosis" },
              { key: "sarkoidose", labelDe: "Sarkoidose", labelEn: "Sarcoidosis" },
              { key: "husten", labelDe: "Husten", labelEn: "Cough" },
              { key: "atemnot", labelDe: "Atemnot (Dyspnoe)", labelEn: "Shortness of Breath" },
            ].map((item) => {
              const fieldData = (formData.lungeAtmung as any)?.[item.key];
              const isChecked = fieldData && typeof fieldData === 'object' && 'ja' in fieldData ? Boolean(fieldData.ja) : false;
              return (
                <div key={item.key} className="border rounded-lg p-4">
                  <div className="flex items-start gap-3">
                    <Checkbox
                      checked={isChecked}
                      onCheckedChange={(checked) => updateNestedField("lungeAtmung", item.key, "ja", !!checked)}
                    />
                    <div className="space-y-2 flex-1">
                      <Label>{language === "de" ? item.labelDe : item.labelEn}</Label>
                      {isChecked && (
                        <Input
                          placeholder={language === "de" ? "Jahr/Seit" : "Year/Since"}
                          value={fieldData?.jahr || fieldData?.seit || ""}
                          onChange={(e) => updateNestedField("lungeAtmung", item.key, "jahr", e.target.value)}
                          className="w-32 mt-2"
                        />
                      )}
                    </div>
                  </div>
                </div>
              );
            })}
          </div>
          {renderSonstigesField("lungeAtmung")}
        </TabsContent>

        {/* Magen & Darm */}
        <TabsContent value="magen" className="space-y-6 mt-6">
          <h4 className="font-semibold">{language === "de" ? "Magen & Darm" : "Stomach & Intestines"}</h4>
          <div className="grid gap-4">
            {[
              { key: "magengeschwuer", labelDe: "Magengeschwür", labelEn: "Stomach Ulcer" },
              { key: "sodbrennen", labelDe: "Sodbrennen/Magensäure", labelEn: "Heartburn/Acid Reflux" },
              { key: "uebelkeit", labelDe: "Übelkeit", labelEn: "Nausea" },
              { key: "verstopfung", labelDe: "Verstopfung", labelEn: "Constipation" },
              { key: "durchfall", labelDe: "Durchfall", labelEn: "Diarrhea" },
              { key: "blaehungen", labelDe: "Blähungen/Darmgase", labelEn: "Bloating/Flatulence" },
              { key: "bauchschmerzen", labelDe: "Bauchschmerzen/-krämpfe", labelEn: "Abdominal Pain/Cramps" },
              { key: "reizdarm", labelDe: "Reizdarmsyndrom", labelEn: "Irritable Bowel Syndrome" },
              { key: "morbusCrohn", labelDe: "Morbus Crohn", labelEn: "Crohn's Disease" },
              { key: "colitis", labelDe: "Colitis ulcerosa", labelEn: "Ulcerative Colitis" },
              { key: "zoeliakie", labelDe: "Zöliakie", labelEn: "Celiac Disease" },
            ].map((item) => {
              const fieldData = (formData.magenDarm as any)?.[item.key];
              const isChecked = fieldData && typeof fieldData === 'object' && 'ja' in fieldData ? Boolean(fieldData.ja) : false;
              return (
                <div key={item.key} className="border rounded-lg p-4">
                  <div className="flex items-start gap-3">
                    <Checkbox
                      checked={isChecked}
                      onCheckedChange={(checked) => updateNestedField("magenDarm", item.key, "ja", !!checked)}
                    />
                    <div className="space-y-2 flex-1">
                      <Label>{language === "de" ? item.labelDe : item.labelEn}</Label>
                      {isChecked && (
                        <Input
                          placeholder={language === "de" ? "Jahr/Seit" : "Year/Since"}
                          value={fieldData?.jahr || fieldData?.seit || ""}
                          onChange={(e) => updateNestedField("magenDarm", item.key, "jahr", e.target.value)}
                          className="w-32 mt-2"
                        />
                      )}
                    </div>
                  </div>
                </div>
              );
            })}
          </div>
          {renderSonstigesField("magenDarm")}
        </TabsContent>

        {/* Leber & Galle */}
        <TabsContent value="leber" className="space-y-6 mt-6">
          <h4 className="font-semibold">{language === "de" ? "Leber & Gallenblase" : "Liver & Gallbladder"}</h4>
          <div className="grid gap-4">
            {[
              { key: "lebererkrankung", labelDe: "Lebererkrankung", labelEn: "Liver Disease" },
              { key: "leberzirrhose", labelDe: "Leberzirrhose", labelEn: "Liver Cirrhosis" },
              { key: "leberkrebs", labelDe: "Leberkrebs", labelEn: "Liver Cancer" },
              { key: "gelbsucht", labelDe: "Gelbsucht", labelEn: "Jaundice" },
              { key: "gallensteine", labelDe: "Gallensteine", labelEn: "Gallstones" },
              { key: "gallenleiden", labelDe: "Gallenleiden", labelEn: "Gallbladder Disease" },
              { key: "gallenblasenentfernung", labelDe: "Gallenblasenentfernung", labelEn: "Cholecystectomy" },
              { key: "gallengangentzuendung", labelDe: "Gallengangentzündung", labelEn: "Cholangitis" },
            ].map((item) => {
              const fieldData = (formData.leberGalle as any)?.[item.key];
              const isChecked = fieldData && typeof fieldData === 'object' && 'ja' in fieldData ? Boolean(fieldData.ja) : false;
              return (
                <div key={item.key} className="border rounded-lg p-4">
                  <div className="flex items-start gap-3">
                    <Checkbox
                      checked={isChecked}
                      onCheckedChange={(checked) => updateNestedField("leberGalle", item.key, "ja", !!checked)}
                    />
                    <div className="space-y-2 flex-1">
                      <Label>{language === "de" ? item.labelDe : item.labelEn}</Label>
                      {isChecked && (
                        <Input
                          placeholder={language === "de" ? "Jahr" : "Year"}
                          value={fieldData?.jahr || ""}
                          onChange={(e) => updateNestedField("leberGalle", item.key, "jahr", e.target.value)}
                          className="w-32 mt-2"
                        />
                      )}
                    </div>
                  </div>
                </div>
              );
            })}
          </div>
          {renderSonstigesField("leberGalle")}
        </TabsContent>

        {/* Niere & Blase */}
        <TabsContent value="niere" className="space-y-6 mt-6">
          <h4 className="font-semibold">{language === "de" ? "Niere & Blase" : "Kidney & Bladder"}</h4>
          <div className="grid gap-4">
            {[
              { key: "nierenerkrankung", labelDe: "Nierenerkrankung", labelEn: "Kidney Disease" },
              { key: "blasenleiden", labelDe: "Blasenleiden", labelEn: "Bladder Condition" },
              { key: "nykturie", labelDe: "Nächtlicher Harndrang", labelEn: "Nocturia" },
              { key: "miktionsbeschwerden", labelDe: "Miktionsbeschwerden", labelEn: "Urination Problems" },
              { key: "inkontinenz", labelDe: "Harninkontinenz", labelEn: "Urinary Incontinence" },
              { key: "nierensteine", labelDe: "Nierensteine", labelEn: "Kidney Stones" },
            ].map((item) => {
              const fieldData = (formData.niereBlase as any)?.[item.key];
              const isChecked = fieldData && typeof fieldData === 'object' && 'ja' in fieldData ? Boolean(fieldData.ja) : false;
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
                        <Input
                          placeholder={language === "de" ? "Jahr/Seit" : "Year/Since"}
                          value={fieldData?.jahr || fieldData?.seit || ""}
                          onChange={(e) => updateNestedField("niereBlase", item.key, "jahr", e.target.value)}
                          className="w-32 mt-2"
                        />
                      )}
                    </div>
                  </div>
                </div>
              );
            })}
          </div>
          {renderSonstigesField("niereBlase")}
        </TabsContent>

        {/* Hormone */}
        <TabsContent value="hormone" className="space-y-6 mt-6">
          <h4 className="font-semibold">{language === "de" ? "Hormongesundheit" : "Hormonal Health"}</h4>
          
          {/* Schilddrüse */}
          <Collapsible open={!!expandedSections.schilddruese} onOpenChange={(open) => setSectionOpen('schilddruese', open)}>
            <CollapsibleTrigger asChild>
              <Button variant="ghost" className="w-full justify-between p-4 border rounded-lg">
                <span className="font-medium">{language === "de" ? "🦋 Schilddrüsenerkrankungen" : "🦋 Thyroid Diseases"}</span>
                <ChevronDown className={`h-4 w-4 transition-transform ${expandedSections.schilddruese ? 'rotate-180' : ''}`} />
              </Button>
            </CollapsibleTrigger>
            <CollapsibleContent className="space-y-4 pt-4">
              {renderConditionItem("hormongesundheit", 
                { key: "schilddruese", labelDe: "Schilddrüsenerkrankungen", labelEn: "Thyroid Diseases" },
                [
                  { key: "unterfunktion", labelDe: "Unterfunktion (Hypothyreose)", labelEn: "Hypothyroidism" },
                  { key: "ueberfunktion", labelDe: "Überfunktion (Hyperthyreose)", labelEn: "Hyperthyroidism" },
                  { key: "hashimoto", labelDe: "Hashimoto-Thyreoiditis", labelEn: "Hashimoto's Thyroiditis" },
                  { key: "basedow", labelDe: "Morbus Basedow", labelEn: "Graves' Disease" },
                  { key: "knoten", labelDe: "Schilddrüsenknoten", labelEn: "Thyroid Nodules" },
                  { key: "schilddruesenkrebs", labelDe: "Schilddrüsenkrebs", labelEn: "Thyroid Cancer" },
                  { key: "schilddruesenop", labelDe: "Schilddrüsen-OP", labelEn: "Thyroid Surgery" },
                  { key: "radiojodtherapie", labelDe: "Radiojodtherapie", labelEn: "Radioiodine Therapy" },
                ]
              )}
            </CollapsibleContent>
          </Collapsible>

          {/* Hypophyse */}
          <Collapsible open={!!expandedSections.hypophyse} onOpenChange={(open) => setSectionOpen('hypophyse', open)}>
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
          <Collapsible open={!!expandedSections.nebenniere} onOpenChange={(open) => setSectionOpen('nebenniere', open)}>
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

          {renderSonstigesField("hormongesundheit")}
        </TabsContent>

        {/* Wirbelsäule & Gelenke */}
        <TabsContent value="gelenke" className="space-y-6 mt-6">
          <h4 className="font-semibold">{language === "de" ? "Wirbelsäule & Gelenke" : "Spine & Joints"}</h4>
          <div className="grid gap-4">
            {[
              { key: "hws", labelDe: "HWS (Halswirbelsäule)", labelEn: "Cervical Spine" },
              { key: "bws", labelDe: "BWS (Brustwirbelsäule)", labelEn: "Thoracic Spine" },
              { key: "lws", labelDe: "LWS (Lendenwirbelsäule)", labelEn: "Lumbar Spine" },
              { key: "schulter", labelDe: "Schultergelenke", labelEn: "Shoulder Joints" },
              { key: "ellbogen", labelDe: "Ellbogengelenke", labelEn: "Elbow Joints" },
              { key: "handgelenk", labelDe: "Handgelenke", labelEn: "Wrist Joints" },
              { key: "huefte", labelDe: "Hüftgelenke", labelEn: "Hip Joints" },
              { key: "knie", labelDe: "Kniegelenke", labelEn: "Knee Joints" },
              { key: "fuss", labelDe: "Fußgelenke", labelEn: "Ankle Joints" },
              { key: "rheuma", labelDe: "Rheumatoide Arthritis", labelEn: "Rheumatoid Arthritis" },
            ].map((item) => {
              const fieldData = (formData.wirbelsaeuleGelenke as any)?.[item.key];
              const isChecked = fieldData && typeof fieldData === 'object' && 'ja' in fieldData ? Boolean(fieldData.ja) : false;
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
                        <div className="space-y-2 mt-2">
                          <Input
                            placeholder={language === "de" ? "Seit wann?" : "Since when?"}
                            value={fieldData?.seit || ""}
                            onChange={(e) => updateNestedField("wirbelsaeuleGelenke", item.key, "seit", e.target.value)}
                            className="w-48"
                          />
                          {["schulter", "ellbogen", "handgelenk", "huefte", "knie", "fuss"].includes(item.key) && (
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
            })}
          </div>
          {renderSonstigesField("wirbelsaeuleGelenke")}
        </TabsContent>
      </Tabs>
    </div>
  );
};

export default MedicalHistorySection;
