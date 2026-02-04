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
import YearMonthSelect from "./shared/YearMonthSelect";

interface SurgeriesSectionProps {
  formData: AnamneseFormData;
  updateFormData: (field: string, value: any) => void;
}

const SurgeriesSection = ({ formData, updateFormData }: SurgeriesSectionProps) => {
  const { language } = useLanguage();

  const birthYear = formData.geburtsdatum
    ? new Date(formData.geburtsdatum).getFullYear()
    : undefined;

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
              <YearMonthSelect
                yearValue={formData.unfaelleOperationen?.unfall?.jahr || ""}
                onYearChange={(value) => updateNestedField("unfall", "jahr", value)}
                showMonth={false}
                birthYear={birthYear}
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
              <YearMonthSelect
                yearValue={formData.unfaelleOperationen?.knochenbruch?.jahr || ""}
                onYearChange={(value) => updateNestedField("knochenbruch", "jahr", value)}
                showMonth={false}
                birthYear={birthYear}
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
              <YearMonthSelect
                yearValue={formData.unfaelleOperationen?.kopfverletzung?.jahr || ""}
                onYearChange={(value) => updateNestedField("kopfverletzung", "jahr", value)}
                showMonth={false}
                birthYear={birthYear}
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
              <YearMonthSelect
                yearValue={op.jahr}
                onYearChange={(value) => updateOperation(index, "jahr", value)}
                showMonth={false}
                birthYear={birthYear}
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
              <YearMonthSelect
                yearValue={formData.unfaelleOperationen?.krankenhausaufenthalt?.jahr || ""}
                onYearChange={(value) => updateNestedField("krankenhausaufenthalt", "jahr", value)}
                showMonth={false}
                birthYear={birthYear}
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
              <YearMonthSelect
                yearValue={formData.unfaelleOperationen?.kuraufenthalt?.jahr || ""}
                onYearChange={(value) => updateNestedField("kuraufenthalt", "jahr", value)}
                showMonth={false}
                birthYear={birthYear}
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
              <YearMonthSelect
                yearValue={formData.unfaelleOperationen?.bluttransfusion?.jahr || ""}
                onYearChange={(value) => updateNestedField("bluttransfusion", "jahr", value)}
                showMonth={false}
                birthYear={birthYear}
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
              <YearMonthSelect
                yearValue={formData.unfaelleOperationen?.chemotherapie?.jahr || ""}
                onYearChange={(value) => updateNestedField("chemotherapie", "jahr", value)}
                showMonth={false}
                birthYear={birthYear}
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
              birthYear={birthYear}
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
              placeholderDe="z.B. Tumorstaging, Metastasensuche"
              placeholderEn="e.g. tumor staging, metastasis detection"
              birthYear={birthYear}
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
              ? "Therapie mit radioaktivem Jod, meist bei Schilddrüsenerkrankungen (Überfunktion, Krebs)."
              : "Therapy with radioactive iodine, usually for thyroid conditions (hyperthyroidism, cancer)."}
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
              placeholderDe="z.B. Schilddrüsenüberfunktion, Schilddrüsenkarzinom"
              placeholderEn="e.g. hyperthyroidism, thyroid carcinoma"
              showDosis={true}
              birthYear={birthYear}
            />
          )}
        </div>
      </div>
    </div>
  );
};

// Subkomponente für nuklearmedizinische Details
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
  showDosis?: boolean;
  birthYear?: number;
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
  showDosis = false,
  birthYear,
}: NuclearMedicineDetailsProps) => {
  const data = formData.unfaelleOperationen?.[fieldName as keyof typeof formData.unfaelleOperationen] as any;
  const [calendarOpen, setCalendarOpen] = useState(false);
  
  const dateLocale = language === "de" ? de : enUS;
  
  // Parse date and calculate weeks since
  const parsedDate = useMemo(() => {
    if (!data?.datum) return null;
    const parsed = parse(data.datum, "yyyy-MM-dd", new Date());
    return isValid(parsed) ? parsed : null;
  }, [data?.datum]);

  const weeksSince = useMemo(() => {
    if (!parsedDate) return null;
    return differenceInWeeks(new Date(), parsedDate);
  }, [parsedDate]);

  const isWaitComplete = weeksSince !== null && weeksSince >= requiredWeeks;

  return (
    <div className="space-y-4 pl-6 p-4 bg-muted/30 rounded-lg">
      <div className="grid gap-4 md:grid-cols-2">
        <div className="space-y-2">
          <Label>{language === "de" ? "Datum" : "Date"}</Label>
          <Popover open={calendarOpen} onOpenChange={setCalendarOpen}>
            <PopoverTrigger asChild>
              <Button
                variant="outline"
                className={cn(
                  "w-full justify-start text-left font-normal",
                  !data?.datum && "text-muted-foreground"
                )}
              >
                <CalendarIcon className="mr-2 h-4 w-4" />
                {parsedDate 
                  ? format(parsedDate, "PPP", { locale: dateLocale })
                  : (language === "de" ? "Datum wählen" : "Pick a date")}
              </Button>
            </PopoverTrigger>
            <PopoverContent className="w-auto p-0" align="start">
              <Calendar
                mode="single"
                selected={parsedDate || undefined}
                onSelect={(date) => {
                  if (date) {
                    updateNestedField(fieldName, "datum", format(date, "yyyy-MM-dd"));
                  }
                  setCalendarOpen(false);
                }}
                disabled={(date) => date > new Date() || date < new Date("1900-01-01")}
                initialFocus
                className={cn("p-3 pointer-events-auto")}
              />
            </PopoverContent>
          </Popover>
        </div>
        
        <div className="space-y-2">
          <Label>{language === "de" ? "Grund" : "Reason"}</Label>
          <Input
            placeholder={language === "de" ? placeholderDe : placeholderEn}
            value={data?.grund || ""}
            onChange={(e) => updateNestedField(fieldName, "grund", e.target.value)}
          />
        </div>
      </div>

      {showDosis && (
        <div className="space-y-2">
          <Label>{language === "de" ? "Dosis (falls bekannt)" : "Dosage (if known)"}</Label>
          <Input
            placeholder={language === "de" ? "z.B. 3700 MBq" : "e.g. 3700 MBq"}
            value={data?.dosis || ""}
            onChange={(e) => updateNestedField(fieldName, "dosis", e.target.value)}
            className="max-w-xs"
          />
        </div>
      )}

      {/* Wartezeit-Status */}
      {parsedDate && (
        <div className={cn(
          "flex items-center gap-2 p-3 rounded-lg",
          isWaitComplete ? "bg-green-100 dark:bg-green-950/30" : "bg-amber-100 dark:bg-amber-950/30"
        )}>
          {isWaitComplete ? (
            <>
              <CheckCircle2 className="w-5 h-5 text-green-600" />
              <span className="text-sm text-green-800 dark:text-green-200">
                {language === "de" 
                  ? `Wartezeit erfüllt (${weeksSince} Wochen seit ${language === "de" ? nameDe : nameEn})`
                  : `Waiting period complete (${weeksSince} weeks since ${nameEn})`}
              </span>
            </>
          ) : (
            <>
              <AlertTriangle className="w-5 h-5 text-amber-600" />
              <span className="text-sm text-amber-800 dark:text-amber-200">
                {language === "de" 
                  ? `Wartezeit: ${requiredWeeks - (weeksSince || 0)} Wochen verbleibend (von ${requiredWeeks} Wochen erforderlich)`
                  : `Waiting period: ${requiredWeeks - (weeksSince || 0)} weeks remaining (of ${requiredWeeks} weeks required)`}
              </span>
            </>
          )}
        </div>
      )}
    </div>
  );
};

export default SurgeriesSection;
