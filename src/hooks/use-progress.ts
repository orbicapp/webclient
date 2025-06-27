import { useEffect, useState } from "react";

import { CourseProgress, ProgressService } from "@/services/progress-service";
import { useProgressStore } from "@/stores/progress-store";

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
 * Hook to fetch and cache playing courses
 */
export const usePlayingCourses = (): [
  boolean,
  CourseProgress[],
  string | null
] => {
  const { getPlayingCourses, setPlayingCourses } = useProgressStore();
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

    const fetchPlayingCourses = async () => {
      setLoading(true);
      setError(null);

      const [courses, error] = await ProgressService.getMyPlayingCourses();
      if (courses) {
        setPlayingCourses(courses);
      } else {
        setError(error || "Failed to fetch playing courses");
      }

      setLoading(false);
      setInitialized(true);
    };

    fetchPlayingCourses();
  }, [playingCourses.length, setPlayingCourses]);

  // Don't return data until first fetch attempt is complete
  if (!initialized) {
    return [true, [], null];
  }

  return [loading, playingCourses, error];
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
