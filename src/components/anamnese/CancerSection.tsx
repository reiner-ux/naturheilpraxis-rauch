import { Label } from "@/components/ui/label";
import { Checkbox } from "@/components/ui/checkbox";
import { Input } from "@/components/ui/input";
import { useLanguage } from "@/contexts/LanguageContext";
import { AnamneseFormData } from "@/lib/anamneseFormData";
import { Separator } from "@/components/ui/separator";
import { AlertTriangle } from "lucide-react";
import MultiSelectCheckbox from "./shared/MultiSelectCheckbox";
import YearMonthSelect from "./shared/YearMonthSelect";
import MultiEntryField from "./shared/MultiEntryField";
import {
  cancerTypes,
  organs,
  tumorTherapies,
  chemotherapyTypes,
  radiotherapyReasons,
} from "@/lib/medicalOptions";
import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from "@/components/ui/select";

interface CancerSectionProps {
  formData: AnamneseFormData;
  updateFormData: (field: string, value: any) => void;
}

const CancerSection = ({ formData, updateFormData }: CancerSectionProps) => {
  const { language } = useLanguage();

  const updateKrebserkrankung = (field: string, value: any) => {
    updateFormData("krebserkrankung", {
      ...formData.krebserkrankung,
      [field]: value
    });
  };

  const updateNestedField = (parentField: string, field: string, value: any) => {
    updateFormData("krebserkrankung", {
      ...formData.krebserkrankung,
      [parentField]: {
        ...(formData.krebserkrankung[parentField as keyof typeof formData.krebserkrankung] as object),
        [field]: value
      }
    });
  };

  const updateTNM = (field: string, value: string) => {
    updateFormData("krebserkrankung", {
      ...formData.krebserkrankung,
      tnmStadium: {
        ...formData.krebserkrankung?.tnmStadium,
        [field]: value
      }
    });
  };

  // Get birth year for year validation
  const birthYear = formData.geburtsdatum 
    ? new Date(formData.geburtsdatum).getFullYear() 
    : undefined;

  return (
    <div className="space-y-8">
      <div className="bg-amber-50 dark:bg-amber-950/30 border border-amber-200 dark:border-amber-800 rounded-lg p-4 flex gap-3">
        <AlertTriangle className="w-5 h-5 text-amber-600 flex-shrink-0 mt-0.5" />
        <p className="text-sm text-amber-800 dark:text-amber-200">
          {language === "de" 
            ? "Diese Angaben sind vertraulich und helfen uns, die bestmögliche Betreuung zu gewährleisten. Bitte füllen Sie diesen Abschnitt nur aus, wenn Sie von einer Krebserkrankung betroffen sind oder waren."
            : "This information is confidential and helps us ensure the best possible care. Please only complete this section if you have or had cancer."}
        </p>
      </div>

      <div className="space-y-4">
        <div className="flex items-center space-x-2">
          <Checkbox
            id="hatKrebs"
            checked={formData.krebserkrankung?.hatKrebs || false}
            onCheckedChange={(checked) => updateKrebserkrankung("hatKrebs", checked)}
          />
          <Label htmlFor="hatKrebs" className="text-lg font-medium">
            {language === "de" ? "Ich habe/hatte eine Krebserkrankung" : "I have/had cancer"}
          </Label>
        </div>
      </div>

      {formData.krebserkrankung?.hatKrebs && (
        <>
          <Separator />

          {/* Grundinformationen */}
          <div className="space-y-4">
            <h3 className="text-lg font-medium">
              {language === "de" ? "Grundinformationen" : "Basic Information"}
            </h3>

            <div className="grid gap-4 md:grid-cols-2">
              <div className="space-y-2">
                <Label>{language === "de" ? "Art der Krebserkrankung" : "Type of cancer"}</Label>
                <Select
                  value={formData.krebserkrankung?.welcheTyp || ""}
                  onValueChange={(value) => updateKrebserkrankung("welcheTyp", value)}
                >
                  <SelectTrigger>
                    <SelectValue placeholder={language === "de" ? "Bitte auswählen" : "Please select"} />
                  </SelectTrigger>
                  <SelectContent className="max-h-[200px]">
                    {cancerTypes.map((type) => (
                      <SelectItem key={type.value} value={type.value}>
                        {language === "de" ? type.labelDe : type.labelEn}
                      </SelectItem>
                    ))}
                  </SelectContent>
                </Select>
                <Input
                  placeholder={language === "de" ? "Oder Freitext-Eingabe" : "Or free text entry"}
                  value={formData.krebserkrankung?.welche || ""}
                  onChange={(e) => updateKrebserkrankung("welche", e.target.value)}
                />
              </div>

              <div className="space-y-2">
                <Label>{language === "de" ? "Jahr der Erstdiagnose" : "Year of initial diagnosis"}</Label>
                <YearMonthSelect
                  yearValue={formData.krebserkrankung?.diagnoseJahr || ""}
                  onYearChange={(value) => updateKrebserkrankung("diagnoseJahr", value)}
                  showMonth={false}
                  birthYear={birthYear}
                />
              </div>
            </div>

            <div className="space-y-2">
              <Label>{language === "de" ? "Betroffene Organe" : "Affected organs"}</Label>
              <MultiSelectCheckbox
                options={organs}
                selectedValues={formData.krebserkrankung?.betroffeneOrganeList || []}
                onChange={(values) => updateKrebserkrankung("betroffeneOrganeList", values)}
                allowOther={true}
                otherValue={formData.krebserkrankung?.betroffeneOrgane || ""}
                onOtherChange={(value) => updateKrebserkrankung("betroffeneOrgane", value)}
                otherPlaceholderDe="Sonstige Organe..."
                otherPlaceholderEn="Other organs..."
                columns={4}
              />
            </div>
          </div>

          <Separator />

          {/* TNM-Stadium */}
          <div className="space-y-4">
            <h3 className="text-lg font-medium">
              {language === "de" ? "TNM-Stadium (falls bekannt)" : "TNM Stage (if known)"}
            </h3>
            <p className="text-sm text-muted-foreground">
              {language === "de" 
                ? "T = Tumorgröße, N = Lymphknotenbefall, M = Metastasen"
                : "T = Tumor size, N = Lymph node involvement, M = Metastases"}
            </p>

            <div className="grid gap-4 grid-cols-3 max-w-md">
              <div className="space-y-2">
                <Label htmlFor="tnm-t">T</Label>
                <Select
                  value={formData.krebserkrankung?.tnmStadium?.t || ""}
                  onValueChange={(value) => updateTNM("t", value)}
                >
                  <SelectTrigger>
                    <SelectValue placeholder="T" />
                  </SelectTrigger>
                  <SelectContent>
                    {["Tx", "T0", "Tis", "T1", "T2", "T3", "T4"].map((v) => (
                      <SelectItem key={v} value={v}>{v}</SelectItem>
                    ))}
                  </SelectContent>
                </Select>
              </div>
              <div className="space-y-2">
                <Label htmlFor="tnm-n">N</Label>
                <Select
                  value={formData.krebserkrankung?.tnmStadium?.n || ""}
                  onValueChange={(value) => updateTNM("n", value)}
                >
                  <SelectTrigger>
                    <SelectValue placeholder="N" />
                  </SelectTrigger>
                  <SelectContent>
                    {["Nx", "N0", "N1", "N2", "N3"].map((v) => (
                      <SelectItem key={v} value={v}>{v}</SelectItem>
                    ))}
                  </SelectContent>
                </Select>
              </div>
              <div className="space-y-2">
                <Label htmlFor="tnm-m">M</Label>
                <Select
                  value={formData.krebserkrankung?.tnmStadium?.m || ""}
                  onValueChange={(value) => updateTNM("m", value)}
                >
                  <SelectTrigger>
                    <SelectValue placeholder="M" />
                  </SelectTrigger>
                  <SelectContent>
                    {["Mx", "M0", "M1"].map((v) => (
                      <SelectItem key={v} value={v}>{v}</SelectItem>
                    ))}
                  </SelectContent>
                </Select>
              </div>
            </div>
          </div>

          <Separator />

          {/* Behandlungen */}
          <div className="space-y-4">
            <h3 className="text-lg font-medium">
              {language === "de" ? "Durchgeführte Behandlungen" : "Treatments Received"}
            </h3>

            {/* Operations - Multiple */}
            <MultiEntryField
              entries={formData.krebserkrankung?.operationenList || []}
              onChange={(entries) => updateKrebserkrankung("operationenList", entries)}
              fields={[
                { key: "jahr", labelDe: "Jahr", labelEn: "Year", type: "year" },
                { key: "art", labelDe: "Art der Operation", labelEn: "Type of surgery", placeholderDe: "z.B. Tumorresektion", placeholderEn: "e.g. Tumor resection" },
              ]}
              titleDe="Operationen"
              titleEn="Surgeries"
              addLabelDe="Operation hinzufügen"
              addLabelEn="Add surgery"
              emptyTextDe="Keine Operationen eingetragen."
              emptyTextEn="No surgeries recorded."
              birthYear={birthYear}
            />

            {/* Chemotherapy - Multiple */}
            <div className="space-y-4 mt-6">
              <div className="flex items-center space-x-2">
                <Checkbox
                  id="chemotherapieErhalten"
                  checked={formData.krebserkrankung?.chemotherapieErhalten?.ja || false}
                  onCheckedChange={(checked) => updateNestedField("chemotherapieErhalten", "ja", checked)}
                />
                <Label htmlFor="chemotherapieErhalten">
                  {language === "de" ? "Chemotherapie erhalten" : "Received chemotherapy"}
                </Label>
              </div>
              {formData.krebserkrankung?.chemotherapieErhalten?.ja && (
                <div className="space-y-4 pl-6">
                  <div className="grid gap-4 md:grid-cols-2">
                    <div className="space-y-2">
                      <Label>{language === "de" ? "Von (Jahr)" : "From (year)"}</Label>
                      <YearMonthSelect
                        yearValue={formData.krebserkrankung?.chemotherapieErhalten?.von || ""}
                        onYearChange={(value) => updateNestedField("chemotherapieErhalten", "von", value)}
                        showMonth={false}
                        birthYear={birthYear}
                      />
                    </div>
                    <div className="space-y-2">
                      <Label>{language === "de" ? "Bis (Jahr)" : "To (year)"}</Label>
                      <YearMonthSelect
                        yearValue={formData.krebserkrankung?.chemotherapieErhalten?.bis || ""}
                        onYearChange={(value) => updateNestedField("chemotherapieErhalten", "bis", value)}
                        showMonth={false}
                        birthYear={birthYear}
                      />
                    </div>
                  </div>
                  <div className="space-y-2">
                    <Label>{language === "de" ? "Art der Chemotherapie" : "Type of chemotherapy"}</Label>
                    <MultiSelectCheckbox
                      options={chemotherapyTypes}
                      selectedValues={formData.krebserkrankung?.chemotherapieErhalten?.typen || []}
                      onChange={(values) => updateNestedField("chemotherapieErhalten", "typen", values)}
                      allowOther={true}
                      otherValue={formData.krebserkrankung?.chemotherapieErhalten?.welche || ""}
                      onOtherChange={(value) => updateNestedField("chemotherapieErhalten", "welche", value)}
                      otherPlaceholderDe="Andere Chemotherapie..."
                      otherPlaceholderEn="Other chemotherapy..."
                      columns={2}
                    />
                  </div>
                </div>
              )}
            </div>

            {/* Strahlentherapie - Multiple */}
            <div className="space-y-4 mt-6">
              <div className="flex items-center space-x-2">
                <Checkbox
                  id="strahlentherapieErhalten"
                  checked={formData.krebserkrankung?.strahlentherapieErhalten?.ja || false}
                  onCheckedChange={(checked) => updateNestedField("strahlentherapieErhalten", "ja", checked)}
                />
                <Label htmlFor="strahlentherapieErhalten">
                  {language === "de" ? "Strahlentherapie erhalten" : "Received radiation therapy"}
                </Label>
              </div>
              {formData.krebserkrankung?.strahlentherapieErhalten?.ja && (
                <div className="space-y-4 pl-6">
                  <div className="space-y-2">
                    <Label>{language === "de" ? "Art/Indikation der Strahlentherapie" : "Type/indication of radiotherapy"}</Label>
                    <MultiSelectCheckbox
                      options={radiotherapyReasons}
                      selectedValues={formData.krebserkrankung?.strahlentherapieErhalten?.typen || []}
                      onChange={(values) => updateNestedField("strahlentherapieErhalten", "typen", values)}
                      allowOther={true}
                      otherValue={formData.krebserkrankung?.strahlentherapieErhalten?.bereich || ""}
                      onOtherChange={(value) => updateNestedField("strahlentherapieErhalten", "bereich", value)}
                      otherPlaceholderDe="Bestrahlter Bereich..."
                      otherPlaceholderEn="Irradiated area..."
                      columns={2}
                    />
                  </div>
                  <div className="space-y-2">
                    <Label>{language === "de" ? "Dauer (Wochen)" : "Duration (weeks)"}</Label>
                    <Select
                      value={formData.krebserkrankung?.strahlentherapieErhalten?.dauerWochen || ""}
                      onValueChange={(value) => updateNestedField("strahlentherapieErhalten", "dauerWochen", value)}
                    >
                      <SelectTrigger className="w-32">
                        <SelectValue placeholder={language === "de" ? "Wochen" : "Weeks"} />
                      </SelectTrigger>
                      <SelectContent>
                        {["1", "2", "3", "4", "5", "6", "7", "8", "10", "12", ">12"].map((w) => (
                          <SelectItem key={w} value={w}>{w}</SelectItem>
                        ))}
                      </SelectContent>
                    </Select>
                  </div>
                </div>
              )}
            </div>
          </div>

          <Separator />

          {/* Metastasen & Aktuelle Therapie */}
          <div className="space-y-4">
            <h3 className="text-lg font-medium">
              {language === "de" ? "Aktueller Status" : "Current Status"}
            </h3>

            <div className="space-y-4">
              <div className="flex items-center space-x-2">
                <Checkbox
                  id="metastasen"
                  checked={formData.krebserkrankung?.metastasen?.ja || false}
                  onCheckedChange={(checked) => updateNestedField("metastasen", "ja", checked)}
                />
                <Label htmlFor="metastasen">
                  {language === "de" ? "Metastasen vorhanden" : "Metastases present"}
                </Label>
              </div>
              {formData.krebserkrankung?.metastasen?.ja && (
                <div className="pl-6 space-y-2">
                  <Label>{language === "de" ? "Betroffene Organe" : "Affected organs"}</Label>
                  <MultiSelectCheckbox
                    options={organs}
                    selectedValues={formData.krebserkrankung?.metastasen?.organeList || []}
                    onChange={(values) => updateNestedField("metastasen", "organeList", values)}
                    allowOther={true}
                    otherValue={formData.krebserkrankung?.metastasen?.organe || ""}
                    onOtherChange={(value) => updateNestedField("metastasen", "organe", value)}
                    otherPlaceholderDe="Andere Organe..."
                    otherPlaceholderEn="Other organs..."
                    columns={4}
                  />
                </div>
              )}
            </div>

            <div className="space-y-4">
              <div className="flex items-center space-x-2">
                <Checkbox
                  id="aktuelleTumortherapie"
                  checked={formData.krebserkrankung?.aktuelleTumortherapie?.ja || false}
                  onCheckedChange={(checked) => updateNestedField("aktuelleTumortherapie", "ja", checked)}
                />
                <Label htmlFor="aktuelleTumortherapie">
                  {language === "de" ? "Aktuelle Tumortherapie" : "Current tumor therapy"}
                </Label>
              </div>
              {formData.krebserkrankung?.aktuelleTumortherapie?.ja && (
                <div className="pl-6 space-y-2">
                  <Label>{language === "de" ? "Art der Therapie" : "Type of therapy"}</Label>
                  <MultiSelectCheckbox
                    options={tumorTherapies}
                    selectedValues={formData.krebserkrankung?.aktuelleTumortherapie?.typen || []}
                    onChange={(values) => updateNestedField("aktuelleTumortherapie", "typen", values)}
                    allowOther={true}
                    otherValue={formData.krebserkrankung?.aktuelleTumortherapie?.welche || ""}
                    onOtherChange={(value) => updateNestedField("aktuelleTumortherapie", "welche", value)}
                    otherPlaceholderDe="Andere Therapie..."
                    otherPlaceholderEn="Other therapy..."
                    columns={2}
                  />
                </div>
              )}
            </div>
          </div>

          <Separator />

          {/* Bestätigung */}
          <div className="bg-muted/50 rounded-lg p-4">
            <div className="flex items-start space-x-2">
              <Checkbox
                id="krebsBestaetigung"
                checked={formData.krebserkrankung?.krebsBestaetigung || false}
                onCheckedChange={(checked) => updateKrebserkrankung("krebsBestaetigung", checked)}
              />
              <Label htmlFor="krebsBestaetigung" className="text-sm leading-relaxed">
                {language === "de" 
                  ? "Ich bestätige, dass die obigen Angaben zu meiner Krebserkrankung nach bestem Wissen korrekt sind."
                  : "I confirm that the above information about my cancer is correct to the best of my knowledge."}
              </Label>
            </div>
          </div>
        </>
      )}
    </div>
  );
};

export default CancerSection;
