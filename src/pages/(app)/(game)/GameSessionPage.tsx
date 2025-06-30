import { useState, useEffect } from "react";
import { motion, AnimatePresence } from "framer-motion";
import { X, AlertTriangle, Loader2 } from "lucide-react";
import { useNavigate } from "react-router-dom";

import { useCurrentGameSession } from "@/hooks/use-game";
import { useLevel } from "@/hooks/use-level";
import { useCourse } from "@/hooks/use-course";
import { useCourseProgress } from "@/hooks/use-progress";
import {
  GameService,
  AnsweredQuestion,
  QuestionResult,
  SubmitAnswerInput,
} from "@/services/game-service";
import { useGameStore } from "@/stores/game-store";
import { Card, CardContent } from "@/components/ui/Card";
import Button from "@/components/ui/Button";
import Badge from "@/components/ui/Badge";
import { GameHeader } from "@/components/game/GameHeader";
import { GameOverScreen } from "@/components/game/GameOverScreen";
import { GameNavigation } from "@/components/game/GameNavigation";
import { QuestionRenderer } from "@/components/game/QuestionRenderer";
import { LevelCompleteScreen } from "@/components/game/LevelCompleteScreen";

export function GameSessionPage() {
  const navigate = useNavigate();
  const [sessionLoading, currentSession, sessionError] =
    useCurrentGameSession();
  const [levelLoading, level] = useLevel(currentSession?.levelId || "");
  const [courseLoading, course] = useCourse(currentSession?.courseId || "");

  // ✅ NEW: Get course progress with refetch capability
  // eslint-disable-next-line @typescript-eslint/no-unused-vars
  const [_, _2, _3, refetchCourseProgress] = useCourseProgress(
    currentSession?.courseId || ""
  );

  // Initialize currentQuestionIndex based on answered questions
  const [currentQuestionIndex, setCurrentQuestionIndex] = useState(0);
  const [isSubmitting, setIsSubmitting] = useState(false);
  const [gameError, setGameError] = useState<string | null>(null);
  const [startTime] = useState(Date.now());
  const [questionResult, setQuestionResult] = useState<QuestionResult | null>(
    null
  );

  // ✅ NEW: Game Over state
  const [showGameOver, setShowGameOver] = useState(false);

  const { clearCurrentSession, updateSession } = useGameStore();

  // Set initial question index based on answered questions
  useEffect(() => {
    if (currentSession && currentSession.answeredQuestions) {
      // Find the first unanswered question
      const answeredIndices = new Set(
        currentSession.answeredQuestions.map((aq) => aq.questionIndex)
      );
      let nextQuestionIndex = 0;

      // Find first question that hasn't been answered
      while (
        nextQuestionIndex < (level?.questions?.length || 0) &&
        answeredIndices.has(nextQuestionIndex)
      ) {
        nextQuestionIndex++;
      }

      setCurrentQuestionIndex(nextQuestionIndex);
    }
  }, [currentSession, level]);

  // Clear question result when changing questions
  useEffect(() => {
    setQuestionResult(null);
  }, [currentQuestionIndex]);

  // ✅ NEW: Check for game over when lives reach 0
  useEffect(() => {
    if (currentSession && currentSession.lives <= 0) {
      setShowGameOver(true);
    }
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [currentSession?.lives]);

  // Redirect if no session
  useEffect(() => {
    if (!sessionLoading && !currentSession) {
      navigate("/");
    }
  }, [sessionLoading, currentSession, navigate]);

  const handleAnswer = async (answer: unknown) => {
    if (!currentSession || !level || !level.questions || isSubmitting) return;

    setIsSubmitting(true);
    setGameError(null);

    try {
      const timeSpent = Math.floor((Date.now() - startTime) / 1000);

      // Prepare answer based on question type
      const question = level.questions[currentQuestionIndex];
      const answerPayload: SubmitAnswerInput = {
        sessionId: currentSession._id,
        questionIndex: currentQuestionIndex,
        timeSpent,
      };

      switch (question.type) {
        case "MULTIPLE_CHOICE":
          answerPayload.selectedOptionIndex = answer as number;
          break;
        case "TRUE_FALSE":
          answerPayload.booleanAnswer = answer as boolean;
          break;
        case "FREE_CHOICE":
          answerPayload.freeAnswer = answer as string;
          break;
        default:
          throw new Error("Unsupported question type");
      }

      const [result, error] = await GameService.submitAnswer(answerPayload);

      if (error || !result) {
        setGameError(error || "Failed to submit answer");
        return;
      }

      // ✅ Store the question result for immediate feedback - NO AUTO NAVIGATION
      setQuestionResult(result);

      // Create new answered question object
      const newAnsweredQuestion: AnsweredQuestion = {
        questionIndex: currentQuestionIndex,
        isCorrect: result.isCorrect,
        userAnswer: answer,
        timeSpent,
      };

      // Update the session with the new answered question
      const updatedAnsweredQuestions = [
        ...(currentSession.answeredQuestions || []),
        newAnsweredQuestion,
      ];
      updateSession(currentSession._id, {
        answeredQuestions: updatedAnsweredQuestions,
        lives: result.livesRemaining,
      });

      // ✅ COMPLETELY MANUAL - User must click "Next Question" to continue

      // ✅ Check if lives are depleted - show game over screen instead of auto-navigation
      if (result.livesRemaining <= 0) {
        // Game over will be handled by useEffect above
        return;
      }
    } catch (err) {
      setGameError(
        err instanceof Error ? err.message : "Failed to submit answer"
      );
    } finally {
      setIsSubmitting(false);
    }
  };

  const handleNextQuestion = () => {
    if (!level?.questions || !currentSession) return;

    // Find next unanswered question
    const answeredIndices = new Set(
      currentSession.answeredQuestions?.map((aq) => aq.questionIndex) || []
    );
    let nextQuestionIndex = currentQuestionIndex + 1;

    // Find next question that hasn't been answered
    while (
      nextQuestionIndex < level.questions.length &&
      answeredIndices.has(nextQuestionIndex)
    ) {
      nextQuestionIndex++;
    }

    if (nextQuestionIndex < level.questions.length) {
      setCurrentQuestionIndex(nextQuestionIndex);
      setQuestionResult(null); // Clear previous result
    } else {
      // All questions answered - finish level
      handleFinishLevel();
    }
  };

  // ✅ Handle finish level - clear session, refresh progress, and navigate
  const handleFinishLevel = async () => {
    if (!currentSession) return;

    try {
      // Clear the current session since level is completed
      clearCurrentSession();

      // ✅ Refresh course progress to get updated data
      console.log("Level completed! Refreshing course progress...");
      await refetchCourseProgress();

      // Navigate to course
      navigate(`/course/${currentSession.courseId}`);
    } catch (err) {
      console.error("Error refreshing progress after level completion:", err);
      // Navigate anyway
      navigate(`/course/${currentSession.courseId}`);
    }
  };

  const handleAbandonSession = async () => {
    if (!currentSession) return;

    try {
      await GameService.abandonSession(currentSession._id);
      clearCurrentSession();
      navigate(`/course/${currentSession.courseId}`);
    } catch (err) {
      console.error("Failed to abandon session:", err);
      // Navigate anyway and clear session
      clearCurrentSession();
      navigate(`/course/${currentSession.courseId}`);
    }
  };

  // ✅ NEW: Handle retry level from game over screen
  const handleRetryLevel = async () => {
    if (!currentSession || !level) return;

    try {
      // Start a new level session
      const [newSession, error] = await GameService.startLevel({
        levelId: level._id,
      });

      if (error || !newSession) {
        setGameError(error || "Failed to restart level");
        return;
      }

      // Update the current session and reset game state
      updateSession(newSession._id, newSession);
      setShowGameOver(false);
      setCurrentQuestionIndex(0);
      setQuestionResult(null);
      setGameError(null);
    } catch (err) {
      setGameError(
        err instanceof Error ? err.message : "Failed to restart level"
      );
    }
  };

  // ✅ NEW: Handle return to course from game over screen
  const handleReturnToCourse = () => {
    clearCurrentSession();
    navigate(`/course/${currentSession?.courseId}`);
  };

  if (sessionLoading || levelLoading || courseLoading) {
    return (
      <div className="min-h-screen bg-gradient-to-br from-indigo-900 via-purple-900 to-pink-900 flex items-center justify-center">
        <motion.div
          className="text-center"
          initial={{ opacity: 0, scale: 0.9 }}
          animate={{ opacity: 1, scale: 1 }}
        >
          <div className="w-20 h-20 bg-gradient-to-r from-blue-500 to-purple-600 rounded-full flex items-center justify-center mx-auto mb-6 shadow-2xl">
            <Loader2 className="w-10 h-10 text-white animate-spin" />
          </div>
          <h1 className="text-2xl font-bold text-white mb-2">
            Loading Game...
          </h1>
          <p className="text-gray-300">Preparing your level</p>
        </motion.div>
      </div>
    );
  }

  if (sessionError || !currentSession || !level || !course) {
    return (
      <div className="min-h-screen bg-gradient-to-br from-red-900 via-pink-900 to-purple-900 flex items-center justify-center p-4">
        <Card className="max-w-md mx-auto text-center">
          <CardContent>
            <AlertTriangle className="w-16 h-16 text-red-500 mx-auto mb-4" />
            <h1 className="text-2xl font-bold text-red-600 mb-2">Game Error</h1>
            <p className="text-gray-600 mb-6">
              {sessionError || "Unable to load game session"}
            </p>
            <Button onClick={() => navigate("/")} variant="primary">
              Return Home
            </Button>
          </CardContent>
        </Card>
      </div>
    );
  }

  // Add defensive check for level.questions
  if (
    !level.questions ||
    !Array.isArray(level.questions) ||
    level.questions.length === 0
  ) {
    return (
      <div className="min-h-screen bg-gradient-to-br from-red-900 via-pink-900 to-purple-900 flex items-center justify-center p-4">
        <Card className="max-w-md mx-auto text-center">
          <CardContent>
            <AlertTriangle className="w-16 h-16 text-yellow-500 mx-auto mb-4" />
            <h1 className="text-2xl font-bold text-yellow-600 mb-2">
              No Questions Available
            </h1>
            <p className="text-gray-600 mb-6">
              This level doesn't have any questions configured. Please return to
              the course and try again.
            </p>
            <Button
              onClick={() => {
                clearCurrentSession();
                navigate(`/course/${currentSession.courseId}`);
              }}
              variant="primary"
            >
              Return to Course
            </Button>
          </CardContent>
        </Card>
      </div>
    );
  }

  // Add bounds check for currentQuestionIndex
  if (currentQuestionIndex >= level.questions.length) {
    return (
      <LevelCompleteScreen
        onReturn={() => {
          clearCurrentSession();
          navigate(`/course/${currentSession.courseId}`);
        }}
      />
    );
  }

  const currentQuestion = level.questions[currentQuestionIndex];

  // Calculate progress based on answered questions, not current index
  const answeredCount = currentSession.answeredQuestions?.length || 0;
  const progressTotal = (answeredCount / level.questions.length) * 100;

  // Check if current question is already answered and get the answer data
  const answeredQuestion = currentSession.answeredQuestions?.find(
    (aq) => aq.questionIndex === currentQuestionIndex
  );
  const isCurrentQuestionAnswered = !!answeredQuestion;

  // ✅ Check if there are more unanswered questions AFTER current one
  const answeredIndices = new Set(
    currentSession.answeredQuestions?.map((aq) => aq.questionIndex) || []
  );
  const hasMoreUnansweredQuestions = level.questions.some(
    (_, index) => !answeredIndices.has(index) && index > currentQuestionIndex
  );

  // ✅ Check if ALL questions are answered
  const allQuestionsAnswered = answeredIndices.size === level.questions.length;

  return (
    <div className="min-h-screen bg-gradient-to-br from-indigo-900 via-purple-900 to-pink-900">
      {/* ✅ Game Over Screen */}
      {showGameOver && (
        <GameOverScreen
          course={course}
          level={level}
          onRetryLevel={handleRetryLevel}
          onReturnToCourse={handleReturnToCourse}
        />
      )}

      {/* Header */}
      <GameHeader
        course={course}
        level={level}
        currentSession={currentSession}
        onAbandonSession={handleAbandonSession}
      />

      {/* Game Content */}
      <div className="max-w-4xl mx-auto px-4 py-8">
        <AnimatePresence mode="wait">
          <motion.div
            key={currentQuestionIndex}
            initial={{ opacity: 0, x: 50 }}
            animate={{ opacity: 1, x: 0 }}
            exit={{ opacity: 0, x: -50 }}
            transition={{ duration: 0.3 }}
          >
            <Card className="bg-white/95 dark:bg-gray-800/95 backdrop-blur-lg border border-white/20">
              <CardContent>
                {/* Question Header */}
                <div className="text-center mb-6">
                  <Badge variant="primary" size="lg" className="mb-4">
                    Question {currentQuestionIndex + 1} of{" "}
                    {level.questions.length} ({progressTotal.toFixed(0)}%)
                  </Badge>
                </div>

                {/* Error Display */}
                {gameError && (
                  <motion.div
                    className="mb-6 p-4 bg-red-50 dark:bg-red-900/20 rounded-xl border border-red-200 dark:border-red-800"
                    initial={{ opacity: 0, y: -10 }}
                    animate={{ opacity: 1, y: 0 }}
                  >
                    <div className="flex items-center space-x-3">
                      <AlertTriangle className="w-5 h-5 text-red-600 dark:text-red-400" />
                      <p className="text-red-800 dark:text-red-200">
                        {gameError}
                      </p>
                    </div>
                  </motion.div>
                )}

                {/* Question Component */}
                <QuestionRenderer
                  question={currentQuestion}
                  questionIndex={currentQuestionIndex}
                  onAnswer={handleAnswer}
                  isSubmitting={isSubmitting}
                  isAnswered={isCurrentQuestionAnswered}
                  answeredQuestion={answeredQuestion}
                  questionResult={questionResult}
                />

                {/* Manual Navigation Controls */}
                <GameNavigation
                  currentQuestionIndex={currentQuestionIndex}
                  totalQuestions={level.questions.length}
                  isCurrentQuestionAnswered={isCurrentQuestionAnswered}
                  questionResult={questionResult}
                  hasMoreUnansweredQuestions={hasMoreUnansweredQuestions}
                  allQuestionsAnswered={allQuestionsAnswered}
                  answeredCount={answeredCount}
                  onPreviousQuestion={() =>
                    setCurrentQuestionIndex(currentQuestionIndex - 1)
                  }
                  onNextQuestion={() => {
                    setCurrentQuestionIndex(currentQuestionIndex + 1);
                  }}
                  onNextUnansweredQuestion={handleNextQuestion}
                  onFinishLevel={handleFinishLevel}
                  onReviewMode={() => {
                    setCurrentQuestionIndex(0);
                    setQuestionResult(null);
                  }}
                />
              </CardContent>
            </Card>
          </motion.div>
        </AnimatePresence>
      </div>

      {/* Floating Action Button */}
      <motion.button
        onClick={handleAbandonSession}
        className="fixed bottom-8 right-8 p-4 bg-red-500 hover:bg-red-600 text-white rounded-full shadow-2xl transition-colors z-50"
        whileHover={{ scale: 1.05 }}
        whileTap={{ scale: 0.95 }}
      >
        <X className="w-6 h-6" />
      </motion.button>
    </div>
  );
}
