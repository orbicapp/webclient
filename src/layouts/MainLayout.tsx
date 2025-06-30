import { AnimatePresence, motion } from "framer-motion";
import { Navigate, Outlet, useLocation } from "react-router-dom";

import { Header } from "@/components/layout/Header";
import { Sidebar } from "@/components/layout/Sidebar";
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
    <div className={`min-h-screen bg-gray-50 dark:bg-gray-900 flex ${theme}`}>
      {/* Desktop Sidebar - ✅ STATIC - No AnimatePresence here */}
      {!isMobile && <Sidebar />}

      {/* Main content */}
      <div
        className={`flex-1 transition-all duration-300 ${
          !isMobile && sidebarOpen ? "ml-72" : !isMobile ? "ml-20" : "ml-0"
        }`}
      >
        {/* Header - ✅ STATIC - No AnimatePresence here */}
        <Header />

        {/* Page content - ✅ ONLY animate the page content, not the layout */}
        <main className={`${isMobile ? "pb-6" : ""}`}>
          <AnimatePresence mode="wait">
            <motion.div
              key={location.pathname}
              initial={{ opacity: 0, y: 20 }}
              animate={{ opacity: 1, y: 0 }}
              exit={{ opacity: 0, y: -20 }}
              transition={{ duration: 0.3 }}
              className="w-full"
            >
              <Outlet />
            </motion.div>
          </AnimatePresence>
        </main>
      </div>
    </div>
  );
}