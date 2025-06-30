import { useState, useEffect } from "react";
import { CheckCircle, X } from "lucide-react";

import { TrueFalseQuestion as TrueFalseQuestionType } from "@/services/level-service";
import { AnsweredQuestion, QuestionResult } from "@/services/game-service";
import Badge from "@/components/ui/Badge";
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
    }
  };

  const handleSubmit = () => {
    if (selectedAnswer !== null && !isSubmitting && !isAnswered) {
      onAnswer(selectedAnswer);
    }
  };

  const correctAnswer = question.correctAnswer;
  const showCorrectAnswer = questionResult && !questionResult.isCorrect;
  const showTrueAsCorrect = showCorrectAnswer && correctAnswer === true;
  const showFalseAsCorrect = showCorrectAnswer && correctAnswer === false;

  return (
    <div className="space-y-6">
      {/* Question Title */}
      <div className="text-center">
        <h2 className="text-2xl font-bold text-gray-900 dark:text-gray-100 mb-4">
          {question.question}
        </h2>
      </div>

      {/* True/False Options */}
      <div className="grid grid-cols-2 gap-4">
        {/* True Option */}
        <button
          onClick={() => handleOptionClick(true)}
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
          <span className="font-bold text-green-900 dark:text-green-100">
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
          <span className="font-bold text-red-900 dark:text-red-100">
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

      {/* Submit Button */}
      {!isAnswered && !questionResult && (
        <div className="text-center">
          <button
            onClick={handleSubmit}
            disabled={selectedAnswer === null || isSubmitting}
            className={cn(
              "px-8 py-3 rounded-xl font-semibold transition-all duration-200",
              selectedAnswer !== null && !isSubmitting
                ? "bg-primary-600 hover:bg-primary-700 text-white shadow-lg"
                : "bg-gray-300 dark:bg-gray-600 text-gray-500 dark:text-gray-400 cursor-not-allowed"
            )}
          >
            {isSubmitting ? "Submitting..." : "Submit Answer"}
          </button>
        </div>
      )}
    </div>
  );
}