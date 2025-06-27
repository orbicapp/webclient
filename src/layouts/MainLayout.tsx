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
    <div className={`min-h-screen bg-gray-50 dark:bg-gray-950 flex ${theme}`}>
      {/* Desktop Sidebar */}
      <Sidebar />

      {/* Main content */}
      <div
        className={`flex-1 transition-all duration-300 ${
          !isMobile && sidebarOpen ? "ml-72" : !isMobile ? "ml-20" : "ml-0"
        }`}
      >
        {/* Header */}
        <Header />

        {/* Page content */}
        <main className={`py-6 px-4 sm:px-6 lg:px-8 ${isMobile ? "pb-24" : ""}`}>
          <AnimatePresence mode="wait">
            <motion.div
              key={location.pathname}
              initial={{ opacity: 0, y: 20 }}
              animate={{ opacity: 1, y: 0 }}
              exit={{ opacity: 0, y: -20 }}
              transition={{ duration: 0.3 }}
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