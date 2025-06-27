import { apolloClient } from "@/lib/apollo/apollo-client";
import {
  ABANDON_SESSION_MUTATION,
  GET_CURRENT_GAME_SESSION_QUERY,
  START_LEVEL_MUTATION,
  SUBMIT_ANSWER_MUTATION,
} from "@/lib/graphql";
import { formatNullableResult, formatResult } from "@/lib/utils/service.utils";

// Types
export type GameSessionStatus =
  | "active"
  | "completed"
  | "abandoned"
  | "expired";

// Inputs
export interface StartGameSessionInput {
  levelId: string;
}

export interface SubmitAnswerInput {
  sessionId: string;
  questionIndex: number;
  booleanAnswer?: boolean;
  selectedOptionIndex?: boolean;
  pairMatches?: string[];
  sequenceOrder?: string[];
  freeAnswer?: string;
  timeSpent: number;
}

// DTOs (Outputs)
export interface LevelCompletion {
  chapterId: string;
  courseId: string;
  levelId: string;
  score: number;
  maxScore: number;
  stars: number;
  correctAnswers: number;
  totalQuestions: number;
  timeSpent: number;
  isNewHighScore: boolean;
  nextLevelId?: string;
  isChapterCompleted: boolean;
  isCourseCompleted: boolean;
}

export interface QuestionResult {
  isCorrect: boolean;
  livesRemaining: number;
  correctAnswer: string[];
  isLastQuestion: boolean;
}

export interface GameSession {
  _id: string;
  userId: string;
  courseId: string;
  chapterId: string;
  levelId: string;
  lives: number;
  startTime: string; // Date
  endTime?: string; // Date
  status: GameSessionStatus;
  stars: number;
  score: number;
  maxScore: number;
  createdAt: string; // Date
  updatedAt: string; // Date
}

// Actions
async function startLevel(input: StartGameSessionInput) {
  const { data, errors } = await apolloClient.mutate<{
    startLevel: GameSession;
  }>({
    mutation: START_LEVEL_MUTATION,
    variables: { input },
    fetchPolicy: "network-only",
  });
  return formatResult<GameSession>(data?.startLevel, errors);
}

async function submitAnswer(input: SubmitAnswerInput) {
  const { data, errors } = await apolloClient.mutate<{
    submitAnswer: QuestionResult;
  }>({
    mutation: SUBMIT_ANSWER_MUTATION,
    variables: { input },
    fetchPolicy: "network-only",
  });
  return formatResult<QuestionResult>(data?.submitAnswer, errors);
}

async function abandonSession(sessionId: string) {
  const { data, errors } = await apolloClient.mutate<{
    abandonSession: boolean;
  }>({
    mutation: ABANDON_SESSION_MUTATION,
    variables: { sessionId },
    fetchPolicy: "network-only",
  });
  return formatResult<boolean>(data?.abandonSession, errors);
}

async function getCurrentGameSession() {
  const { data, errors } = await apolloClient.query<{
    gameSession?: GameSession;
  }>({
    query: GET_CURRENT_GAME_SESSION_QUERY,
    fetchPolicy: "network-only",
  });

  return formatNullableResult<GameSession>(data?.gameSession, errors);
}

async function getLevelCompletion(sessionId: string) {
  const { data, errors } = await apolloClient.query<{
    levelCompletion: LevelCompletion;
  }>({
    query: GET_CURRENT_GAME_SESSION_QUERY,
    variables: { sessionId },
    fetchPolicy: "network-only",
  });

  return formatResult<LevelCompletion>(data?.levelCompletion, errors);
}

export const GameService = {
  startLevel,
  submitAnswer,
  abandonSession,
  getCurrentGameSession,
  getLevelCompletion,
};
