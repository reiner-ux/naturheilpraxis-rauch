import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { Checkbox } from "@/components/ui/checkbox";
import { useLanguage } from "@/contexts/LanguageContext";
import { AnamneseFormData } from "@/lib/anamneseFormData";
import { Separator } from "@/components/ui/separator";

interface VaccinationsSectionProps {
  formData: AnamneseFormData;
  updateFormData: (field: string, value: any) => void;
}

const VaccinationsSection = ({ formData, updateFormData }: VaccinationsSectionProps) => {
  const { language } = useLanguage();

  const updateImpfungen = (field: string, value: any) => {
    updateFormData("impfungen", {
      ...formData.impfungen,
      [field]: value
    });
  };

  const updateNestedField = (parentField: string, field: string, value: any) => {
    updateFormData("impfungen", {
      ...formData.impfungen,
      [parentField]: {
        ...(formData.impfungen[parentField as keyof typeof formData.impfungen] as object),
        [field]: value
      }
    });
  };

  const updateCovidField = (field: string, value: any) => {
    updateFormData("impfungen", {
      ...formData.impfungen,
      covid: {
        ...formData.impfungen?.covid,
        [field]: value
      }
    });
  };

  const updateCovidDose = (dose: string, field: string, value: any) => {
    updateFormData("impfungen", {
      ...formData.impfungen,
      covid: {
        ...formData.impfungen?.covid,
        [dose]: {
          ...(formData.impfungen?.covid?.[dose as keyof typeof formData.impfungen.covid] as object),
          [field]: value
        }
      }
    });
  };

  const standardImpfungen = [
    { field: "mmr", labelDe: "MMR (Masern, Mumps, Röteln)", labelEn: "MMR (Measles, Mumps, Rubella)" },
    { field: "tetanus", labelDe: "Tetanus", labelEn: "Tetanus" },
    { field: "diphtherie", labelDe: "Diphtherie", labelEn: "Diphtheria" },
    { field: "keuchhusten", labelDe: "Keuchhusten (Pertussis)", labelEn: "Whooping cough (Pertussis)" },
    { field: "polio", labelDe: "Polio (Kinderlähmung)", labelEn: "Polio" },
    { field: "hepatitisA", labelDe: "Hepatitis A", labelEn: "Hepatitis A" },
    { field: "hepatitisB", labelDe: "Hepatitis B", labelEn: "Hepatitis B" },
    { field: "windpocken", labelDe: "Windpocken (Varizellen)", labelEn: "Chickenpox (Varicella)" },
    { field: "pneumokokken", labelDe: "Pneumokokken", labelEn: "Pneumococcal" },
  ];

  return (
    <div className="space-y-8">
      {/* Standard-Impfungen */}
      <div className="space-y-4">
        <h3 className="text-lg font-medium">
          {language === "de" ? "Standard-Impfungen" : "Standard Vaccinations"}
        </h3>
        <p className="text-sm text-muted-foreground">
          {language === "de" 
            ? "Bitte geben Sie an, welche Impfungen Sie erhalten haben und wann (Jahr)."
            : "Please indicate which vaccinations you have received and when (year)."}
        </p>

        <div className="grid gap-4 md:grid-cols-2">
          {standardImpfungen.map((impfung) => {
            const data = formData.impfungen?.[impfung.field as keyof typeof formData.impfungen] as { ja?: boolean; jahr?: string } | undefined;
            return (
              <div key={impfung.field} className="space-y-2 p-3 bg-muted/30 rounded-lg">
                <div className="flex items-center space-x-2">
                  <Checkbox
                    id={`impfung-${impfung.field}`}
                    checked={data?.ja || false}
                    onCheckedChange={(checked) => updateNestedField(impfung.field, "ja", checked)}
                  />
                  <Label htmlFor={`impfung-${impfung.field}`} className="font-normal">
                    {language === "de" ? impfung.labelDe : impfung.labelEn}
                  </Label>
                </div>
                {data?.ja && (
                  <Input
                    className="pl-6"
                    placeholder={language === "de" ? "Jahr (ca.)" : "Year (approx.)"}
                    value={data?.jahr || ""}
                    onChange={(e) => updateNestedField(impfung.field, "jahr", e.target.value)}
                  />
                )}
              </div>
            );
          })}
        </div>

        {/* Influenza */}
        <div className="space-y-2 p-3 bg-muted/30 rounded-lg max-w-md">
          <div className="flex items-center space-x-2">
            <Checkbox
              id="impfung-influenza"
              checked={formData.impfungen?.influenza?.ja || false}
              onCheckedChange={(checked) => updateNestedField("influenza", "ja", checked)}
            />
            <Label htmlFor="impfung-influenza" className="font-normal">
              {language === "de" ? "Influenza (Grippe)" : "Influenza (Flu)"}
            </Label>
          </div>
          {formData.impfungen?.influenza?.ja && (
            <Input
              className="pl-6"
              placeholder={language === "de" ? "Zuletzt geimpft (Jahr)" : "Last vaccinated (year)"}
              value={formData.impfungen?.influenza?.zuletzt || ""}
              onChange={(e) => updateNestedField("influenza", "zuletzt", e.target.value)}
            />
          )}
        </div>
      </div>

      <Separator />

      {/* COVID-19 */}
      <div className="space-y-4">
        <h3 className="text-lg font-medium">
          {language === "de" ? "COVID-19" : "COVID-19"}
        </h3>

        <div className="flex items-center space-x-2">
          <Checkbox
            id="covidGeimpft"
            checked={formData.impfungen?.covid?.geimpft || false}
            onCheckedChange={(checked) => updateCovidField("geimpft", checked)}
          />
          <Label htmlFor="covidGeimpft">
            {language === "de" ? "COVID-19 Impfung erhalten" : "Received COVID-19 vaccination"}
          </Label>
        </div>

        {formData.impfungen?.covid?.geimpft && (
          <div className="space-y-4 pl-6">
            {/* Dosis 1-4 */}
            {["dosis1", "dosis2", "dosis3", "dosis4"].map((dosis, index) => {
              const dosisData = formData.impfungen?.covid?.[dosis as keyof typeof formData.impfungen.covid] as { ja?: boolean; datum?: string; hersteller?: string } | undefined;
              return (
                <div key={dosis} className="space-y-2 p-3 bg-muted/30 rounded-lg">
                  <div className="flex items-center space-x-2">
                    <Checkbox
                      id={`covid-${dosis}`}
                      checked={dosisData?.ja || false}
                      onCheckedChange={(checked) => updateCovidDose(dosis, "ja", checked)}
                    />
                    <Label htmlFor={`covid-${dosis}`} className="font-normal">
                      {language === "de" ? `${index + 1}. Dosis` : `Dose ${index + 1}`}
                    </Label>
                  </div>
                  {dosisData?.ja && (
                    <div className="grid gap-4 md:grid-cols-2 pl-6">
                      <Input
                        placeholder={language === "de" ? "Datum" : "Date"}
                        value={dosisData?.datum || ""}
                        onChange={(e) => updateCovidDose(dosis, "datum", e.target.value)}
                      />
                      <Input
                        placeholder={language === "de" ? "Hersteller (z.B. BioNTech)" : "Manufacturer (e.g. Pfizer)"}
                        value={dosisData?.hersteller || ""}
                        onChange={(e) => updateCovidDose(dosis, "hersteller", e.target.value)}
                      />
                    </div>
                  )}
                </div>
              );
            })}

            {/* Weitere Dosen */}
            <div className="space-y-2">
              <Label>{language === "de" ? "Weitere Impfdosen (Anzahl)" : "Additional doses (number)"}</Label>
              <Input
                className="max-w-xs"
                value={formData.impfungen?.covid?.weitereAnzahl || ""}
                onChange={(e) => updateCovidField("weitereAnzahl", e.target.value)}
                placeholder="0"
              />
            </div>

            {/* Impfreaktionen */}
            <div className="space-y-2">
              <div className="flex items-center space-x-2">
                <Checkbox
                  id="impfreaktionen"
                  checked={formData.impfungen?.covid?.impfreaktionen?.ja || false}
                  onCheckedChange={(checked) => updateCovidDose("impfreaktionen", "ja", checked)}
                />
                <Label htmlFor="impfreaktionen">
                  {language === "de" ? "Impfreaktionen aufgetreten" : "Vaccine reactions occurred"}
                </Label>
              </div>
              {formData.impfungen?.covid?.impfreaktionen?.ja && (
                <Input
                  className="pl-6"
                  placeholder={language === "de" ? "Welche Reaktionen?" : "Which reactions?"}
                  value={formData.impfungen?.covid?.impfreaktionen?.art || ""}
                  onChange={(e) => updateCovidDose("impfreaktionen", "art", e.target.value)}
                />
              )}
            </div>
          </div>
        )}

        <Separator className="my-4" />

        {/* COVID Infektion */}
        <div className="space-y-4">
          <div className="flex items-center space-x-2">
            <Checkbox
              id="covidInfiziert"
              checked={formData.impfungen?.covid?.infiziert?.ja || false}
              onCheckedChange={(checked) => updateCovidDose("infiziert", "ja", checked)}
            />
            <Label htmlFor="covidInfiziert">
              {language === "de" ? "COVID-19 Infektion durchgemacht" : "Had COVID-19 infection"}
            </Label>
          </div>
          {formData.impfungen?.covid?.infiziert?.ja && (
            <div className="grid gap-4 md:grid-cols-2 pl-6">
              <Input
                placeholder={language === "de" ? "Wann (Monat/Jahr)?" : "When (month/year)?"}
                value={formData.impfungen?.covid?.infiziert?.wann || ""}
                onChange={(e) => updateCovidDose("infiziert", "wann", e.target.value)}
              />
              <Input
                placeholder={language === "de" ? "Schweregrad (leicht/mittel/schwer)" : "Severity (mild/moderate/severe)"}
                value={formData.impfungen?.covid?.infiziert?.schwere || ""}
                onChange={(e) => updateCovidDose("infiziert", "schwere", e.target.value)}
              />
            </div>
          )}
        </div>

        {/* Long COVID */}
        <div className="space-y-4">
          <div className="flex items-center space-x-2">
            <Checkbox
              id="longCovid"
              checked={formData.impfungen?.covid?.longCovid?.ja || false}
              onCheckedChange={(checked) => updateCovidDose("longCovid", "ja", checked)}
            />
            <Label htmlFor="longCovid">
              {language === "de" ? "Long-COVID / Post-COVID Symptome" : "Long-COVID / Post-COVID symptoms"}
            </Label>
          </div>
          {formData.impfungen?.covid?.longCovid?.ja && (
            <Input
              className="pl-6"
              placeholder={language === "de" ? "Welche Symptome?" : "Which symptoms?"}
              value={formData.impfungen?.covid?.longCovid?.welche || ""}
              onChange={(e) => updateCovidDose("longCovid", "welche", e.target.value)}
            />
          )}
        </div>
      </div>
    </div>
  );
};

export default VaccinationsSection;
