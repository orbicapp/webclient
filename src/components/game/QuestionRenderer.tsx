import { useState, useEffect } from "react";
import { Clock, CheckCircle, X, Heart } from "lucide-react";

import { AnsweredQuestion, QuestionResult } from "@/services/game-service";
import Badge from "@/components/ui/Badge";
import { QuestionUnion } from "@/services/level-service";

// Import specialized question components
import { MultipleChoiceQuestion } from "./questions/MultipleChoiceQuestion";
import { TrueFalseQuestion } from "./questions/TrueFalseQuestion";
import { FreeChoiceQuestion } from "./questions/FreeChoiceQuestion";
import { PairsQuestion } from "./questions/PairsQuestion";
import { SequenceQuestion } from "./questions/SequenceQuestion";
import { UnsupportedQuestion } from "./questions/UnsupportedQuestion";

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
  const [startTime] = useState(Date.now());

  const handleAnswer = (answer: unknown) => {
    if (!isSubmitting && !isAnswered) {
      onAnswer(answer);
    }
  };

  // Show answered status with more details
  const renderAnswerStatus = () => {
    if (isAnswered && answeredQuestion) {
      return (
        <div className="flex justify-center space-x-2 mb-6">
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
      );
    }

    // Show result feedback after submission
    if (questionResult && !isAnswered) {
      return (
        <div className="flex justify-center space-x-2 mb-6">
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
      );
    }

    return null;
  };

  const renderQuestionContent = () => {
    const commonProps = {
      questionIndex,
      onAnswer: handleAnswer,
      isSubmitting,
      isAnswered,
      answeredQuestion,
      questionResult,
    };

    switch (question.type) {
      case "MULTIPLE_CHOICE":
        return (
          <MultipleChoiceQuestion
            question={question}
            {...commonProps}
          />
        );

      case "TRUE_FALSE":
        return (
          <TrueFalseQuestion
            question={question}
            {...commonProps}
          />
        );

      case "FREE_CHOICE":
        return (
          <FreeChoiceQuestion
            question={question}
            {...commonProps}
          />
        );

      case "PAIRS":
        return (
          <PairsQuestion
            question={question}
            {...commonProps}
          />
        );

      case "SEQUENCE":
        return (
          <SequenceQuestion
            question={question}
            {...commonProps}
          />
        );

      default:
        return <UnsupportedQuestion questionType={question.type || "unknown"} />;
    }
  };

  return (
    <div className="space-y-6">
      {/* Answer Status */}
      {renderAnswerStatus()}

      {/* Question Content */}
      {renderQuestionContent()}

      {/* Additional Status Messages */}
      {isAnswered && (
        <div className="text-center">
          <p className="text-gray-500 dark:text-gray-400 text-sm">
            This question has already been answered in this session.
          </p>
        </div>
      )}

      {questionResult && !isAnswered && (
        <div className="text-center">
          <p className="text-gray-500 dark:text-gray-400 text-sm">
            Answer submitted! Review the feedback above.
          </p>
        </div>
      )}
    </div>
  );
}