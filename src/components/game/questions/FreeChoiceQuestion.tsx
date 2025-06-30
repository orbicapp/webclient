import { useState, useEffect } from "react";
import { CheckCircle, X } from "lucide-react";

import { FreeChoiceQuestion as FreeChoiceQuestionType } from "@/services/level-service";
import { AnsweredQuestion, QuestionResult } from "@/services/game-service";
import Badge from "@/components/ui/Badge";
import { cn } from "@/lib/utils/class.utils";

interface FreeChoiceQuestionProps {
  question: FreeChoiceQuestionType;
  questionIndex: number;
  onAnswer: (answer: string) => void;
  isSubmitting: boolean;
  isAnswered: boolean;
  answeredQuestion?: AnsweredQuestion;
  questionResult?: QuestionResult | null;
}

export function FreeChoiceQuestion({
  question,
  onAnswer,
  isSubmitting,
  isAnswered,
  answeredQuestion,
  questionResult,
}: FreeChoiceQuestionProps) {
  const [selectedAnswer, setSelectedAnswer] = useState<string>("");

  // Set the previous answer if question was already answered
  useEffect(() => {
    if (isAnswered && answeredQuestion) {
      setSelectedAnswer((answeredQuestion.userAnswer as string) || "");
    } else {
      setSelectedAnswer("");
    }
  }, [isAnswered, answeredQuestion]);

  const handleInputChange = (e: React.ChangeEvent<HTMLTextAreaElement>) => {
    if (!isAnswered && !isSubmitting) {
      setSelectedAnswer(e.target.value);
    }
  };

  const handleSubmit = () => {
    if (selectedAnswer.trim() && !isSubmitting && !isAnswered) {
      onAnswer(selectedAnswer.trim());
    }
  };

  const showCorrectAnswer = questionResult && !questionResult.isCorrect;

  return (
    <div className="space-y-6">
      {/* Question Title */}
      <div className="text-center">
        <h2 className="text-2xl font-bold text-gray-900 dark:text-gray-100 mb-4">
          {question.question}
        </h2>
      </div>

      {/* Text Input */}
      <div>
        <textarea
          value={selectedAnswer}
          onChange={handleInputChange}
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

        {/* Character count */}
        <div className="flex justify-between items-center mt-2">
          <div className="text-sm text-gray-500 dark:text-gray-400">
            {selectedAnswer.length} characters
          </div>
          {selectedAnswer.length > 10 && !isAnswered && (
            <div className="flex items-center space-x-1 text-green-600 dark:text-green-400">
              <CheckCircle className="w-4 h-4" />
              <span className="text-sm">Good length</span>
            </div>
          )}
        </div>

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

        {/* Answer status */}
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

      {/* Submit Button */}
      {!isAnswered && !questionResult && (
        <div className="text-center">
          <button
            onClick={handleSubmit}
            disabled={!selectedAnswer.trim() || isSubmitting}
            className={cn(
              "px-8 py-3 rounded-xl font-semibold transition-all duration-200",
              selectedAnswer.trim() && !isSubmitting
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