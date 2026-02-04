import { Label } from "@/components/ui/label";
import { Checkbox } from "@/components/ui/checkbox";
import { useLanguage } from "@/contexts/LanguageContext";
import { AnamneseFormData } from "@/lib/anamneseFormData";
import { Separator } from "@/components/ui/separator";
import MultiSelectCheckbox from "./shared/MultiSelectCheckbox";
import YearMonthSelect from "./shared/YearMonthSelect";
import MultiEntryField from "./shared/MultiEntryField";
import {
  tropicalCountries,
} from "@/lib/medicalOptions";
import { Plane, Bug, Dog } from "lucide-react";
import { Input } from "@/components/ui/input";

interface InfectionsSectionProps {
  formData: AnamneseFormData;
  updateFormData: (field: string, value: any) => void;
}

const InfectionsSection = ({ formData, updateFormData }: InfectionsSectionProps) => {
  const { language } = useLanguage();

  const updateInfektionen = (field: string, value: any) => {
    updateFormData("infektionen", {
      ...formData.infektionen,
      [field]: value
    });
  };

  const updateNestedField = (parentField: string, field: string, value: any) => {
    updateFormData("infektionen", {
      ...formData.infektionen,
      [parentField]: {
        ...(formData.infektionen[parentField as keyof typeof formData.infektionen] as object),
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
      {/* Reisen & Tropenkrankheiten */}
      <div className="space-y-4">
        <h3 className="text-lg font-medium flex items-center gap-2">
          <Plane className="w-5 h-5 text-muted-foreground" />
          {language === "de" ? "Tropenreisen & Infektionen" : "Tropical Travel & Infections"}
        </h3>

        <div className="space-y-4">
          <div className="flex items-center space-x-2">
            <Checkbox
              id="tropenReise"
              checked={formData.infektionen?.tropenReise?.ja || false}
              onCheckedChange={(checked) => updateNestedField("tropenReise", "ja", checked)}
            />
            <Label htmlFor="tropenReise">
              {language === "de" ? "Tropenreise in den letzten Jahren" : "Tropical travel in recent years"}
            </Label>
          </div>
          {formData.infektionen?.tropenReise?.ja && (
            <div className="space-y-4 pl-6">
              <div className="space-y-2">
                <Label>{language === "de" ? "Jahr" : "Year"}</Label>
                <YearMonthSelect
                  yearValue={formData.infektionen?.tropenReise?.jahr || ""}
                  onYearChange={(value) => updateNestedField("tropenReise", "jahr", value)}
                  showMonth={false}
                  birthYear={birthYear}
                />
              </div>
              <div className="space-y-2">
                <Label>{language === "de" ? "Welche Länder?" : "Which countries?"}</Label>
                <MultiSelectCheckbox
                  options={tropicalCountries}
                  selectedValues={formData.infektionen?.tropenReise?.laenderList || []}
                  onChange={(values) => updateNestedField("tropenReise", "laenderList", values)}
                  allowOther={true}
                  otherValue={formData.infektionen?.tropenReise?.laender || ""}
                  onOtherChange={(value) => updateNestedField("tropenReise", "laender", value)}
                  otherPlaceholderDe="Andere Länder..."
                  otherPlaceholderEn="Other countries..."
                  columns={4}
                />
              </div>
            </div>
          )}
        </div>
      </div>

      <Separator />

      {/* Zecken & Borreliose */}
      <div className="space-y-4">
        <h3 className="text-lg font-medium flex items-center gap-2">
          <Bug className="w-5 h-5 text-muted-foreground" />
          {language === "de" ? "Zecken & Borreliose" : "Ticks & Lyme Disease"}
        </h3>

        <div className="space-y-4">
          <div className="flex items-center space-x-2">
            <Checkbox
              id="zeckenbiss"
              checked={formData.infektionen?.zeckenbiss?.ja || false}
              onCheckedChange={(checked) => updateNestedField("zeckenbiss", "ja", checked)}
            />
            <Label htmlFor="zeckenbiss">
              {language === "de" ? "Zeckenbiss gehabt" : "Had tick bite"}
            </Label>
          </div>
          {formData.infektionen?.zeckenbiss?.ja && (
            <div className="space-y-4 pl-6">
              <div className="space-y-2">
                <Label>{language === "de" ? "Wann?" : "When?"}</Label>
                <YearMonthSelect
                  yearValue={formData.infektionen?.zeckenbiss?.seit || ""}
                  onYearChange={(value) => updateNestedField("zeckenbiss", "seit", value)}
                  showMonth={false}
                  birthYear={birthYear}
                />
              </div>
              <div className="flex items-center space-x-2">
                <Checkbox
                  id="roterHof"
                  checked={formData.infektionen?.zeckenbiss?.roterHof || false}
                  onCheckedChange={(checked) => updateNestedField("zeckenbiss", "roterHof", checked)}
                />
                <Label htmlFor="roterHof" className="font-normal">
                  {language === "de" ? "Roter Hof (Wanderröte) aufgetreten" : "Red ring (erythema migrans) occurred"}
                </Label>
              </div>
            </div>
          )}
        </div>

        <div className="space-y-4">
          <div className="flex items-center space-x-2">
            <Checkbox
              id="borreliose"
              checked={formData.infektionen?.borreliose?.ja || false}
              onCheckedChange={(checked) => updateNestedField("borreliose", "ja", checked)}
            />
            <Label htmlFor="borreliose">
              {language === "de" ? "Borreliose diagnostiziert" : "Lyme disease diagnosed"}
            </Label>
          </div>
          {formData.infektionen?.borreliose?.ja && (
            <div className="grid gap-4 md:grid-cols-2 pl-6">
              <div className="space-y-2">
                <Label>{language === "de" ? "Jahr der Diagnose" : "Year of diagnosis"}</Label>
                <YearMonthSelect
                  yearValue={formData.infektionen?.borreliose?.jahr || ""}
                  onYearChange={(value) => updateNestedField("borreliose", "jahr", value)}
                  showMonth={false}
                  birthYear={birthYear}
                />
              </div>
              <div className="space-y-2">
                <Label>{language === "de" ? "Stadium (falls bekannt)" : "Stage (if known)"}</Label>
                <Input
                  placeholder={language === "de" ? "z.B. Stadium 2" : "e.g. Stage 2"}
                  value={formData.infektionen?.borreliose?.stadium || ""}
                  onChange={(e) => updateNestedField("borreliose", "stadium", e.target.value)}
                />
              </div>
            </div>
          )}
        </div>

        <div className="space-y-4">
          <div className="flex items-center space-x-2">
            <Checkbox
              id="fsmeImpfung"
              checked={formData.infektionen?.fsmeImpfung?.ja || false}
              onCheckedChange={(checked) => updateNestedField("fsmeImpfung", "ja", checked)}
            />
            <Label htmlFor="fsmeImpfung">
              {language === "de" ? "FSME-Impfung erhalten" : "FSME vaccination received"}
            </Label>
          </div>
          {formData.infektionen?.fsmeImpfung?.ja && (
            <div className="space-y-2 pl-6">
              <Label>{language === "de" ? "Jahr der letzten Impfung" : "Year of last vaccination"}</Label>
              <YearMonthSelect
                yearValue={formData.infektionen?.fsmeImpfung?.jahr || ""}
                onYearChange={(value) => updateNestedField("fsmeImpfung", "jahr", value)}
                showMonth={false}
                birthYear={birthYear}
              />
            </div>
          )}
        </div>
      </div>

      <Separator />

      {/* Haustiere */}
      <div className="space-y-4">
        <h3 className="text-lg font-medium flex items-center gap-2">
          <Dog className="w-5 h-5 text-muted-foreground" />
          {language === "de" ? "Haustiere & Tierkontakt" : "Pets & Animal Contact"}
        </h3>
        <p className="text-sm text-muted-foreground">
          {language === "de" 
            ? "Tierkontakt kann relevant für bestimmte Infektionskrankheiten (Zoonosen) sein."
            : "Animal contact can be relevant for certain infectious diseases (zoonoses)."}
        </p>

        <div className="grid gap-4 md:grid-cols-2">
          <div className="space-y-2">
            <div className="flex items-center space-x-2">
              <Checkbox
                id="hund"
                checked={formData.infektionen?.hund?.ja || false}
                onCheckedChange={(checked) => updateNestedField("hund", "ja", checked)}
              />
              <Label htmlFor="hund">
                {language === "de" ? "Hund 🐕" : "Dog 🐕"}
              </Label>
            </div>
            {formData.infektionen?.hund?.ja && (
              <Input
                className="pl-6"
                placeholder={language === "de" ? "Rasse (optional)" : "Breed (optional)"}
                value={formData.infektionen?.hund?.rasse || ""}
                onChange={(e) => updateNestedField("hund", "rasse", e.target.value)}
              />
            )}
          </div>

          <div className="space-y-2">
            <div className="flex items-center space-x-2">
              <Checkbox
                id="katze"
                checked={formData.infektionen?.katze?.ja || false}
                onCheckedChange={(checked) => updateNestedField("katze", "ja", checked)}
              />
              <Label htmlFor="katze">
                {language === "de" ? "Katze 🐱" : "Cat 🐱"}
              </Label>
            </div>
            {formData.infektionen?.katze?.ja && (
              <Input
                className="pl-6"
                placeholder={language === "de" ? "Rasse (optional)" : "Breed (optional)"}
                value={formData.infektionen?.katze?.rasse || ""}
                onChange={(e) => updateNestedField("katze", "rasse", e.target.value)}
              />
            )}
          </div>

          <div className="space-y-2">
            <div className="flex items-center space-x-2">
              <Checkbox
                id="pferd"
                checked={formData.infektionen?.pferd?.ja || false}
                onCheckedChange={(checked) => updateNestedField("pferd", "ja", checked)}
              />
              <Label htmlFor="pferd">
                {language === "de" ? "Pferd / Pferdekontakt 🐴" : "Horse / Horse contact 🐴"}
              </Label>
            </div>
            {formData.infektionen?.pferd?.ja && (
              <Input
                className="pl-6"
                placeholder={language === "de" ? "Art des Kontakts" : "Type of contact"}
                value={formData.infektionen?.pferd?.kontakt || ""}
                onChange={(e) => updateNestedField("pferd", "kontakt", e.target.value)}
              />
            )}
          </div>

          <div className="space-y-2">
            <div className="flex items-center space-x-2">
              <Checkbox
                id="andereHaustiere"
                checked={formData.infektionen?.andereHaustiere?.ja || false}
                onCheckedChange={(checked) => updateNestedField("andereHaustiere", "ja", checked)}
              />
              <Label htmlFor="andereHaustiere">
                {language === "de" ? "Andere Haustiere" : "Other pets"}
              </Label>
            </div>
            {formData.infektionen?.andereHaustiere?.ja && (
              <Input
                className="pl-6"
                placeholder={language === "de" ? "Welche Tiere?" : "Which animals?"}
                value={formData.infektionen?.andereHaustiere?.welche || ""}
                onChange={(e) => updateNestedField("andereHaustiere", "welche", e.target.value)}
              />
            )}
          </div>
        </div>
      </div>
    </div>
  );
};

export default InfectionsSection;
