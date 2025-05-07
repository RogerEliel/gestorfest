
import React from "react";
import { Link } from "react-router-dom";
import { Checkbox } from "@/components/ui/checkbox";
import { CustomLabel } from "@/components/ui/custom-label";
import { FormControl, FormField, FormItem, FormMessage } from "@/components/ui/form";
import { Control } from "react-hook-form";
import { cn } from "@/lib/utils";

interface CheckboxLGPDProps {
  control: Control<any>;
  name: string;
  label: React.ReactNode;
  className?: string;
}

const CheckboxLGPD = ({ control, name, label, className }: CheckboxLGPDProps) => {
  return (
    <FormField
      control={control}
      name={name}
      render={({ field }) => (
        <FormItem className={cn("flex flex-row items-start space-x-3 space-y-0 py-2", className)}>
          <FormControl>
            <Checkbox 
              checked={field.value} 
              onCheckedChange={field.onChange} 
              id={`${name}-checkbox`}
              className="border-primary-lighter data-[state=checked]:bg-gradient-primary data-[state=checked]:border-primary-lighter"
            />
          </FormControl>
          <div className="space-y-1 leading-none">
            <CustomLabel 
              htmlFor={`${name}-checkbox`} 
              className="text-sm font-normal"
            >
              {label}
            </CustomLabel>
            <FormMessage />
          </div>
        </FormItem>
      )}
    />
  );
};

export default CheckboxLGPD;
