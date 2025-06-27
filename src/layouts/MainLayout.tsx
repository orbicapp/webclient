import { AnimatePresence, motion } from "framer-motion";
import { Navigate, Outlet, useLocation } from "react-router-dom";

import { Header } from "@/components/layout/Header";
import { Sidebar } from "@/components/layout/Sidebar";
import { SidebarMobile } from "@/components/layout/SidebarMobile";
import { useSettingsStore } from "@/stores/settings-store";
import { useResponsive } from "@/hooks/use-responsive";
import { useAuth } from "../hooks/use-auth";

export function MainLayout() {
  const { isAuthenticated, error } = useAuth();
  const { theme, sidebarOpen } = useSettingsStore();
  const { isMobile } = useResponsive();
  const location = useLocation();

  // If isn't authenticated
  if (!isAuthenticated) {
    return <Navigate to="/login" replace />;
  }

  // If there is an authentication error
  if (error || !isAuthenticated) {
    return <Navigate to="/login" replace />;
  }

  return (
    <div className={`min-h-screen bg-gradient-to-br from-slate-900 via-purple-900 to-slate-900 flex ${theme}`}>
      {/* Animated background elements */}
      <div className="fixed inset-0 overflow-hidden pointer-events-none">
        {/* Floating stars */}
        {[...Array(100)].map((_, i) => (
          <motion.div
            key={i}
            className="absolute w-1 h-1 bg-white rounded-full"
            style={{
              left: `${Math.random() * 100}%`,
              top: `${Math.random() * 100}%`,
            }}
            animate={{
              opacity: [0.2, 0.8, 0.2],
              scale: [1, 1.5, 1],
            }}
            transition={{
              duration: 3 + Math.random() * 4,
              repeat: Infinity,
              delay: Math.random() * 5,
            }}
          />
        ))}
        
        {/* Floating geometric shapes */}
        {[...Array(20)].map((_, i) => (
          <motion.div
            key={i}
            className="absolute"
            style={{
              left: `${Math.random() * 100}%`,
              top: `${Math.random() * 100}%`,
            }}
            animate={{
              y: [0, -30, 0],
              x: [0, Math.random() * 20 - 10, 0],
              rotate: [0, 360],
              opacity: [0.1, 0.3, 0.1],
            }}
            transition={{
              duration: 8 + Math.random() * 4,
              repeat: Infinity,
              delay: Math.random() * 3,
            }}
          >
            <div className={`w-4 h-4 rounded-full ${
              i % 3 === 0 ? "bg-blue-400/20" : 
              i % 3 === 1 ? "bg-purple-400/20" : 
              "bg-pink-400/20"
            }`} />
          </motion.div>
        ))}
      </div>

      {/* Left Sidebar - Desktop Only */}
      <Sidebar />

      {/* Main content */}
      <div
        className={`flex-1 flex flex-col transition-all duration-500 ease-in-out ${
          !isMobile && sidebarOpen ? "ml-80" : !isMobile ? "ml-20" : "ml-0"
        }`}
      >
        {/* Header */}
        <Header />

        {/* Page content */}
        <main className="flex-1 relative z-10">
          <div className="py-6 px-4 sm:px-6 lg:px-8">
            <AnimatePresence mode="wait">
              <motion.div
                key={location.pathname}
                initial={{ opacity: 0, y: 20, scale: 0.98 }}
                animate={{ opacity: 1, y: 0, scale: 1 }}
                exit={{ opacity: 0, y: -20, scale: 0.98 }}
                transition={{ 
                  duration: 0.4,
                  type: "spring",
                  stiffness: 100,
                  damping: 20
                }}
              >
                <Outlet />
              </motion.div>
            </AnimatePresence>
          </div>
        </main>

        {/* Mobile Navigation */}
        <SidebarMobile />
      </div>
    </div>
  );
}