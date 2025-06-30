import { useState, useEffect } from "react";
import { CheckCircle, X, Shuffle } from "lucide-react";

import { PairsQuestion as PairsQuestionType } from "@/services/level-service";
import { AnsweredQuestion, QuestionResult } from "@/services/game-service";
import Badge from "@/components/ui/Badge";
import { cn } from "@/lib/utils/class.utils";

interface PairsQuestionProps {
  question: PairsQuestionType;
  questionIndex: number;
  onAnswer: (answer: string[]) => void;
  isSubmitting: boolean;
  isAnswered: boolean;
  answeredQuestion?: AnsweredQuestion;
  questionResult?: QuestionResult | null;
}

interface PairMatch {
  leftIndex: number;
  rightIndex: number;
}

export function PairsQuestion({
  question,
  onAnswer,
  isSubmitting,
  isAnswered,
  answeredQuestion,
  questionResult,
}: PairsQuestionProps) {
  const [matches, setMatches] = useState<PairMatch[]>([]);
  const [selectedLeft, setSelectedLeft] = useState<number | null>(null);
  const [selectedRight, setSelectedRight] = useState<number | null>(null);

  // Set the previous answer if question was already answered
  useEffect(() => {
    if (isAnswered && answeredQuestion) {
      // Convert answer back to matches format
      const userAnswer = answeredQuestion.userAnswer as string[];
      const newMatches: PairMatch[] = [];
      userAnswer.forEach((match, index) => {
        const [leftIndex, rightIndex] = match.split('-').map(Number);
        newMatches.push({ leftIndex, rightIndex });
      });
      setMatches(newMatches);
    } else {
      setMatches([]);
    }
  }, [isAnswered, answeredQuestion]);

  const handleLeftClick = (index: number) => {
    if (isAnswered || isSubmitting) return;
    
    if (selectedLeft === index) {
      setSelectedLeft(null);
    } else {
      setSelectedLeft(index);
      if (selectedRight !== null) {
        createMatch(index, selectedRight);
      }
    }
  };

  const handleRightClick = (index: number) => {
    if (isAnswered || isSubmitting) return;
    
    if (selectedRight === index) {
      setSelectedRight(null);
    } else {
      setSelectedRight(index);
      if (selectedLeft !== null) {
        createMatch(selectedLeft, index);
      }
    }
  };

  const createMatch = (leftIndex: number, rightIndex: number) => {
    // Remove any existing matches for these items
    const newMatches = matches.filter(
      match => match.leftIndex !== leftIndex && match.rightIndex !== rightIndex
    );
    
    // Add new match
    newMatches.push({ leftIndex, rightIndex });
    setMatches(newMatches);
    
    // Clear selections
    setSelectedLeft(null);
    setSelectedRight(null);
  };

  const removeMatch = (matchToRemove: PairMatch) => {
    if (isAnswered || isSubmitting) return;
    setMatches(matches.filter(match => 
      !(match.leftIndex === matchToRemove.leftIndex && match.rightIndex === matchToRemove.rightIndex)
    ));
  };

  const shuffleUnmatched = () => {
    if (isAnswered || isSubmitting) return;
    // This could shuffle unmatched items for better UX
    setSelectedLeft(null);
    setSelectedRight(null);
  };

  const handleSubmit = () => {
    if (matches.length === question.pairs.length && !isSubmitting && !isAnswered) {
      const answer = matches.map(match => `${match.leftIndex}-${match.rightIndex}`);
      onAnswer(answer);
    }
  };

  const isLeftMatched = (index: number) => matches.some(match => match.leftIndex === index);
  const isRightMatched = (index: number) => matches.some(match => match.rightIndex === index);
  const getMatchForLeft = (index: number) => matches.find(match => match.leftIndex === index);
  const getMatchForRight = (index: number) => matches.find(match => match.rightIndex === index);

  return (
    <div className="space-y-6">
      {/* Question Title */}
      <div className="text-center">
        <h2 className="text-2xl font-bold text-gray-900 dark:text-gray-100 mb-4">
          {question.question}
        </h2>
        <p className="text-gray-600 dark:text-gray-400 mb-4">
          Click items to match them together
        </p>
      </div>

      {/* Pairs Interface */}
      <div className="grid grid-cols-1 md:grid-cols-2 gap-8">
        {/* Left Column */}
        <div className="space-y-3">
          <h3 className="text-lg font-semibold text-gray-900 dark:text-gray-100 text-center">
            Match these
          </h3>
          {question.pairs.map((pair, index) => {
            const isMatched = isLeftMatched(index);
            const isSelected = selectedLeft === index;
            const match = getMatchForLeft(index);
            
            return (
              <button
                key={index}
                onClick={() => handleLeftClick(index)}
                disabled={isSubmitting || isAnswered}
                className={cn(
                  "w-full p-4 text-left rounded-xl border-2 transition-all duration-200",
                  isMatched
                    ? "border-green-500 bg-green-50 dark:bg-green-900/20"
                    : isSelected
                    ? "border-primary-500 bg-primary-50 dark:bg-primary-900/20"
                    : "border-gray-200 dark:border-gray-700 hover:border-primary-300",
                  (isSubmitting || isAnswered) && "cursor-not-allowed"
                )}
              >
                <div className="flex items-center justify-between">
                  <span className="font-medium text-gray-900 dark:text-gray-100">
                    {pair.left}
                  </span>
                  {isMatched && match && (
                    <div className="flex items-center space-x-2">
                      <span className="text-sm text-green-600 dark:text-green-400">
                        → {question.pairs[match.rightIndex].right}
                      </span>
                      {!isAnswered && (
                        <button
                          onClick={(e) => {
                            e.stopPropagation();
                            removeMatch(match);
                          }}
                          className="p-1 hover:bg-red-100 dark:hover:bg-red-900/20 rounded"
                        >
                          <X className="w-4 h-4 text-red-500" />
                        </button>
                      )}
                    </div>
                  )}
                </div>
              </button>
            );
          })}
        </div>

        {/* Right Column */}
        <div className="space-y-3">
          <h3 className="text-lg font-semibold text-gray-900 dark:text-gray-100 text-center">
            With these
          </h3>
          {question.pairs.map((pair, index) => {
            const isMatched = isRightMatched(index);
            const isSelected = selectedRight === index;
            
            return (
              <button
                key={index}
                onClick={() => handleRightClick(index)}
                disabled={isSubmitting || isAnswered}
                className={cn(
                  "w-full p-4 text-left rounded-xl border-2 transition-all duration-200",
                  isMatched
                    ? "border-green-500 bg-green-50 dark:bg-green-900/20"
                    : isSelected
                    ? "border-primary-500 bg-primary-50 dark:bg-primary-900/20"
                    : "border-gray-200 dark:border-gray-700 hover:border-primary-300",
                  (isSubmitting || isAnswered) && "cursor-not-allowed"
                )}
              >
                <span className="font-medium text-gray-900 dark:text-gray-100">
                  {pair.right}
                </span>
              </button>
            );
          })}
        </div>
      </div>

      {/* Progress and Controls */}
      <div className="text-center space-y-4">
        <div className="flex items-center justify-center space-x-4">
          <Badge variant="primary" size="lg">
            {matches.length} / {question.pairs.length} matched
          </Badge>
          
          {!isAnswered && matches.length < question.pairs.length && (
            <button
              onClick={shuffleUnmatched}
              className="p-2 hover:bg-gray-100 dark:hover:bg-gray-700 rounded-lg transition-colors"
              title="Clear selections"
            >
              <Shuffle className="w-5 h-5 text-gray-500 dark:text-gray-400" />
            </button>
          )}
        </div>

        {/* Answer status */}
        {isAnswered && answeredQuestion && (
          <div className="mt-3">
            {answeredQuestion.isCorrect ? (
              <Badge variant="success" size="lg">
                <CheckCircle className="w-4 h-4 mr-2" />
                All Pairs Correct!
              </Badge>
            ) : (
              <Badge variant="error" size="lg">
                <X className="w-4 h-4 mr-2" />
                Some Pairs Incorrect
              </Badge>
            )}
          </div>
        )}

        {/* Submit Button */}
        {!isAnswered && !questionResult && (
          <button
            onClick={handleSubmit}
            disabled={matches.length !== question.pairs.length || isSubmitting}
            className={cn(
              "px-8 py-3 rounded-xl font-semibold transition-all duration-200",
              matches.length === question.pairs.length && !isSubmitting
                ? "bg-primary-600 hover:bg-primary-700 text-white shadow-lg"
                : "bg-gray-300 dark:bg-gray-600 text-gray-500 dark:text-gray-400 cursor-not-allowed"
            )}
          >
            {isSubmitting ? "Submitting..." : "Submit Matches"}
          </button>
        )}
      </div>
    </div>
  );
}