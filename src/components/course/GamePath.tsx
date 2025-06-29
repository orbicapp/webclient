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

interface GamePathProps {
  levelPath: LevelWithChapter[];
  onLevelClick?: (level: LevelWithChapter) => void;
  previewMode?: boolean;
}

interface ChapterGroup {
  chapter: any;
  levels: LevelWithChapter[];
  chapterNumber: number;
  isCompleted: boolean;
}

interface LevelPosition {
  level: LevelWithChapter;
  x: number;
  y: number;
  row: number;
  col: number;
  chapterNumber: number;
  levelNumber: number;
}

const LevelNode: React.FC<{
  level: LevelWithChapter;
  x: number;
  y: number;
  chapterNumber: number;
  levelNumber: number;
  size: number;
  onClick?: () => void;
  previewMode?: boolean;
}> = ({ level, x, y, chapterNumber, levelNumber, size, onClick, previewMode = false }) => {
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
        glow: "drop-shadow-[0_0_16px_rgba(251,146,60,0.7)]"
      };
    }
    
    if (level.isCompleted) {
      return {
        bg: "bg-gradient-to-br from-emerald-400 via-emerald-500 to-green-600",
        shadow: "shadow-xl shadow-emerald-500/50",
        ring: "ring-emerald-400/40",
        glow: "drop-shadow-[0_0_16px_rgba(16,185,129,0.7)]"
      };
    }
    if (level.isUnlocked) {
      return {
        bg: "bg-gradient-to-br from-blue-400 via-blue-500 to-purple-600",
        shadow: "shadow-xl shadow-blue-500/50",
        ring: "ring-blue-400/40",
        glow: "drop-shadow-[0_0_16px_rgba(59,130,246,0.7)]"
      };
    }
    return {
      bg: "bg-gradient-to-br from-gray-400 via-gray-500 to-gray-600",
      shadow: "shadow-lg shadow-gray-500/30",
      ring: "ring-gray-400/20",
      glow: ""
    };
  };

  const Icon = getNodeIcon();
  const styles = getNodeStyles();
  const isClickable = previewMode || level.isUnlocked;

  return (
    <motion.div
      className="absolute transform -translate-x-1/2 -translate-y-1/2 cursor-pointer z-20"
      style={{ left: x, top: y }}
      initial={{ scale: 0, opacity: 0 }}
      animate={{ scale: 1, opacity: 1 }}
      transition={{ delay: levelNumber * 0.03, duration: 0.5, type: "spring" }}
      whileHover={{ scale: isClickable ? 1.15 : 1.05 }}
      whileTap={{ scale: isClickable ? 0.9 : 1 }}
      onHoverStart={() => setIsHovered(true)}
      onHoverEnd={() => setIsHovered(false)}
      onClick={onClick}
    >
      {/* Outer pulse ring for clickable levels */}
      {isClickable && (
        <motion.div
          className={cn(
            "absolute inset-0 rounded-full ring-4",
            styles.ring
          )}
          style={{ width: size + 24, height: size + 24, left: -12, top: -12 }}
          animate={{
            scale: [1, 1.2, 1],
            opacity: [0.3, 0.6, 0.3],
          }}
          transition={{ duration: 2.5, repeat: Infinity }}
        />
      )}
      
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
            minWidth: '32px',
            minHeight: '32px'
          }}
        >
          {chapterNumber}-{levelNumber}
        </div>
        
        {/* Stars for completed levels (only in non-preview mode) */}
        {!previewMode && level.isCompleted && level.stars > 0 && (
          <div 
            className="absolute left-1/2 transform -translate-x-1/2 flex space-x-1"
            style={{ bottom: -size * 0.3 }}
          >
            {[1, 2, 3].map((star) => (
              <motion.div
                key={star}
                initial={{ scale: 0, rotate: 0 }}
                animate={{ scale: 1, rotate: 360 }}
                transition={{ delay: levelNumber * 0.03 + star * 0.1, duration: 0.5 }}
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
          <div 
            className="absolute left-1/2 transform -translate-x-1/2 bg-orange-500/90 backdrop-blur-sm rounded-lg px-2 py-1 border border-orange-400/50"
            style={{ bottom: -size * 0.3 }}
          >
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
              <div className="text-xs text-gray-300 mt-1">{level.chapter.title}</div>
              
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
      </div>
    </motion.div>
  );
};

const ChapterHeader: React.FC<{
  chapter: any;
  chapterNumber: number;
  isCompleted: boolean;
  x: number;
  y: number;
  width: number;
  previewMode?: boolean;
}> = ({ chapter, chapterNumber, isCompleted, x, y, width, previewMode = false }) => {
  return (
    <motion.div
      className="absolute z-10"
      style={{ left: x, top: y, width }}
      initial={{ opacity: 0, y: -20 }}
      animate={{ opacity: 1, y: 0 }}
      transition={{ delay: chapterNumber * 0.1, duration: 0.6 }}
    >
      <div className="relative">
        {/* Chapter divider line */}
        <div className="absolute top-8 left-0 right-0 h-px bg-gradient-to-r from-transparent via-white/30 to-transparent" />
        
        {/* Chapter badge */}
        <div className="flex justify-center">
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
                <span className="text-xl font-bold text-white">{chapterNumber}</span>
              </div>
              <div className="text-left">
                <div className="text-white font-bold text-lg leading-tight">{chapter.title}</div>
                <div className="text-white/90 text-sm mt-1">{chapter.description}</div>
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
        </div>
      </div>
    </motion.div>
  );
};

export const GamePath: React.FC<GamePathProps> = ({ levelPath, onLevelClick, previewMode = false }) => {
  const { isMobile, isTablet, screenWidth } = useResponsive();
  
  // Calculate responsive sizes - Made even larger as requested
  const nodeSize = isMobile ? 80 : isTablet ? 96 : 112;
  const containerPadding = isMobile ? 32 : isTablet ? 48 : 64;
  const chapterSpacing = isMobile ? 160 : isTablet ? 180 : 200;
  const levelSpacing = isMobile ? 140 : isTablet ? 160 : 180;
  const rowSpacing = isMobile ? 120 : isTablet ? 140 : 160;
  
  // Group levels by chapter
  const chapterGroups = useMemo((): ChapterGroup[] => {
    const groups: { [key: string]: LevelWithChapter[] } = {};
    
    levelPath.forEach(level => {
      const chapterId = level.chapter._id;
      if (!groups[chapterId]) {
        groups[chapterId] = [];
      }
      groups[chapterId].push(level);
    });
    
    return Object.entries(groups).map(([chapterId, levels], index) => ({
      chapter: levels[0].chapter,
      levels: levels.sort((a, b) => a.order - b.order),
      chapterNumber: index + 1,
      isCompleted: !previewMode && levels.every(l => l.isCompleted)
    }));
  }, [levelPath, previewMode]);

  // Calculate positions with perfect centering
  const { levelPositions, totalHeight } = useMemo(() => {
    const positions: LevelPosition[] = [];
    
    const availableWidth = screenWidth - (containerPadding * 2);
    const maxLevelsPerRow = Math.max(1, Math.floor(availableWidth / levelSpacing));
    
    let currentY = 120;
    
    chapterGroups.forEach((group, chapterIndex) => {
      // Add chapter header space
      currentY += chapterSpacing;
      
      const levels = group.levels;
      const rows = Math.ceil(levels.length / maxLevelsPerRow);
      
      // Position levels in grid with perfect centering
      levels.forEach((level, levelIndex) => {
        const row = Math.floor(levelIndex / maxLevelsPerRow);
        const col = levelIndex % maxLevelsPerRow;
        const levelsInThisRow = Math.min(maxLevelsPerRow, levels.length - row * maxLevelsPerRow);
        
        // Center each row perfectly
        const rowWidth = (levelsInThisRow - 1) * levelSpacing;
        const startX = (screenWidth - rowWidth) / 2;
        
        const x = startX + col * levelSpacing;
        const y = currentY + row * rowSpacing;
        
        positions.push({
          level,
          x,
          y,
          row,
          col,
          chapterNumber: group.chapterNumber,
          levelNumber: levelIndex + 1
        });
      });
      
      currentY += rows * rowSpacing + chapterSpacing / 2;
    });
    
    return {
      levelPositions: positions,
      totalHeight: currentY + 120
    };
  }, [chapterGroups, screenWidth, containerPadding, levelSpacing, rowSpacing, chapterSpacing]);

  return (
    <div 
      className="relative w-full overflow-hidden bg-gradient-to-b from-indigo-900 via-purple-900 to-pink-900"
      style={{ height: `${totalHeight}px`, minHeight: '100vh' }}
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

      {/* Chapter headers */}
      {chapterGroups.map((group, index) => {
        const firstLevelOfChapter = levelPositions.find(
          pos => pos.level.chapter._id === group.chapter._id
        );
        
        if (!firstLevelOfChapter) return null;
        
        return (
          <ChapterHeader
            key={group.chapter._id}
            chapter={group.chapter}
            chapterNumber={group.chapterNumber}
            isCompleted={group.isCompleted}
            x={containerPadding}
            y={firstLevelOfChapter.y - chapterSpacing + 40}
            width={screenWidth - containerPadding * 2}
            previewMode={previewMode}
          />
        );
      })}

      {/* Level nodes - Perfectly centered */}
      {levelPositions.map((position, index) => (
        <LevelNode
          key={position.level._id}
          level={position.level}
          x={position.x}
          y={position.y}
          chapterNumber={position.chapterNumber}
          levelNumber={position.levelNumber}
          size={nodeSize}
          onClick={() => onLevelClick?.(position.level)}
          previewMode={previewMode}
        />
      ))}

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
            window.scrollTo({ top: 0, behavior: 'smooth' });
          } else {
            const nextLevel = levelPath.find(l => l.isUnlocked && !l.isCompleted);
            if (nextLevel) {
              const position = levelPositions.find(pos => pos.level._id === nextLevel._id);
              if (position) {
                window.scrollTo({
                  top: position.y - window.innerHeight / 2,
                  behavior: 'smooth'
                });
              }
            }
          }
        }}
      >
        {previewMode ? (
          <UserPlus className={cn("text-white", isMobile ? "w-7 h-7" : "w-8 h-8")} />
        ) : (
          <Target className={cn("text-white", isMobile ? "w-7 h-7" : "w-8 h-8")} />
        )}
      </motion.button>
    </div>
  );
};