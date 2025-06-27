import { motion } from "framer-motion";
import { BookOpen, Compass, Plus, Flame, Trophy, Zap } from "lucide-react";
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
          <Card 
            variant="gradient" 
            hoverable 
            className="group bg-gradient-to-br from-primary-500 via-primary-600 to-purple-700 text-white border-0 shadow-xl shadow-primary-500/25 hover:shadow-primary-500/40"
          >
            <div className="flex items-center justify-between">
              <div>
                <h3 className="text-lg font-bold text-white mb-2 group-hover:text-primary-100 transition-colors">
                  Explore Courses
                </h3>
                <p className="text-sm text-primary-100 group-hover:text-white transition-colors">
                  Discover new learning adventures
                </p>
              </div>
              <div className="p-3 bg-white/20 backdrop-blur-sm rounded-xl group-hover:scale-110 group-hover:bg-white/30 transition-all duration-300">
                <Compass className="w-6 h-6 text-white" />
              </div>
            </div>
            
            {/* Floating particles effect */}
            <div className="absolute inset-0 overflow-hidden rounded-2xl">
              <div className="absolute -top-2 -right-2 w-4 h-4 bg-white/20 rounded-full animate-bounce" style={{ animationDelay: '0s' }}></div>
              <div className="absolute top-1/2 -left-1 w-2 h-2 bg-white/30 rounded-full animate-bounce" style={{ animationDelay: '1s' }}></div>
              <div className="absolute -bottom-1 left-1/3 w-3 h-3 bg-white/20 rounded-full animate-bounce" style={{ animationDelay: '2s' }}></div>
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
          <Card 
            variant="gradient" 
            hoverable 
            className="group bg-gradient-to-br from-accent-500 via-orange-500 to-red-500 text-white border-0 shadow-xl shadow-accent-500/25 hover:shadow-accent-500/40"
          >
            <div className="flex items-center justify-between">
              <div>
                <h3 className="text-lg font-bold text-white mb-2 group-hover:text-accent-100 transition-colors">
                  Create Course
                </h3>
                <p className="text-sm text-accent-100 group-hover:text-white transition-colors">
                  Share your knowledge with others
                </p>
              </div>
              <div className="p-3 bg-white/20 backdrop-blur-sm rounded-xl group-hover:scale-110 group-hover:bg-white/30 transition-all duration-300">
                <Plus className="w-6 h-6 text-white" />
              </div>
            </div>
            
            {/* Glow effect */}
            <div className="absolute inset-0 bg-gradient-to-r from-transparent via-white/10 to-transparent -translate-x-full group-hover:translate-x-full transition-transform duration-1000 rounded-2xl"></div>
          </Card>
        </Link>
      </motion.div>

      {/* Stats Card */}
      <motion.div
        initial={{ opacity: 0, y: 20 }}
        animate={{ opacity: 1, y: 0 }}
        transition={{ delay: 0.3 }}
      >
        <Card 
          variant="gradient" 
          className="bg-gradient-to-br from-secondary-500 via-emerald-500 to-teal-600 text-white border-0 shadow-xl shadow-secondary-500/25"
        >
          <div className="flex items-center justify-between mb-4">
            <h3 className="text-lg font-bold text-white">
              Your Progress
            </h3>
            <div className="p-2 bg-white/20 backdrop-blur-sm rounded-lg">
              <Trophy className="w-5 h-5 text-white" />
            </div>
          </div>

          {statsLoading ? (
            <div className="space-y-3">
              <div className="h-4 bg-white/20 rounded animate-pulse"></div>
              <div className="h-4 bg-white/20 rounded animate-pulse w-3/4"></div>
              <div className="h-4 bg-white/20 rounded animate-pulse w-1/2"></div>
            </div>
          ) : stats ? (
            <div className="space-y-3">
              <div className="flex items-center justify-between p-2 bg-white/10 backdrop-blur-sm rounded-lg">
                <div className="flex items-center space-x-2">
                  <Flame className="w-4 h-4 text-orange-300" />
                  <span className="text-sm text-white/90">
                    Current Streak
                  </span>
                </div>
                <span className="font-bold text-white flex items-center">
                  {stats.currentStreak} 
                  <Zap className="w-3 h-3 ml-1 text-yellow-300" />
                </span>
              </div>

              <div className="flex items-center justify-between p-2 bg-white/10 backdrop-blur-sm rounded-lg">
                <div className="flex items-center space-x-2">
                  <Trophy className="w-4 h-4 text-yellow-300" />
                  <span className="text-sm text-white/90">
                    Best Streak
                  </span>
                </div>
                <span className="font-bold text-white">
                  {stats.longestStreak} days
                </span>
              </div>

              <div className="flex items-center justify-between p-2 bg-white/10 backdrop-blur-sm rounded-lg">
                <div className="flex items-center space-x-2">
                  <BookOpen className="w-4 h-4 text-blue-300" />
                  <span className="text-sm text-white/90">
                    Total XP
                  </span>
                </div>
                <span className="font-bold text-white">
                  {formatCompact(stats.totalScore)}
                </span>
              </div>
            </div>
          ) : (
            <div className="text-center py-4">
              <Zap className="w-8 h-8 text-white/60 mx-auto mb-2" />
              <p className="text-sm text-white/80">
                Start learning to see your stats!
              </p>
            </div>
          )}
        </Card>
      </motion.div>
    </div>
  );
}