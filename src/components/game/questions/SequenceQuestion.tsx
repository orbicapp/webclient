import { useState, useEffect } from "react";
import { CheckCircle, X, GripVertical, RotateCcw } from "lucide-react";
import { DndContext, closestCenter, KeyboardSensor, PointerSensor, useSensor, useSensors } from "@dnd-kit/core";
import { arrayMove, SortableContext, sortableKeyboardCoordinates, verticalListSortingStrategy } from "@dnd-kit/sortable";
import { useSortable } from "@dnd-kit/sortable";
import { CSS } from "@dnd-kit/utilities";

import { SequenceQuestion as SequenceQuestionType } from "@/services/level-service";
import { AnsweredQuestion, QuestionResult } from "@/services/game-service";
import Badge from "@/components/ui/Badge";
import { cn } from "@/lib/utils/class.utils";

interface SequenceQuestionProps {
  question: SequenceQuestionType;
  questionIndex: number;
  onAnswer: (answer: string[]) => void;
  isSubmitting: boolean;
  isAnswered: boolean;
  answeredQuestion?: AnsweredQuestion;
  questionResult?: QuestionResult | null;
}

interface SortableItemProps {
  id: string;
  children: React.ReactNode;
  disabled?: boolean;
}

function SortableItem({ id, children, disabled = false }: SortableItemProps) {
  const {
    attributes,
    listeners,
    setNodeRef,
    transform,
    transition,
    isDragging,
  } = useSortable({ id, disabled });

  const style = {
    transform: CSS.Transform.toString(transform),
    transition,
  };

  return (
    <div
      ref={setNodeRef}
      style={style}
      className={cn(
        "flex items-center space-x-3 p-4 bg-white dark:bg-gray-800 border-2 border-gray-200 dark:border-gray-700 rounded-xl transition-all duration-200",
        isDragging && "shadow-lg scale-105 z-50",
        !disabled && "hover:border-primary-300 dark:hover:border-primary-600 cursor-move",
        disabled && "opacity-75 cursor-not-allowed"
      )}
      {...attributes}
      {...listeners}
    >
      {!disabled && (
        <GripVertical className="w-5 h-5 text-gray-400 dark:text-gray-500 flex-shrink-0" />
      )}
      {children}
    </div>
  );
}

export function SequenceQuestion({
  question,
  onAnswer,
  isSubmitting,
  isAnswered,
  answeredQuestion,
  questionResult,
}: SequenceQuestionProps) {
  const [items, setItems] = useState<string[]>([]);

  const sensors = useSensors(
    useSensor(PointerSensor),
    useSensor(KeyboardSensor, {
      coordinateGetter: sortableKeyboardCoordinates,
    })
  );

  // Initialize items (shuffled for the game)
  useEffect(() => {
    if (isAnswered && answeredQuestion) {
      setItems(answeredQuestion.userAnswer as string[]);
    } else {
      // Shuffle the correct sequence for the game
      const shuffled = [...question.correctSequence].sort(() => Math.random() - 0.5);
      setItems(shuffled);
    }
  }, [isAnswered, answeredQuestion, question.correctSequence]);

  const handleDragEnd = (event: any) => {
    const { active, over } = event;

    if (active.id !== over.id) {
      setItems((items) => {
        const oldIndex = items.indexOf(active.id);
        const newIndex = items.indexOf(over.id);

        return arrayMove(items, oldIndex, newIndex);
      });
    }
  };

  const resetOrder = () => {
    if (isAnswered || isSubmitting) return;
    const shuffled = [...question.correctSequence].sort(() => Math.random() - 0.5);
    setItems(shuffled);
  };

  const handleSubmit = () => {
    if (items.length > 0 && !isSubmitting && !isAnswered) {
      onAnswer(items);
    }
  };

  const isCorrectOrder = () => {
    return JSON.stringify(items) === JSON.stringify(question.correctSequence);
  };

  return (
    <div className="space-y-6">
      {/* Question Title */}
      <div className="text-center">
        <h2 className="text-2xl font-bold text-gray-900 dark:text-gray-100 mb-4">
          {question.question}
        </h2>
        <p className="text-gray-600 dark:text-gray-400 mb-4">
          Drag and drop to arrange in the correct order
        </p>
      </div>

      {/* Sequence Items */}
      <div className="max-w-2xl mx-auto">
        <DndContext
          sensors={sensors}
          collisionDetection={closestCenter}
          onDragEnd={handleDragEnd}
        >
          <SortableContext items={items} strategy={verticalListSortingStrategy}>
            <div className="space-y-3">
              {items.map((item, index) => {
                const isCorrectPosition = isAnswered && 
                  answeredQuestion && 
                  question.correctSequence[index] === item;
                
                return (
                  <SortableItem 
                    key={item} 
                    id={item} 
                    disabled={isAnswered || isSubmitting}
                  >
                    <div className="flex items-center justify-between w-full">
                      <div className="flex items-center space-x-3">
                        <div className={cn(
                          "w-8 h-8 rounded-full flex items-center justify-center text-sm font-bold",
                          isAnswered
                            ? isCorrectPosition
                              ? "bg-green-500 text-white"
                              : "bg-red-500 text-white"
                            : "bg-primary-500 text-white"
                        )}>
                          {index + 1}
                        </div>
                        <span className="font-medium text-gray-900 dark:text-gray-100">
                          {item}
                        </span>
                      </div>
                      
                      {isAnswered && (
                        <div>
                          {isCorrectPosition ? (
                            <CheckCircle className="w-5 h-5 text-green-600" />
                          ) : (
                            <X className="w-5 h-5 text-red-600" />
                          )}
                        </div>
                      )}
                    </div>
                  </SortableItem>
                );
              })}
            </div>
          </SortableContext>
        </DndContext>
      </div>

      {/* Controls */}
      <div className="text-center space-y-4">
        <div className="flex items-center justify-center space-x-4">
          <Badge variant="primary" size="lg">
            {items.length} items to arrange
          </Badge>
          
          {!isAnswered && (
            <button
              onClick={resetOrder}
              disabled={isSubmitting}
              className="p-2 hover:bg-gray-100 dark:hover:bg-gray-700 rounded-lg transition-colors"
              title="Shuffle order"
            >
              <RotateCcw className="w-5 h-5 text-gray-500 dark:text-gray-400" />
            </button>
          )}
        </div>

        {/* Show correct sequence when answered incorrectly */}
        {questionResult && !questionResult.isCorrect && (
          <div className="mt-4 p-4 bg-green-50 dark:bg-green-900/20 rounded-xl border border-green-200 dark:border-green-800">
            <p className="text-sm font-medium text-green-800 dark:text-green-200 mb-2">
              Correct sequence:
            </p>
            <div className="flex flex-wrap gap-2 justify-center">
              {question.correctSequence.map((item, index) => (
                <Badge key={index} variant="success" size="sm">
                  {index + 1}. {item}
                </Badge>
              ))}
            </div>
          </div>
        )}

        {/* Answer status */}
        {isAnswered && answeredQuestion && (
          <div className="mt-3">
            {answeredQuestion.isCorrect ? (
              <Badge variant="success" size="lg">
                <CheckCircle className="w-4 h-4 mr-2" />
                Perfect Sequence!
              </Badge>
            ) : (
              <Badge variant="error" size="lg">
                <X className="w-4 h-4 mr-2" />
                Incorrect Order
              </Badge>
            )}
          </div>
        )}

        {/* Submit Button */}
        {!isAnswered && !questionResult && (
          <button
            onClick={handleSubmit}
            disabled={items.length === 0 || isSubmitting}
            className={cn(
              "px-8 py-3 rounded-xl font-semibold transition-all duration-200",
              items.length > 0 && !isSubmitting
                ? "bg-primary-600 hover:bg-primary-700 text-white shadow-lg"
                : "bg-gray-300 dark:bg-gray-600 text-gray-500 dark:text-gray-400 cursor-not-allowed"
            )}
          >
            {isSubmitting ? "Submitting..." : "Submit Sequence"}
          </button>
        )}
      </div>
    </div>
  );
}