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
  RotateCcw
} from "lucide-react";
import { useParams, useNavigate } from "react-router-dom";

import { useCurrentGameSession } from "@/hooks/use-game";
import { useLevel } from "@/hooks/use-level";
import { useCourse } from "@/hooks/use-course";
import { GameService } from "@/services/game-service";
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
}

const QuestionComponent: React.FC<QuestionComponentProps> = ({
  question,
  questionIndex,
  onAnswer,
  isSubmitting
}) => {
  const [selectedAnswer, setSelectedAnswer] = useState<any>(null);

  const handleSubmit = () => {
    if (selectedAnswer !== null && !isSubmitting) {
      onAnswer(selectedAnswer);
    }
  };

  const renderQuestionContent = () => {
    switch (question.type) {
      case "MULTIPLE_CHOICE":
        return (
          <div className="space-y-3">
            {question.options.map((option: any, index: number) => (
              <button
                key={index}
                onClick={() => setSelectedAnswer(index)}
                disabled={isSubmitting}
                className={cn(
                  "w-full p-4 text-left rounded-xl border-2 transition-all duration-200",
                  selectedAnswer === index
                    ? "border-primary-500 bg-primary-50 dark:bg-primary-900/20"
                    : "border-gray-200 dark:border-gray-700 hover:border-primary-300 dark:hover:border-primary-600",
                  isSubmitting && "opacity-50 cursor-not-allowed"
                )}
              >
                <div className="flex items-center space-x-3">
                  <div className={cn(
                    "w-6 h-6 rounded-full border-2 flex items-center justify-center",
                    selectedAnswer === index
                      ? "border-primary-500 bg-primary-500"
                      : "border-gray-300 dark:border-gray-600"
                  )}>
                    {selectedAnswer === index && (
                      <div className="w-3 h-3 bg-white rounded-full" />
                    )}
                  </div>
                  <span className="text-gray-900 dark:text-gray-100 font-medium">
                    {option.text}
                  </span>
                </div>
              </button>
            ))}
          </div>
        );

      case "TRUE_FALSE":
        return (
          <div className="grid grid-cols-2 gap-4">
            <button
              onClick={() => setSelectedAnswer(true)}
              disabled={isSubmitting}
              className={cn(
                "p-6 rounded-xl border-2 transition-all duration-200 text-center",
                selectedAnswer === true
                  ? "border-green-500 bg-green-50 dark:bg-green-900/20"
                  : "border-gray-200 dark:border-gray-700 hover:border-green-300",
                isSubmitting && "opacity-50 cursor-not-allowed"
              )}
            >
              <CheckCircle className="w-8 h-8 mx-auto mb-2 text-green-600" />
              <span className="font-bold text-green-900 dark:text-green-100">True</span>
            </button>
            <button
              onClick={() => setSelectedAnswer(false)}
              disabled={isSubmitting}
              className={cn(
                "p-6 rounded-xl border-2 transition-all duration-200 text-center",
                selectedAnswer === false
                  ? "border-red-500 bg-red-50 dark:bg-red-900/20"
                  : "border-gray-200 dark:border-gray-700 hover:border-red-300",
                isSubmitting && "opacity-50 cursor-not-allowed"
              )}
            >
              <X className="w-8 h-8 mx-auto mb-2 text-red-600" />
              <span className="font-bold text-red-900 dark:text-red-100">False</span>
            </button>
          </div>
        );

      case "FREE_CHOICE":
        return (
          <div>
            <textarea
              value={selectedAnswer || ""}
              onChange={(e) => setSelectedAnswer(e.target.value)}
              disabled={isSubmitting}
              placeholder="Type your answer here..."
              className="w-full p-4 border-2 border-gray-200 dark:border-gray-700 rounded-xl focus:border-primary-500 focus:outline-none resize-none h-32 text-gray-900 dark:text-gray-100 bg-white dark:bg-gray-800"
            />
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
      </div>

      {renderQuestionContent()}

      <div className="text-center">
        <Button
          onClick={handleSubmit}
          disabled={selectedAnswer === null || isSubmitting}
          variant="primary"
          size="lg"
          leftIcon={isSubmitting ? <Loader2 className="w-5 h-5 animate-spin" /> : <CheckCircle className="w-5 h-5" />}
        >
          {isSubmitting ? "Submitting..." : "Submit Answer"}
        </Button>
      </div>
    </div>
  );
};

export function GameSessionPage() {
  const navigate = useNavigate();
  const [sessionLoading, currentSession, sessionError] = useCurrentGameSession();
  const [levelLoading, level] = useLevel(currentSession?.levelId || "");
  const [courseLoading, course] = useCourse(currentSession?.courseId || "");
  
  const [currentQuestionIndex, setCurrentQuestionIndex] = useState(0);
  const [isSubmitting, setIsSubmitting] = useState(false);
  const [gameError, setGameError] = useState<string | null>(null);
  const [startTime] = useState(Date.now());
  
  const { clearCurrentSession } = useGameStore();

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
      const timeSpent = Date.now() - startTime;
      
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

      // Handle result
      if (result.isLastQuestion) {
        // Game completed - navigate to completion page
        navigate(`/course/${currentSession.courseId}/completion/${currentSession._id}`);
      } else {
        // Move to next question
        setCurrentQuestionIndex(prev => prev + 1);
      }

      // Check if lives are depleted
      if (result.livesRemaining <= 0) {
        // Game over - navigate back to course
        navigate(`/course/${currentSession.courseId}`);
      }

    } catch (err) {
      setGameError(err instanceof Error ? err.message : "Failed to submit answer");
    } finally {
      setIsSubmitting(false);
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
      // Navigate anyway
      navigate(`/course/${currentSession.courseId}`);
    }
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
              onClick={() => navigate(`/course/${currentSession.courseId}`)} 
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
      <div className="min-h-screen bg-gradient-to-br from-red-900 via-pink-900 to-purple-900 flex items-center justify-center p-4">
        <Card className="max-w-md mx-auto text-center">
          <CardContent>
            <AlertTriangle className="w-16 h-16 text-yellow-500 mx-auto mb-4" />
            <h1 className="text-2xl font-bold text-yellow-600 mb-2">Question Not Found</h1>
            <p className="text-gray-600 mb-6">
              The requested question is not available. Please return to the course.
            </p>
            <Button 
              onClick={() => navigate(`/course/${currentSession.courseId}`)} 
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
  const progress = ((currentQuestionIndex + 1) / level.questions.length) * 100;

  return (
    <div className="min-h-screen bg-gradient-to-br from-indigo-900 via-purple-900 to-pink-900">
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
                  {currentQuestionIndex + 1}/{level.questions.length}
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