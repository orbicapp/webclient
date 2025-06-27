import { apolloClient } from "../lib/apollo/apollo-client";
import {
  GET_COURSE_QUERY,
  GET_COURSES_QUERY,
  GET_MY_COURSES_QUERY,
} from "../lib/graphql";
import { formatResult } from "../lib/utils/service.utils";

// Types
export type CourseCategory =
  | "mathematics"
  | "science"
  | "technology"
  | "language"
  | "history"
  | "art"
  | "business"
  | "health"
  | "other";

export type CourseVisibility = "public" | "private" | "link-only";

// DTOs (Outputs)
export interface Course {
  _id: string;
  author: string;
  title: string;
  description: string;
  lang: string;
  category: CourseCategory;
  chaptersCount: number;
  thumbnailId?: string;
  bannerId?: string;
  visibility: CourseVisibility;
  createdAt: string;
  updatedAt: string;
}

export interface CoursesConnection {
  courses: Course[];
  total: number;
  limit: number;
  offset: number;
  hasMore: boolean;
}

// Inputs
export interface CourseFilterInput {
  search?: string;
  category?: CourseCategory;
  visibility?: CourseVisibility;
  author?: string;
  lang?: string;
}

// Actions
async function getCourse(id: string) {
  const { data, errors } = await apolloClient.query<{
    course: Course;
  }>({
    query: GET_COURSE_QUERY,
    variables: { id },
    fetchPolicy: "network-only",
  });

  return formatResult<Course>(data?.course, errors);
}

async function getCourses(
  filter?: CourseFilterInput,
  limit?: number,
  offset?: number
) {
  const { data, errors } = await apolloClient.query<{
    courses: CoursesConnection;
  }>({
    query: GET_COURSES_QUERY,
    variables: { filter, limit, offset },
    fetchPolicy: "network-only",
  });

  return formatResult<CoursesConnection>(data?.courses, errors);
}

async function getMyCourses(
  filter?: CourseFilterInput,
  limit?: number,
  offset?: number
) {
  const { data, errors } = await apolloClient.query<{
    myCourses: CoursesConnection;
  }>({
    query: GET_MY_COURSES_QUERY,
    variables: { filter, limit, offset },
    fetchPolicy: "network-only",
  });

  return formatResult<CoursesConnection>(data?.myCourses, errors);
}

export const CourseService = { getCourse, getCourses, getMyCourses };
