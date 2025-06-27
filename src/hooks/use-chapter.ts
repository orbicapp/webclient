import { useEffect, useState } from "react";

import { Chapter, ChapterService } from "@/services/chapter-service";
import { useChapterStore } from "@/stores/chapter-store";

/**
 * Hook to fetch and cache a specific chapter by ID
 * Returns cached data if available, otherwise fetches from server
 */
export const useChapter = (
  chapterId: string
): [boolean, Chapter | null, string | null] => {
  const { getChapter, setChapter } = useChapterStore();

  const [loading, setLoading] = useState(false);
  const [error, setError] = useState<string | null>(null);
  const [initialized, setInitialized] = useState(false);

  const chapter = getChapter(chapterId);

  useEffect(() => {
    // If chapter is already in cache or no chapterId provided, don't fetch
    if (chapter || !chapterId) {
      setInitialized(true);
      return;
    }

    const fetchChapter = async () => {
      setLoading(true);
      setError(null);

      const [chapter, error] = await ChapterService.getChapter(chapterId);
      if (chapter) {
        setChapter(chapter);
      } else {
        setError(error || "Failed to fetch chapter");
      }

      setLoading(false);
      setInitialized(true);
    };

    fetchChapter();
  }, [chapterId, chapter, setChapter]);

  // Don't return data until first fetch attempt is complete
  if (!initialized) {
    return [true, null, null];
  }

  return [loading, chapter || null, error];
};

/**
 * Hook to fetch and cache all chapters for a specific course
 * Returns cached data if available, otherwise fetches from server
 */
export const useCourseChapters = (
  courseId: string
): [boolean, Chapter[], string | null] => {
  const { getCourseChapters, setCourseChapters } = useChapterStore();

  const [loading, setLoading] = useState(false);
  const [error, setError] = useState<string | null>(null);
  const [initialized, setInitialized] = useState(false);

  const chapters = getCourseChapters(courseId);

  useEffect(() => {
    // If chapters are already in cache or no courseId provided, don't fetch
    if (chapters.length > 0 || !courseId) {
      setInitialized(true);
      return;
    }

    const fetchCourseChapters = async () => {
      setLoading(true);
      setError(null);

      const [chapters, error] = await ChapterService.getCourseChapters(
        courseId
      );
      if (chapters) {
        setCourseChapters(courseId, chapters);
      } else {
        setError(error || "Failed to fetch course chapters");
      }

      setLoading(false);
      setInitialized(true);
    };

    fetchCourseChapters();
  }, [courseId, chapters.length, setCourseChapters]);

  // Don't return data until first fetch attempt is complete
  if (!initialized) {
    return [true, [], null];
  }

  return [loading, chapters, error];
};
