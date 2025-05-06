
import React from "react";
import { Label as ShadcnLabel } from "@/components/ui/label";
import { cn } from "@/lib/utils";

interface CustomLabelProps extends React.LabelHTMLAttributes<HTMLLabelElement> {
  children: React.ReactNode;
}

const CustomLabel = ({ children, className, ...props }: CustomLabelProps) => {
  return (
    <ShadcnLabel {...props} className={cn(className)}>
      {children}
    </ShadcnLabel>
  );
};

export default CustomLabel;
