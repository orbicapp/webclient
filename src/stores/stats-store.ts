import { create } from "zustand";

import { UserStats } from "@/services/stats-service";

interface StatsState {
  // Cache storage only
  userStats: UserStats | null;
  lastUpdated: string | null;
  initialized: boolean; // ✅ Add initialized flag

  // Actions
  setUserStats: (stats: UserStats) => void;
  updateUserStats: (updates: Partial<UserStats>) => void;
  getUserStats: () => UserStats | null;
  getLastUpdated: () => string | null;
  clearUserStats: () => void;
  isStale: (maxAgeMinutes?: number) => boolean;
  setInitialized: (initialized: boolean) => void; // ✅ Add setter
  isInitialized: () => boolean; // ✅ Add getter
}

export const useStatsStore = create<StatsState>((set, get) => ({
  userStats: null,
  lastUpdated: null,
  initialized: false, // ✅ Start as false

  setUserStats: (stats) =>
    set({
      userStats: stats,
      lastUpdated: new Date().toISOString(),
      initialized: true, // ✅ Mark as initialized when data is set
    }),

  updateUserStats: (updates) =>
    set((state) => {
      if (!state.userStats) return state;

      return {
        userStats: { ...state.userStats, ...updates },
        lastUpdated: new Date().toISOString(),
        initialized: true, // ✅ Keep initialized
      };
    }),

  getUserStats: () => get().userStats,

  getLastUpdated: () => get().lastUpdated,

  setInitialized: (initialized) => set({ initialized }),

  isInitialized: () => get().initialized,

  clearUserStats: () => set({ 
    userStats: null, 
    lastUpdated: null, 
    initialized: false // ✅ Reset initialized when clearing
  }),

  isStale: (maxAgeMinutes = 30) => {
    const state = get();
    if (!state.lastUpdated || !state.initialized) return true;

    const lastUpdate = new Date(state.lastUpdated);
    const now = new Date();
    const diffMinutes = (now.getTime() - lastUpdate.getTime()) / (1000 * 60);

    return diffMinutes > maxAgeMinutes;
  },
}));