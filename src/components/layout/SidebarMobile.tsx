import { motion, AnimatePresence } from "framer-motion";
import { Link, useLocation } from "react-router-dom";
import { navCategories, NavItem } from "./sidebar-data";

export function SidebarMobile() {
  const location = useLocation();

  // Get only mobile-enabled items
  const mobileItems = navCategories
    .reduce((acc: NavItem[], category) => acc.concat(category.items), [])
    .filter((item) => item.mobile);

  return (
    <motion.nav 
      className="md:hidden fixed bottom-0 left-0 right-0 z-50 bg-gradient-to-r from-indigo-900/98 via-purple-900/98 to-pink-900/98 backdrop-blur-xl border-t border-white/10 shadow-2xl"
      initial={{ y: 100 }}
      animate={{ y: 0 }}
      transition={{ duration: 0.6, type: "spring" }}
    >
      <div className="flex justify-around items-center py-2">
        {mobileItems.map((item, index) => {
          const isActive = location.pathname === item.path;

          return (
            <Link key={item.path} to={item.path} className="flex-1">
              <motion.div
                className="flex flex-col items-center justify-center py-3 px-2 relative"
                whileHover={{ scale: 1.05 }}
                whileTap={{ scale: 0.95 }}
                initial={{ opacity: 0, y: 20 }}
                animate={{ opacity: 1, y: 0 }}
                transition={{ delay: index * 0.1, duration: 0.3 }}
              >
                {/* Active background */}
                {isActive && (
                  <motion.div
                    className="absolute inset-0 bg-gradient-to-r from-blue-500/20 to-purple-500/20 rounded-2xl border border-blue-400/30"
                    layoutId="mobileActiveBackground"
                    initial={{ opacity: 0, scale: 0.8 }}
                    animate={{ opacity: 1, scale: 1 }}
                    transition={{ duration: 0.3, type: "spring" }}
                  />
                )}

                {/* Icon */}
                <motion.div
                  className={`relative z-10 p-2 rounded-xl transition-all duration-300 ${
                    isActive 
                      ? "text-blue-300 bg-white/10" 
                      : "text-blue-100/70 hover:text-blue-200"
                  }`}
                  animate={isActive ? { scale: [1, 1.1, 1] } : {}}
                  transition={{ duration: 0.5 }}
                >
                  {item.icon}
                </motion.div>

                {/* Label */}
                <AnimatePresence>
                  {isActive && (
                    <motion.span
                      className="text-xs mt-1 font-medium text-white relative z-10"
                      initial={{ opacity: 0, y: 5 }}
                      animate={{ opacity: 1, y: 0 }}
                      exit={{ opacity: 0, y: 5 }}
                      transition={{ duration: 0.2 }}
                    >
                      {item.name}
                    </motion.span>
                  )}
                </AnimatePresence>

                {/* Active indicator dot */}
                {isActive && (
                  <motion.div
                    className="absolute top-1 w-2 h-2 bg-gradient-to-r from-blue-400 to-purple-500 rounded-full shadow-lg shadow-blue-500/50"
                    layoutId="mobileActiveIndicator"
                    initial={{ opacity: 0, scale: 0 }}
                    animate={{ opacity: 1, scale: 1 }}
                    transition={{ duration: 0.3, type: "spring" }}
                  />
                )}

                {/* Notification badge for specific items */}
                {item.name === "Profile" && (
                  <motion.div
                    className="absolute -top-1 -right-1 w-3 h-3 bg-gradient-to-r from-red-400 to-pink-500 rounded-full border border-indigo-900"
                    animate={{ scale: [1, 1.2, 1] }}
                    transition={{ duration: 2, repeat: Infinity }}
                  />
                )}
              </motion.div>
            </Link>
          );
        })}
      </div>

      {/* Bottom safe area for devices with home indicator */}
      <div className="h-safe-area-inset-bottom bg-gradient-to-r from-indigo-900/50 to-purple-900/50" />
    </motion.nav>
  );
}