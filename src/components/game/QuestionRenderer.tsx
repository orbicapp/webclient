import { useState } from "react";
import { Clock, CheckCircle, X, Heart, Loader2 } from "lucide-react";

import { AnsweredQuestion, QuestionResult } from "@/services/game-service";
import Badge from "@/components/ui/Badge";
import Button from "@/components/ui/Button";
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
  selectedAnswer?: unknown;
  onSubmitAnswer?: () => void;
}

export function QuestionRenderer({
  question,
  questionIndex,
  onAnswer,
  isSubmitting,
  isAnswered,
  answeredQuestion,
  questionResult,
  selectedAnswer,
  onSubmitAnswer,
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

  // ✅ Determine if submit button should be enabled
  const canSubmit = selectedAnswer !== null && selectedAnswer !== undefined && !questionResult && !isAnswered;

  return (
    <div className={`${isMobile ? 'h-full flex flex-col space-between' : 'space-y-6'}`}>
      {/* Question Content - ✅ Mobile: Take most of the space */}
      <div className={isMobile ? 'flex-1' : ''}>
        {renderQuestionContent()}
      </div>

      {/* ✅ Submit Button - ALWAYS VISIBLE, disabled when no answer */}
      {onSubmitAnswer && (
        <div className={`${
          isMobile 
            ? 'flex-shrink-0 pt-4 border-t border-gray-200 dark:border-gray-700' 
            : 'mt-8 flex justify-end'
        }`}>
          <Button
            onClick={onSubmitAnswer}
            disabled={!canSubmit || isSubmitting}
            variant="primary"
            size={isMobile ? "md" : "lg"}
            leftIcon={
              isSubmitting ? (
                <Loader2 className="w-5 h-5 animate-spin" />
              ) : (
                <CheckCircle className="w-5 h-5" />
              )
            }
            className="shadow-lg"
            fullWidth={isMobile}
          >
            {isSubmitting ? "Submitting..." : "Submit Answer"}
          </Button>
        </div>
      )}
    </div>
  );
}