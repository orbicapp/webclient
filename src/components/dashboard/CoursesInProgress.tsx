import { motion } from "framer-motion";
import { BookOpen, Clock, Star, ChevronRight, Play } from "lucide-react";
import { Link } from "react-router-dom";

import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/Card";
import ProgressRing from "@/components/ui/ProgressRing";
import { useCoursesWithProgress } from "@/hooks/use-progress";
import { formatCompact } from "@/lib/utils/class.utils";

export function CoursesInProgress() {
  const [loading, coursesWithProgress, error] = useCoursesWithProgress();

  if (loading) {
    return (
      <Card className="mb-8">
        <CardHeader>
          <CardTitle className="flex items-center space-x-2">
            <BookOpen className="w-5 h-5 text-primary-600" />
            <span>Continue Learning</span>
          </CardTitle>
        </CardHeader>
        <CardContent>
          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-4">
            {[1, 2, 3].map((i) => (
              <div key={i} className="animate-pulse">
                <div className="h-32 bg-gray-200 dark:bg-gray-700 rounded-xl"></div>
              </div>
            ))}
          </div>
        </CardContent>
      </Card>
    );
  }

  if (error) {
    return (
      <Card className="mb-8">
        <CardHeader>
          <CardTitle className="flex items-center space-x-2">
            <BookOpen className="w-5 h-5 text-primary-600" />
            <span>Continue Learning</span>
          </CardTitle>
        </CardHeader>
        <CardContent>
          <p className="text-center text-gray-500 dark:text-gray-400 py-8">
            Failed to load courses: {error}
          </p>
        </CardContent>
      </Card>
    );
  }

  if (coursesWithProgress.length === 0) {
    return (
      <Card className="mb-8">
        <CardHeader>
          <CardTitle className="flex items-center space-x-2">
            <BookOpen className="w-5 h-5 text-primary-600" />
            <span>Continue Learning</span>
          </CardTitle>
        </CardHeader>
        <CardContent>
          <div className="text-center py-12">
            <BookOpen className="w-16 h-16 text-gray-300 dark:text-gray-600 mx-auto mb-4" />
            <h3 className="text-lg font-medium text-gray-900 dark:text-gray-100 mb-2">
              No courses in progress
            </h3>
            <p className="text-gray-500 dark:text-gray-400 mb-6">
              Start your learning journey by exploring available courses
            </p>
            <Link
              to="/courses"
              className="inline-flex items-center px-4 py-2 bg-primary-600 text-white rounded-xl hover:bg-primary-700 transition-colors"
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
    <Card className="mb-8">
      <CardHeader>
        <CardTitle className="flex items-center justify-between">
          <div className="flex items-center space-x-2">
            <BookOpen className="w-5 h-5 text-primary-600" />
            <span>Continue Learning</span>
          </div>
          <span className="text-sm text-gray-500 dark:text-gray-400">
            {coursesWithProgress.length} course{coursesWithProgress.length !== 1 ? 's' : ''}
          </span>
        </CardTitle>
      </CardHeader>
      <CardContent>
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
                  <Card className="hover:shadow-card-hover transition-all duration-200 cursor-pointer group">
                    <CardContent className="p-4">
                      <div className="flex items-start justify-between mb-3">
                        <div className="flex-1">
                          <h3 className="font-semibold text-gray-900 dark:text-gray-100 mb-1 group-hover:text-primary-600 dark:group-hover:text-primary-400 transition-colors line-clamp-2">
                            {course.title}
                          </h3>
                          <p className="text-sm text-gray-500 dark:text-gray-400 capitalize">
                            {course.category}
                          </p>
                        </div>
                        <ProgressRing 
                          progress={progressPercentage} 
                          size={40} 
                          strokeWidth={3}
                        >
                          <span className="text-xs font-bold text-primary-600 dark:text-primary-400">
                            {progressPercentage}%
                          </span>
                        </ProgressRing>
                      </div>

                      <div className="space-y-2 mb-4">
                        <div className="flex items-center justify-between text-sm">
                          <div className="flex items-center space-x-1 text-gray-600 dark:text-gray-400">
                            <Play className="w-3 h-3" />
                            <span>Progress</span>
                          </div>
                          <span className="text-gray-900 dark:text-gray-100 font-medium">
                            {progress.completedLevels}/{progress.totalLevels} levels
                          </span>
                        </div>

                        <div className="flex items-center justify-between text-sm">
                          <div className="flex items-center space-x-1 text-gray-600 dark:text-gray-400">
                            <Star className="w-3 h-3" />
                            <span>Stars</span>
                          </div>
                          <span className="text-yellow-600 dark:text-yellow-400 font-medium">
                            {progress.totalStars}
                          </span>
                        </div>

                        <div className="flex items-center justify-between text-sm">
                          <div className="flex items-center space-x-1 text-gray-600 dark:text-gray-400">
                            <Clock className="w-3 h-3" />
                            <span>Time</span>
                          </div>
                          <span className="text-gray-900 dark:text-gray-100 font-medium">
                            {Math.round(progress.totalTimeSpent / 60)}m
                          </span>
                        </div>
                      </div>

                      <div className="flex items-center justify-between">
                        <div className="flex items-center space-x-1 text-sm text-primary-600 dark:text-primary-400">
                          <span className="font-medium">Continue</span>
                        </div>
                        <ChevronRight className="w-4 h-4 text-gray-400 group-hover:text-primary-600 dark:group-hover:text-primary-400 transition-colors" />
                      </div>
                    </CardContent>
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