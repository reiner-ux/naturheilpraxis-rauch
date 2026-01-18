import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { Textarea } from "@/components/ui/textarea";
import { RadioGroup, RadioGroupItem } from "@/components/ui/radio-group";
import { useLanguage } from "@/contexts/LanguageContext";
import { AnamneseFormData } from "@/lib/anamneseFormData";
import { Separator } from "@/components/ui/separator";

interface SocialSectionProps {
  formData: AnamneseFormData;
  updateFormData: (field: string, value: any) => void;
}

const SocialSection = ({ formData, updateFormData }: SocialSectionProps) => {
  const { language } = useLanguage();

  const updateSoziales = (field: string, value: any) => {
    updateFormData("soziales", {
      ...formData.soziales,
      [field]: value
    });
  };

  return (
    <div className="space-y-8">
      {/* Familie */}
      <div className="space-y-4">
        <h3 className="text-lg font-medium">
          {language === "de" ? "Familie" : "Family"}
        </h3>

        <div className="grid gap-4 md:grid-cols-2">
          <div className="space-y-2">
            <Label>{language === "de" ? "Familienstand" : "Marital status"}</Label>
            <RadioGroup
              value={formData.soziales?.familienstand || ""}
              onValueChange={(value) => updateSoziales("familienstand", value)}
              className="flex flex-wrap gap-4"
            >
              {[
                { value: "ledig", labelDe: "Ledig", labelEn: "Single" },
                { value: "verheiratet", labelDe: "Verheiratet", labelEn: "Married" },
                { value: "geschieden", labelDe: "Geschieden", labelEn: "Divorced" },
                { value: "verwitwet", labelDe: "Verwitwet", labelEn: "Widowed" },
                { value: "partnerschaft", labelDe: "In Partnerschaft", labelEn: "In partnership" },
              ].map((option) => (
                <div key={option.value} className="flex items-center space-x-2">
                  <RadioGroupItem value={option.value} id={`familienstand-${option.value}`} />
                  <Label htmlFor={`familienstand-${option.value}`} className="font-normal text-sm">
                    {language === "de" ? option.labelDe : option.labelEn}
                  </Label>
                </div>
              ))}
            </RadioGroup>
          </div>
        </div>

        <div className="grid gap-4 md:grid-cols-2">
          <div className="space-y-2">
            <Label htmlFor="kinderAnzahl">
              {language === "de" ? "Anzahl Kinder" : "Number of children"}
            </Label>
            <Input
              id="kinderAnzahl"
              value={formData.soziales?.kinderAnzahl || ""}
              onChange={(e) => updateSoziales("kinderAnzahl", e.target.value)}
              placeholder="0"
              className="max-w-xs"
            />
          </div>
          <div className="space-y-2">
            <Label htmlFor="kinderAlter">
              {language === "de" ? "Alter der Kinder" : "Age of children"}
            </Label>
            <Input
              id="kinderAlter"
              value={formData.soziales?.kinderAlter || ""}
              onChange={(e) => updateSoziales("kinderAlter", e.target.value)}
              placeholder={language === "de" ? "z.B. 5, 12, 18" : "e.g. 5, 12, 18"}
            />
          </div>
        </div>
      </div>

      <Separator />

      {/* Wohnsituation */}
      <div className="space-y-4">
        <h3 className="text-lg font-medium">
          {language === "de" ? "Wohnsituation" : "Living Situation"}
        </h3>

        <div className="grid gap-4 md:grid-cols-2">
          <div className="space-y-2">
            <Label>{language === "de" ? "Wohnumfeld" : "Living environment"}</Label>
            <RadioGroup
              value={formData.soziales?.wohnumfeld || ""}
              onValueChange={(value) => updateSoziales("wohnumfeld", value)}
              className="flex flex-wrap gap-4"
            >
              {[
                { value: "stadt", labelDe: "Stadt", labelEn: "City" },
                { value: "vorstadt", labelDe: "Vorstadt", labelEn: "Suburb" },
                { value: "land", labelDe: "Land", labelEn: "Countryside" },
              ].map((option) => (
                <div key={option.value} className="flex items-center space-x-2">
                  <RadioGroupItem value={option.value} id={`wohnumfeld-${option.value}`} />
                  <Label htmlFor={`wohnumfeld-${option.value}`} className="font-normal text-sm">
                    {language === "de" ? option.labelDe : option.labelEn}
                  </Label>
                </div>
              ))}
            </RadioGroup>
          </div>

          <div className="space-y-2">
            <Label>{language === "de" ? "Wohntyp" : "Type of housing"}</Label>
            <RadioGroup
              value={formData.soziales?.wohntyp || ""}
              onValueChange={(value) => updateSoziales("wohntyp", value)}
              className="flex flex-wrap gap-4"
            >
              {[
                { value: "haus", labelDe: "Haus", labelEn: "House" },
                { value: "wohnung", labelDe: "Wohnung", labelEn: "Apartment" },
                { value: "sonstige", labelDe: "Sonstige", labelEn: "Other" },
              ].map((option) => (
                <div key={option.value} className="flex items-center space-x-2">
                  <RadioGroupItem value={option.value} id={`wohntyp-${option.value}`} />
                  <Label htmlFor={`wohntyp-${option.value}`} className="font-normal text-sm">
                    {language === "de" ? option.labelDe : option.labelEn}
                  </Label>
                </div>
              ))}
            </RadioGroup>
          </div>
        </div>
      </div>

      <Separator />

      {/* Belastungen */}
      <div className="space-y-4">
        <h3 className="text-lg font-medium">
          {language === "de" ? "Belastungen" : "Stress Factors"}
        </h3>

        <div className="grid gap-4 md:grid-cols-2">
          <div className="space-y-2">
            <Label>{language === "de" ? "Beruflicher Stress" : "Work-related stress"}</Label>
            <RadioGroup
              value={formData.soziales?.berufStress || ""}
              onValueChange={(value) => updateSoziales("berufStress", value)}
              className="flex flex-wrap gap-4"
            >
              {[
                { value: "keine", labelDe: "Keine", labelEn: "None" },
                { value: "mild", labelDe: "Mild", labelEn: "Mild" },
                { value: "moderat", labelDe: "Moderat", labelEn: "Moderate" },
                { value: "extrem", labelDe: "Extrem", labelEn: "Extreme" },
              ].map((option) => (
                <div key={option.value} className="flex items-center space-x-2">
                  <RadioGroupItem value={option.value} id={`berufStress-${option.value}`} />
                  <Label htmlFor={`berufStress-${option.value}`} className="font-normal text-sm">
                    {language === "de" ? option.labelDe : option.labelEn}
                  </Label>
                </div>
              ))}
            </RadioGroup>
          </div>

          <div className="space-y-2">
            <Label>{language === "de" ? "Finanzielle Belastung" : "Financial burden"}</Label>
            <RadioGroup
              value={formData.soziales?.finanzBelastung || ""}
              onValueChange={(value) => updateSoziales("finanzBelastung", value)}
              className="flex flex-wrap gap-4"
            >
              {[
                { value: "keine", labelDe: "Keine", labelEn: "None" },
                { value: "mild", labelDe: "Mild", labelEn: "Mild" },
                { value: "moderat", labelDe: "Moderat", labelEn: "Moderate" },
                { value: "erheblich", labelDe: "Erheblich", labelEn: "Considerable" },
              ].map((option) => (
                <div key={option.value} className="flex items-center space-x-2">
                  <RadioGroupItem value={option.value} id={`finanzBelastung-${option.value}`} />
                  <Label htmlFor={`finanzBelastung-${option.value}`} className="font-normal text-sm">
                    {language === "de" ? option.labelDe : option.labelEn}
                  </Label>
                </div>
              ))}
            </RadioGroup>
          </div>
        </div>
      </div>

      <Separator />

      {/* Soziales Netzwerk */}
      <div className="space-y-4">
        <h3 className="text-lg font-medium">
          {language === "de" ? "Soziales Umfeld" : "Social Environment"}
        </h3>

        <div className="space-y-2">
          <Label>{language === "de" ? "Soziales Netzwerk" : "Social network"}</Label>
          <RadioGroup
            value={formData.soziales?.sozialesNetzwerk || ""}
            onValueChange={(value) => updateSoziales("sozialesNetzwerk", value)}
            className="flex flex-wrap gap-4"
          >
            {[
              { value: "gut", labelDe: "Gut (Familie, Freunde, Vereine)", labelEn: "Good (family, friends, clubs)" },
              { value: "ausreichend", labelDe: "Ausreichend", labelEn: "Adequate" },
              { value: "begrenzt", labelDe: "Begrenzt", labelEn: "Limited" },
              { value: "isoliert", labelDe: "Eher isoliert", labelEn: "Rather isolated" },
            ].map((option) => (
              <div key={option.value} className="flex items-center space-x-2">
                <RadioGroupItem value={option.value} id={`sozialesNetzwerk-${option.value}`} />
                <Label htmlFor={`sozialesNetzwerk-${option.value}`} className="font-normal text-sm">
                  {language === "de" ? option.labelDe : option.labelEn}
                </Label>
              </div>
            ))}
          </RadioGroup>
        </div>

        <div className="space-y-2">
          <Label htmlFor="hobbys">
            {language === "de" ? "Hobbys & Freizeitaktivitäten" : "Hobbies & Leisure activities"}
          </Label>
          <Textarea
            id="hobbys"
            value={formData.soziales?.hobbys || ""}
            onChange={(e) => updateSoziales("hobbys", e.target.value)}
            placeholder={language === "de" 
              ? "z.B. Lesen, Gartenarbeit, Sport, Musik, Ehrenamt..."
              : "e.g. Reading, gardening, sports, music, volunteering..."}
            rows={2}
          />
        </div>
      </div>

      <Separator />

      {/* Zusätzliche Informationen */}
      <div className="space-y-2">
        <Label htmlFor="zusaetzlicheInfos">
          {language === "de" ? "Zusätzliche Informationen" : "Additional Information"}
        </Label>
        <Textarea
          id="zusaetzlicheInfos"
          value={formData.zusaetzlicheInfos || ""}
          onChange={(e) => updateFormData("zusaetzlicheInfos", e.target.value)}
          placeholder={language === "de" 
            ? "Gibt es noch etwas, das Sie uns mitteilen möchten?"
            : "Is there anything else you would like to tell us?"}
          rows={3}
        />
      </div>
    </div>
  );
};

export default SocialSection;
