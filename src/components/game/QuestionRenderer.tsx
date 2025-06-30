import { useState, useEffect } from "react";
import {
  Heart,
  Clock,
  CheckCircle,
  X,
  AlertTriangle,
  Loader2,
} from "lucide-react";

import { AnsweredQuestion, QuestionResult } from "@/services/game-service";
import Button from "@/components/ui/Button";
import Badge from "@/components/ui/Badge";
import { cn } from "@/lib/utils/class.utils";
import {
  FreeChoiceQuestion,
  MultipleChoiceQuestion,
  QuestionUnion,
  TrueFalseQuestion,
} from "@/services/level-service";

interface QuestionRendererProps {
  question: QuestionUnion;
  questionIndex: number;
  onAnswer: (answer: unknown) => void;
  isSubmitting: boolean;
  isAnswered: boolean;
  answeredQuestion?: AnsweredQuestion;
  questionResult?: QuestionResult | null;
}

export function QuestionRenderer({
  question,
  questionIndex,
  onAnswer,
  isSubmitting,
  isAnswered,
  answeredQuestion,
  questionResult,
}: QuestionRendererProps) {
  const [selectedAnswer, setSelectedAnswer] = useState<unknown>(null);

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

  const renderMultipleChoice = () => {
    const q = question as MultipleChoiceQuestion;
    if (!q.options) return null;

    return (
      <div className="space-y-3">
        {q.options.map((option, index) => {
          const isSelected = selectedAnswer === index;
          const isCorrect = option.isCorrect;
          const showAsCorrect = showCorrectAnswer && isCorrect;
          const showAsIncorrect =
            questionResult && isSelected && !questionResult.isCorrect;

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
                <div
                  className={cn(
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
                  )}
                >
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
    );
  };

  const renderTrueFalse = () => {
    const q = question as TrueFalseQuestion;
    const correctAnswer = q.correctAnswer;
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
    );
  };

  const renderFreeChoice = () => {
    const q = question as FreeChoiceQuestion;

    return (
      <div>
        <textarea
          value={(selectedAnswer as string) || ""}
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
        {showCorrectAnswer && q.acceptedAnswers && (
          <div className="mt-3 p-3 bg-green-50 dark:bg-green-900/20 rounded-lg border border-green-200 dark:border-green-800">
            <p className="text-sm font-medium text-green-800 dark:text-green-200 mb-2">
              Accepted answers:
            </p>
            <div className="flex flex-wrap gap-2">
              {q.acceptedAnswers.map((answer: string, index: number) => (
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
  };

  const renderQuestionContent = () => {
    switch (question.type) {
      case "MULTIPLE_CHOICE":
        return renderMultipleChoice();
      case "TRUE_FALSE":
        return renderTrueFalse();
      case "FREE_CHOICE":
        return renderFreeChoice();
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
            leftIcon={
              isSubmitting ? (
                <Loader2 className="w-5 h-5 animate-spin" />
              ) : (
                <CheckCircle className="w-5 h-5" />
              )
            }
          >
            {isSubmitting ? "Submitting..." : "Submit Answer"}
          </Button>
        )}
      </div>
    </div>
  );
}
