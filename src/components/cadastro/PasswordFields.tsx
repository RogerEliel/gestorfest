import { Control } from "react-hook-form";
import { FormField, FormItem, FormControl, FormMessage } from "@/components/ui/form";
import { InputPassword } from "@/components/ui/inputs";
import { CustomLabel } from "@/components/ui/custom-label";

interface PasswordFieldsProps {
  control: Control<any>;
}

const PasswordFields = ({ control }: PasswordFieldsProps) => {
  return (
    <>
      <FormField
        control={control}
        name="password"
        render={({ field }) => (
          <FormItem>
            <CustomLabel>Senha</CustomLabel>
            <FormControl>
              <InputPassword placeholder="********" {...field} />
            </FormControl>
            <FormMessage />
          </FormItem>
        )}
      />
      <FormField
        control={control}
        name="confirmPassword"
        render={({ field }) => (
          <FormItem>
            <CustomLabel>Confirme a senha</CustomLabel>
            <FormControl>
              <InputPassword placeholder="********" {...field} />
            </FormControl>
            <FormMessage />
          </FormItem>
        )}
      />
    </>
  );
};

export default PasswordFields;
