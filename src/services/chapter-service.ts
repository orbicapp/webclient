import { apolloClient } from "../lib/apollo/apollo-client";
import { GET_CHAPTER_QUERY, GET_COURSE_CHAPTERS_QUERY } from "../lib/graphql";
import { formatResult } from "../lib/utils/service.utils";

// DTOs (Outputs)
export interface Chapter {
    _id: string;
    title: string;
    description: string;
    courseId: string;
    order: number;
    levelsCount: number;
    createdAt: string;
    updatedAt: string;
}

// Actions
 async function getChapter(chapterId: string) {
    const { data, errors } = await apolloClient.query<{ chapter: Chapter }>({
      query: GET_CHAPTER_QUERY,
      variables: { id: chapterId },
      fetchPolicy: "network-only",
    });

    return formatResult<Chapter>(data?.chapter, errors);
}

 async function getCourseChapters(courseId: string) {
    const { data, errors } = await apolloClient.query<{
      courseChapters: Chapter[];
    }>({
      query: GET_COURSE_CHAPTERS_QUERY,
      variables: { courseId },
      fetchPolicy: "network-only",
    });

    return formatResult<Chapter[]>(data?.courseChapters, errors);
}

export const ChapterService = { getChapter, getCourseChapters };