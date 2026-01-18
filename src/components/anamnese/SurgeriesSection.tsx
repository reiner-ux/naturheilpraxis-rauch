import { useState } from "react";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { Textarea } from "@/components/ui/textarea";
import { Checkbox } from "@/components/ui/checkbox";
import { Button } from "@/components/ui/button";
import { useLanguage } from "@/contexts/LanguageContext";
import { AnamneseFormData } from "@/lib/anamneseFormData";
import { Separator } from "@/components/ui/separator";
import { Plus, Trash2 } from "lucide-react";

interface SurgeriesSectionProps {
  formData: AnamneseFormData;
  updateFormData: (field: string, value: any) => void;
}

const SurgeriesSection = ({ formData, updateFormData }: SurgeriesSectionProps) => {
  const { language } = useLanguage();

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
              <Input
                placeholder={language === "de" ? "Jahr" : "Year"}
                value={formData.unfaelleOperationen?.unfall?.jahr || ""}
                onChange={(e) => updateNestedField("unfall", "jahr", e.target.value)}
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
              <Input
                placeholder={language === "de" ? "Jahr" : "Year"}
                value={formData.unfaelleOperationen?.knochenbruch?.jahr || ""}
                onChange={(e) => updateNestedField("knochenbruch", "jahr", e.target.value)}
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
              <Input
                placeholder={language === "de" ? "Jahr" : "Year"}
                value={formData.unfaelleOperationen?.kopfverletzung?.jahr || ""}
                onChange={(e) => updateNestedField("kopfverletzung", "jahr", e.target.value)}
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
              <Input
                placeholder={language === "de" ? "Jahr" : "Year"}
                value={op.jahr}
                onChange={(e) => updateOperation(index, "jahr", e.target.value)}
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
              <Input
                placeholder={language === "de" ? "Jahr" : "Year"}
                value={formData.unfaelleOperationen?.krankenhausaufenthalt?.jahr || ""}
                onChange={(e) => updateNestedField("krankenhausaufenthalt", "jahr", e.target.value)}
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
              <Input
                placeholder={language === "de" ? "Jahr" : "Year"}
                value={formData.unfaelleOperationen?.kuraufenthalt?.jahr || ""}
                onChange={(e) => updateNestedField("kuraufenthalt", "jahr", e.target.value)}
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
              <Input
                placeholder={language === "de" ? "Jahr" : "Year"}
                value={formData.unfaelleOperationen?.bluttransfusion?.jahr || ""}
                onChange={(e) => updateNestedField("bluttransfusion", "jahr", e.target.value)}
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
              <Input
                placeholder={language === "de" ? "Jahr" : "Year"}
                value={formData.unfaelleOperationen?.chemotherapie?.jahr || ""}
                onChange={(e) => updateNestedField("chemotherapie", "jahr", e.target.value)}
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
      </div>
    </div>
  );
};

export default SurgeriesSection;
