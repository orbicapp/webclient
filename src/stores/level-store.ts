import { create } from "zustand";

import { Level } from "@/services/level-service";

interface LevelState {
  // Cache storage only
  levels: Record<string, Level>; // levelId -> Level
  chapterLevels: Record<string, string[]>; // chapterId -> levelIds[]
  courseLevels: Record<string, string[]>; // courseId -> levelIds[]
  
  // ✅ Initialization flags
  levelInitialized: Record<string, boolean>; // levelId -> boolean
  chapterLevelsInitialized: Record<string, boolean>; // chapterId -> boolean
  courseLevelsInitialized: Record<string, boolean>; // courseId -> boolean

  // Actions
  setLevel: (level: Level) => void;
  setLevels: (levels: Level[]) => void;
  setChapterLevels: (chapterId: string, levels: Level[]) => void;
  setCourseLevels: (courseId: string, levels: Level[]) => void;
  getLevel: (levelId: string | undefined) => Level | undefined;
  getChapterLevels: (chapterId: string | undefined) => Level[];
  getCourseLevels: (courseId: string | undefined) => Level[];
  
  // ✅ Initialization methods
  isLevelInitialized: (levelId: string) => boolean;
  isChapterLevelsInitialized: (chapterId: string) => boolean;
  isCourseLevelsInitialized: (courseId: string) => boolean;
  
  clearLevel: (levelId: string) => void;
  clearChapterLevels: (chapterId: string) => void;
  clearCourseLevels: (courseId: string) => void;
  clearAll: () => void;
}

export const useLevelStore = create<LevelState>((set, get) => ({
  levels: {},
  chapterLevels: {},
  courseLevels: {},
  
  // ✅ Initialize flags
  levelInitialized: {},
  chapterLevelsInitialized: {},
  courseLevelsInitialized: {},

  setLevel: (level) =>
    set((state) => ({
      levels: { ...state.levels, [level._id]: level },
      levelInitialized: { ...state.levelInitialized, [level._id]: true },
    })),

  setLevels: (levels) =>
    set((state) => {
      const newLevels = { ...state.levels };
      const newLevelInitialized = { ...state.levelInitialized };
      
      levels.forEach((level) => {
        newLevels[level._id] = level;
        newLevelInitialized[level._id] = true;
      });
      
      return { 
        levels: newLevels,
        levelInitialized: newLevelInitialized,
      };
    }),

  setChapterLevels: (chapterId, levels) =>
    set((state) => {
      const levelIds = levels.map((level) => level._id);
      const newLevels = { ...state.levels };
      const newLevelInitialized = { ...state.levelInitialized };

      // Store individual levels in cache
      levels.forEach((level) => {
        newLevels[level._id] = level;
        newLevelInitialized[level._id] = true;
      });

      return {
        levels: newLevels,
        levelInitialized: newLevelInitialized,
        chapterLevels: { ...state.chapterLevels, [chapterId]: levelIds },
        chapterLevelsInitialized: { ...state.chapterLevelsInitialized, [chapterId]: true }, // ✅ Mark as initialized
      };
    }),

  setCourseLevels: (courseId, levels) =>
    set((state) => {
      const levelIds = levels.map((level) => level._id);
      const newLevels = { ...state.levels };
      const newLevelInitialized = { ...state.levelInitialized };

      // Store individual levels in cache
      levels.forEach((level) => {
        newLevels[level._id] = level;
        newLevelInitialized[level._id] = true;
      });

      return {
        levels: newLevels,
        levelInitialized: newLevelInitialized,
        courseLevels: { ...state.courseLevels, [courseId]: levelIds },
        courseLevelsInitialized: { ...state.courseLevelsInitialized, [courseId]: true }, // ✅ Mark as initialized
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

  // ✅ Initialization getters
  isLevelInitialized: (levelId) => get().levelInitialized[levelId] || false,
  isChapterLevelsInitialized: (chapterId) => get().chapterLevelsInitialized[chapterId] || false,
  isCourseLevelsInitialized: (courseId) => get().courseLevelsInitialized[courseId] || false,

  clearLevel: (levelId) =>
    set((state) => {
      const newLevels = { ...state.levels };
      const newLevelInitialized = { ...state.levelInitialized };
      delete newLevels[levelId];
      delete newLevelInitialized[levelId];
      
      return { 
        levels: newLevels,
        levelInitialized: newLevelInitialized,
      };
    }),

  clearChapterLevels: (chapterId) =>
    set((state) => {
      const newChapterLevels = { ...state.chapterLevels };
      const newChapterLevelsInitialized = { ...state.chapterLevelsInitialized };
      delete newChapterLevels[chapterId];
      delete newChapterLevelsInitialized[chapterId];
      
      return { 
        chapterLevels: newChapterLevels,
        chapterLevelsInitialized: newChapterLevelsInitialized,
      };
    }),

  clearCourseLevels: (courseId) =>
    set((state) => {
      const newCourseLevels = { ...state.courseLevels };
      const newCourseLevelsInitialized = { ...state.courseLevelsInitialized };
      delete newCourseLevels[courseId];
      delete newCourseLevelsInitialized[courseId];
      
      return { 
        courseLevels: newCourseLevels,
        courseLevelsInitialized: newCourseLevelsInitialized,
      };
    }),

  clearAll: () => set({ 
    levels: {}, 
    chapterLevels: {}, 
    courseLevels: {},
    levelInitialized: {},
    chapterLevelsInitialized: {},
    courseLevelsInitialized: {},
  }),
}));