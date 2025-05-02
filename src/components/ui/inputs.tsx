
import React, { useState } from "react";
import { Input } from "@/components/ui/input";
import { cn } from "@/lib/utils";

// Format CPF as user types (000.000.000-00)
const formatCPF = (value: string) => {
  const digits = value.replace(/\D/g, '');
  if (digits.length <= 3) return digits;
  if (digits.length <= 6) return `${digits.slice(0, 3)}.${digits.slice(3)}`;
  if (digits.length <= 9) return `${digits.slice(0, 3)}.${digits.slice(3, 6)}.${digits.slice(6)}`;
  return `${digits.slice(0, 3)}.${digits.slice(3, 6)}.${digits.slice(6, 9)}-${digits.slice(9, 11)}`;
};

// Validate CPF with proper algorithm
const isValidCPF = (cpf: string) => {
  cpf = cpf.replace(/[^\d]+/g, '');
  
  if (cpf.length !== 11 || !!cpf.match(/(\d)\1{10}/)) {
    return false;
  }
  
  const digits = cpf.split('').map(x => parseInt(x));
  
  // Validate first check digit
  const sum1 = digits.slice(0, 9).reduce((acc, x, i) => acc + x * (10 - i), 0);
  const mod1 = (sum1 * 10) % 11;
  const check1 = mod1 === 10 ? 0 : mod1;
  
  if (check1 !== digits[9]) {
    return false;
  }
  
  // Validate second check digit
  const sum2 = digits.slice(0, 10).reduce((acc, x, i) => acc + x * (11 - i), 0);
  const mod2 = (sum2 * 10) % 11;
  const check2 = mod2 === 10 ? 0 : mod2;
  
  return check2 === digits[10];
};

interface InputTextProps extends React.InputHTMLAttributes<HTMLInputElement> {}

export const InputText = React.forwardRef<HTMLInputElement, InputTextProps>(
  ({ className, ...props }, ref) => {
    return (
      <Input
        className={cn("focus:border-primary-lighter focus:ring-primary-lighter/20", className)}
        ref={ref}
        {...props}
      />
    );
  }
);
InputText.displayName = "InputText";

export const InputEmail = React.forwardRef<HTMLInputElement, InputTextProps>(
  ({ className, ...props }, ref) => {
    return (
      <Input
        type="email"
        className={cn("focus:border-primary-lighter focus:ring-primary-lighter/20", className)}
        ref={ref}
        {...props}
      />
    );
  }
);
InputEmail.displayName = "InputEmail";

export const InputPassword = React.forwardRef<HTMLInputElement, InputTextProps>(
  ({ className, ...props }, ref) => {
    return (
      <Input
        type="password"
        className={cn("focus:border-primary-lighter focus:ring-primary-lighter/20", className)}
        ref={ref}
        {...props}
      />
    );
  }
);
InputPassword.displayName = "InputPassword";

interface InputCPFProps extends InputTextProps {
  onValidChange?: (isValid: boolean) => void;
}

export const InputCPF = React.forwardRef<HTMLInputElement, InputCPFProps>(
  ({ className, onChange, onValidChange, ...props }, ref) => {
    const [isValid, setIsValid] = useState(true);

    const handleChange = (e: React.ChangeEvent<HTMLInputElement>) => {
      const formatted = formatCPF(e.target.value);
      e.target.value = formatted;
      
      const valid = formatted.length === 14 ? isValidCPF(formatted) : true;
      setIsValid(valid);
      if (onValidChange) onValidChange(valid);
      
      if (onChange) onChange(e);
    };

    return (
      <Input
        className={cn(
          "focus:border-primary-lighter focus:ring-primary-lighter/20",
          !isValid && "border-red-500",
          className
        )}
        onChange={handleChange}
        ref={ref}
        maxLength={14}
        {...props}
      />
    );
  }
);
InputCPF.displayName = "InputCPF";
