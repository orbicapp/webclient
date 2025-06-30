import { useState, useEffect } from "react";
import { Clock, CheckCircle, X, Heart } from "lucide-react";

import { AnsweredQuestion, QuestionResult } from "@/services/game-service";
import Badge from "@/components/ui/Badge";
import { QuestionUnion } from "@/services/level-service";
import { useResponsive } from "@/hooks/use-responsive";

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
  const { isMobile } = useResponsive();

  const handleAnswer = (answer: unknown) => {
    if (!isSubmitting && !isAnswered) {
      onAnswer(answer);
    }
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
    <div className={`space-y-6 ${isMobile ? 'h-full flex flex-col' : ''}`}>
      {/* Question Content - ✅ Mobile: Take full available space */}
      <div className={isMobile ? 'flex-1' : ''}>
        {renderQuestionContent()}
      </div>
    </div>
  );
}