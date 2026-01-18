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

interface MedicationsSectionProps {
  formData: AnamneseFormData;
  updateFormData: (field: string, value: any) => void;
}

const MedicationsSection = ({ formData, updateFormData }: MedicationsSectionProps) => {
  const { language } = useLanguage();

  const updateMedikamente = (field: string, value: any) => {
    updateFormData("medikamente", {
      ...formData.medikamente,
      [field]: value
    });
  };

  const updateNestedField = (parentField: string, field: string, value: any) => {
    updateFormData("medikamente", {
      ...formData.medikamente,
      [parentField]: {
        ...(formData.medikamente[parentField as keyof typeof formData.medikamente] as object),
        [field]: value
      }
    });
  };

  // Aktuelle Medikamente
  const addMedikament = () => {
    const current = formData.medikamente?.aktuelle || [];
    updateMedikamente("aktuelle", [...current, { name: "", dosierung: "", taeglich: true, proWoche: "", grund: "", seit: "" }]);
  };

  const removeMedikament = (index: number) => {
    const current = formData.medikamente?.aktuelle || [];
    updateMedikamente("aktuelle", current.filter((_, i) => i !== index));
  };

  const updateMedikament = (index: number, field: string, value: any) => {
    const current = formData.medikamente?.aktuelle || [];
    const updated = current.map((med, i) => 
      i === index ? { ...med, [field]: value } : med
    );
    updateMedikamente("aktuelle", updated);
  };

  // Unverträglichkeiten
  const addUnvertraeglichkeit = () => {
    const current = formData.medikamente?.unvertraeglichkeiten || [];
    updateMedikamente("unvertraeglichkeiten", [...current, { name: "", allergie: false, unvertraeglichkeit: false, reaktion: "" }]);
  };

  const removeUnvertraeglichkeit = (index: number) => {
    const current = formData.medikamente?.unvertraeglichkeiten || [];
    updateMedikamente("unvertraeglichkeiten", current.filter((_, i) => i !== index));
  };

  const updateUnvertraeglichkeit = (index: number, field: string, value: any) => {
    const current = formData.medikamente?.unvertraeglichkeiten || [];
    const updated = current.map((item, i) => 
      i === index ? { ...item, [field]: value } : item
    );
    updateMedikamente("unvertraeglichkeiten", updated);
  };

  return (
    <div className="space-y-8">
      {/* Ärztliche Behandlung */}
      <div className="space-y-4">
        <h3 className="text-lg font-medium">
          {language === "de" ? "Ärztliche Behandlung" : "Medical Treatment"}
        </h3>

        <div className="space-y-4">
          <div className="flex items-center space-x-2">
            <Checkbox
              id="inAerztlicherBehandlung"
              checked={formData.medikamente?.inAerztlicherBehandlung?.ja || false}
              onCheckedChange={(checked) => updateNestedField("inAerztlicherBehandlung", "ja", checked)}
            />
            <Label htmlFor="inAerztlicherBehandlung">
              {language === "de" ? "Aktuell in ärztlicher Behandlung" : "Currently under medical treatment"}
            </Label>
          </div>
          {formData.medikamente?.inAerztlicherBehandlung?.ja && (
            <Input
              className="max-w-md pl-6"
              placeholder={language === "de" ? "Bei welchem Arzt/welcher Ärztin?" : "With which doctor?"}
              value={formData.medikamente?.inAerztlicherBehandlung?.beiWem || ""}
              onChange={(e) => updateNestedField("inAerztlicherBehandlung", "beiWem", e.target.value)}
            />
          )}
        </div>

        <div className="space-y-2">
          <Label htmlFor="fachaerzte">
            {language === "de" ? "Weitere Fachärzte" : "Other Specialists"}
          </Label>
          <Textarea
            id="fachaerzte"
            value={formData.medikamente?.fachaerzte || ""}
            onChange={(e) => updateMedikamente("fachaerzte", e.target.value)}
            placeholder={language === "de" ? "z.B. Kardiologe, Orthopäde..." : "e.g. Cardiologist, Orthopedist..."}
            rows={2}
          />
        </div>
      </div>

      <Separator />

      {/* Aktuelle Medikamente */}
      <div className="space-y-4">
        <div className="flex items-center justify-between">
          <h3 className="text-lg font-medium">
            {language === "de" ? "Aktuelle Medikamente" : "Current Medications"}
          </h3>
          <Button type="button" variant="outline" size="sm" onClick={addMedikament}>
            <Plus className="w-4 h-4 mr-2" />
            {language === "de" ? "Medikament hinzufügen" : "Add medication"}
          </Button>
        </div>

        {(formData.medikamente?.aktuelle || []).length === 0 && (
          <p className="text-sm text-muted-foreground">
            {language === "de" 
              ? "Keine Medikamente eingetragen. Klicken Sie auf 'Medikament hinzufügen' um eines einzutragen."
              : "No medications recorded. Click 'Add medication' to add one."}
          </p>
        )}

        {(formData.medikamente?.aktuelle || []).map((med, index) => (
          <div key={index} className="p-4 bg-muted/30 rounded-lg space-y-4">
            <div className="flex justify-between items-start">
              <span className="text-sm font-medium text-muted-foreground">
                {language === "de" ? `Medikament ${index + 1}` : `Medication ${index + 1}`}
              </span>
              <Button
                type="button"
                variant="ghost"
                size="icon"
                onClick={() => removeMedikament(index)}
                className="text-destructive hover:text-destructive h-8 w-8"
              >
                <Trash2 className="w-4 h-4" />
              </Button>
            </div>
            
            <div className="grid gap-4 md:grid-cols-2">
              <div className="space-y-2">
                <Label>{language === "de" ? "Medikamentenname" : "Medication name"}</Label>
                <Input
                  placeholder={language === "de" ? "z.B. Metformin" : "e.g. Metformin"}
                  value={med.name}
                  onChange={(e) => updateMedikament(index, "name", e.target.value)}
                />
              </div>
              <div className="space-y-2">
                <Label>{language === "de" ? "Dosierung" : "Dosage"}</Label>
                <Input
                  placeholder={language === "de" ? "z.B. 500mg" : "e.g. 500mg"}
                  value={med.dosierung}
                  onChange={(e) => updateMedikament(index, "dosierung", e.target.value)}
                />
              </div>
            </div>

            <div className="grid gap-4 md:grid-cols-3">
              <div className="flex items-center space-x-2">
                <Checkbox
                  id={`taeglich-${index}`}
                  checked={med.taeglich}
                  onCheckedChange={(checked) => updateMedikament(index, "taeglich", checked)}
                />
                <Label htmlFor={`taeglich-${index}`} className="font-normal">
                  {language === "de" ? "Täglich" : "Daily"}
                </Label>
              </div>
              {!med.taeglich && (
                <div className="space-y-2">
                  <Label>{language === "de" ? "Pro Woche" : "Per week"}</Label>
                  <Input
                    placeholder={language === "de" ? "z.B. 3x" : "e.g. 3x"}
                    value={med.proWoche}
                    onChange={(e) => updateMedikament(index, "proWoche", e.target.value)}
                  />
                </div>
              )}
            </div>

            <div className="grid gap-4 md:grid-cols-2">
              <div className="space-y-2">
                <Label>{language === "de" ? "Grund für Einnahme" : "Reason for taking"}</Label>
                <Input
                  placeholder={language === "de" ? "z.B. Diabetes" : "e.g. Diabetes"}
                  value={med.grund}
                  onChange={(e) => updateMedikament(index, "grund", e.target.value)}
                />
              </div>
              <div className="space-y-2">
                <Label>{language === "de" ? "Einnahme seit" : "Taking since"}</Label>
                <Input
                  placeholder={language === "de" ? "z.B. 2020" : "e.g. 2020"}
                  value={med.seit}
                  onChange={(e) => updateMedikament(index, "seit", e.target.value)}
                />
              </div>
            </div>
          </div>
        ))}
      </div>

      <Separator />

      {/* Medikamentenunverträglichkeiten */}
      <div className="space-y-4">
        <div className="flex items-center justify-between">
          <h3 className="text-lg font-medium">
            {language === "de" ? "Medikamentenunverträglichkeiten" : "Drug Intolerances"}
          </h3>
          <Button type="button" variant="outline" size="sm" onClick={addUnvertraeglichkeit}>
            <Plus className="w-4 h-4 mr-2" />
            {language === "de" ? "Unverträglichkeit hinzufügen" : "Add intolerance"}
          </Button>
        </div>

        {(formData.medikamente?.unvertraeglichkeiten || []).length === 0 && (
          <p className="text-sm text-muted-foreground">
            {language === "de" 
              ? "Keine Unverträglichkeiten eingetragen."
              : "No intolerances recorded."}
          </p>
        )}

        {(formData.medikamente?.unvertraeglichkeiten || []).map((item, index) => (
          <div key={index} className="flex gap-4 items-start p-4 bg-muted/30 rounded-lg">
            <div className="flex-1 space-y-4">
              <div className="grid gap-4 md:grid-cols-2">
                <div className="space-y-2">
                  <Label>{language === "de" ? "Medikamentenname" : "Medication name"}</Label>
                  <Input
                    placeholder={language === "de" ? "z.B. Penicillin" : "e.g. Penicillin"}
                    value={item.name}
                    onChange={(e) => updateUnvertraeglichkeit(index, "name", e.target.value)}
                  />
                </div>
                <div className="space-y-2">
                  <Label>{language === "de" ? "Reaktion" : "Reaction"}</Label>
                  <Input
                    placeholder={language === "de" ? "z.B. Hautausschlag" : "e.g. Skin rash"}
                    value={item.reaktion}
                    onChange={(e) => updateUnvertraeglichkeit(index, "reaktion", e.target.value)}
                  />
                </div>
              </div>
              <div className="flex gap-4">
                <div className="flex items-center space-x-2">
                  <Checkbox
                    id={`allergie-${index}`}
                    checked={item.allergie}
                    onCheckedChange={(checked) => updateUnvertraeglichkeit(index, "allergie", checked)}
                  />
                  <Label htmlFor={`allergie-${index}`} className="font-normal">
                    {language === "de" ? "Allergie" : "Allergy"}
                  </Label>
                </div>
                <div className="flex items-center space-x-2">
                  <Checkbox
                    id={`unvertraeglichkeit-${index}`}
                    checked={item.unvertraeglichkeit}
                    onCheckedChange={(checked) => updateUnvertraeglichkeit(index, "unvertraeglichkeit", checked)}
                  />
                  <Label htmlFor={`unvertraeglichkeit-${index}`} className="font-normal">
                    {language === "de" ? "Unverträglichkeit" : "Intolerance"}
                  </Label>
                </div>
              </div>
            </div>
            <Button
              type="button"
              variant="ghost"
              size="icon"
              onClick={() => removeUnvertraeglichkeit(index)}
              className="text-destructive hover:text-destructive"
            >
              <Trash2 className="w-4 h-4" />
            </Button>
          </div>
        ))}
      </div>
    </div>
  );
};

export default MedicationsSection;
