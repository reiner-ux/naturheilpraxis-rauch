import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { Textarea } from "@/components/ui/textarea";
import { RadioGroup, RadioGroupItem } from "@/components/ui/radio-group";
import { Checkbox } from "@/components/ui/checkbox";
import { useLanguage } from "@/contexts/LanguageContext";
import { AnamneseFormData } from "@/lib/anamneseFormData";
import { Separator } from "@/components/ui/separator";
import NumericInput from "./shared/NumericInput";
import TemporalStatusSelect from "./shared/TemporalStatusSelect";

interface WomenHealthSectionProps {
  formData: AnamneseFormData;
  updateFormData: (field: string, value: any) => void;
}

const WomenHealthSection = ({ formData, updateFormData }: WomenHealthSectionProps) => {
  const { language } = useLanguage();

  const birthYear = formData.geburtsdatum
    ? new Date(formData.geburtsdatum).getFullYear()
    : undefined;

  const updateFrauengesundheit = (field: string, value: any) => {
    updateFormData("frauengesundheit", {
      ...formData.frauengesundheit,
      [field]: value
    });
  };

  const updateNestedField = (parentField: string, field: string, value: any) => {
    updateFormData("frauengesundheit", {
      ...formData.frauengesundheit,
      [parentField]: {
        ...(formData.frauengesundheit[parentField as keyof typeof formData.frauengesundheit] as object),
        [field]: value
      }
    });
  };

  const parseYearMonth = (raw: string) => {
    if (!raw) return { year: "", month: "" };
    const m = raw.match(/^(\d{4})(?:-(\d{2}))?$/);
    if (!m) return { year: "", month: "" };
    return { year: m[1] ?? "", month: m[2] ?? "" };
  };

  const setYearMonth = (parentField: string, timeKey: string, next: { year?: string; month?: string }) => {
    const parent = formData.frauengesundheit?.[parentField as keyof typeof formData.frauengesundheit] as any || {};
    const currentRaw = String(parent?.[timeKey] || parent?.jahr || "");
    const current = parseYearMonth(currentRaw);
    const year = (next.year ?? current.year).slice(0, 4);
    const month = (next.month ?? current.month).slice(0, 2);
    const combined = month ? `${year}-${month}` : year;
    updateNestedField(parentField, timeKey, combined);
  };

  const renderGynConditionWithTemporal = (
    parentField: string,
    labelDe: string,
    labelEn: string,
    extraContent?: React.ReactNode,
    subOptions?: { key: string; labelDe: string; labelEn: string }[]
  ) => {
    const parent = formData.frauengesundheit?.[parentField as keyof typeof formData.frauengesundheit] as any || {};
    const seitParsed = parseYearMonth(parent?.seit || parent?.jahr || "");
    const bisParsed = parseYearMonth(parent?.bisJahr || "");

    return (
      <div className="space-y-2">
        <div className="flex items-center space-x-2">
          <Checkbox
            id={parentField}
            checked={parent?.ja || false}
            onCheckedChange={(checked) => updateNestedField(parentField, "ja", checked)}
          />
          <Label htmlFor={parentField}>{language === "de" ? labelDe : labelEn}</Label>
        </div>
        {parent?.ja && (
          <div className="pl-6 space-y-3">
            {subOptions && subOptions.length > 0 && (
              <div className="flex flex-wrap gap-4">
                {subOptions.map(opt => (
                  <div key={opt.key} className="flex items-center space-x-2">
                    <Checkbox
                      checked={!!parent?.[opt.key]}
                      onCheckedChange={(checked) => updateNestedField(parentField, opt.key, !!checked)}
                    />
                    <Label className="font-normal text-sm">{language === "de" ? opt.labelDe : opt.labelEn}</Label>
                  </div>
                ))}
              </div>
            )}
            {extraContent}
            <TemporalStatusSelect
              prefix={parentField}
              seitYear={seitParsed.year}
              seitMonth={seitParsed.month}
              status={parent?.status || ""}
              bisYear={bisParsed.year}
              bisMonth={bisParsed.month}
              onSeitYearChange={(v) => setYearMonth(parentField, "seit", { year: v })}
              onSeitMonthChange={(v) => setYearMonth(parentField, "seit", { month: v })}
              onStatusChange={(v) => updateNestedField(parentField, "status", v)}
              onBisYearChange={(v) => setYearMonth(parentField, "bisJahr", { year: v })}
              onBisMonthChange={(v) => setYearMonth(parentField, "bisJahr", { month: v })}
              birthYear={birthYear}
            />
          </div>
        )}
      </div>
    );
  };

  return (
    <div className="space-y-8">
      <p className="text-sm text-muted-foreground italic">
        {language === "de"
          ? "Dieser Abschnitt ist nur für Patientinnen relevant. Männliche Patienten können diesen Bereich überspringen."
          : "This section is only relevant for female patients. Male patients may skip this section."}
      </p>

      {/* Geburtsgewicht & Frühgeburt */}
      <div className="space-y-4">
        <h3 className="text-lg font-medium">
          {language === "de" ? "Geburt" : "Birth"}
        </h3>

        <div className="grid gap-4 md:grid-cols-2">
          <div className="space-y-2">
            <Label htmlFor="geburtsgewicht">
              {language === "de" ? "Eigenes Geburtsgewicht (falls bekannt)" : "Own birth weight (if known)"}
            </Label>
            <Input
              id="geburtsgewicht"
              value={formData.frauengesundheit?.geburtsgewicht || ""}
              onChange={(e) => updateFrauengesundheit("geburtsgewicht", e.target.value)}
              placeholder={language === "de" ? "z.B. 3200g" : "e.g. 3200g"}
            />
          </div>

          <div className="space-y-2">
            <div className="flex items-center space-x-2">
              <Checkbox
                id="fruehgeburt"
                checked={formData.frauengesundheit?.fruehgeburt?.ja || false}
                onCheckedChange={(checked) => updateNestedField("fruehgeburt", "ja", checked)}
              />
              <Label htmlFor="fruehgeburt">
                {language === "de" ? "Frühgeburt" : "Premature birth"}
              </Label>
            </div>
            {formData.frauengesundheit?.fruehgeburt?.ja && (
              <NumericInput
                placeholder={language === "de" ? "Welche Woche?" : "Which week?"}
                value={formData.frauengesundheit?.fruehgeburt?.woche || ""}
                onChange={(val) => updateNestedField("fruehgeburt", "woche", val)}
                min={20}
                max={42}
              />
            )}
          </div>
        </div>
      </div>

      <Separator />

      {/* Gynäkologische Erkrankungen */}
      <div className="space-y-4">
        <h3 className="text-lg font-medium">
          {language === "de" ? "Gynäkologische Erkrankungen" : "Gynecological Conditions"}
        </h3>

        {renderGynConditionWithTemporal("gebaermuttererkrankung", "Gebärmuttererkrankung", "Uterine condition", (
          <Input
            placeholder={language === "de" ? "Welche Erkrankung?" : "Which condition?"}
            value={(formData.frauengesundheit?.gebaermuttererkrankung as any)?.welche || ""}
            onChange={(e) => updateNestedField("gebaermuttererkrankung", "welche", e.target.value)}
          />
        ))}

        {renderGynConditionWithTemporal("gebaermutterentfernung", "Gebärmutterentfernung (Hysterektomie)", "Hysterectomy", undefined, [
          { key: "teilweise", labelDe: "Teilweise", labelEn: "Partial" },
          { key: "vollstaendig", labelDe: "Vollständig", labelEn: "Complete" },
        ])}

        {renderGynConditionWithTemporal("eierstockentfernung", "Eierstockentfernung (Oophorektomie)", "Oophorectomy", undefined, [
          { key: "einseitig", labelDe: "Einseitig", labelEn: "Unilateral" },
          { key: "beidseitig", labelDe: "Beidseitig", labelEn: "Bilateral" },
        ])}

        {renderGynConditionWithTemporal("gebaermutterausschabung", "Gebärmutterausschabung (Kürettage)", "Dilation and Curettage (D&C)", (
          <Input
            placeholder={language === "de" ? "Grund" : "Reason"}
            value={(formData.frauengesundheit?.gebaermutterausschabung as any)?.grund || ""}
            onChange={(e) => updateNestedField("gebaermutterausschabung", "grund", e.target.value)}
          />
        ))}

        {renderGynConditionWithTemporal("eierstockzyste", "Eierstockzyste", "Ovarian Cyst")}

        {renderGynConditionWithTemporal("endometriose", "Endometriose", "Endometriosis", (
          <Input
            placeholder={language === "de" ? "Stadium (falls bekannt)" : "Stage (if known)"}
            value={(formData.frauengesundheit?.endometriose as any)?.stadium || ""}
            onChange={(e) => updateNestedField("endometriose", "stadium", e.target.value)}
          />
        ))}

        {renderGynConditionWithTemporal("myome", "Myome (Gebärmuttermyome)", "Uterine Fibroids")}
      </div>

      <Separator />

      {/* Hormone & Verhütung */}
      <div className="space-y-4">
        <h3 className="text-lg font-medium">
          {language === "de" ? "Hormone & Verhütung" : "Hormones & Contraception"}
        </h3>

        <div className="grid gap-4 md:grid-cols-2">
          {renderGynConditionWithTemporal("pille", "Pille eingenommen", "Took contraceptive pill")}
          {renderGynConditionWithTemporal("hormonbehandlung", "Hormonbehandlung", "Hormone treatment", (
            <Input
              placeholder={language === "de" ? "Welche Behandlung?" : "Which treatment?"}
              value={(formData.frauengesundheit?.hormonbehandlung as any)?.welche || ""}
              onChange={(e) => updateNestedField("hormonbehandlung", "welche", e.target.value)}
            />
          ))}
        </div>
      </div>

      <Separator />

      {/* Menstruation */}
      <div className="space-y-4">
        <h3 className="text-lg font-medium">
          {language === "de" ? "Menstruation" : "Menstruation"}
        </h3>

        <div className="space-y-4">
          <div className="flex items-center space-x-2">
            <Checkbox
              id="periodeNormal"
              checked={formData.frauengesundheit?.periodeNormal?.ja || false}
              onCheckedChange={(checked) => updateNestedField("periodeNormal", "ja", checked)}
            />
            <Label htmlFor="periodeNormal">
              {language === "de" ? "Normale/regelmäßige Periode" : "Normal/regular period"}
            </Label>
          </div>
          {formData.frauengesundheit?.periodeNormal?.ja && (
            <div className="space-y-2 max-w-xs">
              <Label>{language === "de" ? "Zykluslänge in Tagen (normal: 23-38)" : "Cycle length in days (normal: 23-38)"}</Label>
              <NumericInput
                value={formData.frauengesundheit?.periodeNormal?.zyklusTage || ""}
                onChange={(val) => updateNestedField("periodeNormal", "zyklusTage", val)}
                min={1}
                max={99}
              />
              {formData.frauengesundheit?.periodeNormal?.zyklusTage && (
                (() => {
                  const days = Number(formData.frauengesundheit.periodeNormal.zyklusTage);
                  if (days < 23 || days > 38) {
                    return (
                      <p className="text-xs text-amber-600">
                        {language === "de"
                          ? "Hinweis: Ein Zyklus außerhalb von 23-38 Tagen wird bei der Auswertung extra vermerkt."
                          : "Note: A cycle outside 23-38 days will be noted in the evaluation."}
                      </p>
                    );
                  }
                  return null;
                })()
              )}
            </div>
          )}

          <div className="flex flex-wrap gap-4">
            <div className="flex items-center space-x-2">
              <Checkbox
                id="periodeSchwach"
                checked={formData.frauengesundheit?.periodeSchwach?.ja || false}
                onCheckedChange={(checked) => updateNestedField("periodeSchwach", "ja", checked)}
              />
              <Label htmlFor="periodeSchwach" className="font-normal">
                {language === "de" ? "Schwache Periode" : "Light period"}
              </Label>
            </div>

            <div className="flex items-center space-x-2">
              <Checkbox
                id="periodeStark"
                checked={formData.frauengesundheit?.periodeStark || false}
                onCheckedChange={(checked) => updateFrauengesundheit("periodeStark", checked)}
              />
              <Label htmlFor="periodeStark" className="font-normal">
                {language === "de" ? "Starke Periode" : "Heavy period"}
              </Label>
            </div>

            <div className="flex items-center space-x-2">
              <Checkbox
                id="periodeUnregelmaessig"
                checked={formData.frauengesundheit?.periodeUnregelmaessig?.ja || false}
                onCheckedChange={(checked) => updateNestedField("periodeUnregelmaessig", "ja", checked)}
              />
              <Label htmlFor="periodeUnregelmaessig" className="font-normal">
                {language === "de" ? "Unregelmäßige Periode" : "Irregular period"}
              </Label>
            </div>
          </div>

          {formData.frauengesundheit?.periodeSchwach?.ja && (
            <div className="space-y-2 max-w-xs">
              <Label>{language === "de" ? "Dauer der Blutung (Tage)" : "Duration of bleeding (days)"}</Label>
              <NumericInput
                value={formData.frauengesundheit?.periodeSchwach?.tageBlutung || ""}
                onChange={(val) => updateNestedField("periodeSchwach", "tageBlutung", val)}
                min={1}
                max={14}
              />
            </div>
          )}

          {formData.frauengesundheit?.periodeUnregelmaessig?.ja && (
            <Input
              className="max-w-md"
              placeholder={language === "de" ? "Muster beschreiben" : "Describe pattern"}
              value={formData.frauengesundheit?.periodeUnregelmaessig?.muster || ""}
              onChange={(e) => updateNestedField("periodeUnregelmaessig", "muster", e.target.value)}
            />
          )}

          <div className="space-y-2">
            <div className="flex items-center space-x-2">
              <Checkbox
                id="periodenbeschwerden"
                checked={formData.frauengesundheit?.periodenbeschwerden?.ja || false}
                onCheckedChange={(checked) => updateNestedField("periodenbeschwerden", "ja", checked)}
              />
              <Label htmlFor="periodenbeschwerden">
                {language === "de" ? "Periodenbeschwerden" : "Menstrual complaints"}
              </Label>
            </div>
            {formData.frauengesundheit?.periodenbeschwerden?.ja && (
              <div className="flex flex-wrap gap-4 pl-6">
                {[
                  { field: "schmerz", labelDe: "Schmerzen", labelEn: "Pain" },
                  { field: "uebelkeit", labelDe: "Übelkeit", labelEn: "Nausea" },
                  { field: "kopf", labelDe: "Kopfschmerzen", labelEn: "Headache" },
                  { field: "sonstige", labelDe: "Sonstige", labelEn: "Other" },
                ].map((option) => (
                  <div key={option.field} className="flex items-center space-x-2">
                    <Checkbox
                      id={`periodenbeschwerden-${option.field}`}
                      checked={formData.frauengesundheit?.periodenbeschwerden?.[option.field as keyof typeof formData.frauengesundheit.periodenbeschwerden] || false}
                      onCheckedChange={(checked) => updateNestedField("periodenbeschwerden", option.field, checked)}
                    />
                    <Label htmlFor={`periodenbeschwerden-${option.field}`} className="font-normal text-sm">
                      {language === "de" ? option.labelDe : option.labelEn}
                    </Label>
                  </div>
                ))}
              </div>
            )}
          </div>
        </div>
      </div>

      <Separator />

      {/* Menopause */}
      {renderGynConditionWithTemporal("menopause", "Menopause / Wechseljahre", "Menopause", (
        <Input
          placeholder={language === "de" ? "Symptome (z.B. Hitzewallungen)" : "Symptoms (e.g. hot flashes)"}
          value={(formData.frauengesundheit?.menopause as any)?.symptome || ""}
          onChange={(e) => updateNestedField("menopause", "symptome", e.target.value)}
        />
      ))}

      <Separator />

      {/* Schwangerschaften */}
      <div className="space-y-4">
        <h3 className="text-lg font-medium">
          {language === "de" ? "Schwangerschaften & Geburten" : "Pregnancies & Births"}
        </h3>

        <div className="grid gap-4 md:grid-cols-2">
          <div className="space-y-2">
            <Label>{language === "de" ? "Anzahl Schwangerschaften (max. 10)" : "Number of pregnancies (max 10)"}</Label>
            <NumericInput
              value={formData.frauengesundheit?.schwangerschaften?.anzahl || ""}
              onChange={(val) => updateNestedField("schwangerschaften", "anzahl", val)}
              min={0}
              max={10}
            />
          </div>

          <div className="space-y-2">
            <Label>{language === "de" ? "Anzahl Fehlgeburten (max. 10)" : "Number of miscarriages (max 10)"}</Label>
            <NumericInput
              value={formData.frauengesundheit?.fehlgeburten?.anzahl || ""}
              onChange={(val) => updateNestedField("fehlgeburten", "anzahl", val)}
              min={0}
              max={10}
            />
          </div>
        </div>

        <div className="space-y-2">
          <Label>{language === "de" ? "Anzahl Geburten" : "Number of births"}</Label>
          <div className="flex flex-wrap gap-4">
            <NumericInput
              className="w-24"
              value={formData.frauengesundheit?.geburten?.anzahl || ""}
              onChange={(val) => updateNestedField("geburten", "anzahl", val)}
              min={0}
              max={15}
            />
            <div className="flex items-center space-x-2">
              <Checkbox
                id="geburten-vaginal"
                checked={formData.frauengesundheit?.geburten?.vaginal || false}
                onCheckedChange={(checked) => updateNestedField("geburten", "vaginal", checked)}
              />
              <Label htmlFor="geburten-vaginal" className="font-normal text-sm">
                {language === "de" ? "Vaginal" : "Vaginal"}
              </Label>
            </div>
            <div className="flex items-center space-x-2">
              <Checkbox
                id="geburten-kaiserschnitt"
                checked={formData.frauengesundheit?.geburten?.kaiserschnitt || false}
                onCheckedChange={(checked) => updateNestedField("geburten", "kaiserschnitt", checked)}
              />
              <Label htmlFor="geburten-kaiserschnitt" className="font-normal text-sm">
                {language === "de" ? "Kaiserschnitt" : "C-section"}
              </Label>
            </div>
          </div>
        </div>

        {renderGynConditionWithTemporal("wochenbettdepression", "Wochenbettdepression", "Postpartum depression", (
          <div>
            <Label>{language === "de" ? "Nach welcher Geburt?" : "After which birth?"}</Label>
            <NumericInput
              className="w-24 mt-1"
              value={(formData.frauengesundheit?.wochenbettdepression as any)?.nachGeburt || ""}
              onChange={(val) => updateNestedField("wochenbettdepression", "nachGeburt", val)}
              min={1}
              max={15}
            />
          </div>
        ))}
      </div>

      <Separator />

      {/* Sonstiges */}
      <div className="space-y-2">
        <Label htmlFor="sonstige-frauen">
          {language === "de" ? "Sonstige gynäkologische Angaben" : "Other gynecological information"}
        </Label>
        <Textarea
          id="sonstige-frauen"
          value={formData.frauengesundheit?.sonstige || ""}
          onChange={(e) => updateFrauengesundheit("sonstige", e.target.value)}
          rows={3}
        />
      </div>
    </div>
  );
};

export default WomenHealthSection;
