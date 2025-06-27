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
        {/* Subtle floating particles */}
        {[...Array(15)].map((_, i) => (
          <motion.div
            key={i}
            className="absolute w-2 h-2 bg-blue-400/10 rounded-full"
            style={{
              left: `${Math.random() * 100}%`,
              top: `${Math.random() * 100}%`,
            }}
            animate={{
              y: [0, -30, 0],
              x: [0, Math.random() * 20 - 10, 0],
              opacity: [0.1, 0.3, 0.1],
            }}
            transition={{
              duration: 8 + Math.random() * 4,
              repeat: Infinity,
              delay: Math.random() * 2,
            }}
          />
        ))}
      </div>

      {/* Left Sidebar */}
      <Sidebar />

      {/* Main content */}
      <div
        className={`flex-1 transition-all duration-300 ${
          !isMobile && sidebarOpen ? "ml-72" : !isMobile ? "ml-20" : ""
        } flex flex-col min-h-screen`}
      >
        {/* Header */}
        <Header />

        {/* Page content */}
        <main className="flex-1 py-6 px-4 sm:px-6 lg:px-8 relative z-10">
          <AnimatePresence mode="wait">
            <motion.div
              key={location.pathname}
              initial={{ opacity: 0, y: 20 }}
              animate={{ opacity: 1, y: 0 }}
              exit={{ opacity: 0, y: -20 }}
              transition={{ duration: 0.3 }}
              className="h-full"
            >
              <Outlet />
            </motion.div>
          </AnimatePresence>
        </main>

        {/* Mobile Navigation */}
        <SidebarMobile />
      </div>
    </div>
  );
}