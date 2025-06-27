import { motion } from "framer-motion";
import { AlertCircle, Lock, LogIn, Mail } from "lucide-react";
import { useState } from "react";
import { useForm } from "react-hook-form";
import { Link, useNavigate } from "react-router-dom";

import Button from "@/components/ui/Button";
import Input from "@/components/ui/Input";
import { useAuth } from "@/hooks/use-auth";
import { AuthService, LoginInput } from "@/services/auth-service";

export function LoginPage() {
  const navigate = useNavigate();
  const { login, error: authError, clearError } = useAuth();
  const [isLoading, setIsLoading] = useState(false);
  const [error, setError] = useState<string | null>(null);
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
    <motion.div
      initial={{ opacity: 0, y: 10 }}
      animate={{ opacity: 1, y: 0 }}
      transition={{ duration: 0.3 }}
    >
      <div className="text-center mb-6">
        <h2 className="text-2xl font-bold text-text-primary">Welcome Back!</h2>
        <p className="mt-1 text-sm text-text-secondary">
          Sign in to continue your learning journey
        </p>
      </div>

      {displayError && (
        <motion.div
          className="mb-4 p-3 bg-error-50 text-error-800 rounded-lg flex items-center"
          initial={{ opacity: 0, height: 0 }}
          animate={{ opacity: 1, height: "auto" }}
          exit={{ opacity: 0, height: 0 }}
        >
          <AlertCircle className="w-5 h-5 mr-2 flex-shrink-0" />
          <p className="text-sm">{displayError}</p>
        </motion.div>
      )}

      <form onSubmit={handleSubmit(onSubmit)} className="space-y-4">
        <Input
          label="Email Address"
          type="email"
          id="email"
          placeholder="you@example.com"
          leftIcon={<Mail className="w-5 h-5" />}
          error={errors.emailOrUsername?.message}
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
          type="password"
          id="password"
          placeholder="••••••••"
          leftIcon={<Lock className="w-5 h-5" />}
          error={errors.password?.message}
          {...register("password", {
            required: "Password is required",
            minLength: {
              value: 6,
              message: "Password must be at least 6 characters",
            },
          })}
        />

        <div className="flex items-center justify-between">
          <div className="flex items-center">
            <input
              id="remember-me"
              name="remember-me"
              type="checkbox"
              className="h-4 w-4 rounded border-gray-300 text-primary-600 focus:ring-primary-500"
            />
            <label
              htmlFor="remember-me"
              className="ml-2 block text-sm text-text-secondary"
            >
              Remember me
            </label>
          </div>
          <Link
            to="/forgot-password"
            className="text-sm font-medium text-primary-600 hover:text-primary-500"
          >
            Forgot password?
          </Link>
        </div>

        <Button
          type="submit"
          fullWidth
          isLoading={isLoading}
          leftIcon={<LogIn className="w-5 h-5" />}
        >
          Sign In
        </Button>

        <div className="mt-4 text-center text-sm text-text-secondary">
          Don't have an account?{" "}
          <Link
            to="/register"
            className="font-medium text-primary-600 hover:text-primary-500"
          >
            Sign up
          </Link>
        </div>

        {/* Demo login info */}
        <div className="mt-4 border border-dashed border-gray-300 p-3 rounded-lg">
          <p className="text-xs text-center text-text-secondary mb-1">
            <strong>Demo Access</strong>
          </p>
          <p className="text-xs text-center text-text-muted">
            Email: user@example.com
            <br />
            Password: password
          </p>
        </div>
      </form>
    </motion.div>
  );
}
