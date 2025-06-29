import { motion, AnimatePresence } from "framer-motion";
import { Link, useLocation } from "react-router-dom";
import { navCategories, NavItem } from "./sidebar-data";
import { useResponsive } from "@/hooks/use-responsive";

export function SidebarMobile() {
  const location = useLocation();
  const { isMobile } = useResponsive();

  // Only show on mobile
  if (!isMobile) return null;

  // Get mobile navigation items
  const mobileNavItems = navCategories
    .reduce((acc: NavItem[], category) => acc.concat(category.items), [])
    .filter((item) => item.mobile)
    .slice(0, 5); // Limit to 5 items for better mobile UX

  return (
    <motion.nav 
      className="fixed bottom-0 left-0 right-0 z-50 bg-white/95 dark:bg-gray-950/95 backdrop-blur-xl border-t-2 border-primary-100 dark:border-gray-800 shadow-2xl"
      initial={{ y: 100 }}
      animate={{ y: 0 }}
      transition={{ duration: 0.3 }}
    >
      <div className="flex justify-around items-center py-2">
        {mobileNavItems.map((item, index) => {
          const isActive = location.pathname === item.path;

          return (
            <Link key={item.path} to={item.path} className="flex-1">
              <motion.div
                className="flex flex-col items-center justify-center py-3 px-2 relative"
                whileHover={{ scale: 1.05 }}
                whileTap={{ scale: 0.95 }}
                initial={{ opacity: 0, y: 20 }}
                animate={{ opacity: 1, y: 0 }}
                transition={{ delay: index * 0.1 }}
              >
                {/* Active background */}
                {isActive && (
                  <motion.div
                    className="absolute inset-x-2 inset-y-1 bg-gradient-to-r from-primary-500 to-accent-500 rounded-2xl shadow-lg shadow-primary-500/25"
                    layoutId="mobileActiveNavIndicator"
                    initial={{ opacity: 0, scale: 0.8 }}
                    animate={{ opacity: 1, scale: 1 }}
                    transition={{ duration: 0.3 }}
                  />
                )}

                {/* Icon */}
                <motion.div
                  className={`relative z-10 p-2 rounded-xl transition-colors ${
                    isActive
                      ? "text-white"
                      : "text-gray-600 dark:text-gray-400"
                  }`}
                  animate={isActive ? { scale: [1, 1.2, 1] } : {}}
                  transition={{ duration: 0.3 }}
                >
                  {item.icon}
                </motion.div>

                {/* Label */}
                <motion.span
                  className={`relative z-10 text-xs font-medium mt-1 transition-colors ${
                    isActive
                      ? "text-white"
                      : "text-gray-600 dark:text-gray-400"
                  }`}
                  initial={{ opacity: 0 }}
                  animate={{ opacity: 1 }}
                  transition={{ delay: 0.1 }}
                >
                  {item.name}
                </motion.span>

                {/* Active indicator dot */}
                {isActive && (
                  <motion.div
                    className="absolute -top-1 left-1/2 transform -translate-x-1/2 w-2 h-2 bg-white rounded-full shadow-lg"
                    initial={{ scale: 0 }}
                    animate={{ scale: 1 }}
                    transition={{ delay: 0.2 }}
                  />
                )}

                {/* Notification badge for some items */}
                {item.name === "Profile" && (
                  <motion.div
                    className="absolute -top-1 -right-1 w-5 h-5 bg-red-500 rounded-full flex items-center justify-center border-2 border-white dark:border-gray-900"
                    initial={{ scale: 0 }}
                    animate={{ scale: 1 }}
                    transition={{ delay: 0.3 }}
                  >
                    <span className="text-xs font-bold text-white">2</span>
                  </motion.div>
                )}
              </motion.div>
            </Link>
          );
        })}
      </div>

      {/* Safe area for devices with home indicator */}
      <div className="h-safe-area-inset-bottom bg-white/95 dark:bg-gray-950/95" />
    </motion.nav>
  );
}