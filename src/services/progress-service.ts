import { apolloClient } from "../lib/apollo/apollo-client";
import {
  GET_COURSE_PROGRESS_QUERY,
  GET_MY_COURSES_WITH_PROGRESS_QUERY,
  GET_MY_PLAYING_COURSES_QUERY,
} from "../lib/graphql";
import { formatResult } from "../lib/utils/service.utils";
import { Course } from "./course-service";

// DTOs
export interface LevelProgress {
  levelId: string;
  completed: boolean;
  score: number;
  maxScore: number;
  attempts: number;
  completedAt?: string;
}

export interface CourseProgress {
  _id: string;
  userId: string;
  courseId: string;
  currentChapter: number;
  currentLevel: number;
  levelProgress: LevelProgress[];
  totalScore: number;
  totalMaxScore: number;
  completed: boolean;
  createdAt: string;
  updatedAt: string;
}

export interface CourseWithProgress {
  course: Course;
  progress: CourseProgress;
}

// Actions
async function getCourseProgress(courseId: string) {
  const { data, errors } = await apolloClient.query<{
    courseProgress: CourseProgress;
  }>({
    query: GET_COURSE_PROGRESS_QUERY,
    variables: { courseId },
    fetchPolicy: "network-only",
  });

  return formatResult<CourseProgress>(data?.courseProgress, errors);
}

async function getMyPlayingCourses() {
  const { data, errors } = await apolloClient.query<{
    myPlayingCourses: CourseProgress[];
  }>({
    query: GET_MY_PLAYING_COURSES_QUERY,
    fetchPolicy: "network-only",
  });

  return formatResult<CourseProgress[]>(data?.myPlayingCourses, errors);
}

async function getMyCompletedCourses() {
  const { data, errors } = await apolloClient.query<{
    myCompletedCourses: CourseProgress[];
  }>({
    query: GET_MY_PLAYING_COURSES_QUERY,
    fetchPolicy: "network-only",
  });

  return formatResult<CourseProgress[]>(data?.myCompletedCourses, errors);
}

async function getMyCoursesWithProgress() {
  const { data, errors } = await apolloClient.query<{
    myCoursesWithProgress: CourseWithProgress[];
  }>({
    query: GET_MY_COURSES_WITH_PROGRESS_QUERY,
    fetchPolicy: "network-only",
  });

  return formatResult<CourseWithProgress[]>(
    data?.myCoursesWithProgress,
    errors
  );
}

export const ProgressService = {
  getCourseProgress,
  getMyPlayingCourses,
  getMyCompletedCourses,
  getMyCoursesWithProgress,
};
