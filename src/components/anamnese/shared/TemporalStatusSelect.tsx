import { useLanguage } from "@/contexts/LanguageContext";
import { RadioGroup, RadioGroupItem } from "@/components/ui/radio-group";
import { Label } from "@/components/ui/label";
import YearMonthSelect from "./YearMonthSelect";

interface TemporalStatusSelectProps {
  prefix: string;
  seitYear: string;
  seitMonth: string;
  status: string;
  bisYear?: string;
  bisMonth?: string;
  onSeitYearChange: (v: string) => void;
  onSeitMonthChange: (v: string) => void;
  onStatusChange: (v: string) => void;
  onBisYearChange?: (v: string) => void;
  onBisMonthChange?: (v: string) => void;
  birthYear?: number;
}

const TemporalStatusSelect = ({
  prefix,
  seitYear, seitMonth, status,
  bisYear = "", bisMonth = "",
  onSeitYearChange, onSeitMonthChange,
  onStatusChange,
  onBisYearChange, onBisMonthChange,
  birthYear,
}: TemporalStatusSelectProps) => {
  const { language } = useLanguage();

  return (
    <div className="space-y-3">
      <div>
        <Label className="text-xs text-muted-foreground mb-1 block">
          {language === "de" ? "Seit wann?" : "Since when?"}
        </Label>
        <YearMonthSelect
          yearValue={seitYear}
          monthValue={seitMonth}
          onYearChange={onSeitYearChange}
          onMonthChange={onSeitMonthChange}
          showMonth
          birthYear={birthYear}
        />
      </div>
      <div>
        <Label className="text-xs text-muted-foreground mb-1 block">
          {language === "de" ? "Status" : "Status"}
        </Label>
        <RadioGroup value={status} onValueChange={onStatusChange} className="flex flex-wrap gap-3">
          <div className="flex items-center gap-1.5">
            <RadioGroupItem value="nochVorhanden" id={`${prefix}-noch`} />
            <Label htmlFor={`${prefix}-noch`} className="font-normal text-sm cursor-pointer">
              {language === "de" ? "Noch vorhanden" : "Still present"}
            </Label>
          </div>
          <div className="flex items-center gap-1.5">
            <RadioGroupItem value="geendet" id={`${prefix}-geendet`} />
            <Label htmlFor={`${prefix}-geendet`} className="font-normal text-sm cursor-pointer">
              {language === "de" ? "Geendet" : "Ended"}
            </Label>
          </div>
        </RadioGroup>
      </div>
      {status === "geendet" && onBisYearChange && onBisMonthChange && (
        <div>
          <Label className="text-xs text-muted-foreground mb-1 block">
            {language === "de" ? "Bis wann?" : "Until when?"}
          </Label>
          <YearMonthSelect
            yearValue={bisYear}
            monthValue={bisMonth}
            onYearChange={onBisYearChange}
            onMonthChange={onBisMonthChange}
            showMonth
            birthYear={birthYear}
          />
        </div>
      )}
    </div>
  );
};

export default TemporalStatusSelect;
