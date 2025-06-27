import React from "react";

import { cn } from "@/lib/utils/class.utils";

interface BadgeProps extends React.HTMLAttributes<HTMLDivElement> {
  variant?:
    | "primary"
    | "secondary"
    | "accent"
    | "success"
    | "error"
    | "warning"
    | "outline";
  size?: "sm" | "md" | "lg";
}

const variantStyles = {
  primary: "bg-primary-100 text-primary-800",
  secondary: "bg-secondary-100 text-secondary-800",
  accent: "bg-accent-100 text-accent-800",
  success: "bg-success-100 text-success-800",
  error: "bg-error-100 text-error-800",
  warning: "bg-warning-100 text-warning-800",
  outline: "bg-transparent border border-gray-300 text-gray-700",
};

const sizeStyles = {
  sm: "text-xs px-2 py-0.5",
  md: "text-xs px-2.5 py-0.5",
  lg: "text-sm px-3 py-1",
};

const Badge = React.forwardRef<HTMLDivElement, BadgeProps>(
  ({ className, variant = "primary", size = "md", ...props }, ref) => {
    return (
      <div
        ref={ref}
        className={cn(
          "inline-flex items-center rounded-full font-medium",
          variantStyles[variant],
          sizeStyles[size],
          className
        )}
        {...props}
      />
    );
  }
);

Badge.displayName = "Badge";

export default Badge;
