import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { Checkbox } from "@/components/ui/checkbox";
import { useLanguage } from "@/contexts/LanguageContext";
import { AnamneseFormData } from "@/lib/anamneseFormData";
import { Separator } from "@/components/ui/separator";
import { AlertTriangle } from "lucide-react";

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
                <Label htmlFor="welche">
                  {language === "de" ? "Art der Krebserkrankung" : "Type of cancer"}
                </Label>
                <Input
                  id="welche"
                  value={formData.krebserkrankung?.welche || ""}
                  onChange={(e) => updateKrebserkrankung("welche", e.target.value)}
                  placeholder={language === "de" ? "z.B. Brustkrebs, Prostatakrebs" : "e.g. Breast cancer, Prostate cancer"}
                />
              </div>

              <div className="space-y-2">
                <Label htmlFor="diagnoseJahr">
                  {language === "de" ? "Jahr der Erstdiagnose" : "Year of initial diagnosis"}
                </Label>
                <Input
                  id="diagnoseJahr"
                  value={formData.krebserkrankung?.diagnoseJahr || ""}
                  onChange={(e) => updateKrebserkrankung("diagnoseJahr", e.target.value)}
                  placeholder="z.B. 2020"
                />
              </div>
            </div>

            <div className="space-y-2">
              <Label htmlFor="betroffeneOrgane">
                {language === "de" ? "Betroffene Organe" : "Affected organs"}
              </Label>
              <Input
                id="betroffeneOrgane"
                value={formData.krebserkrankung?.betroffeneOrgane || ""}
                onChange={(e) => updateKrebserkrankung("betroffeneOrgane", e.target.value)}
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
                <Input
                  id="tnm-t"
                  value={formData.krebserkrankung?.tnmStadium?.t || ""}
                  onChange={(e) => updateTNM("t", e.target.value)}
                  placeholder="z.B. T2"
                />
              </div>
              <div className="space-y-2">
                <Label htmlFor="tnm-n">N</Label>
                <Input
                  id="tnm-n"
                  value={formData.krebserkrankung?.tnmStadium?.n || ""}
                  onChange={(e) => updateTNM("n", e.target.value)}
                  placeholder="z.B. N0"
                />
              </div>
              <div className="space-y-2">
                <Label htmlFor="tnm-m">M</Label>
                <Input
                  id="tnm-m"
                  value={formData.krebserkrankung?.tnmStadium?.m || ""}
                  onChange={(e) => updateTNM("m", e.target.value)}
                  placeholder="z.B. M0"
                />
              </div>
            </div>
          </div>

          <Separator />

          {/* Behandlungen */}
          <div className="space-y-4">
            <h3 className="text-lg font-medium">
              {language === "de" ? "Durchgeführte Behandlungen" : "Treatments Received"}
            </h3>

            <div className="space-y-4">
              <div className="flex items-center space-x-2">
                <Checkbox
                  id="operationDurchgefuehrt"
                  checked={formData.krebserkrankung?.operationDurchgefuehrt?.ja || false}
                  onCheckedChange={(checked) => updateNestedField("operationDurchgefuehrt", "ja", checked)}
                />
                <Label htmlFor="operationDurchgefuehrt">
                  {language === "de" ? "Operation" : "Surgery"}
                </Label>
              </div>
              {formData.krebserkrankung?.operationDurchgefuehrt?.ja && (
                <Input
                  className="max-w-md pl-6"
                  placeholder={language === "de" ? "Welche Operation?" : "Which surgery?"}
                  value={formData.krebserkrankung?.operationDurchgefuehrt?.welche || ""}
                  onChange={(e) => updateNestedField("operationDurchgefuehrt", "welche", e.target.value)}
                />
              )}
            </div>

            <div className="space-y-4">
              <div className="flex items-center space-x-2">
                <Checkbox
                  id="chemotherapieErhalten"
                  checked={formData.krebserkrankung?.chemotherapieErhalten?.ja || false}
                  onCheckedChange={(checked) => updateNestedField("chemotherapieErhalten", "ja", checked)}
                />
                <Label htmlFor="chemotherapieErhalten">
                  {language === "de" ? "Chemotherapie" : "Chemotherapy"}
                </Label>
              </div>
              {formData.krebserkrankung?.chemotherapieErhalten?.ja && (
                <div className="grid gap-4 md:grid-cols-3 pl-6">
                  <Input
                    placeholder={language === "de" ? "Von (Datum/Jahr)" : "From (date/year)"}
                    value={formData.krebserkrankung?.chemotherapieErhalten?.von || ""}
                    onChange={(e) => updateNestedField("chemotherapieErhalten", "von", e.target.value)}
                  />
                  <Input
                    placeholder={language === "de" ? "Bis (Datum/Jahr)" : "To (date/year)"}
                    value={formData.krebserkrankung?.chemotherapieErhalten?.bis || ""}
                    onChange={(e) => updateNestedField("chemotherapieErhalten", "bis", e.target.value)}
                  />
                  <Input
                    placeholder={language === "de" ? "Welche Medikamente?" : "Which medications?"}
                    value={formData.krebserkrankung?.chemotherapieErhalten?.welche || ""}
                    onChange={(e) => updateNestedField("chemotherapieErhalten", "welche", e.target.value)}
                  />
                </div>
              )}
            </div>

            <div className="space-y-4">
              <div className="flex items-center space-x-2">
                <Checkbox
                  id="strahlentherapieErhalten"
                  checked={formData.krebserkrankung?.strahlentherapieErhalten?.ja || false}
                  onCheckedChange={(checked) => updateNestedField("strahlentherapieErhalten", "ja", checked)}
                />
                <Label htmlFor="strahlentherapieErhalten">
                  {language === "de" ? "Strahlentherapie" : "Radiation therapy"}
                </Label>
              </div>
              {formData.krebserkrankung?.strahlentherapieErhalten?.ja && (
                <div className="grid gap-4 md:grid-cols-2 pl-6">
                  <Input
                    placeholder={language === "de" ? "Bestrahlter Bereich" : "Irradiated area"}
                    value={formData.krebserkrankung?.strahlentherapieErhalten?.bereich || ""}
                    onChange={(e) => updateNestedField("strahlentherapieErhalten", "bereich", e.target.value)}
                  />
                  <Input
                    placeholder={language === "de" ? "Dauer (Wochen)" : "Duration (weeks)"}
                    value={formData.krebserkrankung?.strahlentherapieErhalten?.dauerWochen || ""}
                    onChange={(e) => updateNestedField("strahlentherapieErhalten", "dauerWochen", e.target.value)}
                  />
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
                <Input
                  className="max-w-md pl-6"
                  placeholder={language === "de" ? "In welchen Organen?" : "In which organs?"}
                  value={formData.krebserkrankung?.metastasen?.organe || ""}
                  onChange={(e) => updateNestedField("metastasen", "organe", e.target.value)}
                />
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
                <Input
                  className="max-w-md pl-6"
                  placeholder={language === "de" ? "Welche Therapie?" : "Which therapy?"}
                  value={formData.krebserkrankung?.aktuelleTumortherapie?.welche || ""}
                  onChange={(e) => updateNestedField("aktuelleTumortherapie", "welche", e.target.value)}
                />
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
