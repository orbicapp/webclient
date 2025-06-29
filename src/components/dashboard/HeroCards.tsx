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

      {/* Current Streak Card */}
      <motion.div
        initial={{ opacity: 0, y: 20 }}
        animate={{ opacity: 1, y: 0 }}
        transition={{ delay: 0.3 }}
      >
        <Card 
          variant="gradient" 
          className="bg-gradient-to-br from-secondary-500 via-emerald-500 to-teal-600 text-white border-0 shadow-xl shadow-secondary-500/25"
        >
          <div className="flex items-center justify-between">
            <div className="flex-1">
              {statsLoading ? (
                <div className="space-y-2">
                  <div className="h-6 bg-white/20 rounded animate-pulse"></div>
                  <div className="h-4 bg-white/20 rounded animate-pulse w-3/4"></div>
                </div>
              ) : stats ? (
                <>
                  {/* First Line: Current Streak */}
                  <div className="flex items-center space-x-2 mb-2">
                    <span className="text-lg font-bold text-white">
                      Current Streak:
                    </span>
                    <motion.span
                      className="text-2xl font-bold text-white flex items-center"
                      initial={{ scale: 0 }}
                      animate={{ scale: 1 }}
                      transition={{ delay: 0.5, type: "spring" }}
                    >
                      {stats.currentStreak}
                      <Zap className="w-5 h-5 ml-1 text-yellow-300" />
                    </motion.span>
                  </div>
                  
                  {/* Second Line: Best Streak */}
                  <div className="flex items-center space-x-2 text-white/90">
                    <Trophy className="w-4 h-4 text-yellow-300" />
                    <span className="text-sm">
                      Best Streak: {stats.longestStreak} days
                    </span>
                  </div>
                </>
              ) : (
                <div className="text-center">
                  <div className="text-lg font-bold text-white mb-2">
                    Start Learning!
                  </div>
                  <div className="text-sm text-white/80">
                    Build your streak
                  </div>
                </div>
              )}
            </div>
            
            <div className="p-2 bg-white/20 backdrop-blur-sm rounded-lg ml-4">
              <Flame className="w-5 h-5 text-white" />
            </div>
          </div>
        </Card>
      </motion.div>
    </div>
  );
}