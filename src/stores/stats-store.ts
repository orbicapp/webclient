import { create } from "zustand";

import { UserStats } from "@/services/stats-service";

interface StatsState {
  // Cache storage only
  userStats: UserStats | null;
  lastUpdated: string | null;

  // Actions
  setUserStats: (stats: UserStats) => void;
  updateUserStats: (updates: Partial<UserStats>) => void;
  getUserStats: () => UserStats | null;
  getLastUpdated: () => string | null;
  clearUserStats: () => void;
  isStale: (maxAgeMinutes?: number) => boolean;
}

export const useStatsStore = create<StatsState>((set, get) => ({
  userStats: null,
  lastUpdated: null,

  setUserStats: (stats) =>
    set({
      userStats: stats,
      lastUpdated: new Date().toISOString(),
    }),

  updateUserStats: (updates) =>
    set((state) => {
      if (!state.userStats) return state;

      return {
        userStats: { ...state.userStats, ...updates },
        lastUpdated: new Date().toISOString(),
      };
    }),

  getUserStats: () => get().userStats,

  getLastUpdated: () => get().lastUpdated,

  clearUserStats: () => set({ userStats: null, lastUpdated: null }),

  isStale: (maxAgeMinutes = 30) => {
    const state = get();
    if (!state.lastUpdated) return true;

    const lastUpdate = new Date(state.lastUpdated);
    const now = new Date();
    const diffMinutes = (now.getTime() - lastUpdate.getTime()) / (1000 * 60);

    return diffMinutes > maxAgeMinutes;
  },
}));