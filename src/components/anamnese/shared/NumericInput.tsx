import { Input } from "@/components/ui/input";
import { forwardRef, ChangeEvent } from "react";

interface NumericInputProps extends Omit<React.ComponentProps<"input">, "onChange" | "type" | "inputMode"> {
  value: string;
  onChange: (value: string) => void;
  min?: number;
  max?: number;
  allowDecimals?: boolean;
}

const NumericInput = forwardRef<HTMLInputElement, NumericInputProps>(
  ({ value, onChange, min, max, allowDecimals = false, ...props }, ref) => {
    const handleChange = (e: ChangeEvent<HTMLInputElement>) => {
      let val = e.target.value;
      
      // Allow only digits (and optionally decimal point)
      if (allowDecimals) {
        val = val.replace(/[^0-9.]/g, "");
        // Only allow one decimal point
        const parts = val.split(".");
        if (parts.length > 2) {
          val = parts[0] + "." + parts.slice(1).join("");
        }
      } else {
        val = val.replace(/[^0-9]/g, "");
      }
      
      // Apply min/max constraints
      if (val !== "" && min !== undefined) {
        const numVal = parseFloat(val);
        if (numVal < min) val = String(min);
      }
      if (val !== "" && max !== undefined) {
        const numVal = parseFloat(val);
        if (numVal > max) val = String(max);
      }
      
      onChange(val);
    };

    return (
      <Input
        ref={ref}
        type="text"
        inputMode="numeric"
        pattern={allowDecimals ? "[0-9]*\\.?[0-9]*" : "[0-9]*"}
        value={value}
        onChange={handleChange}
        min={min}
        max={max}
        {...props}
      />
    );
  }
);

NumericInput.displayName = "NumericInput";

export default NumericInput;
