import { apolloClient } from "@/lib/apollo/apollo-client";
import { Course, CourseCategory } from "./course-service";
import { GENERATE_COURSE_FROM_FILE_MUTATION, GENERATE_COURSE_FROM_TEXT_MUTATION, GET_COURSE_GENERATION_STATUS_QUERY, PREVIEW_GENERATED_COURSE_QUERY } from "@/lib/graphql";
import { formatResult } from "@/lib/utils/service.utils";
import { Chapter } from "./chapter-service";
import { Level } from "./level-service";

// Types
export type GenerationJobStatus = "pending" | "processing" | "completed" | "failed";

// DTOs (Outputs)
export interface CourseGenerationStatus {
  jobId: string;
  status: GenerationJobStatus;
  fileId?: string;
  content?: string;
  title: string;
  description: string;
  category: string;
  lang: string;
  progress: number;
  message?: string;
  error?: string;
  courseId?: string;
  createdAt: string;
  completedAt?: string;
  updatedAt?: string;
}

export interface GeneratedCoursePreview {
    course: Course;
    chapterCount: number;
    sampleChapters: Chapter[];
    sampleLevel?: Level;
}

// Inputs
export interface GenerateCourseFromFileInput {
    fileId: string;
    title?: string;
    description?: string;
    category?: CourseCategory;
    lang?: string;
}
export interface GenerateCourseFromTextInput {
    content: string;
    title?: string;
    description?: string;
    category?: CourseCategory;
    lang?: string;
}

// Actions
async function generateCourseFromfile(input: GenerateCourseFromFileInput) {
    const { data, errors } = await apolloClient.mutate<{ generateCourseFromFile: string }>({
        mutation: GENERATE_COURSE_FROM_FILE_MUTATION,
        variables: { input },
        fetchPolicy: "network-only",
    });
    return formatResult<string>(data?.generateCourseFromFile, errors);
}

async function generateCourseFromText(input: GenerateCourseFromTextInput) {
    const { data, errors } = await apolloClient.mutate<{ generateCourseFromText: string }>({
        mutation: GENERATE_COURSE_FROM_TEXT_MUTATION,
        variables: { input },
        fetchPolicy: "network-only",
    });
    return formatResult<string>(data?.generateCourseFromText, errors);
}

async function getCourseGenerationStatus(jobId: string) {
    const { data, errors } = await apolloClient.query<{ courseGenerationStatus: CourseGenerationStatus }>({
        query: GET_COURSE_GENERATION_STATUS_QUERY,
        variables: { jobId },
        fetchPolicy: "network-only",
    });
    return formatResult<CourseGenerationStatus>(data?.courseGenerationStatus, errors);
}

async function getPreviewGeneratedCourse(jobId: string) {
    const { data, errors } = await apolloClient.query<{ previewGeneratedCourse: GeneratedCoursePreview }>({
        query: PREVIEW_GENERATED_COURSE_QUERY,
        variables: { jobId },
        fetchPolicy: "network-only",
    });
    return formatResult<GeneratedCoursePreview>(data?.previewGeneratedCourse, errors);
}

export const AIService = {
  generateCourseFromfile,
  generateCourseFromText,
  getCourseGenerationStatus,
  getPreviewGeneratedCourse,
};