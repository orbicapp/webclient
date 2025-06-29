import { apolloClient } from "../lib/apollo/apollo-client";
import { GET_COURSE_LEVELS_QUERY, GET_LEVEL_QUERY, GET_CHAPTER_LEVELS_QUERY } from "../lib/graphql";
import { formatResult } from "../lib/utils/service.utils";

// Types
export interface TrueFalseQuestion {
  type: "TRUE_FALSE";
  question: string;
  correctAnswer: boolean;
}

export interface MultipleChoiceQuestion {
  type: "MULTIPLE_CHOICE";
  question: string;
  options: { text: string; isCorrect: boolean }[];
}

export interface PairsQuestion {
  type: "PAIRS";
  question: string;
  pairs: { left: string; right: string }[];
}

export interface SequenceQuestion {
  type: "SEQUENCE";
  question: string;
  correctSequence: string[];
}

export interface FreeChoiceQuestion {
  type: "FREE_CHOICE";
  question: string;
  acceptedAnswers: string[];
}

export type QuestionUnion =
  | TrueFalseQuestion
  | MultipleChoiceQuestion
  | PairsQuestion
  | SequenceQuestion
  | FreeChoiceQuestion;

// DTOs (Outputs)
export interface Level {
    _id: string;
    title: string;
    description: string;
    chapterId: string;
    courseId: string;
    order: number;
    questions: QuestionUnion[];
    createdAt: string;
    updatedAt: string;
}

// Actions
 async function getLevel(levelId: string) {
    const { data, errors } = await apolloClient.query<{ level: Level }>({
      query: GET_LEVEL_QUERY,
      variables: { id: levelId },
      fetchPolicy: "network-only",
    });

    return formatResult<Level>(data?.level, errors);
}

 async function getChapterLevels(chapterId: string) {
    const { data, errors } = await apolloClient.query<{
      chapterLevels: Level[];
    }>({
      query: GET_CHAPTER_LEVELS_QUERY,
      variables: { chapterId },
      fetchPolicy: "network-only",
    });

    return formatResult<Level[]>(data?.chapterLevels, errors);
}

 async function getCourseLevels(courseId: string) {
  const { data, errors } = await apolloClient.query<{ courseLevels: Level[] }>({
    query: GET_COURSE_LEVELS_QUERY,
    variables: { courseId },
    fetchPolicy: "network-only",
  });

  return formatResult<Level[]>(data?.courseLevels, errors);
}

export const LevelService = {
  getLevel,
  getChapterLevels,
  getCourseLevels,
};