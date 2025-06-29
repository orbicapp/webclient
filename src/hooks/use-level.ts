import { useEffect, useState } from "react";

import { Level, LevelService } from "@/services/level-service";
import { useLevelStore } from "@/stores/level-store";

export const useLevel = (
  levelId: string
): [boolean, Level | null, string | null] => {
  const { 
    getLevel, 
    setLevel, 
    isLevelInitialized 
  } = useLevelStore();

  const [loading, setLoading] = useState(false);
  const [error, setError] = useState<string | null>(null);

  const level = getLevel(levelId);
  const initialized = isLevelInitialized(levelId);

  useEffect(() => {
    // ✅ If already initialized, no levelId, or loading, don't fetch
    if (initialized || !levelId || loading) {
      return;
    }

    const fetchLevel = async () => {
      setLoading(true);
      setError(null);

      try {
        const [level, error] = await LevelService.getLevel(levelId);
        if (level) {
          setLevel(level); // ✅ This sets initialized flag
        } else {
          setError(error || "Failed to fetch level");
          // ✅ Mark as initialized even on error
          setLevel({
            _id: levelId,
            title: 'Level not found',
            description: '',
            chapterId: '',
            courseId: '',
            order: 0,
            questions: [],
            createdAt: new Date().toISOString(),
            updatedAt: new Date().toISOString(),
          });
        }
      } catch (err) {
        setError(err instanceof Error ? err.message : "Failed to fetch level");
      } finally {
        setLoading(false);
      }
    };

    fetchLevel();
  }, [levelId, initialized, loading, setLevel]);

  // ✅ Return data immediately if available
  return [loading && !initialized, level || null, error];
};

// Hook to get chapter levels
export const useChapterLevels = (
  chapterId: string | undefined
): [boolean, Level[], string | null] => {
  const { 
    getChapterLevels, 
    setChapterLevels, 
    isChapterLevelsInitialized 
  } = useLevelStore();

  const [loading, setLoading] = useState(false);
  const [error, setError] = useState<string | null>(null);
  
  const levels = getChapterLevels(chapterId);
  const initialized = chapterId ? isChapterLevelsInitialized(chapterId) : true;

  useEffect(() => {
    // ✅ If already initialized, no chapterId, or loading, don't fetch
    if (initialized || !chapterId || loading) {
      return;
    }

    const fetchChapterLevels = async () => {
      setLoading(true);
      setError(null);

      try {
        const [levels, error] = await LevelService.getChapterLevels(chapterId);
        if (levels) {
          setChapterLevels(chapterId, levels); // ✅ This sets initialized flag
        } else {
          setError(error || "Failed to fetch chapter levels");
          setChapterLevels(chapterId, []); // ✅ Still mark as initialized
        }
      } catch (err) {
        setError(err instanceof Error ? err.message : "Failed to fetch chapter levels");
        setChapterLevels(chapterId, []); // ✅ Still mark as initialized
      } finally {
        setLoading(false);
      }
    };

    fetchChapterLevels();
  }, [chapterId, initialized, loading, setChapterLevels]);

  // ✅ Return data immediately if available
  return [loading && !initialized, levels, error];
};

// Hook to get course levels
export const useCourseLevels = (
  courseId: string
): [boolean, Level[], string | null] => {
  const { 
    getCourseLevels, 
    setCourseLevels, 
    isCourseLevelsInitialized 
  } = useLevelStore();

  const [loading, setLoading] = useState(false);
  const [error, setError] = useState<string | null>(null);

  const levels = getCourseLevels(courseId);
  const initialized = isCourseLevelsInitialized(courseId);

  useEffect(() => {
    // ✅ If already initialized, no courseId, or loading, don't fetch
    if (initialized || !courseId || loading) {
      return;
    }

    const fetchCourseLevels = async () => {
      setLoading(true);
      setError(null);

      try {
        const [levels, error] = await LevelService.getCourseLevels(courseId);
        if (levels) {
          console.log(`Fetched ${levels.length} levels for course ${courseId}:`, levels);
          setCourseLevels(courseId, levels); // ✅ This sets initialized flag
        } else {
          setError(error || "Failed to fetch course levels");
          setCourseLevels(courseId, []); // ✅ Still mark as initialized
        }
      } catch (err) {
        setError(err instanceof Error ? err.message : "Failed to fetch course levels");
        setCourseLevels(courseId, []); // ✅ Still mark as initialized
      } finally {
        setLoading(false);
      }
    };

    fetchCourseLevels();
  }, [courseId, initialized, loading, setCourseLevels]);

  // ✅ Return data immediately if available
  return [loading && !initialized, levels, error];
};