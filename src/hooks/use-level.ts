import { useEffect, useState } from "react";

import { Level, LevelService } from "@/services/level-service";
import { useLevelStore } from "@/stores/level-store";

export const useLevel = (
  levelId: string
): [boolean, Level | null, string | null] => {
  const { getLevel, setLevel } = useLevelStore();

  const [loading, setLoading] = useState(false);
  const [error, setError] = useState<string | null>(null);
  const [initialized, setInitialized] = useState(false);

  const level = getLevel(levelId);

  useEffect(() => {
    // If level is already in cache or no levelId, don't fetch
    if (level || !levelId) {
      setInitialized(true);
      return;
    }

    const fetchLevel = async () => {
      setLoading(true);
      setError(null);

      const [level, error] = await LevelService.getLevel(levelId);
      if (level) {
        setLevel(level);
      } else {
        setError(error || "Failed to fetch level");
      }

      setLoading(false);
      setInitialized(true);
    };

    fetchLevel();
  }, [levelId, level, setLevel]);

  // Don't return data until first fetch attempt is complete
  if (!initialized) {
    return [true, null, null];
  }

  return [loading, level || null, error];
};

// Hook to get chapter levels
export const useChapterLevels = (
  chapterId: string | undefined
): [boolean, Level[], string | null] => {
  const { getChapterLevels, setChapterLevels } = useLevelStore();

  const [loading, setLoading] = useState(false);
  const [error, setError] = useState<string | null>(null);
  const [initialized, setInitialized] = useState(false);
  const levels = getChapterLevels(chapterId);

  useEffect(() => {
    // If levels are already in cache or no chapterId, don't fetch
    if (levels.length > 0 || !chapterId) {
      setInitialized(true);
      return;
    }

    const fetchChapterLevels = async () => {
      setLoading(true);
      setError(null);

      const [levels, error] = await LevelService.getChapterLevels(chapterId);
      if (levels) {
        setChapterLevels(chapterId, levels);
      } else {
        setError(error || "Failed to fetch chapter levels");
      }

      setLoading(false);
      setInitialized(true);
    };

    fetchChapterLevels();
  }, [chapterId, levels.length, setChapterLevels]);

  // Don't return data until first fetch attempt is complete
  if (!initialized) {
    return [true, [], null];
  }

  return [loading, levels, error];
};

// Hook to get course levels
export const useCourseLevels = (
  courseId: string
): [boolean, Level[], string | null] => {
  const { getCourseLevels, setCourseLevels } = useLevelStore();

  const [loading, setLoading] = useState(false);
  const [error, setError] = useState<string | null>(null);
  const [initialized, setInitialized] = useState(false);

  const levels = getCourseLevels(courseId);

  useEffect(() => {
    // If levels are already in cache or no courseId, don't fetch
    if (levels.length > 0 || !courseId) {
      setInitialized(true);
      return;
    }

    const fetchCourseLevels = async () => {
      setLoading(true);
      setError(null);

      const [levels, error] = await LevelService.getCourseLevels(courseId);
      if (levels) {
        setCourseLevels(courseId, levels);
      } else {
        setError(error || "Failed to fetch course levels");
      }

      setLoading(false);
      setInitialized(true);
    };

    fetchCourseLevels();
  }, [courseId, levels.length, setCourseLevels]);

  // Don't return data until first fetch attempt is complete
  if (!initialized) {
    return [true, [], null];
  }

  return [loading, levels, error];
};
