import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { Textarea } from "@/components/ui/textarea";
import { RadioGroup, RadioGroupItem } from "@/components/ui/radio-group";
import { Checkbox } from "@/components/ui/checkbox";
import { useLanguage } from "@/contexts/LanguageContext";
import { AnamneseFormData } from "@/lib/anamneseFormData";
import { Separator } from "@/components/ui/separator";
import YearMonthSelect from "./shared/YearMonthSelect";
import NumericInput from "./shared/NumericInput";

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

        <div className="space-y-4">
          <div className="flex items-center space-x-2">
            <Checkbox
              id="gebaermuttererkrankung"
              checked={formData.frauengesundheit?.gebaermuttererkrankung?.ja || false}
              onCheckedChange={(checked) => updateNestedField("gebaermuttererkrankung", "ja", checked)}
            />
            <Label htmlFor="gebaermuttererkrankung">
              {language === "de" ? "Gebärmuttererkrankung" : "Uterine condition"}
            </Label>
          </div>
          {formData.frauengesundheit?.gebaermuttererkrankung?.ja && (
            <Input
              placeholder={language === "de" ? "Welche Erkrankung?" : "Which condition?"}
              value={formData.frauengesundheit?.gebaermuttererkrankung?.welche || ""}
              onChange={(e) => updateNestedField("gebaermuttererkrankung", "welche", e.target.value)}
            />
          )}
        </div>

        {/* Gebärmutterentfernung */}
        <div className="space-y-2">
          <div className="flex items-center space-x-2">
            <Checkbox
              id="gebaermutterentfernung"
              checked={formData.frauengesundheit?.gebaermutterentfernung?.ja || false}
              onCheckedChange={(checked) => updateNestedField("gebaermutterentfernung", "ja", checked)}
            />
            <Label htmlFor="gebaermutterentfernung">
              {language === "de" ? "Gebärmutterentfernung (Hysterektomie)" : "Hysterectomy"}
            </Label>
          </div>
          {formData.frauengesundheit?.gebaermutterentfernung?.ja && (
            <div className="grid gap-4 md:grid-cols-2 pl-6">
              <YearMonthSelect
                yearValue={formData.frauengesundheit?.gebaermutterentfernung?.jahr || ""}
                onYearChange={(value) => updateNestedField("gebaermutterentfernung", "jahr", value)}
                showMonth={false}
                birthYear={birthYear}
              />
              <div className="flex flex-wrap gap-4">
                <div className="flex items-center space-x-2">
                  <Checkbox
                    id="gebaermutter-teilweise"
                    checked={formData.frauengesundheit?.gebaermutterentfernung?.teilweise || false}
                    onCheckedChange={(checked) => updateNestedField("gebaermutterentfernung", "teilweise", checked)}
                  />
                  <Label htmlFor="gebaermutter-teilweise" className="font-normal text-sm">
                    {language === "de" ? "Teilweise" : "Partial"}
                  </Label>
                </div>
                <div className="flex items-center space-x-2">
                  <Checkbox
                    id="gebaermutter-vollstaendig"
                    checked={formData.frauengesundheit?.gebaermutterentfernung?.vollstaendig || false}
                    onCheckedChange={(checked) => updateNestedField("gebaermutterentfernung", "vollstaendig", checked)}
                  />
                  <Label htmlFor="gebaermutter-vollstaendig" className="font-normal text-sm">
                    {language === "de" ? "Vollständig" : "Complete"}
                  </Label>
                </div>
              </div>
            </div>
          )}
        </div>

        {/* Eierstockentfernung */}
        <div className="space-y-2">
          <div className="flex items-center space-x-2">
            <Checkbox
              id="eierstockentfernung"
              checked={formData.frauengesundheit?.eierstockentfernung?.ja || false}
              onCheckedChange={(checked) => updateNestedField("eierstockentfernung", "ja", checked)}
            />
            <Label htmlFor="eierstockentfernung">
              {language === "de" ? "Eierstockentfernung (Oophorektomie)" : "Oophorectomy"}
            </Label>
          </div>
          {formData.frauengesundheit?.eierstockentfernung?.ja && (
            <div className="grid gap-4 md:grid-cols-2 pl-6">
              <YearMonthSelect
                yearValue={formData.frauengesundheit?.eierstockentfernung?.jahr || ""}
                onYearChange={(value) => updateNestedField("eierstockentfernung", "jahr", value)}
                showMonth={false}
                birthYear={birthYear}
              />
              <div className="flex flex-wrap gap-4">
                <div className="flex items-center space-x-2">
                  <Checkbox
                    id="eierstock-einseitig"
                    checked={formData.frauengesundheit?.eierstockentfernung?.einseitig || false}
                    onCheckedChange={(checked) => updateNestedField("eierstockentfernung", "einseitig", checked)}
                  />
                  <Label htmlFor="eierstock-einseitig" className="font-normal text-sm">
                    {language === "de" ? "Einseitig" : "Unilateral"}
                  </Label>
                </div>
                <div className="flex items-center space-x-2">
                  <Checkbox
                    id="eierstock-beidseitig"
                    checked={formData.frauengesundheit?.eierstockentfernung?.beidseitig || false}
                    onCheckedChange={(checked) => updateNestedField("eierstockentfernung", "beidseitig", checked)}
                  />
                  <Label htmlFor="eierstock-beidseitig" className="font-normal text-sm">
                    {language === "de" ? "Beidseitig" : "Bilateral"}
                  </Label>
                </div>
              </div>
            </div>
          )}
        </div>

        {/* Gebärmutterausschabung */}
        <div className="space-y-2">
          <div className="flex items-center space-x-2">
            <Checkbox
              id="gebaermutterausschabung"
              checked={formData.frauengesundheit?.gebaermutterausschabung?.ja || false}
              onCheckedChange={(checked) => updateNestedField("gebaermutterausschabung", "ja", checked)}
            />
            <Label htmlFor="gebaermutterausschabung">
              {language === "de" ? "Gebärmutterausschabung (Kürettage)" : "Dilation and Curettage (D&C)"}
            </Label>
          </div>
          {formData.frauengesundheit?.gebaermutterausschabung?.ja && (
            <div className="grid gap-4 md:grid-cols-2 pl-6">
              <YearMonthSelect
                yearValue={formData.frauengesundheit?.gebaermutterausschabung?.jahr || ""}
                onYearChange={(value) => updateNestedField("gebaermutterausschabung", "jahr", value)}
                showMonth={false}
                birthYear={birthYear}
              />
              <Input
                placeholder={language === "de" ? "Grund" : "Reason"}
                value={formData.frauengesundheit?.gebaermutterausschabung?.grund || ""}
                onChange={(e) => updateNestedField("gebaermutterausschabung", "grund", e.target.value)}
              />
            </div>
          )}
        </div>

        {/* Eierstockzyste */}
        <div className="space-y-2">
          <div className="flex items-center space-x-2">
            <Checkbox
              id="eierstockzyste"
              checked={formData.frauengesundheit?.eierstockzyste?.ja || false}
              onCheckedChange={(checked) => updateNestedField("eierstockzyste", "ja", checked)}
            />
            <Label htmlFor="eierstockzyste">
              {language === "de" ? "Eierstockzyste" : "Ovarian Cyst"}
            </Label>
          </div>
          {formData.frauengesundheit?.eierstockzyste?.ja && (
            <div className="pl-6">
              <YearMonthSelect
                yearValue={formData.frauengesundheit?.eierstockzyste?.jahr || ""}
                onYearChange={(value) => updateNestedField("eierstockzyste", "jahr", value)}
                showMonth={false}
                birthYear={birthYear}
              />
            </div>
          )}
        </div>

        {/* Endometriose */}
        <div className="space-y-2">
          <div className="flex items-center space-x-2">
            <Checkbox
              id="endometriose"
              checked={formData.frauengesundheit?.endometriose?.ja || false}
              onCheckedChange={(checked) => updateNestedField("endometriose", "ja", checked)}
            />
            <Label htmlFor="endometriose">
              {language === "de" ? "Endometriose" : "Endometriosis"}
            </Label>
          </div>
          {formData.frauengesundheit?.endometriose?.ja && (
            <div className="grid gap-4 md:grid-cols-2 pl-6">
              <YearMonthSelect
                yearValue={formData.frauengesundheit?.endometriose?.jahr || ""}
                onYearChange={(value) => updateNestedField("endometriose", "jahr", value)}
                showMonth={false}
                birthYear={birthYear}
              />
              <Input
                placeholder={language === "de" ? "Stadium (falls bekannt)" : "Stage (if known)"}
                value={formData.frauengesundheit?.endometriose?.stadium || ""}
                onChange={(e) => updateNestedField("endometriose", "stadium", e.target.value)}
              />
            </div>
          )}
        </div>

        {/* Myome */}
        <div className="space-y-2">
          <div className="flex items-center space-x-2">
            <Checkbox
              id="myome"
              checked={formData.frauengesundheit?.myome?.ja || false}
              onCheckedChange={(checked) => updateNestedField("myome", "ja", checked)}
            />
            <Label htmlFor="myome">
              {language === "de" ? "Myome (Gebärmuttermyome)" : "Uterine Fibroids"}
            </Label>
          </div>
          {formData.frauengesundheit?.myome?.ja && (
            <div className="pl-6">
              <YearMonthSelect
                yearValue={formData.frauengesundheit?.myome?.jahr || ""}
                onYearChange={(value) => updateNestedField("myome", "jahr", value)}
                showMonth={false}
                birthYear={birthYear}
              />
            </div>
          )}
        </div>
      </div>

      <Separator />

      {/* Hormone & Verhütung */}
      <div className="space-y-4">
        <h3 className="text-lg font-medium">
          {language === "de" ? "Hormone & Verhütung" : "Hormones & Contraception"}
        </h3>

        <div className="grid gap-4 md:grid-cols-2">
          <div className="space-y-2">
            <div className="flex items-center space-x-2">
              <Checkbox
                id="pille"
                checked={formData.frauengesundheit?.pille?.ja || false}
                onCheckedChange={(checked) => updateNestedField("pille", "ja", checked)}
              />
              <Label htmlFor="pille">
                {language === "de" ? "Pille eingenommen" : "Took contraceptive pill"}
              </Label>
            </div>
            {formData.frauengesundheit?.pille?.ja && (
              <div className="grid gap-2 grid-cols-2 pl-6">
                <YearMonthSelect
                  yearValue={formData.frauengesundheit?.pille?.von || ""}
                  onYearChange={(value) => updateNestedField("pille", "von", value)}
                  showMonth={false}
                  birthYear={birthYear}
                  placeholder={language === "de" ? "Von" : "From"}
                />
                <YearMonthSelect
                  yearValue={formData.frauengesundheit?.pille?.bis || ""}
                  onYearChange={(value) => updateNestedField("pille", "bis", value)}
                  showMonth={false}
                  birthYear={birthYear}
                  placeholder={language === "de" ? "Bis" : "To"}
                />
              </div>
            )}
          </div>

          <div className="space-y-2">
            <div className="flex items-center space-x-2">
              <Checkbox
                id="hormonbehandlung"
                checked={formData.frauengesundheit?.hormonbehandlung?.ja || false}
                onCheckedChange={(checked) => updateNestedField("hormonbehandlung", "ja", checked)}
              />
              <Label htmlFor="hormonbehandlung">
                {language === "de" ? "Hormonbehandlung" : "Hormone treatment"}
              </Label>
            </div>
            {formData.frauengesundheit?.hormonbehandlung?.ja && (
              <Input
                className="pl-6"
                placeholder={language === "de" ? "Welche Behandlung?" : "Which treatment?"}
                value={formData.frauengesundheit?.hormonbehandlung?.welche || ""}
                onChange={(e) => updateNestedField("hormonbehandlung", "welche", e.target.value)}
              />
            )}
          </div>
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
      <div className="space-y-4">
        <div className="flex items-center space-x-2">
          <Checkbox
            id="menopause"
            checked={formData.frauengesundheit?.menopause?.ja || false}
            onCheckedChange={(checked) => updateNestedField("menopause", "ja", checked)}
          />
          <Label htmlFor="menopause" className="text-lg font-medium">
            {language === "de" ? "Menopause / Wechseljahre" : "Menopause"}
          </Label>
        </div>

        {formData.frauengesundheit?.menopause?.ja && (
          <div className="grid gap-4 md:grid-cols-2 pl-6">
            <div className="space-y-2">
              <Label>{language === "de" ? "Beginn (Jahr)" : "Onset (year)"}</Label>
              <YearMonthSelect
                yearValue={formData.frauengesundheit?.menopause?.beginn || ""}
                onYearChange={(value) => updateNestedField("menopause", "beginn", value)}
                showMonth={false}
                birthYear={birthYear}
              />
            </div>
            <div className="space-y-2">
              <Label>{language === "de" ? "Symptome" : "Symptoms"}</Label>
              <Input
                placeholder={language === "de" ? "z.B. Hitzewallungen, Schlafstörungen" : "e.g. hot flashes, sleep problems"}
                value={formData.frauengesundheit?.menopause?.symptome || ""}
                onChange={(e) => updateNestedField("menopause", "symptome", e.target.value)}
              />
            </div>
          </div>
        )}
      </div>

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
            <Label>{language === "de" ? "Letzte Schwangerschaft (Jahr)" : "Last pregnancy (year)"}</Label>
            <YearMonthSelect
              yearValue={formData.frauengesundheit?.schwangerschaften?.letzte || ""}
              onYearChange={(value) => updateNestedField("schwangerschaften", "letzte", value)}
              showMonth={false}
              birthYear={birthYear}
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

          <div className="space-y-2">
            <Label>{language === "de" ? "Wann (Jahr)?" : "When (year)?"}</Label>
            <YearMonthSelect
              yearValue={formData.frauengesundheit?.fehlgeburten?.wann || ""}
              onYearChange={(value) => updateNestedField("fehlgeburten", "wann", value)}
              showMonth={false}
              birthYear={birthYear}
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

        <div className="space-y-2">
          <div className="flex items-center space-x-2">
            <Checkbox
              id="wochenbettdepression"
              checked={formData.frauengesundheit?.wochenbettdepression?.ja || false}
              onCheckedChange={(checked) => updateNestedField("wochenbettdepression", "ja", checked)}
            />
            <Label htmlFor="wochenbettdepression">
              {language === "de" ? "Wochenbettdepression" : "Postpartum depression"}
            </Label>
          </div>
          {formData.frauengesundheit?.wochenbettdepression?.ja && (
            <div className="pl-6">
              <Label>{language === "de" ? "Nach welcher Geburt?" : "After which birth?"}</Label>
              <NumericInput
                className="w-24 mt-1"
                value={formData.frauengesundheit?.wochenbettdepression?.nachGeburt || ""}
                onChange={(val) => updateNestedField("wochenbettdepression", "nachGeburt", val)}
                min={1}
                max={15}
              />
            </div>
          )}
        </div>
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
