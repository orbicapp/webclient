import { motion } from "framer-motion";
import { BookOpen, Compass, Plus, Flame, Trophy } from "lucide-react";
import { Link } from "react-router-dom";

import { Card } from "@/components/ui/Card";
import { useUserStats } from "@/hooks/use-stats";
import { formatCompact } from "@/lib/utils/class.utils";

export function HeroCards() {
  const [statsLoading, stats] = useUserStats();

  return (
    <div className="grid grid-cols-1 md:grid-cols-3 gap-6 mb-8">
      {/* Explore Courses Card */}
      <motion.div
        initial={{ opacity: 0, y: 20 }}
        animate={{ opacity: 1, y: 0 }}
        transition={{ delay: 0.1 }}
      >
        <Link to="/courses">
          <Card className="p-6 hover:shadow-card-hover transition-all duration-200 cursor-pointer group bg-gradient-to-br from-primary-50 to-primary-100 dark:from-primary-900/20 dark:to-primary-800/20 border border-primary-200 dark:border-primary-700">
            <div className="flex items-center justify-between">
              <div>
                <h3 className="text-lg font-semibold text-primary-900 dark:text-primary-100 mb-2">
                  Explore Courses
                </h3>
                <p className="text-sm text-primary-700 dark:text-primary-300">
                  Discover new learning adventures
                </p>
              </div>
              <div className="p-3 bg-primary-500 rounded-xl group-hover:scale-110 transition-transform duration-200">
                <Compass className="w-6 h-6 text-white" />
              </div>
            </div>
          </Card>
        </Link>
      </motion.div>

      {/* Create Course Card */}
      <motion.div
        initial={{ opacity: 0, y: 20 }}
        animate={{ opacity: 1, y: 0 }}
        transition={{ delay: 0.2 }}
      >
        <Link to="/courses/create">
          <Card className="p-6 hover:shadow-card-hover transition-all duration-200 cursor-pointer group bg-gradient-to-br from-accent-50 to-accent-100 dark:from-accent-900/20 dark:to-accent-800/20 border border-accent-200 dark:border-accent-700">
            <div className="flex items-center justify-between">
              <div>
                <h3 className="text-lg font-semibold text-accent-900 dark:text-accent-100 mb-2">
                  Create Course
                </h3>
                <p className="text-sm text-accent-700 dark:text-accent-300">
                  Share your knowledge with others
                </p>
              </div>
              <div className="p-3 bg-accent-500 rounded-xl group-hover:scale-110 transition-transform duration-200">
                <Plus className="w-6 h-6 text-white" />
              </div>
            </div>
          </Card>
        </Link>
      </motion.div>

      {/* Stats Card */}
      <motion.div
        initial={{ opacity: 0, y: 20 }}
        animate={{ opacity: 1, y: 0 }}
        transition={{ delay: 0.3 }}
      >
        <Card className="p-6 bg-gradient-to-br from-secondary-50 to-secondary-100 dark:from-secondary-900/20 dark:to-secondary-800/20 border border-secondary-200 dark:border-secondary-700">
          <div className="flex items-center justify-between mb-4">
            <h3 className="text-lg font-semibold text-secondary-900 dark:text-secondary-100">
              Your Progress
            </h3>
            <Trophy className="w-6 h-6 text-secondary-600 dark:text-secondary-400" />
          </div>

          {statsLoading ? (
            <div className="space-y-3">
              <div className="h-4 bg-secondary-200 dark:bg-secondary-700 rounded animate-pulse"></div>
              <div className="h-4 bg-secondary-200 dark:bg-secondary-700 rounded animate-pulse w-3/4"></div>
            </div>
          ) : stats ? (
            <div className="space-y-3">
              <div className="flex items-center justify-between">
                <div className="flex items-center space-x-2">
                  <Flame className="w-4 h-4 text-orange-500" />
                  <span className="text-sm text-secondary-700 dark:text-secondary-300">
                    Current Streak
                  </span>
                </div>
                <span className="font-bold text-secondary-900 dark:text-secondary-100">
                  {stats.currentStreak} days
                </span>
              </div>

              <div className="flex items-center justify-between">
                <div className="flex items-center space-x-2">
                  <Trophy className="w-4 h-4 text-yellow-500" />
                  <span className="text-sm text-secondary-700 dark:text-secondary-300">
                    Best Streak
                  </span>
                </div>
                <span className="font-bold text-secondary-900 dark:text-secondary-100">
                  {stats.longestStreak} days
                </span>
              </div>

              <div className="flex items-center justify-between">
                <div className="flex items-center space-x-2">
                  <BookOpen className="w-4 h-4 text-blue-500" />
                  <span className="text-sm text-secondary-700 dark:text-secondary-300">
                    Total XP
                  </span>
                </div>
                <span className="font-bold text-secondary-900 dark:text-secondary-100">
                  {formatCompact(stats.totalScore)}
                </span>
              </div>
            </div>
          ) : (
            <p className="text-sm text-secondary-600 dark:text-secondary-400">
              Start learning to see your stats!
            </p>
          )}
        </Card>
      </motion.div>
    </div>
  );
}
