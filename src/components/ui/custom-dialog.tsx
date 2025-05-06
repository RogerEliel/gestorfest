
import React from "react";
import { DialogTitle as ShadcnDialogTitle, DialogDescription as ShadcnDialogDescription } from "@/components/ui/dialog";
import { cn } from "@/lib/utils";

interface CustomDialogTitleProps extends React.HTMLAttributes<HTMLHeadingElement> {
  children: React.ReactNode;
}

export const CustomDialogTitle = ({ children, className, ...props }: CustomDialogTitleProps) => {
  return (
    <ShadcnDialogTitle {...props} className={cn(className)}>
      {children}
    </ShadcnDialogTitle>
  );
};

interface CustomDialogDescriptionProps extends React.HTMLAttributes<HTMLParagraphElement> {
  children: React.ReactNode;
}

export const CustomDialogDescription = ({ children, className, ...props }: CustomDialogDescriptionProps) => {
  return (
    <ShadcnDialogDescription {...props} className={cn(className)}>
      {children}
    </ShadcnDialogDescription>
  );
};
