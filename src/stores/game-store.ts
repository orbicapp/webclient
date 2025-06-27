import { create } from "zustand";

import { GameSession } from "@/services/game-service";

interface GameState {
  // Cache storage only
  sessions: Record<string, GameSession>; // sessionId -> GameSession
  currentSession: GameSession | null;

  // Actions
  setSession: (session: GameSession) => void;
  setCurrentSession: (session: GameSession | null) => void;
  updateSession: (sessionId: string, updates: Partial<GameSession>) => void;
  getCurrentSession: () => GameSession | null;
  getSession: (sessionId: string) => GameSession | undefined;
  clearSession: (sessionId: string) => void;
  clearCurrentSession: () => void;
  clearAll: () => void;
}

export const useGameStore = create<GameState>((set, get) => ({
  sessions: {},
  currentSession: null,

  setSession: (session) =>
    set((state) => ({
      sessions: { ...state.sessions, [session._id]: session },
    })),

  setCurrentSession: (session) =>
    set((state) => {
      const newState = { currentSession: session };
      if (session) {
        return {
          ...newState,
          sessions: { ...state.sessions, [session._id]: session },
        };
      }
      return newState;
    }),

  updateSession: (sessionId, updates) =>
    set((state) => {
      const existingSession = state.sessions[sessionId];
      if (!existingSession) return state;

      const updatedSession = { ...existingSession, ...updates };
      const newSessions = { ...state.sessions, [sessionId]: updatedSession };

      return {
        sessions: newSessions,
        currentSession:
          state.currentSession?._id === sessionId
            ? updatedSession
            : state.currentSession,
      };
    }),

  getCurrentSession: () => get().currentSession,

  getSession: (sessionId) => get().sessions[sessionId],

  clearSession: (sessionId) =>
    set((state) => {
      const newSessions = { ...state.sessions };
      delete newSessions[sessionId];

      return {
        sessions: newSessions,
        currentSession:
          state.currentSession?._id === sessionId
            ? null
            : state.currentSession,
      };
    }),

  clearCurrentSession: () => set({ currentSession: null }),

  clearAll: () => set({ sessions: {}, currentSession: null }),
}));