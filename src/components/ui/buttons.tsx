
import React from "react";
import { Button, ButtonProps } from "@/components/ui/button";
import { cn } from "@/lib/utils";

export const ButtonPrimary = React.forwardRef<HTMLButtonElement, ButtonProps>(
  ({ className, ...props }, ref) => {
    return (
      <Button
        className={cn("bg-gradient-primary hover:opacity-90", className)}
        ref={ref}
        {...props}
      />
    );
  }
);
ButtonPrimary.displayName = "ButtonPrimary";

export const ButtonSecondary = React.forwardRef<HTMLButtonElement, ButtonProps>(
  ({ className, ...props }, ref) => {
    return (
      <Button
        variant="outline"
        className={cn("border-primary-lighter text-primary-lighter hover:bg-primary-lighter/10", className)}
        ref={ref}
        {...props}
      />
    );
  }
);
ButtonSecondary.displayName = "ButtonSecondary";
