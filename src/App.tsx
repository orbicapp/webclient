import { AnimatePresence, motion } from "framer-motion";
import { Loader2, Rocket } from "lucide-react";
import { Route, Routes, useLocation } from "react-router-dom";

import { useAuth } from "./hooks/use-auth";
import { AuthLayout } from "./layouts/AuthLayout";
import { MainLayout } from "./layouts/MainLayout";
import { DashboardPage } from "./pages/(app)/Dashboardage";
import { LoginPage } from "./pages/(auth)/LoginPage";
import { NotFoundPage } from "./pages/(misc)/NotFoundPage";

function App() {
  const location = useLocation();
  const { initialized, isLoading } = useAuth();

  // Load screen.
  if (!initialized || isLoading) {
    return (
      <motion.div
        className="min-h-screen bg-gradient-to-br from-primary-50 to-background flex items-center justify-center"
        initial={{ opacity: 0 }}
        animate={{ opacity: 1 }}
        exit={{ opacity: 0 }}
        transition={{ duration: 0.3 }}
      >
        <div className="text-center">
          <div className="h-16 w-16 flex items-center justify-center rounded-full bg-gradient-to-br from-primary-600 to-primary-800 p-2 mx-auto mb-4">
            <Rocket size={30} className="text-white" />
          </div>
          <h1 className="text-2xl font-bold text-primary-900 mb-2">Orbicat</h1>
          <div className="flex items-center justify-center space-x-2 text-gray-600">
            <Loader2 className="w-4 h-4 animate-spin" />
            <span>Loading...</span>
          </div>
        </div>
      </motion.div>
    );
  }

  return (
    <AnimatePresence mode="wait">
      <Routes location={location} key={location.pathname}>
        {/* Auth Routes */}
        <Route element={<AuthLayout />}>
          <Route path="/login" element={<LoginPage />} />
        </Route>

        {/* Main App Routes */}
        <Route element={<MainLayout />}>
          <Route path="/" element={<DashboardPage />} />
        </Route>

        {/* Catch-all Not Found Route */}
        <Route path="*" element={<NotFoundPage />} />
      </Routes>
    </AnimatePresence>
  );
}

export default App;
