import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { Plus, Trash2 } from "lucide-react";
import { useLanguage } from "@/contexts/LanguageContext";
import YearMonthSelect from "./YearMonthSelect";

interface EntryField {
  key: string;
  labelDe: string;
  labelEn: string;
  type?: "text" | "year" | "select";
  options?: { value: string; labelDe: string; labelEn: string }[];
  placeholderDe?: string;
  placeholderEn?: string;
}

interface MultiEntryFieldProps {
  entries: Record<string, any>[];
  onChange: (entries: Record<string, any>[]) => void;
  fields: EntryField[];
  titleDe: string;
  titleEn: string;
  addLabelDe: string;
  addLabelEn: string;
  emptyTextDe: string;
  emptyTextEn: string;
  maxEntries?: number;
  birthYear?: number;
}

const MultiEntryField = ({
  entries,
  onChange,
  fields,
  titleDe,
  titleEn,
  addLabelDe,
  addLabelEn,
  emptyTextDe,
  emptyTextEn,
  maxEntries = 20,
  birthYear,
}: MultiEntryFieldProps) => {
  const { language } = useLanguage();

  const addEntry = () => {
    if (entries.length >= maxEntries) return;
    const newEntry: Record<string, any> = {};
    fields.forEach((field) => {
      newEntry[field.key] = "";
    });
    onChange([...entries, newEntry]);
  };

  const removeEntry = (index: number) => {
    onChange(entries.filter((_, i) => i !== index));
  };

  const updateEntry = (index: number, field: string, value: any) => {
    const updated = entries.map((entry, i) =>
      i === index ? { ...entry, [field]: value } : entry
    );
    onChange(updated);
  };

  return (
    <div className="space-y-4">
      <div className="flex items-center justify-between">
        <h3 className="text-lg font-medium">
          {language === "de" ? titleDe : titleEn}
        </h3>
        <Button
          type="button"
          variant="outline"
          size="sm"
          onClick={addEntry}
          disabled={entries.length >= maxEntries}
        >
          <Plus className="w-4 h-4 mr-2" />
          {language === "de" ? addLabelDe : addLabelEn}
        </Button>
      </div>

      {entries.length === 0 && (
        <p className="text-sm text-muted-foreground">
          {language === "de" ? emptyTextDe : emptyTextEn}
        </p>
      )}

      {entries.map((entry, index) => (
        <div
          key={index}
          className="flex gap-4 items-start p-4 bg-muted/30 rounded-lg"
        >
          <div className="flex-1 grid gap-4 md:grid-cols-2">
            {fields.map((field) => (
              <div key={field.key} className="space-y-2">
                <Label className="text-sm">
                  {language === "de" ? field.labelDe : field.labelEn}
                </Label>
                {field.type === "year" ? (
                  <YearMonthSelect
                    yearValue={entry[field.key] || ""}
                    onYearChange={(value) => updateEntry(index, field.key, value)}
                    showMonth={false}
                    birthYear={birthYear}
                  />
                ) : (
                  <Input
                    placeholder={
                      language === "de"
                        ? field.placeholderDe
                        : field.placeholderEn
                    }
                    value={entry[field.key] || ""}
                    onChange={(e) =>
                      updateEntry(index, field.key, e.target.value)
                    }
                  />
                )}
              </div>
            ))}
          </div>
          <Button
            type="button"
            variant="ghost"
            size="icon"
            onClick={() => removeEntry(index)}
            className="text-destructive hover:text-destructive"
          >
            <Trash2 className="w-4 h-4" />
          </Button>
        </div>
      ))}
    </div>
  );
};

export default MultiEntryField;
