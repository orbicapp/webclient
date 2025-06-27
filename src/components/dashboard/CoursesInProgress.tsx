import { motion } from "framer-motion";
import { BookOpen, Clock, Star, ChevronRight, Play, Zap, Target } from "lucide-react";
import { Link } from "react-router-dom";

import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/Card";
import ProgressRing from "@/components/ui/ProgressRing";
import Badge from "@/components/ui/Badge";
import CourseCard from "@/components/ui/CourseCard";
import { useCoursesWithProgress } from "@/hooks/use-progress";
import { formatCompact } from "@/lib/utils/class.utils";

export function CoursesInProgress() {
  const [loading, coursesWithProgress, error] = useCoursesWithProgress();

  if (loading) {
    return (
      <Card className="mb-8">
        <CardHeader>
          <CardTitle className="flex items-center space-x-2" gradient>
            <BookOpen className="w-5 h-5 text-primary-600" />
            <span>Continue Learning</span>
          </CardTitle>
        </CardHeader>
        <CardContent noPadding>
          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
            {[1, 2, 3].map((i) => (
              <div key={i} className="animate-pulse">
                <div className="h-64 bg-gradient-to-br from-gray-200 to-gray-300 dark:from-gray-700 dark:to-gray-800 rounded-2xl"></div>
              </div>
            ))}
          </div>
        </CardContent>
      </Card>
    );
  }

  if (error) {
    return (
      <Card className="mb-8" variant="gradient">
        <CardHeader>
          <CardTitle className="flex items-center space-x-2" gradient>
            <BookOpen className="w-5 h-5 text-primary-600" />
            <span>Continue Learning</span>
          </CardTitle>
        </CardHeader>
        <CardContent>
          <div className="text-center py-8">
            <div className="p-4 bg-error-100 dark:bg-error-900/20 rounded-xl inline-block mb-4">
              <BookOpen className="w-8 h-8 text-error-600 dark:text-error-400" />
            </div>
            <p className="text-error-600 dark:text-error-400">
              Failed to load courses: {error}
            </p>
          </div>
        </CardContent>
      </Card>
    );
  }

  if (coursesWithProgress.length === 0) {
    return (
      <Card className="mb-8" variant="gradient">
        <CardHeader>
          <CardTitle className="flex items-center space-x-2" gradient>
            <BookOpen className="w-5 h-5 text-primary-600" />
            <span>Continue Learning</span>
          </CardTitle>
        </CardHeader>
        <CardContent>
          <div className="text-center py-12">
            <div className="relative mb-6">
              <div className="w-20 h-20 bg-gradient-to-br from-primary-500 to-accent-500 rounded-full flex items-center justify-center mx-auto shadow-lg shadow-primary-500/25">
                <BookOpen className="w-10 h-10 text-white" />
              </div>
              <div className="absolute -top-2 -right-2 w-6 h-6 bg-accent-500 rounded-full flex items-center justify-center animate-bounce">
                <Zap className="w-3 h-3 text-white" />
              </div>
            </div>
            <h3 className="text-lg font-bold text-gray-900 dark:text-gray-100 mb-2">
              No courses in progress
            </h3>
            <p className="text-gray-500 dark:text-gray-400 mb-6">
              Start your learning journey by exploring available courses
            </p>
            <Link
              to="/courses"
              className="inline-flex items-center px-6 py-3 bg-gradient-to-r from-primary-600 to-accent-600 text-white rounded-xl hover:from-primary-700 hover:to-accent-700 transition-all duration-300 shadow-lg shadow-primary-500/25 hover:shadow-primary-500/40 hover:scale-105"
            >
              <BookOpen className="w-4 h-4 mr-2" />
              Explore Courses
            </Link>
          </div>
        </CardContent>
      </Card>
    );
  }

  return (
    <Card className="mb-8" variant="gradient">
      <CardHeader>
        <CardTitle className="flex items-center justify-between">
          <div className="flex items-center space-x-2">
            <div className="p-2 bg-primary-100 dark:bg-primary-900/30 rounded-lg">
              <BookOpen className="w-5 h-5 text-primary-600 dark:text-primary-400" />
            </div>
            <span className="bg-gradient-to-r from-primary-600 to-accent-600 bg-clip-text text-transparent font-bold">
              Continue Learning
            </span>
          </div>
          <Badge variant="gradient" size="sm">
            {coursesWithProgress.length} course{coursesWithProgress.length !== 1 ? 's' : ''}
          </Badge>
        </CardTitle>
      </CardHeader>
      <CardContent noPadding>
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
          {coursesWithProgress.map((item, index) => {
            const { course, progress } = item;
            const progressPercentage = progress.totalLevels > 0 
              ? Math.round((progress.completedLevels / progress.totalLevels) * 100)
              : 0;

            return (
              <motion.div
                key={course._id}
                initial={{ opacity: 0, y: 20 }}
                animate={{ opacity: 1, y: 0 }}
                transition={{ delay: index * 0.1 }}
                className="relative"
              >
                <CourseCard course={course} />
                
                {/* Progress Overlay */}
                <div className="absolute top-3 right-3">
                  <ProgressRing 
                    progress={progressPercentage} 
                    size={50} 
                    strokeWidth={4}
                    glow={progressPercentage > 75}
                    variant={progressPercentage > 50 ? "rainbow" : "default"}
                  >
                    <span className="text-xs font-bold text-white">
                      {progressPercentage}%
                    </span>
                  </ProgressRing>
                </div>

                {/* Progress Stats Overlay */}
                <div className="absolute bottom-4 left-4 right-4">
                  <div className="bg-black/60 backdrop-blur-sm rounded-lg p-3 border border-white/20">
                    <div className="grid grid-cols-3 gap-2 text-center">
                      <div>
                        <div className="text-xs text-gray-300">Levels</div>
                        <div className="text-sm font-bold text-white">
                          {progress.completedLevels}/{progress.totalLevels}
                        </div>
                      </div>
                      <div>
                        <div className="text-xs text-gray-300">Stars</div>
                        <div className="text-sm font-bold text-yellow-400 flex items-center justify-center">
                          <Star className="w-3 h-3 mr-1" />
                          {progress.totalStars}
                        </div>
                      </div>
                      <div>
                        <div className="text-xs text-gray-300">Time</div>
                        <div className="text-sm font-bold text-blue-400 flex items-center justify-center">
                          <Clock className="w-3 h-3 mr-1" />
                          {Math.round(progress.totalTimeSpent / 60)}m
                        </div>
                      </div>
                    </div>
                  </div>
                </div>

                {/* Achievement indicator */}
                {progressPercentage > 75 && (
                  <div className="absolute top-2 left-2">
                    <div className="w-8 h-8 bg-gradient-to-r from-yellow-400 to-orange-500 rounded-full flex items-center justify-center animate-pulse shadow-lg shadow-yellow-500/50">
                      <Zap className="w-4 h-4 text-white" />
                    </div>
                  </div>
                )}
              </motion.div>
            );
          })}
        </div>
      </CardContent>
    </Card>
  );
}