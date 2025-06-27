import React, { useRef, useState, useMemo } from "react";
import { motion, AnimatePresence } from "framer-motion";
import { 
  Play, 
  Lock, 
  CheckCircle, 
  Star, 
  Trophy,
  Target,
  Sparkles,
  Crown,
  Gem,
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
  
  const getNodeColor = () => {
    if (level.isCompleted) return "from-emerald-400 to-green-600";
    if (level.isUnlocked) return "from-blue-400 to-purple-600";
    return "from-gray-400 to-gray-600";
  };
  
  const getGlowColor = () => {
    if (level.isCompleted) return "shadow-emerald-500/50";
    if (level.isUnlocked) return "shadow-blue-500/50";
    return "shadow-gray-500/30";
  };

  const Icon = getNodeIcon();

  return (
    <motion.div
      className="absolute transform -translate-x-1/2 -translate-y-1/2 cursor-pointer"
      style={{ left: x, top: y }}
      initial={{ scale: 0, opacity: 0 }}
      animate={{ scale: 1, opacity: 1 }}
      transition={{ delay: levelNumber * 0.1, duration: 0.6, type: "spring" }}
      whileHover={{ scale: level.isUnlocked ? 1.15 : 1 }}
      whileTap={{ scale: level.isUnlocked ? 0.9 : 1 }}
      onHoverStart={() => setIsHovered(true)}
      onHoverEnd={() => setIsHovered(false)}
      onClick={level.isUnlocked ? onClick : undefined}
    >
      {/* Outer glow ring */}
      <motion.div
        className={cn(
          "absolute inset-0 rounded-full",
          level.isUnlocked ? "bg-gradient-to-r from-blue-400/30 to-purple-400/30" : "bg-gray-400/20"
        )}
        style={{ width: size + 16, height: size + 16, left: -8, top: -8 }}
        animate={{
          scale: level.isUnlocked ? [1, 1.2, 1] : 1,
          opacity: level.isUnlocked ? [0.3, 0.6, 0.3] : 0.2,
        }}
        transition={{ duration: 2, repeat: Infinity }}
      />
      
      {/* Main node */}
      <div
        className={cn(
          "relative rounded-full flex items-center justify-center shadow-2xl transition-all duration-300",
          `bg-gradient-to-br ${getNodeColor()}`,
          getGlowColor(),
          level.isUnlocked && "hover:shadow-xl"
        )}
        style={{ width: size, height: size }}
      >
        <Icon className={`text-white`} style={{ width: size * 0.4, height: size * 0.4 }} />
        
        {/* Level number */}
        <div 
          className="absolute -top-2 -right-2 bg-white dark:bg-gray-800 rounded-full flex items-center justify-center text-xs font-bold text-gray-700 dark:text-gray-300 border-2 border-gray-200 dark:border-gray-600 shadow-lg"
          style={{ width: size * 0.35, height: size * 0.35, fontSize: size * 0.12 }}
        >
          {chapterNumber}-{levelNumber}
        </div>
        
        {/* Stars */}
        {level.isCompleted && level.stars > 0 && (
          <div className="absolute -bottom-3 left-1/2 transform -translate-x-1/2 flex space-x-1">
            {[1, 2, 3].map((star) => (
              <motion.div
                key={star}
                initial={{ scale: 0, rotate: 0 }}
                animate={{ scale: 1, rotate: 360 }}
                transition={{ delay: levelNumber * 0.1 + star * 0.1, duration: 0.5 }}
              >
                <Star
                  className={cn(
                    star <= level.stars
                      ? "text-yellow-400 fill-current drop-shadow-lg"
                      : "text-gray-300"
                  )}
                  style={{ width: size * 0.2, height: size * 0.2 }}
                />
              </motion.div>
            ))}
          </div>
        )}
        
        {/* Success particles for completed levels */}
        {level.isCompleted && (
          <motion.div
            className="absolute inset-0 pointer-events-none"
            initial={{ opacity: 0 }}
            animate={{ opacity: 1 }}
          >
            {[...Array(6)].map((_, i) => (
              <motion.div
                key={i}
                className="absolute w-1 h-1 bg-yellow-400 rounded-full"
                style={{
                  left: "50%",
                  top: "50%",
                }}
                animate={{
                  x: [0, (Math.random() - 0.5) * size],
                  y: [0, (Math.random() - 0.5) * size],
                  opacity: [1, 0],
                  scale: [1, 0],
                }}
                transition={{
                  duration: 2,
                  repeat: Infinity,
                  delay: i * 0.3,
                }}
              />
            ))}
          </motion.div>
        )}
        
        {/* Hover tooltip */}
        <AnimatePresence>
          {isHovered && (
            <motion.div
              className="absolute bottom-full mb-4 left-1/2 transform -translate-x-1/2 bg-black/90 text-white px-4 py-3 rounded-lg text-sm whitespace-nowrap z-50 backdrop-blur-sm border border-white/20"
              initial={{ opacity: 0, y: 10, scale: 0.8 }}
              animate={{ opacity: 1, y: 0, scale: 1 }}
              exit={{ opacity: 0, y: 10, scale: 0.8 }}
              transition={{ duration: 0.2 }}
            >
              <div className="font-semibold">{level.title}</div>
              <div className="text-xs text-gray-300">{level.chapter.title}</div>
              {level.isCompleted && (
                <div className="text-xs text-green-400 flex items-center mt-1">
                  <CheckCircle className="w-3 h-3 mr-1" />
                  Completed
                </div>
              )}
              {!level.isUnlocked && (
                <div className="text-xs text-red-400 flex items-center mt-1">
                  <Lock className="w-3 h-3 mr-1" />
                  Locked
                </div>
              )}
              
              {/* Tooltip arrow */}
              <div className="absolute top-full left-1/2 transform -translate-x-1/2 border-4 border-transparent border-t-black/90"></div>
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
      className="absolute"
      style={{ left: x, top: y, width }}
      initial={{ opacity: 0, y: -20 }}
      animate={{ opacity: 1, y: 0 }}
      transition={{ delay: chapterNumber * 0.2, duration: 0.8 }}
    >
      <div className="relative">
        {/* Chapter divider line */}
        <div className="absolute top-8 left-0 right-0 h-px bg-gradient-to-r from-transparent via-white/30 to-transparent" />
        
        {/* Chapter badge */}
        <div className="flex justify-center">
          <motion.div
            className={cn(
              "relative px-6 py-3 rounded-2xl shadow-2xl border-2",
              isCompleted 
                ? "bg-gradient-to-r from-emerald-500 to-green-600 border-emerald-400/50 shadow-emerald-500/30" 
                : "bg-gradient-to-r from-blue-500 to-purple-600 border-blue-400/50 shadow-blue-500/30"
            )}
            whileHover={{ scale: 1.05 }}
            animate={{
              boxShadow: [
                "0 0 20px rgba(59, 130, 246, 0.3)",
                "0 0 30px rgba(139, 92, 246, 0.5)",
                "0 0 20px rgba(59, 130, 246, 0.3)",
              ],
            }}
            transition={{ duration: 3, repeat: Infinity }}
          >
            {/* Chapter number */}
            <div className="flex items-center space-x-3">
              <div className="w-8 h-8 bg-white/20 rounded-full flex items-center justify-center">
                <span className="text-lg font-bold text-white">{chapterNumber}</span>
              </div>
              <div>
                <div className="text-white font-bold text-lg">{chapter.title}</div>
                <div className="text-white/80 text-sm">{chapter.description}</div>
              </div>
              {isCompleted && (
                <motion.div
                  className="w-6 h-6 bg-yellow-400 rounded-full flex items-center justify-center"
                  animate={{ rotate: [0, 360] }}
                  transition={{ duration: 2, repeat: Infinity }}
                >
                  <Trophy className="w-4 h-4 text-white" />
                </motion.div>
              )}
            </div>
            
            {/* Decorative elements */}
            <div className="absolute -top-1 -left-1 w-3 h-3 bg-white/30 rounded-full" />
            <div className="absolute -bottom-1 -right-1 w-2 h-2 bg-white/20 rounded-full" />
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
      const midY = startY + (endY - startY) / 2;
      return `M ${startX} ${startY} Q ${startX} ${midY} ${endX} ${endY}`;
    } else { // chapter-transition
      const controlY = startY + 50;
      return `M ${startX} ${startY} Q ${startX} ${controlY} ${endX} ${endY}`;
    }
  };

  return (
    <motion.path
      d={getPathData()}
      stroke={getStrokeColor()}
      strokeWidth={strokeWidth}
      fill="none"
      strokeLinecap="round"
      strokeDasharray={type === 'chapter-transition' ? "10,5" : "none"}
      initial={{ pathLength: 0, opacity: 0.3 }}
      animate={{ 
        pathLength: isCompleted ? 1 : isActive ? 0.7 : 0.3,
        opacity: isCompleted ? 1 : isActive ? 0.8 : 0.4
      }}
      transition={{ duration: 1.5, ease: "easeInOut" }}
    />
  );
};

export const GamePath: React.FC<GamePathProps> = ({ levelPath, onLevelClick }) => {
  const { isMobile, isTablet, screenWidth } = useResponsive();
  
  // Calculate responsive sizes
  const nodeSize = isMobile ? 48 : isTablet ? 56 : 64;
  const strokeWidth = isMobile ? 4 : isTablet ? 6 : 8;
  const containerPadding = isMobile ? 20 : isTablet ? 40 : 60;
  const chapterSpacing = isMobile ? 120 : isTablet ? 150 : 180;
  const levelSpacing = isMobile ? 80 : isTablet ? 100 : 120;
  const rowSpacing = isMobile ? 80 : isTablet ? 100 : 120;
  
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

  // Calculate positions and connections
  const { levelPositions, connections, totalHeight } = useMemo(() => {
    const positions: LevelPosition[] = [];
    const paths: ConnectionPath[] = [];
    
    const availableWidth = screenWidth - (containerPadding * 2);
    const maxLevelsPerRow = Math.floor(availableWidth / levelSpacing);
    
    let currentY = 100;
    
    chapterGroups.forEach((group, chapterIndex) => {
      // Add chapter header space
      currentY += chapterSpacing;
      
      const levels = group.levels;
      const rows = Math.ceil(levels.length / maxLevelsPerRow);
      
      // Position levels in grid
      levels.forEach((level, levelIndex) => {
        const row = Math.floor(levelIndex / maxLevelsPerRow);
        const col = levelIndex % maxLevelsPerRow;
        const levelsInThisRow = Math.min(maxLevelsPerRow, levels.length - row * maxLevelsPerRow);
        
        // Center the row
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
        
        // Create connections
        if (levelIndex > 0) {
          const prevPosition = positions[positions.length - 2];
          const isCompleted = prevPosition.level.isCompleted;
          const isActive = prevPosition.level.isUnlocked;
          
          if (prevPosition.row === row) {
            // Horizontal connection (same row)
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
            // Vertical connection (different row)
            paths.push({
              startX: prevPosition.x,
              startY: prevPosition.y + nodeSize / 2,
              endX: x,
              endY: y - nodeSize / 2,
              type: 'vertical',
              isCompleted,
              isActive
            });
          }
        }
      });
      
      // Chapter transition connection
      if (chapterIndex < chapterGroups.length - 1) {
        const lastLevelOfChapter = positions[positions.length - 1];
        const nextChapterFirstLevel = positions.length; // Will be the next position
        
        // We'll add this connection after positioning the next chapter
        const isCompleted = lastLevelOfChapter.level.isCompleted;
        const isActive = lastLevelOfChapter.level.isUnlocked;
        
        // Store for later when we know the next chapter's first level position
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
    let pathIndex = 0;
    let positionIndex = 0;
    
    chapterGroups.forEach((group, chapterIndex) => {
      positionIndex += group.levels.length;
      
      if (chapterIndex < chapterGroups.length - 1) {
        // Find the chapter transition path for this chapter
        while (pathIndex < paths.length && paths[pathIndex].type !== 'chapter-transition') {
          pathIndex++;
        }
        
        if (pathIndex < paths.length && positionIndex < positions.length) {
          const nextChapterFirstLevel = positions[positionIndex];
          paths[pathIndex].endX = nextChapterFirstLevel.x;
          paths[pathIndex].endY = nextChapterFirstLevel.y - nodeSize / 2;
        }
        pathIndex++;
      }
    });
    
    return {
      levelPositions: positions,
      connections: paths,
      totalHeight: currentY + 100
    };
  }, [chapterGroups, screenWidth, containerPadding, levelSpacing, rowSpacing, chapterSpacing, nodeSize]);

  return (
    <div 
      className="relative w-full overflow-hidden bg-gradient-to-b from-indigo-900 via-purple-900 to-pink-900"
      style={{ height: `${totalHeight}px`, minHeight: '100vh' }}
    >
      {/* Animated background */}
      <div className="absolute inset-0 overflow-hidden">
        {/* Stars */}
        {[...Array(isMobile ? 50 : 100)].map((_, i) => (
          <motion.div
            key={i}
            className="absolute w-1 h-1 bg-white rounded-full"
            style={{
              left: `${Math.random() * 100}%`,
              top: `${Math.random() * 100}%`,
            }}
            animate={{
              opacity: [0.3, 1, 0.3],
              scale: [1, 1.5, 1],
            }}
            transition={{
              duration: 2 + Math.random() * 3,
              repeat: Infinity,
              delay: Math.random() * 2,
            }}
          />
        ))}
        
        {/* Floating orbs */}
        {[...Array(isMobile ? 8 : 15)].map((_, i) => (
          <motion.div
            key={i}
            className="absolute w-4 h-4 bg-gradient-to-r from-blue-400/30 to-purple-400/30 rounded-full blur-sm"
            style={{
              left: `${Math.random() * 100}%`,
              top: `${Math.random() * 100}%`,
            }}
            animate={{
              y: [0, -20, 0],
              x: [0, Math.random() * 20 - 10, 0],
              opacity: [0.3, 0.8, 0.3],
            }}
            transition={{
              duration: 4 + Math.random() * 2,
              repeat: Infinity,
              delay: Math.random() * 2,
            }}
          />
        ))}
      </div>

      {/* SVG for connections */}
      <svg
        className="absolute inset-0 w-full h-full pointer-events-none"
        style={{ height: `${totalHeight}px` }}
      >
        <defs>
          <filter id="glow">
            <feGaussianBlur stdDeviation="3" result="coloredBlur"/>
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
            y={firstLevelOfChapter.y - chapterSpacing + 20}
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
          "fixed bottom-8 right-8 bg-gradient-to-r from-blue-500 to-purple-600 rounded-full flex items-center justify-center shadow-2xl shadow-blue-500/50 z-50",
          isMobile ? "w-14 h-14" : "w-16 h-16"
        )}
        whileHover={{ scale: 1.1 }}
        whileTap={{ scale: 0.9 }}
        animate={{
          boxShadow: [
            "0 0 20px rgba(59, 130, 246, 0.5)",
            "0 0 40px rgba(139, 92, 246, 0.7)",
            "0 0 20px rgba(59, 130, 246, 0.5)",
          ],
        }}
        transition={{ duration: 2, repeat: Infinity }}
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
        <Target className={cn("text-white", isMobile ? "w-6 h-6" : "w-8 h-8")} />
      </motion.button>
    </div>
  );
};