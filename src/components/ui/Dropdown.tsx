import React from "react";
import * as Select from "@radix-ui/react-select";
import { motion } from "framer-motion";
import { ChevronDown, Check } from "lucide-react";
import { cn } from "@/lib/utils/class.utils";

export interface DropdownOption {
  value: string;
  label: string;
  icon?: React.ReactNode;
  description?: string;
  disabled?: boolean;
}

interface DropdownProps {
  label?: string;
  placeholder?: string;
  value?: string;
  options: DropdownOption[];
  onChange: (value: string) => void;
  className?: string;
  variant?: "default" | "glass";
  showClearOption?: boolean;
  clearOptionLabel?: string;
  clearOptionIcon?: React.ReactNode;
  clearOptionDescription?: string;
  disabled?: boolean;
  error?: string;
  required?: boolean;
}

export const Dropdown: React.FC<DropdownProps> = ({
  label,
  placeholder = "Select an option",
  value,
  options,
  onChange,
  className,
  variant = "default",
  showClearOption = false,
  clearOptionLabel = "Auto-generate",
  clearOptionIcon,
  clearOptionDescription,
  disabled = false,
  error,
  required = false,
}) => {
  const selectedOption = options.find(option => option.value === value);

  const handleValueChange = (newValue: string) => {
    if (newValue === "__clear__") {
      onChange("");
    } else {
      onChange(newValue);
    }
  };

  const variantStyles = {
    default: "bg-white dark:bg-gray-800 border-gray-300 dark:border-gray-600",
    glass: "bg-white/80 dark:bg-gray-800/80 backdrop-blur-lg border-gray-200/50 dark:border-gray-700/50"
  };

  const triggerStyles = cn(
    "w-full flex items-center justify-between px-4 py-3 border-2 rounded-xl transition-all duration-200 focus:outline-none focus:ring-2 focus:ring-primary-500 focus:ring-offset-2 data-[state=open]:ring-2 data-[state=open]:ring-primary-500",
    variantStyles[variant],
    error 
      ? "border-error-300 dark:border-error-500 focus:border-error-500 data-[state=open]:border-error-500" 
      : "hover:border-primary-400 dark:hover:border-primary-500 focus:border-primary-500 data-[state=open]:border-primary-500",
    disabled && "opacity-50 cursor-not-allowed data-[disabled]:opacity-50",
    className
  );

  return (
    <div className="relative">
      {/* Label */}
      {label && (
        <label className="flex items-center space-x-1 text-sm font-semibold text-gray-700 dark:text-gray-300 mb-2">
          <span>{label}</span>
          {required && <span className="text-error-500 dark:text-error-400">*</span>}
        </label>
      )}

      {/* Radix Select */}
      <Select.Root 
        value={value || ""} 
        onValueChange={handleValueChange}
        disabled={disabled}
      >
        <Select.Trigger className={triggerStyles} aria-label={label || placeholder}>
          <div className="flex items-center space-x-3 min-w-0 flex-1">
            {selectedOption?.icon && (
              <span className="text-lg flex-shrink-0">{selectedOption.icon}</span>
            )}
            <Select.Value 
              placeholder={placeholder}
              className={cn(
                "truncate",
                selectedOption 
                  ? "text-gray-900 dark:text-gray-100" 
                  : "text-gray-500 dark:text-gray-400"
              )}
            />
          </div>
          <Select.Icon asChild>
            <ChevronDown className="w-5 h-5 text-gray-500 transition-transform data-[state=open]:rotate-180 flex-shrink-0" />
          </Select.Icon>
        </Select.Trigger>

        {/* Portal Content */}
        <Select.Portal>
          <Select.Content
            className={cn(
              "relative z-50 min-w-[8rem] overflow-hidden rounded-2xl shadow-2xl border-2 animate-in fade-in-0 zoom-in-95",
              variant === "glass" 
                ? "bg-white/95 dark:bg-gray-800/95 backdrop-blur-xl border-gray-200/50 dark:border-gray-700/50"
                : "bg-white dark:bg-gray-800 border-gray-200 dark:border-gray-700"
            )}
            position="popper"
            sideOffset={8}
          >
            <motion.div
              initial={{ opacity: 0, y: -10 }}
              animate={{ opacity: 1, y: 0 }}
              exit={{ opacity: 0, y: -10 }}
              transition={{ duration: 0.15 }}
            >
              <Select.Viewport className="p-2 max-h-80">
                {/* Clear Option */}
                {showClearOption && (
                  <Select.Item
                    value="__clear__"
                    className="relative flex items-center space-x-3 px-4 py-3 rounded-xl cursor-pointer select-none outline-none hover:bg-gray-100 dark:hover:bg-gray-700 focus:bg-gray-100 dark:focus:bg-gray-700 transition-colors data-[highlighted]:bg-gray-100 dark:data-[highlighted]:bg-gray-700"
                  >
                    {clearOptionIcon && (
                      <span className="text-lg flex-shrink-0">{clearOptionIcon}</span>
                    )}
                    <div className="min-w-0 flex-1">
                      <Select.ItemText className="font-medium text-gray-900 dark:text-gray-100">
                        {clearOptionLabel}
                      </Select.ItemText>
                      {clearOptionDescription && (
                        <div className="text-sm text-gray-500 dark:text-gray-400 truncate">
                          {clearOptionDescription}
                        </div>
                      )}
                    </div>
                    <Select.ItemIndicator className="flex-shrink-0">
                      <Check className="w-4 h-4 text-primary-600" />
                    </Select.ItemIndicator>
                  </Select.Item>
                )}

                {/* Regular Options */}
                {options.map((option) => (
                  <Select.Item
                    key={option.value}
                    value={option.value}
                    disabled={option.disabled}
                    className={cn(
                      "relative flex items-center space-x-3 px-4 py-3 rounded-xl cursor-pointer select-none outline-none transition-colors",
                      option.disabled 
                        ? "opacity-50 cursor-not-allowed" 
                        : "hover:bg-gray-100 dark:hover:bg-gray-700 focus:bg-gray-100 dark:focus:bg-gray-700 data-[highlighted]:bg-gray-100 dark:data-[highlighted]:bg-gray-700"
                    )}
                  >
                    {option.icon && (
                      <span className="text-lg flex-shrink-0">{option.icon}</span>
                    )}
                    <div className="min-w-0 flex-1">
                      <Select.ItemText className="font-medium text-gray-900 dark:text-gray-100">
                        {option.label}
                      </Select.ItemText>
                      {option.description && (
                        <div className="text-sm text-gray-500 dark:text-gray-400 truncate">
                          {option.description}
                        </div>
                      )}
                    </div>
                    <Select.ItemIndicator className="flex-shrink-0">
                      <Check className="w-4 h-4 text-primary-600" />
                    </Select.ItemIndicator>
                  </Select.Item>
                ))}
              </Select.Viewport>
            </motion.div>
          </Select.Content>
        </Select.Portal>
      </Select.Root>

      {/* Error Message */}
      {error && (
        <motion.p
          className="mt-2 text-sm text-error-600 dark:text-error-400"
          initial={{ opacity: 0, y: -10 }}
          animate={{ opacity: 1, y: 0 }}
          exit={{ opacity: 0, y: -10 }}
        >
          {error}
        </motion.p>
      )}
    </div>
  );
};

export default Dropdown;