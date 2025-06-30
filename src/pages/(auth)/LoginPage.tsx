import { motion } from "framer-motion";
import { AlertCircle, Lock, LogIn, Mail, Eye, EyeOff, Sparkles, Rocket } from "lucide-react";
import { useState } from "react";
import { useForm } from "react-hook-form";
import { Link, useNavigate } from "react-router-dom";

import Button from "@/components/ui/Button";
import Input from "@/components/ui/Input";
import { useAuth } from "@/hooks/use-auth";
import { AuthService, LoginInput } from "@/services/auth-service";
import { useSettingsStore } from "@/stores/settings-store";

export function LoginPage() {
  const navigate = useNavigate();
  const { login, error: authError, clearError } = useAuth();
  const { theme, toggleTheme } = useSettingsStore();
  const [isLoading, setIsLoading] = useState(false);
  const [error, setError] = useState<string | null>(null);
  const [showPassword, setShowPassword] = useState(false);
  const displayError = error || authError;

  const {
    register,
    handleSubmit,
    formState: { errors },
  } = useForm<LoginInput>({
    defaultValues: {
      emailOrUsername: "",
      password: "",
    },
  });

  const onSubmit = async (data: LoginInput) => {
    setIsLoading(true);
    setError(null);
    clearError();

    try {
      const [sessionData, loginError] = await AuthService.login(data);

      if (loginError || !sessionData) {
        setError(loginError || "Login failed");
        return;
      }

      const { accessToken, refreshToken, sessionId, user } = sessionData;
      login({
        user,
        accessToken,
        refreshToken,
        sessionId,
      });

      navigate("/");
    } catch (err) {
      const errorMessage = err instanceof Error ? err.message : "Login failed";
      setError(errorMessage);
    } finally {
      setIsLoading(false);
    }
  };

  return (
    <div className="relative min-h-screen overflow-hidden">
      {/* Animated Background */}
      <div className="absolute inset-0 bg-gradient-to-br from-primary-50 via-accent-50 to-secondary-50 dark:from-gray-900 dark:via-purple-900 dark:to-indigo-900">
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
              duration: 5 + Math.random() * 5,
              repeat: Infinity,
              delay: Math.random() * 2,
            }}
          >
            <div
              className={`w-4 h-4 rounded-full ${
                i % 3 === 0
                  ? "bg-primary-400/20"
                  : i % 3 === 1
                  ? "bg-accent-400/20"
                  : "bg-secondary-400/20"
              }`}
            />
          </motion.div>
        ))}
      </div>

      {/* Theme Toggle Button */}
      <motion.button
        onClick={toggleTheme}
        className="fixed top-6 right-6 z-50 p-3 rounded-2xl bg-white/80 dark:bg-gray-800/80 backdrop-blur-lg border border-gray-200/50 dark:border-gray-700/50 text-gray-600 dark:text-gray-300 hover:text-primary-600 dark:hover:text-primary-400 transition-all duration-300 shadow-lg hover:shadow-xl"
        whileHover={{ scale: 1.05 }}
        whileTap={{ scale: 0.95 }}
        initial={{ opacity: 0, scale: 0 }}
        animate={{ opacity: 1, scale: 1 }}
        transition={{ delay: 0.5 }}
      >
        {theme === "dark" ? (
          <motion.div
            initial={{ rotate: -90, opacity: 0 }}
            animate={{ rotate: 0, opacity: 1 }}
            transition={{ duration: 0.3 }}
          >
            <Sparkles className="w-5 h-5" />
          </motion.div>
        ) : (
          <motion.div
            initial={{ rotate: 90, opacity: 0 }}
            animate={{ rotate: 0, opacity: 1 }}
            transition={{ duration: 0.3 }}
          >
            <Sparkles className="w-5 h-5" />
          </motion.div>
        )}
      </motion.button>

      {/* Main Content */}
      <div className="relative z-10 flex min-h-screen">
        {/* Left Side - Branding */}
        <div className="hidden lg:flex lg:w-1/2 items-center justify-center p-12">
          <motion.div
            className="max-w-lg text-center"
            initial={{ opacity: 0, x: -50 }}
            animate={{ opacity: 1, x: 0 }}
            transition={{ duration: 0.8 }}
          >
            {/* Logo */}
            <motion.div
              className="relative mb-8"
              animate={{ 
                rotate: [0, 5, -5, 0],
                scale: [1, 1.05, 1]
              }}
              transition={{ 
                duration: 4,
                repeat: Infinity,
                ease: "easeInOut"
              }}
            >
              <div className="w-24 h-24 bg-gradient-to-br from-primary-500 via-accent-500 to-secondary-500 rounded-3xl flex items-center justify-center mx-auto shadow-2xl shadow-primary-500/25">
                <Rocket className="w-12 h-12 text-white" />
              </div>
              
              {/* Floating sparkles */}
              {[...Array(6)].map((_, i) => (
                <motion.div
                  key={i}
                  className="absolute w-2 h-2 bg-yellow-400 rounded-full"
                  style={{
                    left: `${20 + Math.cos(i * 60 * Math.PI / 180) * 50}px`,
                    top: `${20 + Math.sin(i * 60 * Math.PI / 180) * 50}px`,
                  }}
                  animate={{
                    scale: [0, 1, 0],
                    opacity: [0, 1, 0],
                  }}
                  transition={{
                    duration: 2,
                    repeat: Infinity,
                    delay: i * 0.3,
                  }}
                />
              ))}
            </motion.div>

            <h1 className="text-5xl font-bold bg-gradient-to-r from-primary-600 via-accent-600 to-secondary-600 bg-clip-text text-transparent mb-6">
              Orbic
            </h1>
            
            <p className="text-xl text-gray-600 dark:text-gray-300 mb-8 leading-relaxed">
              Transform your learning journey with our interactive platform. 
              Discover, create, and master new skills through gamified experiences.
            </p>

            <div className="grid grid-cols-2 gap-4">
              <motion.div
                className="p-4 bg-white/60 dark:bg-gray-800/60 backdrop-blur-lg rounded-2xl border border-white/20 dark:border-gray-700/20"
                whileHover={{ scale: 1.02, y: -2 }}
                transition={{ duration: 0.2 }}
              >
                <div className="text-2xl font-bold text-primary-600 dark:text-primary-400 mb-1">
                  10K+
                </div>
                <div className="text-sm text-gray-600 dark:text-gray-400">
                  Active Learners
                </div>
              </motion.div>

              <motion.div
                className="p-4 bg-white/60 dark:bg-gray-800/60 backdrop-blur-lg rounded-2xl border border-white/20 dark:border-gray-700/20"
                whileHover={{ scale: 1.02, y: -2 }}
                transition={{ duration: 0.2 }}
              >
                <div className="text-2xl font-bold text-accent-600 dark:text-accent-400 mb-1">
                  500+
                </div>
                <div className="text-sm text-gray-600 dark:text-gray-400">
                  Courses
                </div>
              </motion.div>

              <motion.div
                className="p-4 bg-white/60 dark:bg-gray-800/60 backdrop-blur-lg rounded-2xl border border-white/20 dark:border-gray-700/20"
                whileHover={{ scale: 1.02, y: -2 }}
                transition={{ duration: 0.2 }}
              >
                <div className="text-2xl font-bold text-secondary-600 dark:text-secondary-400 mb-1">
                  95%
                </div>
                <div className="text-sm text-gray-600 dark:text-gray-400">
                  Success Rate
                </div>
              </motion.div>

              <motion.div
                className="p-4 bg-white/60 dark:bg-gray-800/60 backdrop-blur-lg rounded-2xl border border-white/20 dark:border-gray-700/20"
                whileHover={{ scale: 1.02, y: -2 }}
                transition={{ duration: 0.2 }}
              >
                <div className="text-2xl font-bold text-purple-600 dark:text-purple-400 mb-1">
                  24/7
                </div>
                <div className="text-sm text-gray-600 dark:text-gray-400">
                  Support
                </div>
              </motion.div>
            </div>
          </motion.div>
        </div>

        {/* Right Side - Login Form */}
        <div className="w-full lg:w-1/2 flex items-center justify-center p-6 lg:p-12">
          <motion.div
            className="w-full max-w-md"
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ duration: 0.6, delay: 0.2 }}
          >
            {/* Form Card */}
            <div className="bg-white/80 dark:bg-gray-800/80 backdrop-blur-xl rounded-3xl shadow-2xl border border-white/20 dark:border-gray-700/20 p-8">
              {/* Header */}
              <div className="text-center mb-8">
                <motion.div
                  className="w-16 h-16 bg-gradient-to-br from-primary-500 to-accent-500 rounded-2xl flex items-center justify-center mx-auto mb-4 shadow-lg shadow-primary-500/25"
                  whileHover={{ scale: 1.05, rotate: 5 }}
                  transition={{ duration: 0.2 }}
                >
                  <LogIn className="w-8 h-8 text-white" />
                </motion.div>
                
                <h2 className="text-3xl font-bold text-gray-900 dark:text-gray-100 mb-2">
                  Welcome Back!
                </h2>
                <p className="text-gray-600 dark:text-gray-400">
                  Sign in to continue your learning journey
                </p>
              </div>

              {/* Error Display */}
              {displayError && (
                <motion.div
                  className="mb-6 p-4 bg-red-50 dark:bg-red-900/20 rounded-2xl border border-red-200 dark:border-red-800 flex items-start space-x-3"
                  initial={{ opacity: 0, height: 0 }}
                  animate={{ opacity: 1, height: "auto" }}
                  exit={{ opacity: 0, height: 0 }}
                >
                  <AlertCircle className="w-5 h-5 text-red-600 dark:text-red-400 flex-shrink-0 mt-0.5" />
                  <p className="text-sm text-red-800 dark:text-red-200">{displayError}</p>
                </motion.div>
              )}

              {/* Form */}
              <form onSubmit={handleSubmit(onSubmit)} className="space-y-6">
                <Input
                  label="Email Address"
                  type="email"
                  placeholder="you@example.com"
                  leftIcon={<Mail className="w-5 h-5" />}
                  error={errors.emailOrUsername?.message}
                  variant="glass"
                  {...register("emailOrUsername", {
                    required: "Email is required",
                    pattern: {
                      value: /^[A-Z0-9._%+-]+@[A-Z0-9.-]+\.[A-Z]{2,}$/i,
                      message: "Invalid email address",
                    },
                  })}
                />

                <Input
                  label="Password"
                  type={showPassword ? "text" : "password"}
                  placeholder="••••••••"
                  leftIcon={<Lock className="w-5 h-5" />}
                  rightIcon={
                    <button
                      type="button"
                      onClick={() => setShowPassword(!showPassword)}
                      className="text-gray-500 hover:text-gray-700 dark:text-gray-400 dark:hover:text-gray-200 transition-colors"
                    >
                      {showPassword ? (
                        <EyeOff className="w-5 h-5" />
                      ) : (
                        <Eye className="w-5 h-5" />
                      )}
                    </button>
                  }
                  error={errors.password?.message}
                  variant="glass"
                  {...register("password", {
                    required: "Password is required",
                    minLength: {
                      value: 6,
                      message: "Password must be at least 6 characters",
                    },
                  })}
                />

                <div className="flex items-center justify-between">
                  <label className="flex items-center">
                    <input
                      type="checkbox"
                      className="w-4 h-4 rounded border-gray-300 dark:border-gray-600 text-primary-600 focus:ring-primary-500 dark:bg-gray-700"
                    />
                    <span className="ml-2 text-sm text-gray-600 dark:text-gray-400">
                      Remember me
                    </span>
                  </label>
                  <Link
                    to="/forgot-password"
                    className="text-sm font-medium text-primary-600 hover:text-primary-500 dark:text-primary-400 dark:hover:text-primary-300 transition-colors"
                  >
                    Forgot password?
                  </Link>
                </div>

                <Button
                  type="submit"
                  fullWidth
                  isLoading={isLoading}
                  size="lg"
                  leftIcon={<LogIn className="w-5 h-5" />}
                  className="bg-gradient-to-r from-primary-600 via-accent-600 to-secondary-600 hover:from-primary-700 hover:via-accent-700 hover:to-secondary-700 shadow-lg shadow-primary-500/25 hover:shadow-primary-500/40"
                >
                  {isLoading ? "Signing In..." : "Sign In"}
                </Button>

                <div className="text-center">
                  <span className="text-gray-600 dark:text-gray-400">
                    Don't have an account?{" "}
                  </span>
                  <Link
                    to="/register"
                    className="font-medium text-primary-600 hover:text-primary-500 dark:text-primary-400 dark:hover:text-primary-300 transition-colors"
                  >
                    Sign up
                  </Link>
                </div>
              </form>
            </div>

            {/* Mobile Logo */}
            <div className="lg:hidden text-center mt-8">
              <motion.div
                className="inline-flex items-center space-x-3"
                initial={{ opacity: 0 }}
                animate={{ opacity: 1 }}
                transition={{ delay: 0.8 }}
              >
                <div className="w-8 h-8 bg-gradient-to-br from-primary-500 to-accent-500 rounded-lg flex items-center justify-center">
                  <Rocket className="w-4 h-4 text-white" />
                </div>
                <span className="text-xl font-bold bg-gradient-to-r from-primary-600 to-accent-600 bg-clip-text text-transparent">
                  Orbic
                </span>
              </motion.div>
            </div>
          </motion.div>
        </div>
      </div>
    </div>
  );
}