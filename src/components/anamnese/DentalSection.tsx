import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { Checkbox } from "@/components/ui/checkbox";
import { Textarea } from "@/components/ui/textarea";
import { useLanguage } from "@/contexts/LanguageContext";
import { AnamneseFormData } from "@/lib/anamneseFormData";
import { Separator } from "@/components/ui/separator";
import { RadioGroup, RadioGroupItem } from "@/components/ui/radio-group";
import DentalChart, { DentalChartData } from "./shared/DentalChart";
import TemporalStatusSelect from "./shared/TemporalStatusSelect";

interface DentalSectionProps {
  formData: AnamneseFormData;
  updateFormData: (field: string, value: any) => void;
}

const DentalSection = ({ formData, updateFormData }: DentalSectionProps) => {
  const { language } = useLanguage();

  const birthYear = formData.geburtsdatum
    ? new Date(formData.geburtsdatum).getFullYear()
    : undefined;

  const updateZahngesundheit = (field: string, value: any) => {
    updateFormData("zahngesundheit", {
      ...formData.zahngesundheit,
      [field]: value,
    });
  };

  const updateZahngesundheitSub = (field: string, subfield: string, value: any) => {
    updateFormData("zahngesundheit", {
      ...formData.zahngesundheit,
      [field]: {
        ...(formData.zahngesundheit?.[field as keyof typeof formData.zahngesundheit] as object),
        [subfield]: value,
      },
    });
  };

  return (
    <div className="space-y-8">
      {/* Zahnstatus / Gebiss */}
      <div className="space-y-4">
        <h3 className="text-lg font-medium">
          {language === "de" ? "A. Zahnstatus / Gebiss" : "A. Dental Status / Denture"}
        </h3>
        <p className="text-sm text-muted-foreground">
          {language === "de"
            ? "Welche Art von Gebiss haben Sie? Bei Teil- oder Vollprothese bitte angeben für welchen Kiefer."
            : "What type of dentition do you have? For partial or full dentures, please specify which jaw."}
        </p>

        <RadioGroup
          value={formData.zahngesundheit?.gebissTyp || ""}
          onValueChange={(v) => updateZahngesundheit("gebissTyp", v)}
          className="space-y-2"
        >
          {[
            { value: "vollstaendig", labelDe: "Vollständiges Gebiss (alle Zähne vorhanden)", labelEn: "Complete dentition (all teeth present)" },
            { value: "teilprothese", labelDe: "Teilprothese", labelEn: "Partial denture" },
            { value: "vollprothese", labelDe: "Vollprothese (Totalprothese)", labelEn: "Full denture (complete)" },
          ].map((option) => (
            <div key={option.value} className="flex items-center gap-2">
              <RadioGroupItem value={option.value} id={`gebiss-${option.value}`} />
              <Label htmlFor={`gebiss-${option.value}`} className="font-normal cursor-pointer">
                {language === "de" ? option.labelDe : option.labelEn}
              </Label>
            </div>
          ))}
        </RadioGroup>

        {(formData.zahngesundheit?.gebissTyp === "teilprothese" || formData.zahngesundheit?.gebissTyp === "vollprothese") && (
          <div className="pl-6 space-y-2">
            <Label className="text-sm">
              {language === "de" ? "Welcher Kiefer?" : "Which jaw?"}
            </Label>
            <div className="flex flex-wrap gap-4">
              {[
                { field: "oberkiefer", labelDe: "Oberkiefer", labelEn: "Upper jaw" },
                { field: "unterkiefer", labelDe: "Unterkiefer", labelEn: "Lower jaw" },
                { field: "beideKiefer", labelDe: "Beide Kiefer", labelEn: "Both jaws" },
              ].map((option) => (
                <div key={option.field} className="flex items-center gap-2">
                  <Checkbox
                    id={`prothese-${option.field}`}
                    checked={formData.zahngesundheit?.protheseKiefer?.[option.field as keyof typeof formData.zahngesundheit.protheseKiefer] || false}
                    onCheckedChange={(checked) => updateZahngesundheitSub("protheseKiefer", option.field, checked)}
                  />
                  <Label htmlFor={`prothese-${option.field}`} className="font-normal text-sm cursor-pointer">
                    {language === "de" ? option.labelDe : option.labelEn}
                  </Label>
                </div>
              ))}
            </div>
            <div className="space-y-1">
              <Label className="text-sm text-muted-foreground">
                {language === "de" ? "Seit wann?" : "Since when?"}
              </Label>
              <Input
                placeholder={language === "de" ? "z.B. 2018" : "e.g. 2018"}
                value={formData.zahngesundheit?.protheseSeit || ""}
                onChange={(e) => updateZahngesundheit("protheseSeit", e.target.value)}
                className="max-w-xs"
              />
            </div>
          </div>
        )}
      </div>

      <Separator />

      {/* Interaktives Zahnschema */}
      <div className="space-y-4">
        <h3 className="text-lg font-medium">
          {language === "de" ? "B. Zahnschema (FDI) – Befunde pro Zahn" : "B. Dental Chart (FDI) – Findings per Tooth"}
        </h3>
        <p className="text-sm text-muted-foreground">
          {language === "de"
            ? "Klicken Sie auf einen Zahn, um Befunde wie Karies, Krone, Wurzelbehandlung etc. zuzuweisen. Sie können mehrere Befunde pro Zahn auswählen."
            : "Click on a tooth to assign findings such as cavities, crowns, root canals, etc. You can select multiple findings per tooth."}
        </p>

        <DentalChart
          chartData={(formData.zahngesundheit?.zahnbefunde || {}) as DentalChartData}
          onChartDataChange={(data) => updateZahngesundheit("zahnbefunde", data)}
        />
      </div>

      <Separator />

      {/* Zahnfleisch / Parodontitis */}
      <div className="space-y-4">
        <h3 className="text-lg font-medium">
          {language === "de" ? "C. Zahnfleisch & Parodontitis" : "C. Gums & Periodontitis"}
        </h3>

        <div className="space-y-4">
          <div className="flex items-center space-x-2">
            <Checkbox
              id="parodontitis"
              checked={formData.zahngesundheit?.parodontitis?.ja || false}
              onCheckedChange={(checked) => updateZahngesundheitSub("parodontitis", "ja", checked)}
            />
            <Label htmlFor="parodontitis">
              {language === "de" ? "Parodontitis / Parodontose diagnostiziert" : "Periodontitis diagnosed"}
            </Label>
          </div>

          {formData.zahngesundheit?.parodontitis?.ja && (
            <div className="pl-6 space-y-3">
              <TemporalStatusSelect
                prefix="parodontitis"
                seitYear={formData.zahngesundheit?.parodontitis?.seitYear || ""}
                seitMonth={formData.zahngesundheit?.parodontitis?.seitMonth || ""}
                status={formData.zahngesundheit?.parodontitis?.status || ""}
                bisYear={formData.zahngesundheit?.parodontitis?.bisYear || ""}
                bisMonth={formData.zahngesundheit?.parodontitis?.bisMonth || ""}
                onSeitYearChange={(v) => updateZahngesundheitSub("parodontitis", "seitYear", v)}
                onSeitMonthChange={(v) => updateZahngesundheitSub("parodontitis", "seitMonth", v)}
                onStatusChange={(v) => updateZahngesundheitSub("parodontitis", "status", v)}
                onBisYearChange={(v) => updateZahngesundheitSub("parodontitis", "bisYear", v)}
                onBisMonthChange={(v) => updateZahngesundheitSub("parodontitis", "bisMonth", v)}
                birthYear={birthYear}
              />
              <div className="flex flex-wrap gap-4">
                {[
                  { field: "leicht", labelDe: "Leicht", labelEn: "Mild" },
                  { field: "mittel", labelDe: "Mittel", labelEn: "Moderate" },
                  { field: "schwer", labelDe: "Schwer", labelEn: "Severe" },
                ].map((option) => (
                  <div key={option.field} className="flex items-center gap-2">
                    <Checkbox
                      id={`paro-${option.field}`}
                      checked={!!(formData.zahngesundheit?.parodontitis as any)?.[option.field] || false}
                      onCheckedChange={(checked) => updateZahngesundheitSub("parodontitis", option.field, checked)}
                    />
                    <Label htmlFor={`paro-${option.field}`} className="font-normal text-sm">
                      {language === "de" ? option.labelDe : option.labelEn}
                    </Label>
                  </div>
                ))}
              </div>
            </div>
          )}

          <div className="flex items-center space-x-2">
            <Checkbox
              id="zahnfleischbluten"
              checked={formData.zahngesundheit?.zahnfleischbluten?.ja || false}
              onCheckedChange={(checked) => updateZahngesundheitSub("zahnfleischbluten", "ja", checked)}
            />
            <Label htmlFor="zahnfleischbluten">
              {language === "de" ? "Häufiges Zahnfleischbluten" : "Frequent bleeding gums"}
            </Label>
          </div>

          {formData.zahngesundheit?.zahnfleischbluten?.ja && (
            <div className="pl-6">
              <TemporalStatusSelect
                prefix="zahnfleischbluten"
                seitYear={formData.zahngesundheit?.zahnfleischbluten?.seitYear || ""}
                seitMonth={formData.zahngesundheit?.zahnfleischbluten?.seitMonth || ""}
                status={formData.zahngesundheit?.zahnfleischbluten?.status || ""}
                bisYear={formData.zahngesundheit?.zahnfleischbluten?.bisYear || ""}
                bisMonth={formData.zahngesundheit?.zahnfleischbluten?.bisMonth || ""}
                onSeitYearChange={(v) => updateZahngesundheitSub("zahnfleischbluten", "seitYear", v)}
                onSeitMonthChange={(v) => updateZahngesundheitSub("zahnfleischbluten", "seitMonth", v)}
                onStatusChange={(v) => updateZahngesundheitSub("zahnfleischbluten", "status", v)}
                onBisYearChange={(v) => updateZahngesundheitSub("zahnfleischbluten", "bisYear", v)}
                onBisMonthChange={(v) => updateZahngesundheitSub("zahnfleischbluten", "bisMonth", v)}
                birthYear={birthYear}
              />
            </div>
          )}
        </div>
      </div>

      <Separator />

      {/* Kiefergelenk */}
      <div className="space-y-4">
        <h3 className="text-lg font-medium">
          {language === "de" ? "D. Kiefergelenk & Bruxismus" : "D. TMJ & Bruxism"}
        </h3>

        <div className="space-y-3">
          <div className="flex items-center space-x-2">
            <Checkbox
              id="kiefergelenkprobleme"
              checked={formData.zahngesundheit?.kiefergelenk?.ja || false}
              onCheckedChange={(checked) => updateZahngesundheitSub("kiefergelenk", "ja", checked)}
            />
            <Label htmlFor="kiefergelenkprobleme">
              {language === "de" ? "Kiefergelenkprobleme (CMD)" : "TMJ problems (TMD)"}
            </Label>
          </div>

          {formData.zahngesundheit?.kiefergelenk?.ja && (
            <div className="pl-6 flex flex-wrap gap-4">
              {[
                { field: "knacken", labelDe: "Knacken", labelEn: "Clicking" },
                { field: "schmerzen", labelDe: "Schmerzen", labelEn: "Pain" },
                { field: "eingeschraenkt", labelDe: "Eingeschränkte Öffnung", labelEn: "Limited opening" },
              ].map((option) => (
                <div key={option.field} className="flex items-center gap-2">
                  <Checkbox
                    id={`kiefer-${option.field}`}
                    checked={formData.zahngesundheit?.kiefergelenk?.[option.field as keyof typeof formData.zahngesundheit.kiefergelenk] || false}
                    onCheckedChange={(checked) => updateZahngesundheitSub("kiefergelenk", option.field, checked)}
                  />
                  <Label htmlFor={`kiefer-${option.field}`} className="font-normal text-sm">
                    {language === "de" ? option.labelDe : option.labelEn}
                  </Label>
                </div>
              ))}
            </div>
          )}

          <div className="flex items-center space-x-2">
            <Checkbox
              id="bruxismus"
              checked={formData.zahngesundheit?.bruxismus?.ja || false}
              onCheckedChange={(checked) => updateZahngesundheitSub("bruxismus", "ja", checked)}
            />
            <Label htmlFor="bruxismus">
              {language === "de" ? "Zähneknirschen / Bruxismus" : "Teeth grinding / Bruxism"}
            </Label>
          </div>

          {formData.zahngesundheit?.bruxismus?.ja && (
            <div className="pl-6 space-y-2">
              <div className="flex flex-wrap gap-4">
                {[
                  { field: "nachts", labelDe: "Nachts", labelEn: "At night" },
                  { field: "tagsueber", labelDe: "Tagsüber", labelEn: "During the day" },
                  { field: "schiene", labelDe: "Aufbissschiene vorhanden", labelEn: "Bite guard available" },
                ].map((option) => (
                  <div key={option.field} className="flex items-center gap-2">
                    <Checkbox
                      id={`brux-${option.field}`}
                      checked={formData.zahngesundheit?.bruxismus?.[option.field as keyof typeof formData.zahngesundheit.bruxismus] || false}
                      onCheckedChange={(checked) => updateZahngesundheitSub("bruxismus", option.field, checked)}
                    />
                    <Label htmlFor={`brux-${option.field}`} className="font-normal text-sm">
                      {language === "de" ? option.labelDe : option.labelEn}
                    </Label>
                  </div>
                ))}
              </div>
            </div>
          )}
        </div>
      </div>

      <Separator />

      {/* Letzte Zahnarztbesuche & Bemerkungen */}
      <div className="space-y-4">
        <h3 className="text-lg font-medium">
          {language === "de" ? "E. Zahnarzt & Bemerkungen" : "E. Dentist & Notes"}
        </h3>

        <div className="grid gap-4 md:grid-cols-2">
          <div className="space-y-2">
            <Label>{language === "de" ? "Letzter Zahnarztbesuch" : "Last dental visit"}</Label>
            <Input
              placeholder={language === "de" ? "z.B. Oktober 2025" : "e.g. October 2025"}
              value={formData.zahngesundheit?.letzterZahnarztbesuch || ""}
              onChange={(e) => updateZahngesundheit("letzterZahnarztbesuch", e.target.value)}
            />
          </div>
          <div className="space-y-2">
            <Label>{language === "de" ? "Zahnarzt / Zahnarztpraxis" : "Dentist / Dental practice"}</Label>
            <Input
              placeholder={language === "de" ? "Name des Zahnarztes" : "Name of dentist"}
              value={formData.zahngesundheit?.zahnarztName || ""}
              onChange={(e) => updateZahngesundheit("zahnarztName", e.target.value)}
            />
          </div>
        </div>

        <div className="space-y-2">
          <Label>{language === "de" ? "Weitere Bemerkungen zur Zahngesundheit" : "Additional notes on dental health"}</Label>
          <Textarea
            placeholder={language === "de"
              ? "z.B. Angst vor Zahnarztbesuchen, Mundtrockenheit, besondere Zahnpflegegewohnheiten..."
              : "e.g. Dental anxiety, dry mouth, special dental care habits..."}
            value={formData.zahngesundheit?.bemerkungen || ""}
            onChange={(e) => updateZahngesundheit("bemerkungen", e.target.value)}
            rows={3}
          />
        </div>
      </div>
    </div>
  );
};

export default DentalSection;
