import { create } from "zustand";

import { Course } from "@/services/course-service";

interface CourseState {
  // Cache storage only
  courses: Record<string, Course>; // courseId -> Course
  searchResults: Record<string, string[]>; // searchKey -> courseIds[]

  // Actions
  setCourse: (course: Course) => void;
  setCourses: (courses: Course[]) => void;
  setSearchResult: (searchKey: string, courses: Course[]) => void;
  getCourse: (courseId: string) => Course | undefined;
  getSearchResults: (searchKey: string) => Course[];
  clearCourse: (courseId: string) => void;
  clearSearchResults: (searchKey: string) => void;
  clearAll: () => void;
}

export const useCourseStore = create<CourseState>((set, get) => ({
  courses: {},
  searchResults: {},

  setCourse: (course) =>
    set((state) => ({
      courses: { ...state.courses, [course._id]: course },
    })),

  setCourses: (courses) =>
    set((state) => {
      const newCourses = { ...state.courses };
      courses.forEach((course) => {
        newCourses[course._id] = course;
      });
      return { courses: newCourses };
    }),

  setSearchResult: (searchKey, courses) =>
    set((state) => {
      const courseIds = courses.map((course) => course._id);
      const newCourses = { ...state.courses };

      // Store individual courses in cache
      courses.forEach((course) => {
        newCourses[course._id] = course;
      });

      return {
        courses: newCourses,
        searchResults: { ...state.searchResults, [searchKey]: courseIds },
      };
    }),

  getCourse: (courseId) => get().courses[courseId],

  getSearchResults: (searchKey) => {
    const state = get();
    const courseIds = state.searchResults[searchKey] || [];
    return courseIds.map((id) => state.courses[id]).filter(Boolean);
  },

  clearCourse: (courseId) =>
    set((state) => {
      const newCourses = { ...state.courses };
      delete newCourses[courseId];
      return { courses: newCourses };
    }),

  clearSearchResults: (searchKey) =>
    set((state) => {
      const newSearchResults = { ...state.searchResults };
      delete newSearchResults[searchKey];
      return { searchResults: newSearchResults };
    }),

  clearAll: () => set({ courses: {}, searchResults: {} }),
}));
