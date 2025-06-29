import { create } from "zustand";

import { Course } from "@/services/course-service";

interface CourseState {
  // Cache storage only
  courses: Record<string, Course>; // courseId -> Course
  searchResults: Record<string, string[]>; // searchKey -> courseIds[]
  
  // ✅ Initialization flags
  searchInitialized: Record<string, boolean>; // searchKey -> boolean
  courseInitialized: Record<string, boolean>; // courseId -> boolean

  // Actions
  setCourse: (course: Course) => void;
  setCourses: (courses: Course[]) => void;
  setSearchResult: (searchKey: string, courses: Course[]) => void;
  getCourse: (courseId: string) => Course | undefined;
  getSearchResults: (searchKey: string) => Course[];
  
  // ✅ Initialization methods
  isSearchInitialized: (searchKey: string) => boolean;
  isCourseInitialized: (courseId: string) => boolean;
  
  clearCourse: (courseId: string) => void;
  clearSearchResults: (searchKey: string) => void;
  clearAll: () => void;
}

export const useCourseStore = create<CourseState>((set, get) => ({
  courses: {},
  searchResults: {},
  
  // ✅ Initialize flags
  searchInitialized: {},
  courseInitialized: {},

  setCourse: (course) =>
    set((state) => ({
      courses: { ...state.courses, [course._id]: course },
      courseInitialized: { ...state.courseInitialized, [course._id]: true },
    })),

  setCourses: (courses) =>
    set((state) => {
      const newCourses = { ...state.courses };
      const newCourseInitialized = { ...state.courseInitialized };
      
      courses.forEach((course) => {
        newCourses[course._id] = course;
        newCourseInitialized[course._id] = true;
      });
      
      return { 
        courses: newCourses,
        courseInitialized: newCourseInitialized,
      };
    }),

  setSearchResult: (searchKey, courses) =>
    set((state) => {
      const courseIds = courses.map((course) => course._id);
      const newCourses = { ...state.courses };
      const newCourseInitialized = { ...state.courseInitialized };

      // Store individual courses in cache
      courses.forEach((course) => {
        newCourses[course._id] = course;
        newCourseInitialized[course._id] = true;
      });

      return {
        courses: newCourses,
        courseInitialized: newCourseInitialized,
        searchResults: { ...state.searchResults, [searchKey]: courseIds },
        searchInitialized: { ...state.searchInitialized, [searchKey]: true }, // ✅ Mark search as initialized
      };
    }),

  getCourse: (courseId) => get().courses[courseId],

  getSearchResults: (searchKey) => {
    const state = get();
    const courseIds = state.searchResults[searchKey] || [];
    return courseIds.map((id) => state.courses[id]).filter(Boolean);
  },

  // ✅ Initialization getters
  isSearchInitialized: (searchKey) => get().searchInitialized[searchKey] || false,
  isCourseInitialized: (courseId) => get().courseInitialized[courseId] || false,

  clearCourse: (courseId) =>
    set((state) => {
      const newCourses = { ...state.courses };
      const newCourseInitialized = { ...state.courseInitialized };
      delete newCourses[courseId];
      delete newCourseInitialized[courseId];
      
      return { 
        courses: newCourses,
        courseInitialized: newCourseInitialized,
      };
    }),

  clearSearchResults: (searchKey) =>
    set((state) => {
      const newSearchResults = { ...state.searchResults };
      const newSearchInitialized = { ...state.searchInitialized };
      delete newSearchResults[searchKey];
      delete newSearchInitialized[searchKey];
      
      return { 
        searchResults: newSearchResults,
        searchInitialized: newSearchInitialized,
      };
    }),

  clearAll: () => set({ 
    courses: {}, 
    searchResults: {},
    searchInitialized: {},
    courseInitialized: {},
  }),
}));