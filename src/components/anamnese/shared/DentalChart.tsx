import { useState } from "react";
import { useLanguage } from "@/contexts/LanguageContext";
import { cn } from "@/lib/utils";
import { Label } from "@/components/ui/label";
import { Checkbox } from "@/components/ui/checkbox";
import { Badge } from "@/components/ui/badge";
import { Button } from "@/components/ui/button";
import { X } from "lucide-react";

// Dental diagnoses that can be assigned per tooth
const dentalDiagnoses = [
  { id: "wurzelbehandelt", labelDe: "Wurzelbehandelt", labelEn: "Root canal", color: "bg-red-500" },
  { id: "karies", labelDe: "Karies", labelEn: "Cavity", color: "bg-amber-500" },
  { id: "krone", labelDe: "Krone", labelEn: "Crown", color: "bg-blue-500" },
  { id: "bruecke", labelDe: "Brücke", labelEn: "Bridge", color: "bg-indigo-500" },
  { id: "implantat", labelDe: "Implantat", labelEn: "Implant", color: "bg-cyan-500" },
  { id: "amalgam", labelDe: "Amalgam", labelEn: "Amalgam", color: "bg-gray-500" },
  { id: "kunststoff", labelDe: "Kunststoff-Füllung", labelEn: "Composite filling", color: "bg-emerald-500" },
  { id: "fehlend", labelDe: "Fehlend", labelEn: "Missing", color: "bg-stone-700" },
  { id: "prothese", labelDe: "Prothese", labelEn: "Denture", color: "bg-purple-500" },
  { id: "schmerzen", labelDe: "Schmerzen", labelEn: "Pain", color: "bg-rose-600" },
  { id: "entzuendung", labelDe: "Entzündung", labelEn: "Inflammation", color: "bg-orange-600" },
  { id: "parodontitis", labelDe: "Parodontitis", labelEn: "Periodontitis", color: "bg-pink-600" },
  { id: "zahnfleischbluten", labelDe: "Zahnfleischbluten", labelEn: "Bleeding gums", color: "bg-red-400" },
  { id: "lockerung", labelDe: "Lockerung", labelEn: "Loose tooth", color: "bg-yellow-600" },
] as const;

export type DentalDiagnosisId = typeof dentalDiagnoses[number]["id"];

export interface ToothData {
  diagnoses: DentalDiagnosisId[];
  seit?: string;
  bemerkung?: string;
}

export type DentalChartData = Record<string, ToothData>;

interface DentalChartProps {
  chartData: DentalChartData;
  onChartDataChange: (data: DentalChartData) => void;
  className?: string;
}

// FDI tooth layout
const teethLayout = {
  upperRight: ["18", "17", "16", "15", "14", "13", "12", "11"],
  upperLeft: ["21", "22", "23", "24", "25", "26", "27", "28"],
  lowerLeft: ["31", "32", "33", "34", "35", "36", "37", "38"],
  lowerRight: ["48", "47", "46", "45", "44", "43", "42", "41"],
};

const toothNames: Record<string, { de: string; en: string }> = {
  "11": { de: "Ob. re. mittl. Schneidezahn", en: "Upper right central incisor" },
  "12": { de: "Ob. re. seitl. Schneidezahn", en: "Upper right lateral incisor" },
  "13": { de: "Ob. re. Eckzahn", en: "Upper right canine" },
  "14": { de: "Ob. re. 1. Prämolar", en: "Upper right 1st premolar" },
  "15": { de: "Ob. re. 2. Prämolar", en: "Upper right 2nd premolar" },
  "16": { de: "Ob. re. 1. Molar", en: "Upper right 1st molar" },
  "17": { de: "Ob. re. 2. Molar", en: "Upper right 2nd molar" },
  "18": { de: "Ob. re. Weisheitszahn", en: "Upper right wisdom tooth" },
  "21": { de: "Ob. li. mittl. Schneidezahn", en: "Upper left central incisor" },
  "22": { de: "Ob. li. seitl. Schneidezahn", en: "Upper left lateral incisor" },
  "23": { de: "Ob. li. Eckzahn", en: "Upper left canine" },
  "24": { de: "Ob. li. 1. Prämolar", en: "Upper left 1st premolar" },
  "25": { de: "Ob. li. 2. Prämolar", en: "Upper left 2nd premolar" },
  "26": { de: "Ob. li. 1. Molar", en: "Upper left 1st molar" },
  "27": { de: "Ob. li. 2. Molar", en: "Upper left 2nd molar" },
  "28": { de: "Ob. li. Weisheitszahn", en: "Upper left wisdom tooth" },
  "31": { de: "Unt. li. mittl. Schneidezahn", en: "Lower left central incisor" },
  "32": { de: "Unt. li. seitl. Schneidezahn", en: "Lower left lateral incisor" },
  "33": { de: "Unt. li. Eckzahn", en: "Lower left canine" },
  "34": { de: "Unt. li. 1. Prämolar", en: "Lower left 1st premolar" },
  "35": { de: "Unt. li. 2. Prämolar", en: "Lower left 2nd premolar" },
  "36": { de: "Unt. li. 1. Molar", en: "Lower left 1st molar" },
  "37": { de: "Unt. li. 2. Molar", en: "Lower left 2nd molar" },
  "38": { de: "Unt. li. Weisheitszahn", en: "Lower left wisdom tooth" },
  "41": { de: "Unt. re. mittl. Schneidezahn", en: "Lower right central incisor" },
  "42": { de: "Unt. re. seitl. Schneidezahn", en: "Lower right lateral incisor" },
  "43": { de: "Unt. re. Eckzahn", en: "Lower right canine" },
  "44": { de: "Unt. re. 1. Prämolar", en: "Lower right 1st premolar" },
  "45": { de: "Unt. re. 2. Prämolar", en: "Lower right 2nd premolar" },
  "46": { de: "Unt. re. 1. Molar", en: "Lower right 1st molar" },
  "47": { de: "Unt. re. 2. Molar", en: "Lower right 2nd molar" },
  "48": { de: "Unt. re. Weisheitszahn", en: "Lower right wisdom tooth" },
};

// Get the primary color for a tooth based on its first diagnosis
const getToothColor = (toothData?: ToothData): string => {
  if (!toothData || !Array.isArray(toothData.diagnoses) || toothData.diagnoses.length === 0) return "";
  const firstDiagnosis = toothData.diagnoses[0];
  const diag = dentalDiagnoses.find(d => d.id === firstDiagnosis);
  return diag?.color || "";
};

const getToothBorderColor = (toothData?: ToothData): string => {
  if (!toothData || !Array.isArray(toothData.diagnoses) || toothData.diagnoses.length === 0) return "border-muted-foreground/30";
  return "border-primary ring-1 ring-primary/30";
};

const ToothButton = ({
  toothId,
  toothData,
  isSelected,
  onClick,
  language,
}: {
  toothId: string;
  toothData?: ToothData;
  isSelected: boolean;
  onClick: () => void;
  language: string;
}) => {
  const name = toothNames[toothId];
  const hasDiagnoses = toothData && Array.isArray(toothData.diagnoses) && toothData.diagnoses.length > 0;
  const bgColor = getToothColor(toothData);

  return (
    <button
      type="button"
      onClick={onClick}
      title={language === "de" ? name?.de : name?.en}
      className={cn(
        "w-8 h-10 sm:w-9 sm:h-11 text-xs font-medium rounded border-2 transition-all relative",
        "hover:border-primary hover:bg-primary/10",
        "focus:outline-none focus:ring-2 focus:ring-primary focus:ring-offset-1",
        isSelected
          ? "bg-primary text-primary-foreground border-primary shadow-md scale-110"
          : hasDiagnoses
            ? `${bgColor} text-white border-primary/50`
            : "bg-background border-muted-foreground/30"
      )}
    >
      {toothId}
      {hasDiagnoses && toothData!.diagnoses.length > 1 && (
        <span className="absolute -top-1 -right-1 w-4 h-4 bg-foreground text-background rounded-full text-[9px] flex items-center justify-center font-bold">
          {toothData.diagnoses.length}
        </span>
      )}
    </button>
  );
};

const DentalChart = ({ chartData, onChartDataChange, className }: DentalChartProps) => {
  const { language } = useLanguage();
  const [selectedTooth, setSelectedTooth] = useState<string | null>(null);

  const handleToothClick = (toothId: string) => {
    setSelectedTooth(selectedTooth === toothId ? null : toothId);
  };

  const toggleDiagnosis = (toothId: string, diagnosisId: DentalDiagnosisId) => {
    try {
      const raw = chartData[toothId];
      const current: ToothData = raw && Array.isArray(raw.diagnoses)
        ? raw
        : { diagnoses: [] };
      const hasDiag = current.diagnoses.includes(diagnosisId);
      const newDiagnoses = hasDiag
        ? current.diagnoses.filter(d => d !== diagnosisId)
        : [...current.diagnoses, diagnosisId];

      const newData = { ...chartData };
      if (newDiagnoses.length === 0) {
        delete newData[toothId];
      } else {
        newData[toothId] = { ...current, diagnoses: newDiagnoses };
      }
      onChartDataChange(newData);
    } catch (error) {
      console.error("Error toggling dental diagnosis:", error);
    }
  };

  const clearTooth = (toothId: string) => {
    const newData = { ...chartData };
    delete newData[toothId];
    onChartDataChange(newData);
    setSelectedTooth(null);
  };

  const selectedToothData = selectedTooth ? chartData[selectedTooth] : undefined;

  // Group affected teeth by diagnosis for the summary – safely handle corrupted data
  const affectedTeeth = Object.entries(chartData).filter(
    ([_, data]) => data && Array.isArray(data.diagnoses) && data.diagnoses.length > 0
  );

  return (
    <div className={cn("space-y-6", className)}>
      {/* Tooth Diagram */}
      <div className="p-4 bg-muted/30 rounded-lg overflow-x-auto">
        <div className="text-center text-sm font-medium text-muted-foreground mb-3">
          {language === "de" ? "Oberkiefer (von vorne gesehen: rechts ↔ links)" : "Upper Jaw (front view: right ↔ left)"}
        </div>

        <div className="flex flex-col items-center gap-1 min-w-[320px]">
          <div className="flex gap-1">
            {/* Upper right */}
            <div className="flex gap-0.5 border-r-2 border-muted-foreground/30 pr-1">
              {teethLayout.upperRight.map((toothId) => (
                <ToothButton
                  key={toothId}
                  toothId={toothId}
                  toothData={chartData[toothId]}
                  isSelected={selectedTooth === toothId}
                  onClick={() => handleToothClick(toothId)}
                  language={language}
                />
              ))}
            </div>
            {/* Upper left */}
            <div className="flex gap-0.5 pl-1">
              {teethLayout.upperLeft.map((toothId) => (
                <ToothButton
                  key={toothId}
                  toothId={toothId}
                  toothData={chartData[toothId]}
                  isSelected={selectedTooth === toothId}
                  onClick={() => handleToothClick(toothId)}
                  language={language}
                />
              ))}
            </div>
          </div>

          <div className="w-full border-t-2 border-muted-foreground/30 my-2" />

          <div className="flex gap-1">
            {/* Lower left */}
            <div className="flex gap-0.5 border-r-2 border-muted-foreground/30 pr-1">
              {teethLayout.lowerLeft.map((toothId) => (
                <ToothButton
                  key={toothId}
                  toothId={toothId}
                  toothData={chartData[toothId]}
                  isSelected={selectedTooth === toothId}
                  onClick={() => handleToothClick(toothId)}
                  language={language}
                />
              ))}
            </div>
            {/* Lower right */}
            <div className="flex gap-0.5 pl-1">
              {teethLayout.lowerRight.map((toothId) => (
                <ToothButton
                  key={toothId}
                  toothId={toothId}
                  toothData={chartData[toothId]}
                  isSelected={selectedTooth === toothId}
                  onClick={() => handleToothClick(toothId)}
                  language={language}
                />
              ))}
            </div>
          </div>
        </div>

        <div className="text-center text-sm font-medium text-muted-foreground mt-3">
          {language === "de" ? "Unterkiefer" : "Lower Jaw"}
        </div>
      </div>

      {/* Diagnosis Panel for selected tooth */}
      {selectedTooth && (
        <div className="p-4 bg-primary/5 border-2 border-primary/20 rounded-lg space-y-4 animate-fade-in">
          <div className="flex items-center justify-between">
            <h4 className="font-medium text-base">
              {language === "de" ? "Zahn" : "Tooth"} {selectedTooth} – {
                language === "de"
                  ? toothNames[selectedTooth]?.de
                  : toothNames[selectedTooth]?.en
              }
            </h4>
            <div className="flex gap-2">
              {selectedToothData && Array.isArray(selectedToothData.diagnoses) && selectedToothData.diagnoses.length > 0 && (
                <Button
                  type="button"
                  variant="ghost"
                  size="sm"
                  className="text-destructive hover:text-destructive"
                  onClick={() => clearTooth(selectedTooth)}
                >
                  <X className="w-4 h-4 mr-1" />
                  {language === "de" ? "Zurücksetzen" : "Clear"}
                </Button>
              )}
            </div>
          </div>

          <p className="text-sm text-muted-foreground">
            {language === "de"
              ? "Wählen Sie die zutreffenden Befunde für diesen Zahn:"
              : "Select the applicable findings for this tooth:"}
          </p>

          <div className="grid grid-cols-2 sm:grid-cols-3 md:grid-cols-4 gap-2">
            {dentalDiagnoses.map((diag) => {
              const isActive = Array.isArray(selectedToothData?.diagnoses)
                ? selectedToothData.diagnoses.includes(diag.id)
                : false;
              return (
                <div
                  key={diag.id}
                  className={cn(
                    "flex items-center gap-2 p-2 rounded-md border cursor-pointer transition-all",
                    isActive
                      ? "bg-primary/10 border-primary"
                      : "bg-background border-muted hover:border-primary/50"
                  )}
                  onClick={(e) => {
                    e.stopPropagation();
                    toggleDiagnosis(selectedTooth, diag.id);
                  }}
                >
                  <Checkbox
                    checked={isActive}
                    onCheckedChange={(checked) => {
                      // Prevent double-toggle from parent onClick
                    }}
                  />
                  <div className="flex items-center gap-1.5">
                    <div className={cn("w-2.5 h-2.5 rounded-full", diag.color)} />
                    <Label className="font-normal text-sm cursor-pointer">
                      {language === "de" ? diag.labelDe : diag.labelEn}
                    </Label>
                  </div>
                </div>
              );
            })}
          </div>
        </div>
      )}

      {/* Legend */}
      <div className="flex flex-wrap gap-2">
        {dentalDiagnoses.map((diag) => (
          <div key={diag.id} className="flex items-center gap-1.5 text-xs text-muted-foreground">
            <div className={cn("w-2.5 h-2.5 rounded-full", diag.color)} />
            <span>{language === "de" ? diag.labelDe : diag.labelEn}</span>
          </div>
        ))}
      </div>

      {/* Summary of affected teeth */}
      {affectedTeeth.length > 0 && (
        <div className="p-4 bg-muted/30 rounded-lg space-y-3">
          <h4 className="font-medium text-sm">
            {language === "de"
              ? `Betroffene Zähne (${affectedTeeth.length})`
              : `Affected teeth (${affectedTeeth.length})`}
          </h4>
          <div className="space-y-2">
            {affectedTeeth
              .sort(([a], [b]) => a.localeCompare(b))
              .map(([toothId, data]) => (
                <div
                  key={toothId}
                  className="flex items-center gap-2 text-sm cursor-pointer hover:bg-muted/50 rounded p-1 -ml-1"
                  onClick={() => setSelectedTooth(toothId)}
                >
                  <span className="font-mono font-medium w-6">{toothId}</span>
                  <span className="text-muted-foreground">–</span>
                  <div className="flex flex-wrap gap-1">
                    {data.diagnoses.map((diagId) => {
                      const diag = dentalDiagnoses.find(d => d.id === diagId);
                      return diag ? (
                        <Badge key={diagId} variant="secondary" className="text-xs py-0">
                          <div className={cn("w-2 h-2 rounded-full mr-1", diag.color)} />
                          {language === "de" ? diag.labelDe : diag.labelEn}
                        </Badge>
                      ) : null;
                    })}
                  </div>
                </div>
              ))}
          </div>
        </div>
      )}
    </div>
  );
};

export { dentalDiagnoses };
export default DentalChart;
