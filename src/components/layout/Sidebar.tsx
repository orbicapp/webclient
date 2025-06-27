import { motion, AnimatePresence } from "framer-motion";
import { ChevronLeftIcon, ChevronRightIcon, RocketIcon, Sparkles, Zap, Crown } from "lucide-react";
import { Link, useLocation } from "react-router-dom";

import { useAuth } from "@/hooks/use-auth";
import { useSettingsStore } from "@/stores/settings-store";
import { useResponsive } from "@/hooks/use-responsive";
import { navCategories } from "./sidebar-data";
import Badge from "../ui/Badge";
import ProgressRing from "../ui/ProgressRing";

export function Sidebar() {
  const { sidebarOpen, toggleSidebar } = useSettingsStore();
  const { logout } = useAuth();
  const { isMobile } = useResponsive();
  const location = useLocation();

  // Don't render sidebar on mobile (handled by mobile menu)
  if (isMobile) return null;

  return (
    <motion.aside
      className={`fixed inset-y-0 z-40 flex flex-col bg-gradient-to-b from-indigo-900/95 via-purple-900/95 to-pink-900/95 backdrop-blur-xl border-r border-white/10 shadow-2xl transition-all duration-300 ${
        sidebarOpen ? "w-72" : "w-20"
      }`}
      initial={{ x: -80, opacity: 0 }}
      animate={{ x: 0, opacity: 1 }}
      transition={{ duration: 0.6, type: "spring" }}
    >
      {/* Collapse button */}
      <motion.button
        onClick={toggleSidebar}
        className="absolute -right-4 top-6 bg-gradient-to-r from-blue-500 to-purple-600 rounded-full p-2 shadow-lg border-2 border-white/20 hover:border-white/40 transition-all duration-300"
        whileHover={{ scale: 1.05 }}
        whileTap={{ scale: 0.95 }}
      >
        <motion.div
          animate={{ rotate: sidebarOpen ? 0 : 180 }}
          transition={{ duration: 0.3 }}
        >
          <ChevronLeftIcon className="w-4 h-4 text-white" />
        </motion.div>
      </motion.button>

      {/* Logo Section */}
      <div className={`flex items-center px-6 py-6 border-b border-white/10 ${sidebarOpen ? "" : "justify-center"}`}>
        <div className="relative">
          <motion.div
            className="w-12 h-12 bg-gradient-to-br from-blue-400 to-purple-600 rounded-full flex items-center justify-center shadow-lg shadow-blue-500/30"
            animate={{ rotate: [0, 360] }}
            transition={{ duration: 20, repeat: Infinity, ease: "linear" }}
          >
            <RocketIcon className="w-7 h-7 text-white" />
          </motion.div>
          {/* Orbital rings */}
          <motion.div
            className="absolute inset-0 border-2 border-blue-400/20 rounded-full"
            animate={{ rotate: [0, -360] }}
            transition={{ duration: 15, repeat: Infinity, ease: "linear" }}
            style={{ width: '140%', height: '140%', left: '-20%', top: '-20%' }}
          />
          <motion.div
            className="absolute inset-0 border border-purple-400/20 rounded-full"
            animate={{ rotate: [0, 360] }}
            transition={{ duration: 25, repeat: Infinity, ease: "linear" }}
            style={{ width: '160%', height: '160%', left: '-30%', top: '-30%' }}
          />
        </div>
        
        <AnimatePresence>
          {sidebarOpen && (
            <motion.div
              className="ml-4"
              initial={{ opacity: 0, x: -20 }}
              animate={{ opacity: 1, x: 0 }}
              exit={{ opacity: 0, x: -20 }}
              transition={{ duration: 0.3 }}
            >
              <h1 className="text-2xl font-bold bg-gradient-to-r from-white via-blue-200 to-purple-200 bg-clip-text text-transparent">
                Orbic
              </h1>
              <p className="text-xs text-blue-200/80 -mt-1">Learning Galaxy</p>
            </motion.div>
          )}
        </AnimatePresence>
      </div>

      {/* XP Progress Section */}
      <AnimatePresence>
        {sidebarOpen && (
          <motion.div
            className="px-6 py-4 border-b border-white/10"
            initial={{ opacity: 0, y: -20 }}
            animate={{ opacity: 1, y: 0 }}
            exit={{ opacity: 0, y: -20 }}
            transition={{ duration: 0.3, delay: 0.1 }}
          >
            <div className="flex items-center space-x-4 p-4 bg-white/5 rounded-2xl border border-white/10">
              <ProgressRing progress={65} size={50} strokeWidth={4} variant="rainbow">
                <span className="text-sm font-bold text-white">12</span>
              </ProgressRing>
              <div className="flex-1">
                <div className="flex items-center space-x-2 mb-1">
                  <span className="text-sm font-semibold text-white">Level 12</span>
                  <Badge variant="gradient" size="sm">
                    <Crown className="w-3 h-3 mr-1" />
                    Pro
                  </Badge>
                </div>
                <div className="text-xs text-blue-200/80 mb-2">2,340 / 3,000 XP</div>
                <div className="w-full bg-white/10 rounded-full h-2">
                  <motion.div
                    className="h-2 bg-gradient-to-r from-blue-400 to-purple-500 rounded-full"
                    initial={{ width: 0 }}
                    animate={{ width: "78%" }}
                    transition={{ duration: 1.5, delay: 0.5 }}
                  />
                </div>
              </div>
            </div>
          </motion.div>
        )}
      </AnimatePresence>

      {/* Navigation */}
      <nav className="flex-1 py-6 overflow-y-auto">
        {navCategories.map((category, categoryIndex) => (
          <div key={category.title} className={categoryIndex !== 0 ? "mt-8" : ""}>
            <AnimatePresence>
              {sidebarOpen && (
                <motion.h3
                  className="px-6 mb-3 text-xs font-semibold text-blue-200/60 uppercase tracking-wider flex items-center"
                  initial={{ opacity: 0, x: -20 }}
                  animate={{ opacity: 1, x: 0 }}
                  exit={{ opacity: 0, x: -20 }}
                  transition={{ duration: 0.3, delay: categoryIndex * 0.1 }}
                >
                  <Sparkles className="w-3 h-3 mr-2" />
                  {category.title}
                </motion.h3>
              )}
            </AnimatePresence>

            <ul className="space-y-2 px-4">
              {category.items.map((item, itemIndex) => {
                const isActive = location.pathname === item.path;
                const isLogout = item.name === "Logout";

                return (
                  <motion.li
                    key={item.path}
                    initial={{ opacity: 0, x: -20 }}
                    animate={{ opacity: 1, x: 0 }}
                    transition={{ 
                      duration: 0.3, 
                      delay: (categoryIndex * 0.1) + (itemIndex * 0.05) 
                    }}
                  >
                    {isLogout ? (
                      <motion.button
                        onClick={() => logout()}
                        className={`w-full flex items-center px-4 py-3 rounded-2xl text-sm font-medium transition-all duration-300 group ${
                          sidebarOpen ? "" : "justify-center"
                        } text-red-300 hover:bg-red-500/20 hover:text-red-200 border border-transparent hover:border-red-500/30`}
                        whileHover={{ scale: 1.02, x: 4 }}
                        whileTap={{ scale: 0.98 }}
                      >
                        <span className={`${sidebarOpen ? "mr-3" : ""} text-red-400 group-hover:text-red-300 transition-colors`}>
                          {item.icon}
                        </span>
                        <AnimatePresence>
                          {sidebarOpen && (
                            <motion.span
                              initial={{ opacity: 0, x: -10 }}
                              animate={{ opacity: 1, x: 0 }}
                              exit={{ opacity: 0, x: -10 }}
                              transition={{ duration: 0.2 }}
                            >
                              {item.name}
                            </motion.span>
                          )}
                        </AnimatePresence>
                      </motion.button>
                    ) : (
                      <Link to={item.path}>
                        <motion.div
                          className={`flex items-center px-4 py-3 rounded-2xl text-sm font-medium transition-all duration-300 group relative overflow-hidden ${
                            isActive
                              ? "bg-gradient-to-r from-blue-500/30 to-purple-500/30 text-white border border-blue-400/50 shadow-lg shadow-blue-500/20"
                              : "text-blue-100/80 hover:bg-white/10 hover:text-white border border-transparent hover:border-white/20"
                          } ${!sidebarOpen ? "justify-center" : ""}`}
                          whileHover={{ scale: 1.02, x: isActive ? 0 : 4 }}
                          whileTap={{ scale: 0.98 }}
                        >
                          {/* Active indicator glow */}
                          {isActive && (
                            <motion.div
                              className="absolute inset-0 bg-gradient-to-r from-blue-400/20 to-purple-400/20 rounded-2xl"
                              initial={{ opacity: 0 }}
                              animate={{ opacity: [0.5, 1, 0.5] }}
                              transition={{ duration: 2, repeat: Infinity }}
                            />
                          )}
                          
                          <span className={`relative z-10 ${!sidebarOpen ? "" : "mr-3"} ${
                            isActive ? "text-blue-300" : "text-blue-200/70 group-hover:text-blue-200"
                          } transition-colors`}>
                            {item.icon}
                          </span>
                          
                          <AnimatePresence>
                            {sidebarOpen && (
                              <motion.span
                                className="relative z-10"
                                initial={{ opacity: 0, x: -10 }}
                                animate={{ opacity: 1, x: 0 }}
                                exit={{ opacity: 0, x: -10 }}
                                transition={{ duration: 0.2 }}
                              >
                                {item.name}
                              </motion.span>
                            )}
                          </AnimatePresence>
                          
                          {/* Active indicator */}
                          {isActive && sidebarOpen && (
                            <motion.div
                              layoutId="activeNavIndicator"
                              className="ml-auto w-2 h-8 rounded-full bg-gradient-to-b from-blue-400 to-purple-500 shadow-lg shadow-blue-500/50"
                              initial={{ opacity: 0, scale: 0 }}
                              animate={{ opacity: 1, scale: 1 }}
                              transition={{ duration: 0.3, type: "spring" }}
                            />
                          )}
                          
                          {/* Compact active indicator */}
                          {isActive && !sidebarOpen && (
                            <motion.div
                              className="absolute right-1 top-1/2 transform -translate-y-1/2 w-1 h-6 rounded-full bg-gradient-to-b from-blue-400 to-purple-500"
                              layoutId="compactActiveIndicator"
                              initial={{ opacity: 0 }}
                              animate={{ opacity: 1 }}
                              transition={{ duration: 0.2 }}
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

      {/* Bottom Section - Quick Stats */}
      <AnimatePresence>
        {sidebarOpen && (
          <motion.div
            className="px-6 py-4 border-t border-white/10"
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            exit={{ opacity: 0, y: 20 }}
            transition={{ duration: 0.3 }}
          >
            <div className="grid grid-cols-2 gap-3">
              <div className="p-3 bg-white/5 rounded-xl border border-white/10 text-center">
                <div className="flex items-center justify-center mb-1">
                  <Zap className="w-4 h-4 text-yellow-400 mr-1" />
                  <span className="text-sm font-bold text-white">7</span>
                </div>
                <div className="text-xs text-blue-200/60">Day Streak</div>
              </div>
              <div className="p-3 bg-white/5 rounded-xl border border-white/10 text-center">
                <div className="flex items-center justify-center mb-1">
                  <Crown className="w-4 h-4 text-purple-400 mr-1" />
                  <span className="text-sm font-bold text-white">23</span>
                </div>
                <div className="text-xs text-blue-200/60">Completed</div>
              </div>
            </div>
          </motion.div>
        )}
      </AnimatePresence>
    </motion.aside>
  );
}