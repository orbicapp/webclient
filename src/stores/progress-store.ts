import { create } from "zustand";

import { CourseProgress } from "@/services/progress-service";

interface ProgressState {
  // Cache storage only
  courseProgress: Record<string, CourseProgress>; // courseId -> CourseProgress
  playingCourses: string[]; // courseIds[]
  completedCourses: string[]; // courseIds[]
  
  // ✅ Initialization flags
  playingCoursesInitialized: boolean;
  completedCoursesInitialized: boolean;
  courseProgressInitialized: Record<string, boolean>; // courseId -> boolean

  // Actions
  setCourseProgress: (progress: CourseProgress) => void;
  setPlayingCourses: (courses: CourseProgress[]) => void;
  setCompletedCourses: (courses: CourseProgress[]) => void;
  updateCourseProgress: (courseId: string, updates: Partial<CourseProgress>) => void;
  getCourseProgress: (courseId: string) => CourseProgress | undefined;
  getPlayingCourses: () => CourseProgress[];
  getCompletedCourses: () => CourseProgress[];
  
  // ✅ Initialization methods
  isPlayingCoursesInitialized: () => boolean;
  isCompletedCoursesInitialized: () => boolean;
  isCourseProgressInitialized: (courseId: string) => boolean;
  
  clearCourseProgress: (courseId: string) => void;
  clearPlayingCourses: () => void;
  clearCompletedCourses: () => void;
  clearAll: () => void;
}

export const useProgressStore = create<ProgressState>((set, get) => ({
  courseProgress: {},
  playingCourses: [],
  completedCourses: [],
  
  // ✅ Initialize flags
  playingCoursesInitialized: false,
  completedCoursesInitialized: false,
  courseProgressInitialized: {},

  setCourseProgress: (progress) =>
    set((state) => ({
      courseProgress: { ...state.courseProgress, [progress.courseId]: progress },
      courseProgressInitialized: { 
        ...state.courseProgressInitialized, 
        [progress.courseId]: true 
      },
    })),

  setPlayingCourses: (courses) =>
    set((state) => {
      const courseIds = courses.map((course) => course.courseId);
      const newCourseProgress = { ...state.courseProgress };
      const newCourseProgressInitialized = { ...state.courseProgressInitialized };

      // Store individual progress in cache
      courses.forEach((course) => {
        newCourseProgress[course.courseId] = course;
        newCourseProgressInitialized[course.courseId] = true;
      });

      return {
        courseProgress: newCourseProgress,
        courseProgressInitialized: newCourseProgressInitialized,
        playingCourses: courseIds,
        playingCoursesInitialized: true, // ✅ Mark as initialized
      };
    }),

  setCompletedCourses: (courses) =>
    set((state) => {
      const courseIds = courses.map((course) => course.courseId);
      const newCourseProgress = { ...state.courseProgress };
      const newCourseProgressInitialized = { ...state.courseProgressInitialized };

      // Store individual progress in cache
      courses.forEach((course) => {
        newCourseProgress[course.courseId] = course;
        newCourseProgressInitialized[course.courseId] = true;
      });

      return {
        courseProgress: newCourseProgress,
        courseProgressInitialized: newCourseProgressInitialized,
        completedCourses: courseIds,
        completedCoursesInitialized: true, // ✅ Mark as initialized
      };
    }),

  updateCourseProgress: (courseId, updates) =>
    set((state) => {
      const existingProgress = state.courseProgress[courseId];
      if (!existingProgress) return state;

      const updatedProgress = { ...existingProgress, ...updates };
      return {
        courseProgress: { ...state.courseProgress, [courseId]: updatedProgress },
        courseProgressInitialized: { 
          ...state.courseProgressInitialized, 
          [courseId]: true 
        },
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

  // ✅ Initialization getters
  isPlayingCoursesInitialized: () => get().playingCoursesInitialized,
  isCompletedCoursesInitialized: () => get().completedCoursesInitialized,
  isCourseProgressInitialized: (courseId) => get().courseProgressInitialized[courseId] || false,

  clearCourseProgress: (courseId) =>
    set((state) => {
      const newCourseProgress = { ...state.courseProgress };
      const newCourseProgressInitialized = { ...state.courseProgressInitialized };
      delete newCourseProgress[courseId];
      delete newCourseProgressInitialized[courseId];

      return {
        courseProgress: newCourseProgress,
        courseProgressInitialized: newCourseProgressInitialized,
        playingCourses: state.playingCourses.filter((id) => id !== courseId),
        completedCourses: state.completedCourses.filter((id) => id !== courseId),
      };
    }),

  clearPlayingCourses: () => set({ 
    playingCourses: [], 
    playingCoursesInitialized: false 
  }),

  clearCompletedCourses: () => set({ 
    completedCourses: [], 
    completedCoursesInitialized: false 
  }),

  clearAll: () =>
    set({ 
      courseProgress: {}, 
      playingCourses: [], 
      completedCourses: [],
      playingCoursesInitialized: false,
      completedCoursesInitialized: false,
      courseProgressInitialized: {},
    }),
}));