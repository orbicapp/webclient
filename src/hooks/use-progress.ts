import { useEffect, useState } from "react";

import { 
  CourseProgress, 
  CourseWithProgress, 
  ProgressService 
} from "@/services/progress-service";
import { useProgressStore } from "@/stores/progress-store";
import { useCourseStore } from "@/stores/course-store";

/**
 * Hook to fetch and cache course progress with manual refetch capability
 */
export const useCourseProgress = (
  courseId: string
): [boolean, CourseProgress | null, string | null, () => Promise<void>] => {
  const { 
    getCourseProgress, 
    setCourseProgress, 
    isCourseProgressInitialized 
  } = useProgressStore();
  
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState<string | null>(null);

  const progress = getCourseProgress(courseId);
  const initialized = isCourseProgressInitialized(courseId);

  // ✅ Manual refetch function
  const refetchCourseProgress = async () => {
    if (!courseId) return;

    setLoading(true);
    setError(null);

    try {
      const [freshProgress, fetchError] = await ProgressService.getCourseProgress(courseId);
      if (freshProgress) {
        setCourseProgress(freshProgress);
        console.log("Course progress refreshed:", freshProgress);
      } else {
        setError(fetchError || "Failed to refresh course progress");
      }
    } catch (err) {
      setError(err instanceof Error ? err.message : "Failed to refresh course progress");
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    // ✅ If already initialized or no courseId, don't fetch
    if (initialized || !courseId || loading) {
      return;
    }

    const fetchProgress = async () => {
      setLoading(true);
      setError(null);

      try {
        const [progress, error] = await ProgressService.getCourseProgress(courseId);
        if (progress) {
          setCourseProgress(progress); // ✅ This sets initialized flag
        } else {
          setError(error || "Failed to fetch course progress");
          // ✅ Still mark as initialized to prevent retries
          setCourseProgress({
            _id: `temp-${courseId}`,
            courseId,
            userId: '',
            currentChapter: 0,
            currentLevel: 0,
            levelProgress: [],
            totalScore: 0,
            totalMaxScore: 0,
            completed: false,
            createdAt: new Date().toISOString(),
            updatedAt: new Date().toISOString(),
          });
        }
      } catch (err) {
        setError(err instanceof Error ? err.message : "Failed to fetch course progress");
      } finally {
        setLoading(false);
      }
    };

    fetchProgress();
  }, [courseId, initialized, loading, setCourseProgress]);

  // ✅ Return data immediately if available + refetch function
  return [loading && !initialized, progress || null, error, refetchCourseProgress];
};

/**
 * Hook to fetch and cache courses with progress (replaces usePlayingCourses)
 */
export const useCoursesWithProgress = (): [
  boolean,
  CourseWithProgress[],
  string | null,
  () => Promise<void>
] => {
  const { 
    getPlayingCourses, 
    setPlayingCourses, 
    isPlayingCoursesInitialized 
  } = useProgressStore();
  const { setCourses } = useCourseStore();
  
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState<string | null>(null);

  const playingCourses = getPlayingCourses();
  const initialized = isPlayingCoursesInitialized();

  // ✅ Manual refetch function
  const refetchCoursesWithProgress = async () => {
    setLoading(true);
    setError(null);

    try {
      const [coursesWithProgress, fetchError] = await ProgressService.getMyCoursesWithProgress();
      if (coursesWithProgress) {
        // Cache courses in course store
        const courses = coursesWithProgress.map(item => item.course);
        setCourses(courses);

        // Cache progress in progress store
        const progressList = coursesWithProgress.map(item => item.progress);
        setPlayingCourses(progressList);
        console.log("Courses with progress refreshed:", coursesWithProgress.length);
      } else {
        setError(fetchError || "Failed to refresh courses with progress");
      }
    } catch (err) {
      setError(err instanceof Error ? err.message : "Failed to refresh courses with progress");
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    // ✅ If already initialized, don't fetch
    if (initialized || loading) {
      return;
    }

    const fetchCoursesWithProgress = async () => {
      setLoading(true);
      setError(null);

      try {
        const [coursesWithProgress, error] = await ProgressService.getMyCoursesWithProgress();
        if (coursesWithProgress) {
          // Cache courses in course store
          const courses = coursesWithProgress.map(item => item.course);
          setCourses(courses);

          // Cache progress in progress store
          const progressList = coursesWithProgress.map(item => item.progress);
          setPlayingCourses(progressList); // ✅ This sets initialized flag
        } else {
          setError(error || "Failed to fetch courses with progress");
          setPlayingCourses([]); // ✅ Still mark as initialized
        }
      } catch (err) {
        setError(err instanceof Error ? err.message : "Failed to fetch courses with progress");
        setPlayingCourses([]); // ✅ Still mark as initialized
      } finally {
        setLoading(false);
      }
    };

    fetchCoursesWithProgress();
  }, [initialized, loading, setPlayingCourses, setCourses]);

  // ✅ Combine cached data to return CourseWithProgress[]
  const coursesWithProgress: CourseWithProgress[] = playingCourses.map(progress => {
    const { getCourse } = useCourseStore.getState();
    const course = getCourse(progress.courseId);
    return {
      course: course!,
      progress
    };
  }).filter(item => item.course); // Filter out any missing courses

  // ✅ Return data immediately if available + refetch function
  return [loading && !initialized, coursesWithProgress, error, refetchCoursesWithProgress];
};

/**
 * Hook to fetch and cache completed courses
 */
export const useCompletedCourses = (): [
  boolean,
  CourseProgress[],
  string | null
] => {
  const { 
    getCompletedCourses, 
    setCompletedCourses, 
    isCompletedCoursesInitialized 
  } = useProgressStore();
  
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState<string | null>(null);

  const completedCourses = getCompletedCourses();
  const initialized = isCompletedCoursesInitialized();

  useEffect(() => {
    // ✅ If already initialized, don't fetch
    if (initialized || loading) {
      return;
    }

    const fetchCompletedCourses = async () => {
      setLoading(true);
      setError(null);

      try {
        const [courses, error] = await ProgressService.getMyCompletedCourses();
        if (courses) {
          setCompletedCourses(courses); // ✅ This sets initialized flag
        } else {
          setError(error || "Failed to fetch completed courses");
          setCompletedCourses([]); // ✅ Still mark as initialized
        }
      } catch (err) {
        setError(err instanceof Error ? err.message : "Failed to fetch completed courses");
        setCompletedCourses([]); // ✅ Still mark as initialized
      } finally {
        setLoading(false);
      }
    };

    fetchCompletedCourses();
  }, [initialized, loading, setCompletedCourses]);

  // ✅ Return data immediately if available
  return [loading && !initialized, completedCourses, error];
};