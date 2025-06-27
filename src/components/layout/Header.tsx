import { useAuth } from "@/hooks/use-auth";
import { useSettingsStore } from "@/stores/settings-store";
import { useResponsive } from "@/hooks/use-responsive";
import {
  ChevronDownIcon,
  MoonIcon,
  RocketIcon,
  SearchIcon,
  SunIcon,
  UsersIcon,
  BellIcon,
  MenuIcon,
  XIcon,
  Flame,
  Gem,
  Zap,
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
  const [showMobileMenu, setShowMobileMenu] = useState(false);
  const [showNotifications, setShowNotifications] = useState(false);

  // Mock user stats for gamification
  const userLevel = 12;
  const userXP = 2450;
  const userStreak = 7;

  return (
    <>
      <motion.header 
        className="sticky top-0 z-50 bg-white/90 dark:bg-gray-900/90 backdrop-blur-xl border-b-2 border-primary-100 dark:border-gray-800"
        initial={{ y: -100 }}
        animate={{ y: 0 }}
        transition={{ duration: 0.3 }}
      >
        <div className="px-4 sm:px-6 lg:px-8">
          <div className="flex h-16 sm:h-18 items-center justify-between">
            {/* Left Section */}
            <div className="flex items-center space-x-4">
              {/* Mobile menu button */}
              {isMobile && (
                <motion.button
                  onClick={() => setShowMobileMenu(!showMobileMenu)}
                  className="p-2 rounded-xl bg-primary-100 dark:bg-gray-800 text-primary-600 dark:text-primary-400 hover:bg-primary-200 dark:hover:bg-gray-700 transition-colors"
                  whileHover={{ scale: 1.05 }}
                  whileTap={{ scale: 0.95 }}
                >
                  {showMobileMenu ? (
                    <XIcon className="w-6 h-6" />
                  ) : (
                    <MenuIcon className="w-6 h-6" />
                  )}
                </motion.button>
              )}

              {/* Desktop sidebar toggle */}
              {!isMobile && (
                <motion.button
                  onClick={toggleSidebar}
                  className="p-2 rounded-xl bg-primary-100 dark:bg-gray-800 text-primary-600 dark:text-primary-400 hover:bg-primary-200 dark:hover:bg-gray-700 transition-colors"
                  whileHover={{ scale: 1.05 }}
                  whileTap={{ scale: 0.95 }}
                >
                  <MenuIcon className="w-5 h-5" />
                </motion.button>
              )}

              {/* Logo - Always visible */}
              <motion.div 
                className="flex items-center space-x-3"
                whileHover={{ scale: 1.02 }}
              >
                <div className="w-10 h-10 bg-gradient-to-br from-primary-500 to-accent-500 rounded-2xl flex items-center justify-center shadow-lg">
                  <RocketIcon className="w-6 h-6 text-white" />
                </div>
                {!isMobile && (
                  <span className="text-2xl font-bold bg-gradient-to-r from-primary-600 to-accent-600 bg-clip-text text-transparent">
                    Orbic
                  </span>
                )}
              </motion.div>
            </div>

            {/* Center Section - Search (Desktop only) */}
            {!isMobile && (
              <div className="flex-1 max-w-md mx-8">
                <div className="relative">
                  <div className="absolute inset-y-0 left-0 flex items-center pl-4 pointer-events-none">
                    <SearchIcon className="w-5 h-5 text-gray-400" />
                  </div>
                  <input
                    type="search"
                    placeholder="Search courses, topics..."
                    className="block w-full rounded-2xl pl-12 pr-4 py-3 border-2 border-gray-200 dark:border-gray-700 bg-gray-50 dark:bg-gray-800 text-gray-900 dark:text-gray-100 focus:border-primary-500 dark:focus:border-primary-400 focus:outline-none focus:ring-0 transition-colors placeholder:text-gray-500"
                  />
                </div>
              </div>
            )}

            {/* Right Section */}
            <div className="flex items-center space-x-2 sm:space-x-4">
              {/* User Stats (Desktop) */}
              {!isMobile && (
                <motion.div 
                  className="flex items-center space-x-4 px-4 py-2 bg-gradient-to-r from-primary-50 to-accent-50 dark:from-gray-800 dark:to-gray-700 rounded-2xl border border-primary-200 dark:border-gray-600"
                  whileHover={{ scale: 1.02 }}
                >
                  {/* Streak */}
                  <div className="flex items-center space-x-2">
                    <div className="w-8 h-8 bg-gradient-to-r from-orange-400 to-red-500 rounded-xl flex items-center justify-center">
                      <Flame className="w-4 h-4 text-white" />
                    </div>
                    <div className="text-sm">
                      <div className="font-bold text-gray-900 dark:text-white">{userStreak}</div>
                      <div className="text-xs text-gray-500 dark:text-gray-400">streak</div>
                    </div>
                  </div>

                  {/* XP */}
                  <div className="flex items-center space-x-2">
                    <div className="w-8 h-8 bg-gradient-to-r from-yellow-400 to-orange-500 rounded-xl flex items-center justify-center">
                      <Gem className="w-4 h-4 text-white" />
                    </div>
                    <div className="text-sm">
                      <div className="font-bold text-gray-900 dark:text-white">{userXP}</div>
                      <div className="text-xs text-gray-500 dark:text-gray-400">XP</div>
                    </div>
                  </div>
                </motion.div>
              )}

              {/* Theme toggle */}
              <motion.button
                onClick={toggleTheme}
                className="p-3 rounded-2xl bg-gray-100 dark:bg-gray-800 text-gray-600 dark:text-gray-300 hover:bg-gray-200 dark:hover:bg-gray-700 transition-colors"
                whileHover={{ scale: 1.05 }}
                whileTap={{ scale: 0.95 }}
              >
                {theme === "dark" ? (
                  <SunIcon className="w-5 h-5" />
                ) : (
                  <MoonIcon className="w-5 h-5" />
                )}
              </motion.button>

              {/* Notifications */}
              <div className="relative">
                <motion.button
                  onClick={() => setShowNotifications(!showNotifications)}
                  className="p-3 rounded-2xl bg-gray-100 dark:bg-gray-800 text-gray-600 dark:text-gray-300 hover:bg-gray-200 dark:hover:bg-gray-700 transition-colors relative"
                  whileHover={{ scale: 1.05 }}
                  whileTap={{ scale: 0.95 }}
                >
                  <BellIcon className="w-5 h-5" />
                  {/* Notification badge */}
                  <div className="absolute -top-1 -right-1 w-5 h-5 bg-red-500 rounded-full flex items-center justify-center">
                    <span className="text-xs font-bold text-white">3</span>
                  </div>
                </motion.button>

                {/* Notifications dropdown */}
                <AnimatePresence>
                  {showNotifications && (
                    <motion.div
                      className="absolute right-0 top-full mt-2 w-80 bg-white dark:bg-gray-800 rounded-2xl shadow-2xl border border-gray-200 dark:border-gray-700 z-50"
                      initial={{ opacity: 0, y: -10, scale: 0.95 }}
                      animate={{ opacity: 1, y: 0, scale: 1 }}
                      exit={{ opacity: 0, y: -10, scale: 0.95 }}
                      transition={{ duration: 0.2 }}
                    >
                      <div className="p-4">
                        <h3 className="font-bold text-gray-900 dark:text-white mb-3">Notifications</h3>
                        <div className="space-y-3">
                          {[1, 2, 3].map((i) => (
                            <div key={i} className="p-3 bg-gray-50 dark:bg-gray-700 rounded-xl">
                              <div className="text-sm font-medium text-gray-900 dark:text-white">
                                New achievement unlocked!
                              </div>
                              <div className="text-xs text-gray-500 dark:text-gray-400 mt-1">
                                2 minutes ago
                              </div>
                            </div>
                          ))}
                        </div>
                      </div>
                    </motion.div>
                  )}
                </AnimatePresence>
              </div>

              {/* User Profile */}
              <div className="flex items-center space-x-3">
                {/* Level Progress Ring */}
                <ProgressRing progress={75} size={44} strokeWidth={3} variant="neon">
                  <span className="text-xs font-bold text-gray-900 dark:text-white">{userLevel}</span>
                </ProgressRing>

                {/* User Info (Desktop) */}
                {!isMobile && (
                  <div className="text-right">
                    <p className="text-sm font-bold text-gray-900 dark:text-white">
                      {user?.displayName}
                    </p>
                    <p className="text-xs text-gray-500 dark:text-gray-400">
                      Level {userLevel}
                    </p>
                  </div>
                )}

                {/* Avatar */}
                <Avatar
                  src={user?.avatarId}
                  alt={user?.displayName}
                  size={isMobile ? "md" : "lg"}
                  variant="gradient"
                  glow
                />
              </div>
            </div>
          </div>
        </div>
      </motion.header>

      {/* Mobile Menu Overlay */}
      <AnimatePresence>
        {isMobile && showMobileMenu && (
          <motion.div
            className="fixed inset-0 z-40 bg-black/50 backdrop-blur-sm"
            initial={{ opacity: 0 }}
            animate={{ opacity: 1 }}
            exit={{ opacity: 0 }}
            onClick={() => setShowMobileMenu(false)}
          >
            <motion.div
              className="absolute top-0 left-0 w-80 h-full bg-white dark:bg-gray-900 shadow-2xl"
              initial={{ x: -320 }}
              animate={{ x: 0 }}
              exit={{ x: -320 }}
              transition={{ type: "spring", damping: 25, stiffness: 200 }}
              onClick={(e) => e.stopPropagation()}
            >
              {/* Mobile menu content will be handled by the sidebar component */}
              <div className="p-6">
                <div className="flex items-center space-x-3 mb-8">
                  <div className="w-12 h-12 bg-gradient-to-br from-primary-500 to-accent-500 rounded-2xl flex items-center justify-center shadow-lg">
                    <RocketIcon className="w-7 h-7 text-white" />
                  </div>
                  <span className="text-2xl font-bold bg-gradient-to-r from-primary-600 to-accent-600 bg-clip-text text-transparent">
                    Orbic
                  </span>
                </div>

                {/* Mobile search */}
                <div className="relative mb-6">
                  <div className="absolute inset-y-0 left-0 flex items-center pl-4 pointer-events-none">
                    <SearchIcon className="w-5 h-5 text-gray-400" />
                  </div>
                  <input
                    type="search"
                    placeholder="Search..."
                    className="block w-full rounded-2xl pl-12 pr-4 py-3 border-2 border-gray-200 dark:border-gray-700 bg-gray-50 dark:bg-gray-800 text-gray-900 dark:text-gray-100 focus:border-primary-500 dark:focus:border-primary-400 focus:outline-none focus:ring-0 transition-colors"
                  />
                </div>

                {/* Mobile user stats */}
                <div className="grid grid-cols-2 gap-4 mb-6">
                  <div className="p-4 bg-gradient-to-r from-orange-50 to-red-50 dark:from-gray-800 dark:to-gray-700 rounded-2xl border border-orange-200 dark:border-gray-600">
                    <div className="flex items-center space-x-3">
                      <div className="w-10 h-10 bg-gradient-to-r from-orange-400 to-red-500 rounded-xl flex items-center justify-center">
                        <Flame className="w-5 h-5 text-white" />
                      </div>
                      <div>
                        <div className="font-bold text-gray-900 dark:text-white">{userStreak}</div>
                        <div className="text-xs text-gray-500 dark:text-gray-400">day streak</div>
                      </div>
                    </div>
                  </div>

                  <div className="p-4 bg-gradient-to-r from-yellow-50 to-orange-50 dark:from-gray-800 dark:to-gray-700 rounded-2xl border border-yellow-200 dark:border-gray-600">
                    <div className="flex items-center space-x-3">
                      <div className="w-10 h-10 bg-gradient-to-r from-yellow-400 to-orange-500 rounded-xl flex items-center justify-center">
                        <Gem className="w-5 h-5 text-white" />
                      </div>
                      <div>
                        <div className="font-bold text-gray-900 dark:text-white">{userXP}</div>
                        <div className="text-xs text-gray-500 dark:text-gray-400">total XP</div>
                      </div>
                    </div>
                  </div>
                </div>
              </div>
            </motion.div>
          </motion.div>
        )}
      </AnimatePresence>
    </>
  );
}