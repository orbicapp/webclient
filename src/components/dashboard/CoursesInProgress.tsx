import { motion } from "framer-motion";
import { BookOpen, Clock, Star, ChevronRight, Play, Zap, Target } from "lucide-react";
import { Link } from "react-router-dom";

import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/Card";
import ProgressRing from "@/components/ui/ProgressRing";
import Badge from "@/components/ui/Badge";
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
          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-4">
            {[1, 2, 3].map((i) => (
              <div key={i} className="animate-pulse">
                <div className="h-40 bg-gradient-to-br from-gray-200 to-gray-300 dark:from-gray-700 dark:to-gray-800 rounded-xl"></div>
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
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-4">
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
              >
                <Link to={`/course/${course._id}`}>
                  <Card 
                    hoverable 
                    variant="gradient"
                    className="group bg-gradient-to-br from-white via-gray-50 to-primary-50 dark:from-gray-800 dark:via-gray-800 dark:to-primary-900/20 border border-primary-200/50 dark:border-primary-700/30 shadow-lg hover:shadow-xl hover:shadow-primary-500/10"
                  >
                    <div className="relative overflow-hidden">
                      {/* Progress indicator at top */}
                      <div className="h-1 bg-gray-200 dark:bg-gray-700">
                        <motion.div 
                          className="h-full bg-gradient-to-r from-primary-500 to-accent-500"
                          initial={{ width: 0 }}
                          animate={{ width: `${progressPercentage}%` }}
                          transition={{ duration: 1, delay: index * 0.1 + 0.5 }}
                        />
                      </div>

                      <div className="p-4">
                        <div className="flex items-start justify-between mb-4">
                          <div className="flex-1">
                            <h3 className="font-bold text-gray-900 dark:text-gray-100 mb-1 group-hover:text-primary-600 dark:group-hover:text-primary-400 transition-colors line-clamp-2">
                              {course.title}
                            </h3>
                            <Badge variant="outline" size="sm" className="capitalize">
                              {course.category}
                            </Badge>
                          </div>
                          <ProgressRing 
                            progress={progressPercentage} 
                            size={50} 
                            strokeWidth={4}
                            glow={progressPercentage > 75}
                            variant={progressPercentage > 50 ? "rainbow" : "default"}
                          >
                            <span className="text-xs font-bold text-primary-600 dark:text-primary-400">
                              {progressPercentage}%
                            </span>
                          </ProgressRing>
                        </div>

                        <div className="space-y-3 mb-4">
                          <div className="flex items-center justify-between p-2 bg-gray-100 dark:bg-gray-700/50 rounded-lg">
                            <div className="flex items-center space-x-2 text-gray-600 dark:text-gray-400">
                              <Target className="w-3 h-3" />
                              <span className="text-xs font-medium">Progress</span>
                            </div>
                            <span className="text-xs text-gray-900 dark:text-gray-100 font-bold">
                              {progress.completedLevels}/{progress.totalLevels} levels
                            </span>
                          </div>

                          <div className="grid grid-cols-2 gap-2">
                            <div className="flex items-center justify-between p-2 bg-yellow-50 dark:bg-yellow-900/20 rounded-lg">
                              <Star className="w-3 h-3 text-yellow-600 dark:text-yellow-400" />
                              <span className="text-xs text-yellow-800 dark:text-yellow-300 font-bold">
                                {progress.totalStars}
                              </span>
                            </div>

                            <div className="flex items-center justify-between p-2 bg-blue-50 dark:bg-blue-900/20 rounded-lg">
                              <Clock className="w-3 h-3 text-blue-600 dark:text-blue-400" />
                              <span className="text-xs text-blue-800 dark:text-blue-300 font-bold">
                                {Math.round(progress.totalTimeSpent / 60)}m
                              </span>
                            </div>
                          </div>
                        </div>

                        <div className="flex items-center justify-between p-3 bg-gradient-to-r from-primary-50 to-accent-50 dark:from-primary-900/20 dark:to-accent-900/20 rounded-lg group-hover:from-primary-100 group-hover:to-accent-100 dark:group-hover:from-primary-800/30 dark:group-hover:to-accent-800/30 transition-all duration-300">
                          <div className="flex items-center space-x-2">
                            <Play className="w-4 h-4 text-primary-600 dark:text-primary-400" />
                            <span className="text-sm font-semibold text-primary-700 dark:text-primary-300">
                              Continue
                            </span>
                          </div>
                          <ChevronRight className="w-4 h-4 text-primary-500 group-hover:text-primary-700 dark:group-hover:text-primary-300 transition-colors group-hover:translate-x-1" />
                        </div>
                      </div>

                      {/* Floating achievement indicator */}
                      {progressPercentage > 75 && (
                        <div className="absolute top-2 right-2">
                          <div className="w-6 h-6 bg-gradient-to-r from-yellow-400 to-orange-500 rounded-full flex items-center justify-center animate-pulse">
                            <Zap className="w-3 h-3 text-white" />
                          </div>
                        </div>
                      )}
                    </div>
                  </Card>
                </Link>
              </motion.div>
            );
          })}
        </div>
      </CardContent>
    </Card>
  );
}