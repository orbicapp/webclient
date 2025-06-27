import { motion } from "framer-motion";
import { BookOpen, Plus } from "lucide-react";
import { Link } from "react-router-dom";

import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/Card";
import Badge from "@/components/ui/Badge";
import CourseCard from "@/components/ui/CourseCard";
import { useCourseSearch } from "@/hooks/use-course";

export function MyCreatedCourses() {
  const [loading, results, error] = useCourseSearch("myCourses", {
    enabled: true,
    limit: 6,
    offset: 0,
  });

  if (loading) {
    return (
      <Card>
        <CardHeader>
          <CardTitle className="flex items-center space-x-2">
            <div className="p-2 bg-accent-100 dark:bg-accent-900/30 rounded-lg">
              <BookOpen className="w-5 h-5 text-accent-600 dark:text-accent-400" />
            </div>
            <span className="bg-gradient-to-r from-accent-600 to-orange-600 bg-clip-text text-transparent font-bold">
              My Created Courses
            </span>
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
      <Card>
        <CardHeader>
          <CardTitle className="flex items-center space-x-2">
            <div className="p-2 bg-accent-100 dark:bg-accent-900/30 rounded-lg">
              <BookOpen className="w-5 h-5 text-accent-600 dark:text-accent-400" />
            </div>
            <span className="bg-gradient-to-r from-accent-600 to-orange-600 bg-clip-text text-transparent font-bold">
              My Created Courses
            </span>
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

  const courses = results?.courses || [];

  if (courses.length === 0) {
    return (
      <Card variant="gradient">
        <CardHeader>
          <CardTitle className="flex items-center space-x-2">
            <div className="p-2 bg-accent-100 dark:bg-accent-900/30 rounded-lg">
              <BookOpen className="w-5 h-5 text-accent-600 dark:text-accent-400" />
            </div>
            <span className="bg-gradient-to-r from-accent-600 to-orange-600 bg-clip-text text-transparent font-bold">
              My Created Courses
            </span>
          </CardTitle>
        </CardHeader>
        <CardContent>
          <div className="text-center py-12">
            <div className="relative mb-6">
              <div className="w-20 h-20 bg-gradient-to-br from-accent-500 to-orange-500 rounded-full flex items-center justify-center mx-auto shadow-lg shadow-accent-500/25">
                <Plus className="w-10 h-10 text-white" />
              </div>
              <div className="absolute -top-2 -right-2 w-6 h-6 bg-orange-500 rounded-full flex items-center justify-center animate-bounce">
                <BookOpen className="w-3 h-3 text-white" />
              </div>
            </div>
            <h3 className="text-lg font-bold text-gray-900 dark:text-gray-100 mb-2">
              No courses created yet
            </h3>
            <p className="text-gray-500 dark:text-gray-400 mb-6">
              Share your knowledge by creating your first course
            </p>
            <Link
              to="/courses/create"
              className="inline-flex items-center px-6 py-3 bg-gradient-to-r from-accent-600 to-orange-600 text-white rounded-xl hover:from-accent-700 hover:to-orange-700 transition-all duration-300 shadow-lg shadow-accent-500/25 hover:shadow-accent-500/40 hover:scale-105"
            >
              <Plus className="w-4 h-4 mr-2" />
              Create Course
            </Link>
          </div>
        </CardContent>
      </Card>
    );
  }

  return (
    <Card variant="gradient">
      <CardHeader>
        <CardTitle className="flex items-center justify-between">
          <div className="flex items-center space-x-2">
            <div className="p-2 bg-accent-100 dark:bg-accent-900/30 rounded-lg">
              <BookOpen className="w-5 h-5 text-accent-600 dark:text-accent-400" />
            </div>
            <span className="bg-gradient-to-r from-accent-600 to-orange-600 bg-clip-text text-transparent font-bold">
              My Created Courses
            </span>
          </div>
          <div className="flex items-center space-x-3">
            <Badge variant="gradient" size="sm">
              {courses.length} course{courses.length !== 1 ? 's' : ''}
            </Badge>
            <Link
              to="/courses/create"
              className="inline-flex items-center px-3 py-1.5 bg-gradient-to-r from-accent-600 to-orange-600 text-white text-sm rounded-lg hover:from-accent-700 hover:to-orange-700 transition-all duration-300 shadow-lg shadow-accent-500/25 hover:scale-105"
            >
              <Plus className="w-3 h-3 mr-1" />
              Create New
            </Link>
          </div>
        </CardTitle>
      </CardHeader>
      <CardContent noPadding>
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
          {courses.map((course, index) => (
            <motion.div
              key={course._id}
              initial={{ opacity: 0, y: 20 }}
              animate={{ opacity: 1, y: 0 }}
              transition={{ delay: index * 0.1 }}
            >
              <CourseCard course={course} />
            </motion.div>
          ))}
        </div>

        {results && results.hasMore && (
          <div className="text-center mt-8">
            <Link
              to="/my-courses"
              className="inline-flex items-center px-6 py-3 bg-gradient-to-r from-accent-600 to-orange-600 text-white rounded-xl hover:from-accent-700 hover:to-orange-700 transition-all duration-300 shadow-lg shadow-accent-500/25 hover:scale-105"
            >
              View All Courses →
            </Link>
          </div>
        )}
      </CardContent>
    </Card>
  );
}