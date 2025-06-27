import { useEffect, useState } from "react";

import {
  GameService,
  GameSession,
  LevelCompletion,
  QuestionResult,
  StartGameSessionInput,
  SubmitAnswerInput,
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
 * Hook to start a new level session
 */
export const useStartLevel = (): [
  (input: StartGameSessionInput) => Promise<GameSession | null>,
  boolean,
  string | null
] => {
  const { setCurrentSession, setSession } = useGameStore();
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState<string | null>(null);

  const startLevel = async (
    input: StartGameSessionInput
  ): Promise<GameSession | null> => {
    setLoading(true);
    setError(null);

    const [session, error] = await GameService.startLevel(input);
    if (session) {
      setSession(session);
      setCurrentSession(session);
      setLoading(false);
      return session;
    } else {
      setError(error || "Failed to start level");
      setLoading(false);
      return null;
    }
  };

  return [startLevel, loading, error];
};

/**
 * Hook to submit answers during gameplay
 */
export const useSubmitAnswer = (): [
  (input: SubmitAnswerInput) => Promise<QuestionResult | null>,
  boolean,
  string | null
] => {
  const { updateSession } = useGameStore();
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState<string | null>(null);

  const submitAnswer = async (
    input: SubmitAnswerInput
  ): Promise<QuestionResult | null> => {
    setLoading(true);
    setError(null);

    const [result, error] = await GameService.submitAnswer(input);
    if (result) {
      // Update session with new lives count
      updateSession(input.sessionId, {
        lives: result.livesRemaining,
      });
      setLoading(false);
      return result;
    } else {
      setError(error || "Failed to submit answer");
      setLoading(false);
      return null;
    }
  };

  return [submitAnswer, loading, error];
};

/**
 * Hook to abandon current session
 */
export const useAbandonSession = (): [
  (sessionId: string) => Promise<boolean>,
  boolean,
  string | null
] => {
  const { clearCurrentSession, updateSession } = useGameStore();
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState<string | null>(null);

  const abandonSession = async (sessionId: string): Promise<boolean> => {
    setLoading(true);
    setError(null);

    const [success, error] = await GameService.abandonSession(sessionId);
    if (success) {
      updateSession(sessionId, { status: "abandoned" });
      clearCurrentSession();
      setLoading(false);
      return true;
    } else {
      setError(error || "Failed to abandon session");
      setLoading(false);
      return false;
    }
  };

  return [abandonSession, loading, error];
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

/**
 * Hook to get a specific game session
 */
export const useGameSession = (
  sessionId: string
): [boolean, GameSession | null, string | null] => {
  const { getSession, setSession } = useGameStore();
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState<string | null>(null);
  const [initialized, setInitialized] = useState(false);

  const session = getSession(sessionId);

  useEffect(() => {
    // If session is already in cache or no sessionId, don't fetch
    if (session || !sessionId) {
      setInitialized(true);
      return;
    }

    // Note: There's no direct getSession method in GameService
    // This would need to be implemented if needed
    setInitialized(true);
  }, [sessionId, session]);

  return [loading, session || null, error];
};