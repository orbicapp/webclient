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
  Zap,
  Star,
  Crown,
  Menu,
  X,
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
  const [mobileMenuOpen, setMobileMenuOpen] = useState(false);
  const [searchFocused, setSearchFocused] = useState(false);

  return (
    <motion.header 
      className="sticky top-0 z-50 bg-gradient-to-r from-indigo-900/95 via-purple-900/95 to-pink-900/95 backdrop-blur-xl border-b border-white/10"
      initial={{ y: -100 }}
      animate={{ y: 0 }}
      transition={{ duration: 0.6, type: "spring" }}
    >
      <div className="px-4 sm:px-6 lg:px-8">
        <div className="flex h-16 sm:h-18 items-center justify-between">
          
          {/* Left Section - Logo & Mobile Menu */}
          <div className="flex items-center space-x-4">
            {/* Mobile Menu Button */}
            {isMobile && (
              <motion.button
                onClick={() => setMobileMenuOpen(!mobileMenuOpen)}
                className="p-2 rounded-xl bg-white/10 hover:bg-white/20 transition-colors"
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
                      <X className="w-5 h-5 text-white" />
                    </motion.div>
                  ) : (
                    <motion.div
                      key="menu"
                      initial={{ rotate: 90, opacity: 0 }}
                      animate={{ rotate: 0, opacity: 1 }}
                      exit={{ rotate: -90, opacity: 0 }}
                      transition={{ duration: 0.2 }}
                    >
                      <Menu className="w-5 h-5 text-white" />
                    </motion.div>
                  )}
                </AnimatePresence>
              </motion.button>
            )}

            {/* Desktop Sidebar Toggle */}
            {!isMobile && (
              <motion.button
                onClick={toggleSidebar}
                className="p-2 rounded-xl bg-white/10 hover:bg-white/20 transition-colors"
                whileHover={{ scale: 1.05 }}
                whileTap={{ scale: 0.95 }}
              >
                <Menu className="w-5 h-5 text-white" />
              </motion.button>
            )}

            {/* Logo */}
            <motion.div 
              className="flex items-center space-x-3"
              whileHover={{ scale: 1.02 }}
            >
              <div className="relative">
                <motion.div
                  className="w-10 h-10 bg-gradient-to-br from-blue-400 to-purple-600 rounded-full flex items-center justify-center shadow-lg shadow-blue-500/30"
                  animate={{ rotate: [0, 360] }}
                  transition={{ duration: 20, repeat: Infinity, ease: "linear" }}
                >
                  <RocketIcon className="w-6 h-6 text-white" />
                </motion.div>
                {/* Orbital ring */}
                <motion.div
                  className="absolute inset-0 border-2 border-blue-400/30 rounded-full"
                  animate={{ rotate: [0, -360] }}
                  transition={{ duration: 15, repeat: Infinity, ease: "linear" }}
                  style={{ width: '120%', height: '120%', left: '-10%', top: '-10%' }}
                />
              </div>
              <div className="hidden sm:block">
                <h1 className="text-xl font-bold bg-gradient-to-r from-white to-blue-200 bg-clip-text text-transparent">
                  Orbic
                </h1>
                <p className="text-xs text-blue-200/80 -mt-1">Learning Galaxy</p>
              </div>
            </motion.div>
          </div>

          {/* Center Section - Search */}
          <div className="hidden md:block flex-1 max-w-md mx-8">
            <motion.div 
              className="relative"
              animate={{ scale: searchFocused ? 1.02 : 1 }}
              transition={{ duration: 0.2 }}
            >
              <div className="absolute inset-y-0 left-0 flex items-center pl-4 pointer-events-none">
                <SearchIcon className="w-5 h-5 text-blue-300" />
              </div>
              <input
                type="search"
                placeholder="Search the galaxy..."
                className="block w-full rounded-2xl pl-12 pr-4 py-3 bg-white/10 backdrop-blur-sm border border-white/20 text-white placeholder:text-blue-200/60 focus:border-blue-400/50 focus:outline-none focus:ring-2 focus:ring-blue-400/30 transition-all duration-300"
                onFocus={() => setSearchFocused(true)}
                onBlur={() => setSearchFocused(false)}
              />
              {searchFocused && (
                <motion.div
                  className="absolute inset-0 rounded-2xl bg-gradient-to-r from-blue-500/20 to-purple-500/20 -z-10"
                  initial={{ opacity: 0, scale: 0.95 }}
                  animate={{ opacity: 1, scale: 1 }}
                  exit={{ opacity: 0, scale: 0.95 }}
                />
              )}
            </motion.div>
          </div>

          {/* Right Section - Actions & Profile */}
          <div className="flex items-center space-x-3">
            
            {/* Theme Toggle */}
            <motion.button
              onClick={toggleTheme}
              className="p-2.5 rounded-xl bg-white/10 hover:bg-white/20 transition-colors"
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
                    <SunIcon className="w-5 h-5 text-yellow-300" />
                  </motion.div>
                ) : (
                  <motion.div
                    key="moon"
                    initial={{ rotate: 90, opacity: 0 }}
                    animate={{ rotate: 0, opacity: 1 }}
                    exit={{ rotate: -90, opacity: 0 }}
                    transition={{ duration: 0.3 }}
                  >
                    <MoonIcon className="w-5 h-5 text-blue-300" />
                  </motion.div>
                )}
              </AnimatePresence>
            </motion.button>

            {/* Notifications */}
            <motion.button
              className="relative p-2.5 rounded-xl bg-white/10 hover:bg-white/20 transition-colors"
              whileHover={{ scale: 1.05 }}
              whileTap={{ scale: 0.95 }}
            >
              <BellIcon className="w-5 h-5 text-white" />
              {/* Notification badge */}
              <motion.div
                className="absolute -top-1 -right-1 w-3 h-3 bg-gradient-to-r from-red-400 to-pink-500 rounded-full border-2 border-indigo-900"
                animate={{ scale: [1, 1.2, 1] }}
                transition={{ duration: 2, repeat: Infinity }}
              />
            </motion.button>

            {/* Social Toggle (Desktop) */}
            {!isMobile && (
              <motion.button
                className="p-2.5 rounded-xl bg-white/10 hover:bg-white/20 transition-colors"
                whileHover={{ scale: 1.05 }}
                whileTap={{ scale: 0.95 }}
              >
                <UsersIcon className="w-5 h-5 text-white" />
              </motion.button>
            )}

            {/* User Profile Section */}
            <div className="flex items-center space-x-3">
              {/* XP Progress Ring */}
              <motion.div
                whileHover={{ scale: 1.05 }}
                className="hidden sm:block"
              >
                <ProgressRing progress={65} size={44} strokeWidth={3} variant="neon">
                  <span className="text-xs font-bold text-white">12</span>
                </ProgressRing>
              </motion.div>

              {/* User Info & Avatar */}
              <motion.div 
                className="flex items-center space-x-3 cursor-pointer group"
                whileHover={{ scale: 1.02 }}
              >
                {/* User Stats (Desktop) */}
                <div className="hidden lg:block text-right">
                  <div className="flex items-center space-x-2 mb-1">
                    <p className="text-sm font-semibold text-white">
                      {user?.displayName}
                    </p>
                    <Badge variant="gradient" size="sm">
                      <Crown className="w-3 h-3 mr-1" />
                      Pro
                    </Badge>
                  </div>
                  <div className="flex items-center space-x-3 text-xs">
                    <div className="flex items-center space-x-1 text-yellow-300">
                      <Star className="w-3 h-3" />
                      <span>1,247</span>
                    </div>
                    <div className="flex items-center space-x-1 text-blue-300">
                      <Zap className="w-3 h-3" />
                      <span>Level 12</span>
                    </div>
                  </div>
                </div>

                {/* Avatar */}
                <div className="relative">
                  <Avatar
                    src={user?.avatarId}
                    alt={user?.displayName}
                    size="md"
                    variant="gradient"
                    status="online"
                    className="ring-2 ring-white/30 group-hover:ring-white/50 transition-all duration-300"
                  />
                  {/* Level badge on avatar */}
                  <div className="absolute -bottom-1 -right-1 w-6 h-6 bg-gradient-to-r from-blue-500 to-purple-600 rounded-full flex items-center justify-center text-xs font-bold text-white border-2 border-indigo-900">
                    12
                  </div>
                </div>

                {/* Dropdown Arrow (Desktop) */}
                <ChevronDownIcon className="hidden lg:block w-4 h-4 text-white/70 group-hover:text-white transition-colors" />
              </motion.div>
            </div>
          </div>
        </div>
      </div>

      {/* Mobile Menu Overlay */}
      <AnimatePresence>
        {mobileMenuOpen && isMobile && (
          <motion.div
            className="absolute top-full left-0 right-0 bg-gradient-to-b from-indigo-900/98 to-purple-900/98 backdrop-blur-xl border-b border-white/10 shadow-2xl"
            initial={{ opacity: 0, y: -20 }}
            animate={{ opacity: 1, y: 0 }}
            exit={{ opacity: 0, y: -20 }}
            transition={{ duration: 0.3 }}
          >
            <div className="p-4 space-y-4">
              {/* Mobile Search */}
              <div className="relative">
                <SearchIcon className="absolute left-3 top-1/2 transform -translate-y-1/2 w-5 h-5 text-blue-300" />
                <input
                  type="search"
                  placeholder="Search the galaxy..."
                  className="w-full rounded-xl pl-10 pr-4 py-3 bg-white/10 backdrop-blur-sm border border-white/20 text-white placeholder:text-blue-200/60 focus:border-blue-400/50 focus:outline-none"
                />
              </div>

              {/* Mobile User Stats */}
              <div className="flex items-center justify-between p-4 bg-white/5 rounded-xl border border-white/10">
                <div className="flex items-center space-x-3">
                  <ProgressRing progress={65} size={40} strokeWidth={3} variant="neon">
                    <span className="text-xs font-bold text-white">12</span>
                  </ProgressRing>
                  <div>
                    <p className="text-sm font-semibold text-white">{user?.displayName}</p>
                    <div className="flex items-center space-x-2 text-xs">
                      <span className="flex items-center space-x-1 text-yellow-300">
                        <Star className="w-3 h-3" />
                        <span>1,247</span>
                      </span>
                      <span className="flex items-center space-x-1 text-blue-300">
                        <Zap className="w-3 h-3" />
                        <span>Level 12</span>
                      </span>
                    </div>
                  </div>
                </div>
                <Badge variant="gradient" size="sm">
                  <Crown className="w-3 h-3 mr-1" />
                  Pro
                </Badge>
              </div>
            </div>
          </motion.div>
        )}
      </AnimatePresence>
    </motion.header>
  );
}