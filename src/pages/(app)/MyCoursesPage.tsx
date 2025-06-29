import { motion } from "framer-motion";
import { BookOpen, Plus, Users, Compass, Star, Clock, Trophy, Zap } from "lucide-react";
import { Link } from "react-router-dom";

import { ViewContainer } from "@/components/layout/ViewContainer";
import { Card, CardContent } from "@/components/ui/Card";
import { Tabs, TabsList, TabsTriggerUnderline, TabsContent } from "@/components/ui/Tabs";
import CourseCard from "@/components/ui/CourseCard";
import Button from "@/components/ui/Button";
import { useCourseSearch } from "@/hooks/use-course";
import { useCoursesWithProgress } from "@/hooks/use-progress";

export function MyCoursesPage() {
  // Created courses
  const [createdLoading, createdResults, createdError] = useCourseSearch("myCourses", {
    enabled: true,
    limit: 12,
    offset: 0,
  });

  // Enrolled courses (courses with progress)
  const [enrolledLoading, enrolledCourses, enrolledError] = useCoursesWithProgress();

  const createdCourses = createdResults?.courses || [];
  const hasCreatedCourses = createdCourses.length > 0;
  const hasEnrolledCourses = enrolledCourses.length > 0;

  return (
    <ViewContainer className="py-6">
      {/* Header */}
      <motion.div
        className="mb-8"
        initial={{ opacity: 0, y: -20 }}
        animate={{ opacity: 1, y: 0 }}
        transition={{ duration: 0.5 }}
      >
        <h1 className="text-3xl font-bold text-gray-900 dark:text-gray-100 mb-2">
          My Courses
        </h1>
        <p className="text-gray-600 dark:text-gray-400">
          Manage your created courses and track your learning progress
        </p>
      </motion.div>

      {/* Tabs */}
      <Tabs defaultValue="enrolled" className="w-full">
        <TabsList variant="underline" className="mb-8">
          <TabsTriggerUnderline 
            value="enrolled" 
            icon={<BookOpen className="w-4 h-4" />}
            badge={enrolledCourses.length}
          >
            Enrolled Courses
          </TabsTriggerUnderline>
          <TabsTriggerUnderline 
            value="created" 
            icon={<Plus className="w-4 h-4" />}
            badge={createdCourses.length}
          >
            Created Courses
          </TabsTriggerUnderline>
        </TabsList>

        {/* Enrolled Courses Tab */}
        <TabsContent value="enrolled">
          {enrolledLoading ? (
            <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
              {[1, 2, 3, 4, 5, 6].map((i) => (
                <div key={i} className="animate-pulse">
                  <div className="h-64 bg-gradient-to-br from-gray-200 to-gray-300 dark:from-gray-700 dark:to-gray-800 rounded-2xl"></div>
                </div>
              ))}
            </div>
          ) : enrolledError ? (
            <Card variant="gradient">
              <CardContent>
                <div className="text-center py-12">
                  <div className="p-4 bg-error-100 dark:bg-error-900/20 rounded-xl inline-block mb-4">
                    <BookOpen className="w-8 h-8 text-error-600 dark:text-error-400" />
                  </div>
                  <h3 className="text-lg font-bold text-error-600 dark:text-error-400 mb-2">
                    Error Loading Enrolled Courses
                  </h3>
                  <p className="text-gray-600 dark:text-gray-400">
                    {enrolledError}
                  </p>
                </div>
              </CardContent>
            </Card>
          ) : !hasEnrolledCourses ? (
            <Card variant="gradient">
              <CardContent>
                <div className="text-center py-16">
                  <div className="relative mb-8">
                    <div className="w-24 h-24 bg-gradient-to-br from-primary-500 to-accent-500 rounded-full flex items-center justify-center mx-auto shadow-lg shadow-primary-500/25">
                      <BookOpen className="w-12 h-12 text-white" />
                    </div>
                    <div className="absolute -top-2 -right-2 w-8 h-8 bg-accent-500 rounded-full flex items-center justify-center animate-bounce">
                      <Compass className="w-4 h-4 text-white" />
                    </div>
                  </div>
                  <h3 className="text-2xl font-bold text-gray-900 dark:text-gray-100 mb-4">
                    No Enrolled Courses Yet
                  </h3>
                  <p className="text-gray-500 dark:text-gray-400 mb-8 max-w-md mx-auto">
                    Start your learning journey by exploring our amazing courses and begin building your skills today!
                  </p>
                  <Link to="/courses">
                    <Button variant="primary" size="lg" glow>
                      <Compass className="w-5 h-5 mr-2" />
                      Explore Courses
                    </Button>
                  </Link>
                </div>
              </CardContent>
            </Card>
          ) : (
            <div className="space-y-6">
              {/* Stats Overview */}
              <div className="grid grid-cols-1 md:grid-cols-4 gap-4 mb-8">
                <Card variant="gradient" className="bg-gradient-to-br from-blue-50 to-indigo-50 dark:from-gray-800 dark:to-gray-700 border border-blue-200 dark:border-gray-600">
                  <CardContent>
                    <div className="flex items-center space-x-3">
                      <div className="p-2 bg-blue-500 rounded-lg">
                        <BookOpen className="w-5 h-5 text-white" />
                      </div>
                      <div>
                        <div className="text-2xl font-bold text-gray-900 dark:text-white">
                          {enrolledCourses.length}
                        </div>
                        <div className="text-sm text-gray-600 dark:text-gray-400">
                          Enrolled
                        </div>
                      </div>
                    </div>
                  </CardContent>
                </Card>

                <Card variant="gradient" className="bg-gradient-to-br from-green-50 to-emerald-50 dark:from-gray-800 dark:to-gray-700 border border-green-200 dark:border-gray-600">
                  <CardContent>
                    <div className="flex items-center space-x-3">
                      <div className="p-2 bg-green-500 rounded-lg">
                        <Trophy className="w-5 h-5 text-white" />
                      </div>
                      <div>
                        <div className="text-2xl font-bold text-gray-900 dark:text-white">
                          {enrolledCourses.filter(item => item.progress.completedLevels === item.progress.totalLevels).length}
                        </div>
                        <div className="text-sm text-gray-600 dark:text-gray-400">
                          Completed
                        </div>
                      </div>
                    </div>
                  </CardContent>
                </Card>

                <Card variant="gradient" className="bg-gradient-to-br from-yellow-50 to-orange-50 dark:from-gray-800 dark:to-gray-700 border border-yellow-200 dark:border-gray-600">
                  <CardContent>
                    <div className="flex items-center space-x-3">
                      <div className="p-2 bg-yellow-500 rounded-lg">
                        <Star className="w-5 h-5 text-white" />
                      </div>
                      <div>
                        <div className="text-2xl font-bold text-gray-900 dark:text-white">
                          {enrolledCourses.reduce((sum, item) => sum + item.progress.totalStars, 0)}
                        </div>
                        <div className="text-sm text-gray-600 dark:text-gray-400">
                          Total Stars
                        </div>
                      </div>
                    </div>
                  </CardContent>
                </Card>

                <Card variant="gradient" className="bg-gradient-to-br from-purple-50 to-pink-50 dark:from-gray-800 dark:to-gray-700 border border-purple-200 dark:border-gray-600">
                  <CardContent>
                    <div className="flex items-center space-x-3">
                      <div className="p-2 bg-purple-500 rounded-lg">
                        <Clock className="w-5 h-5 text-white" />
                      </div>
                      <div>
                        <div className="text-2xl font-bold text-gray-900 dark:text-white">
                          {Math.round(enrolledCourses.reduce((sum, item) => sum + item.progress.totalTimeSpent, 0) / 60)}m
                        </div>
                        <div className="text-sm text-gray-600 dark:text-gray-400">
                          Time Spent
                        </div>
                      </div>
                    </div>
                  </CardContent>
                </Card>
              </div>

              {/* Enrolled Courses Grid */}
              <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
                {enrolledCourses.map((item, index) => {
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
                        <div className="bg-black/60 backdrop-blur-sm rounded-lg px-2 py-1 border border-white/20">
                          <span className="text-xs font-bold text-white">
                            {progressPercentage}%
                          </span>
                        </div>
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
            </div>
          )}
        </TabsContent>

        {/* Created Courses Tab */}
        <TabsContent value="created">
          {createdLoading ? (
            <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
              {[1, 2, 3, 4, 5, 6].map((i) => (
                <div key={i} className="animate-pulse">
                  <div className="h-64 bg-gradient-to-br from-gray-200 to-gray-300 dark:from-gray-700 dark:to-gray-800 rounded-2xl"></div>
                </div>
              ))}
            </div>
          ) : createdError ? (
            <Card variant="gradient">
              <CardContent>
                <div className="text-center py-12">
                  <div className="p-4 bg-error-100 dark:bg-error-900/20 rounded-xl inline-block mb-4">
                    <Plus className="w-8 h-8 text-error-600 dark:text-error-400" />
                  </div>
                  <h3 className="text-lg font-bold text-error-600 dark:text-error-400 mb-2">
                    Error Loading Created Courses
                  </h3>
                  <p className="text-gray-600 dark:text-gray-400">
                    {createdError}
                  </p>
                </div>
              </CardContent>
            </Card>
          ) : !hasCreatedCourses ? (
            <Card variant="gradient">
              <CardContent>
                <div className="text-center py-16">
                  <div className="relative mb-8">
                    <div className="w-24 h-24 bg-gradient-to-br from-accent-500 to-orange-500 rounded-full flex items-center justify-center mx-auto shadow-lg shadow-accent-500/25">
                      <Plus className="w-12 h-12 text-white" />
                    </div>
                    <div className="absolute -top-2 -right-2 w-8 h-8 bg-orange-500 rounded-full flex items-center justify-center animate-bounce">
                      <BookOpen className="w-4 h-4 text-white" />
                    </div>
                  </div>
                  <h3 className="text-2xl font-bold text-gray-900 dark:text-gray-100 mb-4">
                    No Courses Created Yet
                  </h3>
                  <p className="text-gray-500 dark:text-gray-400 mb-8 max-w-md mx-auto">
                    Share your knowledge with the world! Create your first course and help others learn something amazing.
                  </p>
                  <Link to="/courses/create">
                    <Button variant="accent" size="lg" glow>
                      <Plus className="w-5 h-5 mr-2" />
                      Create Your First Course
                    </Button>
                  </Link>
                </div>
              </CardContent>
            </Card>
          ) : (
            <div className="space-y-6">
              {/* Creator Stats */}
              <div className="grid grid-cols-1 md:grid-cols-4 gap-4 mb-8">
                <Card variant="gradient" className="bg-gradient-to-br from-orange-50 to-red-50 dark:from-gray-800 dark:to-gray-700 border border-orange-200 dark:border-gray-600">
                  <CardContent>
                    <div className="flex items-center space-x-3">
                      <div className="p-2 bg-orange-500 rounded-lg">
                        <Plus className="w-5 h-5 text-white" />
                      </div>
                      <div>
                        <div className="text-2xl font-bold text-gray-900 dark:text-white">
                          {createdCourses.length}
                        </div>
                        <div className="text-sm text-gray-600 dark:text-gray-400">
                          Created
                        </div>
                      </div>
                    </div>
                  </CardContent>
                </Card>

                <Card variant="gradient" className="bg-gradient-to-br from-blue-50 to-indigo-50 dark:from-gray-800 dark:to-gray-700 border border-blue-200 dark:border-gray-600">
                  <CardContent>
                    <div className="flex items-center space-x-3">
                      <div className="p-2 bg-blue-500 rounded-lg">
                        <BookOpen className="w-5 h-5 text-white" />
                      </div>
                      <div>
                        <div className="text-2xl font-bold text-gray-900 dark:text-white">
                          {createdCourses.reduce((sum, course) => sum + course.chaptersCount, 0)}
                        </div>
                        <div className="text-sm text-gray-600 dark:text-gray-400">
                          Chapters
                        </div>
                      </div>
                    </div>
                  </CardContent>
                </Card>

                <Card variant="gradient" className="bg-gradient-to-br from-green-50 to-emerald-50 dark:from-gray-800 dark:to-gray-700 border border-green-200 dark:border-gray-600">
                  <CardContent>
                    <div className="flex items-center space-x-3">
                      <div className="p-2 bg-green-500 rounded-lg">
                        <Users className="w-5 h-5 text-white" />
                      </div>
                      <div>
                        <div className="text-2xl font-bold text-gray-900 dark:text-white">
                          {createdCourses.filter(course => course.visibility === 'public').length}
                        </div>
                        <div className="text-sm text-gray-600 dark:text-gray-400">
                          Public
                        </div>
                      </div>
                    </div>
                  </CardContent>
                </Card>

                <Card variant="gradient" className="bg-gradient-to-br from-purple-50 to-pink-50 dark:from-gray-800 dark:to-gray-700 border border-purple-200 dark:border-gray-600">
                  <CardContent>
                    <div className="flex items-center space-x-3">
                      <div className="p-2 bg-purple-500 rounded-lg">
                        <Trophy className="w-5 h-5 text-white" />
                      </div>
                      <div>
                        <div className="text-2xl font-bold text-gray-900 dark:text-white">
                          {createdCourses.filter(course => course.isApproved).length}
                        </div>
                        <div className="text-sm text-gray-600 dark:text-gray-400">
                          Approved
                        </div>
                      </div>
                    </div>
                  </CardContent>
                </Card>
              </div>

              {/* Created Courses Grid */}
              <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
                {createdCourses.map((course, index) => (
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

              {/* Create New Course Button */}
              <div className="text-center mt-12">
                <Link to="/courses/create">
                  <Button variant="accent" size="lg" glow>
                    <Plus className="w-5 h-5 mr-2" />
                    Create New Course
                  </Button>
                </Link>
              </div>
            </div>
          )}
        </TabsContent>
      </Tabs>
    </ViewContainer>
  );
}