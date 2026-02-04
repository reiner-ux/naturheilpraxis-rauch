import { Checkbox } from "@/components/ui/checkbox";
import { Label } from "@/components/ui/label";
import { Input } from "@/components/ui/input";
import { useLanguage } from "@/contexts/LanguageContext";
import { useState } from "react";

interface Option {
  value: string;
  labelDe: string;
  labelEn: string;
}

interface MultiSelectCheckboxProps {
  options: Option[];
  selectedValues: string[];
  onChange: (values: string[]) => void;
  allowOther?: boolean;
  otherValue?: string;
  onOtherChange?: (value: string) => void;
  otherPlaceholderDe?: string;
  otherPlaceholderEn?: string;
  columns?: 1 | 2 | 3 | 4;
  className?: string;
}

const MultiSelectCheckbox = ({
  options,
  selectedValues,
  onChange,
  allowOther = true,
  otherValue = "",
  onOtherChange,
  otherPlaceholderDe = "Sonstiges...",
  otherPlaceholderEn = "Other...",
  columns = 2,
  className = "",
}: MultiSelectCheckboxProps) => {
  const { language } = useLanguage();
  const [showOther, setShowOther] = useState(!!otherValue);

  const handleCheckChange = (value: string, checked: boolean) => {
    if (checked) {
      onChange([...selectedValues, value]);
    } else {
      onChange(selectedValues.filter((v) => v !== value));
    }
  };

  const gridCols = {
    1: "grid-cols-1",
    2: "grid-cols-1 md:grid-cols-2",
    3: "grid-cols-1 md:grid-cols-2 lg:grid-cols-3",
    4: "grid-cols-1 md:grid-cols-2 lg:grid-cols-4",
  };

  return (
    <div className={`space-y-3 ${className}`}>
      <div className={`grid gap-2 ${gridCols[columns]}`}>
        {options.map((option) => (
          <div key={option.value} className="flex items-center space-x-2">
            <Checkbox
              id={`multi-${option.value}`}
              checked={selectedValues.includes(option.value)}
              onCheckedChange={(checked) =>
                handleCheckChange(option.value, !!checked)
              }
            />
            <Label
              htmlFor={`multi-${option.value}`}
              className="font-normal text-sm cursor-pointer"
            >
              {language === "de" ? option.labelDe : option.labelEn}
            </Label>
          </div>
        ))}

        {allowOther && (
          <div className="flex items-center space-x-2">
            <Checkbox
              id="multi-other"
              checked={showOther}
              onCheckedChange={(checked) => {
                setShowOther(!!checked);
                if (!checked && onOtherChange) {
                  onOtherChange("");
                }
              }}
            />
            <Label htmlFor="multi-other" className="font-normal text-sm cursor-pointer">
              {language === "de" ? "Sonstiges" : "Other"}
            </Label>
          </div>
        )}
      </div>

      {allowOther && showOther && onOtherChange && (
        <Input
          className="max-w-md"
          placeholder={language === "de" ? otherPlaceholderDe : otherPlaceholderEn}
          value={otherValue}
          onChange={(e) => onOtherChange(e.target.value)}
        />
      )}
    </div>
  );
};

export default MultiSelectCheckbox;
