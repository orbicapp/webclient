import React, { useState, useRef, useEffect } from "react";
import { motion, AnimatePresence } from "framer-motion";
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
  const [isOpen, setIsOpen] = useState(false);
  const dropdownRef = useRef<HTMLDivElement>(null);

  // Close dropdown when clicking outside
  useEffect(() => {
    const handleClickOutside = (event: MouseEvent) => {
      if (dropdownRef.current && !dropdownRef.current.contains(event.target as Node)) {
        setIsOpen(false);
      }
    };

    document.addEventListener("mousedown", handleClickOutside);
    return () => document.removeEventListener("mousedown", handleClickOutside);
  }, []);

  // Close dropdown on escape key
  useEffect(() => {
    const handleEscape = (event: KeyboardEvent) => {
      if (event.key === "Escape") {
        setIsOpen(false);
      }
    };

    if (isOpen) {
      document.addEventListener("keydown", handleEscape);
      return () => document.removeEventListener("keydown", handleEscape);
    }
  }, [isOpen]);

  const selectedOption = options.find(option => option.value === value);

  const handleSelect = (optionValue: string) => {
    onChange(optionValue);
    setIsOpen(false);
  };

  const handleClear = () => {
    onChange("");
    setIsOpen(false);
  };

  const variantStyles = {
    default: "bg-white dark:bg-gray-800 border-gray-300 dark:border-gray-600",
    glass: "bg-white/80 dark:bg-gray-800/80 backdrop-blur-lg border-gray-200/50 dark:border-gray-700/50"
  };

  const buttonStyles = cn(
    "w-full flex items-center justify-between px-4 py-3 border-2 rounded-xl transition-all duration-200 focus:outline-none focus:ring-2 focus:ring-primary-500 focus:ring-offset-2",
    variantStyles[variant],
    error 
      ? "border-error-300 dark:border-error-500 focus:border-error-500" 
      : "hover:border-primary-400 dark:hover:border-primary-500 focus:border-primary-500",
    disabled && "opacity-50 cursor-not-allowed",
    className
  );

  const dropdownStyles = cn(
    "absolute top-full left-0 right-0 mt-2 rounded-2xl shadow-2xl border-2 z-50 max-h-80 overflow-y-auto",
    variant === "glass" 
      ? "bg-white/95 dark:bg-gray-800/95 backdrop-blur-xl border-gray-200/50 dark:border-gray-700/50"
      : "bg-white dark:bg-gray-800 border-gray-200 dark:border-gray-700"
  );

  return (
    <div className="relative" ref={dropdownRef}>
      {/* Label */}
      {label && (
        <label className="flex items-center space-x-1 text-sm font-semibold text-gray-700 dark:text-gray-300 mb-2">
          <span>{label}</span>
          {required && <span className="text-error-500 dark:text-error-400">*</span>}
        </label>
      )}

      {/* Dropdown Button */}
      <button
        type="button"
        onClick={() => !disabled && setIsOpen(!isOpen)}
        disabled={disabled}
        className={buttonStyles}
        aria-haspopup="listbox"
        aria-expanded={isOpen}
      >
        <div className="flex items-center space-x-3 min-w-0 flex-1">
          {selectedOption?.icon && (
            <span className="text-lg flex-shrink-0">{selectedOption.icon}</span>
          )}
          <span className={cn(
            "truncate",
            selectedOption 
              ? "text-gray-900 dark:text-gray-100" 
              : "text-gray-500 dark:text-gray-400"
          )}>
            {selectedOption?.label || placeholder}
          </span>
        </div>
        <ChevronDown 
          className={cn(
            "w-5 h-5 text-gray-500 transition-transform flex-shrink-0",
            isOpen && "rotate-180"
          )} 
        />
      </button>

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

      {/* Dropdown Menu */}
      <AnimatePresence>
        {isOpen && (
          <motion.div
            className={dropdownStyles}
            initial={{ opacity: 0, y: -10, scale: 0.95 }}
            animate={{ opacity: 1, y: 0, scale: 1 }}
            exit={{ opacity: 0, y: -10, scale: 0.95 }}
            transition={{ duration: 0.2 }}
          >
            <div className="p-2">
              {/* Clear Option */}
              {showClearOption && (
                <button
                  onClick={handleClear}
                  className="w-full flex items-center space-x-3 px-4 py-3 rounded-xl hover:bg-gray-100 dark:hover:bg-gray-700 transition-colors text-left"
                >
                  {clearOptionIcon && (
                    <span className="text-lg flex-shrink-0">{clearOptionIcon}</span>
                  )}
                  <div className="min-w-0 flex-1">
                    <div className="font-medium text-gray-900 dark:text-gray-100">
                      {clearOptionLabel}
                    </div>
                    {clearOptionDescription && (
                      <div className="text-sm text-gray-500 dark:text-gray-400 truncate">
                        {clearOptionDescription}
                      </div>
                    )}
                  </div>
                  {!value && (
                    <Check className="w-4 h-4 text-primary-600 flex-shrink-0" />
                  )}
                </button>
              )}

              {/* Options */}
              {options.map((option) => (
                <button
                  key={option.value}
                  onClick={() => !option.disabled && handleSelect(option.value)}
                  disabled={option.disabled}
                  className={cn(
                    "w-full flex items-center space-x-3 px-4 py-3 rounded-xl transition-colors text-left",
                    option.disabled 
                      ? "opacity-50 cursor-not-allowed" 
                      : "hover:bg-gray-100 dark:hover:bg-gray-700"
                  )}
                >
                  {option.icon && (
                    <span className="text-lg flex-shrink-0">{option.icon}</span>
                  )}
                  <div className="min-w-0 flex-1">
                    <div className="font-medium text-gray-900 dark:text-gray-100">
                      {option.label}
                    </div>
                    {option.description && (
                      <div className="text-sm text-gray-500 dark:text-gray-400 truncate">
                        {option.description}
                      </div>
                    )}
                  </div>
                  {value === option.value && (
                    <Check className="w-4 h-4 text-primary-600 flex-shrink-0" />
                  )}
                </button>
              ))}
            </div>
          </motion.div>
        )}
      </AnimatePresence>
    </div>
  );
};

export default Dropdown;