import { useState, useEffect } from "react";
import { CheckCircle, X } from "lucide-react";

import { TrueFalseQuestion as TrueFalseQuestionType } from "@/services/level-service";
import { AnsweredQuestion, QuestionResult } from "@/services/game-service";
import Badge from "@/components/ui/Badge";
import { useResponsive } from "@/hooks/use-responsive";
import { cn } from "@/lib/utils/class.utils";

interface TrueFalseQuestionProps {
  question: TrueFalseQuestionType;
  questionIndex: number;
  onAnswer: (answer: boolean) => void;
  isSubmitting: boolean;
  isAnswered: boolean;
  answeredQuestion?: AnsweredQuestion;
  questionResult?: QuestionResult | null;
}

export function TrueFalseQuestion({
  question,
  onAnswer,
  isSubmitting,
  isAnswered,
  answeredQuestion,
  questionResult,
}: TrueFalseQuestionProps) {
  const [selectedAnswer, setSelectedAnswer] = useState<boolean | null>(null);
  const { isMobile } = useResponsive();

  // Set the previous answer if question was already answered
  useEffect(() => {
    if (isAnswered && answeredQuestion) {
      setSelectedAnswer(answeredQuestion.userAnswer as boolean);
    } else {
      setSelectedAnswer(null);
    }
  }, [isAnswered, answeredQuestion]);

  const handleOptionClick = (value: boolean) => {
    if (!isAnswered && !isSubmitting) {
      setSelectedAnswer(value);
      // ✅ Call onAnswer immediately to update parent state
      onAnswer(value);
    }
  };

  const correctAnswer = question.correctAnswer;
  const showCorrectAnswer = questionResult && !questionResult.isCorrect;
  const showTrueAsCorrect = showCorrectAnswer && correctAnswer === true;
  const showFalseAsCorrect = showCorrectAnswer && correctAnswer === false;

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

      {/* True/False Options - ✅ Mobile: Centered and larger */}
      <div className={`grid grid-cols-2 gap-4 ${isMobile ? 'flex-1 content-center' : ''}`}>
        {/* True Option */}
        <button
          onClick={() => handleOptionClick(true)}
          disabled={isSubmitting || isAnswered}
          className={cn(
            `rounded-xl border-2 transition-all duration-200 text-center ${
              isMobile ? 'p-8' : 'p-6'
            }`,
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
          <CheckCircle className={`mx-auto mb-2 text-green-600 ${
            isMobile ? 'w-12 h-12' : 'w-8 h-8'
          }`} />
          <span className={`font-bold text-green-900 dark:text-green-100 ${
            isMobile ? 'text-xl' : ''
          }`}>
            True
          </span>
          {showTrueAsCorrect && (
            <div className="mt-2">
              <Badge variant="success" size="sm">
                Correct Answer
              </Badge>
            </div>
          )}
          {isAnswered && selectedAnswer === true && answeredQuestion && (
            <div className="mt-2">
              {answeredQuestion.isCorrect ? (
                <Badge variant="success" size="sm">
                  Correct
                </Badge>
              ) : (
                <Badge variant="error" size="sm">
                  Incorrect
                </Badge>
              )}
            </div>
          )}
        </button>

        {/* False Option */}
        <button
          onClick={() => handleOptionClick(false)}
          disabled={isSubmitting || isAnswered}
          className={cn(
            `rounded-xl border-2 transition-all duration-200 text-center ${
              isMobile ? 'p-8' : 'p-6'
            }`,
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
          <X className={`mx-auto mb-2 text-red-600 ${
            isMobile ? 'w-12 h-12' : 'w-8 h-8'
          }`} />
          <span className={`font-bold text-red-900 dark:text-red-100 ${
            isMobile ? 'text-xl' : ''
          }`}>
            False
          </span>
          {showFalseAsCorrect && (
            <div className="mt-2">
              <Badge variant="success" size="sm">
                Correct Answer
              </Badge>
            </div>
          )}
          {isAnswered && selectedAnswer === false && answeredQuestion && (
            <div className="mt-2">
              {answeredQuestion.isCorrect ? (
                <Badge variant="success" size="sm">
                  Correct
                </Badge>
              ) : (
                <Badge variant="error" size="sm">
                  Incorrect
                </Badge>
              )}
            </div>
          )}
        </button>
      </div>
    </div>
  );
}