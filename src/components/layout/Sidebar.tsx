import { motion, AnimatePresence } from "framer-motion";
import { ChevronLeftIcon, ChevronRightIcon, RocketIcon, LogOutIcon } from "lucide-react";
import { Link, useLocation } from "react-router-dom";

import { useAuth } from "@/hooks/use-auth";
import { useSettingsStore } from "@/stores/settings-store";
import { useResponsive } from "@/hooks/use-responsive";
import { navCategories } from "./sidebar-data";
import Badge from "../ui/Badge";

export function Sidebar() {
  const { sidebarOpen, toggleSidebar } = useSettingsStore();
  const { logout } = useAuth();
  const { isMobile } = useResponsive();
  const location = useLocation();

  // Don't render sidebar on mobile (handled by header)
  if (isMobile) return null;

  return (
    <>
      <motion.aside
        className={`fixed inset-y-0 z-40 flex flex-col bg-white dark:bg-gray-950 border-r-2 border-primary-100 dark:border-gray-800 shadow-xl transition-all duration-300 ${
          sidebarOpen ? "w-72" : "w-20"
        }`}
        initial={{ x: -80, opacity: 0 }}
        animate={{ x: 0, opacity: 1 }}
        transition={{ duration: 0.3 }}
      >
        {/* Header */}
        <div className={`flex items-center px-6 py-6 border-b border-primary-100 dark:border-gray-800 ${
          sidebarOpen ? "" : "justify-center"
        }`}>
          {/* Logo */}
          <motion.div 
            className="flex items-center space-x-3"
            whileHover={{ scale: 1.02 }}
          >
            <div className="w-10 h-10 bg-gradient-to-br from-primary-500 to-accent-500 rounded-2xl flex items-center justify-center shadow-lg">
              <RocketIcon className="w-6 h-6 text-white" />
            </div>
            <AnimatePresence>
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

          {/* Collapse button */}
          <AnimatePresence>
            {sidebarOpen && (
              <motion.button
                onClick={toggleSidebar}
                className="ml-auto p-2 rounded-xl bg-primary-100 dark:bg-gray-800 text-primary-600 dark:text-primary-400 hover:bg-primary-200 dark:hover:bg-gray-700 transition-colors"
                whileHover={{ scale: 1.05 }}
                whileTap={{ scale: 0.95 }}
                initial={{ opacity: 0, scale: 0 }}
                animate={{ opacity: 1, scale: 1 }}
                exit={{ opacity: 0, scale: 0 }}
              >
                <ChevronLeftIcon className="w-5 h-5" />
              </motion.button>
            )}
          </AnimatePresence>
        </div>

        {/* Navigation */}
        <nav className="flex-1 py-6 overflow-y-auto">
          {navCategories.map((category, categoryIndex) => (
            <div key={category.title} className={categoryIndex !== 0 ? "mt-8" : ""}>
              {/* Category title */}
              <AnimatePresence>
                {sidebarOpen && (
                  <motion.h3
                    className="px-6 mb-3 text-xs font-bold text-gray-500 dark:text-gray-400 uppercase tracking-wider"
                    initial={{ opacity: 0, x: -20 }}
                    animate={{ opacity: 1, x: 0 }}
                    exit={{ opacity: 0, x: -20 }}
                    transition={{ duration: 0.2, delay: categoryIndex * 0.05 }}
                  >
                    {category.title}
                  </motion.h3>
                )}
              </AnimatePresence>

              {/* Navigation items */}
              <ul className="space-y-2 px-3">
                {category.items.map((item, itemIndex) => {
                  const isActive = location.pathname === item.path;
                  const isLogout = item.name === "Logout";

                  // Don't show logout when sidebar is collapsed
                  if (isLogout && !sidebarOpen) {
                    return null;
                  }

                  return (
                    <motion.li
                      key={item.path}
                      initial={{ opacity: 0, x: -20 }}
                      animate={{ opacity: 1, x: 0 }}
                      transition={{ 
                        duration: 0.2, 
                        delay: (categoryIndex * 0.1) + (itemIndex * 0.05) 
                      }}
                    >
                      {isLogout ? (
                        <motion.button
                          onClick={() => logout()}
                          className={`w-full flex items-center px-4 py-3 rounded-2xl text-sm font-medium transition-all duration-200 group ${
                            sidebarOpen ? "" : "justify-center"
                          } text-red-600 dark:text-red-400 hover:bg-red-50 dark:hover:bg-red-900/20 hover:text-red-700 dark:hover:text-red-300`}
                          whileHover={{ scale: 1.02, x: 4 }}
                          whileTap={{ scale: 0.98 }}
                        >
                          <span className={`${sidebarOpen ? "mr-3" : ""} transition-transform group-hover:scale-110`}>
                            {item.icon}
                          </span>
                          <AnimatePresence>
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
                      ) : (
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
                            {/* Active indicator */}
                            {isActive && (
                              <motion.div
                                className="absolute inset-0 bg-gradient-to-r from-primary-600 to-accent-600 rounded-2xl"
                                layoutId="activeNavIndicator"
                                initial={{ opacity: 0 }}
                                animate={{ opacity: 1 }}
                                transition={{ duration: 0.3 }}
                              />
                            )}

                            {/* Icon */}
                            <span className={`relative z-10 ${sidebarOpen ? "mr-3" : ""} transition-transform group-hover:scale-110`}>
                              {item.icon}
                            </span>

                            {/* Label */}
                            <AnimatePresence>
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
                                className="ml-auto"
                                initial={{ opacity: 0, scale: 0 }}
                                animate={{ opacity: 1, scale: 1 }}
                                transition={{ delay: 0.2 }}
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
                      )}
                    </motion.li>
                  );
                })}
              </ul>
            </div>
          ))}
        </nav>
      </motion.aside>

      {/* Floating Expand Button - Only when collapsed */}
      <AnimatePresence>
        {!sidebarOpen && (
          <motion.button
            onClick={toggleSidebar}
            className="fixed top-6 left-6 z-50 p-3 rounded-xl bg-white dark:bg-gray-800 shadow-lg border border-primary-200 dark:border-gray-700 text-primary-600 dark:text-primary-400 hover:bg-primary-50 dark:hover:bg-gray-700 transition-colors"
            whileHover={{ scale: 1.05 }}
            whileTap={{ scale: 0.95 }}
            initial={{ opacity: 0, scale: 0, x: -20 }}
            animate={{ opacity: 1, scale: 1, x: 0 }}
            exit={{ opacity: 0, scale: 0, x: -20 }}
            transition={{ duration: 0.2 }}
          >
            <ChevronRightIcon className="w-5 h-5" />
          </motion.button>
        )}
      </AnimatePresence>
    </>
  );
}