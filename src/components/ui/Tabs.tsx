import React, { useState, createContext, useContext } from "react";
import { motion } from "framer-motion";
import { cn } from "@/lib/utils/class.utils";

// Context for tabs
interface TabsContextType {
  activeTab: string;
  setActiveTab: (tab: string) => void;
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
}

export function Tabs({ 
  defaultValue, 
  value, 
  onValueChange, 
  children, 
  className 
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
    <TabsContext.Provider value={{ activeTab, setActiveTab }}>
      <div className={cn("w-full", className)}>
        {children}
      </div>
    </TabsContext.Provider>
  );
}

// Tabs List (Container for tab triggers)
interface TabsListProps {
  children: React.ReactNode;
  className?: string;
  variant?: "default" | "pills" | "underline";
}

export function TabsList({ children, className, variant = "default" }: TabsListProps) {
  const variantStyles = {
    default: "bg-gray-100 dark:bg-gray-800 p-1 rounded-xl",
    pills: "space-x-2",
    underline: "border-b border-gray-200 dark:border-gray-700"
  };

  return (
    <div className={cn(
      "flex items-center",
      variantStyles[variant],
      className
    )}>
      {children}
    </div>
  );
}

// Individual Tab Trigger
interface TabsTriggerProps {
  value: string;
  children: React.ReactNode;
  className?: string;
  disabled?: boolean;
}

export function TabsTrigger({ value, children, className, disabled }: TabsTriggerProps) {
  const { activeTab, setActiveTab } = useTabsContext();
  const isActive = activeTab === value;

  return (
    <button
      onClick={() => !disabled && setActiveTab(value)}
      disabled={disabled}
      className={cn(
        "relative px-4 py-2.5 text-sm font-medium transition-all duration-200 rounded-lg",
        "focus:outline-none focus:ring-2 focus:ring-primary-500 focus:ring-offset-2",
        "disabled:opacity-50 disabled:cursor-not-allowed",
        isActive
          ? "text-white shadow-sm"
          : "text-gray-600 dark:text-gray-400 hover:text-gray-900 dark:hover:text-gray-200 hover:bg-gray-50 dark:hover:bg-gray-700",
        className
      )}
    >
      {/* Active background with layoutId for smooth animation */}
      {isActive && (
        <motion.div
          layoutId="activeTab"
          className="absolute inset-0 bg-gradient-to-r from-primary-500 to-accent-500 rounded-lg shadow-lg"
          transition={{ type: "spring", duration: 0.5 }}
        />
      )}
      
      {/* Content */}
      <span className="relative z-10 flex items-center space-x-2">
        {children}
      </span>
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
  const { activeTab } = useTabsContext();
  const isActive = activeTab === value;

  if (!isActive) return null;

  return (
    <motion.div
      initial={{ opacity: 0, y: 10 }}
      animate={{ opacity: 1, y: 0 }}
      exit={{ opacity: 0, y: -10 }}
      transition={{ duration: 0.2 }}
      className={cn("mt-6", className)}
    >
      {children}
    </motion.div>
  );
}

// Underline variant components
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
  badge 
}: TabsTriggerUnderlineProps) {
  const { activeTab, setActiveTab } = useTabsContext();
  const isActive = activeTab === value;

  return (
    <button
      onClick={() => !disabled && setActiveTab(value)}
      disabled={disabled}
      className={cn(
        "relative px-4 py-3 text-sm font-medium transition-all duration-200 border-b-2",
        "focus:outline-none focus:ring-2 focus:ring-primary-500 focus:ring-offset-2",
        "disabled:opacity-50 disabled:cursor-not-allowed",
        "flex items-center space-x-2",
        isActive
          ? "text-primary-600 dark:text-primary-400 border-primary-500"
          : "text-gray-500 dark:text-gray-400 border-transparent hover:text-gray-700 dark:hover:text-gray-300 hover:border-gray-300 dark:hover:border-gray-600",
        className
      )}
    >
      {icon && <span className="w-4 h-4">{icon}</span>}
      <span>{children}</span>
      {badge && (
        <span className={cn(
          "ml-2 px-2 py-0.5 text-xs rounded-full",
          isActive
            ? "bg-primary-100 dark:bg-primary-900 text-primary-700 dark:text-primary-300"
            : "bg-gray-100 dark:bg-gray-700 text-gray-600 dark:text-gray-400"
        )}>
          {badge}
        </span>
      )}
    </button>
  );
}