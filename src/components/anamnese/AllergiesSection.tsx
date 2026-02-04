import { Label } from "@/components/ui/label";
import { Checkbox } from "@/components/ui/checkbox";
import { Input } from "@/components/ui/input";
import { useLanguage } from "@/contexts/LanguageContext";
import { AnamneseFormData } from "@/lib/anamneseFormData";
import { Separator } from "@/components/ui/separator";
import MultiSelectCheckbox from "./shared/MultiSelectCheckbox";
import {
  foodAllergens,
  medicationAllergens,
  contactAllergens,
} from "@/lib/medicalOptions";
import { Apple, Pill, Hand, Wind } from "lucide-react";

interface AllergiesSectionProps {
  formData: AnamneseFormData;
  updateFormData: (field: string, value: any) => void;
}

const AllergiesSection = ({ formData, updateFormData }: AllergiesSectionProps) => {
  const { language } = useLanguage();

  const updateAllergien = (field: string, value: any) => {
    updateFormData("allergien", {
      ...formData.allergien,
      [field]: value
    });
  };

  const updateNestedField = (parentField: string, field: string, value: any) => {
    updateFormData("allergien", {
      ...formData.allergien,
      [parentField]: {
        ...(formData.allergien[parentField as keyof typeof formData.allergien] as object),
        [field]: value
      }
    });
  };

  return (
    <div className="space-y-8">
      {/* Inhalationsallergien */}
      <div className="space-y-4">
        <h3 className="text-lg font-medium flex items-center gap-2">
          <Wind className="w-5 h-5 text-muted-foreground" />
          {language === "de" ? "Inhalationsallergien" : "Inhalation Allergies"}
        </h3>

        <div className="space-y-4">
          <div className="flex items-center space-x-2">
            <Checkbox
              id="inhalation"
              checked={formData.allergien?.inhalation?.ja || false}
              onCheckedChange={(checked) => updateNestedField("inhalation", "ja", checked)}
            />
            <Label htmlFor="inhalation">
              {language === "de" ? "Inhalationsallergie vorhanden" : "Inhalation allergy present"}
            </Label>
          </div>
          {formData.allergien?.inhalation?.ja && (
            <div className="flex flex-wrap gap-4 pl-6">
              {[
                { field: "pollen", labelDe: "Pollen 🌸", labelEn: "Pollen 🌸" },
                { field: "staub", labelDe: "Hausstaub 🏠", labelEn: "House dust 🏠" },
                { field: "tierhaare", labelDe: "Tierhaare 🐱", labelEn: "Animal hair 🐱" },
                { field: "schimmel", labelDe: "Schimmel 🍄", labelEn: "Mold 🍄" },
              ].map((option) => (
                <div key={option.field} className="flex items-center space-x-2">
                  <Checkbox
                    id={`inhalation-${option.field}`}
                    checked={formData.allergien?.inhalation?.[option.field as keyof typeof formData.allergien.inhalation] || false}
                    onCheckedChange={(checked) => updateNestedField("inhalation", option.field, checked)}
                  />
                  <Label htmlFor={`inhalation-${option.field}`} className="font-normal text-sm">
                    {language === "de" ? option.labelDe : option.labelEn}
                  </Label>
                </div>
              ))}
            </div>
          )}
        </div>
      </div>

      <Separator />

      {/* Tierepithelien */}
      <div className="space-y-4">
        <div className="flex items-center space-x-2">
          <Checkbox
            id="tierepithelien"
            checked={formData.allergien?.tierepithelien?.ja || false}
            onCheckedChange={(checked) => updateNestedField("tierepithelien", "ja", checked)}
          />
          <Label htmlFor="tierepithelien" className="text-lg font-medium">
            {language === "de" ? "Tierepithelien-Allergie 🐕" : "Animal Epithelium Allergy 🐕"}
          </Label>
        </div>
        {formData.allergien?.tierepithelien?.ja && (
          <div className="space-y-4 pl-6">
            <div className="flex flex-wrap gap-4">
              {[
                { field: "hund", labelDe: "Hund 🐕", labelEn: "Dog 🐕" },
                { field: "katze", labelDe: "Katze 🐱", labelEn: "Cat 🐱" },
                { field: "pferd", labelDe: "Pferd 🐴", labelEn: "Horse 🐴" },
              ].map((option) => (
                <div key={option.field} className="flex items-center space-x-2">
                  <Checkbox
                    id={`tier-${option.field}`}
                    checked={!!formData.allergien?.tierepithelien?.[option.field as keyof typeof formData.allergien.tierepithelien]}
                    onCheckedChange={(checked) => updateNestedField("tierepithelien", option.field, checked)}
                  />
                  <Label htmlFor={`tier-${option.field}`} className="font-normal text-sm">
                    {language === "de" ? option.labelDe : option.labelEn}
                  </Label>
                </div>
              ))}
            </div>
            <Input
              placeholder={language === "de" ? "Sonstige Tiere" : "Other animals"}
              value={formData.allergien?.tierepithelien?.sonstige || ""}
              onChange={(e) => updateNestedField("tierepithelien", "sonstige", e.target.value)}
              className="max-w-md"
            />
          </div>
        )}
      </div>

      <Separator />

      {/* Nahrungsmittelallergien */}
      <div className="space-y-4">
        <div className="flex items-center space-x-2">
          <Checkbox
            id="nahrungsmittel"
            checked={formData.allergien?.nahrungsmittel?.ja || false}
            onCheckedChange={(checked) => updateNestedField("nahrungsmittel", "ja", checked)}
          />
          <Label htmlFor="nahrungsmittel" className="text-lg font-medium flex items-center gap-2">
            <Apple className="w-5 h-5 text-muted-foreground" />
            {language === "de" ? "Nahrungsmittelallergie" : "Food Allergy"}
          </Label>
        </div>
        {formData.allergien?.nahrungsmittel?.ja && (
          <div className="pl-6 space-y-3">
            <MultiSelectCheckbox
              options={foodAllergens}
              selectedValues={formData.allergien?.nahrungsmittel?.allergene || []}
              onChange={(values) => updateNestedField("nahrungsmittel", "allergene", values)}
              allowOther={true}
              otherValue={formData.allergien?.nahrungsmittel?.details || ""}
              onOtherChange={(value) => updateNestedField("nahrungsmittel", "details", value)}
              otherPlaceholderDe="Andere Nahrungsmittel..."
              otherPlaceholderEn="Other foods..."
              columns={3}
            />
          </div>
        )}
      </div>

      {/* Medikamentenallergien */}
      <div className="space-y-4">
        <div className="flex items-center space-x-2">
          <Checkbox
            id="medikamente"
            checked={formData.allergien?.medikamente?.ja || false}
            onCheckedChange={(checked) => updateNestedField("medikamente", "ja", checked)}
          />
          <Label htmlFor="medikamente" className="text-lg font-medium flex items-center gap-2">
            <Pill className="w-5 h-5 text-muted-foreground" />
            {language === "de" ? "Medikamentenallergie" : "Drug Allergy"}
          </Label>
        </div>
        {formData.allergien?.medikamente?.ja && (
          <div className="pl-6 space-y-3">
            <MultiSelectCheckbox
              options={medicationAllergens}
              selectedValues={formData.allergien?.medikamente?.allergene || []}
              onChange={(values) => updateNestedField("medikamente", "allergene", values)}
              allowOther={true}
              otherValue={formData.allergien?.medikamente?.details || ""}
              onOtherChange={(value) => updateNestedField("medikamente", "details", value)}
              otherPlaceholderDe="Andere Medikamente..."
              otherPlaceholderEn="Other medications..."
              columns={2}
            />
          </div>
        )}
      </div>

      <Separator />

      {/* Kontaktallergien - Erweitert */}
      <div className="space-y-4">
        <div className="flex items-center space-x-2">
          <Checkbox
            id="kontakt"
            checked={formData.allergien?.kontakt?.ja || false}
            onCheckedChange={(checked) => updateNestedField("kontakt", "ja", checked)}
          />
          <Label htmlFor="kontakt" className="text-lg font-medium flex items-center gap-2">
            <Hand className="w-5 h-5 text-muted-foreground" />
            {language === "de" ? "Kontaktallergie" : "Contact Allergy"}
          </Label>
        </div>
        {formData.allergien?.kontakt?.ja && (
          <div className="pl-6 space-y-3">
            <MultiSelectCheckbox
              options={contactAllergens}
              selectedValues={formData.allergien?.kontakt?.allergene || []}
              onChange={(values) => updateNestedField("kontakt", "allergene", values)}
              allowOther={true}
              otherValue={formData.allergien?.kontakt?.sonstige || ""}
              onOtherChange={(value) => updateNestedField("kontakt", "sonstige", value)}
              otherPlaceholderDe="Andere Kontaktallergene..."
              otherPlaceholderEn="Other contact allergens..."
              columns={3}
            />
          </div>
        )}
      </div>

      <Separator />

      {/* Unverträglichkeiten */}
      <div className="space-y-4">
        <h3 className="text-lg font-medium">
          {language === "de" ? "Unverträglichkeiten" : "Intolerances"}
        </h3>

        <div className="grid gap-4 md:grid-cols-2">
          {/* Laktose */}
          <div className="space-y-2">
            <div className="flex items-center space-x-2">
              <Checkbox
                id="laktose"
                checked={formData.allergien?.laktose?.ja || false}
                onCheckedChange={(checked) => updateNestedField("laktose", "ja", checked)}
              />
              <Label htmlFor="laktose">
                {language === "de" ? "Laktoseintoleranz 🥛" : "Lactose intolerance 🥛"}
              </Label>
            </div>
            {formData.allergien?.laktose?.ja && (
              <div className="flex flex-wrap gap-3 pl-6">
                {[
                  { field: "mild", labelDe: "Mild", labelEn: "Mild" },
                  { field: "moderat", labelDe: "Moderat", labelEn: "Moderate" },
                  { field: "schwer", labelDe: "Schwer", labelEn: "Severe" },
                ].map((option) => (
                  <div key={option.field} className="flex items-center space-x-2">
                    <Checkbox
                      id={`laktose-${option.field}`}
                      checked={!!formData.allergien?.laktose?.[option.field as keyof typeof formData.allergien.laktose]}
                      onCheckedChange={(checked) => updateNestedField("laktose", option.field, checked)}
                    />
                    <Label htmlFor={`laktose-${option.field}`} className="font-normal text-sm">
                      {language === "de" ? option.labelDe : option.labelEn}
                    </Label>
                  </div>
                ))}
              </div>
            )}
          </div>

          {/* Gluten */}
          <div className="space-y-2">
            <div className="flex items-center space-x-2">
              <Checkbox
                id="gluten"
                checked={formData.allergien?.gluten?.ja || false}
                onCheckedChange={(checked) => updateNestedField("gluten", "ja", checked)}
              />
              <Label htmlFor="gluten">
                {language === "de" ? "Glutenunverträglichkeit 🌾" : "Gluten intolerance 🌾"}
              </Label>
            </div>
            {formData.allergien?.gluten?.ja && (
              <div className="pl-6">
                <div className="flex items-center space-x-2">
                  <Checkbox
                    id="gluten-diagnostiziert"
                    checked={formData.allergien?.gluten?.diagnostiziert || false}
                    onCheckedChange={(checked) => updateNestedField("gluten", "diagnostiziert", checked)}
                  />
                  <Label htmlFor="gluten-diagnostiziert" className="font-normal text-sm">
                    {language === "de" ? "Ärztlich diagnostiziert" : "Medically diagnosed"}
                  </Label>
                </div>
              </div>
            )}
          </div>

          {/* Fruktose */}
          <div className="space-y-2">
            <div className="flex items-center space-x-2">
              <Checkbox
                id="fruktose"
                checked={formData.allergien?.fruktose?.ja || false}
                onCheckedChange={(checked) => updateNestedField("fruktose", "ja", checked)}
              />
              <Label htmlFor="fruktose">
                {language === "de" ? "Fruktoseintoleranz 🍎" : "Fructose intolerance 🍎"}
              </Label>
            </div>
            {formData.allergien?.fruktose?.ja && (
              <Input
                className="pl-6"
                placeholder={language === "de" ? "Details" : "Details"}
                value={formData.allergien?.fruktose?.details || ""}
                onChange={(e) => updateNestedField("fruktose", "details", e.target.value)}
              />
            )}
          </div>

          {/* Histamin */}
          <div className="space-y-2">
            <div className="flex items-center space-x-2">
              <Checkbox
                id="histamin"
                checked={formData.allergien?.histamin?.ja || false}
                onCheckedChange={(checked) => updateNestedField("histamin", "ja", checked)}
              />
              <Label htmlFor="histamin">
                {language === "de" ? "Histaminintoleranz" : "Histamine intolerance"}
              </Label>
            </div>
            {formData.allergien?.histamin?.ja && (
              <div className="flex flex-wrap gap-3 pl-6">
                {[
                  { field: "mild", labelDe: "Mild", labelEn: "Mild" },
                  { field: "moderat", labelDe: "Moderat", labelEn: "Moderate" },
                  { field: "schwer", labelDe: "Schwer", labelEn: "Severe" },
                ].map((option) => (
                  <div key={option.field} className="flex items-center space-x-2">
                    <Checkbox
                      id={`histamin-${option.field}`}
                      checked={formData.allergien?.histamin?.[option.field as keyof typeof formData.allergien.histamin] || false}
                      onCheckedChange={(checked) => updateNestedField("histamin", option.field, checked)}
                    />
                    <Label htmlFor={`histamin-${option.field}`} className="font-normal text-sm">
                      {language === "de" ? option.labelDe : option.labelEn}
                    </Label>
                  </div>
                ))}
              </div>
            )}
          </div>
        </div>

        {/* Sonstige Unverträglichkeiten */}
        <div className="space-y-2">
          <Label htmlFor="sonstigeUnvertraeglichkeit">
            {language === "de" ? "Sonstige Unverträglichkeiten" : "Other intolerances"}
          </Label>
          <Input
            id="sonstigeUnvertraeglichkeit"
            value={formData.allergien?.sonstigeUnvertraeglichkeit || ""}
            onChange={(e) => updateAllergien("sonstigeUnvertraeglichkeit", e.target.value)}
            className="max-w-md"
          />
        </div>
      </div>
    </div>
  );
};

export default AllergiesSection;
