import { GET_MY_STATS_QUERY } from "@/lib/graphql";
import { CourseCategory } from "./course-service";
import { apolloClient } from "@/lib/apollo/apollo-client";
import { formatResult } from "@/lib/utils/service.utils";

// DTOs (Outputs)
export interface CategoryStats {
  category: CourseCategory;
  coursesCompleted: number;
  levelsCompleted: number;
  totalStars: number;
  totalScore: number;
}

export interface DailyActivity {
  date: string; // Date
  levelsCompleted: number;
  timeSpent: number;
  starsEarned: number;
  score: number;
}

export interface UserStats {
  totalCoursesCompleted: number;
  totalLevelsCompleted: number;
  totalTimeSpent: number;
  totalLivesLost: number;
  totalStarsEarned: number;
  totalScore: number;
  currentSteak: number;
  longestStreak: number;
  categoryStats: CategoryStats[];
  dailyActivity: DailyActivity[];
}

// Actions
async function getMyStats() {
  const { data, errors } = await apolloClient.query<{ myStats: UserStats }>({
    query: GET_MY_STATS_QUERY,
    fetchPolicy: "network-only",
  });

  return formatResult<UserStats>(data?.myStats, errors);
}

export const StatsService = { getMyStats };
