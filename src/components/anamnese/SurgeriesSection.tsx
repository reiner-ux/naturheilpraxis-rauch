import { useState, useMemo } from "react";
import { format, differenceInWeeks, parse, isValid } from "date-fns";
import { de, enUS } from "date-fns/locale";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { Textarea } from "@/components/ui/textarea";
import { Checkbox } from "@/components/ui/checkbox";
import { Button } from "@/components/ui/button";
import { Calendar } from "@/components/ui/calendar";
import { Popover, PopoverContent, PopoverTrigger } from "@/components/ui/popover";
import { useLanguage } from "@/contexts/LanguageContext";
import { AnamneseFormData } from "@/lib/anamneseFormData";
import { Separator } from "@/components/ui/separator";
import { Plus, Trash2, CalendarIcon, CheckCircle2, AlertTriangle } from "lucide-react";
import { cn } from "@/lib/utils";

interface SurgeriesSectionProps {
  formData: AnamneseFormData;
  updateFormData: (field: string, value: any) => void;
}

const SurgeriesSection = ({ formData, updateFormData }: SurgeriesSectionProps) => {
  const { language } = useLanguage();

  const updateUnfaelleOperationen = (field: string, value: any) => {
    updateFormData("unfaelleOperationen", {
      ...formData.unfaelleOperationen,
      [field]: value
    });
  };

  const updateNestedField = (parentField: string, field: string, value: any) => {
    updateFormData("unfaelleOperationen", {
      ...formData.unfaelleOperationen,
      [parentField]: {
        ...(formData.unfaelleOperationen[parentField as keyof typeof formData.unfaelleOperationen] as object),
        [field]: value
      }
    });
  };

  const addOperation = () => {
    const currentOps = formData.unfaelleOperationen?.operationen || [];
    updateUnfaelleOperationen("operationen", [...currentOps, { jahr: "", grund: "" }]);
  };

  const removeOperation = (index: number) => {
    const currentOps = formData.unfaelleOperationen?.operationen || [];
    updateUnfaelleOperationen("operationen", currentOps.filter((_, i) => i !== index));
  };

  const updateOperation = (index: number, field: string, value: string) => {
    const currentOps = formData.unfaelleOperationen?.operationen || [];
    const updated = currentOps.map((op, i) => 
      i === index ? { ...op, [field]: value } : op
    );
    updateUnfaelleOperationen("operationen", updated);
  };

  return (
    <div className="space-y-8">
      {/* Unfälle */}
      <div className="space-y-4">
        <h3 className="text-lg font-medium">
          {language === "de" ? "Unfälle" : "Accidents"}
        </h3>

        <div className="space-y-4">
          <div className="flex items-center space-x-2">
            <Checkbox
              id="unfall"
              checked={formData.unfaelleOperationen?.unfall?.ja || false}
              onCheckedChange={(checked) => updateNestedField("unfall", "ja", checked)}
            />
            <Label htmlFor="unfall">
              {language === "de" ? "Hatte einen Unfall" : "Had an accident"}
            </Label>
          </div>
          {formData.unfaelleOperationen?.unfall?.ja && (
            <div className="grid gap-4 md:grid-cols-2 pl-6">
              <Input
                placeholder={language === "de" ? "Jahr" : "Year"}
                value={formData.unfaelleOperationen?.unfall?.jahr || ""}
                onChange={(e) => updateNestedField("unfall", "jahr", e.target.value)}
              />
              <Input
                placeholder={language === "de" ? "Lokalisation/Art" : "Location/Type"}
                value={formData.unfaelleOperationen?.unfall?.lokalisation || ""}
                onChange={(e) => updateNestedField("unfall", "lokalisation", e.target.value)}
              />
            </div>
          )}
        </div>

        <div className="space-y-4">
          <div className="flex items-center space-x-2">
            <Checkbox
              id="knochenbruch"
              checked={formData.unfaelleOperationen?.knochenbruch?.ja || false}
              onCheckedChange={(checked) => updateNestedField("knochenbruch", "ja", checked)}
            />
            <Label htmlFor="knochenbruch">
              {language === "de" ? "Knochenbruch" : "Bone fracture"}
            </Label>
          </div>
          {formData.unfaelleOperationen?.knochenbruch?.ja && (
            <div className="grid gap-4 md:grid-cols-2 pl-6">
              <Input
                placeholder={language === "de" ? "Jahr" : "Year"}
                value={formData.unfaelleOperationen?.knochenbruch?.jahr || ""}
                onChange={(e) => updateNestedField("knochenbruch", "jahr", e.target.value)}
              />
              <Input
                placeholder={language === "de" ? "Welcher Knochen?" : "Which bone?"}
                value={formData.unfaelleOperationen?.knochenbruch?.welcher || ""}
                onChange={(e) => updateNestedField("knochenbruch", "welcher", e.target.value)}
              />
            </div>
          )}
        </div>

        <div className="space-y-4">
          <div className="flex items-center space-x-2">
            <Checkbox
              id="kopfverletzung"
              checked={formData.unfaelleOperationen?.kopfverletzung?.ja || false}
              onCheckedChange={(checked) => updateNestedField("kopfverletzung", "ja", checked)}
            />
            <Label htmlFor="kopfverletzung">
              {language === "de" ? "Kopfverletzung / Gehirnerschütterung" : "Head injury / Concussion"}
            </Label>
          </div>
          {formData.unfaelleOperationen?.kopfverletzung?.ja && (
            <div className="grid gap-4 md:grid-cols-2 pl-6">
              <Input
                placeholder={language === "de" ? "Jahr" : "Year"}
                value={formData.unfaelleOperationen?.kopfverletzung?.jahr || ""}
                onChange={(e) => updateNestedField("kopfverletzung", "jahr", e.target.value)}
              />
              <Input
                placeholder={language === "de" ? "Schweregrad" : "Severity"}
                value={formData.unfaelleOperationen?.kopfverletzung?.schweregrad || ""}
                onChange={(e) => updateNestedField("kopfverletzung", "schweregrad", e.target.value)}
              />
            </div>
          )}
        </div>
      </div>

      <Separator />

      {/* Operationen */}
      <div className="space-y-4">
        <div className="flex items-center justify-between">
          <h3 className="text-lg font-medium">
            {language === "de" ? "Operationen" : "Surgeries"}
          </h3>
          <Button type="button" variant="outline" size="sm" onClick={addOperation}>
            <Plus className="w-4 h-4 mr-2" />
            {language === "de" ? "Operation hinzufügen" : "Add surgery"}
          </Button>
        </div>

        {(formData.unfaelleOperationen?.operationen || []).length === 0 && (
          <p className="text-sm text-muted-foreground">
            {language === "de" 
              ? "Keine Operationen eingetragen. Klicken Sie auf 'Operation hinzufügen' um eine neue einzutragen."
              : "No surgeries recorded. Click 'Add surgery' to add one."}
          </p>
        )}

        {(formData.unfaelleOperationen?.operationen || []).map((op, index) => (
          <div key={index} className="flex gap-4 items-start p-4 bg-muted/30 rounded-lg">
            <div className="flex-1 grid gap-4 md:grid-cols-2">
              <Input
                placeholder={language === "de" ? "Jahr" : "Year"}
                value={op.jahr}
                onChange={(e) => updateOperation(index, "jahr", e.target.value)}
              />
              <Input
                placeholder={language === "de" ? "Grund / Art der Operation" : "Reason / Type of surgery"}
                value={op.grund}
                onChange={(e) => updateOperation(index, "grund", e.target.value)}
              />
            </div>
            <Button
              type="button"
              variant="ghost"
              size="icon"
              onClick={() => removeOperation(index)}
              className="text-destructive hover:text-destructive"
            >
              <Trash2 className="w-4 h-4" />
            </Button>
          </div>
        ))}
      </div>

      <Separator />

      {/* Krankenhausaufenthalt */}
      <div className="space-y-4">
        <h3 className="text-lg font-medium">
          {language === "de" ? "Krankenhausaufenthalte" : "Hospital Stays"}
        </h3>

        <div className="space-y-4">
          <div className="flex items-center space-x-2">
            <Checkbox
              id="krankenhausaufenthalt"
              checked={formData.unfaelleOperationen?.krankenhausaufenthalt?.ja || false}
              onCheckedChange={(checked) => updateNestedField("krankenhausaufenthalt", "ja", checked)}
            />
            <Label htmlFor="krankenhausaufenthalt">
              {language === "de" ? "Krankenhausaufenthalt (ohne OP)" : "Hospital stay (without surgery)"}
            </Label>
          </div>
          {formData.unfaelleOperationen?.krankenhausaufenthalt?.ja && (
            <div className="grid gap-4 md:grid-cols-2 pl-6">
              <Input
                placeholder={language === "de" ? "Jahr" : "Year"}
                value={formData.unfaelleOperationen?.krankenhausaufenthalt?.jahr || ""}
                onChange={(e) => updateNestedField("krankenhausaufenthalt", "jahr", e.target.value)}
              />
              <Input
                placeholder={language === "de" ? "Grund" : "Reason"}
                value={formData.unfaelleOperationen?.krankenhausaufenthalt?.grund || ""}
                onChange={(e) => updateNestedField("krankenhausaufenthalt", "grund", e.target.value)}
              />
            </div>
          )}
        </div>

        <div className="space-y-4">
          <div className="flex items-center space-x-2">
            <Checkbox
              id="kuraufenthalt"
              checked={formData.unfaelleOperationen?.kuraufenthalt?.ja || false}
              onCheckedChange={(checked) => updateNestedField("kuraufenthalt", "ja", checked)}
            />
            <Label htmlFor="kuraufenthalt">
              {language === "de" ? "Kur- / Reha-Aufenthalt" : "Rehabilitation stay"}
            </Label>
          </div>
          {formData.unfaelleOperationen?.kuraufenthalt?.ja && (
            <div className="grid gap-4 md:grid-cols-2 pl-6">
              <Input
                placeholder={language === "de" ? "Jahr" : "Year"}
                value={formData.unfaelleOperationen?.kuraufenthalt?.jahr || ""}
                onChange={(e) => updateNestedField("kuraufenthalt", "jahr", e.target.value)}
              />
              <Input
                placeholder={language === "de" ? "Art der Kur" : "Type of rehabilitation"}
                value={formData.unfaelleOperationen?.kuraufenthalt?.art || ""}
                onChange={(e) => updateNestedField("kuraufenthalt", "art", e.target.value)}
              />
            </div>
          )}
        </div>
      </div>

      <Separator />

      {/* Spezielle Behandlungen */}
      <div className="space-y-4">
        <h3 className="text-lg font-medium">
          {language === "de" ? "Spezielle Behandlungen" : "Special Treatments"}
        </h3>

        <div className="space-y-4">
          <div className="flex items-center space-x-2">
            <Checkbox
              id="bluttransfusion"
              checked={formData.unfaelleOperationen?.bluttransfusion?.ja || false}
              onCheckedChange={(checked) => updateNestedField("bluttransfusion", "ja", checked)}
            />
            <Label htmlFor="bluttransfusion">
              {language === "de" ? "Bluttransfusion erhalten" : "Received blood transfusion"}
            </Label>
          </div>
          {formData.unfaelleOperationen?.bluttransfusion?.ja && (
            <div className="grid gap-4 md:grid-cols-2 pl-6">
              <Input
                placeholder={language === "de" ? "Jahr" : "Year"}
                value={formData.unfaelleOperationen?.bluttransfusion?.jahr || ""}
                onChange={(e) => updateNestedField("bluttransfusion", "jahr", e.target.value)}
              />
              <Input
                placeholder={language === "de" ? "Grund" : "Reason"}
                value={formData.unfaelleOperationen?.bluttransfusion?.grund || ""}
                onChange={(e) => updateNestedField("bluttransfusion", "grund", e.target.value)}
              />
            </div>
          )}
        </div>

        <div className="space-y-4">
          <div className="flex items-center space-x-2">
            <Checkbox
              id="chemotherapie"
              checked={formData.unfaelleOperationen?.chemotherapie?.ja || false}
              onCheckedChange={(checked) => updateNestedField("chemotherapie", "ja", checked)}
            />
            <Label htmlFor="chemotherapie">
              {language === "de" ? "Chemotherapie" : "Chemotherapy"}
            </Label>
          </div>
          {formData.unfaelleOperationen?.chemotherapie?.ja && (
            <div className="grid gap-4 md:grid-cols-2 pl-6">
              <Input
                placeholder={language === "de" ? "Jahr" : "Year"}
                value={formData.unfaelleOperationen?.chemotherapie?.jahr || ""}
                onChange={(e) => updateNestedField("chemotherapie", "jahr", e.target.value)}
              />
              <Input
                placeholder={language === "de" ? "Art der Chemotherapie" : "Type of chemotherapy"}
                value={formData.unfaelleOperationen?.chemotherapie?.art || ""}
                onChange={(e) => updateNestedField("chemotherapie", "art", e.target.value)}
              />
            </div>
          )}
        </div>

        <div className="space-y-4">
          <div className="flex items-center space-x-2">
            <Checkbox
              id="strahlentherapie"
              checked={formData.unfaelleOperationen?.strahlentherapie?.ja || false}
              onCheckedChange={(checked) => updateNestedField("strahlentherapie", "ja", checked)}
            />
            <Label htmlFor="strahlentherapie">
              {language === "de" ? "Strahlentherapie" : "Radiation therapy"}
            </Label>
          </div>
          {formData.unfaelleOperationen?.strahlentherapie?.ja && (
            <Input
              className="max-w-md pl-6"
              placeholder={language === "de" ? "Bestrahlter Bereich" : "Irradiated area"}
              value={formData.unfaelleOperationen?.strahlentherapie?.bereich || ""}
              onChange={(e) => updateNestedField("strahlentherapie", "bereich", e.target.value)}
            />
          )}
        </div>

        {/* Nuklearmedizinische Untersuchungen Überschrift */}
        <div className="mt-6 mb-4">
          <h4 className="text-base font-medium text-muted-foreground flex items-center gap-2">
            ☢️ {language === "de" ? "Nuklearmedizinische Untersuchungen" : "Nuclear Medicine Examinations"}
          </h4>
          <p className="text-sm text-muted-foreground mt-1">
            {language === "de"
              ? "Diese Untersuchungen erfordern bestimmte Wartezeiten vor weiteren Behandlungen."
              : "These examinations require certain waiting periods before further treatments."}
          </p>
        </div>

        {/* Szintigraphie */}
        <div className="space-y-4">
          <div className="flex items-center space-x-2">
            <Checkbox
              id="szintigraphie"
              checked={formData.unfaelleOperationen?.szintigraphie?.ja || false}
              onCheckedChange={(checked) => updateNestedField("szintigraphie", "ja", checked)}
            />
            <Label htmlFor="szintigraphie">
              {language === "de" ? "Szintigraphie" : "Scintigraphy"}
            </Label>
          </div>
          <p className="text-sm text-muted-foreground pl-6">
            {language === "de" 
              ? "Nuklearmedizinische Untersuchung, häufig bei Schilddrüsendiagnostik und Tumorsuche eingesetzt."
              : "Nuclear medicine examination, commonly used for thyroid diagnostics and tumor detection."}
          </p>
          {formData.unfaelleOperationen?.szintigraphie?.ja && (
            <NuclearMedicineDetails
              formData={formData}
              updateNestedField={updateNestedField}
              language={language}
              fieldName="szintigraphie"
              requiredWeeks={6}
              nameDe="Szintigraphie"
              nameEn="Scintigraphy"
              placeholderDe="z.B. Schilddrüse, Tumorsuche"
              placeholderEn="e.g. thyroid, tumor detection"
            />
          )}
        </div>

        {/* PET-CT */}
        <div className="space-y-4">
          <div className="flex items-center space-x-2">
            <Checkbox
              id="petCt"
              checked={formData.unfaelleOperationen?.petCt?.ja || false}
              onCheckedChange={(checked) => updateNestedField("petCt", "ja", checked)}
            />
            <Label htmlFor="petCt">
              {language === "de" ? "PET-CT (Positronen-Emissions-Tomographie)" : "PET-CT (Positron Emission Tomography)"}
            </Label>
          </div>
          <p className="text-sm text-muted-foreground pl-6">
            {language === "de" 
              ? "Kombinierte Bildgebung zur Darstellung von Stoffwechselprozessen, häufig in der Tumordiagnostik und Verlaufskontrolle eingesetzt."
              : "Combined imaging to visualize metabolic processes, commonly used in tumor diagnostics and follow-up monitoring."}
          </p>
          {formData.unfaelleOperationen?.petCt?.ja && (
            <NuclearMedicineDetails
              formData={formData}
              updateNestedField={updateNestedField}
              language={language}
              fieldName="petCt"
              requiredWeeks={4}
              nameDe="PET-CT"
              nameEn="PET-CT"
              placeholderDe="z.B. Tumorsuche, Staging, Verlaufskontrolle"
              placeholderEn="e.g. tumor detection, staging, follow-up"
            />
          )}
        </div>

        {/* Radioiodtherapie */}
        <div className="space-y-4">
          <div className="flex items-center space-x-2">
            <Checkbox
              id="radioiodtherapie"
              checked={formData.unfaelleOperationen?.radioiodtherapie?.ja || false}
              onCheckedChange={(checked) => updateNestedField("radioiodtherapie", "ja", checked)}
            />
            <Label htmlFor="radioiodtherapie">
              {language === "de" ? "Radioiodtherapie" : "Radioiodine Therapy"}
            </Label>
          </div>
          <p className="text-sm text-muted-foreground pl-6">
            {language === "de" 
              ? "Therapie mit radioaktivem Iod, hauptsächlich bei Schilddrüsenerkrankungen (Überfunktion, Struma, Schilddrüsenkrebs) eingesetzt."
              : "Therapy with radioactive iodine, mainly used for thyroid conditions (hyperthyroidism, goiter, thyroid cancer)."}
          </p>
          {formData.unfaelleOperationen?.radioiodtherapie?.ja && (
            <NuclearMedicineDetails
              formData={formData}
              updateNestedField={updateNestedField}
              language={language}
              fieldName="radioiodtherapie"
              requiredWeeks={12}
              nameDe="Radioiodtherapie"
              nameEn="Radioiodine Therapy"
              placeholderDe="z.B. Schilddrüsenüberfunktion, Struma, Karzinom"
              placeholderEn="e.g. hyperthyroidism, goiter, carcinoma"
              showDosisField={true}
            />
          )}
        </div>
      </div>
    </div>
  );
};

// Reusable component for nuclear medicine examination details with date validation
interface NuclearMedicineDetailsProps {
  formData: AnamneseFormData;
  updateNestedField: (parentField: string, field: string, value: any) => void;
  language: string;
  fieldName: string;
  requiredWeeks: number;
  nameDe: string;
  nameEn: string;
  placeholderDe: string;
  placeholderEn: string;
  showDosisField?: boolean;
}

const NuclearMedicineDetails = ({
  formData,
  updateNestedField,
  language,
  fieldName,
  requiredWeeks,
  nameDe,
  nameEn,
  placeholderDe,
  placeholderEn,
  showDosisField = false,
}: NuclearMedicineDetailsProps) => {
  const fieldData = formData.unfaelleOperationen?.[fieldName as keyof typeof formData.unfaelleOperationen] as { datum?: string; grund?: string; dosis?: string } | undefined;
  
  const [date, setDate] = useState<Date | undefined>(() => {
    const storedDate = fieldData?.datum;
    if (storedDate) {
      const parsed = new Date(storedDate);
      return isValid(parsed) ? parsed : undefined;
    }
    return undefined;
  });

  const weeksSinceExamination = useMemo(() => {
    if (!date || !isValid(date)) return null;
    return differenceInWeeks(new Date(), date);
  }, [date]);

  const isSafeInterval = weeksSinceExamination !== null && weeksSinceExamination >= requiredWeeks;
  const name = language === "de" ? nameDe : nameEn;

  const handleDateSelect = (selectedDate: Date | undefined) => {
    setDate(selectedDate);
    if (selectedDate) {
      updateNestedField(fieldName, "datum", selectedDate.toISOString());
    } else {
      updateNestedField(fieldName, "datum", "");
    }
  };

  return (
    <>
      {/* Dynamic status message based on date */}
      {weeksSinceExamination !== null ? (
        isSafeInterval ? (
          <div className="p-4 bg-green-50 dark:bg-green-950/30 border border-green-200 dark:border-green-800 rounded-lg ml-6">
            <div className="flex items-start gap-3">
              <CheckCircle2 className="w-5 h-5 text-green-600 dark:text-green-400 mt-0.5 shrink-0" />
              <p className="text-sm text-green-800 dark:text-green-200 font-medium">
                {language === "de"
                  ? `✓ Der erforderliche Mindestabstand von ${requiredWeeks} Wochen ist erfüllt. Ihre letzte ${name} liegt ${weeksSinceExamination} Wochen zurück. Behandlungen und Untersuchungen können wie geplant durchgeführt werden.`
                  : `✓ The required minimum interval of ${requiredWeeks} weeks is met. Your last ${name} was ${weeksSinceExamination} weeks ago. Treatments and examinations can proceed as planned.`}
              </p>
            </div>
          </div>
        ) : (
          <div className="p-4 bg-red-50 dark:bg-red-950/30 border border-red-200 dark:border-red-800 rounded-lg ml-6">
            <div className="flex items-start gap-3">
              <AlertTriangle className="w-5 h-5 text-red-600 dark:text-red-400 mt-0.5 shrink-0" />
              <div className="text-sm text-red-800 dark:text-red-200">
                <p className="font-semibold">
                  {language === "de"
                    ? `⚠️ Achtung: Nur ${weeksSinceExamination} Woche${weeksSinceExamination !== 1 ? 'n' : ''} seit der letzten ${name}`
                    : `⚠️ Warning: Only ${weeksSinceExamination} week${weeksSinceExamination !== 1 ? 's' : ''} since last ${name}`}
                </p>
                <p className="mt-1">
                  {language === "de"
                    ? `Der erforderliche Mindestabstand von ${requiredWeeks} Wochen ist noch nicht erreicht. Bitte warten Sie noch ${requiredWeeks - weeksSinceExamination} Woche${requiredWeeks - weeksSinceExamination !== 1 ? 'n' : ''}, bevor bestimmte Behandlungen durchgeführt werden können.`
                    : `The required minimum interval of ${requiredWeeks} weeks has not yet been reached. Please wait ${requiredWeeks - weeksSinceExamination} more week${requiredWeeks - weeksSinceExamination !== 1 ? 's' : ''} before certain treatments can be performed.`}
                </p>
              </div>
            </div>
          </div>
        )
      ) : (
        <div className="p-4 bg-amber-50 dark:bg-amber-950/30 border border-amber-200 dark:border-amber-800 rounded-lg ml-6">
          <p className="text-sm text-amber-800 dark:text-amber-200 font-medium">
            {language === "de"
              ? `⚠️ Wichtiger Hinweis: Nach einer ${name} benötigen wir einen Mindestabstand von ${requiredWeeks} Wochen, bevor wir bestimmte Behandlungen und Untersuchungen durchführen können. Bitte geben Sie das Datum Ihrer letzten Untersuchung/Therapie an.`
              : `⚠️ Important note: After a ${name}, we require a minimum interval of ${requiredWeeks} weeks before we can perform certain treatments and examinations. Please enter the date of your last examination/therapy.`}
          </p>
        </div>
      )}

      <div className={`grid gap-4 ${showDosisField ? 'md:grid-cols-3' : 'md:grid-cols-2'} ml-6`}>
        <div className="space-y-2">
          <Label>
            {language === "de" ? "Datum der letzten Untersuchung/Therapie" : "Date of last examination/therapy"}
          </Label>
          <Popover>
            <PopoverTrigger asChild>
              <Button
                variant="outline"
                className={cn(
                  "w-full justify-start text-left font-normal",
                  !date && "text-muted-foreground"
                )}
              >
                <CalendarIcon className="mr-2 h-4 w-4" />
                {date ? format(date, "PPP", { locale: language === "de" ? de : enUS }) : (
                  <span>{language === "de" ? "Datum auswählen" : "Pick a date"}</span>
                )}
              </Button>
            </PopoverTrigger>
            <PopoverContent className="w-auto p-0" align="start">
              <Calendar
                mode="single"
                selected={date}
                onSelect={handleDateSelect}
                disabled={(d) => d > new Date()}
                initialFocus
                locale={language === "de" ? de : enUS}
                className={cn("p-3 pointer-events-auto")}
              />
            </PopoverContent>
          </Popover>
        </div>
        <div className="space-y-2">
          <Label>
            {language === "de" ? "Grund" : "Reason"}
          </Label>
          <Input
            placeholder={language === "de" ? placeholderDe : placeholderEn}
            value={fieldData?.grund || ""}
            onChange={(e) => updateNestedField(fieldName, "grund", e.target.value)}
          />
        </div>
        {showDosisField && (
          <div className="space-y-2">
            <Label>
              {language === "de" ? "Dosis (MBq/mCi)" : "Dose (MBq/mCi)"}
            </Label>
            <Input
              placeholder={language === "de" ? "z.B. 3700 MBq" : "e.g. 3700 MBq"}
              value={fieldData?.dosis || ""}
              onChange={(e) => updateNestedField(fieldName, "dosis", e.target.value)}
            />
          </div>
        )}
      </div>
    </>
  );
};

export default SurgeriesSection;
