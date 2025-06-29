import React, { useState } from "react";
import { motion, AnimatePresence } from "framer-motion";
import { 
  X, 
  Play, 
  Star, 
  Clock, 
  Target, 
  Trophy,
  Zap,
  Heart,
  CheckCircle,
  Lock,
  Loader2,
  AlertTriangle
} from "lucide-react";

import { LevelWithChapter } from "@/hooks/use-course-path";
import { Card, CardContent } from "@/components/ui/Card";
import Button from "@/components/ui/Button";
import Badge from "@/components/ui/Badge";
import { GameService } from "@/services/game-service";
import { useGameStore } from "@/stores/game-store";
import { cn } from "@/lib/utils/class.utils";

interface LevelModalProps {
  level: LevelWithChapter | null;
  isOpen: boolean;
  onClose: () => void;
  previewMode?: boolean;
  onJoinCourse?: () => void;
}

export const LevelModal: React.FC<LevelModalProps> = ({
  level,
  isOpen,
  onClose,
  previewMode = false,
  onJoinCourse
}) => {
  const [isStarting, setIsStarting] = useState(false);
  const [error, setError] = useState<string | null>(null);
  const { setCurrentSession } = useGameStore();

  if (!level) return null;

  const handleStartLevel = async () => {
    if (previewMode) {
      onJoinCourse?.();
      return;
    }

    if (!level.isUnlocked) {
      setError("This level is locked. Complete previous levels first.");
      return;
    }

    setIsStarting(true);
    setError(null);

    try {
      const [session, sessionError] = await GameService.startLevel({
        levelId: level._id
      });

      if (sessionError || !session) {
        setError(sessionError || "Failed to start level");
        return;
      }

      // Set the session in the store
      setCurrentSession(session);
      
      // Close modal and navigate to game (you can add navigation logic here)
      onClose();
      
      // TODO: Navigate to game page with session
      console.log("Game session started:", session);
      
    } catch (err) {
      setError(err instanceof Error ? err.message : "Failed to start level");
    } finally {
      setIsStarting(false);
    }
  };

  const getDifficultyColor = () => {
    const questionCount = level.questions?.length || 0;
    if (questionCount <= 3) return "text-green-600 bg-green-100 dark:bg-green-900/20";
    if (questionCount <= 6) return "text-yellow-600 bg-yellow-100 dark:bg-yellow-900/20";
    return "text-red-600 bg-red-100 dark:bg-red-900/20";
  };

  const getDifficultyText = () => {
    const questionCount = level.questions?.length || 0;
    if (questionCount <= 3) return "Easy";
    if (questionCount <= 6) return "Medium";
    return "Hard";
  };

  return (
    <AnimatePresence>
      {isOpen && (
        <motion.div
          className="fixed inset-0 z-50 flex items-center justify-center p-4 bg-black/60 backdrop-blur-sm"
          initial={{ opacity: 0 }}
          animate={{ opacity: 1 }}
          exit={{ opacity: 0 }}
          onClick={onClose}
        >
          <motion.div
            className="w-full max-w-2xl max-h-[90vh] overflow-y-auto"
            initial={{ opacity: 0, scale: 0.9, y: 20 }}
            animate={{ opacity: 1, scale: 1, y: 0 }}
            exit={{ opacity: 0, scale: 0.9, y: 20 }}
            transition={{ type: "spring", duration: 0.5 }}
            onClick={(e) => e.stopPropagation()}
          >
            <Card className="bg-white dark:bg-gray-800 border-2 border-gray-200 dark:border-gray-700 shadow-2xl">
              <CardContent>
                {/* Header */}
                <div className="flex items-start justify-between mb-6">
                  <div className="flex-1">
                    <div className="flex items-center space-x-3 mb-3">
                      <div className={cn(
                        "w-12 h-12 rounded-2xl flex items-center justify-center shadow-lg",
                        previewMode
                          ? "bg-gradient-to-br from-orange-400 to-amber-600"
                          : level.isCompleted
                            ? "bg-gradient-to-br from-emerald-400 to-green-600"
                            : level.isUnlocked
                              ? "bg-gradient-to-br from-blue-400 to-purple-600"
                              : "bg-gradient-to-br from-gray-400 to-gray-600"
                      )}>
                        {previewMode ? (
                          <Target className="w-6 h-6 text-white" />
                        ) : level.isCompleted ? (
                          <CheckCircle className="w-6 h-6 text-white" />
                        ) : level.isUnlocked ? (
                          <Play className="w-6 h-6 text-white" />
                        ) : (
                          <Lock className="w-6 h-6 text-white" />
                        )}
                      </div>
                      
                      <div className="flex-1">
                        <h2 className="text-2xl font-bold text-gray-900 dark:text-gray-100 mb-1">
                          {level.title}
                        </h2>
                        <div className="flex items-center space-x-2">
                          <Badge variant="primary" size="sm">
                            Level {level.chapterNumber}-{level.levelNumber}
                          </Badge>
                          <Badge variant="secondary" size="sm">
                            {level.chapter.title}
                          </Badge>
                          {previewMode && (
                            <Badge variant="warning" size="sm">
                              Preview Mode
                            </Badge>
                          )}
                        </div>
                      </div>
                    </div>
                  </div>
                  
                  <button
                    onClick={onClose}
                    className="p-2 hover:bg-gray-100 dark:hover:bg-gray-700 rounded-lg transition-colors"
                  >
                    <X className="w-5 h-5 text-gray-500 dark:text-gray-400" />
                  </button>
                </div>

                {/* Description */}
                <div className="mb-6">
                  <p className="text-gray-600 dark:text-gray-300 leading-relaxed">
                    {level.description}
                  </p>
                </div>

                {/* Stats Grid */}
                <div className="grid grid-cols-2 md:grid-cols-4 gap-4 mb-6">
                  <div className="text-center p-4 bg-gray-50 dark:bg-gray-700 rounded-xl">
                    <div className="w-8 h-8 bg-blue-500 rounded-lg flex items-center justify-center mx-auto mb-2">
                      <Target className="w-4 h-4 text-white" />
                    </div>
                    <div className="text-lg font-bold text-gray-900 dark:text-gray-100">
                      {level.questions?.length || 0}
                    </div>
                    <div className="text-xs text-gray-500 dark:text-gray-400">
                      Questions
                    </div>
                  </div>

                  <div className="text-center p-4 bg-gray-50 dark:bg-gray-700 rounded-xl">
                    <div className={cn(
                      "w-8 h-8 rounded-lg flex items-center justify-center mx-auto mb-2",
                      getDifficultyColor()
                    )}>
                      <Zap className="w-4 h-4" />
                    </div>
                    <div className="text-lg font-bold text-gray-900 dark:text-gray-100">
                      {getDifficultyText()}
                    </div>
                    <div className="text-xs text-gray-500 dark:text-gray-400">
                      Difficulty
                    </div>
                  </div>

                  <div className="text-center p-4 bg-gray-50 dark:bg-gray-700 rounded-xl">
                    <div className="w-8 h-8 bg-red-500 rounded-lg flex items-center justify-center mx-auto mb-2">
                      <Heart className="w-4 h-4 text-white" />
                    </div>
                    <div className="text-lg font-bold text-gray-900 dark:text-gray-100">
                      3
                    </div>
                    <div className="text-xs text-gray-500 dark:text-gray-400">
                      Lives
                    </div>
                  </div>

                  <div className="text-center p-4 bg-gray-50 dark:bg-gray-700 rounded-xl">
                    <div className="w-8 h-8 bg-yellow-500 rounded-lg flex items-center justify-center mx-auto mb-2">
                      <Star className="w-4 h-4 text-white" />
                    </div>
                    <div className="text-lg font-bold text-gray-900 dark:text-gray-100">
                      {previewMode ? "?" : level.stars}
                    </div>
                    <div className="text-xs text-gray-500 dark:text-gray-400">
                      Best Stars
                    </div>
                  </div>
                </div>

                {/* Progress Info (only if not preview mode and completed) */}
                {!previewMode && level.isCompleted && (
                  <div className="mb-6 p-4 bg-green-50 dark:bg-green-900/20 rounded-xl border border-green-200 dark:border-green-800">
                    <div className="flex items-center space-x-3">
                      <div className="w-10 h-10 bg-green-500 rounded-full flex items-center justify-center">
                        <Trophy className="w-5 h-5 text-white" />
                      </div>
                      <div>
                        <h3 className="font-semibold text-green-900 dark:text-green-100">
                          Level Completed!
                        </h3>
                        <p className="text-sm text-green-700 dark:text-green-300">
                          You earned {level.stars} out of 3 stars
                        </p>
                      </div>
                    </div>
                  </div>
                )}

                {/* Error Message */}
                {error && (
                  <motion.div
                    className="mb-6 p-4 bg-red-50 dark:bg-red-900/20 rounded-xl border border-red-200 dark:border-red-800"
                    initial={{ opacity: 0, y: -10 }}
                    animate={{ opacity: 1, y: 0 }}
                  >
                    <div className="flex items-center space-x-3">
                      <AlertTriangle className="w-5 h-5 text-red-600 dark:text-red-400" />
                      <p className="text-red-800 dark:text-red-200 font-medium">
                        {error}
                      </p>
                    </div>
                  </motion.div>
                )}

                {/* Action Buttons */}
                <div className="flex flex-col sm:flex-row gap-3">
                  {previewMode ? (
                    <>
                      <Button
                        onClick={handleStartLevel}
                        variant="primary"
                        size="lg"
                        fullWidth
                        leftIcon={<Play className="w-5 h-5" />}
                        className="bg-gradient-to-r from-orange-500 to-amber-600 hover:from-orange-600 hover:to-amber-700"
                      >
                        Join Course to Play
                      </Button>
                      <Button
                        onClick={onClose}
                        variant="outline"
                        size="lg"
                        className="sm:w-auto"
                      >
                        Close Preview
                      </Button>
                    </>
                  ) : (
                    <>
                      <Button
                        onClick={handleStartLevel}
                        disabled={!level.isUnlocked || isStarting}
                        variant={level.isCompleted ? "secondary" : "primary"}
                        size="lg"
                        fullWidth
                        leftIcon={
                          isStarting ? (
                            <Loader2 className="w-5 h-5 animate-spin" />
                          ) : level.isCompleted ? (
                            <Trophy className="w-5 h-5" />
                          ) : (
                            <Play className="w-5 h-5" />
                          )
                        }
                      >
                        {isStarting
                          ? "Starting Level..."
                          : level.isCompleted
                            ? "Play Again"
                            : level.isUnlocked
                              ? "Start Level"
                              : "Locked"
                        }
                      </Button>
                      <Button
                        onClick={onClose}
                        variant="outline"
                        size="lg"
                        className="sm:w-auto"
                      >
                        Cancel
                      </Button>
                    </>
                  )}
                </div>

                {/* Unlock Requirements */}
                {!previewMode && !level.isUnlocked && (
                  <div className="mt-4 p-3 bg-gray-50 dark:bg-gray-700 rounded-lg">
                    <p className="text-sm text-gray-600 dark:text-gray-400 text-center">
                      Complete previous levels to unlock this one
                    </p>
                  </div>
                )}
              </CardContent>
            </Card>
          </motion.div>
        </motion.div>
      )}
    </AnimatePresence>
  );
};