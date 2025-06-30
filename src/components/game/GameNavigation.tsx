import { ArrowLeft, ArrowRight, Trophy, Eye } from "lucide-react";

import { QuestionResult } from "@/services/game-service";
import Button from "@/components/ui/Button";
import { useResponsive } from "@/hooks/use-responsive";

interface GameNavigationProps {
  currentQuestionIndex: number;
  totalQuestions: number;
  isCurrentQuestionAnswered: boolean;
  questionResult: QuestionResult | null;
  hasMoreUnansweredQuestions: boolean;
  allQuestionsAnswered: boolean;
  answeredCount: number;
  onPreviousQuestion: () => void;
  onNextQuestion: () => void;
  onNextUnansweredQuestion: () => void;
  onFinishLevel: () => void;
  onReviewMode: () => void;
}

export function GameNavigation({
  currentQuestionIndex,
  totalQuestions,
  isCurrentQuestionAnswered,
  questionResult,
  hasMoreUnansweredQuestions,
  allQuestionsAnswered,
  answeredCount,
  onPreviousQuestion,
  onNextQuestion,
  onNextUnansweredQuestion,
  onFinishLevel,
  onReviewMode,
}: GameNavigationProps) {
  const { isMobile } = useResponsive();

  return (
    <div className={`${isMobile ? '' : 'mt-8 border-t border-gray-200 dark:border-gray-700 pt-6'}`}>
      <div className="flex flex-col sm:flex-row items-center justify-between space-y-4 sm:space-y-0">
        {/* Previous/Next Question Navigation - ✅ Hide on mobile */}
        {!isMobile && (
          <div className="flex space-x-2">
            {/* Previous Question */}
            {currentQuestionIndex > 0 && (
              <Button
                onClick={onPreviousQuestion}
                variant="outline"
                size="sm"
                leftIcon={<ArrowLeft className="w-4 h-4" />}
              >
                Previous
              </Button>
            )}

            {/* Next Question */}
            {currentQuestionIndex < totalQuestions - 1 && (
              <Button
                onClick={onNextQuestion}
                variant="outline"
                size="sm"
                rightIcon={<ArrowRight className="w-4 h-4" />}
              >
                Next
              </Button>
            )}
          </div>
        )}

        {/* Continue/Finish Actions */}
        <div className={`flex space-x-3 ${isMobile ? 'w-full' : ''}`}>
          {/* Next Unanswered Question Button - Only show if there's a result and more unanswered questions */}
          {questionResult && hasMoreUnansweredQuestions && (
            <Button
              onClick={onNextUnansweredQuestion}
              variant="primary"
              size={isMobile ? "md" : "lg"}
              rightIcon={<ArrowRight className="w-5 h-5" />}
              fullWidth={isMobile}
            >
              Next Question
            </Button>
          )}

          {/* Finish Level Button - Only show if there's a result and all questions are answered */}
          {questionResult && allQuestionsAnswered && (
            <Button
              onClick={onFinishLevel}
              variant="success"
              size={isMobile ? "md" : "lg"}
              rightIcon={<Trophy className="w-5 h-5" />}
              fullWidth={isMobile}
            >
              Finish Level
            </Button>
          )}

          {/* Review Mode Button - ✅ Hide on mobile */}
          {!isMobile && (isCurrentQuestionAnswered || questionResult) && (
            <Button
              onClick={onReviewMode}
              variant="outline"
              size="sm"
              leftIcon={<Eye className="w-4 h-4" />}
            >
              Review
            </Button>
          )}
        </div>
      </div>
    </div>
  );
}