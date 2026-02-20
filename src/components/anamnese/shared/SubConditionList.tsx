import { Checkbox } from "@/components/ui/checkbox";
import { Label } from "@/components/ui/label";
import { useLanguage } from "@/contexts/LanguageContext";
import TemporalStatusSelect from "./TemporalStatusSelect";

interface SubCondition {
  key: string;
  labelDe: string;
  labelEn: string;
  subOptions?: { key: string; labelDe: string; labelEn: string }[];
}

interface SubConditionListProps {
  items: SubCondition[];
  parentData: Record<string, any>;
  onSubItemChange: (key: string, subField: string, value: any) => void;
  birthYear?: number;
}

const SubConditionList = ({ items, parentData, onSubItemChange, birthYear }: SubConditionListProps) => {
  const { language } = useLanguage();

  const getSubItem = (key: string) => {
    const val = parentData?.[key];
    if (typeof val === 'boolean') return { ja: val, seit: "", status: "", bisJahr: "" };
    if (val && typeof val === 'object') return {
      ja: Boolean(val.ja),
      seit: String(val.seit || val.jahr || ""),
      status: String(val.status || ""),
      bisJahr: String(val.bisJahr || ""),
    };
    return { ja: false, seit: "", status: "", bisJahr: "" };
  };

  const parseYearMonth = (raw: string) => {
    if (!raw) return { year: "", month: "" };
    const m = raw.match(/^(\d{4})(?:-(\d{2}))?$/);
    if (!m) return { year: "", month: "" };
    return { year: m[1] ?? "", month: m[2] ?? "" };
  };

  const setYearMonth = (key: string, timeKey: string, next: { year?: string; month?: string }) => {
    const item = getSubItem(key);
    const currentRaw = timeKey === "seit" ? item.seit : item.bisJahr;
    const current = parseYearMonth(currentRaw);
    const year = (next.year ?? current.year).slice(0, 4);
    const month = (next.month ?? current.month).slice(0, 2);
    const combined = month ? `${year}-${month}` : year;
    onSubItemChange(key, timeKey, combined);
  };

  const getSubOptionChecked = (key: string, optionKey: string): boolean => {
    const val = parentData?.[key];
    if (val && typeof val === 'object') return Boolean(val[optionKey]);
    return false;
  };

  return (
    <div className="space-y-3">
      {items.map(item => {
        const data = getSubItem(item.key);
        const seitParsed = parseYearMonth(data.seit);
        const bisParsed = parseYearMonth(data.bisJahr);

        return (
          <div key={item.key} className="border rounded-lg p-3 bg-background">
            <div className="flex items-center gap-2">
              <Checkbox
                checked={data.ja}
                onCheckedChange={(checked) => onSubItemChange(item.key, "ja", !!checked)}
              />
              <Label className="font-normal cursor-pointer">
                {language === "de" ? item.labelDe : item.labelEn}
              </Label>
            </div>
            {data.ja && (
              <div className="ml-6 mt-3 p-3 bg-muted/30 rounded-md space-y-3">
                {/* Sub-options (e.g. spinal segments) */}
                {item.subOptions && item.subOptions.length > 0 && (
                  <div>
                    <Label className="text-xs text-muted-foreground mb-1 block">
                      {language === "de" ? "Genauere Angabe:" : "Specify:"}
                    </Label>
                    <div className="flex flex-wrap gap-2">
                      {item.subOptions.map(opt => (
                        <div key={opt.key} className="flex items-center gap-1.5">
                          <Checkbox
                            checked={getSubOptionChecked(item.key, opt.key)}
                            onCheckedChange={(checked) => onSubItemChange(item.key, opt.key, !!checked)}
                          />
                          <Label className="font-normal text-xs cursor-pointer">
                            {language === "de" ? opt.labelDe : opt.labelEn}
                          </Label>
                        </div>
                      ))}
                    </div>
                  </div>
                )}
                <TemporalStatusSelect
                  prefix={item.key}
                  seitYear={seitParsed.year}
                  seitMonth={seitParsed.month}
                  status={data.status}
                  bisYear={bisParsed.year}
                  bisMonth={bisParsed.month}
                  onSeitYearChange={(v) => setYearMonth(item.key, "seit", { year: v })}
                  onSeitMonthChange={(v) => setYearMonth(item.key, "seit", { month: v })}
                  onStatusChange={(v) => onSubItemChange(item.key, "status", v)}
                  onBisYearChange={(v) => setYearMonth(item.key, "bisJahr", { year: v })}
                  onBisMonthChange={(v) => setYearMonth(item.key, "bisJahr", { month: v })}
                  birthYear={birthYear}
                />
              </div>
            )}
          </div>
        );
      })}
    </div>
  );
};

export default SubConditionList;
