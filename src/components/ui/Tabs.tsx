import React, { useState, createContext, useContext } from "react";
import { motion, AnimatePresence } from "framer-motion";
import { cn } from "@/lib/utils/class.utils";

// Context for tabs
interface TabsContextType {
  activeTab: string;
  setActiveTab: (tab: string) => void;
  variant: "default" | "fancy";
}

const TabsContext = createContext<TabsContextType | undefined>(undefined);

const useTabsContext = () => {
  const context = useContext(TabsContext);
  if (!context) {
    throw new Error("Tabs components must be used within a Tabs provider");
  }
  return context;
};

// Main Tabs Container
interface TabsProps {
  defaultValue: string;
  value?: string;
  onValueChange?: (value: string) => void;
  children: React.ReactNode;
  className?: string;
  variant?: "default" | "fancy";
}

export function Tabs({
  defaultValue,
  value,
  onValueChange,
  children,
  className,
  variant = "default",
}: TabsProps) {
  const [internalValue, setInternalValue] = useState(defaultValue);

  const activeTab = value ?? internalValue;

  const setActiveTab = (tab: string) => {
    if (!value) {
      setInternalValue(tab);
    }
    onValueChange?.(tab);
  };

  return (
    <TabsContext.Provider value={{ activeTab, setActiveTab, variant }}>
      <div className={cn("w-full", className)}>{children}</div>
    </TabsContext.Provider>
  );
}

// Tabs List (Container for tab triggers)
interface TabsListProps {
  children: React.ReactNode;
  className?: string;
  scrollable?: boolean;
}

export function TabsList({
  children,
  className,
  scrollable = true,
}: TabsListProps) {
  const { variant } = useTabsContext();

  const variantStyles = {
    default: "bg-gray-100 dark:bg-gray-800 p-1 rounded-xl",
    fancy:
      "bg-gradient-to-r from-gray-100/80 to-gray-200/80 dark:from-gray-800/80 dark:to-gray-700/80 backdrop-blur-lg p-2 sm:p-3 rounded-xl sm:rounded-2xl border border-gray-200/50 dark:border-gray-700/50 shadow-lg",
  };

  const spacingStyles = {
    default: "flex items-center relative",
    fancy: "flex items-center relative",
  };

  const scrollableClass = scrollable
    ? "overflow-x-auto scrollbar-hide"
    : "flex-wrap";

  return (
    <div
      className={cn(
        spacingStyles[variant],
        variantStyles[variant],
        scrollableClass,
        // Mobile responsive padding and spacing
        "w-full",
        // Hide scrollbar on mobile
        "[&::-webkit-scrollbar]:hidden [-ms-overflow-style:none] [scrollbar-width:none]",
        className
      )}
    >
      <div
        className={cn(
          "flex items-center",
          scrollable ? "min-w-fit" : "flex-wrap w-full",
          // Gap responsive
          "gap-1 sm:gap-2"
        )}
      >
        {children}
      </div>
    </div>
  );
}

// Individual Tab Trigger
interface TabsTriggerProps {
  value: string;
  children: React.ReactNode;
  className?: string;
  disabled?: boolean;
  minWidth?: boolean;
}

export function TabsTrigger({
  value,
  children,
  className,
  disabled,
  minWidth = true,
}: TabsTriggerProps) {
  const { activeTab, setActiveTab, variant } = useTabsContext();
  const isActive = activeTab === value;

  const baseStyles = cn(
    "relative text-sm font-medium transition-all duration-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-primary-500 focus:ring-offset-2 disabled:opacity-50 disabled:cursor-not-allowed",
    // Responsive padding and sizing
    "px-3 py-2 sm:px-4 sm:py-2.5",
    // Responsive text
    "text-xs sm:text-sm",
    // Min width for better mobile UX
    minWidth ? "min-w-[4rem] sm:min-w-[5rem]" : "",
    // Flex properties
    "flex items-center justify-center whitespace-nowrap",
    // Touch target for mobile
    "min-h-[44px] sm:min-h-auto"
  );

  const variantStyles = {
    default: {
      active: "text-white shadow-sm z-10",
      inactive:
        "text-gray-600 dark:text-gray-400 hover:text-gray-900 dark:hover:text-gray-200 hover:bg-gray-50 dark:hover:bg-gray-700",
    },
    fancy: {
      active: "text-white shadow-xl z-10 transform scale-105",
      inactive:
        "text-gray-700 dark:text-gray-300 hover:text-gray-900 dark:hover:text-gray-100 hover:bg-white/50 dark:hover:bg-gray-600/50 hover:shadow-md hover:scale-102",
    },
  };

  const currentStyles = variantStyles[variant];

  return (
    <button
      onClick={() => !disabled && setActiveTab(value)}
      disabled={disabled}
      className={cn(
        baseStyles,
        isActive ? currentStyles.active : currentStyles.inactive,
        className
      )}
    >
      {/* Active background with layoutId for smooth animation */}
      {isActive && (
        <motion.div
          layoutId={`activeTab-${variant}`}
          className={cn(
            "absolute inset-0 rounded-lg",
            variant === "default"
              ? "bg-gradient-to-r from-primary-500 to-accent-500 shadow-lg"
              : "bg-gradient-to-r from-purple-600 via-pink-600 to-orange-600 shadow-2xl shadow-purple-500/25"
          )}
          transition={{
            type: "spring",
            duration: variant === "fancy" ? 0.6 : 0.5,
            bounce: variant === "fancy" ? 0.2 : 0.1,
          }}
        />
      )}

      {/* Content */}
      <span className="relative z-10 flex items-center justify-center space-x-1 sm:space-x-2">
        {children}
      </span>

      {/* Fancy variant: Glow effect on hover */}
      {variant === "fancy" && !isActive && (
        <motion.div className="absolute inset-0 bg-gradient-to-r from-primary-500/10 to-accent-500/10 rounded-lg opacity-0 hover:opacity-100 transition-opacity duration-300" />
      )}
    </button>
  );
}

// Tab Content Container
interface TabsContentProps {
  value: string;
  children: React.ReactNode;
  className?: string;
}

export function TabsContent({ value, children, className }: TabsContentProps) {
  const { activeTab, variant } = useTabsContext();
  const isActive = activeTab === value;

  if (!isActive) return null;

  const animationProps =
    variant === "fancy"
      ? {
          initial: { opacity: 0, y: 20, scale: 0.95 },
          animate: { opacity: 1, y: 0, scale: 1 },
          exit: { opacity: 0, y: -20, scale: 0.95 },
          transition: { duration: 0.4, ease: "easeOut" },
        }
      : {
          initial: { opacity: 0, y: 10 },
          animate: { opacity: 1, y: 0 },
          exit: { opacity: 0, y: -10 },
          transition: { duration: 0.2 },
        };

  const contentSpacing = variant === "fancy" ? "mt-4 sm:mt-8" : "mt-4 sm:mt-6";

  return (
    <AnimatePresence mode="wait">
      <motion.div
        key={value}
        className={cn(
          contentSpacing,
          // Mobile responsive padding
          "px-1 sm:px-0",
          className
        )}
        {...animationProps}
      >
        {children}
      </motion.div>
    </AnimatePresence>
  );
}

// Underline variant components (for backward compatibility)
interface TabsTriggerUnderlineProps extends TabsTriggerProps {
  icon?: React.ReactNode;
  badge?: string | number;
}

export function TabsTriggerUnderline({
  value,
  children,
  className,
  disabled,
  icon,
  badge,
}: TabsTriggerUnderlineProps) {
  const { activeTab, setActiveTab } = useTabsContext();
  const isActive = activeTab === value;

  return (
    <button
      onClick={() => !disabled && setActiveTab(value)}
      disabled={disabled}
      className={cn(
        "relative text-sm font-medium transition-all duration-200 border-b-2",
        "focus:outline-none focus:ring-2 focus:ring-primary-500 focus:ring-offset-2",
        "disabled:opacity-50 disabled:cursor-not-allowed",
        "flex items-center justify-center",
        // Responsive padding and sizing
        "px-3 py-2 sm:px-4 sm:py-3",
        // Responsive text
        "text-xs sm:text-sm",
        // Min width and touch target
        "min-w-[4rem] sm:min-w-[5rem] min-h-[44px] sm:min-h-auto",
        // Responsive spacing
        "space-x-1 sm:space-x-2",
        isActive
          ? "text-primary-600 dark:text-primary-400 border-primary-500"
          : "text-gray-500 dark:text-gray-400 border-transparent hover:text-gray-700 dark:hover:text-gray-300 hover:border-gray-300 dark:hover:border-gray-600",
        className
      )}
    >
      {icon && <span className="w-3 h-3 sm:w-4 sm:h-4">{icon}</span>}
      <span className="truncate">{children}</span>
      {badge && (
        <span
          className={cn(
            "ml-1 sm:ml-2 px-1.5 sm:px-2 py-0.5 text-xs rounded-full",
            "min-w-[1.25rem] sm:min-w-[1.5rem] flex items-center justify-center",
            isActive
              ? "bg-primary-100 dark:bg-primary-900 text-primary-700 dark:text-primary-300"
              : "bg-gray-100 dark:bg-gray-700 text-gray-600 dark:text-gray-400"
          )}
        >
          {badge}
        </span>
      )}
    </button>
  );
}

// Grid variant for equal width tabs
interface TabsListGridProps extends TabsListProps {
  columns: number;
  mobileColumns?: number;
}

export function TabsListGrid({
  children,
  className,
  columns,
  mobileColumns = 2,
}: TabsListGridProps) {
  const { variant } = useTabsContext();

  const variantStyles = {
    default: "bg-gray-100 dark:bg-gray-800 p-1 rounded-xl",
    fancy:
      "bg-gradient-to-r from-gray-100/80 to-gray-200/80 dark:from-gray-800/80 dark:to-gray-700/80 backdrop-blur-lg p-2 sm:p-3 rounded-xl sm:rounded-2xl border border-gray-200/50 dark:border-gray-700/50 shadow-lg",
  };

  const spacingStyles = {
    default: "gap-1",
    fancy: "gap-2 sm:gap-4",
  };

  return (
    <div
      className={cn(
        "grid relative w-full",
        // Responsive grid columns
        `grid-cols-${mobileColumns} sm:grid-cols-${columns}`,
        spacingStyles[variant],
        variantStyles[variant],
        className
      )}
    >
      {children}
    </div>
  );
}

// Mobile-specific dropdown variant
interface TabsDropdownProps {
  children: React.ReactNode;
  className?: string;
  placeholder?: string;
}

export function TabsDropdown({
  children,
  className,
  placeholder = "Select tab",
}: TabsDropdownProps) {
  const { activeTab, variant } = useTabsContext();
  const [isOpen, setIsOpen] = useState(false);

  // Extract tab options from children
  const tabOptions = React.Children.toArray(children).filter(
    (child): child is React.ReactElement =>
      React.isValidElement(child) &&
      (child.type === TabsTrigger || child.type === TabsTriggerUnderline)
  );

  const activeTabLabel =
    tabOptions.find((tab) => tab.props.value === activeTab)?.props.children ||
    placeholder;

  const variantStyles = {
    default:
      "bg-gray-100 dark:bg-gray-800 rounded-xl border border-gray-200 dark:border-gray-700",
    fancy:
      "bg-gradient-to-r from-gray-100/80 to-gray-200/80 dark:from-gray-800/80 dark:to-gray-700/80 backdrop-blur-lg rounded-xl border border-gray-200/50 dark:border-gray-700/50 shadow-lg",
  };

  return (
    <div className={cn("relative w-full sm:hidden", className)}>
      <button
        onClick={() => setIsOpen(!isOpen)}
        className={cn(
          "w-full px-4 py-3 text-left text-sm font-medium transition-all duration-200",
          "focus:outline-none focus:ring-2 focus:ring-primary-500 focus:ring-offset-2",
          "flex items-center justify-between",
          variantStyles[variant]
        )}
      >
        <span className="truncate">{activeTabLabel}</span>
        <motion.svg
          animate={{ rotate: isOpen ? 180 : 0 }}
          transition={{ duration: 0.2 }}
          className="w-4 h-4 text-gray-500"
          fill="none"
          stroke="currentColor"
          viewBox="0 0 24 24"
        >
          <path
            strokeLinecap="round"
            strokeLinejoin="round"
            strokeWidth={2}
            d="M19 9l-7 7-7-7"
          />
        </motion.svg>
      </button>

      <AnimatePresence>
        {isOpen && (
          <motion.div
            initial={{ opacity: 0, y: -10 }}
            animate={{ opacity: 1, y: 0 }}
            exit={{ opacity: 0, y: -10 }}
            transition={{ duration: 0.2 }}
            className={cn(
              "absolute top-full left-0 right-0 mt-2 z-50",
              "border border-gray-200 dark:border-gray-700 rounded-xl shadow-xl",
              "bg-white dark:bg-gray-800 overflow-hidden"
            )}
          >
            {tabOptions.map((tab) => (
              <button
                key={tab.props.value}
                onClick={() => {
                  tab.props.onClick?.();
                  setIsOpen(false);
                }}
                className={cn(
                  "w-full px-4 py-3 text-left text-sm transition-colors duration-200",
                  "hover:bg-gray-50 dark:hover:bg-gray-700",
                  "first:rounded-t-xl last:rounded-b-xl",
                  tab.props.value === activeTab
                    ? "bg-primary-50 dark:bg-primary-900/20 text-primary-600 dark:text-primary-400"
                    : "text-gray-700 dark:text-gray-300"
                )}
              >
                {tab.props.children}
              </button>
            ))}
          </motion.div>
        )}
      </AnimatePresence>

      {/* Backdrop */}
      {isOpen && (
        <div className="fixed inset-0 z-40" onClick={() => setIsOpen(false)} />
      )}
    </div>
  );
}
