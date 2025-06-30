import { useState, useEffect } from "react";
import { CheckCircle, X } from "lucide-react";

import { FreeChoiceQuestion as FreeChoiceQuestionType } from "@/services/level-service";
import { AnsweredQuestion, QuestionResult } from "@/services/game-service";
import Badge from "@/components/ui/Badge";
import { useResponsive } from "@/hooks/use-responsive";
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
  const { isMobile } = useResponsive();

  // Set the previous answer if question was already answered
  useEffect(() => {
    if (isAnswered && answeredQuestion) {
      setSelectedAnswer((answeredQuestion.userAnswer as string) || "");
    } else {
      setSelectedAnswer("");
    }
  }, [isAnswered, answeredQuestion]);

  const handleInputChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    if (!isAnswered && !isSubmitting) {
      const value = e.target.value;
      setSelectedAnswer(value);
      // ✅ Call onAnswer immediately to update parent state
      onAnswer(value);
    }
  };

  const handleKeyDown = (e: React.KeyboardEvent<HTMLInputElement>) => {
    if (e.key === 'Enter' && selectedAnswer.trim() && !isSubmitting && !isAnswered) {
      // ✅ Don't submit here, let the footer button handle it
      e.preventDefault();
    }
  };

  const showCorrectAnswer = questionResult && !questionResult.isCorrect;

  // Determine input background color based on result
  const getInputBackgroundColor = () => {
    if (questionResult) {
      return questionResult.isCorrect 
        ? "bg-green-50 dark:bg-green-900/20 border-green-500" 
        : "bg-red-50 dark:bg-red-900/20 border-red-500";
    }
    if (isAnswered && answeredQuestion) {
      return answeredQuestion.isCorrect
        ? "bg-green-50 dark:bg-green-900/20 border-green-500"
        : "bg-red-50 dark:bg-red-900/20 border-red-500";
    }
    return "border-gray-200 dark:border-gray-700";
  };

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

      {/* Text Input - Single line - ✅ Mobile: Centered in available space */}
      <div className={isMobile ? 'flex-1 flex flex-col justify-center' : ''}>
        <input
          type="text"
          value={selectedAnswer}
          onChange={handleInputChange}
          onKeyDown={handleKeyDown}
          disabled={isSubmitting || isAnswered}
          placeholder={isAnswered ? "Your answer" : "Type your answer here..."}
          className={cn(
            `w-full border-2 rounded-xl focus:border-primary-500 focus:outline-none text-gray-900 dark:text-gray-100 bg-white dark:bg-gray-800 ${
              isMobile ? 'p-6 text-lg' : 'p-4'
            }`,
            getInputBackgroundColor(),
            (isSubmitting || isAnswered) && "cursor-not-allowed"
          )}
          autoFocus={isMobile}
        />

        {/* Character count */}
        <div className={`flex justify-between items-center ${isMobile ? 'mt-4' : 'mt-2'}`}>
          <div className="text-sm text-gray-500 dark:text-gray-400">
            {selectedAnswer.length} characters
          </div>
        </div>

        {/* Show correct answers for free choice */}
        {showCorrectAnswer && question.acceptedAnswers && (
          <div className={`p-3 bg-green-50 dark:bg-green-900/20 rounded-lg border border-green-200 dark:border-green-800 ${
            isMobile ? 'mt-6' : 'mt-3'
          }`}>
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
          <div className={`text-center ${isMobile ? 'mt-6' : 'mt-3'}`}>
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
    </div>
  );
}