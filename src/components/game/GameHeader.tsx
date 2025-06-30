import { ArrowLeft, Heart, Target, Star } from "lucide-react";
import { motion } from "framer-motion";

import { QuestionUnion } from "@/services/level-service";
import { AnsweredQuestion } from "@/services/game-service";

interface GameHeaderProps {
  course: {
    title: string;
  };
  level: {
    title: string;
    questions: QuestionUnion[];
  };
  currentSession: {
    lives: number;
    stars: number;
    answeredQuestions?: AnsweredQuestion[];
  };
  onAbandonSession: () => void;
}

export function GameHeader({
  course,
  level,
  currentSession,
  onAbandonSession,
}: GameHeaderProps) {
  const answeredCount = currentSession.answeredQuestions?.length || 0;
  const progressTotal = (answeredCount / level.questions.length) * 100;

  return (
    <div className="sticky top-0 z-40 bg-black/20 backdrop-blur-xl border-b border-white/10">
      <div className="max-w-4xl mx-auto px-4 py-4">
        <div className="flex items-center justify-between">
          {/* Course Info */}
          <div className="flex items-center space-x-4">
            <button
              onClick={onAbandonSession}
              className="p-2 hover:bg-white/10 rounded-lg transition-colors"
            >
              <ArrowLeft className="w-5 h-5 text-white" />
            </button>
            <div>
              <h1 className="text-lg font-bold text-white">{level.title}</h1>
              <p className="text-sm text-gray-300">{course.title}</p>
            </div>
          </div>

          {/* Game Stats */}
          <div className="flex items-center space-x-6">
            <div className="flex items-center space-x-2">
              <Heart className="w-5 h-5 text-red-400" />
              <span className="text-white font-bold">
                {currentSession.lives}
              </span>
            </div>
            <div className="flex items-center space-x-2">
              <Target className="w-5 h-5 text-blue-400" />
              <span className="text-white font-bold">
                {answeredCount}/{level.questions.length}
              </span>
            </div>
            <div className="flex items-center space-x-2">
              <Star className="w-5 h-5 text-yellow-400" />
              <span className="text-white font-bold">
                {currentSession.stars}
              </span>
            </div>
          </div>
        </div>

        {/* Progress Bar */}
        <div className="mt-4">
          <div className="w-full bg-white/20 rounded-full h-2">
            <motion.div
              className="bg-gradient-to-r from-blue-400 to-purple-500 h-2 rounded-full"
              initial={{ width: 0 }}
              animate={{ width: `${progressTotal}%` }}
              transition={{ duration: 0.5 }}
            />
          </div>
        </div>
      </div>
    </div>
  );
}
