import { create } from "zustand";

import { Chapter } from "@/services/chapter-service";

interface ChapterState {
  // Cache storage only
  chapters: Record<string, Chapter>; // chapterId -> Chapter
  courseChapters: Record<string, string[]>; // courseId -> chapterIds[]

  // Actions
  setChapter: (chapter: Chapter) => void;
  setChapters: (chapters: Chapter[]) => void;
  setCourseChapters: (courseId: string, chapters: Chapter[]) => void;
  getChapter: (chapterId: string) => Chapter | undefined;
  getCourseChapters: (courseId: string) => Chapter[];
  clearChapter: (chapterId: string) => void;
  clearCourseChapters: (courseId: string) => void;
  clearAll: () => void;
}

export const useChapterStore = create<ChapterState>((set, get) => ({
  chapters: {},
  courseChapters: {},

  setChapter: (chapter) =>
    set((state) => ({
      chapters: { ...state.chapters, [chapter._id]: chapter },
    })),

  setChapters: (chapters) =>
    set((state) => {
      const newChapters = { ...state.chapters };
      chapters.forEach((chapter) => {
        newChapters[chapter._id] = chapter;
      });
      return { chapters: newChapters };
    }),

  setCourseChapters: (courseId, chapters) =>
    set((state) => {
      const chapterIds = chapters.map((chapter) => chapter._id);
      const newChapters = { ...state.chapters };

      // Store individual chapters in cache
      chapters.forEach((chapter) => {
        newChapters[chapter._id] = chapter;
      });

      return {
        chapters: newChapters,
        courseChapters: { ...state.courseChapters, [courseId]: chapterIds },
      };
    }),

  getChapter: (chapterId) => get().chapters[chapterId],

  getCourseChapters: (courseId) => {
    const state = get();
    const chapterIds = state.courseChapters[courseId] || [];
    return chapterIds.map((id) => state.chapters[id]).filter(Boolean);
  },

  clearChapter: (chapterId) =>
    set((state) => {
      const newChapters = { ...state.chapters };
      delete newChapters[chapterId];
      return { chapters: newChapters };
    }),

  clearCourseChapters: (courseId) =>
    set((state) => {
      const newCourseChapters = { ...state.courseChapters };
      delete newCourseChapters[courseId];
      return { courseChapters: newCourseChapters };
    }),

  clearAll: () => set({ chapters: {}, courseChapters: {} }),
}));
