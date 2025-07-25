import { cn } from "@/lib/utils";
import { ComponentProps } from "react";
import { Label } from "./ui/label";
import { Input } from "./ui/input";

export const CommonInputField = ({
  className,
  inputProps,
  label,
  error = "",
}: {
  className?: string;
  inputProps?: ComponentProps<"input">;
  label?: string;
  error?: string;
}) => {
  return (
    <div className={cn("flex flex-col gap-2", className)}>
      <Label htmlFor={inputProps?.id}>{label}</Label>
      <div>
        <Input autoFocus={false} {...inputProps} />
        {error && <span className="text-red-500 text-xs ml-2">{error}</span>}
      </div>
    </div>
  );
};
