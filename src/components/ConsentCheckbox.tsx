
import { Link } from "react-router-dom";
import { Checkbox } from "@/components/ui/checkbox";
import { CustomLabel } from "@/components/ui/custom-label";
import { FormControl, FormField, FormItem, FormMessage } from "@/components/ui/form";
import { Control } from "react-hook-form";

interface ConsentCheckboxProps {
  control: Control<any>;
  name: string;
}

const ConsentCheckbox = ({ control, name }: ConsentCheckboxProps) => {
  return (
    <FormField
      control={control}
      name={name}
      render={({ field }) => (
        <FormItem className="flex flex-row items-start space-x-3 space-y-0 py-2">
          <FormControl>
            <Checkbox 
              checked={field.value} 
              onCheckedChange={field.onChange} 
              id="consent-checkbox"
            />
          </FormControl>
          <div className="space-y-1 leading-none">
            <CustomLabel 
              htmlFor="consent-checkbox" 
              className="text-sm font-normal"
            >
              Li e concordo com o{" "}
              <Link to="/termo-de-consentimento" className="text-blue-600 hover:underline" target="_blank">
                Termo de Consentimento para Tratamento de Dados Pessoais
              </Link>{" "}
              do GestorFest.
            </CustomLabel>
            <FormMessage />
          </div>
        </FormItem>
      )}
    />
  );
};

export default ConsentCheckbox;
