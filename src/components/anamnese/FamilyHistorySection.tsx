import { Checkbox } from "@/components/ui/checkbox";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { useLanguage } from "@/contexts/LanguageContext";
import { AnamneseFormData } from "@/lib/anamneseFormData";

interface FamilyHistorySectionProps {
  formData: AnamneseFormData;
  updateFormData: (field: string, value: any) => void;
}

const familyConditions = [
  { key: "hoherBlutdruck", labelDe: "Hoher Blutdruck", labelEn: "High Blood Pressure" },
  { key: "herzinfarkt", labelDe: "Herzinfarkt", labelEn: "Heart Attack" },
  { key: "schlaganfall", labelDe: "Schlaganfall", labelEn: "Stroke" },
  { key: "diabetes", labelDe: "Zuckerkrankheit (Diabetes)", labelEn: "Diabetes" },
  { key: "gicht", labelDe: "Gicht", labelEn: "Gout" },
  { key: "lungenasthma", labelDe: "Lungenasthma", labelEn: "Lung Asthma" },
  { key: "lungentuberkulose", labelDe: "Lungentuberkulose", labelEn: "Pulmonary Tuberculosis" },
  { key: "nervenleiden", labelDe: "Nervenleiden (z.B. Parkinson)", labelEn: "Nervous Disorders (e.g. Parkinson's)" },
  { key: "krebs", labelDe: "Krebsleiden", labelEn: "Cancer" },
  { key: "allergien", labelDe: "Allergien", labelEn: "Allergies" },
  { key: "sucht", labelDe: "Suchtkrankheiten", labelEn: "Addictions" },
  { key: "autoimmun", labelDe: "Autoimmunerkrankungen", labelEn: "Autoimmune Diseases" },
];

const FamilyHistorySection = ({ formData, updateFormData }: FamilyHistorySectionProps) => {
  const { language } = useLanguage();

  const updateFamilyHistory = (condition: string, field: string, value: boolean | string) => {
    const current = formData.familyHistory[condition as keyof typeof formData.familyHistory] as any;
    updateFormData("familyHistory", {
      ...formData.familyHistory,
      [condition]: { ...current, [field]: value }
    });
  };

  return (
    <div className="space-y-6">
      <p className="text-muted-foreground">
        {language === "de" 
          ? "Bitte kreuzen Sie an, falls diese Erkrankungen in Ihrer Familie vorkommen:"
          : "Please check if these conditions occur in your family:"}
      </p>

      <div className="overflow-x-auto">
        <table className="w-full text-sm">
          <thead>
            <tr className="border-b">
              <th className="text-left py-3 pr-4 font-medium">
                {language === "de" ? "Erkrankung" : "Condition"}
              </th>
              <th className="text-center py-3 px-2 font-medium">{language === "de" ? "Ja" : "Yes"}</th>
              <th className="text-center py-3 px-2 font-medium">{language === "de" ? "Vater" : "Father"}</th>
              <th className="text-center py-3 px-2 font-medium">{language === "de" ? "Mutter" : "Mother"}</th>
              <th className="text-center py-3 px-2 font-medium">{language === "de" ? "Großeltern" : "Grandparents"}</th>
              <th className="text-center py-3 px-2 font-medium">{language === "de" ? "Geschwister" : "Siblings"}</th>
            </tr>
          </thead>
          <tbody>
            {familyConditions.map((condition) => {
              const data = formData.familyHistory[condition.key as keyof typeof formData.familyHistory] as any;
              return (
                <tr key={condition.key} className="border-b hover:bg-muted/50">
                  <td className="py-3 pr-4">
                    {language === "de" ? condition.labelDe : condition.labelEn}
                    {condition.key === "krebs" && data?.ja && (
                      <div className="mt-2">
                        <Input
                          placeholder={language === "de" ? "Welches?" : "Which?"}
                          value={data?.welches || ""}
                          onChange={(e) => updateFamilyHistory(condition.key, "welches", e.target.value)}
                          className="text-sm h-8"
                        />
                      </div>
                    )}
                  </td>
                  <td className="text-center py-3 px-2">
                    <Checkbox
                      checked={data?.ja || false}
                      onCheckedChange={(checked) => updateFamilyHistory(condition.key, "ja", !!checked)}
                    />
                  </td>
                  <td className="text-center py-3 px-2">
                    <Checkbox
                      checked={data?.vater || false}
                      onCheckedChange={(checked) => updateFamilyHistory(condition.key, "vater", !!checked)}
                      disabled={!data?.ja}
                    />
                  </td>
                  <td className="text-center py-3 px-2">
                    <Checkbox
                      checked={data?.mutter || false}
                      onCheckedChange={(checked) => updateFamilyHistory(condition.key, "mutter", !!checked)}
                      disabled={!data?.ja}
                    />
                  </td>
                  <td className="text-center py-3 px-2">
                    <Checkbox
                      checked={data?.grosseltern || false}
                      onCheckedChange={(checked) => updateFamilyHistory(condition.key, "grosseltern", !!checked)}
                      disabled={!data?.ja}
                    />
                  </td>
                  <td className="text-center py-3 px-2">
                    <Checkbox
                      checked={data?.geschwister || false}
                      onCheckedChange={(checked) => updateFamilyHistory(condition.key, "geschwister", !!checked)}
                      disabled={!data?.ja}
                    />
                  </td>
                </tr>
              );
            })}
          </tbody>
        </table>
      </div>
    </div>
  );
};

export default FamilyHistorySection;
