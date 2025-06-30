import { motion } from "framer-motion";
import { AlertCircle, Lock, UserPlus, Mail, Eye, EyeOff, Sparkles, Rocket, User } from "lucide-react";
import { useState } from "react";
import { useForm } from "react-hook-form";
import { Link, useNavigate } from "react-router-dom";

import Button from "@/components/ui/Button";
import Input from "@/components/ui/Input";
import { useAuth } from "@/hooks/use-auth";
import { AuthService, RegisterUserInput } from "@/services/auth-service";
import { useSettingsStore } from "@/stores/settings-store";

export function RegisterPage() {
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
    watch,
  } = useForm<RegisterUserInput & { confirmPassword: string }>({
    defaultValues: {
      email: "",
      password: "",
      confirmPassword: "",
      displayName: "",
      username: "",
    },
  });

  const password = watch("password");

  const onSubmit = async (data: RegisterUserInput & { confirmPassword: string }) => {
    if (data.password !== data.confirmPassword) {
      setError("Passwords do not match");
      return;
    }

    setIsLoading(true);
    setError(null);
    clearError();

    try {
      const { confirmPassword, ...registerData } = data;
      const [sessionData, registerError] = await AuthService.register(registerData);

      if (registerError || !sessionData) {
        setError(registerError || "Registration failed");
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
      const errorMessage = err instanceof Error ? err.message : "Registration failed";
      setError(errorMessage);
    } finally {
      setIsLoading(false);
    }
  };

  return (
    <div className="relative min-h-screen overflow-hidden">
      {/* Animated Background */}
      <div className="absolute inset-0 bg-gradient-to-br from-secondary-50 via-primary-50 to-accent-50 dark:from-gray-900 dark:via-indigo-900 dark:to-purple-900">
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
                  ? "bg-secondary-400/20"
                  : i % 3 === 1
                  ? "bg-primary-400/20"
                  : "bg-accent-400/20"
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
        {/* Left Side - Registration Form */}
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
                  className="w-16 h-16 bg-gradient-to-br from-secondary-500 to-primary-500 rounded-2xl flex items-center justify-center mx-auto mb-4 shadow-lg shadow-secondary-500/25"
                  whileHover={{ scale: 1.05, rotate: 5 }}
                  transition={{ duration: 0.2 }}
                >
                  <UserPlus className="w-8 h-8 text-white" />
                </motion.div>
                
                <h2 className="text-3xl font-bold text-gray-900 dark:text-gray-100 mb-2">
                  Join Orbic!
                </h2>
                <p className="text-gray-600 dark:text-gray-400">
                  Create your account and start learning
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
                <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                  <Input
                    label="Display Name"
                    type="text"
                    placeholder="John Doe"
                    leftIcon={<User className="w-5 h-5" />}
                    error={errors.displayName?.message}
                    variant="glass"
                    {...register("displayName", {
                      required: "Display name is required",
                      minLength: {
                        value: 2,
                        message: "Display name must be at least 2 characters",
                      },
                    })}
                  />

                  <Input
                    label="Username"
                    type="text"
                    placeholder="johndoe"
                    leftIcon={<User className="w-5 h-5" />}
                    error={errors.username?.message}
                    variant="glass"
                    {...register("username", {
                      required: "Username is required",
                      minLength: {
                        value: 3,
                        message: "Username must be at least 3 characters",
                      },
                      pattern: {
                        value: /^[a-zA-Z0-9_]+$/,
                        message: "Username can only contain letters, numbers, and underscores",
                      },
                    })}
                  />
                </div>

                <Input
                  label="Email Address"
                  type="email"
                  placeholder="you@example.com"
                  leftIcon={<Mail className="w-5 h-5" />}
                  error={errors.email?.message}
                  variant="glass"
                  {...register("email", {
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
                      value: 8,
                      message: "Password must be at least 8 characters",
                    },
                    pattern: {
                      value: /^(?=.*[a-z])(?=.*[A-Z])(?=.*\d)/,
                      message: "Password must contain at least one uppercase letter, one lowercase letter, and one number",
                    },
                  })}
                />

                <Input
                  label="Confirm Password"
                  type={showPassword ? "text" : "password"}
                  placeholder="••••••••"
                  leftIcon={<Lock className="w-5 h-5" />}
                  error={errors.confirmPassword?.message}
                  variant="glass"
                  {...register("confirmPassword", {
                    required: "Please confirm your password",
                    validate: (value) =>
                      value === password || "Passwords do not match",
                  })}
                />

                <div className="flex items-start">
                  <input
                    type="checkbox"
                    className="w-4 h-4 mt-1 rounded border-gray-300 dark:border-gray-600 text-primary-600 focus:ring-primary-500 dark:bg-gray-700"
                    required
                  />
                  <span className="ml-2 text-sm text-gray-600 dark:text-gray-400">
                    I agree to the{" "}
                    <Link
                      to="/terms"
                      className="text-primary-600 hover:text-primary-500 dark:text-primary-400 dark:hover:text-primary-300 transition-colors"
                    >
                      Terms of Service
                    </Link>{" "}
                    and{" "}
                    <Link
                      to="/privacy"
                      className="text-primary-600 hover:text-primary-500 dark:text-primary-400 dark:hover:text-primary-300 transition-colors"
                    >
                      Privacy Policy
                    </Link>
                  </span>
                </div>

                <Button
                  type="submit"
                  fullWidth
                  isLoading={isLoading}
                  size="lg"
                  leftIcon={<UserPlus className="w-5 h-5" />}
                  className="bg-gradient-to-r from-secondary-600 via-primary-600 to-accent-600 hover:from-secondary-700 hover:via-primary-700 hover:to-accent-700 shadow-lg shadow-secondary-500/25 hover:shadow-secondary-500/40"
                >
                  {isLoading ? "Creating Account..." : "Create Account"}
                </Button>

                <div className="text-center">
                  <span className="text-gray-600 dark:text-gray-400">
                    Already have an account?{" "}
                  </span>
                  <Link
                    to="/login"
                    className="font-medium text-primary-600 hover:text-primary-500 dark:text-primary-400 dark:hover:text-primary-300 transition-colors"
                  >
                    Sign in
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
                <div className="w-8 h-8 bg-gradient-to-br from-secondary-500 to-primary-500 rounded-lg flex items-center justify-center">
                  <Rocket className="w-4 h-4 text-white" />
                </div>
                <span className="text-xl font-bold bg-gradient-to-r from-secondary-600 to-primary-600 bg-clip-text text-transparent">
                  Orbic
                </span>
              </motion.div>
            </div>
          </motion.div>
        </div>

        {/* Right Side - Branding */}
        <div className="hidden lg:flex lg:w-1/2 items-center justify-center p-12">
          <motion.div
            className="max-w-lg text-center"
            initial={{ opacity: 0, x: 50 }}
            animate={{ opacity: 1, x: 0 }}
            transition={{ duration: 0.8 }}
          >
            {/* Logo */}
            <motion.div
              className="relative mb-8"
              animate={{ 
                rotate: [0, -5, 5, 0],
                scale: [1, 1.05, 1]
              }}
              transition={{ 
                duration: 4,
                repeat: Infinity,
                ease: "easeInOut"
              }}
            >
              <div className="w-24 h-24 bg-gradient-to-br from-secondary-500 via-primary-500 to-accent-500 rounded-3xl flex items-center justify-center mx-auto shadow-2xl shadow-secondary-500/25">
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

            <h1 className="text-5xl font-bold bg-gradient-to-r from-secondary-600 via-primary-600 to-accent-600 bg-clip-text text-transparent mb-6">
              Start Your Journey
            </h1>
            
            <p className="text-xl text-gray-600 dark:text-gray-300 mb-8 leading-relaxed">
              Join thousands of learners who are already transforming their skills. 
              Create interactive courses, track progress, and achieve your goals.
            </p>

            <div className="space-y-4">
              <motion.div
                className="flex items-center space-x-4 p-4 bg-white/60 dark:bg-gray-800/60 backdrop-blur-lg rounded-2xl border border-white/20 dark:border-gray-700/20"
                whileHover={{ scale: 1.02, x: 5 }}
                transition={{ duration: 0.2 }}
              >
                <div className="w-12 h-12 bg-gradient-to-br from-secondary-500 to-primary-500 rounded-xl flex items-center justify-center">
                  <span className="text-white font-bold">1</span>
                </div>
                <div className="text-left">
                  <div className="font-semibold text-gray-900 dark:text-gray-100">
                    Create Your Profile
                  </div>
                  <div className="text-sm text-gray-600 dark:text-gray-400">
                    Set up your learning preferences
                  </div>
                </div>
              </motion.div>

              <motion.div
                className="flex items-center space-x-4 p-4 bg-white/60 dark:bg-gray-800/60 backdrop-blur-lg rounded-2xl border border-white/20 dark:border-gray-700/20"
                whileHover={{ scale: 1.02, x: 5 }}
                transition={{ duration: 0.2 }}
              >
                <div className="w-12 h-12 bg-gradient-to-br from-primary-500 to-accent-500 rounded-xl flex items-center justify-center">
                  <span className="text-white font-bold">2</span>
                </div>
                <div className="text-left">
                  <div className="font-semibold text-gray-900 dark:text-gray-100">
                    Explore Courses
                  </div>
                  <div className="text-sm text-gray-600 dark:text-gray-400">
                    Discover amazing learning content
                  </div>
                </div>
              </motion.div>

              <motion.div
                className="flex items-center space-x-4 p-4 bg-white/60 dark:bg-gray-800/60 backdrop-blur-lg rounded-2xl border border-white/20 dark:border-gray-700/20"
                whileHover={{ scale: 1.02, x: 5 }}
                transition={{ duration: 0.2 }}
              >
                <div className="w-12 h-12 bg-gradient-to-br from-accent-500 to-secondary-500 rounded-xl flex items-center justify-center">
                  <span className="text-white font-bold">3</span>
                </div>
                <div className="text-left">
                  <div className="font-semibold text-gray-900 dark:text-gray-100">
                    Start Learning
                  </div>
                  <div className="text-sm text-gray-600 dark:text-gray-400">
                    Begin your transformation journey
                  </div>
                </div>
              </motion.div>
            </div>
          </motion.div>
        </div>
      </div>
    </div>
  );
}