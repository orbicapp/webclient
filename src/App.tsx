import { AnimatePresence, motion } from "framer-motion";
import { Loader2, Rocket, AlertTriangle, RefreshCw, Wifi, WifiOff } from "lucide-react";
import { Route, Routes, useLocation, useNavigate } from "react-router-dom";
import { useEffect } from "react";

import { useAuth } from "./hooks/use-auth";
import { useCurrentGameSession } from "./hooks/use-game";
import { useEmailVerification } from "./hooks/use-email-verification";
import { AuthLayout } from "./layouts/AuthLayout";
import { MainLayout } from "./layouts/MainLayout";
import { DashboardPage } from "./pages/(app)/DashboardPage";
import { MyCoursesPage } from "./pages/(app)/MyCoursesPage";
import { ProfilePage } from "./pages/(app)/ProfilePage";
import { SettingsPage } from "./pages/(app)/SettingsPage";
import { LoginPage } from "./pages/(auth)/LoginPage";
import { RegisterPage } from "./pages/(auth)/RegisterPage";
import { NotFoundPage } from "./pages/(misc)/NotFoundPage";
import CourseDetailPage from "./pages/(app)/(courses)/CourseDetailPage";
import { CourseListPage } from "./pages/(app)/(courses)/CourseListPage.tsx";
import { CreateCoursePage } from "./pages/(app)/(courses)/CreateCoursePage";
import { GameSessionPage } from "./pages/(app)/(game)/GameSessionPage";
import { EmailVerificationModal } from "./components/modals/EmailVerificationModal";
import Button from "./components/ui/Button";

function App() {
  const location = useLocation();
  const navigate = useNavigate();
  const { initialized, isLoading, error, isConnectionError, retryConnection, isAuthenticated, user } = useAuth();
  
  // ✅ Email verification modal
  const { shouldShowModal, hideModal, handleVerified } = useEmailVerification();
  
  // ✅ Fetch game session on app initialization
  const [sessionLoading, currentSession] = useCurrentGameSession();

  // ✅ Navigate to game session if one exists and user is authenticated
  useEffect(() => {
    if (
      isAuthenticated && 
      !sessionLoading && 
      currentSession && 
      location.pathname !== "/game"
    ) {
      console.log("Active game session found, navigating to game:", currentSession);
      navigate("/game");
    }
  }, [isAuthenticated, sessionLoading, currentSession, location.pathname, navigate]);

  // Connection error screen
  if (isConnectionError && error) {
    return (
      <div className="min-h-screen bg-gradient-to-br from-red-50 to-orange-50 dark:from-red-950 dark:to-orange-950 flex items-center justify-center p-4">
        <div className="max-w-md w-full">
          <div className="bg-white dark:bg-gray-800 rounded-2xl shadow-2xl p-8 text-center border border-red-200 dark:border-red-800">
            {/* Connection Error Icon */}
            <div className="w-20 h-20 bg-red-100 dark:bg-red-900/30 rounded-full flex items-center justify-center mx-auto mb-6">
              <WifiOff className="w-10 h-10 text-red-600 dark:text-red-400" />
            </div>

            {/* Error Title */}
            <h1 className="text-2xl font-bold text-gray-900 dark:text-gray-100 mb-4">
              Connection Failed
            </h1>

            {/* Error Message */}
            <p className="text-gray-600 dark:text-gray-400 mb-8 leading-relaxed">
              {error}
            </p>

            {/* Retry Button */}
            <Button
              onClick={retryConnection}
              variant="primary"
              size="lg"
              fullWidth
              leftIcon={<RefreshCw className="w-5 h-5" />}
              className="mb-4"
            >
              Retry Connection
            </Button>

            {/* Help Text */}
            <p className="text-sm text-gray-500 dark:text-gray-400">
              If the problem persists, please check your internet connection or contact support.
            </p>
          </div>
        </div>
      </div>
    );
  }

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
          <h1 className="text-2xl font-bold text-primary-900 mb-2">Orbic</h1>
          <div className="flex items-center justify-center space-x-2 text-gray-600">
            <Loader2 className="w-4 h-4 animate-spin" />
            <span>Loading...</span>
          </div>
          
          {/* Show additional loading info if checking for game session */}
          {isAuthenticated && sessionLoading && (
            <div className="mt-4 text-sm text-gray-500">
              Checking for active game session...
            </div>
          )}
        </div>
      </motion.div>
    );
  }

  return (
    <>
      <AnimatePresence mode="wait">
        <Routes location={location} key={location.pathname}>
          {/* Auth Routes */}
          <Route element={<AuthLayout />}>
            <Route path="/login" element={<LoginPage />} />
            <Route path="/register" element={<RegisterPage />} />
          </Route>

          {/* Main App Routes */}
          <Route element={<MainLayout />}>
            <Route path="/" element={<DashboardPage />} />
            <Route path="/my-courses" element={<MyCoursesPage />} />
            <Route path="/profile" element={<ProfilePage />} />
            <Route path="/courses" element={<CourseListPage />} />
            <Route path="/courses/create" element={<CreateCoursePage />} />
            <Route path="/course/:courseId" element={<CourseDetailPage />} />
            <Route path="/settings" element={<SettingsPage />} />
          </Route>

          {/* Game Session Route (Full Screen) */}
          <Route path="/game" element={<GameSessionPage />} />

          {/* Catch-all Not Found Route */}
          <Route path="*" element={<NotFoundPage />} />
        </Routes>
      </AnimatePresence>

      {/* Email Verification Modal */}
      <EmailVerificationModal
        isOpen={shouldShowModal}
        onClose={hideModal}
        onVerified={handleVerified}
        userEmail={user?.email || ""}
      />
    </>
  );
}

export default App;