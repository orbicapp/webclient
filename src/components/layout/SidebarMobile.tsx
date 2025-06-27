import { motion, AnimatePresence } from "framer-motion";
import { Link, useLocation } from "react-router-dom";
import { 
  Home,
  Compass,
  BookOpen,
  User,
  Trophy,
  Star,
  Zap,
  Crown
} from "lucide-react";

import { useResponsive } from "@/hooks/use-responsive";

interface NavItem {
  name: string;
  path: string;
  icon: React.ReactNode;
  color: string;
  gradient: string;
}

const mobileNavItems: NavItem[] = [
  {
    name: "Hub",
    path: "/",
    icon: <Home className="w-6 h-6" />,
    color: "text-blue-400",
    gradient: "from-blue-500 to-cyan-500",
  },
  {
    name: "Explore",
    path: "/courses",
    icon: <Compass className="w-6 h-6" />,
    color: "text-purple-400",
    gradient: "from-purple-500 to-pink-500",
  },
  {
    name: "Quests",
    path: "/my-courses",
    icon: <BookOpen className="w-6 h-6" />,
    color: "text-emerald-400",
    gradient: "from-emerald-500 to-teal-500",
  },
  {
    name: "Wins",
    path: "/achievements",
    icon: <Trophy className="w-6 h-6" />,
    color: "text-yellow-400",
    gradient: "from-yellow-500 to-orange-500",
  },
  {
    name: "Profile",
    path: "/profile",
    icon: <User className="w-6 h-6" />,
    color: "text-orange-400",
    gradient: "from-orange-500 to-red-500",
  },
];

export function SidebarMobile() {
  const { isMobile } = useResponsive();
  const location = useLocation();

  // Only show on mobile
  if (!isMobile) return null;

  return (
    <motion.nav 
      className="fixed bottom-0 left-0 right-0 z-50 bg-gradient-to-r from-indigo-900/95 via-purple-900/95 to-pink-900/95 backdrop-blur-xl border-t border-white/10 shadow-2xl"
      initial={{ y: 100 }}
      animate={{ y: 0 }}
      transition={{ duration: 0.6, type: "spring" }}
    >
      {/* Floating particles above nav */}
      <div className="absolute -top-8 left-0 right-0 h-8 overflow-hidden pointer-events-none">
        {[...Array(10)].map((_, i) => (
          <motion.div
            key={i}
            className="absolute w-1 h-1 bg-white rounded-full"
            style={{
              left: `${Math.random() * 100}%`,
              top: `${Math.random() * 100}%`,
            }}
            animate={{
              y: [0, -20, 0],
              opacity: [0.3, 0.8, 0.3],
            }}
            transition={{
              duration: 3,
              repeat: Infinity,
              delay: i * 0.3,
            }}
          />
        ))}
      </div>

      <div className="flex justify-around items-center py-2 px-4">
        {mobileNavItems.map((item, index) => {
          const isActive = location.pathname === item.path;
          
          return (
            <motion.div
              key={item.path}
              initial={{ opacity: 0, y: 50 }}
              animate={{ opacity: 1, y: 0 }}
              transition={{ delay: index * 0.1, duration: 0.5 }}
            >
              <Link to={item.path}>
                <motion.div
                  className={`relative flex flex-col items-center p-3 rounded-2xl transition-all duration-300 ${
                    isActive ? "scale-110" : "scale-100"
                  }`}
                  whileHover={{ scale: 1.05 }}
                  whileTap={{ scale: 0.95 }}
                >
                  {/* Background glow for active item */}
                  {isActive && (
                    <motion.div
                      className={`absolute inset-0 rounded-2xl bg-gradient-to-r ${item.gradient} opacity-30 blur-lg`}
                      layoutId="mobileActiveBackground"
                      initial={{ opacity: 0 }}
                      animate={{ opacity: 0.3 }}
                      transition={{ duration: 0.3 }}
                    />
                  )}

                  {/* Icon container */}
                  <motion.div
                    className={`relative w-12 h-12 rounded-2xl flex items-center justify-center transition-all duration-300 ${
                      isActive 
                        ? `bg-gradient-to-r ${item.gradient} shadow-xl shadow-current/30` 
                        : "bg-white/10 border border-white/20"
                    }`}
                    animate={isActive ? { 
                      boxShadow: [
                        "0 0 20px rgba(168, 85, 247, 0.5)",
                        "0 0 30px rgba(168, 85, 247, 0.8)",
                        "0 0 20px rgba(168, 85, 247, 0.5)"
                      ]
                    } : {}}
                    transition={{ duration: 2, repeat: Infinity }}
                  >
                    <div className={`${isActive ? "text-white" : item.color} transition-colors duration-300`}>
                      {item.icon}
                    </div>

                    {/* Active indicator dot */}
                    {isActive && (
                      <motion.div
                        className="absolute -top-1 -right-1 w-3 h-3 bg-yellow-400 rounded-full border-2 border-white"
                        initial={{ scale: 0 }}
                        animate={{ scale: 1 }}
                        transition={{ delay: 0.2, type: "spring" }}
                      />
                    )}
                  </motion.div>

                  {/* Label */}
                  <motion.span
                    className={`text-xs font-semibold mt-1 transition-all duration-300 ${
                      isActive ? "text-white" : "text-white/70"
                    }`}
                    animate={isActive ? { scale: 1.05 } : { scale: 1 }}
                  >
                    {item.name}
                  </motion.span>

                  {/* Active indicator line */}
                  {isActive && (
                    <motion.div
                      className="absolute -top-4 left-1/2 transform -translate-x-1/2 w-8 h-1 bg-gradient-to-r from-blue-400 to-purple-500 rounded-full"
                      layoutId="mobileActiveIndicator"
                      initial={{ opacity: 0, y: 10 }}
                      animate={{ opacity: 1, y: 0 }}
                      transition={{ duration: 0.3 }}
                    />
                  )}
                </motion.div>
              </Link>
            </motion.div>
          );
        })}
      </div>

      {/* Bottom safe area for devices with home indicator */}
      <div className="h-safe-area-inset-bottom" />
    </motion.nav>
  );
}