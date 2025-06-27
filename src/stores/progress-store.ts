import { create } from "zustand";

import { CourseProgress } from "@/services/progress-service";

interface ProgressState {
  // Cache storage only
  courseProgress: Record<string, CourseProgress>; // courseId -> CourseProgress
  playingCourses: string[]; // courseIds[]
  completedCourses: string[]; // courseIds[]

  // Actions
  setCourseProgress: (progress: CourseProgress) => void;
  setPlayingCourses: (courses: CourseProgress[]) => void;
  setCompletedCourses: (courses: CourseProgress[]) => void;
  updateCourseProgress: (courseId: string, updates: Partial<CourseProgress>) => void;
  getCourseProgress: (courseId: string) => CourseProgress | undefined;
  getPlayingCourses: () => CourseProgress[];
  getCompletedCourses: () => CourseProgress[];
  clearCourseProgress: (courseId: string) => void;
  clearPlayingCourses: () => void;
  clearCompletedCourses: () => void;
  clearAll: () => void;
}

export const useProgressStore = create<ProgressState>((set, get) => ({
  courseProgress: {},
  playingCourses: [],
  completedCourses: [],

  setCourseProgress: (progress) =>
    set((state) => ({
      courseProgress: { ...state.courseProgress, [progress.courseId]: progress },
    })),

  setPlayingCourses: (courses) =>
    set((state) => {
      const courseIds = courses.map((course) => course.courseId);
      const newCourseProgress = { ...state.courseProgress };

      // Store individual progress in cache
      courses.forEach((course) => {
        newCourseProgress[course.courseId] = course;
      });

      return {
        courseProgress: newCourseProgress,
        playingCourses: courseIds,
      };
    }),

  setCompletedCourses: (courses) =>
    set((state) => {
      const courseIds = courses.map((course) => course.courseId);
      const newCourseProgress = { ...state.courseProgress };

      // Store individual progress in cache
      courses.forEach((course) => {
        newCourseProgress[course.courseId] = course;
      });

      return {
        courseProgress: newCourseProgress,
        completedCourses: courseIds,
      };
    }),

  updateCourseProgress: (courseId, updates) =>
    set((state) => {
      const existingProgress = state.courseProgress[courseId];
      if (!existingProgress) return state;

      const updatedProgress = { ...existingProgress, ...updates };
      return {
        courseProgress: { ...state.courseProgress, [courseId]: updatedProgress },
      };
    }),

  getCourseProgress: (courseId) => get().courseProgress[courseId],

  getPlayingCourses: () => {
    const state = get();
    return state.playingCourses
      .map((id) => state.courseProgress[id])
      .filter(Boolean);
  },

  getCompletedCourses: () => {
    const state = get();
    return state.completedCourses
      .map((id) => state.courseProgress[id])
      .filter(Boolean);
  },

  clearCourseProgress: (courseId) =>
    set((state) => {
      const newCourseProgress = { ...state.courseProgress };
      delete newCourseProgress[courseId];

      return {
        courseProgress: newCourseProgress,
        playingCourses: state.playingCourses.filter((id) => id !== courseId),
        completedCourses: state.completedCourses.filter((id) => id !== courseId),
      };
    }),

  clearPlayingCourses: () => set({ playingCourses: [] }),

  clearCompletedCourses: () => set({ completedCourses: [] }),

  clearAll: () =>
    set({ courseProgress: {}, playingCourses: [], completedCourses: [] }),
}));