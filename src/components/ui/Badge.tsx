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
    | "outline"
    | "neon"
    | "gradient";
  size?: "sm" | "md" | "lg";
  glow?: boolean;
  pulse?: boolean;
}

const variantStyles = {
  primary: "bg-primary-100 text-primary-800 border border-primary-200 dark:bg-primary-900/30 dark:text-primary-300 dark:border-primary-700",
  secondary: "bg-secondary-100 text-secondary-800 border border-secondary-200 dark:bg-secondary-900/30 dark:text-secondary-300 dark:border-secondary-700",
  accent: "bg-accent-100 text-accent-800 border border-accent-200 dark:bg-accent-900/30 dark:text-accent-300 dark:border-accent-700",
  success: "bg-success-100 text-success-800 border border-success-200 dark:bg-success-900/30 dark:text-success-300 dark:border-success-700",
  error: "bg-error-100 text-error-800 border border-error-200 dark:bg-error-900/30 dark:text-error-300 dark:border-error-700",
  warning: "bg-warning-100 text-warning-800 border border-warning-200 dark:bg-warning-900/30 dark:text-warning-300 dark:border-warning-700",
  outline: "bg-transparent border border-gray-300 text-gray-700 dark:border-gray-600 dark:text-gray-300",
  neon: "bg-gray-900 border border-primary-500 text-primary-400 shadow-lg shadow-primary-500/30",
  gradient: "bg-gradient-to-r from-primary-500 to-accent-500 text-white border-0 shadow-lg shadow-primary-500/25",
};

const sizeStyles = {
  sm: "text-xs px-2 py-0.5",
  md: "text-xs px-2.5 py-1",
  lg: "text-sm px-3 py-1.5",
};

const Badge = React.forwardRef<HTMLDivElement, BadgeProps>(
  ({ 
    className, 
    variant = "primary", 
    size = "md", 
    glow = false,
    pulse = false,
    ...props 
  }, ref) => {
    return (
      <div
        ref={ref}
        className={cn(
          "inline-flex items-center rounded-full font-medium transition-all duration-200",
          variantStyles[variant],
          sizeStyles[size],
          glow && "shadow-lg",
          pulse && "animate-pulse",
          className
        )}
        {...props}
      />
    );
  }
);

Badge.displayName = "Badge";

export default Badge;