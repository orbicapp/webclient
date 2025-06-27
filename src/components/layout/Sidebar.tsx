import { motion, AnimatePresence } from "framer-motion";
import { Link, useLocation } from "react-router-dom";
import { 
  Home,
  Compass,
  BookOpen,
  User,
  Trophy,
  Settings,
  LogOut,
  Rocket,
  Star,
  Zap,
  Crown,
  Target,
  Gem,
  Shield,
  Flame
} from "lucide-react";

import { useAuth } from "@/hooks/use-auth";
import { useSettingsStore } from "@/stores/settings-store";
import { useResponsive } from "@/hooks/use-responsive";
import Avatar from "../ui/Avatar";
import ProgressRing from "../ui/ProgressRing";
import Badge from "../ui/Badge";

interface NavItem {
  name: string;
  path: string;
  icon: React.ReactNode;
  color: string;
  gradient: string;
  description: string;
}

const navigationItems: NavItem[] = [
  {
    name: "Galaxy Hub",
    path: "/",
    icon: <Home className="w-6 h-6" />,
    color: "text-blue-400",
    gradient: "from-blue-500 to-cyan-500",
    description: "Your mission control"
  },
  {
    name: "Explore",
    path: "/courses",
    icon: <Compass className="w-6 h-6" />,
    color: "text-purple-400",
    gradient: "from-purple-500 to-pink-500",
    description: "Discover new worlds"
  },
  {
    name: "My Quests",
    path: "/my-courses",
    icon: <BookOpen className="w-6 h-6" />,
    color: "text-emerald-400",
    gradient: "from-emerald-500 to-teal-500",
    description: "Your adventures"
  },
  {
    name: "Profile",
    path: "/profile",
    icon: <User className="w-6 h-6" />,
    color: "text-orange-400",
    gradient: "from-orange-500 to-red-500",
    description: "Pilot profile"
  },
  {
    name: "Achievements",
    path: "/achievements",
    icon: <Trophy className="w-6 h-6" />,
    color: "text-yellow-400",
    gradient: "from-yellow-500 to-orange-500",
    description: "Your victories"
  },
];

const bottomItems: NavItem[] = [
  {
    name: "Settings",
    path: "/settings",
    icon: <Settings className="w-6 h-6" />,
    color: "text-gray-400",
    gradient: "from-gray-500 to-slate-500",
    description: "Ship controls"
  },
];

export function Sidebar() {
  const { sidebarOpen, toggleSidebar } = useSettingsStore();
  const { user, logout } = useAuth();
  const { isMobile } = useResponsive();
  const location = useLocation();

  // Mock user stats
  const userLevel = 12;
  const userXP = 2450;
  const nextLevelXP = 3000;
  const userStreak = 7;
  const totalStars = 156;

  // Don't render sidebar on mobile (handled by header)
  if (isMobile) return null;

  return (
    <motion.aside
      className={`fixed inset-y-0 left-0 z-40 transition-all duration-500 ease-in-out ${
        sidebarOpen ? "w-80" : "w-20"
      }`}
      initial={{ x: -100, opacity: 0 }}
      animate={{ x: 0, opacity: 1 }}
      transition={{ duration: 0.6, type: "spring" }}
    >
      {/* Sidebar Background */}
      <div className="h-full bg-gradient-to-b from-indigo-900/95 via-purple-900/95 to-pink-900/95 backdrop-blur-xl border-r border-white/10 shadow-2xl">
        
        {/* Header Section */}
        <div className={`p-6 border-b border-white/10 ${!sidebarOpen && "px-4"}`}>
          <motion.div
            className="flex items-center space-x-4"
            layout
          >
            {/* Logo */}
            <motion.div
              className="relative"
              whileHover={{ scale: 1.05 }}
            >
              <div className="w-12 h-12 bg-gradient-to-br from-blue-400 via-purple-500 to-pink-500 rounded-2xl flex items-center justify-center shadow-xl shadow-purple-500/50">
                <Rocket className="w-7 h-7 text-white" />
              </div>
              {/* Floating particle */}
              <motion.div
                className="absolute -top-1 -right-1 w-3 h-3 bg-yellow-400 rounded-full"
                animate={{
                  scale: [1, 1.5, 1],
                  opacity: [0.7, 1, 0.7],
                }}
                transition={{ duration: 2, repeat: Infinity }}
              />
            </motion.div>

            {/* Logo Text */}
            <AnimatePresence>
              {sidebarOpen && (
                <motion.div
                  initial={{ opacity: 0, x: -20 }}
                  animate={{ opacity: 1, x: 0 }}
                  exit={{ opacity: 0, x: -20 }}
                  transition={{ duration: 0.3 }}
                >
                  <h1 className="text-2xl font-bold bg-gradient-to-r from-white to-blue-200 bg-clip-text text-transparent">
                    Orbic
                  </h1>
                  <p className="text-xs text-white/70">Learning Galaxy</p>
                </motion.div>
              )}
            </AnimatePresence>
          </motion.div>
        </div>

        {/* User Profile Section */}
        <div className={`p-6 border-b border-white/10 ${!sidebarOpen && "px-4"}`}>
          <motion.div
            className="flex items-center space-x-4"
            layout
          >
            {/* User Avatar with Progress Ring */}
            <div className="relative">
              <ProgressRing 
                progress={(userXP / nextLevelXP) * 100} 
                size={sidebarOpen ? 64 : 48} 
                strokeWidth={4} 
                variant="rainbow"
                glow
              >
                <Avatar
                  src={user?.avatarId}
                  alt={user?.displayName}
                  size={sidebarOpen ? "lg" : "md"}
                  variant="gradient"
                />
              </ProgressRing>
              
              {/* Level badge */}
              <div className="absolute -bottom-1 -right-1 w-8 h-8 bg-gradient-to-r from-yellow-400 to-orange-500 rounded-full flex items-center justify-center border-2 border-white shadow-xl">
                <span className="text-sm font-bold text-white">{userLevel}</span>
              </div>
            </div>

            {/* User Info */}
            <AnimatePresence>
              {sidebarOpen && (
                <motion.div
                  className="flex-1 min-w-0"
                  initial={{ opacity: 0, x: -20 }}
                  animate={{ opacity: 1, x: 0 }}
                  exit={{ opacity: 0, x: -20 }}
                  transition={{ duration: 0.3 }}
                >
                  <div className="text-white font-bold text-lg truncate">
                    {user?.displayName}
                  </div>
                  <div className="text-white/70 text-sm">
                    Space Explorer
                  </div>
                  
                  {/* XP Progress */}
                  <div className="mt-2">
                    <div className="flex justify-between text-xs text-white/60 mb-1">
                      <span>{userXP} XP</span>
                      <span>{nextLevelXP} XP</span>
                    </div>
                    <div className="w-full bg-white/20 rounded-full h-2">
                      <motion.div
                        className="bg-gradient-to-r from-blue-400 to-purple-500 h-2 rounded-full"
                        initial={{ width: 0 }}
                        animate={{ width: `${(userXP / nextLevelXP) * 100}%` }}
                        transition={{ duration: 1, delay: 0.5 }}
                      />
                    </div>
                  </div>
                </motion.div>
              )}
            </AnimatePresence>
          </motion.div>

          {/* Quick Stats */}
          <AnimatePresence>
            {sidebarOpen && (
              <motion.div
                className="grid grid-cols-3 gap-2 mt-4"
                initial={{ opacity: 0, y: 20 }}
                animate={{ opacity: 1, y: 0 }}
                exit={{ opacity: 0, y: 20 }}
                transition={{ duration: 0.3, delay: 0.1 }}
              >
                <div className="text-center p-2 rounded-xl bg-white/10 border border-white/20">
                  <Zap className="w-4 h-4 text-orange-400 mx-auto mb-1" />
                  <div className="text-sm font-bold text-white">{userStreak}</div>
                  <div className="text-xs text-white/60">streak</div>
                </div>
                
                <div className="text-center p-2 rounded-xl bg-white/10 border border-white/20">
                  <Star className="w-4 h-4 text-yellow-400 mx-auto mb-1" />
                  <div className="text-sm font-bold text-white">{totalStars}</div>
                  <div className="text-xs text-white/60">stars</div>
                </div>
                
                <div className="text-center p-2 rounded-xl bg-white/10 border border-white/20">
                  <Crown className="w-4 h-4 text-purple-400 mx-auto mb-1" />
                  <div className="text-sm font-bold text-white">{userLevel}</div>
                  <div className="text-xs text-white/60">level</div>
                </div>
              </motion.div>
            )}
          </AnimatePresence>
        </div>

        {/* Navigation */}
        <nav className="flex-1 p-4 space-y-2 overflow-y-auto">
          {navigationItems.map((item, index) => {
            const isActive = location.pathname === item.path;
            
            return (
              <motion.div
                key={item.path}
                initial={{ opacity: 0, x: -50 }}
                animate={{ opacity: 1, x: 0 }}
                transition={{ delay: index * 0.1, duration: 0.5 }}
              >
                <Link to={item.path}>
                  <motion.div
                    className={`relative group flex items-center p-4 rounded-2xl transition-all duration-300 ${
                      isActive
                        ? `bg-gradient-to-r ${item.gradient} shadow-xl shadow-current/30`
                        : "hover:bg-white/10 hover:shadow-lg"
                    } ${!sidebarOpen && "justify-center"}`}
                    whileHover={{ scale: 1.02, x: 5 }}
                    whileTap={{ scale: 0.98 }}
                  >
                    {/* Icon */}
                    <div className={`${isActive ? "text-white" : item.color} transition-colors duration-300`}>
                      {item.icon}
                    </div>

                    {/* Text */}
                    <AnimatePresence>
                      {sidebarOpen && (
                        <motion.div
                          className="ml-4 flex-1"
                          initial={{ opacity: 0, x: -20 }}
                          animate={{ opacity: 1, x: 0 }}
                          exit={{ opacity: 0, x: -20 }}
                          transition={{ duration: 0.3 }}
                        >
                          <div className={`font-semibold ${isActive ? "text-white" : "text-white/90"}`}>
                            {item.name}
                          </div>
                          <div className={`text-xs ${isActive ? "text-white/80" : "text-white/60"}`}>
                            {item.description}
                          </div>
                        </motion.div>
                      )}
                    </AnimatePresence>

                    {/* Active indicator */}
                    {isActive && (
                      <motion.div
                        className="absolute right-2 w-2 h-8 bg-white rounded-full"
                        layoutId="activeIndicator"
                        initial={{ opacity: 0 }}
                        animate={{ opacity: 1 }}
                        transition={{ duration: 0.3 }}
                      />
                    )}

                    {/* Hover glow effect */}
                    {!isActive && (
                      <motion.div
                        className={`absolute inset-0 rounded-2xl bg-gradient-to-r ${item.gradient} opacity-0 group-hover:opacity-20 transition-opacity duration-300`}
                      />
                    )}
                  </motion.div>
                </Link>
              </motion.div>
            );
          })}
        </nav>

        {/* Bottom Section */}
        <div className="p-4 border-t border-white/10 space-y-2">
          {/* Settings */}
          {bottomItems.map((item) => {
            const isActive = location.pathname === item.path;
            
            return (
              <Link key={item.path} to={item.path}>
                <motion.div
                  className={`flex items-center p-3 rounded-2xl transition-all duration-300 hover:bg-white/10 ${
                    !sidebarOpen && "justify-center"
                  }`}
                  whileHover={{ scale: 1.02 }}
                  whileTap={{ scale: 0.98 }}
                >
                  <div className={item.color}>
                    {item.icon}
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
                        <div className="font-semibold text-white/90">{item.name}</div>
                        <div className="text-xs text-white/60">{item.description}</div>
                      </motion.div>
                    )}
                  </AnimatePresence>
                </motion.div>
              </Link>
            );
          })}

          {/* Logout */}
          <motion.button
            onClick={() => logout()}
            className={`w-full flex items-center p-3 rounded-2xl transition-all duration-300 hover:bg-red-500/20 text-red-400 hover:text-red-300 ${
              !sidebarOpen && "justify-center"
            }`}
            whileHover={{ scale: 1.02 }}
            whileTap={{ scale: 0.98 }}
          >
            <LogOut className="w-6 h-6" />
            <AnimatePresence>
              {sidebarOpen && (
                <motion.div
                  className="ml-4"
                  initial={{ opacity: 0, x: -20 }}
                  animate={{ opacity: 1, x: 0 }}
                  exit={{ opacity: 0, x: -20 }}
                  transition={{ duration: 0.3 }}
                >
                  <div className="font-semibold">Sign Out</div>
                  <div className="text-xs text-red-400/60">End mission</div>
                </motion.div>
              )}
            </AnimatePresence>
          </motion.button>
        </div>

        {/* Collapse Toggle */}
        <motion.button
          onClick={toggleSidebar}
          className="absolute -right-4 top-8 w-8 h-8 bg-gradient-to-r from-purple-500 to-pink-500 rounded-full flex items-center justify-center shadow-xl shadow-purple-500/50 border-2 border-white/20"
          whileHover={{ scale: 1.1 }}
          whileTap={{ scale: 0.9 }}
        >
          <motion.div
            animate={{ rotate: sidebarOpen ? 180 : 0 }}
            transition={{ duration: 0.3 }}
          >
            <Target className="w-4 h-4 text-white" />
          </motion.div>
        </motion.button>
      </div>
    </motion.aside>
  );
}