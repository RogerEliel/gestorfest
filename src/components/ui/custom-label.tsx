
import * as React from "react"
import { cn } from "@/lib/utils"

export interface CustomLabelProps
  extends React.LabelHTMLAttributes<HTMLLabelElement> {
  children: React.ReactNode
  className?: string
  htmlFor?: string
}

const CustomLabel = React.forwardRef<HTMLLabelElement, CustomLabelProps>(
  ({ className, children, htmlFor, ...props }, ref) => {
    return (
      <label
        ref={ref}
        htmlFor={htmlFor}
        className={cn("text-sm font-medium leading-none peer-disabled:cursor-not-allowed peer-disabled:opacity-70", className)}
        {...props}
      >
        {children}
      </label>
    )
  }
)
CustomLabel.displayName = "CustomLabel"

export { CustomLabel }
