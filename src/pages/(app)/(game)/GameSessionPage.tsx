import React, { useState, useEffect } from "react";
import { motion, AnimatePresence } from "framer-motion";
import { 
  Heart, 
  Star, 
  Clock, 
  Target,
  CheckCircle,
  X,
  ArrowLeft,
  Trophy,
  Zap,
  AlertTriangle,
  Loader2,
  RotateCcw,
  ArrowRight,
  Eye,
  Skull,
  RefreshCw,
  Home
} from "lucide-react";
import { useParams, useNavigate } from "react-router-dom";

import { useCurrentGameSession } from "@/hooks/use-game";
import { useLevel } from "@/hooks/use-level";
import { useCourse } from "@/hooks/use-course";
import { useCourseProgress } from "@/hooks/use-progress";
import { GameService, AnsweredQuestion, QuestionResult } from "@/services/game-service";
import { useGameStore } from "@/stores/game-store";
import { Card, CardContent } from "@/components/ui/Card";
import Button from "@/components/ui/Button";
import Badge from "@/components/ui/Badge";
import { cn } from "@/lib/utils/class.utils";

interface QuestionComponentProps {
  question: any;
  questionIndex: number;
  onAnswer: (answer: any) => void;
  isSubmitting: boolean;
  isAnswered: boolean;
  answeredQuestion?: AnsweredQuestion;
  questionResult?: QuestionResult | null;
}

const QuestionComponent: React.FC<QuestionComponentProps> = ({
  question,
  questionIndex,
  onAnswer,
  isSubmitting,
  isAnswered,
  answeredQuestion,
  questionResult
}) => {
  const [selectedAnswer, setSelectedAnswer] = useState<any>(null);

  // Set the previous answer if question was already answered
  useEffect(() => {
    if (isAnswered && answeredQuestion) {
      setSelectedAnswer(answeredQuestion.userAnswer);
    } else {
      // Reset selected answer when switching to a new unanswered question
      setSelectedAnswer(null);
    }
  }, [isAnswered, answeredQuestion, questionIndex]);

  const handleSubmit = () => {
    if (selectedAnswer !== null && !isSubmitting && !isAnswered) {
      onAnswer(selectedAnswer);
    }
  };

  // Show correct answer information when available
  const showCorrectAnswer = questionResult && !questionResult.isCorrect;

  const renderQuestionContent = () => {
    switch (question.type) {
      case "MULTIPLE_CHOICE":
        return (
          <div className="space-y-3">
            {question.options.map((option: any, index: number) => {
              const isSelected = selectedAnswer === index;
              const isCorrect = option.isCorrect;
              const showAsCorrect = showCorrectAnswer && isCorrect;
              const showAsIncorrect = questionResult && isSelected && !questionResult.isCorrect;

              return (
                <button
                  key={index}
                  onClick={() => !isAnswered && setSelectedAnswer(index)}
                  disabled={isSubmitting || isAnswered}
                  className={cn(
                    "w-full p-4 text-left rounded-xl border-2 transition-all duration-200",
                    showAsCorrect
                      ? "border-green-500 bg-green-50 dark:bg-green-900/20"
                      : showAsIncorrect
                        ? "border-red-500 bg-red-50 dark:bg-red-900/20"
                        : isSelected
                          ? isAnswered && answeredQuestion
                            ? answeredQuestion.isCorrect
                              ? "border-green-500 bg-green-50 dark:bg-green-900/20"
                              : "border-red-500 bg-red-50 dark:bg-red-900/20"
                            : "border-primary-500 bg-primary-50 dark:bg-primary-900/20"
                          : "border-gray-200 dark:border-gray-700 hover:border-primary-300 dark:hover:border-primary-600",
                    (isSubmitting || isAnswered) && "cursor-not-allowed"
                  )}
                >
                  <div className="flex items-center space-x-3">
                    <div className={cn(
                      "w-6 h-6 rounded-full border-2 flex items-center justify-center",
                      showAsCorrect
                        ? "border-green-500 bg-green-500"
                        : showAsIncorrect
                          ? "border-red-500 bg-red-500"
                          : isSelected
                            ? isAnswered && answeredQuestion
                              ? answeredQuestion.isCorrect
                                ? "border-green-500 bg-green-500"
                                : "border-red-500 bg-red-500"
                              : "border-primary-500 bg-primary-500"
                            : "border-gray-300 dark:border-gray-600"
                    )}>
                      {(isSelected || showAsCorrect) && (
                        <div className="w-3 h-3 bg-white rounded-full" />
                      )}
                    </div>
                    <span className="text-gray-900 dark:text-gray-100 font-medium">
                      {option.text}
                    </span>
                    {/* Show indicators */}
                    {showAsCorrect && (
                      <div className="ml-auto">
                        <Badge variant="success" size="sm">Correct Answer</Badge>
                      </div>
                    )}
                    {isAnswered && isSelected && answeredQuestion && (
                      <div className="ml-auto">
                        {answeredQuestion.isCorrect ? (
                          <CheckCircle className="w-5 h-5 text-green-600" />
                        ) : (
                          <X className="w-5 h-5 text-red-600" />
                        )}
                      </div>
                    )}
                  </div>
                </button>
              );
            })}
          </div>
        );

      case "TRUE_FALSE":
        const correctAnswer = question.correctAnswer;
        const showTrueAsCorrect = showCorrectAnswer && correctAnswer === true;
        const showFalseAsCorrect = showCorrectAnswer && correctAnswer === false;

        return (
          <div className="grid grid-cols-2 gap-4">
            <button
              onClick={() => !isAnswered && setSelectedAnswer(true)}
              disabled={isSubmitting || isAnswered}
              className={cn(
                "p-6 rounded-xl border-2 transition-all duration-200 text-center",
                showTrueAsCorrect
                  ? "border-green-500 bg-green-50 dark:bg-green-900/20"
                  : selectedAnswer === true
                    ? isAnswered && answeredQuestion
                      ? answeredQuestion.isCorrect
                        ? "border-green-500 bg-green-50 dark:bg-green-900/20"
                        : "border-red-500 bg-red-50 dark:bg-red-900/20"
                      : "border-green-500 bg-green-50 dark:bg-green-900/20"
                    : "border-gray-200 dark:border-gray-700 hover:border-green-300",
                (isSubmitting || isAnswered) && "cursor-not-allowed"
              )}
            >
              <CheckCircle className="w-8 h-8 mx-auto mb-2 text-green-600" />
              <span className="font-bold text-green-900 dark:text-green-100">True</span>
              {showTrueAsCorrect && (
                <div className="mt-2">
                  <Badge variant="success" size="sm">Correct Answer</Badge>
                </div>
              )}
              {isAnswered && selectedAnswer === true && answeredQuestion && (
                <div className="mt-2">
                  {answeredQuestion.isCorrect ? (
                    <Badge variant="success" size="sm">Correct</Badge>
                  ) : (
                    <Badge variant="error" size="sm">Incorrect</Badge>
                  )}
                </div>
              )}
            </button>
            <button
              onClick={() => !isAnswered && setSelectedAnswer(false)}
              disabled={isSubmitting || isAnswered}
              className={cn(
                "p-6 rounded-xl border-2 transition-all duration-200 text-center",
                showFalseAsCorrect
                  ? "border-green-500 bg-green-50 dark:bg-green-900/20"
                  : selectedAnswer === false
                    ? isAnswered && answeredQuestion
                      ? answeredQuestion.isCorrect
                        ? "border-green-500 bg-green-50 dark:bg-green-900/20"
                        : "border-red-500 bg-red-50 dark:bg-red-900/20"
                      : "border-red-500 bg-red-50 dark:bg-red-900/20"
                    : "border-gray-200 dark:border-gray-700 hover:border-red-300",
                (isSubmitting || isAnswered) && "cursor-not-allowed"
              )}
            >
              <X className="w-8 h-8 mx-auto mb-2 text-red-600" />
              <span className="font-bold text-red-900 dark:text-red-100">False</span>
              {showFalseAsCorrect && (
                <div className="mt-2">
                  <Badge variant="success" size="sm">Correct Answer</Badge>
                </div>
              )}
              {isAnswered && selectedAnswer === false && answeredQuestion && (
                <div className="mt-2">
                  {answeredQuestion.isCorrect ? (
                    <Badge variant="success" size="sm">Correct</Badge>
                  ) : (
                    <Badge variant="error" size="sm">Incorrect</Badge>
                  )}
                </div>
              )}
            </button>
          </div>
        );

      case "FREE_CHOICE":
        return (
          <div>
            <textarea
              value={selectedAnswer || ""}
              onChange={(e) => !isAnswered && setSelectedAnswer(e.target.value)}
              disabled={isSubmitting || isAnswered}
              placeholder={isAnswered ? "Your answer" : "Type your answer here..."}
              className={cn(
                "w-full p-4 border-2 rounded-xl focus:border-primary-500 focus:outline-none resize-none h-32 text-gray-900 dark:text-gray-100 bg-white dark:bg-gray-800",
                isAnswered && answeredQuestion
                  ? answeredQuestion.isCorrect
                    ? "border-green-500 bg-green-50 dark:bg-green-900/20"
                    : "border-red-500 bg-red-50 dark:bg-red-900/20"
                  : "border-gray-200 dark:border-gray-700",
                (isSubmitting || isAnswered) && "cursor-not-allowed"
              )}
            />
            {/* Show correct answers for free choice */}
            {showCorrectAnswer && question.acceptedAnswers && (
              <div className="mt-3 p-3 bg-green-50 dark:bg-green-900/20 rounded-lg border border-green-200 dark:border-green-800">
                <p className="text-sm font-medium text-green-800 dark:text-green-200 mb-2">
                  Accepted answers:
                </p>
                <div className="flex flex-wrap gap-2">
                  {question.acceptedAnswers.map((answer: string, index: number) => (
                    <Badge key={index} variant="success" size="sm">
                      {answer}
                    </Badge>
                  ))}
                </div>
              </div>
            )}
            {isAnswered && answeredQuestion && (
              <div className="mt-3 text-center">
                {answeredQuestion.isCorrect ? (
                  <Badge variant="success" size="lg">
                    <CheckCircle className="w-4 h-4 mr-2" />
                    Correct Answer
                  </Badge>
                ) : (
                  <Badge variant="error" size="lg">
                    <X className="w-4 h-4 mr-2" />
                    Incorrect Answer
                  </Badge>
                )}
              </div>
            )}
          </div>
        );

      default:
        return (
          <div className="text-center py-8">
            <AlertTriangle className="w-12 h-12 text-yellow-500 mx-auto mb-4" />
            <p className="text-gray-600 dark:text-gray-400">
              Question type not supported yet
            </p>
          </div>
        );
    }
  };

  return (
    <div className="space-y-6">
      <div className="text-center">
        <h2 className="text-2xl font-bold text-gray-900 dark:text-gray-100 mb-4">
          {question.question}
        </h2>
        {/* Show answered status with more details */}
        {isAnswered && answeredQuestion && (
          <div className="flex justify-center space-x-2 mb-4">
            <Badge 
              variant={answeredQuestion.isCorrect ? "success" : "error"} 
              size="lg"
            >
              {answeredQuestion.isCorrect ? (
                <CheckCircle className="w-4 h-4 mr-2" />
              ) : (
                <X className="w-4 h-4 mr-2" />
              )}
              {answeredQuestion.isCorrect ? "Correct" : "Incorrect"}
            </Badge>
            <Badge variant="secondary" size="lg">
              <Clock className="w-4 h-4 mr-2" />
              {answeredQuestion.timeSpent}s
            </Badge>
          </div>
        )}
        {/* Show result feedback after submission */}
        {questionResult && !isAnswered && (
          <div className="flex justify-center space-x-2 mb-4">
            <Badge 
              variant={questionResult.isCorrect ? "success" : "error"} 
              size="lg"
            >
              {questionResult.isCorrect ? (
                <CheckCircle className="w-4 h-4 mr-2" />
              ) : (
                <X className="w-4 h-4 mr-2" />
              )}
              {questionResult.isCorrect ? "Correct!" : "Incorrect"}
            </Badge>
            <Badge variant="secondary" size="lg">
              <Heart className="w-4 h-4 mr-2" />
              {questionResult.livesRemaining} lives left
            </Badge>
          </div>
        )}
      </div>

      {renderQuestionContent()}

      <div className="text-center">
        {isAnswered ? (
          <p className="text-gray-500 dark:text-gray-400">
            This question has already been answered in this session.
          </p>
        ) : questionResult ? (
          <p className="text-gray-500 dark:text-gray-400">
            Answer submitted! Review the feedback above.
          </p>
        ) : (
          <Button
            onClick={handleSubmit}
            disabled={selectedAnswer === null || isSubmitting}
            variant="primary"
            size="lg"
            leftIcon={isSubmitting ? <Loader2 className="w-5 h-5 animate-spin" /> : <CheckCircle className="w-5 h-5" />}
          >
            {isSubmitting ? "Submitting..." : "Submit Answer"}
          </Button>
        )}
      </div>
    </div>
  );
};

// ✅ NEW: Game Over Screen Component
const GameOverScreen: React.FC<{
  course: any;
  level: any;
  onRetryLevel: () => void;
  onReturnToCourse: () => void;
}> = ({ course, level, onRetryLevel, onReturnToCourse }) => {
  return (
    <motion.div
      className="fixed inset-0 z-50 flex items-center justify-center bg-black/80 backdrop-blur-sm p-4"
      initial={{ opacity: 0 }}
      animate={{ opacity: 1 }}
      transition={{ duration: 0.5 }}
    >
      <motion.div
        className="max-w-md w-full text-center"
        initial={{ scale: 0.8, y: 50 }}
        animate={{ scale: 1, y: 0 }}
        transition={{ type: "spring", duration: 0.8 }}
      >
        <Card className="bg-gradient-to-br from-red-900/90 via-red-800/90 to-orange-900/90 backdrop-blur-xl border-2 border-red-500/30 text-white">
          <CardContent>
            {/* Skull Icon with Animation */}
            <motion.div
              className="w-24 h-24 mx-auto mb-6 relative"
              animate={{
                scale: [1, 1.1, 1],
                rotate: [0, -5, 5, 0],
              }}
              transition={{
                duration: 2,
                repeat: Infinity,
                ease: "easeInOut"
              }}
            >
              <div className="w-24 h-24 bg-gradient-to-br from-red-500 to-red-700 rounded-full flex items-center justify-center shadow-2xl shadow-red-500/50">
                <Skull className="w-12 h-12 text-white" />
              </div>
              
              {/* Floating particles */}
              {[...Array(6)].map((_, i) => (
                <motion.div
                  key={i}
                  className="absolute w-2 h-2 bg-red-400 rounded-full"
                  style={{
                    left: `${20 + Math.cos(i * 60 * Math.PI / 180) * 40}px`,
                    top: `${20 + Math.sin(i * 60 * Math.PI / 180) * 40}px`,
                  }}
                  animate={{
                    scale: [0, 1, 0],
                    opacity: [0, 1, 0],
                  }}
                  transition={{
                    duration: 2,
                    repeat: Infinity,
                    delay: i * 0.3,
                  }}
                />
              ))}
            </motion.div>

            {/* Game Over Title */}
            <motion.h1
              className="text-4xl font-bold text-white mb-4"
              initial={{ opacity: 0, y: 20 }}
              animate={{ opacity: 1, y: 0 }}
              transition={{ delay: 0.3 }}
            >
              GAME OVER
            </motion.h1>

            {/* Subtitle */}
            <motion.p
              className="text-xl text-red-200 mb-2"
              initial={{ opacity: 0, y: 20 }}
              animate={{ opacity: 1, y: 0 }}
              transition={{ delay: 0.4 }}
            >
              You ran out of lives!
            </motion.p>

            {/* Level Info */}
            <motion.div
              className="mb-8 p-4 bg-black/30 rounded-xl border border-red-500/30"
              initial={{ opacity: 0, y: 20 }}
              animate={{ opacity: 1, y: 0 }}
              transition={{ delay: 0.5 }}
            >
              <h3 className="font-bold text-white mb-1">{level.title}</h3>
              <p className="text-sm text-red-200">{course.title}</p>
            </motion.div>

            {/* Motivational Message */}
            <motion.p
              className="text-red-100 mb-8 leading-relaxed"
              initial={{ opacity: 0, y: 20 }}
              animate={{ opacity: 1, y: 0 }}
              transition={{ delay: 0.6 }}
            >
              Don't give up! Every mistake is a step closer to mastery. 
              Try again and show this level who's boss! 💪
            </motion.p>

            {/* Action Buttons */}
            <motion.div
              className="flex flex-col sm:flex-row gap-3"
              initial={{ opacity: 0, y: 20 }}
              animate={{ opacity: 1, y: 0 }}
              transition={{ delay: 0.7 }}
            >
              <Button
                onClick={onRetryLevel}
                variant="primary"
                size="lg"
                fullWidth
                leftIcon={<RefreshCw className="w-5 h-5" />}
                className="bg-gradient-to-r from-emerald-500 to-green-600 hover:from-emerald-600 hover:to-green-700 shadow-lg shadow-emerald-500/25"
              >
                Try Again
              </Button>
              
              <Button
                onClick={onReturnToCourse}
                variant="outline"
                size="lg"
                fullWidth
                leftIcon={<Home className="w-5 h-5" />}
                className="border-red-400 text-red-200 hover:bg-red-500/20 hover:border-red-300"
              >
                Return to Course
              </Button>
            </motion.div>

            {/* Encouragement Quote */}
            <motion.div
              className="mt-6 p-3 bg-gradient-to-r from-orange-500/20 to-red-500/20 rounded-lg border border-orange-400/30"
              initial={{ opacity: 0 }}
              animate={{ opacity: 1 }}
              transition={{ delay: 1 }}
            >
              <p className="text-sm text-orange-200 italic">
                "Success is not final, failure is not fatal: it is the courage to continue that counts."
              </p>
            </motion.div>
          </CardContent>
        </Card>
      </motion.div>
    </motion.div>
  );
};

export function GameSessionPage() {
  const navigate = useNavigate();
  const [sessionLoading, currentSession, sessionError] = useCurrentGameSession();
  const [levelLoading, level] = useLevel(currentSession?.levelId || "");
  const [courseLoading, course] = useCourse(currentSession?.courseId || "");
  
  // ✅ NEW: Get course progress with refetch capability
  const [progressLoading, progress, progressError, refetchCourseProgress] = useCourseProgress(currentSession?.courseId || "");
  
  // Initialize currentQuestionIndex based on answered questions
  const [currentQuestionIndex, setCurrentQuestionIndex] = useState(0);
  const [isSubmitting, setIsSubmitting] = useState(false);
  const [gameError, setGameError] = useState<string | null>(null);
  const [startTime] = useState(Date.now());
  const [questionResult, setQuestionResult] = useState<QuestionResult | null>(null);
  
  // ✅ NEW: Game Over state
  const [showGameOver, setShowGameOver] = useState(false);
  
  const { clearCurrentSession, updateSession } = useGameStore();

  // Set initial question index based on answered questions
  useEffect(() => {
    if (currentSession && currentSession.answeredQuestions) {
      // Find the first unanswered question
      const answeredIndices = new Set(currentSession.answeredQuestions.map(aq => aq.questionIndex));
      let nextQuestionIndex = 0;
      
      // Find first question that hasn't been answered
      while (nextQuestionIndex < (level?.questions?.length || 0) && answeredIndices.has(nextQuestionIndex)) {
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
  }, [currentSession?.lives]);

  // Redirect if no session
  useEffect(() => {
    if (!sessionLoading && !currentSession) {
      navigate("/");
    }
  }, [sessionLoading, currentSession, navigate]);

  const handleAnswer = async (answer: any) => {
    if (!currentSession || !level || !level.questions || isSubmitting) return;

    setIsSubmitting(true);
    setGameError(null);

    try {
      const timeSpent = Math.floor((Date.now() - startTime) / 1000);
      
      // Prepare answer based on question type
      const question = level.questions[currentQuestionIndex];
      let answerPayload: any = {
        sessionId: currentSession._id,
        questionIndex: currentQuestionIndex,
        timeSpent
      };

      switch (question.type) {
        case "MULTIPLE_CHOICE":
          answerPayload.selectedOptionIndex = answer;
          break;
        case "TRUE_FALSE":
          answerPayload.booleanAnswer = answer;
          break;
        case "FREE_CHOICE":
          answerPayload.freeAnswer = answer;
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
        timeSpent
      };

      // Update the session with the new answered question
      const updatedAnsweredQuestions = [...(currentSession.answeredQuestions || []), newAnsweredQuestion];
      updateSession(currentSession._id, {
        answeredQuestions: updatedAnsweredQuestions,
        lives: result.livesRemaining
      });

      // ✅ COMPLETELY MANUAL - User must click "Next Question" to continue

      // ✅ Check if lives are depleted - show game over screen instead of auto-navigation
      if (result.livesRemaining <= 0) {
        // Game over will be handled by useEffect above
        return;
      }

    } catch (err) {
      setGameError(err instanceof Error ? err.message : "Failed to submit answer");
    } finally {
      setIsSubmitting(false);
    }
  };

  // ✅ Manual navigation to next UNANSWERED question
  const handleNextQuestion = () => {
    if (!level?.questions || !currentSession) return;

    // Find next unanswered question
    const answeredIndices = new Set(currentSession.answeredQuestions?.map(aq => aq.questionIndex) || []);
    let nextQuestionIndex = currentQuestionIndex + 1;
    
    // Find next question that hasn't been answered
    while (nextQuestionIndex < level.questions.length && answeredIndices.has(nextQuestionIndex)) {
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
        levelId: level._id
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
      setGameError(err instanceof Error ? err.message : "Failed to restart level");
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
          <h1 className="text-2xl font-bold text-white mb-2">Loading Game...</h1>
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
  if (!level.questions || !Array.isArray(level.questions) || level.questions.length === 0) {
    return (
      <div className="min-h-screen bg-gradient-to-br from-red-900 via-pink-900 to-purple-900 flex items-center justify-center p-4">
        <Card className="max-w-md mx-auto text-center">
          <CardContent>
            <AlertTriangle className="w-16 h-16 text-yellow-500 mx-auto mb-4" />
            <h1 className="text-2xl font-bold text-yellow-600 mb-2">No Questions Available</h1>
            <p className="text-gray-600 mb-6">
              This level doesn't have any questions configured. Please return to the course and try again.
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
      <div className="min-h-screen bg-gradient-to-br from-green-900 via-emerald-900 to-teal-900 flex items-center justify-center p-4">
        <Card className="max-w-md mx-auto text-center">
          <CardContent>
            <Trophy className="w-16 h-16 text-yellow-500 mx-auto mb-4" />
            <h1 className="text-2xl font-bold text-yellow-600 mb-2">Level Complete!</h1>
            <p className="text-gray-600 mb-6">
              You have answered all questions in this level. Redirecting to results...
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

  const currentQuestion = level.questions[currentQuestionIndex];
  
  // Calculate progress based on answered questions, not current index
  const answeredCount = currentSession.answeredQuestions?.length || 0;
  const progress = (answeredCount / level.questions.length) * 100;
  
  // Check if current question is already answered and get the answer data
  const answeredQuestion = currentSession.answeredQuestions?.find(aq => aq.questionIndex === currentQuestionIndex);
  const isCurrentQuestionAnswered = !!answeredQuestion;

  // ✅ Check if there are more unanswered questions AFTER current one
  const answeredIndices = new Set(currentSession.answeredQuestions?.map(aq => aq.questionIndex) || []);
  const hasMoreUnansweredQuestions = level.questions.some((_, index) => 
    !answeredIndices.has(index) && index > currentQuestionIndex
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
      <div className="sticky top-0 z-40 bg-black/20 backdrop-blur-xl border-b border-white/10">
        <div className="max-w-4xl mx-auto px-4 py-4">
          <div className="flex items-center justify-between">
            {/* Course Info */}
            <div className="flex items-center space-x-4">
              <button
                onClick={handleAbandonSession}
                className="p-2 hover:bg-white/10 rounded-lg transition-colors"
              >
                <ArrowLeft className="w-5 h-5 text-white" />
              </button>
              <div>
                <h1 className="text-lg font-bold text-white">{level.title}</h1>
                <p className="text-sm text-gray-300">{course.title}</p>
              </div>
            </div>

            {/* Game Stats */}
            <div className="flex items-center space-x-6">
              <div className="flex items-center space-x-2">
                <Heart className="w-5 h-5 text-red-400" />
                <span className="text-white font-bold">{currentSession.lives}</span>
              </div>
              <div className="flex items-center space-x-2">
                <Target className="w-5 h-5 text-blue-400" />
                <span className="text-white font-bold">
                  {answeredCount}/{level.questions.length}
                </span>
              </div>
              <div className="flex items-center space-x-2">
                <Star className="w-5 h-5 text-yellow-400" />
                <span className="text-white font-bold">{currentSession.stars}</span>
              </div>
            </div>
          </div>

          {/* Progress Bar */}
          <div className="mt-4">
            <div className="w-full bg-white/20 rounded-full h-2">
              <motion.div
                className="bg-gradient-to-r from-blue-400 to-purple-500 h-2 rounded-full"
                initial={{ width: 0 }}
                animate={{ width: `${progress}%` }}
                transition={{ duration: 0.5 }}
              />
            </div>
          </div>
        </div>
      </div>

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
                    Question {currentQuestionIndex + 1} of {level.questions.length}
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
                      <p className="text-red-800 dark:text-red-200">{gameError}</p>
                    </div>
                  </motion.div>
                )}

                {/* Question Component */}
                <QuestionComponent
                  question={currentQuestion}
                  questionIndex={currentQuestionIndex}
                  onAnswer={handleAnswer}
                  isSubmitting={isSubmitting}
                  isAnswered={isCurrentQuestionAnswered}
                  answeredQuestion={answeredQuestion}
                  questionResult={questionResult}
                />

                {/* Manual Navigation Controls */}
                <div className="mt-8 border-t border-gray-200 dark:border-gray-700 pt-6">
                  <div className="flex flex-col sm:flex-row items-center justify-between space-y-4 sm:space-y-0">
                    {/* Previous/Next Question Navigation */}
                    <div className="flex space-x-2">
                      {/* Previous Question */}
                      {currentQuestionIndex > 0 && (
                        <Button
                          onClick={() => setCurrentQuestionIndex(currentQuestionIndex - 1)}
                          variant="outline"
                          size="sm"
                          leftIcon={<ArrowLeft className="w-4 h-4" />}
                        >
                          Previous
                        </Button>
                      )}
                      
                      {/* Next Question */}
                      {currentQuestionIndex < level.questions.length - 1 && (
                        <Button
                          onClick={() => setCurrentQuestionIndex(currentQuestionIndex + 1)}
                          variant="outline"
                          size="sm"
                          rightIcon={<ArrowRight className="w-4 h-4" />}
                        >
                          Next
                        </Button>
                      )}
                    </div>

                    {/* Continue/Finish Actions */}
                    <div className="flex space-x-3">
                      {/* ✅ Next Unanswered Question Button - Only show if there's a result and more unanswered questions */}
                      {questionResult && hasMoreUnansweredQuestions && (
                        <Button
                          onClick={handleNextQuestion}
                          variant="primary"
                          size="lg"
                          rightIcon={<ArrowRight className="w-5 h-5" />}
                        >
                          Next Question
                        </Button>
                      )}

                      {/* ✅ Finish Level Button - Only show if there's a result and all questions are answered */}
                      {questionResult && allQuestionsAnswered && (
                        <Button
                          onClick={handleFinishLevel}
                          variant="success"
                          size="lg"
                          rightIcon={<Trophy className="w-5 h-5" />}
                        >
                          Finish Level
                        </Button>
                      )}

                      {/* Review Mode Button */}
                      {(isCurrentQuestionAnswered || questionResult) && (
                        <Button
                          onClick={() => {
                            // Navigate to first question for review
                            setCurrentQuestionIndex(0);
                            setQuestionResult(null);
                          }}
                          variant="outline"
                          size="sm"
                          leftIcon={<Eye className="w-4 h-4" />}
                        >
                          Review
                        </Button>
                      )}
                    </div>
                  </div>

                  {/* Progress Summary */}
                  <div className="mt-4 text-center">
                    <p className="text-sm text-gray-500 dark:text-gray-400">
                      {answeredCount} of {level.questions.length} questions answered
                      {hasMoreUnansweredQuestions && " • Continue to complete the level"}
                      {allQuestionsAnswered && " • All questions completed!"}
                    </p>
                  </div>
                </div>
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