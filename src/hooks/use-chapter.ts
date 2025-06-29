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
  const { 
    getChapter, 
    setChapter, 
    isChapterInitialized 
  } = useChapterStore();

  const [loading, setLoading] = useState(false);
  const [error, setError] = useState<string | null>(null);

  const chapter = getChapter(chapterId);
  const initialized = isChapterInitialized(chapterId);

  useEffect(() => {
    // ✅ If already initialized, no chapterId, or loading, don't fetch
    if (initialized || !chapterId || loading) {
      return;
    }

    const fetchChapter = async () => {
      setLoading(true);
      setError(null);

      try {
        const [chapter, error] = await ChapterService.getChapter(chapterId);
        if (chapter) {
          setChapter(chapter); // ✅ This sets initialized flag
        } else {
          setError(error || "Failed to fetch chapter");
          // ✅ Mark as initialized even on error
          setChapter({
            _id: chapterId,
            title: 'Chapter not found',
            description: '',
            courseId: '',
            order: 0,
            levelsCount: 0,
            createdAt: new Date().toISOString(),
            updatedAt: new Date().toISOString(),
          });
        }
      } catch (err) {
        setError(err instanceof Error ? err.message : "Failed to fetch chapter");
      } finally {
        setLoading(false);
      }
    };

    fetchChapter();
  }, [chapterId, initialized, loading, setChapter]);

  // ✅ Return data immediately if available
  return [loading && !initialized, chapter || null, error];
};

/**
 * Hook to fetch and cache all chapters for a specific course
 * Returns cached data if available, otherwise fetches from server
 */
export const useCourseChapters = (
  courseId: string
): [boolean, Chapter[], string | null] => {
  const { 
    getCourseChapters, 
    setCourseChapters, 
    isCourseChaptersInitialized 
  } = useChapterStore();

  const [loading, setLoading] = useState(false);
  const [error, setError] = useState<string | null>(null);

  const chapters = getCourseChapters(courseId);
  const initialized = isCourseChaptersInitialized(courseId);

  useEffect(() => {
    // ✅ If already initialized, no courseId, or loading, don't fetch
    if (initialized || !courseId || loading) {
      return;
    }

    const fetchCourseChapters = async () => {
      setLoading(true);
      setError(null);

      try {
        const [chapters, error] = await ChapterService.getCourseChapters(courseId);
        if (chapters) {
          setCourseChapters(courseId, chapters); // ✅ This sets initialized flag
        } else {
          setError(error || "Failed to fetch course chapters");
          setCourseChapters(courseId, []); // ✅ Still mark as initialized
        }
      } catch (err) {
        setError(err instanceof Error ? err.message : "Failed to fetch course chapters");
        setCourseChapters(courseId, []); // ✅ Still mark as initialized
      } finally {
        setLoading(false);
      }
    };

    fetchCourseChapters();
  }, [courseId, initialized, loading, setCourseChapters]);

  // ✅ Return data immediately if available
  return [loading && !initialized, chapters, error];
};