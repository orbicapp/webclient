import { motion } from "framer-motion";
import { Skull, RefreshCw, Home } from "lucide-react";

import { Card, CardContent } from "@/components/ui/Card";
import Button from "@/components/ui/Button";

interface GameOverScreenProps {
  course: {
    title: string;
  };
  level: {
    title: string;
  };
  onRetryLevel: () => void;
  onReturnToCourse: () => void;
}

export function GameOverScreen({
  course,
  level,
  onRetryLevel,
  onReturnToCourse,
}: GameOverScreenProps) {
  return (
    <motion.div
      className="fixed inset-0 z-50 flex items-center justify-center bg-black/80 backdrop-blur-sm p-4"
      initial={{ opacity: 0 }}
      animate={{ opacity: 1 }}
      transition={{ duration: 0.5 }}
    >
      <motion.div
        className="max-w-md w-full text-center"
        initial={{ scale: 0.8, y: 50 }}
        animate={{ scale: 1, y: 0 }}
        transition={{ type: "spring", duration: 0.8 }}
      >
        <Card className="bg-gradient-to-br from-red-900/90 via-red-800/90 to-orange-900/90 backdrop-blur-xl border-2 border-red-500/30 text-white">
          <CardContent>
            {/* Skull Icon with Animation */}
            <motion.div
              className="w-24 h-24 mx-auto mb-6 relative"
              animate={{
                scale: [1, 1.1, 1],
                rotate: [0, -5, 5, 0],
              }}
              transition={{
                duration: 2,
                repeat: Infinity,
                ease: "easeInOut",
              }}
            >
              <div className="w-24 h-24 bg-gradient-to-br from-red-500 to-red-700 rounded-full flex items-center justify-center shadow-2xl shadow-red-500/50">
                <Skull className="w-12 h-12 text-white" />
              </div>

              {/* Floating particles */}
              {[...Array(6)].map((_, i) => (
                <motion.div
                  key={i}
                  className="absolute w-2 h-2 bg-red-400 rounded-full"
                  style={{
                    left: `${20 + Math.cos((i * 60 * Math.PI) / 180) * 40}px`,
                    top: `${20 + Math.sin((i * 60 * Math.PI) / 180) * 40}px`,
                  }}
                  animate={{
                    scale: [0, 1, 0],
                    opacity: [0, 1, 0],
                  }}
                  transition={{
                    duration: 2,
                    repeat: Infinity,
                    delay: i * 0.3,
                  }}
                />
              ))}
            </motion.div>

            {/* Game Over Title */}
            <motion.h1
              className="text-4xl font-bold text-white mb-4"
              initial={{ opacity: 0, y: 20 }}
              animate={{ opacity: 1, y: 0 }}
              transition={{ delay: 0.3 }}
            >
              GAME OVER
            </motion.h1>

            {/* Subtitle */}
            <motion.p
              className="text-xl text-red-200 mb-2"
              initial={{ opacity: 0, y: 20 }}
              animate={{ opacity: 1, y: 0 }}
              transition={{ delay: 0.4 }}
            >
              You ran out of lives!
            </motion.p>

            {/* Level Info */}
            <motion.div
              className="mb-8 p-4 bg-black/30 rounded-xl border border-red-500/30"
              initial={{ opacity: 0, y: 20 }}
              animate={{ opacity: 1, y: 0 }}
              transition={{ delay: 0.5 }}
            >
              <h3 className="font-bold text-white mb-1">{level.title}</h3>
              <p className="text-sm text-red-200">{course.title}</p>
            </motion.div>

            {/* Motivational Message */}
            <motion.p
              className="text-red-100 mb-8 leading-relaxed"
              initial={{ opacity: 0, y: 20 }}
              animate={{ opacity: 1, y: 0 }}
              transition={{ delay: 0.6 }}
            >
              Don't give up! Every mistake is a step closer to mastery. Try
              again and show this level who's boss! 💪
            </motion.p>

            {/* Action Buttons */}
            <motion.div
              className="flex flex-col sm:flex-row gap-3"
              initial={{ opacity: 0, y: 20 }}
              animate={{ opacity: 1, y: 0 }}
              transition={{ delay: 0.7 }}
            >
              <Button
                onClick={onRetryLevel}
                variant="primary"
                size="lg"
                fullWidth
                leftIcon={<RefreshCw className="w-5 h-5" />}
                className="bg-gradient-to-r from-emerald-500 to-green-600 hover:from-emerald-600 hover:to-green-700 shadow-lg shadow-emerald-500/25"
              >
                Try Again
              </Button>

              <Button
                onClick={onReturnToCourse}
                variant="outline"
                size="lg"
                fullWidth
                leftIcon={<Home className="w-5 h-5" />}
                className="border-red-400 text-red-200 hover:bg-red-500/20 hover:border-red-300"
              >
                Return to Course
              </Button>
            </motion.div>

            {/* Encouragement Quote */}
            <motion.div
              className="mt-6 p-3 bg-gradient-to-r from-orange-500/20 to-red-500/20 rounded-lg border border-orange-400/30"
              initial={{ opacity: 0 }}
              animate={{ opacity: 1 }}
              transition={{ delay: 1 }}
            >
              <p className="text-sm text-orange-200 italic">
                "Success is not final, failure is not fatal: it is the courage
                to continue that counts."
              </p>
            </motion.div>
          </CardContent>
        </Card>
      </motion.div>
    </motion.div>
  );
}
