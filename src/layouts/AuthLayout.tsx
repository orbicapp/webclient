import { motion } from "framer-motion";
import { Navigate, Outlet } from "react-router-dom";

import { useAuth } from "../hooks/use-auth";

export function AuthLayout() {
  const { isAuthenticated } = useAuth();

  // If already authenticated
  if (isAuthenticated) {
    return <Navigate to="/" replace />;
  }

  return (
    <motion.div
      className="min-h-screen"
      initial={{ opacity: 0 }}
      animate={{ opacity: 1 }}
      exit={{ opacity: 0 }}
      transition={{ duration: 0.3 }}
    >
      <Outlet />
    </motion.div>
  );
}