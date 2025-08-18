import * as React from "react"
import { cn } from "@/lib/utils"

/**
 * Accessible, styled input component
 * Works with refs (forwardRef) and supports variants via `className`.
 */
const Input = React.forwardRef(({ className, type = "text", ...props }, ref) => {
  return (
    <input
      ref={ref}
      type={type}
      className={cn(
        "flex w-full rounded-md border border-input bg-background px-3 py-2 text-sm",
        "ring-offset-background placeholder:text-muted-foreground",
        "focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-ring focus-visible:ring-offset-2",
        "disabled:cursor-not-allowed disabled:opacity-50",
        "file:border-0 file:bg-transparent file:text-sm file:font-medium",
        "h-10 transition-colors duration-200 ease-in-out", // smoother reactive feel
        className
      )}
      {...props}
    />
  )
})

Input.displayName = "Input"

export { Input }
