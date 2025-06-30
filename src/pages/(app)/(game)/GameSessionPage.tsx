import { useState, useEffect } from "react";
import { motion, AnimatePresence } from "framer-motion";
import { X, AlertTriangle, Loader2, CheckCircle } from "lucide-react";
import { useNavigate } from "react-router-dom";

import { useCurrentGameSession } from "@/hooks/use-game";
import { useLevel } from "@/hooks/use-level";
import { useCourse } from "@/hooks/use-course";
import { useCourseProgress } from "@/hooks/use-progress";
import { useResponsive } from "@/hooks/use-responsive";
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

// ✅ NEW: Interface for question queue management
interface QuestionQueueItem {
  originalIndex: number; // Original question index (for API)
  currentPosition: number; // Current position in queue
  attempts: number; // Number of attempts made
  isCompleted: boolean; // Whether correctly answered
}

export function GameSessionPage() {
  const navigate = useNavigate();
  const { isMobile } = useResponsive();
  const [sessionLoading, currentSession, sessionError] =
    useCurrentGameSession();
  const [levelLoading, level] = useLevel(currentSession?.levelId || "");
  const [courseLoading, course] = useCourse(currentSession?.courseId || "");

  // ✅ NEW: Get course progress with refetch capability
  // eslint-disable-next-line @typescript-eslint/no-unused-vars
  const [_, _2, _3, refetchCourseProgress] = useCourseProgress(
    currentSession?.courseId || ""
  );

  // ✅ NEW: Question queue management
  const [questionQueue, setQuestionQueue] = useState<QuestionQueueItem[]>([]);
  const [currentQueuePosition, setCurrentQueuePosition] = useState(0);
  
  const [isSubmitting, setIsSubmitting] = useState(false);
  const [gameError, setGameError] = useState<string | null>(null);
  const [startTime] = useState(Date.now());
  const [questionResult, setQuestionResult] = useState<QuestionResult | null>(
    null
  );

  // ✅ NEW: Selected answer state for submit button
  const [selectedAnswer, setSelectedAnswer] = useState<unknown>(null);

  // ✅ NEW: Game Over state
  const [showGameOver, setShowGameOver] = useState(false);

  const { clearCurrentSession, updateSession } = useGameStore();

  // ✅ NEW: Initialize question queue
  useEffect(() => {
    if (level?.questions && questionQueue.length === 0) {
      const initialQueue: QuestionQueueItem[] = level.questions.map((_, index) => ({
        originalIndex: index,
        currentPosition: index,
        attempts: 0,
        isCompleted: false
      }));

      // Mark already answered questions as completed
      if (currentSession?.answeredQuestions) {
        currentSession.answeredQuestions.forEach(answered => {
          const queueItem = initialQueue.find(item => item.originalIndex === answered.questionIndex);
          if (queueItem && answered.isCorrect) {
            queueItem.isCompleted = true;
          }
        });
      }

      setQuestionQueue(initialQueue);
      
      // Find first incomplete question
      const firstIncomplete = initialQueue.findIndex(item => !item.isCompleted);
      setCurrentQueuePosition(firstIncomplete >= 0 ? firstIncomplete : 0);
    }
  }, [level, currentSession, questionQueue.length]);

  // Clear question result when changing questions
  useEffect(() => {
    setQuestionResult(null);
    setSelectedAnswer(null);
  }, [currentQueuePosition]);

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

  // ✅ NEW: Get current question from queue
  const getCurrentQuestion = () => {
    if (!level?.questions || questionQueue.length === 0) return null;
    const currentItem = questionQueue[currentQueuePosition];
    if (!currentItem) return null;
    return level.questions[currentItem.originalIndex];
  };

  const getCurrentQuestionIndex = () => {
    if (questionQueue.length === 0) return 0;
    const currentItem = questionQueue[currentQueuePosition];
    return currentItem?.originalIndex || 0;
  };

  // ✅ NEW: Handle answer selection (not submission)
  const handleAnswerSelection = (answer: unknown) => {
    setSelectedAnswer(answer);
  };

  // ✅ NEW: Handle answer submission
  const handleSubmitAnswer = async () => {
    if (!currentSession || !level || !level.questions || isSubmitting || selectedAnswer === null) return;

    const currentQuestionIndex = getCurrentQuestionIndex();
    
    setIsSubmitting(true);
    setGameError(null);

    try {
      const timeSpent = Math.floor((Date.now() - startTime) / 1000);

      // Prepare answer based on question type
      const question = level.questions[currentQuestionIndex];
      const answerPayload: SubmitAnswerInput = {
        sessionId: currentSession._id,
        questionIndex: currentQuestionIndex, // ✅ Always use original index
        timeSpent,
      };

      switch (question.type) {
        case "MULTIPLE_CHOICE":
          answerPayload.selectedOptionIndex = selectedAnswer as number;
          break;
        case "TRUE_FALSE":
          answerPayload.booleanAnswer = selectedAnswer as boolean;
          break;
        case "FREE_CHOICE":
          answerPayload.freeAnswer = selectedAnswer as string;
          break;
        case "SEQUENCE":
          answerPayload.sequenceOrder = selectedAnswer as string[];
          break;
        case "PAIRS":
          answerPayload.pairMatches = selectedAnswer as string[];
          break;
      }

      const [result, error] = await GameService.submitAnswer(answerPayload);

      if (error || !result) {
        setGameError(error || "Failed to submit answer");
        return;
      }

      // ✅ Store the question result for immediate feedback
      setQuestionResult(result);

      // ✅ NEW: Update question queue based on result
      setQuestionQueue(prevQueue => {
        const newQueue = [...prevQueue];
        const currentItem = newQueue[currentQueuePosition];
        
        if (currentItem) {
          currentItem.attempts += 1;
          
          if (result.isCorrect) {
            // ✅ Mark as completed, stays in current position
            currentItem.isCompleted = true;
          }
          // ✅ NEW: Don't move incorrect answers until user clicks "Next Question"
        }
        
        return newQueue;
      });

      // Create new answered question object
      const newAnsweredQuestion: AnsweredQuestion = {
        questionIndex: currentQuestionIndex,
        isCorrect: result.isCorrect,
        userAnswer: selectedAnswer,
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

      // ✅ Check if lives are depleted - show game over screen
      if (result.livesRemaining <= 0) {
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
    if (questionQueue.length === 0) return;

    // ✅ NEW: If current question was answered incorrectly, move it to end
    if (questionResult && !questionResult.isCorrect) {
      setQuestionQueue(prevQueue => {
        const newQueue = [...prevQueue];
        const itemToMove = newQueue.splice(currentQueuePosition, 1)[0];
        newQueue.push(itemToMove);
        
        // Update positions
        newQueue.forEach((item, index) => {
          item.currentPosition = index;
        });
        
        return newQueue;
      });
      
      // Stay at same position (which now has a different question)
      setQuestionResult(null);
      setSelectedAnswer(null);
      return;
    }

    // ✅ Find next incomplete question
    const nextIncompleteIndex = questionQueue.findIndex(
      (item, index) => index > currentQueuePosition && !item.isCompleted
    );

    if (nextIncompleteIndex >= 0) {
      setCurrentQueuePosition(nextIncompleteIndex);
      setQuestionResult(null);
      setSelectedAnswer(null);
    } else {
      // ✅ All questions completed - finish level
      handleFinishLevel();
    }
  };

  const handlePreviousQuestion = () => {
    if (currentQueuePosition > 0) {
      setCurrentQueuePosition(currentQueuePosition - 1);
      setQuestionResult(null);
      setSelectedAnswer(null);
    }
  };

  const handleJumpToQuestion = (queuePosition: number) => {
    if (queuePosition >= 0 && queuePosition < questionQueue.length) {
      setCurrentQueuePosition(queuePosition);
      setQuestionResult(null);
      setSelectedAnswer(null);
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
      setCurrentQueuePosition(0);
      setQuestionQueue([]);
      setQuestionResult(null);
      setSelectedAnswer(null);
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

  // ✅ NEW: Check if all questions are completed
  const allQuestionsCompleted = questionQueue.every(item => item.isCompleted);
  if (allQuestionsCompleted && questionQueue.length > 0) {
    return (
      <LevelCompleteScreen
        onReturn={() => {
          clearCurrentSession();
          navigate(`/course/${currentSession.courseId}`);
        }}
      />
    );
  }

  // ✅ NEW: Get current question from queue
  const currentQuestion = getCurrentQuestion();
  const currentQuestionIndex = getCurrentQuestionIndex();

  if (!currentQuestion) {
    return (
      <LevelCompleteScreen
        onReturn={() => {
          clearCurrentSession();
          navigate(`/course/${currentSession.courseId}`);
        }}
      />
    );
  }

  // ✅ NEW: Calculate progress based on completed questions
  const completedCount = questionQueue.filter(item => item.isCompleted).length;
  const totalQuestions = questionQueue.length;
  const progressTotal = totalQuestions > 0 ? (completedCount / totalQuestions) * 100 : 0;

  // ✅ NEW: Check if current question is already answered correctly (not just attempted)
  const isCurrentQuestionCompleted = questionQueue[currentQueuePosition]?.isCompleted || false;

  // ✅ NEW: Check if there are more incomplete questions
  const hasMoreIncompleteQuestions = questionQueue.some(
    (item, index) => index > currentQueuePosition && !item.isCompleted
  );

  return (
    <div className={`min-h-screen bg-gradient-to-br from-indigo-900 via-purple-900 to-pink-900 ${isMobile ? '' : ''}`}>
      {/* ✅ Game Over Screen */}
      {showGameOver && (
        <GameOverScreen
          course={course}
          level={level}
          onRetryLevel={handleRetryLevel}
          onReturnToCourse={handleReturnToCourse}
        />
      )}

      {/* Header - ✅ Hide on mobile for fullscreen experience */}
      {!isMobile && (
        <GameHeader
          course={course}
          level={level}
          currentSession={currentSession}
          onAbandonSession={handleAbandonSession}
        />
      )}

      {/* Game Content - ✅ Mobile fullscreen layout */}
      <div className={`${isMobile ? 'h-screen flex flex-col' : 'max-w-4xl mx-auto px-4 py-8'}`}>
        {/* ✅ Mobile header - compact version */}
        {isMobile && (
          <div className="flex-shrink-0 bg-black/20 backdrop-blur-xl border-b border-white/10 px-4 py-3">
            <div className="flex items-center justify-between">
              <button
                onClick={handleAbandonSession}
                className="p-2 hover:bg-white/10 rounded-lg transition-colors"
              >
                <X className="w-5 h-5 text-white" />
              </button>
              
              <div className="text-center">
                <div className="text-white font-bold text-sm">{level.title}</div>
                <div className="text-gray-300 text-xs">{course.title}</div>
              </div>
              
              <div className="flex items-center space-x-2 text-xs text-white">
                <span>{currentSession.lives}❤️</span>
                <span>{completedCount}/{totalQuestions}</span>
              </div>
            </div>
            
            {/* Mobile progress bar */}
            <div className="mt-2">
              <div className="w-full bg-white/20 rounded-full h-1">
                <motion.div
                  className="bg-gradient-to-r from-blue-400 to-purple-500 h-1 rounded-full"
                  initial={{ width: 0 }}
                  animate={{ width: `${progressTotal}%` }}
                  transition={{ duration: 0.5 }}
                />
              </div>
            </div>
          </div>
        )}

        <AnimatePresence mode="wait">
          <motion.div
            key={`${currentQueuePosition}-${currentQuestionIndex}`}
            initial={{ opacity: 0, x: 50 }}
            animate={{ opacity: 1, x: 0 }}
            exit={{ opacity: 0, x: -50 }}
            transition={{ duration: 0.3 }}
            className={`${isMobile ? 'flex-1 flex flex-col' : ''}`}
          >
            {/* ✅ Mobile: Remove card wrapper for fullscreen */}
            {isMobile ? (
              <div className="flex-1 flex flex-col bg-white dark:bg-gray-900 overflow-hidden">
                {/* Question Header - Mobile */}
                <div className="flex-shrink-0 text-center py-4 px-4 border-b border-gray-200 dark:border-gray-700">
                  <Badge variant="primary" size="lg">
                    Question {currentQueuePosition + 1} of {totalQuestions}
                  </Badge>
                </div>

                {/* Error Display - Mobile */}
                {gameError && (
                  <motion.div
                    className="flex-shrink-0 mx-4 mt-4 p-4 bg-red-50 dark:bg-red-900/20 rounded-xl border border-red-200 dark:border-red-800"
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

                {/* Question Content - Mobile fullscreen */}
                <div className="flex-1 overflow-y-auto px-4 py-6">
                  <QuestionRenderer
                    question={currentQuestion}
                    questionIndex={currentQuestionIndex}
                    onAnswer={handleAnswerSelection}
                    isSubmitting={isSubmitting}
                    isAnswered={isCurrentQuestionCompleted}
                    answeredQuestion={undefined}
                    questionResult={questionResult}
                    selectedAnswer={selectedAnswer}
                    onSubmitAnswer={handleSubmitAnswer}
                  />
                </div>

                {/* Navigation - Mobile */}
                <div className="flex-shrink-0 border-t border-gray-200 dark:border-gray-700 p-4">
                  <GameNavigation
                    currentQuestionIndex={currentQueuePosition}
                    totalQuestions={totalQuestions}
                    isCurrentQuestionAnswered={isCurrentQuestionCompleted}
                    questionResult={questionResult}
                    hasMoreUnansweredQuestions={hasMoreIncompleteQuestions}
                    allQuestionsAnswered={allQuestionsCompleted}
                    answeredCount={completedCount}
                    onPreviousQuestion={handlePreviousQuestion}
                    onNextQuestion={() => {
                      if (currentQueuePosition < totalQuestions - 1) {
                        setCurrentQueuePosition(currentQueuePosition + 1);
                        setQuestionResult(null);
                        setSelectedAnswer(null);
                      }
                    }}
                    onNextUnansweredQuestion={handleNextQuestion}
                    onFinishLevel={handleFinishLevel}
                    onReviewMode={() => {
                      setCurrentQueuePosition(0);
                      setQuestionResult(null);
                      setSelectedAnswer(null);
                    }}
                  />
                </div>
              </div>
            ) : (
              // Desktop: Keep card layout
              <Card className="bg-white/95 dark:bg-gray-800/95 backdrop-blur-lg border border-white/20">
                <CardContent>
                  {/* Question Header */}
                  <div className="text-center mb-6">
                    <Badge variant="primary" size="lg">
                      Question {currentQueuePosition + 1} of {totalQuestions}
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
                    onAnswer={handleAnswerSelection}
                    isSubmitting={isSubmitting}
                    isAnswered={isCurrentQuestionCompleted}
                    answeredQuestion={undefined}
                    questionResult={questionResult}
                    selectedAnswer={selectedAnswer}
                    onSubmitAnswer={handleSubmitAnswer}
                  />

                  {/* ✅ Enhanced Navigation Controls */}
                  <GameNavigation
                    currentQuestionIndex={currentQueuePosition}
                    totalQuestions={totalQuestions}
                    isCurrentQuestionAnswered={isCurrentQuestionCompleted}
                    questionResult={questionResult}
                    hasMoreUnansweredQuestions={hasMoreIncompleteQuestions}
                    allQuestionsAnswered={allQuestionsCompleted}
                    answeredCount={completedCount}
                    onPreviousQuestion={handlePreviousQuestion}
                    onNextQuestion={() => {
                      if (currentQueuePosition < totalQuestions - 1) {
                        setCurrentQueuePosition(currentQueuePosition + 1);
                        setQuestionResult(null);
                        setSelectedAnswer(null);
                      }
                    }}
                    onNextUnansweredQuestion={handleNextQuestion}
                    onFinishLevel={handleFinishLevel}
                    onReviewMode={() => {
                      setCurrentQueuePosition(0);
                      setQuestionResult(null);
                      setSelectedAnswer(null);
                    }}
                  />
                </CardContent>
              </Card>
            )}
          </motion.div>
        </AnimatePresence>
      </div>

      {/* Floating Action Button - Only on desktop */}
      {!isMobile && (
        <motion.button
          onClick={handleAbandonSession}
          className="fixed bottom-8 left-8 p-4 bg-red-500 hover:bg-red-600 text-white rounded-full shadow-2xl transition-colors z-50"
          whileHover={{ scale: 1.05 }}
          whileTap={{ scale: 0.95 }}
        >
          <X className="w-6 h-6" />
        </motion.button>
      )}
    </div>
  );
}