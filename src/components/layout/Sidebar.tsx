import { motion, AnimatePresence } from "framer-motion";
import { ChevronLeftIcon, ChevronRightIcon, RocketIcon } from "lucide-react";
import { Link, useLocation } from "react-router-dom";
import { memo, useMemo, useRef, useEffect } from "react";

import { useAuth } from "@/hooks/use-auth";
import { useSettingsStore } from "@/stores/settings-store";
import { navCategories, NavItem } from "./sidebar-data";
import Badge from "../ui/Badge";

// Memoized Navigation Item Component
const NavigationItem = memo(
  ({
    item,
    isActive,
    sidebarOpen,
  }: {
    item: NavItem;
    isActive: boolean;
    sidebarOpen: boolean;
  }) => {
    const { logout } = useAuth();
    const isLogout = item.name === "Logout";

    // Don't show logout when sidebar is collapsed
    if (isLogout && !sidebarOpen) {
      return null;
    }

    if (isLogout) {
      return (
        <motion.button
          onClick={() => logout()}
          className={`w-full flex items-center px-4 py-3 rounded-2xl text-sm font-medium transition-all duration-200 group ${
            sidebarOpen ? "" : "justify-center"
          } text-red-600 dark:text-red-400 hover:bg-red-50 dark:hover:bg-red-900/20 hover:text-red-700 dark:hover:text-red-300`}
          whileHover={{ scale: 1.02, x: 4 }}
          whileTap={{ scale: 0.98 }}
        >
          <span
            className={`${
              sidebarOpen ? "mr-3" : ""
            } transition-transform group-hover:scale-110`}
          >
            {item.icon}
          </span>
          <AnimatePresence mode="wait">
            {sidebarOpen && (
              <motion.span
                initial={{ opacity: 0, x: -10 }}
                animate={{ opacity: 1, x: 0 }}
                exit={{ opacity: 0, x: -10 }}
                transition={{ duration: 0.15 }}
              >
                {item.name}
              </motion.span>
            )}
          </AnimatePresence>
        </motion.button>
      );
    }

    return (
      <Link to={item.path}>
        <motion.div
          className={`flex items-center px-4 py-3 rounded-2xl text-sm font-medium transition-all duration-200 group relative overflow-hidden ${
            isActive
              ? "bg-gradient-to-r from-primary-500 to-accent-500 text-white shadow-lg shadow-primary-500/25"
              : "text-gray-700 dark:text-gray-300 hover:bg-primary-50 dark:hover:bg-gray-800 hover:text-primary-700 dark:hover:text-primary-400"
          } ${!sidebarOpen ? "justify-center" : ""}`}
          whileHover={{ scale: 1.02, x: isActive ? 0 : 4 }}
          whileTap={{ scale: 0.98 }}
        >
          {/* Active indicator - ✅ Use layoutId for smooth transitions */}
          {isActive && (
            <motion.div
              className="absolute inset-0 bg-gradient-to-r from-primary-600 to-accent-600 rounded-2xl"
              layoutId="activeNavIndicator"
              transition={{ duration: 0.3, ease: "easeInOut" }}
            />
          )}

          {/* Icon */}
          <span
            className={`relative z-10 ${
              sidebarOpen ? "mr-3" : ""
            } transition-transform group-hover:scale-110`}
          >
            {item.icon}
          </span>

          {/* Label */}
          <AnimatePresence mode="wait">
            {sidebarOpen && (
              <motion.span
                className="relative z-10"
                initial={{ opacity: 0, x: -10 }}
                animate={{ opacity: 1, x: 0 }}
                exit={{ opacity: 0, x: -10 }}
                transition={{ duration: 0.15 }}
              >
                {item.name}
              </motion.span>
            )}
          </AnimatePresence>

          {/* Badge for some items */}
          {item.name === "Explore" && sidebarOpen && (
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
  }
);

NavigationItem.displayName = "NavigationItem";

// Memoized Category Component
const NavigationCategory = memo(
  ({
    category,
    categoryIndex,
    sidebarOpen,
    currentPath,
  }: {
    category: any;
    categoryIndex: number;
    sidebarOpen: boolean;
    currentPath: string;
  }) => {
    // Memoize items to prevent unnecessary re-renders
    const categoryItems = useMemo(
      () =>
        category.items.map((item: NavItem) => ({
          ...item,
          isActive: currentPath === item.path,
        })),
      [category.items, currentPath]
    );

    return (
      <div className={categoryIndex !== 0 ? "mt-8" : ""}>
        {/* Category title */}
        <AnimatePresence mode="wait">
          {sidebarOpen && (
            <motion.h3
              className="px-6 mb-3 text-xs font-bold text-gray-500 dark:text-gray-400 uppercase tracking-wider"
              initial={{ opacity: 0, x: -20 }}
              animate={{ opacity: 1, x: 0 }}
              exit={{ opacity: 0, x: -20 }}
              transition={{ duration: 0.2 }}
            >
              {category.title}
            </motion.h3>
          )}
        </AnimatePresence>

        {/* Navigation items */}
        <ul className="space-y-2 px-3">
          {categoryItems.map((item) => (
            <li key={item.path}>
              <NavigationItem
                item={item}
                isActive={item.isActive}
                sidebarOpen={sidebarOpen}
              />
            </li>
          ))}
        </ul>
      </div>
    );
  }
);

NavigationCategory.displayName = "NavigationCategory";

export function Sidebar() {
  const { sidebarOpen, toggleSidebar } = useSettingsStore();
  const location = useLocation();

  // ✅ Ref to maintain scroll position
  const navRef = useRef<HTMLElement>(null);
  const scrollPositionRef = useRef<number>(0);

  // Memoize current path to prevent unnecessary re-renders
  const currentPath = useMemo(() => location.pathname, [location.pathname]);

  // ✅ Check feature flags
  const isSocialEnabled = import.meta.env.VITE_ENABLE_FEATURE_SOCIAL === "true";
  const isAchievementsEnabled =
    import.meta.env.VITE_ENABLE_FEATURE_ACHIEVEMENTS === "true";
  const isLeaderboardEnabled =
    import.meta.env.VITE_ENABLE_FEATURE_LEADERBOARD === "true";

  // ✅ Filter navigation categories based on feature flags
  const filteredNavCategories = useMemo(() => {
    return navCategories
      .map((category) => {
        // Filter items within categories based on feature flags
        const filteredItems = category.items.filter((item) => {
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
          items: filteredItems,
        };
      })
      .filter((category) => {
        // Remove categories that have no items left after filtering
        return category.items.length > 0;
      });
  }, [isSocialEnabled, isAchievementsEnabled, isLeaderboardEnabled]);

  // ✅ Save scroll position before route changes
  useEffect(() => {
    const nav = navRef.current;
    if (nav) {
      const handleScroll = () => {
        scrollPositionRef.current = nav.scrollTop;
      };
      nav.addEventListener("scroll", handleScroll, { passive: true });
      return () => nav.removeEventListener("scroll", handleScroll);
    }
  }, []);

  // ✅ Restore scroll position after route changes
  useEffect(() => {
    const nav = navRef.current;
    if (nav && scrollPositionRef.current > 0) {
      // Use requestAnimationFrame to ensure DOM is updated
      requestAnimationFrame(() => {
        nav.scrollTop = scrollPositionRef.current;
      });
    }
  }, [currentPath]);

  return (
    <>
      {/* ✅ STATIC SIDEBAR - No motion.aside, no initial animations */}
      <aside
        className={`fixed inset-y-0 z-40 flex flex-col bg-white dark:bg-gray-950 border-r-2 border-primary-100 dark:border-gray-800 shadow-xl transition-all duration-300 ${
          sidebarOpen ? "w-72" : "w-20"
        }`}
      >
        {/* Header */}
        <div
          className={`flex items-center px-6 py-6 border-b border-primary-100 dark:border-gray-800 ${
            sidebarOpen ? "" : "justify-center"
          }`}
        >
          {/* Logo */}
          <motion.div
            className="flex items-center space-x-3"
            whileHover={{ scale: 1.02 }}
          >
            <div className="w-10 h-10 bg-gradient-to-br from-primary-500 to-accent-500 rounded-2xl flex items-center justify-center shadow-lg">
              <RocketIcon className="w-6 h-6 text-white" />
            </div>
            <AnimatePresence mode="wait">
              {sidebarOpen && (
                <motion.span
                  className="text-2xl font-bold bg-gradient-to-r from-primary-600 to-accent-600 bg-clip-text text-transparent"
                  initial={{ opacity: 0, x: -20 }}
                  animate={{ opacity: 1, x: 0 }}
                  exit={{ opacity: 0, x: -20 }}
                  transition={{ duration: 0.2 }}
                >
                  Orbic
                </motion.span>
              )}
            </AnimatePresence>
          </motion.div>
        </div>

        {/* Navigation - ✅ Memoized categories with scroll preservation */}
        <nav
          ref={navRef}
          className="flex-1 py-6 overflow-y-auto"
          style={{ scrollBehavior: "auto" }} // ✅ Disable smooth scrolling for position restoration
        >
          {filteredNavCategories.map((category, categoryIndex) => (
            <NavigationCategory
              key={category.title}
              category={category}
              categoryIndex={categoryIndex}
              sidebarOpen={sidebarOpen}
              currentPath={currentPath}
            />
          ))}
        </nav>
      </aside>
    </>
  );
}
