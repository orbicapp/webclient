import { useState, useEffect } from "react";
import { CheckCircle, X } from "lucide-react";

import { MultipleChoiceQuestion as MultipleChoiceQuestionType } from "@/services/level-service";
import { AnsweredQuestion, QuestionResult } from "@/services/game-service";
import Badge from "@/components/ui/Badge";
import { useResponsive } from "@/hooks/use-responsive";
import { cn } from "@/lib/utils/class.utils";

interface MultipleChoiceQuestionProps {
  question: MultipleChoiceQuestionType;
  questionIndex: number;
  onAnswer: (answer: number) => void;
  isSubmitting: boolean;
  isAnswered: boolean;
  answeredQuestion?: AnsweredQuestion;
  questionResult?: QuestionResult | null;
}

export function MultipleChoiceQuestion({
  question,
  onAnswer,
  isSubmitting,
  isAnswered,
  answeredQuestion,
  questionResult,
}: MultipleChoiceQuestionProps) {
  const [selectedAnswer, setSelectedAnswer] = useState<number | null>(null);
  const { isMobile } = useResponsive();

  // Set the previous answer if question was already answered
  useEffect(() => {
    if (isAnswered && answeredQuestion) {
      setSelectedAnswer(answeredQuestion.userAnswer as number);
    } else {
      setSelectedAnswer(null);
    }
  }, [isAnswered, answeredQuestion]);

  const handleOptionClick = (optionIndex: number) => {
    if (!isAnswered && !isSubmitting) {
      setSelectedAnswer(optionIndex);
      // ✅ Call onAnswer immediately to update parent state
      onAnswer(optionIndex);
    }
  };

  // Show correct answer information when available
  const showCorrectAnswer = questionResult && !questionResult.isCorrect;

  if (!question.options) return null;

  return (
    <div className={`space-y-6 ${isMobile ? 'h-full flex flex-col' : ''}`}>
      {/* Question Title */}
      <div className={`text-center ${isMobile ? 'flex-shrink-0' : ''}`}>
        <h2 className={`font-bold text-gray-900 dark:text-gray-100 mb-4 ${
          isMobile ? 'text-xl' : 'text-2xl'
        }`}>
          {question.question}
        </h2>
      </div>

      {/* Options - ✅ Mobile: Scrollable if needed */}
      <div className={`space-y-3 ${isMobile ? 'flex-1 overflow-y-auto' : ''}`}>
        {question.options.map((option, index) => {
          const isSelected = selectedAnswer === index;
          const isCorrect = option.isCorrect;
          const showAsCorrect = showCorrectAnswer && isCorrect;
          const showAsIncorrect =
            questionResult && isSelected && !questionResult.isCorrect;

          return (
            <button
              key={index}
              onClick={() => handleOptionClick(index)}
              disabled={isSubmitting || isAnswered}
              className={cn(
                `w-full text-left rounded-xl border-2 transition-all duration-200 ${
                  isMobile ? 'p-6' : 'p-4'
                }`,
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
                <div
                  className={cn(
                    `w-6 h-6 rounded-full border-2 flex items-center justify-center ${
                      isMobile ? 'flex-shrink-0' : ''
                    }`,
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
                  )}
                >
                  {(isSelected || showAsCorrect) && (
                    <div className="w-3 h-3 bg-white rounded-full" />
                  )}
                </div>
                <span className={`text-gray-900 dark:text-gray-100 font-medium ${
                  isMobile ? 'text-lg leading-relaxed' : ''
                }`}>
                  {option.text}
                </span>
                {/* Show indicators */}
                {showAsCorrect && (
                  <div className="ml-auto">
                    <Badge variant="success" size="sm">
                      Correct Answer
                    </Badge>
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
    </div>
  );
}