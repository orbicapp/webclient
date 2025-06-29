import { useState, useEffect, useRef } from "react";
import { motion } from "framer-motion";
import { Filter, Grid, List } from "lucide-react";

import { ViewContainer } from "@/components/layout/ViewContainer";
import { SearchInput } from "@/components/layout/SearchInput";
import { useCourseSearch } from "@/hooks/use-course";
import { useSearchState } from "@/hooks/use-search-state";
import { Course } from "@/services/course-service";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/Card";
import Button from "@/components/ui/Button";
import CourseCard from "@/components/ui/CourseCard";

export function CourseListPage() {
  const [viewMode, setViewMode] = useState<"grid" | "list">("grid");
  
  // Use centralized search state
  const { debouncedSearch } = useSearchState();
  
  // Use the search hook with debounced search
  const [loading, results, error] = useCourseSearch("courses", {
    enabled: true,
    limit: 12,
    offset: 0,
    filter: { search: debouncedSearch.trim() || undefined },
  });

  // Show loading state only on initial load, not during search
  const isInitialLoading = loading && !results;

  if (isInitialLoading) {
    return (
      <ViewContainer className="py-6">
        <div className="mb-8">
          <h1 className="text-3xl font-bold text-gray-900 dark:text-gray-100 mb-2">
            Explore Courses
          </h1>
          <p className="text-gray-600 dark:text-gray-400">
            Discover amazing learning experiences
          </p>
        </div>

        <Card className="mb-8">
          <CardContent>
            <div className="animate-pulse">
              <div className="h-12 bg-gray-200 dark:bg-gray-700 rounded-xl mb-4"></div>
              <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
                {[1, 2, 3, 4, 5, 6].map((i) => (
                  <div key={i} className="h-64 bg-gray-200 dark:bg-gray-700 rounded-2xl"></div>
                ))}
              </div>
            </div>
          </CardContent>
        </Card>
      </ViewContainer>
    );
  }

  if (error && !results) {
    return (
      <ViewContainer className="py-6">
        <Card>
          <CardContent>
            <div className="text-center py-12">
              <h1 className="text-2xl font-bold text-error-600 dark:text-error-400 mb-4">
                Error Loading Courses
              </h1>
              <p className="text-gray-600 dark:text-gray-400">
                {error}
              </p>
            </div>
          </CardContent>
        </Card>
      </ViewContainer>
    );
  }

  const courses = results?.courses || [];

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
          Explore Courses
        </h1>
        <p className="text-gray-600 dark:text-gray-400">
          Discover amazing learning experiences from our community
        </p>
      </motion.div>

      {/* Search and Filters */}
      <Card className="mb-8" variant="gradient">
        <CardContent>
          <div className="flex flex-col md:flex-row gap-4 items-center">
            <div className="flex-1">
              <SearchInput
                variant="page"
                placeholder="Search courses, topics, or categories..."
                className="w-full"
              />
            </div>
            
            <div className="flex items-center space-x-2">
              <Button variant="outline" size="sm">
                <Filter className="w-4 h-4 mr-2" />
                Filters
              </Button>
              
              <div className="flex bg-gray-100 dark:bg-gray-800 rounded-lg p-1">
                <button
                  onClick={() => setViewMode("grid")}
                  className={`p-2 rounded-md transition-colors ${
                    viewMode === "grid"
                      ? "bg-white dark:bg-gray-700 text-primary-600 shadow-sm"
                      : "text-gray-500 hover:text-gray-700 dark:hover:text-gray-300"
                  }`}
                >
                  <Grid className="w-4 h-4" />
                </button>
                <button
                  onClick={() => setViewMode("list")}
                  className={`p-2 rounded-md transition-colors ${
                    viewMode === "list"
                      ? "bg-white dark:bg-gray-700 text-primary-600 shadow-sm"
                      : "text-gray-500 hover:text-gray-700 dark:hover:text-gray-300"
                  }`}
                >
                  <List className="w-4 h-4" />
                </button>
              </div>
            </div>
          </div>
        </CardContent>
      </Card>

      {/* Loading indicator during search */}
      {loading && results && (
        <div className="flex items-center justify-center py-4 mb-4">
          <div className="flex items-center space-x-2 text-primary-600 dark:text-primary-400">
            <div className="w-4 h-4 border-2 border-current border-t-transparent rounded-full animate-spin"></div>
            <span className="text-sm font-medium">Searching...</span>
          </div>
        </div>
      )}

      {/* Results Info */}
      <div className="flex items-center justify-between mb-6">
        <div className="text-sm text-gray-600 dark:text-gray-400">
          {results ? (
            <>
              Showing {courses.length} of {results.total} courses
              {debouncedSearch && (
                <span> for "{debouncedSearch}"</span>
              )}
            </>
          ) : (
            "Loading courses..."
          )}
        </div>
        
        {results?.hasMore && (
          <div className="text-sm text-gray-500 dark:text-gray-400">
            {results.limit} per page • {results.offset + courses.length} of {results.total}
          </div>
        )}
      </div>

      {/* Course Grid */}
      {courses.length === 0 ? (
        <Card>
          <CardContent>
            <div className="text-center py-12">
              <div className="w-16 h-16 bg-gray-100 dark:bg-gray-700 rounded-full flex items-center justify-center mx-auto mb-4">
                <Filter className="w-8 h-8 text-gray-400 dark:text-gray-500" />
              </div>
              <h3 className="text-lg font-medium text-gray-900 dark:text-gray-100 mb-2">
                No courses found
              </h3>
              <p className="text-gray-500 dark:text-gray-400">
                {debouncedSearch 
                  ? `No courses match "${debouncedSearch}". Try adjusting your search.`
                  : "No courses available at the moment."
                }
              </p>
            </div>
          </CardContent>
        </Card>
      ) : (
        <div className={`grid gap-6 ${
          viewMode === "grid" 
            ? "grid-cols-1 md:grid-cols-2 lg:grid-cols-3 xl:grid-cols-4" 
            : "grid-cols-1"
        }`}>
          {courses.map((course: Course, index) => (
            <motion.div
              key={course._id}
              initial={{ opacity: 0, y: 20 }}
              animate={{ opacity: 1, y: 0 }}
              transition={{ delay: index * 0.1 }}
            >
              <CourseCard 
                course={course} 
                variant={viewMode === "list" ? "compact" : "default"}
              />
            </motion.div>
          ))}
        </div>
      )}

      {/* Load More */}
      {results?.hasMore && (
        <div className="text-center mt-12">
          <Button variant="outline" size="lg">
            Load More Courses
          </Button>
        </div>
      )}
    </ViewContainer>
  );
}