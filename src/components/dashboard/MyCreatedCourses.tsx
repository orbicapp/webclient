import { motion } from "framer-motion";
import { BookOpen, Users, Eye, Settings, Plus } from "lucide-react";
import { Link } from "react-router-dom";

import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/Card";
import Badge from "@/components/ui/Badge";
import { useCourseSearch } from "@/hooks/use-course";
import { formatDate } from "@/lib/utils/class.utils";

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
            <BookOpen className="w-5 h-5 text-accent-600" />
            <span>My Created Courses</span>
          </CardTitle>
        </CardHeader>
        <CardContent>
          <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
            {[1, 2, 3, 4].map((i) => (
              <div key={i} className="animate-pulse">
                <div className="h-24 bg-gray-200 dark:bg-gray-700 rounded-xl"></div>
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
            <BookOpen className="w-5 h-5 text-accent-600" />
            <span>My Created Courses</span>
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

  const courses = results?.courses || [];

  if (courses.length === 0) {
    return (
      <Card>
        <CardHeader>
          <CardTitle className="flex items-center space-x-2">
            <BookOpen className="w-5 h-5 text-accent-600" />
            <span>My Created Courses</span>
          </CardTitle>
        </CardHeader>
        <CardContent>
          <div className="text-center py-12">
            <Plus className="w-16 h-16 text-gray-300 dark:text-gray-600 mx-auto mb-4" />
            <h3 className="text-lg font-medium text-gray-900 dark:text-gray-100 mb-2">
              No courses created yet
            </h3>
            <p className="text-gray-500 dark:text-gray-400 mb-6">
              Share your knowledge by creating your first course
            </p>
            <Link
              to="/courses/create"
              className="inline-flex items-center px-4 py-2 bg-accent-600 text-white rounded-xl hover:bg-accent-700 transition-colors"
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
    <Card>
      <CardHeader>
        <CardTitle className="flex items-center justify-between">
          <div className="flex items-center space-x-2">
            <BookOpen className="w-5 h-5 text-accent-600" />
            <span>My Created Courses</span>
          </div>
          <div className="flex items-center space-x-2">
            <span className="text-sm text-gray-500 dark:text-gray-400">
              {courses.length} course{courses.length !== 1 ? 's' : ''}
            </span>
            <Link
              to="/courses/create"
              className="text-sm text-accent-600 hover:text-accent-700 dark:text-accent-400 dark:hover:text-accent-300 font-medium"
            >
              Create New
            </Link>
          </div>
        </CardTitle>
      </CardHeader>
      <CardContent>
        <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
          {courses.map((course, index) => (
            <motion.div
              key={course._id}
              initial={{ opacity: 0, y: 20 }}
              animate={{ opacity: 1, y: 0 }}
              transition={{ delay: index * 0.1 }}
            >
              <Card className="hover:shadow-card-hover transition-all duration-200 cursor-pointer group">
                <CardContent className="p-4">
                  <div className="flex items-start justify-between mb-3">
                    <div className="flex-1">
                      <h3 className="font-semibold text-gray-900 dark:text-gray-100 mb-1 group-hover:text-accent-600 dark:group-hover:text-accent-400 transition-colors line-clamp-2">
                        {course.title}
                      </h3>
                      <p className="text-sm text-gray-500 dark:text-gray-400 capitalize">
                        {course.category}
                      </p>
                    </div>
                    <Badge 
                      variant={course.visibility === 'public' ? 'success' : course.visibility === 'private' ? 'secondary' : 'warning'}
                      size="sm"
                    >
                      {course.visibility}
                    </Badge>
                  </div>

                  <div className="space-y-2 mb-4">
                    <div className="flex items-center justify-between text-sm">
                      <div className="flex items-center space-x-1 text-gray-600 dark:text-gray-400">
                        <BookOpen className="w-3 h-3" />
                        <span>Chapters</span>
                      </div>
                      <span className="text-gray-900 dark:text-gray-100 font-medium">
                        {course.chaptersCount}
                      </span>
                    </div>

                    <div className="flex items-center justify-between text-sm">
                      <div className="flex items-center space-x-1 text-gray-600 dark:text-gray-400">
                        <Users className="w-3 h-3" />
                        <span>Language</span>
                      </div>
                      <span className="text-gray-900 dark:text-gray-100 font-medium uppercase">
                        {course.lang}
                      </span>
                    </div>

                    <div className="flex items-center justify-between text-sm">
                      <div className="flex items-center space-x-1 text-gray-600 dark:text-gray-400">
                        <Eye className="w-3 h-3" />
                        <span>Created</span>
                      </div>
                      <span className="text-gray-900 dark:text-gray-100 font-medium">
                        {formatDate(course.createdAt)}
                      </span>
                    </div>
                  </div>

                  <div className="flex items-center justify-between">
                    <Link
                      to={`/course/${course._id}`}
                      className="text-sm text-accent-600 dark:text-accent-400 font-medium hover:text-accent-700 dark:hover:text-accent-300"
                    >
                      View Course
                    </Link>
                    <Link
                      to={`/course/${course._id}/edit`}
                      className="p-1 text-gray-400 hover:text-accent-600 dark:hover:text-accent-400 transition-colors"
                    >
                      <Settings className="w-4 h-4" />
                    </Link>
                  </div>
                </CardContent>
              </Card>
            </motion.div>
          ))}
        </div>

        {results && results.hasMore && (
          <div className="text-center mt-6">
            <Link
              to="/my-courses"
              className="text-accent-600 hover:text-accent-700 dark:text-accent-400 dark:hover:text-accent-300 font-medium"
            >
              View All Courses →
            </Link>
          </div>
        )}
      </CardContent>
    </Card>
  );
}