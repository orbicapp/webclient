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

  const { getSearchResults, setSearchResult } = useCourseStore();

  const [loading, setLoading] = useState(false);
  const [error, setError] = useState<string | null>(null);
  const [initialized, setInitialized] = useState(false);
  const [result, setResult] = useState<CoursesConnection | null>(null);

  const searchKey = generateSearchKey(type, filter, limit, offset);
  const courses = getSearchResults(searchKey);

  useEffect(() => {
    // If results are already cached or search is disabled, don't fetch
    if (courses.length > 0 || !enabled) {
      setInitialized(true);
      return;
    }

    const fetchCourses = async () => {
      setLoading(true);
      setError(null);

      const serviceMethod =
        type === "myCourses"
          ? CourseService.getMyCourses
          : CourseService.getCourses;

      const [result, error] = await serviceMethod(filter, limit, offset);

      if (result) {
        setSearchResult(searchKey, result.courses);
        setResult(result);
      } else {
        setError(error || "Failed to fetch courses");
      }

      setLoading(false);
      setInitialized(true);
    };

    fetchCourses();
  }, [
    searchKey,
    courses.length,
    enabled,
    type,
    filter,
    limit,
    offset,
    setSearchResult,
  ]);

  // Don't return data until first fetch attempt is complete
  if (!initialized && enabled) {
    return [true, null, null];
  }

  return [loading, result, error];
};

export const useCourse = (
  courseId: string
): [boolean, Course | null, string | null] => {
  const { getCourse, setCourse } = useCourseStore();

  const [loading, setLoading] = useState(false);
  const [error, setError] = useState<string | null>(null);
  const [initialized, setInitialized] = useState(false);

  const course = getCourse(courseId);

  useEffect(() => {
    // If course is already in cache or no courseId, don't fetch
    if (course || !courseId) {
      setInitialized(true);
      return;
    }

    const fetchCourse = async () => {
      setLoading(true);
      setError(null);

      const [course, error] = await CourseService.getCourse(courseId);
      if (course) {
        setCourse(course);
      } else {
        setError(error || "Failed to fetch course");
      }

      setLoading(false);
      setInitialized(true);
    };

    fetchCourse();
  }, [courseId, course, setCourse]);

  // Don't return data until first fetch attempt is complete
  if (!initialized) {
    return [true, null, null];
  }

  return [loading, course || null, error];
};