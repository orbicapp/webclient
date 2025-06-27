import React, { useRef, useState, useMemo } from "react";
import { motion, AnimatePresence } from "framer-motion";
import { 
  Play, 
  Lock, 
  CheckCircle, 
  Star, 
  Trophy,
  Target,
  Crown,
} from "lucide-react";

import { LevelWithChapter } from "@/hooks/use-course-path";
import { useResponsive } from "@/hooks/use-responsive";
import { cn } from "@/lib/utils/class.utils";

interface GamePathProps {
  levelPath: LevelWithChapter[];
  onLevelClick?: (level: LevelWithChapter) => void;
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

interface ConnectionPath {
  startX: number;
  startY: number;
  endX: number;
  endY: number;
  type: 'horizontal' | 'vertical' | 'chapter-transition';
  isCompleted: boolean;
  isActive: boolean;
}

const LevelNode: React.FC<{
  level: LevelWithChapter;
  x: number;
  y: number;
  chapterNumber: number;
  levelNumber: number;
  size: number;
  onClick?: () => void;
}> = ({ level, x, y, chapterNumber, levelNumber, size, onClick }) => {
  const [isHovered, setIsHovered] = useState(false);
  
  const getNodeIcon = () => {
    if (level.isCompleted) return CheckCircle;
    if (level.isUnlocked) return Play;
    return Lock;
  };
  
  const getNodeStyles = () => {
    if (level.isCompleted) {
      return {
        bg: "bg-gradient-to-br from-emerald-400 via-emerald-500 to-green-600",
        shadow: "shadow-emerald-500/40",
        ring: "ring-emerald-400/30",
        glow: "drop-shadow-[0_0_12px_rgba(16,185,129,0.6)]"
      };
    }
    if (level.isUnlocked) {
      return {
        bg: "bg-gradient-to-br from-blue-400 via-blue-500 to-purple-600",
        shadow: "shadow-blue-500/40",
        ring: "ring-blue-400/30",
        glow: "drop-shadow-[0_0_12px_rgba(59,130,246,0.6)]"
      };
    }
    return {
      bg: "bg-gradient-to-br from-gray-400 via-gray-500 to-gray-600",
      shadow: "shadow-gray-500/30",
      ring: "ring-gray-400/20",
      glow: ""
    };
  };

  const Icon = getNodeIcon();
  const styles = getNodeStyles();

  return (
    <motion.div
      className="absolute transform -translate-x-1/2 -translate-y-1/2 cursor-pointer z-20"
      style={{ left: x, top: y }}
      initial={{ scale: 0, opacity: 0 }}
      animate={{ scale: 1, opacity: 1 }}
      transition={{ delay: levelNumber * 0.05, duration: 0.4, type: "spring" }}
      whileHover={{ scale: level.isUnlocked ? 1.1 : 1 }}
      whileTap={{ scale: level.isUnlocked ? 0.95 : 1 }}
      onHoverStart={() => setIsHovered(true)}
      onHoverEnd={() => setIsHovered(false)}
      onClick={level.isUnlocked ? onClick : undefined}
    >
      {/* Outer pulse ring for unlocked levels */}
      {level.isUnlocked && (
        <motion.div
          className={cn(
            "absolute inset-0 rounded-full ring-4",
            styles.ring
          )}
          style={{ width: size + 20, height: size + 20, left: -10, top: -10 }}
          animate={{
            scale: [1, 1.15, 1],
            opacity: [0.4, 0.7, 0.4],
          }}
          transition={{ duration: 2.5, repeat: Infinity }}
        />
      )}
      
      {/* Main node */}
      <div
        className={cn(
          "relative rounded-full flex items-center justify-center transition-all duration-300 border-4 border-white/20",
          styles.bg,
          styles.shadow,
          styles.glow,
          level.isUnlocked && "hover:border-white/40"
        )}
        style={{ width: size, height: size }}
      >
        <Icon 
          className="text-white drop-shadow-lg" 
          style={{ width: size * 0.35, height: size * 0.35 }} 
        />
        
        {/* Level number badge */}
        <div 
          className="absolute -top-3 -right-3 bg-white rounded-full flex items-center justify-center font-bold text-gray-800 border-3 border-gray-100 shadow-lg"
          style={{ 
            width: size * 0.4, 
            height: size * 0.4, 
            fontSize: size * 0.14,
            minWidth: '24px',
            minHeight: '24px'
          }}
        >
          {chapterNumber}-{levelNumber}
        </div>
        
        {/* Stars for completed levels */}
        {level.isCompleted && level.stars > 0 && (
          <div 
            className="absolute left-1/2 transform -translate-x-1/2 flex space-x-1"
            style={{ bottom: -size * 0.25 }}
          >
            {[1, 2, 3].map((star) => (
              <motion.div
                key={star}
                initial={{ scale: 0, rotate: 0 }}
                animate={{ scale: 1, rotate: 360 }}
                transition={{ delay: levelNumber * 0.05 + star * 0.1, duration: 0.4 }}
              >
                <Star
                  className={cn(
                    "drop-shadow-lg",
                    star <= level.stars
                      ? "text-yellow-400 fill-current"
                      : "text-gray-300"
                  )}
                  style={{ width: size * 0.18, height: size * 0.18 }}
                />
              </motion.div>
            ))}
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
}> = ({ chapter, chapterNumber, isCompleted, x, y, width }) => {
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
        <div className="absolute top-8 left-0 right-0 h-px bg-gradient-to-r from-transparent via-white/20 to-transparent" />
        
        {/* Chapter badge */}
        <div className="flex justify-center">
          <motion.div
            className={cn(
              "relative px-6 py-4 rounded-2xl shadow-xl border-2 backdrop-blur-sm",
              isCompleted 
                ? "bg-emerald-500/90 border-emerald-400/50 shadow-emerald-500/30" 
                : "bg-blue-500/90 border-blue-400/50 shadow-blue-500/30"
            )}
            whileHover={{ scale: 1.02 }}
          >
            {/* Chapter content */}
            <div className="flex items-center space-x-4">
              <div className="w-10 h-10 bg-white/20 rounded-full flex items-center justify-center border-2 border-white/30">
                <span className="text-xl font-bold text-white">{chapterNumber}</span>
              </div>
              <div className="text-left">
                <div className="text-white font-bold text-lg leading-tight">{chapter.title}</div>
                <div className="text-white/90 text-sm mt-1">{chapter.description}</div>
              </div>
              {isCompleted && (
                <div className="w-8 h-8 bg-yellow-400/90 rounded-full flex items-center justify-center border-2 border-yellow-300">
                  <Trophy className="w-5 h-5 text-yellow-800" />
                </div>
              )}
            </div>
          </motion.div>
        </div>
      </div>
    </motion.div>
  );
};

const ConnectionPath: React.FC<{
  path: ConnectionPath;
  strokeWidth: number;
}> = ({ path, strokeWidth }) => {
  const { startX, startY, endX, endY, type, isCompleted, isActive } = path;
  
  const getStrokeColor = () => {
    if (isCompleted) return "#10B981"; // emerald-500
    if (isActive) return "#3B82F6"; // blue-500
    return "#6B7280"; // gray-500
  };

  const getPathData = () => {
    if (type === 'horizontal') {
      return `M ${startX} ${startY} L ${endX} ${endY}`;
    } else if (type === 'vertical') {
      // Smooth curve for vertical connections
      const controlX1 = startX + 30;
      const controlY1 = startY + 20;
      const controlX2 = endX - 30;
      const controlY2 = endY - 20;
      return `M ${startX} ${startY} C ${controlX1} ${controlY1} ${controlX2} ${controlY2} ${endX} ${endY}`;
    } else { // chapter-transition
      const controlY = startY + 60;
      return `M ${startX} ${startY} Q ${startX} ${controlY} ${endX} ${endY}`;
    }
  };

  return (
    <g>
      {/* Background path */}
      <motion.path
        d={getPathData()}
        stroke="#374151"
        strokeWidth={strokeWidth + 4}
        fill="none"
        strokeLinecap="round"
        opacity={0.3}
      />
      
      {/* Main path */}
      <motion.path
        d={getPathData()}
        stroke={getStrokeColor()}
        strokeWidth={strokeWidth}
        fill="none"
        strokeLinecap="round"
        strokeDasharray={type === 'chapter-transition' ? "12,8" : "none"}
        initial={{ pathLength: 0, opacity: 0.5 }}
        animate={{ 
          pathLength: isCompleted ? 1 : isActive ? 0.8 : 0.4,
          opacity: isCompleted ? 1 : isActive ? 0.9 : 0.5
        }}
        transition={{ duration: 1.2, ease: "easeInOut" }}
        filter="url(#pathGlow)"
      />
    </g>
  );
};

export const GamePath: React.FC<GamePathProps> = ({ levelPath, onLevelClick }) => {
  const { isMobile, isTablet, screenWidth } = useResponsive();
  
  // Calculate responsive sizes - Made larger as requested
  const nodeSize = isMobile ? 64 : isTablet ? 72 : 80;
  const strokeWidth = isMobile ? 6 : isTablet ? 8 : 10;
  const containerPadding = isMobile ? 24 : isTablet ? 48 : 64;
  const chapterSpacing = isMobile ? 140 : isTablet ? 160 : 180;
  const levelSpacing = isMobile ? 120 : isTablet ? 140 : 160;
  const rowSpacing = isMobile ? 100 : isTablet ? 120 : 140;
  
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
      isCompleted: levels.every(l => l.isCompleted)
    }));
  }, [levelPath]);

  // Calculate positions and connections with proper centering
  const { levelPositions, connections, totalHeight } = useMemo(() => {
    const positions: LevelPosition[] = [];
    const paths: ConnectionPath[] = [];
    
    const availableWidth = screenWidth - (containerPadding * 2);
    const maxLevelsPerRow = Math.max(1, Math.floor(availableWidth / levelSpacing));
    
    let currentY = 120;
    
    chapterGroups.forEach((group, chapterIndex) => {
      // Add chapter header space
      currentY += chapterSpacing;
      
      const levels = group.levels;
      const rows = Math.ceil(levels.length / maxLevelsPerRow);
      
      // Position levels in grid with proper centering
      levels.forEach((level, levelIndex) => {
        const row = Math.floor(levelIndex / maxLevelsPerRow);
        const col = levelIndex % maxLevelsPerRow;
        const levelsInThisRow = Math.min(maxLevelsPerRow, levels.length - row * maxLevelsPerRow);
        
        // Center each row properly
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
        
        // Create connections following the specified pattern
        if (levelIndex > 0) {
          const prevPosition = positions[positions.length - 2];
          const isCompleted = prevPosition.level.isCompleted;
          const isActive = prevPosition.level.isUnlocked;
          
          if (prevPosition.row === row) {
            // Horizontal connection (same row) - right to left
            paths.push({
              startX: prevPosition.x + nodeSize / 2,
              startY: prevPosition.y,
              endX: x - nodeSize / 2,
              endY: y,
              type: 'horizontal',
              isCompleted,
              isActive
            });
          } else {
            // Vertical connection (different row) - right to left, down
            paths.push({
              startX: prevPosition.x + nodeSize / 2,
              startY: prevPosition.y,
              endX: x - nodeSize / 2,
              endY: y,
              type: 'vertical',
              isCompleted,
              isActive
            });
          }
        }
      });
      
      // Chapter transition connection (from last level to next chapter first level)
      if (chapterIndex < chapterGroups.length - 1) {
        const lastLevelOfChapter = positions[positions.length - 1];
        const isCompleted = lastLevelOfChapter.level.isCompleted;
        const isActive = lastLevelOfChapter.level.isUnlocked;
        
        // We'll update this when we know the next chapter's position
        paths.push({
          startX: lastLevelOfChapter.x,
          startY: lastLevelOfChapter.y + nodeSize / 2,
          endX: 0, // Will be updated
          endY: 0, // Will be updated
          type: 'chapter-transition',
          isCompleted,
          isActive
        });
      }
      
      currentY += rows * rowSpacing + chapterSpacing / 2;
    });
    
    // Update chapter transition connections
    let transitionIndex = 0;
    let positionIndex = 0;
    
    chapterGroups.forEach((group, chapterIndex) => {
      positionIndex += group.levels.length;
      
      if (chapterIndex < chapterGroups.length - 1) {
        // Find the next chapter transition path
        while (transitionIndex < paths.length && paths[transitionIndex].type !== 'chapter-transition') {
          transitionIndex++;
        }
        
        if (transitionIndex < paths.length && positionIndex < positions.length) {
          const nextChapterFirstLevel = positions[positionIndex];
          paths[transitionIndex].endX = nextChapterFirstLevel.x;
          paths[transitionIndex].endY = nextChapterFirstLevel.y - nodeSize / 2;
        }
        transitionIndex++;
      }
    });
    
    return {
      levelPositions: positions,
      connections: paths,
      totalHeight: currentY + 120
    };
  }, [chapterGroups, screenWidth, containerPadding, levelSpacing, rowSpacing, chapterSpacing, nodeSize]);

  return (
    <div 
      className="relative w-full overflow-hidden bg-gradient-to-b from-indigo-900 via-purple-900 to-pink-900"
      style={{ height: `${totalHeight}px`, minHeight: '100vh' }}
    >
      {/* Simplified animated background */}
      <div className="absolute inset-0 overflow-hidden">
        {/* Fewer, more subtle stars */}
        {[...Array(isMobile ? 30 : 60)].map((_, i) => (
          <motion.div
            key={i}
            className="absolute w-1 h-1 bg-white rounded-full"
            style={{
              left: `${Math.random() * 100}%`,
              top: `${Math.random() * 100}%`,
            }}
            animate={{
              opacity: [0.2, 0.8, 0.2],
              scale: [1, 1.2, 1],
            }}
            transition={{
              duration: 3 + Math.random() * 2,
              repeat: Infinity,
              delay: Math.random() * 3,
            }}
          />
        ))}
      </div>

      {/* SVG for connections */}
      <svg
        className="absolute inset-0 w-full h-full pointer-events-none z-10"
        style={{ height: `${totalHeight}px` }}
      >
        <defs>
          <filter id="pathGlow">
            <feGaussianBlur stdDeviation="2" result="coloredBlur"/>
            <feMerge> 
              <feMergeNode in="coloredBlur"/>
              <feMergeNode in="SourceGraphic"/>
            </feMerge>
          </filter>
        </defs>
        
        {connections.map((connection, index) => (
          <ConnectionPath
            key={index}
            path={connection}
            strokeWidth={strokeWidth}
          />
        ))}
      </svg>

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
            y={firstLevelOfChapter.y - chapterSpacing + 30}
            width={screenWidth - containerPadding * 2}
          />
        );
      })}

      {/* Level nodes */}
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
        />
      ))}

      {/* Floating action button */}
      <motion.button
        className={cn(
          "fixed bottom-8 right-8 bg-gradient-to-r from-blue-500 to-purple-600 rounded-full flex items-center justify-center shadow-2xl shadow-blue-500/50 z-50 border-4 border-white/20",
          isMobile ? "w-16 h-16" : "w-18 h-18"
        )}
        whileHover={{ scale: 1.05 }}
        whileTap={{ scale: 0.95 }}
        onClick={() => {
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
        }}
      >
        <Target className={cn("text-white", isMobile ? "w-7 h-7" : "w-8 h-8")} />
      </motion.button>
    </div>
  );
};