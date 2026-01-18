import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { Textarea } from "@/components/ui/textarea";
import { Checkbox } from "@/components/ui/checkbox";
import { useLanguage } from "@/contexts/LanguageContext";
import { AnamneseFormData } from "@/lib/anamneseFormData";
import { Separator } from "@/components/ui/separator";

interface PreferencesSectionProps {
  formData: AnamneseFormData;
  updateFormData: (field: string, value: any) => void;
}

const PreferencesSection = ({ formData, updateFormData }: PreferencesSectionProps) => {
  const { language } = useLanguage();

  const updateBehandlungspraeferenzen = (field: string, value: any) => {
    updateFormData("behandlungspraeferenzen", {
      ...formData.behandlungspraeferenzen,
      [field]: value
    });
  };

  const updateTherapieField = (therapy: string, field: string, value: boolean) => {
    updateFormData("behandlungspraeferenzen", {
      ...formData.behandlungspraeferenzen,
      [therapy]: {
        ...(formData.behandlungspraeferenzen?.[therapy as keyof typeof formData.behandlungspraeferenzen] as object),
        [field]: value
      }
    });
  };

  const therapien = [
    { field: "homoeopathie", labelDe: "Homöopathie", labelEn: "Homeopathy" },
    { field: "biophysikalisch", labelDe: "Biophysikalische Therapie", labelEn: "Biophysical therapy" },
    { field: "metatron", labelDe: "Metatron-Diagnostik", labelEn: "Metatron diagnostics" },
    { field: "trikombin", labelDe: "Trikombin", labelEn: "Trikombin" },
    { field: "zapper", labelDe: "Zapper-Therapie", labelEn: "Zapper therapy" },
    { field: "eav", labelDe: "EAV (Elektroakupunktur)", labelEn: "EAV (Electroacupuncture)" },
    { field: "mineralTestung", labelDe: "Mineral-Testung", labelEn: "Mineral testing" },
    { field: "akupunktur", labelDe: "Akupunktur", labelEn: "Acupuncture" },
    { field: "phytotherapie", labelDe: "Phytotherapie (Pflanzenheilkunde)", labelEn: "Phytotherapy (Herbal medicine)" },
    { field: "bachblueten", labelDe: "Bach-Blüten", labelEn: "Bach flowers" },
    { field: "sanum", labelDe: "Sanum-Therapie", labelEn: "Sanum therapy" },
    { field: "hypnotherapie", labelDe: "Hypnotherapie", labelEn: "Hypnotherapy" },
  ];

  return (
    <div className="space-y-8">
      {/* Therapiemethoden */}
      <div className="space-y-4">
        <h3 className="text-lg font-medium">
          {language === "de" ? "Therapiemethoden" : "Therapy Methods"}
        </h3>
        <p className="text-sm text-muted-foreground">
          {language === "de" 
            ? "Bitte geben Sie an, an welchen Therapieformen Sie interessiert sind und ob Sie damit bereits Erfahrung haben."
            : "Please indicate which therapy forms you are interested in and whether you have experience with them."}
        </p>

        <div className="overflow-x-auto">
          <table className="w-full">
            <thead>
              <tr className="border-b">
                <th className="text-left py-2 font-medium">
                  {language === "de" ? "Therapie" : "Therapy"}
                </th>
                <th className="text-center py-2 font-medium px-4">
                  {language === "de" ? "Interesse" : "Interest"}
                </th>
                <th className="text-center py-2 font-medium px-4">
                  {language === "de" ? "Erfahren" : "Experienced"}
                </th>
              </tr>
            </thead>
            <tbody>
              {therapien.map((therapie) => {
                const data = formData.behandlungspraeferenzen?.[therapie.field as keyof typeof formData.behandlungspraeferenzen] as { interesse?: boolean; erfahren?: boolean } | undefined;
                return (
                  <tr key={therapie.field} className="border-b">
                    <td className="py-3">
                      <Label className="font-normal">
                        {language === "de" ? therapie.labelDe : therapie.labelEn}
                      </Label>
                    </td>
                    <td className="text-center py-3">
                      <Checkbox
                        id={`${therapie.field}-interesse`}
                        checked={data?.interesse || false}
                        onCheckedChange={(checked) => updateTherapieField(therapie.field, "interesse", !!checked)}
                      />
                    </td>
                    <td className="text-center py-3">
                      <Checkbox
                        id={`${therapie.field}-erfahren`}
                        checked={data?.erfahren || false}
                        onCheckedChange={(checked) => updateTherapieField(therapie.field, "erfahren", !!checked)}
                      />
                    </td>
                  </tr>
                );
              })}
            </tbody>
          </table>
        </div>
      </div>

      <Separator />

      {/* Erwartungen & Ziele */}
      <div className="space-y-4">
        <h3 className="text-lg font-medium">
          {language === "de" ? "Erwartungen & Ziele" : "Expectations & Goals"}
        </h3>

        <div className="space-y-2">
          <Label htmlFor="therapieerwartungen">
            {language === "de" ? "Was erwarten Sie von der Behandlung?" : "What do you expect from the treatment?"}
          </Label>
          <Textarea
            id="therapieerwartungen"
            value={formData.therapieerwartungen || ""}
            onChange={(e) => updateFormData("therapieerwartungen", e.target.value)}
            placeholder={language === "de" 
              ? "z.B. Schmerzlinderung, bessere Lebensqualität, Ursachenforschung..."
              : "e.g. Pain relief, better quality of life, finding causes..."}
            rows={3}
          />
        </div>

        <div className="space-y-2">
          <Label htmlFor="gesundheitsziele">
            {language === "de" ? "Was sind Ihre Gesundheitsziele?" : "What are your health goals?"}
          </Label>
          <Textarea
            id="gesundheitsziele"
            value={formData.gesundheitsziele || ""}
            onChange={(e) => updateFormData("gesundheitsziele", e.target.value)}
            placeholder={language === "de" 
              ? "z.B. Mehr Energie, besser schlafen, Gewicht regulieren, Stress abbauen..."
              : "e.g. More energy, better sleep, regulate weight, reduce stress..."}
            rows={3}
          />
        </div>
      </div>

      <Separator />

      {/* Weitere Erkrankungen */}
      <div className="space-y-2">
        <Label htmlFor="weitereErkrankungen">
          {language === "de" ? "Weitere Erkrankungen oder Symptome, die noch nicht genannt wurden" : "Other conditions or symptoms not yet mentioned"}
        </Label>
        <Textarea
          id="weitereErkrankungen"
          value={formData.weitereErkrankungen || ""}
          onChange={(e) => updateFormData("weitereErkrankungen", e.target.value)}
          placeholder={language === "de" 
            ? "Bitte ergänzen Sie hier alles, was Ihnen noch wichtig erscheint..."
            : "Please add anything else that seems important to you..."}
          rows={4}
        />
      </div>
    </div>
  );
};

export default PreferencesSection;
