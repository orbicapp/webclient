import { useAuth } from "@/hooks/use-auth";
import { useSettingsStore } from "@/stores/settings-store";
import { useResponsive } from "@/hooks/use-responsive";
import {
  Search,
  Bell,
  Settings,
  Moon,
  Sun,
  Rocket,
  Zap,
  Crown,
  Star,
  Menu,
  X
} from "lucide-react";
import { motion, AnimatePresence } from "framer-motion";
import { useState } from "react";
import Avatar from "../ui/Avatar";
import ProgressRing from "../ui/ProgressRing";
import Badge from "../ui/Badge";

export function Header() {
  const { theme, toggleTheme, sidebarOpen, toggleSidebar } = useSettingsStore();
  const { user } = useAuth();
  const { isMobile } = useResponsive();
  const [searchFocused, setSearchFocused] = useState(false);
  const [mobileMenuOpen, setMobileMenuOpen] = useState(false);

  // Mock user stats for gamification
  const userLevel = 12;
  const userXP = 2450;
  const userStreak = 7;

  return (
    <>
      {/* Main Header */}
      <motion.header 
        className="sticky top-0 z-50 bg-gradient-to-r from-indigo-900/95 via-purple-900/95 to-pink-900/95 backdrop-blur-xl border-b border-white/10 shadow-2xl"
        initial={{ y: -100 }}
        animate={{ y: 0 }}
        transition={{ duration: 0.6, type: "spring" }}
      >
        <div className="px-4 sm:px-6 lg:px-8">
          <div className="flex h-20 items-center justify-between">
            
            {/* Left Section - Logo & Menu */}
            <div className="flex items-center space-x-4">
              {/* Mobile Menu Button */}
              {isMobile && (
                <motion.button
                  onClick={() => setMobileMenuOpen(!mobileMenuOpen)}
                  className="p-3 rounded-2xl bg-white/10 backdrop-blur-sm border border-white/20 text-white hover:bg-white/20 transition-all duration-300"
                  whileHover={{ scale: 1.05 }}
                  whileTap={{ scale: 0.95 }}
                >
                  <AnimatePresence mode="wait">
                    {mobileMenuOpen ? (
                      <motion.div
                        key="close"
                        initial={{ rotate: -90, opacity: 0 }}
                        animate={{ rotate: 0, opacity: 1 }}
                        exit={{ rotate: 90, opacity: 0 }}
                        transition={{ duration: 0.2 }}
                      >
                        <X className="w-6 h-6" />
                      </motion.div>
                    ) : (
                      <motion.div
                        key="menu"
                        initial={{ rotate: 90, opacity: 0 }}
                        animate={{ rotate: 0, opacity: 1 }}
                        exit={{ rotate: -90, opacity: 0 }}
                        transition={{ duration: 0.2 }}
                      >
                        <Menu className="w-6 h-6" />
                      </motion.div>
                    )}
                  </AnimatePresence>
                </motion.button>
              )}

              {/* Desktop Sidebar Toggle */}
              {!isMobile && (
                <motion.button
                  onClick={toggleSidebar}
                  className="p-3 rounded-2xl bg-white/10 backdrop-blur-sm border border-white/20 text-white hover:bg-white/20 transition-all duration-300"
                  whileHover={{ scale: 1.05 }}
                  whileTap={{ scale: 0.95 }}
                >
                  <Menu className="w-6 h-6" />
                </motion.button>
              )}

              {/* Logo - Always visible */}
              <motion.div 
                className="flex items-center space-x-3"
                whileHover={{ scale: 1.02 }}
              >
                <div className="relative">
                  <motion.div
                    className="w-12 h-12 bg-gradient-to-br from-blue-400 via-purple-500 to-pink-500 rounded-2xl flex items-center justify-center shadow-xl shadow-purple-500/50"
                    animate={{ 
                      boxShadow: [
                        "0 0 20px rgba(168, 85, 247, 0.5)",
                        "0 0 40px rgba(168, 85, 247, 0.8)",
                        "0 0 20px rgba(168, 85, 247, 0.5)"
                      ]
                    }}
                    transition={{ duration: 3, repeat: Infinity }}
                  >
                    <Rocket className="w-7 h-7 text-white" />
                  </motion.div>
                  {/* Floating particles around logo */}
                  <motion.div
                    className="absolute -top-1 -right-1 w-3 h-3 bg-yellow-400 rounded-full"
                    animate={{
                      scale: [1, 1.5, 1],
                      opacity: [0.7, 1, 0.7],
                    }}
                    transition={{ duration: 2, repeat: Infinity }}
                  />
                </div>
                {!isMobile && (
                  <div>
                    <h1 className="text-2xl font-bold bg-gradient-to-r from-white to-blue-200 bg-clip-text text-transparent">
                      Orbic
                    </h1>
                    <p className="text-xs text-white/70">Learning Galaxy</p>
                  </div>
                )}
              </motion.div>
            </div>

            {/* Center Section - Search */}
            <div className="flex-1 max-w-2xl mx-8 hidden md:block">
              <motion.div 
                className={`relative transition-all duration-300 ${
                  searchFocused ? 'scale-105' : 'scale-100'
                }`}
                onFocus={() => setSearchFocused(true)}
                onBlur={() => setSearchFocused(false)}
              >
                <div className="absolute inset-y-0 left-0 flex items-center pl-4 pointer-events-none">
                  <Search className={`w-5 h-5 transition-colors duration-300 ${
                    searchFocused ? 'text-blue-400' : 'text-white/60'
                  }`} />
                </div>
                <input
                  type="search"
                  placeholder="Search for quests, galaxies, adventures..."
                  className="block w-full rounded-2xl pl-12 pr-4 py-4 bg-white/10 backdrop-blur-sm border border-white/20 text-white placeholder:text-white/60 focus:border-blue-400/50 focus:outline-none focus:ring-2 focus:ring-blue-400/30 transition-all duration-300"
                />
                {/* Search glow effect */}
                {searchFocused && (
                  <motion.div
                    className="absolute inset-0 rounded-2xl bg-gradient-to-r from-blue-400/20 to-purple-400/20 -z-10"
                    initial={{ opacity: 0, scale: 0.8 }}
                    animate={{ opacity: 1, scale: 1.1 }}
                    exit={{ opacity: 0, scale: 0.8 }}
                    transition={{ duration: 0.3 }}
                  />
                )}
              </motion.div>
            </div>

            {/* Right Section - User Info & Actions */}
            <div className="flex items-center space-x-3">
              
              {/* User Stats - Desktop Only */}
              {!isMobile && (
                <motion.div 
                  className="flex items-center space-x-4 px-4 py-2 rounded-2xl bg-white/10 backdrop-blur-sm border border-white/20"
                  whileHover={{ scale: 1.02 }}
                >
                  {/* Streak */}
                  <div className="flex items-center space-x-2">
                    <motion.div
                      className="w-8 h-8 bg-gradient-to-r from-orange-400 to-red-500 rounded-xl flex items-center justify-center"
                      animate={{ 
                        boxShadow: [
                          "0 0 10px rgba(251, 146, 60, 0.5)",
                          "0 0 20px rgba(251, 146, 60, 0.8)",
                          "0 0 10px rgba(251, 146, 60, 0.5)"
                        ]
                      }}
                      transition={{ duration: 2, repeat: Infinity }}
                    >
                      <Zap className="w-4 h-4 text-white" />
                    </motion.div>
                    <div>
                      <div className="text-sm font-bold text-white">{userStreak}</div>
                      <div className="text-xs text-white/70">streak</div>
                    </div>
                  </div>

                  {/* Level */}
                  <div className="flex items-center space-x-2">
                    <motion.div
                      className="w-8 h-8 bg-gradient-to-r from-yellow-400 to-orange-500 rounded-xl flex items-center justify-center"
                      animate={{ rotate: [0, 5, -5, 0] }}
                      transition={{ duration: 4, repeat: Infinity }}
                    >
                      <Crown className="w-4 h-4 text-white" />
                    </motion.div>
                    <div>
                      <div className="text-sm font-bold text-white">{userLevel}</div>
                      <div className="text-xs text-white/70">level</div>
                    </div>
                  </div>
                </motion.div>
              )}

              {/* Action Buttons */}
              <div className="flex items-center space-x-2">
                
                {/* Theme Toggle */}
                <motion.button
                  onClick={toggleTheme}
                  className="p-3 rounded-2xl bg-white/10 backdrop-blur-sm border border-white/20 text-white hover:bg-white/20 transition-all duration-300"
                  whileHover={{ scale: 1.05 }}
                  whileTap={{ scale: 0.95 }}
                >
                  <AnimatePresence mode="wait">
                    {theme === "dark" ? (
                      <motion.div
                        key="sun"
                        initial={{ rotate: -90, opacity: 0 }}
                        animate={{ rotate: 0, opacity: 1 }}
                        exit={{ rotate: 90, opacity: 0 }}
                        transition={{ duration: 0.3 }}
                      >
                        <Sun className="w-5 h-5" />
                      </motion.div>
                    ) : (
                      <motion.div
                        key="moon"
                        initial={{ rotate: 90, opacity: 0 }}
                        animate={{ rotate: 0, opacity: 1 }}
                        exit={{ rotate: -90, opacity: 0 }}
                        transition={{ duration: 0.3 }}
                      >
                        <Moon className="w-5 h-5" />
                      </motion.div>
                    )}
                  </AnimatePresence>
                </motion.button>

                {/* Notifications */}
                <motion.button
                  className="relative p-3 rounded-2xl bg-white/10 backdrop-blur-sm border border-white/20 text-white hover:bg-white/20 transition-all duration-300"
                  whileHover={{ scale: 1.05 }}
                  whileTap={{ scale: 0.95 }}
                >
                  <Bell className="w-5 h-5" />
                  {/* Notification badge */}
                  <motion.div
                    className="absolute -top-1 -right-1 w-5 h-5 bg-gradient-to-r from-red-400 to-pink-500 rounded-full flex items-center justify-center"
                    animate={{ scale: [1, 1.2, 1] }}
                    transition={{ duration: 2, repeat: Infinity }}
                  >
                    <span className="text-xs font-bold text-white">3</span>
                  </motion.div>
                </motion.button>

                {/* Settings */}
                <motion.button
                  className="p-3 rounded-2xl bg-white/10 backdrop-blur-sm border border-white/20 text-white hover:bg-white/20 transition-all duration-300"
                  whileHover={{ scale: 1.05, rotate: 90 }}
                  whileTap={{ scale: 0.95 }}
                >
                  <Settings className="w-5 h-5" />
                </motion.button>
              </div>

              {/* User Profile */}
              <motion.div 
                className="flex items-center space-x-3 px-3 py-2 rounded-2xl bg-white/10 backdrop-blur-sm border border-white/20 hover:bg-white/20 transition-all duration-300 cursor-pointer"
                whileHover={{ scale: 1.02 }}
              >
                <div className="relative">
                  <ProgressRing progress={65} size={48} strokeWidth={3} variant="neon">
                    <Avatar
                      src={user?.avatarId}
                      alt={user?.displayName}
                      size="sm"
                      variant="gradient"
                    />
                  </ProgressRing>
                  {/* Level badge on avatar */}
                  <div className="absolute -bottom-1 -right-1 w-6 h-6 bg-gradient-to-r from-yellow-400 to-orange-500 rounded-full flex items-center justify-center border-2 border-white shadow-lg">
                    <span className="text-xs font-bold text-white">{userLevel}</span>
                  </div>
                </div>

                {!isMobile && (
                  <div className="text-left">
                    <div className="text-sm font-bold text-white">
                      {user?.displayName}
                    </div>
                    <div className="text-xs text-white/70 flex items-center space-x-1">
                      <Star className="w-3 h-3 text-yellow-400" />
                      <span>{userXP} XP</span>
                    </div>
                  </div>
                )}
              </motion.div>
            </div>
          </div>
        </div>

        {/* Mobile Search Bar */}
        {isMobile && (
          <motion.div 
            className="px-4 pb-4"
            initial={{ opacity: 0, y: -20 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ delay: 0.2 }}
          >
            <div className="relative">
              <div className="absolute inset-y-0 left-0 flex items-center pl-4 pointer-events-none">
                <Search className="w-5 h-5 text-white/60" />
              </div>
              <input
                type="search"
                placeholder="Search adventures..."
                className="block w-full rounded-2xl pl-12 pr-4 py-3 bg-white/10 backdrop-blur-sm border border-white/20 text-white placeholder:text-white/60 focus:border-blue-400/50 focus:outline-none focus:ring-2 focus:ring-blue-400/30"
              />
            </div>
          </motion.div>
        )}
      </motion.header>

      {/* Mobile Menu Overlay */}
      <AnimatePresence>
        {mobileMenuOpen && isMobile && (
          <motion.div
            className="fixed inset-0 z-40 bg-black/50 backdrop-blur-sm"
            initial={{ opacity: 0 }}
            animate={{ opacity: 1 }}
            exit={{ opacity: 0 }}
            onClick={() => setMobileMenuOpen(false)}
          >
            <motion.div
              className="absolute top-24 left-4 right-4 bg-gradient-to-br from-indigo-900/95 to-purple-900/95 backdrop-blur-xl rounded-3xl border border-white/20 shadow-2xl p-6"
              initial={{ opacity: 0, y: -50, scale: 0.9 }}
              animate={{ opacity: 1, y: 0, scale: 1 }}
              exit={{ opacity: 0, y: -50, scale: 0.9 }}
              onClick={(e) => e.stopPropagation()}
            >
              {/* Mobile User Stats */}
              <div className="grid grid-cols-3 gap-4 mb-6">
                <div className="text-center p-3 rounded-2xl bg-white/10 border border-white/20">
                  <div className="w-8 h-8 bg-gradient-to-r from-orange-400 to-red-500 rounded-xl flex items-center justify-center mx-auto mb-2">
                    <Zap className="w-4 h-4 text-white" />
                  </div>
                  <div className="text-sm font-bold text-white">{userStreak}</div>
                  <div className="text-xs text-white/70">streak</div>
                </div>
                
                <div className="text-center p-3 rounded-2xl bg-white/10 border border-white/20">
                  <div className="w-8 h-8 bg-gradient-to-r from-yellow-400 to-orange-500 rounded-xl flex items-center justify-center mx-auto mb-2">
                    <Crown className="w-4 h-4 text-white" />
                  </div>
                  <div className="text-sm font-bold text-white">{userLevel}</div>
                  <div className="text-xs text-white/70">level</div>
                </div>
                
                <div className="text-center p-3 rounded-2xl bg-white/10 border border-white/20">
                  <div className="w-8 h-8 bg-gradient-to-r from-blue-400 to-purple-500 rounded-xl flex items-center justify-center mx-auto mb-2">
                    <Star className="w-4 h-4 text-white" />
                  </div>
                  <div className="text-sm font-bold text-white">{userXP}</div>
                  <div className="text-xs text-white/70">XP</div>
                </div>
              </div>

              {/* Quick Actions */}
              <div className="space-y-3">
                <motion.button
                  className="w-full p-4 rounded-2xl bg-gradient-to-r from-blue-500 to-purple-600 text-white font-semibold flex items-center justify-center space-x-2"
                  whileHover={{ scale: 1.02 }}
                  whileTap={{ scale: 0.98 }}
                >
                  <Rocket className="w-5 h-5" />
                  <span>Continue Learning</span>
                </motion.button>
                
                <motion.button
                  className="w-full p-4 rounded-2xl bg-white/10 border border-white/20 text-white font-semibold flex items-center justify-center space-x-2"
                  whileHover={{ scale: 1.02 }}
                  whileTap={{ scale: 0.98 }}
                >
                  <Settings className="w-5 h-5" />
                  <span>Settings</span>
                </motion.button>
              </div>
            </motion.div>
          </motion.div>
        )}
      </AnimatePresence>
    </>
  );
}