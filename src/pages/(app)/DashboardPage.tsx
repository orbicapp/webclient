import { motion } from "framer-motion";

import { HeroCards } from "@/components/dashboard/HeroCards";
import { CoursesInProgress } from "@/components/dashboard/CoursesInProgress";
import { MyCreatedCourses } from "@/components/dashboard/MyCreatedCourses";
import { useAuth } from "@/hooks/use-auth";

export function DashboardPage() {
  const { user } = useAuth();

  return (
    <div className="max-w-7xl mx-auto">
      {/* Welcome Header */}
      <motion.div
        className="mb-8"
        initial={{ opacity: 0, y: -20 }}
        animate={{ opacity: 1, y: 0 }}
        transition={{ duration: 0.5 }}
      >
        <h1 className="text-3xl font-bold text-gray-900 dark:text-gray-100 mb-2">
          Welcome back, {user?.displayName}! 👋
        </h1>
        <p className="text-gray-600 dark:text-gray-400">
          Ready to continue your learning journey?
        </p>
      </motion.div>

      {/* Hero Action Cards */}
      <HeroCards />

      {/* Courses in Progress */}
      <CoursesInProgress />

      {/* My Created Courses */}
      <MyCreatedCourses />
    </div>
  );
}