import { create } from "zustand";

import { Chapter } from "@/services/chapter-service";

interface ChapterState {
  // Cache storage only
  chapters: Record<string, Chapter>; // chapterId -> Chapter
  courseChapters: Record<string, string[]>; // courseId -> chapterIds[]
  
  // ✅ Initialization flags
  chapterInitialized: Record<string, boolean>; // chapterId -> boolean
  courseChaptersInitialized: Record<string, boolean>; // courseId -> boolean

  // Actions
  setChapter: (chapter: Chapter) => void;
  setChapters: (chapters: Chapter[]) => void;
  setCourseChapters: (courseId: string, chapters: Chapter[]) => void;
  getChapter: (chapterId: string) => Chapter | undefined;
  getCourseChapters: (courseId: string) => Chapter[];
  
  // ✅ Initialization methods
  isChapterInitialized: (chapterId: string) => boolean;
  isCourseChaptersInitialized: (courseId: string) => boolean;
  
  clearChapter: (chapterId: string) => void;
  clearCourseChapters: (courseId: string) => void;
  clearAll: () => void;
}

export const useChapterStore = create<ChapterState>((set, get) => ({
  chapters: {},
  courseChapters: {},
  
  // ✅ Initialize flags
  chapterInitialized: {},
  courseChaptersInitialized: {},

  setChapter: (chapter) =>
    set((state) => ({
      chapters: { ...state.chapters, [chapter._id]: chapter },
      chapterInitialized: { ...state.chapterInitialized, [chapter._id]: true },
    })),

  setChapters: (chapters) =>
    set((state) => {
      const newChapters = { ...state.chapters };
      const newChapterInitialized = { ...state.chapterInitialized };
      
      chapters.forEach((chapter) => {
        newChapters[chapter._id] = chapter;
        newChapterInitialized[chapter._id] = true;
      });
      
      return { 
        chapters: newChapters,
        chapterInitialized: newChapterInitialized,
      };
    }),

  setCourseChapters: (courseId, chapters) =>
    set((state) => {
      const chapterIds = chapters.map((chapter) => chapter._id);
      const newChapters = { ...state.chapters };
      const newChapterInitialized = { ...state.chapterInitialized };

      // Store individual chapters in cache
      chapters.forEach((chapter) => {
        newChapters[chapter._id] = chapter;
        newChapterInitialized[chapter._id] = true;
      });

      return {
        chapters: newChapters,
        chapterInitialized: newChapterInitialized,
        courseChapters: { ...state.courseChapters, [courseId]: chapterIds },
        courseChaptersInitialized: { ...state.courseChaptersInitialized, [courseId]: true }, // ✅ Mark as initialized
      };
    }),

  getChapter: (chapterId) => get().chapters[chapterId],

  getCourseChapters: (courseId) => {
    const state = get();
    const chapterIds = state.courseChapters[courseId] || [];
    return chapterIds.map((id) => state.chapters[id]).filter(Boolean);
  },

  // ✅ Initialization getters
  isChapterInitialized: (chapterId) => get().chapterInitialized[chapterId] || false,
  isCourseChaptersInitialized: (courseId) => get().courseChaptersInitialized[courseId] || false,

  clearChapter: (chapterId) =>
    set((state) => {
      const newChapters = { ...state.chapters };
      const newChapterInitialized = { ...state.chapterInitialized };
      delete newChapters[chapterId];
      delete newChapterInitialized[chapterId];
      
      return { 
        chapters: newChapters,
        chapterInitialized: newChapterInitialized,
      };
    }),

  clearCourseChapters: (courseId) =>
    set((state) => {
      const newCourseChapters = { ...state.courseChapters };
      const newCourseChaptersInitialized = { ...state.courseChaptersInitialized };
      delete newCourseChapters[courseId];
      delete newCourseChaptersInitialized[courseId];
      
      return { 
        courseChapters: newCourseChapters,
        courseChaptersInitialized: newCourseChaptersInitialized,
      };
    }),

  clearAll: () => set({ 
    chapters: {}, 
    courseChapters: {},
    chapterInitialized: {},
    courseChaptersInitialized: {},
  }),
}));