import { useEffect, useState } from "react";

import {
  Course,
  CourseFilterInput,
  CoursesConnection,
  CourseService,
} from "@/services/course-service";
import { useCourseStore } from "@/stores/course-store";

type SearchType = "courses" | "myCourses";

// Helper function to generate search keys
const generateSearchKey = (
  type: SearchType,
  filter?: CourseFilterInput,
  limit?: number,
  offset?: number
): string => {
  return JSON.stringify({ type, filter, limit, offset });
};

interface UseSearchCoursesOptions {
  filter?: CourseFilterInput;
  limit?: number;
  offset?: number;
  enabled?: boolean; // Allow disabling auto-fetch
}

export const useCourseSearch = (
  type: SearchType = "courses",
  options: UseSearchCoursesOptions = {}
): [boolean, CoursesConnection | null, string | null] => {
  const { filter, limit = 10, offset = 0, enabled = true } = options;

  const { 
    getSearchResults, 
    setSearchResult, 
    isSearchInitialized 
  } = useCourseStore();

  const [loading, setLoading] = useState(false);
  const [error, setError] = useState<string | null>(null);
  const [result, setResult] = useState<CoursesConnection | null>(null);

  const searchKey = generateSearchKey(type, filter, limit, offset);
  const courses = getSearchResults(searchKey);
  const initialized = isSearchInitialized(searchKey);

  useEffect(() => {
    // ✅ If already initialized, search is disabled, or loading, don't fetch
    if (initialized || !enabled || loading) {
      // ✅ If we have cached results, create the connection object
      if (initialized && courses.length > 0) {
        setResult({
          courses,
          total: courses.length, // This is approximate, real total would come from API
          limit,
          offset,
          hasMore: false, // This is approximate
        });
      }
      return;
    }

    const fetchCourses = async () => {
      setLoading(true);
      setError(null);

      try {
        const serviceMethod =
          type === "myCourses"
            ? CourseService.getMyCourses
            : CourseService.getCourses;

        const [result, error] = await serviceMethod(filter, limit, offset);

        if (result) {
          setSearchResult(searchKey, result.courses); // ✅ This sets initialized flag
          setResult(result);
        } else {
          setError(error || "Failed to fetch courses");
          setSearchResult(searchKey, []); // ✅ Still mark as initialized
        }
      } catch (err) {
        setError(err instanceof Error ? err.message : "Failed to fetch courses");
        setSearchResult(searchKey, []); // ✅ Still mark as initialized
      } finally {
        setLoading(false);
      }
    };

    fetchCourses();
  }, [
    searchKey,
    initialized,
    enabled,
    loading,
    type,
    filter,
    limit,
    offset,
    setSearchResult,
    courses.length,
  ]);

  // ✅ Return data immediately if available
  return [loading && !initialized, result, error];
};

export const useCourse = (
  courseId: string
): [boolean, Course | null, string | null] => {
  const { 
    getCourse, 
    setCourse, 
    isCourseInitialized 
  } = useCourseStore();

  const [loading, setLoading] = useState(false);
  const [error, setError] = useState<string | null>(null);

  const course = getCourse(courseId);
  const initialized = isCourseInitialized(courseId);

  useEffect(() => {
    // ✅ If already initialized, no courseId, or loading, don't fetch
    if (initialized || !courseId || loading) {
      return;
    }

    const fetchCourse = async () => {
      setLoading(true);
      setError(null);

      try {
        const [course, error] = await CourseService.getCourse(courseId);
        if (course) {
          setCourse(course); // ✅ This sets initialized flag
        } else {
          setError(error || "Failed to fetch course");
          // ✅ Mark as initialized even on error to prevent retries
          setCourse({
            _id: courseId,
            author: '',
            title: 'Course not found',
            description: '',
            lang: 'en',
            category: 'other',
            chaptersCount: 0,
            visibility: 'private',
            createdAt: new Date().toISOString(),
            updatedAt: new Date().toISOString(),
          });
        }
      } catch (err) {
        setError(err instanceof Error ? err.message : "Failed to fetch course");
      } finally {
        setLoading(false);
      }
    };

    fetchCourse();
  }, [courseId, initialized, loading, setCourse]);

  // ✅ Return data immediately if available
  return [loading && !initialized, course || null, error];
};