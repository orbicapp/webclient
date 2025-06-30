import { motion, AnimatePresence } from "framer-motion";
import { Link, useLocation } from "react-router-dom";
import { RocketIcon, LogOutIcon } from "lucide-react";
import { useMemo } from "react";

import { navCategories, NavItem } from "./sidebar-data";
import { useResponsive } from "@/hooks/use-responsive";
import { useAuth } from "@/hooks/use-auth";
import Badge from "../ui/Badge";

// Memoized Navigation Item Component for Mobile
const MobileNavigationItem = ({ 
  item, 
  isActive, 
  onItemClick 
}: { 
  item: NavItem; 
  isActive: boolean; 
  onItemClick: () => void;
}) => {
  const { logout } = useAuth();
  const isLogout = item.name === "Logout";

  if (isLogout) {
    return (
      <motion.button
        onClick={() => {
          logout();
          onItemClick();
        }}
        className="w-full flex items-center px-4 py-3 rounded-2xl text-sm font-medium transition-all duration-200 group text-red-600 dark:text-red-400 hover:bg-red-50 dark:hover:bg-red-900/20 hover:text-red-700 dark:hover:text-red-300"
        whileHover={{ scale: 1.02, x: 4 }}
        whileTap={{ scale: 0.98 }}
      >
        <span className="mr-3 transition-transform group-hover:scale-110">
          {item.icon}
        </span>
        <span>{item.name}</span>
      </motion.button>
    );
  }

  return (
    <Link to={item.path} onClick={onItemClick}>
      <motion.div
        className={`flex items-center px-4 py-3 rounded-2xl text-sm font-medium transition-all duration-200 group relative overflow-hidden ${
          isActive
            ? "bg-gradient-to-r from-primary-500 to-accent-500 text-white shadow-lg shadow-primary-500/25"
            : "text-gray-700 dark:text-gray-300 hover:bg-primary-50 dark:hover:bg-gray-800 hover:text-primary-700 dark:hover:text-primary-400"
        }`}
        whileHover={{ scale: 1.02, x: isActive ? 0 : 4 }}
        whileTap={{ scale: 0.98 }}
      >
        {/* Active indicator */}
        {isActive && (
          <motion.div
            className="absolute inset-0 bg-gradient-to-r from-primary-600 to-accent-600 rounded-2xl"
            layoutId="mobileActiveNavIndicator"
            transition={{ duration: 0.3, ease: "easeInOut" }}
          />
        )}

        {/* Icon */}
        <span className={`relative z-10 mr-3 transition-transform group-hover:scale-110`}>
          {item.icon}
        </span>

        {/* Label */}
        <span className="relative z-10 flex-1">{item.name}</span>

        {/* Badge for some items */}
        {item.name === "Explore" && (
          <motion.div
            className="ml-auto relative z-10"
            animate={{ opacity: 1, scale: 1 }}
          >
            <Badge variant="gradient" size="sm">
              New
            </Badge>
          </motion.div>
        )}

        {/* Shine effect for active item */}
        {isActive && (
          <motion.div
            className="absolute inset-0 bg-gradient-to-r from-transparent via-white/20 to-transparent -translate-x-full"
            animate={{ x: ["0%", "200%"] }}
            transition={{ duration: 2, repeat: Infinity, repeatDelay: 3 }}
          />
        )}
      </motion.div>
    </Link>
  );
};

// Memoized Category Component for Mobile
const MobileNavigationCategory = ({ 
  category, 
  categoryIndex, 
  currentPath,
  onItemClick 
}: { 
  category: any; 
  categoryIndex: number; 
  currentPath: string;
  onItemClick: () => void;
}) => {
  // Memoize items to prevent unnecessary re-renders
  const categoryItems = useMemo(() => 
    category.items.map((item: NavItem) => ({
      ...item,
      isActive: currentPath === item.path
    })), 
    [category.items, currentPath]
  );

  return (
    <div className={categoryIndex !== 0 ? "mt-8" : ""}>
      {/* Category title */}
      <motion.h3
        className="px-6 mb-3 text-xs font-bold text-gray-500 dark:text-gray-400 uppercase tracking-wider"
        initial={{ opacity: 0, x: -20 }}
        animate={{ opacity: 1, x: 0 }}
        transition={{ duration: 0.2, delay: categoryIndex * 0.1 }}
      >
        {category.title}
      </motion.h3>

      {/* Navigation items */}
      <ul className="space-y-2 px-3">
        {categoryItems.map((item, itemIndex) => (
          <motion.li 
            key={item.path}
            initial={{ opacity: 0, x: -20 }}
            animate={{ opacity: 1, x: 0 }}
            transition={{ duration: 0.2, delay: (categoryIndex * 0.1) + (itemIndex * 0.05) }}
          >
            <MobileNavigationItem
              item={item}
              isActive={item.isActive}
              onItemClick={onItemClick}
            />
          </motion.li>
        ))}
      </ul>
    </div>
  );
};

interface SidebarMobileProps {
  isOpen: boolean;
  onClose: () => void;
}

export function SidebarMobile({ isOpen, onClose }: SidebarMobileProps) {
  const location = useLocation();
  const { isMobile } = useResponsive();

  // Only show on mobile
  if (!isMobile) return null;

  // ✅ Check feature flags (same as desktop sidebar)
  const isSocialEnabled = import.meta.env.VITE_ENABLE_FEATURE_SOCIAL === 'true';
  const isAchievementsEnabled = import.meta.env.VITE_ENABLE_FEATURE_ACHIEVEMENTS === 'true';
  const isLeaderboardEnabled = import.meta.env.VITE_ENABLE_FEATURE_LEADERBOARD === 'true';

  // ✅ Filter navigation categories based on feature flags
  const filteredNavCategories = useMemo(() => {
    return navCategories.map(category => {
      // Filter items within categories based on feature flags
      const filteredItems = category.items.filter(item => {
        // Hide social category if feature is disabled
        if (category.title === "Social" && !isSocialEnabled) {
          return false;
        }
        
        // Hide achievements if feature is disabled
        if (item.name === "Achievements" && !isAchievementsEnabled) {
          return false;
        }
        
        // Hide leaderboard if feature is disabled
        if (item.name === "Leaderboard" && !isLeaderboardEnabled) {
          return false;
        }
        
        return true;
      });

      return {
        ...category,
        items: filteredItems
      };
    }).filter(category => {
      // Remove categories that have no items left after filtering
      return category.items.length > 0;
    });
  }, [isSocialEnabled, isAchievementsEnabled, isLeaderboardEnabled]);

  const currentPath = useMemo(() => location.pathname, [location.pathname]);

  return (
    <AnimatePresence>
      {isOpen && (
        <>
          {/* Backdrop */}
          <motion.div
            className="fixed inset-0 z-40 bg-black/50 backdrop-blur-sm"
            initial={{ opacity: 0 }}
            animate={{ opacity: 1 }}
            exit={{ opacity: 0 }}
            onClick={onClose}
          />

          {/* Mobile Sidebar */}
          <motion.div
            className="fixed top-0 left-0 z-50 h-full w-80 bg-white dark:bg-gray-950 border-r-2 border-primary-100 dark:border-gray-800 shadow-2xl flex flex-col"
            initial={{ x: -320 }}
            animate={{ x: 0 }}
            exit={{ x: -320 }}
            transition={{ type: "spring", damping: 25, stiffness: 200 }}
            onClick={(e) => e.stopPropagation()}
          >
            {/* Header */}
            <div className="flex items-center px-6 py-6 border-b border-primary-100 dark:border-gray-800">
              <motion.div 
                className="flex items-center space-x-3"
                whileHover={{ scale: 1.02 }}
              >
                <div className="w-10 h-10 bg-gradient-to-br from-primary-500 to-accent-500 rounded-2xl flex items-center justify-center shadow-lg">
                  <RocketIcon className="w-6 h-6 text-white" />
                </div>
                <span className="text-2xl font-bold bg-gradient-to-r from-primary-600 to-accent-600 bg-clip-text text-transparent">
                  Orbic
                </span>
              </motion.div>
            </div>

            {/* Navigation */}
            <nav className="flex-1 py-6 overflow-y-auto">
              {filteredNavCategories.map((category, categoryIndex) => (
                <MobileNavigationCategory
                  key={category.title}
                  category={category}
                  categoryIndex={categoryIndex}
                  currentPath={currentPath}
                  onItemClick={onClose}
                />
              ))}
            </nav>

            {/* Footer */}
            <div className="p-6 border-t border-primary-100 dark:border-gray-800">
              <motion.div
                className="p-4 bg-gradient-to-r from-primary-50 to-accent-50 dark:from-gray-800 dark:to-gray-700 rounded-2xl border border-primary-200 dark:border-gray-700"
                initial={{ opacity: 0, y: 20 }}
                animate={{ opacity: 1, y: 0 }}
                transition={{ delay: 0.5 }}
              >
                <div className="text-center">
                  <div className="text-sm font-bold text-gray-900 dark:text-white mb-1">
                    🚀 Keep Learning!
                  </div>
                  <div className="text-xs text-gray-500 dark:text-gray-400">
                    You're doing great
                  </div>
                </div>
              </motion.div>
            </div>
          </motion.div>
        </>
      )}
    </AnimatePresence>
  );
}