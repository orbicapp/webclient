import { AnimatePresence, motion } from "framer-motion";
import { AlertCircle, Check, Eye, EyeOff } from "lucide-react";
import React, { useState } from "react";

import { cn } from "@/lib/utils/class.utils";

type InputTypeUnion = React.InputHTMLAttributes<HTMLInputElement> &
  React.TextareaHTMLAttributes<HTMLTextAreaElement>;

export interface InputProps extends InputTypeUnion {
  label?: string;
  error?: string;
  success?: boolean;
  leftIcon?: React.ReactNode;
  rightIcon?: React.ReactNode;
  helperText?: string;
  as?: "input" | "textarea";
  rows?: number;
  showPasswordToggle?: boolean;
  variant?: "default" | "glass" | "neon";
}

const Input = React.forwardRef<HTMLInputElement, InputProps>(
  (
    {
      className,
      label,
      error,
      success,
      leftIcon,
      rightIcon,
      helperText,
      as = "input",
      rows = 3,
      type = "text",
      showPasswordToggle,
      disabled,
      required,
      variant = "default",
      ...props
    },
    ref
  ) => {
    const [showPassword, setShowPassword] = useState(false);
    const [isFocused, setIsFocused] = useState(false);

    const Component = as === "textarea" ? "textarea" : "input";

    const inputType = showPasswordToggle
      ? showPassword
        ? "text"
        : "password"
      : type;

    const variantStyles = {
      default: "bg-white dark:bg-gray-800 border-gray-300 dark:border-gray-600",
      glass: "bg-white/80 dark:bg-gray-800/80 backdrop-blur-lg border-white/20 dark:border-gray-700/20",
      neon: "bg-gray-900 border-primary-500/50 text-primary-100 placeholder:text-primary-300/50"
    };

    const inputStyles = cn(
      "block w-full transition-all duration-300 p-3",
      "rounded-xl border shadow-sm",
      "placeholder:text-gray-500 dark:placeholder:text-gray-400",
      "disabled:cursor-not-allowed disabled:opacity-50",
      "focus:outline-none focus:ring-2 focus:ring-offset-0",
      variantStyles[variant],
      leftIcon && "pl-11",
      rightIcon || showPasswordToggle ? "pr-11" : "pr-4",
      error
        ? "border-error-300 dark:border-error-500 focus:border-error-500 focus:ring-error-200 dark:focus:ring-error-500/20 shadow-error-500/10"
        : success
        ? "border-success-300 dark:border-success-500 focus:border-success-500 focus:ring-success-200 dark:focus:ring-success-500/20 shadow-success-500/10"
        : "focus:border-primary-500 focus:ring-primary-200 dark:focus:ring-primary-500/20 hover:border-primary-400 dark:hover:border-primary-500",
      disabled && "bg-gray-50 dark:bg-gray-900",
      isFocused && variant === "neon" && "shadow-lg shadow-primary-500/25",
      className
    );

    const labelStyles = cn(
      "block text-sm font-semibold transition-colors duration-200 mb-2",
      error
        ? "text-error-600 dark:text-error-400"
        : success
        ? "text-success-600 dark:text-success-400"
        : "text-gray-700 dark:text-gray-300",
      disabled && "opacity-50"
    );

    return (
      <div className="w-full">
        {label && (
          <label className="flex items-center space-x-1">
            <span className={labelStyles}>{label}</span>
            {required && (
              <span className="text-error-500 dark:text-error-400">*</span>
            )}
          </label>
        )}

        <div className="relative">
          <AnimatePresence>
            {leftIcon && (
              <motion.div
                initial={{ opacity: 0, x: -10 }}
                animate={{ opacity: 1, x: 0 }}
                exit={{ opacity: 0, x: -10 }}
                className={cn(
                  "absolute inset-y-0 left-0 flex items-center pl-3 pointer-events-none transition-colors",
                  error
                    ? "text-error-500 dark:text-error-400"
                    : success
                    ? "text-success-500 dark:text-success-400"
                    : isFocused
                    ? "text-primary-500 dark:text-primary-400"
                    : "text-gray-500 dark:text-gray-400"
                )}
              >
                {leftIcon}
              </motion.div>
            )}
          </AnimatePresence>

          <Component
            // eslint-disable-next-line @typescript-eslint/no-explicit-any
            ref={ref as any}
            type={inputType}
            rows={as === "textarea" ? rows : undefined}
            className={inputStyles}
            disabled={disabled}
            required={required}
            onFocus={() => setIsFocused(true)}
            onBlur={() => setIsFocused(false)}
            {...props}
          />

          <AnimatePresence>
            {(rightIcon || showPasswordToggle || error || success) && (
              <motion.div
                initial={{ opacity: 0, x: 10 }}
                animate={{ opacity: 1, x: 0 }}
                exit={{ opacity: 0, x: 10 }}
                className="absolute inset-y-0 right-0 flex items-center pr-3"
              >
                {error ? (
                  <AlertCircle className="w-5 h-5 text-error-500 dark:text-error-400" />
                ) : success ? (
                  <Check className="w-5 h-5 text-success-500 dark:text-success-400" />
                ) : showPasswordToggle ? (
                  <button
                    type="button"
                    onClick={() => setShowPassword(!showPassword)}
                    className="text-gray-500 dark:text-gray-400 hover:text-gray-700 dark:hover:text-gray-200 focus:outline-none transition-colors"
                  >
                    {showPassword ? (
                      <EyeOff className="w-5 h-5" />
                    ) : (
                      <Eye className="w-5 h-5" />
                    )}
                  </button>
                ) : (
                  rightIcon
                )}
              </motion.div>
            )}
          </AnimatePresence>
        </div>

        <AnimatePresence>
          {(error || helperText) && (
            <motion.p
              initial={{ opacity: 0, y: -10 }}
              animate={{ opacity: 1, y: 0 }}
              exit={{ opacity: 0, y: -10 }}
              className={cn(
                "mt-2 text-sm",
                error
                  ? "text-error-600 dark:text-error-400"
                  : "text-gray-500 dark:text-gray-400"
              )}
            >
              {error || helperText}
            </motion.p>
          )}
        </AnimatePresence>
      </div>
    );
  }
);

Input.displayName = "Input";

export default Input;