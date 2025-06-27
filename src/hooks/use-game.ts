import { useEffect, useState } from "react";

import {
  GameService,
  GameSession,
  LevelCompletion,
} from "@/services/game-service";
import { useGameStore } from "@/stores/game-store";

/**
 * Hook to manage current game session
 */
export const useCurrentGameSession = (): [
  boolean,
  GameSession | null,
  string | null
] => {
  const { getCurrentSession, setCurrentSession } = useGameStore();
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState<string | null>(null);
  const [initialized, setInitialized] = useState(false);

  const currentSession = getCurrentSession();

  useEffect(() => {
    // If session is already in cache, don't fetch
    if (currentSession) {
      setInitialized(true);
      return;
    }

    const fetchCurrentSession = async () => {
      setLoading(true);
      setError(null);

      const [session, error] = await GameService.getCurrentGameSession();
      if (session) {
        setCurrentSession(session);
      } else if (error) {
        setError(error);
      }
      // Note: No error if session is null (no active session)

      setLoading(false);
      setInitialized(true);
    };

    fetchCurrentSession();
  }, [currentSession, setCurrentSession]);

  // Don't return data until first fetch attempt is complete
  if (!initialized) {
    return [true, null, null];
  }

  return [loading, currentSession, error];
};

/**
 * Hook to get level completion data
 */
export const useLevelCompletion = (
  sessionId: string | null
): [boolean, LevelCompletion | null, string | null] => {
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState<string | null>(null);
  const [completion, setCompletion] = useState<LevelCompletion | null>(null);
  const [initialized, setInitialized] = useState(false);

  useEffect(() => {
    if (!sessionId) {
      setInitialized(true);
      return;
    }

    const fetchCompletion = async () => {
      setLoading(true);
      setError(null);

      const [completion, error] = await GameService.getLevelCompletion(
        sessionId
      );
      if (completion) {
        setCompletion(completion);
      } else {
        setError(error || "Failed to fetch level completion");
      }

      setLoading(false);
      setInitialized(true);
    };

    fetchCompletion();
  }, [sessionId]);

  // Don't return data until first fetch attempt is complete
  if (!initialized) {
    return [true, null, null];
  }

  return [loading, completion, error];
};
