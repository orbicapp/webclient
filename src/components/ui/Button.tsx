import React from "react";

import { cn } from "@/lib/utils/class.utils";

type ButtonVariant = "primary" | "secondary" | "accent" | "outline" | "ghost" | "success" | "warning" | "danger" | "neon";
type ButtonSize = "sm" | "md" | "lg" | "xl";

interface ButtonProps extends React.ButtonHTMLAttributes<HTMLButtonElement> {
  variant?: ButtonVariant;
  size?: ButtonSize;
  isLoading?: boolean;
  leftIcon?: React.ReactNode;
  rightIcon?: React.ReactNode;
  fullWidth?: boolean;
  glow?: boolean;
  // eslint-disable-next-line @typescript-eslint/no-explicit-any
  as?: any; // For polymorphic components
  to?: string;
}

const Button = React.forwardRef<HTMLButtonElement, ButtonProps>(
  (
    {
      children,
      className,
      variant = "primary",
      size = "md",
      isLoading = false,
      leftIcon,
      rightIcon,
      fullWidth = false,
      glow = false,
      disabled,
      as: Component = "button",
      ...props
    },
    ref
  ) => {
    const baseStyles =
      "inline-flex items-center justify-center rounded-xl font-semibold transition-all duration-300 relative overflow-hidden group";

    const variantStyles = {
      primary:
        "bg-gradient-to-r from-primary-500 via-primary-600 to-primary-700 text-white hover:from-primary-600 hover:via-primary-700 hover:to-primary-800 shadow-lg shadow-primary-500/25 hover:shadow-primary-600/40 dark:from-primary-400 dark:via-primary-500 dark:to-primary-600",
      secondary:
        "bg-gradient-to-r from-secondary-500 via-secondary-600 to-secondary-700 text-white hover:from-secondary-600 hover:via-secondary-700 hover:to-secondary-800 shadow-lg shadow-secondary-500/25 hover:shadow-secondary-600/40",
      accent:
        "bg-gradient-to-r from-accent-500 via-accent-600 to-accent-700 text-white hover:from-accent-600 hover:via-accent-700 hover:to-accent-800 shadow-lg shadow-accent-500/25 hover:shadow-accent-600/40",
      success:
        "bg-gradient-to-r from-success-500 via-success-600 to-success-700 text-white hover:from-success-600 hover:via-success-700 hover:to-success-800 shadow-lg shadow-success-500/25 hover:shadow-success-600/40",
      warning:
        "bg-gradient-to-r from-warning-500 via-warning-600 to-warning-700 text-white hover:from-warning-600 hover:via-warning-700 hover:to-warning-800 shadow-lg shadow-warning-500/25 hover:shadow-warning-600/40",
      danger:
        "bg-gradient-to-r from-error-500 via-error-600 to-error-700 text-white hover:from-error-600 hover:via-error-700 hover:to-error-800 shadow-lg shadow-error-500/25 hover:shadow-error-600/40",
      outline:
        "bg-transparent border-2 border-primary-500 text-primary-600 hover:bg-primary-50 hover:border-primary-600 dark:border-primary-400 dark:text-primary-300 dark:hover:bg-primary-900/20",
      ghost:
        "bg-transparent text-primary-600 hover:bg-primary-50 dark:text-primary-400 dark:hover:bg-primary-900/20",
      neon:
        "bg-gray-900 border-2 border-primary-500 text-primary-400 hover:border-primary-400 hover:text-primary-300 shadow-lg shadow-primary-500/30 hover:shadow-primary-400/50",
    };

    const sizeStyles = {
      sm: "text-sm px-4 py-2",
      md: "text-base px-6 py-3",
      lg: "text-lg px-8 py-4",
      xl: "text-xl px-10 py-5",
    };

    const widthStyles = fullWidth ? "w-full" : "";

    const loadingStyles = isLoading ? "opacity-80 cursor-wait" : "";
    const disabledStyles = disabled
      ? "opacity-50 cursor-not-allowed"
      : "active:scale-95 hover:scale-105";

    const glowStyles = glow ? "animate-pulse" : "";

    return (
      <Component
        ref={ref}
        className={cn(
          baseStyles,
          variantStyles[variant],
          sizeStyles[size],
          widthStyles,
          loadingStyles,
          disabledStyles,
          glowStyles,
          className
        )}
        disabled={disabled || isLoading}
        {...props}
      >
        {/* Shine effect */}
        <div className="absolute inset-0 bg-gradient-to-r from-transparent via-white/20 to-transparent -translate-x-full group-hover:translate-x-full transition-transform duration-1000" />
        
        {isLoading && (
          <span className="mr-2 inline-block h-4 w-4 animate-spin rounded-full border-2 border-current border-t-transparent" />
        )}
        {leftIcon && !isLoading && <span className="mr-2">{leftIcon}</span>}
        <span className="relative z-10">{children}</span>
        {rightIcon && <span className="ml-2">{rightIcon}</span>}
      </Component>
    );
  }
);

Button.displayName = "Button";

export default Button;