
import * as React from "react"
import { cn } from "@/lib/utils"

export interface LinkHighlightProps
  extends React.AnchorHTMLAttributes<HTMLAnchorElement> {
  active?: boolean
}

const LinkHighlight = React.forwardRef<HTMLAnchorElement, LinkHighlightProps>(
  ({ className, active, children, ...props }, ref) => {
    return (
      <a
        ref={ref}
        className={cn(
          "inline-block relative px-3 py-2 text-sm font-medium transition-colors",
          "hover:text-primary-lighter focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-ring",
          active && "text-primary-lighter after:absolute after:bottom-0 after:left-0 after:w-full after:h-0.5 after:bg-primary-lighter", 
          className
        )}
        {...props}
      >
        {children}
      </a>
    )
  }
)
LinkHighlight.displayName = "LinkHighlight"

export { LinkHighlight }
