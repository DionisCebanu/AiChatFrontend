import * as React from "react";
import * as LabelPrimitive from "@radix-ui/react-label";
import { cva } from "class-variance-authority";
import { cn } from "@/lib/utils";

export const labelVariants = cva(
  "leading-none peer-disabled:cursor-not-allowed peer-disabled:opacity-70",
  {
    variants: {
      size: {
        sm: "text-xs",
        md: "text-sm",
        lg: "text-base",
      },
      tone: {
        default: "text-foreground",
        muted: "text-muted-foreground",
        destructive: "text-destructive",
      },
      weight: {
        normal: "font-medium",
        semibold: "font-semibold",
        bold: "font-bold",
      },
    },
    defaultVariants: {
      size: "md",
      tone: "default",
      weight: "normal",
    },
  }
);

const RequiredMark = () => (
  <span aria-hidden="true" className="ml-0.5 text-destructive select-none">
    *
  </span>
);

/**
 * Label component (Radix-based) with variants and optional required mark.
 * Props:
 * - size: "sm" | "md" | "lg"
 * - tone: "default" | "muted" | "destructive"
 * - weight: "normal" | "semibold" | "bold"
 * - required: boolean (adds a visual asterisk and an SR-only note)
 * - srRequiredText: string (screen reader text appended when required)
 */
const Label = React.forwardRef(
  (
    {
      className,
      size,
      tone,
      weight,
      required = false,
      srRequiredText = "required",
      children,
      ...props
    },
    ref
  ) => {
    return (
      <LabelPrimitive.Root
        ref={ref}
        className={cn(labelVariants({ size, tone, weight }), className)}
        {...props}
      >
        {children}
        {required && (
          <>
            <RequiredMark />
            <span className="sr-only"> {srRequiredText}</span>
          </>
        )}
      </LabelPrimitive.Root>
    );
  }
);

Label.displayName = LabelPrimitive.Root.displayName;

export { Label };
