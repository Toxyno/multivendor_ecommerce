import { FormLabel } from "@/components/ui/form";
import { Dot } from "lucide-react";
import { ReactNode } from "react";
interface InputFieldSetProps {
  label: string;
  description?: string;
  children: ReactNode;
}

const InputFieldSet = ({
  label,
  description,
  children,
}: InputFieldSetProps) => {
  return (
    <div>
      <fieldset className="border rounded-md p-4">
        <legend className="px-2">
          <FormLabel>{label}</FormLabel>
        </legend>
        {description && (
          <p className="text-sm text-muted-foreground dark:text-gray-400 pb-3 flex">
            <Dot className="me-1" />
            {description}
          </p>
        )}
        {children}
      </fieldset>
    </div>
  );
};

export default InputFieldSet;
