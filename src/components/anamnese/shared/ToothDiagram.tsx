import { useLanguage } from "@/contexts/LanguageContext";
import { cn } from "@/lib/utils";

interface ToothDiagramProps {
  selectedTeeth: string[];
  onToothToggle: (toothId: string) => void;
  className?: string;
}

// Tooth numbering follows the FDI (Fédération Dentaire Internationale) system
// Upper right: 11-18, Upper left: 21-28
// Lower left: 31-38, Lower right: 41-48
const teethLayout = {
  upperRight: ["18", "17", "16", "15", "14", "13", "12", "11"],
  upperLeft: ["21", "22", "23", "24", "25", "26", "27", "28"],
  lowerLeft: ["31", "32", "33", "34", "35", "36", "37", "38"],
  lowerRight: ["48", "47", "46", "45", "44", "43", "42", "41"],
};

const toothNames: Record<string, { de: string; en: string }> = {
  "11": { de: "Oberer rechter mittlerer Schneidezahn", en: "Upper right central incisor" },
  "12": { de: "Oberer rechter seitlicher Schneidezahn", en: "Upper right lateral incisor" },
  "13": { de: "Oberer rechter Eckzahn", en: "Upper right canine" },
  "14": { de: "Oberer rechter erster Prämolar", en: "Upper right first premolar" },
  "15": { de: "Oberer rechter zweiter Prämolar", en: "Upper right second premolar" },
  "16": { de: "Oberer rechter erster Molar", en: "Upper right first molar" },
  "17": { de: "Oberer rechter zweiter Molar", en: "Upper right second molar" },
  "18": { de: "Oberer rechter Weisheitszahn", en: "Upper right wisdom tooth" },
  "21": { de: "Oberer linker mittlerer Schneidezahn", en: "Upper left central incisor" },
  "22": { de: "Oberer linker seitlicher Schneidezahn", en: "Upper left lateral incisor" },
  "23": { de: "Oberer linker Eckzahn", en: "Upper left canine" },
  "24": { de: "Oberer linker erster Prämolar", en: "Upper left first premolar" },
  "25": { de: "Oberer linker zweiter Prämolar", en: "Upper left second premolar" },
  "26": { de: "Oberer linker erster Molar", en: "Upper left first molar" },
  "27": { de: "Oberer linker zweiter Molar", en: "Upper left second molar" },
  "28": { de: "Oberer linker Weisheitszahn", en: "Upper left wisdom tooth" },
  "31": { de: "Unterer linker mittlerer Schneidezahn", en: "Lower left central incisor" },
  "32": { de: "Unterer linker seitlicher Schneidezahn", en: "Lower left lateral incisor" },
  "33": { de: "Unterer linker Eckzahn", en: "Lower left canine" },
  "34": { de: "Unterer linker erster Prämolar", en: "Lower left first premolar" },
  "35": { de: "Unterer linker zweiter Prämolar", en: "Lower left second premolar" },
  "36": { de: "Unterer linker erster Molar", en: "Lower left first molar" },
  "37": { de: "Unterer linker zweiter Molar", en: "Lower left second molar" },
  "38": { de: "Unterer linker Weisheitszahn", en: "Lower left wisdom tooth" },
  "41": { de: "Unterer rechter mittlerer Schneidezahn", en: "Lower right central incisor" },
  "42": { de: "Unterer rechter seitlicher Schneidezahn", en: "Lower right lateral incisor" },
  "43": { de: "Unterer rechter Eckzahn", en: "Lower right canine" },
  "44": { de: "Unterer rechter erster Prämolar", en: "Lower right first premolar" },
  "45": { de: "Unterer rechter zweiter Prämolar", en: "Lower right second premolar" },
  "46": { de: "Unterer rechter erster Molar", en: "Lower right first molar" },
  "47": { de: "Unterer rechter zweiter Molar", en: "Lower right second molar" },
  "48": { de: "Unterer rechter Weisheitszahn", en: "Lower right wisdom tooth" },
};

const ToothButton = ({
  toothId,
  isSelected,
  onClick,
  language,
}: {
  toothId: string;
  isSelected: boolean;
  onClick: () => void;
  language: string;
}) => {
  const name = toothNames[toothId];
  
  return (
    <button
      type="button"
      onClick={onClick}
      title={language === "de" ? name?.de : name?.en}
      className={cn(
        "w-8 h-10 text-xs font-medium rounded border-2 transition-all",
        "hover:border-primary hover:bg-primary/10",
        "focus:outline-none focus:ring-2 focus:ring-primary focus:ring-offset-1",
        isSelected
          ? "bg-primary text-primary-foreground border-primary"
          : "bg-background border-muted-foreground/30"
      )}
    >
      {toothId}
    </button>
  );
};

const ToothDiagram = ({ selectedTeeth, onToothToggle, className }: ToothDiagramProps) => {
  const { language } = useLanguage();

  const renderRow = (teeth: string[], label: string) => (
    <div className="flex items-center gap-1">
      <span className="text-xs text-muted-foreground w-16 text-right pr-2">{label}</span>
      <div className="flex gap-0.5">
        {teeth.map((toothId) => (
          <ToothButton
            key={toothId}
            toothId={toothId}
            isSelected={selectedTeeth.includes(toothId)}
            onClick={() => onToothToggle(toothId)}
            language={language}
          />
        ))}
      </div>
    </div>
  );

  return (
    <div className={cn("space-y-4 p-4 bg-muted/30 rounded-lg", className)}>
      <div className="text-center text-sm font-medium text-muted-foreground mb-2">
        {language === "de" ? "Oberkiefer" : "Upper Jaw"}
      </div>
      
      <div className="flex flex-col items-center gap-1">
        <div className="flex gap-1">
          {/* Upper right */}
          <div className="flex gap-0.5 border-r-2 border-muted-foreground/30 pr-1">
            {teethLayout.upperRight.map((toothId) => (
              <ToothButton
                key={toothId}
                toothId={toothId}
                isSelected={selectedTeeth.includes(toothId)}
                onClick={() => onToothToggle(toothId)}
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
                isSelected={selectedTeeth.includes(toothId)}
                onClick={() => onToothToggle(toothId)}
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
                isSelected={selectedTeeth.includes(toothId)}
                onClick={() => onToothToggle(toothId)}
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
                isSelected={selectedTeeth.includes(toothId)}
                onClick={() => onToothToggle(toothId)}
                language={language}
              />
            ))}
          </div>
        </div>
      </div>
      
      <div className="text-center text-sm font-medium text-muted-foreground mt-2">
        {language === "de" ? "Unterkiefer" : "Lower Jaw"}
      </div>
      
      {selectedTeeth.length > 0 && (
        <div className="mt-4 pt-3 border-t border-muted-foreground/20">
          <p className="text-sm text-muted-foreground">
            {language === "de" ? "Ausgewählt: " : "Selected: "}
            <span className="font-medium text-foreground">
              {selectedTeeth.sort().join(", ")}
            </span>
          </p>
        </div>
      )}
    </div>
  );
};

export default ToothDiagram;
