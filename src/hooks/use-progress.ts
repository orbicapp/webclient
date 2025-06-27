import { useEffect, useState } from "react";

import { 
  CourseProgress, 
  CourseWithProgress, 
  ProgressService 
} from "@/services/progress-service";
import { useProgressStore } from "@/stores/progress-store";
import { useCourseStore } from "@/stores/course-store";

/**
 * Hook to fetch and cache course progress
 */
export const useCourseProgress = (
  courseId: string
): [boolean, CourseProgress | null, string | null] => {
  const { getCourseProgress, setCourseProgress } = useProgressStore();
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState<string | null>(null);
  const [initialized, setInitialized] = useState(false);

  const progress = getCourseProgress(courseId);

  useEffect(() => {
    // If progress is already in cache or no courseId, don't fetch
    if (progress || !courseId) {
      setInitialized(true);
      return;
    }

    const fetchProgress = async () => {
      setLoading(true);
      setError(null);

      const [progress, error] = await ProgressService.getCourseProgress(
        courseId
      );
      if (progress) {
        setCourseProgress(progress);
      } else {
        setError(error || "Failed to fetch course progress");
      }

      setLoading(false);
      setInitialized(true);
    };

    fetchProgress();
  }, [courseId, progress, setCourseProgress]);

  // Don't return data until first fetch attempt is complete
  if (!initialized) {
    return [true, null, null];
  }

  return [loading, progress || null, error];
};

/**
 * Hook to fetch and cache courses with progress (replaces usePlayingCourses)
 */
export const useCoursesWithProgress = (): [
  boolean,
  CourseWithProgress[],
  string | null
] => {
  const { getPlayingCourses, setPlayingCourses } = useProgressStore();
  const { setCourses } = useCourseStore();
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState<string | null>(null);
  const [initialized, setInitialized] = useState(false);

  const playingCourses = getPlayingCourses();

  useEffect(() => {
    // If courses are already in cache, don't fetch
    if (playingCourses.length > 0) {
      setInitialized(true);
      return;
    }

    const fetchCoursesWithProgress = async () => {
      setLoading(true);
      setError(null);

      const [coursesWithProgress, error] = await ProgressService.getMyCoursesWithProgress();
      if (coursesWithProgress) {
        // Cache courses in course store
        const courses = coursesWithProgress.map(item => item.course);
        setCourses(courses);

        // Cache progress in progress store
        const progressList = coursesWithProgress.map(item => item.progress);
        setPlayingCourses(progressList);
      } else {
        setError(error || "Failed to fetch courses with progress");
      }

      setLoading(false);
      setInitialized(true);
    };

    fetchCoursesWithProgress();
  }, [playingCourses.length, setPlayingCourses, setCourses]);

  // Don't return data until first fetch attempt is complete
  if (!initialized) {
    return [true, [], null];
  }

  // Combine cached data to return CourseWithProgress[]
  const coursesWithProgress: CourseWithProgress[] = playingCourses.map(progress => {
    const { getCourse } = useCourseStore.getState();
    const course = getCourse(progress.courseId);
    return {
      course: course!,
      progress
    };
  }).filter(item => item.course); // Filter out any missing courses

  return [loading, coursesWithProgress, error];
};

/**
 * Hook to fetch and cache completed courses
 */
export const useCompletedCourses = (): [
  boolean,
  CourseProgress[],
  string | null
] => {
  const { getCompletedCourses, setCompletedCourses } = useProgressStore();
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState<string | null>(null);
  const [initialized, setInitialized] = useState(false);

  const completedCourses = getCompletedCourses();

  useEffect(() => {
    // If courses are already in cache, don't fetch
    if (completedCourses.length > 0) {
      setInitialized(true);
      return;
    }

    const fetchCompletedCourses = async () => {
      setLoading(true);
      setError(null);

      const [courses, error] = await ProgressService.getMyCompletedCourses();
      if (courses) {
        setCompletedCourses(courses);
      } else {
        setError(error || "Failed to fetch completed courses");
      }

      setLoading(false);
      setInitialized(true);
    };

    fetchCompletedCourses();
  }, [completedCourses.length, setCompletedCourses]);

  // Don't return data until first fetch attempt is complete
  if (!initialized) {
    return [true, [], null];
  }

  return [loading, completedCourses, error];
};