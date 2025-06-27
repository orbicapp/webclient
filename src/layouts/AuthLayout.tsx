import { motion } from "framer-motion";
import { Rocket } from "lucide-react";
import { Navigate, Outlet } from "react-router-dom";

import { useAuth } from "../hooks/use-auth";

export function AuthLayout() {
  const { isAuthenticated, error } = useAuth();

  // If already authenticated
  if (isAuthenticated) {
    return <Navigate to="/" replace />;
  }

  return (
    <motion.div
      className="min-h-screen bg-gradient-to-br from-primary-50 to-background flex flex-col"
      initial={{ opacity: 0 }}
      animate={{ opacity: 1 }}
      exit={{ opacity: 0 }}
      transition={{ duration: 0.3 }}
    >
      <div className="flex flex-1">
        <div className="flex flex-1 flex-col justify-center py-12 px-4 sm:px-6 lg:flex-none lg:px-20 xl:px-24">
          <div className="mx-auto w-full max-w-sm lg:w-96">
            <div className="flex justify-center mb-8">
              <div className="h-16 w-16 flex items-center justify-center rounded-full bg-gradient-to-br from-primary-600 to-primary-800 p-2">
                <Rocket size={30} className="text-white" />
              </div>
            </div>
            <div className="text-center mb-8">
              <motion.h1
                className="text-3xl font-bold tracking-tight text-primary-900"
                initial={{ y: -20, opacity: 0 }}
                animate={{ y: 0, opacity: 1 }}
                transition={{ delay: 0.1, duration: 0.5 }}
              >
                Orbic
              </motion.h1>
              <motion.p
                className="mt-2 text-sm text-gray-600"
                initial={{ y: -10, opacity: 0 }}
                animate={{ y: 0, opacity: 1 }}
                transition={{ delay: 0.2, duration: 0.5 }}
              >
                Interactive Learning Platform
              </motion.p>
            </div>

            {/* Mostrar error si existe */}
            {error && (
              <motion.div
                className="mb-4 p-3 bg-red-50 text-red-800 rounded-lg text-center text-sm"
                initial={{ opacity: 0, height: 0 }}
                animate={{ opacity: 1, height: "auto" }}
                exit={{ opacity: 0, height: 0 }}
              >
                {error}
              </motion.div>
            )}

            <motion.div
              initial={{ y: 20, opacity: 0 }}
              animate={{ y: 0, opacity: 1 }}
              transition={{ delay: 0.3, duration: 0.5 }}
            >
              <Outlet />
            </motion.div>
          </div>
        </div>

        <div className="hidden lg:block relative w-0 flex-1 bg-gradient-to-br from-primary-600 to-primary-800">
          <div className="absolute inset-0 flex items-center justify-center p-12">
            <motion.div
              className="max-w-2xl"
              initial={{ scale: 0.9, opacity: 0 }}
              animate={{ scale: 1, opacity: 1 }}
              transition={{ delay: 0.4, duration: 0.5 }}
            >
              <div className="bg-white/10 backdrop-blur-lg rounded-3xl p-8 shadow-2xl">
                <h2 className="text-2xl font-bold text-white mb-4">
                  Welcome to Orbic!
                </h2>
                <p className="text-white/90 mb-6">
                  Embark on a journey of discovery with our gamified learning
                  platform. Master new skills, earn rewards, and track your
                  progress in a fun, interactive environment.
                </p>
                <div className="grid grid-cols-2 gap-4 mb-6">
                  <div className="bg-white/10 rounded-xl p-4">
                    <div className="text-white font-bold mb-2">
                      Interactive Learning
                    </div>
                    <p className="text-white/80 text-sm">
                      Engage with content through games and challenges
                    </p>
                  </div>
                  <div className="bg-white/10 rounded-xl p-4">
                    <div className="text-white font-bold mb-2">
                      Track Progress
                    </div>
                    <p className="text-white/80 text-sm">
                      Monitor your growth with detailed statistics
                    </p>
                  </div>
                  <div className="bg-white/10 rounded-xl p-4">
                    <div className="text-white font-bold mb-2">
                      Earn Rewards
                    </div>
                    <p className="text-white/80 text-sm">
                      Gain XP and coins as you complete levels
                    </p>
                  </div>
                  <div className="bg-white/10 rounded-xl p-4">
                    <div className="text-white font-bold mb-2">
                      Learn Anywhere
                    </div>
                    <p className="text-white/80 text-sm">
                      Access your courses on any device, anytime
                    </p>
                  </div>
                </div>
              </div>
            </motion.div>
          </div>
        </div>
      </div>
    </motion.div>
  );
}
