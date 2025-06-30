import React, { useState, useMemo } from "react";
import { motion, AnimatePresence } from "framer-motion";
import {
  Play,
  Lock,
  CheckCircle,
  Star,
  Trophy,
  Target,
  Eye,
  UserPlus,
} from "lucide-react";

import { LevelWithChapter } from "@/hooks/use-course-path";
import { useResponsive } from "@/hooks/use-responsive";
import { cn } from "@/lib/utils/class.utils";
import { Chapter } from "@/services/chapter-service";

interface GamePathProps {
  levelPath: LevelWithChapter[];
  onLevelClick?: (level: LevelWithChapter) => void;
  previewMode?: boolean;
}

interface ChapterGroup {
  chapter: Chapter;
  levels: LevelWithChapter[];
  chapterNumber: number;
  isCompleted: boolean;
}

const LevelNode: React.FC<{
  level: LevelWithChapter;
  chapterNumber: number;
  levelNumber: number;
  size: number;
  onClick?: () => void;
  previewMode?: boolean;
}> = ({
  level,
  chapterNumber,
  levelNumber,
  size,
  onClick,
  previewMode = false,
}) => {
  const [isHovered, setIsHovered] = useState(false);

  const getNodeIcon = () => {
    if (previewMode) return Eye;
    if (level.isCompleted) return CheckCircle;
    if (level.isUnlocked) return Play;
    return Lock;
  };

  const getNodeStyles = () => {
    if (previewMode) {
      return {
        bg: "bg-gradient-to-br from-orange-400 via-orange-500 to-amber-600",
        shadow: "shadow-xl shadow-orange-500/50",
        ring: "ring-orange-400/40",
        glow: "drop-shadow-[0_0_16px_rgba(251,146,60,0.7)]",
      };
    }

    if (level.isCompleted) {
      return {
        bg: "bg-gradient-to-br from-emerald-400 via-emerald-500 to-green-600",
        shadow: "shadow-xl shadow-emerald-500/50",
        ring: "ring-emerald-400/40",
        glow: "drop-shadow-[0_0_16px_rgba(16,185,129,0.7)]",
      };
    }
    if (level.isUnlocked) {
      return {
        bg: "bg-gradient-to-br from-blue-400 via-blue-500 to-purple-600",
        shadow: "shadow-xl shadow-blue-500/50",
        ring: "ring-blue-400/40",
        glow: "drop-shadow-[0_0_16px_rgba(59,130,246,0.7)]",
      };
    }
    return {
      bg: "bg-gradient-to-br from-gray-400 via-gray-500 to-gray-600",
      shadow: "shadow-lg shadow-gray-500/30",
      ring: "ring-gray-400/20",
      glow: "",
    };
  };

  const Icon = getNodeIcon();
  const styles = getNodeStyles();
  const isClickable = previewMode || level.isUnlocked;

  return (
    <motion.div
      className="relative cursor-pointer z-50 flex flex-col items-center"
      initial={{ scale: 0, opacity: 0 }}
      animate={{ scale: 1, opacity: 1 }}
      transition={{ delay: levelNumber * 0.03, duration: 0.5, type: "spring" }}
      whileHover={{ scale: isClickable ? 1.15 : 1.05 }}
      whileTap={{ scale: isClickable ? 0.9 : 1 }}
      onHoverStart={() => setIsHovered(true)}
      onHoverEnd={() => setIsHovered(false)}
      onClick={onClick}
    >
      {/* Main node */}
      <div
        className={cn(
          "relative rounded-full flex items-center justify-center transition-all duration-300 border-4 border-white/30",
          styles.bg,
          styles.shadow,
          styles.glow,
          isClickable && "hover:border-white/50"
        )}
        style={{ width: size, height: size }}
      >
        <Icon
          className="text-white drop-shadow-lg"
          style={{ width: size * 0.4, height: size * 0.4 }}
        />

        {/* Level number badge - Made larger and more prominent */}
        <div
          className="absolute -top-4 -right-4 bg-white rounded-full flex items-center justify-center font-bold text-gray-800 border-3 border-gray-100 shadow-xl"
          style={{
            width: size * 0.5,
            height: size * 0.5,
            fontSize: size * 0.16,
            minWidth: "32px",
            minHeight: "32px",
          }}
        >
          {chapterNumber}-{levelNumber}
        </div>
      </div>

      {/* Stars for completed levels (only in non-preview mode) */}
      {!previewMode && level.isCompleted && level.stars > 0 && (
        <div className="flex space-x-1 mt-4">
          {[1, 2, 3].map((star) => (
            <motion.div
              key={star}
              initial={{ scale: 0, rotate: 0 }}
              animate={{ scale: 1, rotate: 360 }}
              transition={{
                delay: levelNumber * 0.03 + star * 0.1,
                duration: 0.5,
              }}
            >
              <Star
                className={cn(
                  "drop-shadow-lg",
                  star <= level.stars
                    ? "text-yellow-400 fill-current"
                    : "text-gray-300"
                )}
                style={{ width: size * 0.2, height: size * 0.2 }}
              />
            </motion.div>
          ))}
        </div>
      )}

      {/* Preview mode indicator */}
      {previewMode && (
        <div className="mt-4 bg-orange-500/90 backdrop-blur-sm rounded-lg px-2 py-1 border border-orange-400/50">
          <span className="text-xs font-bold text-white">Preview</span>
        </div>
      )}

      {/* Hover tooltip */}
      <AnimatePresence>
        {isHovered && (
          <motion.div
            className="absolute bottom-full mb-4 left-1/2 transform -translate-x-1/2 bg-gray-900/95 text-white px-4 py-3 rounded-xl text-sm whitespace-nowrap z-50 backdrop-blur-sm border border-white/10 shadow-2xl"
            initial={{ opacity: 0, y: 10, scale: 0.9 }}
            animate={{ opacity: 1, y: 0, scale: 1 }}
            exit={{ opacity: 0, y: 10, scale: 0.9 }}
            transition={{ duration: 0.2 }}
          >
            <div className="font-semibold text-white">{level.title}</div>
            <div className="text-xs text-gray-300 mt-1">
              {level.chapter.title}
            </div>

            {previewMode ? (
              <div className="text-xs text-orange-400 flex items-center mt-2">
                <Eye className="w-3 h-3 mr-1" />
                Preview Mode - Click to view details
              </div>
            ) : (
              <>
                {level.isCompleted && (
                  <div className="text-xs text-emerald-400 flex items-center mt-2">
                    <CheckCircle className="w-3 h-3 mr-1" />
                    Completed
                  </div>
                )}
                {!level.isUnlocked && (
                  <div className="text-xs text-red-400 flex items-center mt-2">
                    <Lock className="w-3 h-3 mr-1" />
                    Locked
                  </div>
                )}
              </>
            )}

            {/* Tooltip arrow */}
            <div className="absolute top-full left-1/2 transform -translate-x-1/2 border-4 border-transparent border-t-gray-900/95"></div>
          </motion.div>
        )}
      </AnimatePresence>
    </motion.div>
  );
};

const ChapterHeader: React.FC<{
  chapter: Chapter;
  chapterNumber: number;
  isCompleted: boolean;
  previewMode?: boolean;
}> = ({ chapter, chapterNumber, isCompleted, previewMode = false }) => {
  return (
    <motion.div
      className="relative z-30 flex justify-center mb-8"
      initial={{ opacity: 0, y: -20 }}
      animate={{ opacity: 1, y: 0 }}
      transition={{ delay: chapterNumber * 0.1, duration: 0.6 }}
    >
      {/* Chapter divider line - ✅ Absolute positioned for background effect */}
      <div className="absolute top-8 left-0 right-0 h-px bg-gradient-to-r from-transparent via-white/30 to-transparent" />

      {/* Chapter badge */}
      <motion.div
        className={cn(
          "relative px-6 py-4 rounded-2xl shadow-xl border-2 backdrop-blur-sm",
          previewMode
            ? "bg-orange-500/90 border-orange-400/50 shadow-orange-500/40"
            : isCompleted
            ? "bg-emerald-500/90 border-emerald-400/50 shadow-emerald-500/40"
            : "bg-blue-500/90 border-blue-400/50 shadow-blue-500/40"
        )}
        whileHover={{ scale: 1.02 }}
      >
        {/* Chapter content */}
        <div className="flex items-center space-x-4">
          <div className="w-12 h-12 bg-white/20 rounded-full flex items-center justify-center border-2 border-white/30">
            <span className="text-xl font-bold text-white">
              {chapterNumber}
            </span>
          </div>
          <div className="text-left">
            <div className="text-white font-bold text-lg leading-tight">
              {chapter.title}
            </div>
            <div className="text-white/90 text-sm mt-1">
              {chapter.description}
            </div>
          </div>
          {previewMode ? (
            <div className="w-10 h-10 bg-orange-400/90 rounded-full flex items-center justify-center border-2 border-orange-300">
              <Eye className="w-6 h-6 text-orange-800" />
            </div>
          ) : isCompleted ? (
            <div className="w-10 h-10 bg-yellow-400/90 rounded-full flex items-center justify-center border-2 border-yellow-300">
              <Trophy className="w-6 h-6 text-yellow-800" />
            </div>
          ) : null}
        </div>
      </motion.div>
    </motion.div>
  );
};

export const GamePath: React.FC<GamePathProps> = ({
  levelPath,
  onLevelClick,
  previewMode = false,
}) => {
  const { isMobile, isTablet } = useResponsive();

  // Calculate responsive sizes
  const nodeSize = isMobile ? 80 : isTablet ? 96 : 112;
  const containerPadding = isMobile ? 32 : isTablet ? 48 : 64;

  // Group levels by chapter
  const chapterGroups = useMemo((): ChapterGroup[] => {
    const groups: { [key: string]: LevelWithChapter[] } = {};

    levelPath.forEach((level) => {
      const chapterId = level.chapter._id;
      if (!groups[chapterId]) {
        groups[chapterId] = [];
      }
      groups[chapterId].push(level);
    });

    // eslint-disable-next-line @typescript-eslint/no-unused-vars
    return Object.entries(groups).map(([_, levels], index) => ({
      chapter: levels[0].chapter,
      levels: levels.sort((a, b) => a.order - b.order),
      chapterNumber: index + 1,
      isCompleted: !previewMode && levels.every((l) => l.isCompleted),
    }));
  }, [levelPath, previewMode]);

  return (
    <div
      className="relative w-full overflow-hidden min-h-screen"
      style={{ paddingLeft: containerPadding, paddingRight: containerPadding }}
    >
      {/* Simplified animated background */}
      <div className="absolute inset-0 overflow-hidden">
        {/* Fewer, more subtle stars */}
        {[...Array(isMobile ? 30 : 50)].map((_, i) => (
          <motion.div
            key={i}
            className="absolute w-1 h-1 bg-white rounded-full"
            style={{
              left: `${Math.random() * 100}%`,
              top: `${Math.random() * 100}%`,
            }}
            animate={{
              opacity: [0.2, 0.6, 0.2],
              scale: [1, 1.2, 1],
            }}
            transition={{
              duration: 4 + Math.random() * 2,
              repeat: Infinity,
              delay: Math.random() * 3,
            }}
          />
        ))}
      </div>

      {/* Content Container - ✅ Using normal flow */}
      <div className="relative z-10 py-20 space-y-16">
        {chapterGroups.map((group) => (
          <div key={group.chapter._id} className="space-y-12">
            {/* Chapter Header */}
            <ChapterHeader
              chapter={group.chapter}
              chapterNumber={group.chapterNumber}
              isCompleted={group.isCompleted}
              previewMode={previewMode}
            />

            {/* Levels Grid - ✅ Using CSS Grid with normal flow */}
            <div
              className="grid gap-8 justify-items-center"
              style={{
                gridTemplateColumns: `repeat(auto-fit, minmax(${
                  nodeSize + 40
                }px, 1fr))`,
                maxWidth: isMobile ? "100%" : isTablet ? "600px" : "800px",
                margin: "0 auto",
              }}
            >
              {group.levels.map((level, levelIndex) => (
                <LevelNode
                  key={level._id}
                  level={level}
                  chapterNumber={group.chapterNumber}
                  levelNumber={levelIndex + 1}
                  size={nodeSize}
                  onClick={() => onLevelClick?.(level)}
                  previewMode={previewMode}
                />
              ))}
            </div>
          </div>
        ))}
      </div>

      {/* Floating action button */}
      <motion.button
        className={cn(
          "fixed bottom-8 right-8 rounded-full flex items-center justify-center shadow-2xl z-50 border-4 border-white/20",
          isMobile ? "w-16 h-16" : "w-18 h-18",
          previewMode
            ? "bg-gradient-to-r from-orange-500 to-amber-600 shadow-orange-500/50"
            : "bg-gradient-to-r from-blue-500 to-purple-600 shadow-blue-500/50"
        )}
        whileHover={{ scale: 1.05 }}
        whileTap={{ scale: 0.95 }}
        onClick={() => {
          if (previewMode) {
            // Scroll to top to show join button
            window.scrollTo({ top: 0, behavior: "smooth" });
          } else {
            const nextLevel = levelPath.find(
              (l) => l.isUnlocked && !l.isCompleted
            );
            if (nextLevel) {
              // Scroll to the next level (approximate)
              const element = document.querySelector(
                `[data-level-id="${nextLevel._id}"]`
              );
              if (element) {
                element.scrollIntoView({ behavior: "smooth", block: "center" });
              }
            }
          }
        }}
      >
        {previewMode ? (
          <UserPlus
            className={cn("text-white", isMobile ? "w-7 h-7" : "w-8 h-8")}
          />
        ) : (
          <Target
            className={cn("text-white", isMobile ? "w-7 h-7" : "w-8 h-8")}
          />
        )}
      </motion.button>
    </div>
  );
};
