import { useLanguage } from "@/contexts/LanguageContext";
import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from "@/components/ui/select";

interface YearMonthSelectProps {
  yearValue: string;
  monthValue?: string;
  onYearChange: (value: string) => void;
  onMonthChange?: (value: string) => void;
  showMonth?: boolean;
  minYear?: number;
  maxYear?: number;
  placeholder?: string;
  className?: string;
  birthYear?: number;
  showAgeHint?: boolean;
}

const YearMonthSelect = ({
  yearValue,
  monthValue = "",
  onYearChange,
  onMonthChange,
  showMonth = true,
  minYear,
  maxYear,
  placeholder,
  className = "",
  birthYear,
  showAgeHint = true,
}: YearMonthSelectProps) => {
  const { language } = useLanguage();
  const currentYear = new Date().getFullYear();

  // Calculate min/max based on rules:
  // - No patient older than 100 years
  // - Events can't be before birth year
  const hardMinYear = currentYear - 100;
  const calculatedMinYear = Math.max(
    hardMinYear,
    minYear ?? hardMinYear,
    birthYear ?? hardMinYear
  );
  const calculatedMaxYear = maxYear ?? currentYear;

  const years = Array.from(
    { length: calculatedMaxYear - calculatedMinYear + 1 },
    (_, i) => calculatedMaxYear - i
  );

  const months = [
    { value: "01", labelDe: "Januar", labelEn: "January" },
    { value: "02", labelDe: "Februar", labelEn: "February" },
    { value: "03", labelDe: "März", labelEn: "March" },
    { value: "04", labelDe: "April", labelEn: "April" },
    { value: "05", labelDe: "Mai", labelEn: "May" },
    { value: "06", labelDe: "Juni", labelEn: "June" },
    { value: "07", labelDe: "Juli", labelEn: "July" },
    { value: "08", labelDe: "August", labelEn: "August" },
    { value: "09", labelDe: "September", labelEn: "September" },
    { value: "10", labelDe: "Oktober", labelEn: "October" },
    { value: "11", labelDe: "November", labelEn: "November" },
    { value: "12", labelDe: "Dezember", labelEn: "December" },
  ];

  const showBirthYearTooOldHint =
    showAgeHint && typeof birthYear === "number" && birthYear < hardMinYear;

  return (
    <div className={`space-y-1 ${className}`}>
      <div className="flex gap-2">
        <Select value={yearValue} onValueChange={onYearChange}>
          <SelectTrigger className="w-[100px]">
            <SelectValue placeholder={placeholder ?? (language === "de" ? "Jahr" : "Year")} />
          </SelectTrigger>
          <SelectContent className="max-h-[200px]">
            {years.map((year) => (
              <SelectItem key={year} value={String(year)}>
                {year}
              </SelectItem>
            ))}
          </SelectContent>
        </Select>

        {showMonth && onMonthChange && (
          <Select value={monthValue} onValueChange={onMonthChange}>
            <SelectTrigger className="w-[120px]">
              <SelectValue placeholder={language === "de" ? "Monat" : "Month"} />
            </SelectTrigger>
            <SelectContent className="max-h-[200px]">
              {months.map((month) => (
                <SelectItem key={month.value} value={month.value}>
                  {language === "de" ? month.labelDe : month.labelEn}
                </SelectItem>
              ))}
            </SelectContent>
          </Select>
        )}
      </div>

      {showBirthYearTooOldHint && (
        <p className="text-xs text-muted-foreground">
          {language === "de"
            ? `Hinweis: Das Geburtsjahr wirkt älter als 100 Jahre. Wir erlauben nur Jahre ab ${hardMinYear}. Bitte prüfen Sie Ihr Geburtsdatum.`
            : `Note: The birth year looks older than 100 years. We only allow years from ${hardMinYear}. Please check your date of birth.`}
        </p>
      )}
    </div>
  );
};

export default YearMonthSelect;
