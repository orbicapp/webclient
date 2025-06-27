import { create } from "zustand";

import { Level } from "@/services/level-service";

interface LevelState {
  // Cache storage only
  levels: Record<string, Level>; // levelId -> Level
  chapterLevels: Record<string, string[]>; // chapterId -> levelIds[]
  courseLevels: Record<string, string[]>; // courseId -> levelIds[]

  // Actions
  setLevel: (level: Level) => void;
  setLevels: (levels: Level[]) => void;
  setChapterLevels: (chapterId: string, levels: Level[]) => void;
  setCourseLevels: (courseId: string, levels: Level[]) => void;
  getLevel: (levelId: string | undefined) => Level | undefined;
  getChapterLevels: (chapterId: string | undefined) => Level[];
  getCourseLevels: (courseId: string | undefined) => Level[];
  clearLevel: (levelId: string) => void;
  clearChapterLevels: (chapterId: string) => void;
  clearCourseLevels: (courseId: string) => void;
  clearAll: () => void;
}

export const useLevelStore = create<LevelState>((set, get) => ({
  levels: {},
  chapterLevels: {},
  courseLevels: {},

  setLevel: (level) =>
    set((state) => ({
      levels: { ...state.levels, [level._id]: level },
    })),

  setLevels: (levels) =>
    set((state) => {
      const newLevels = { ...state.levels };
      levels.forEach((level) => {
        newLevels[level._id] = level;
      });
      return { levels: newLevels };
    }),

  setChapterLevels: (chapterId, levels) =>
    set((state) => {
      const levelIds = levels.map((level) => level._id);
      const newLevels = { ...state.levels };

      // Store individual levels in cache
      levels.forEach((level) => {
        newLevels[level._id] = level;
      });

      return {
        levels: newLevels,
        chapterLevels: { ...state.chapterLevels, [chapterId]: levelIds },
      };
    }),

  setCourseLevels: (courseId, levels) =>
    set((state) => {
      const levelIds = levels.map((level) => level._id);
      const newLevels = { ...state.levels };

      // Store individual levels in cache
      levels.forEach((level) => {
        newLevels[level._id] = level;
      });

      return {
        levels: newLevels,
        courseLevels: { ...state.courseLevels, [courseId]: levelIds },
      };
    }),

  getLevel: (levelId) => levelId ? get().levels[levelId] : undefined,

  getChapterLevels: (chapterId) => {
    if (!chapterId) return [];

    const state = get();
    const levelIds = state.chapterLevels[chapterId] || [];
    return levelIds.map((id) => state.levels[id]).filter(Boolean);
  },

  getCourseLevels: (courseId) => {
    if (!courseId) return [];

    const state = get();
    const levelIds = state.courseLevels[courseId] || [];
    return levelIds.map((id) => state.levels[id]).filter(Boolean);
  },

  clearLevel: (levelId) =>
    set((state) => {
      const newLevels = { ...state.levels };
      delete newLevels[levelId];
      return { levels: newLevels };
    }),

  clearChapterLevels: (chapterId) =>
    set((state) => {
      const newChapterLevels = { ...state.chapterLevels };
      delete newChapterLevels[chapterId];
      return { chapterLevels: newChapterLevels };
    }),

  clearCourseLevels: (courseId) =>
    set((state) => {
      const newCourseLevels = { ...state.courseLevels };
      delete newCourseLevels[courseId];
      return { courseLevels: newCourseLevels };
    }),

  clearAll: () => set({ levels: {}, chapterLevels: {}, courseLevels: {} }),
}));
