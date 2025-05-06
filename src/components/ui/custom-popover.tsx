
import React from "react";
import { PopoverTrigger as ShadcnPopoverTrigger } from "@/components/ui/popover";

interface CustomPopoverTriggerProps extends React.ButtonHTMLAttributes<HTMLButtonElement> {
  children: React.ReactNode;
  asChild?: boolean;
}

export const CustomPopoverTrigger = ({ children, asChild, ...props }: CustomPopoverTriggerProps) => {
  return (
    <ShadcnPopoverTrigger {...props} asChild={asChild}>
      {children}
    </ShadcnPopoverTrigger>
  );
};
