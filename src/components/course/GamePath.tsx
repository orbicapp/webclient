import React, { useRef, useEffect, useState } from "react";
import { motion, useScroll, useTransform, useSpring, AnimatePresence } from "framer-motion";
import { 
  Play, 
  Lock, 
  CheckCircle, 
  Star, 
  Zap, 
  Trophy,
  Rocket,
  Target,
  Sparkles,
  Shield,
  Gem,
} from "lucide-react";

import { LevelWithChapter } from "@/hooks/use-course-path";
import { cn } from "@/lib/utils/class.utils";

interface GamePathProps {
  levelPath: LevelWithChapter[];
  onLevelClick?: (level: LevelWithChapter) => void;
}

// SVG Path Components
const PathSegment: React.FC<{ 
  startX: number; 
  startY: number; 
  endX: number; 
  endY: number; 
  isCompleted: boolean;
  isActive: boolean;
}> = ({ startX, startY, endX, endY, isCompleted, isActive }) => {
  const pathData = `M ${startX} ${startY} Q ${(startX + endX) / 2 + (Math.random() - 0.5) * 150} ${(startY + endY) / 2} ${endX} ${endY}`;
  
  return (
    <g>
      {/* Background path */}
      <motion.path
        d={pathData}
        stroke="url(#pathGradientBg)"
        strokeWidth="20"
        fill="none"
        strokeLinecap="round"
        opacity={0.3}
      />
      
      {/* Active path */}
      <motion.path
        d={pathData}
        stroke={isCompleted ? "url(#pathGradientCompleted)" : isActive ? "url(#pathGradientActive)" : "url(#pathGradientInactive)"}
        strokeWidth="16"
        fill="none"
        strokeLinecap="round"
        initial={{ pathLength: 0 }}
        animate={{ pathLength: isCompleted ? 1 : isActive ? 0.5 : 0 }}
        transition={{ duration: 1.5, ease: "easeInOut" }}
      />
      
      {/* Animated particles */}
      {isCompleted && (
        <motion.circle
          r="4"
          fill="url(#particleGradient)"
          initial={{ opacity: 0 }}
          animate={{ opacity: [0, 1, 0] }}
          transition={{ duration: 2, repeat: Infinity }}
        >
          <animateMotion dur="3s" repeatCount="indefinite">
            <mpath href={`#path-${startX}-${startY}`} />
          </animateMotion>
        </motion.circle>
      )}
    </g>
  );
};

const LevelNode: React.FC<{
  level: LevelWithChapter;
  x: number;
  y: number;
  index: number;
  chapterNumber: number;
  levelNumber: number;
  onClick?: () => void;
}> = ({ level, x, y, index, chapterNumber, levelNumber, onClick }) => {
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
      transition={{ delay: index * 0.1, duration: 0.6, type: "spring" }}
      whileHover={{ scale: level.isUnlocked ? 1.2 : 1 }}
      whileTap={{ scale: level.isUnlocked ? 0.9 : 1 }}
      onHoverStart={() => setIsHovered(true)}
      onHoverEnd={() => setIsHovered(false)}
      onClick={level.isUnlocked ? onClick : undefined}
    >
      {/* Outer glow ring */}
      <motion.div
        className={cn(
          "absolute inset-0 rounded-full w-24 h-24",
          level.isUnlocked ? "bg-gradient-to-r from-blue-400/30 to-purple-400/30" : "bg-gray-400/20"
        )}
        animate={{
          scale: level.isUnlocked ? [1, 1.3, 1] : 1,
          opacity: level.isUnlocked ? [0.3, 0.6, 0.3] : 0.2,
        }}
        transition={{ duration: 2, repeat: Infinity }}
      />
      
      {/* Main node - Moon/Satellite */}
      <div
        className={cn(
          "relative w-20 h-20 rounded-full flex items-center justify-center shadow-2xl transition-all duration-300",
          `bg-gradient-to-br ${getNodeColor()}`,
          getGlowColor(),
          level.isUnlocked && "hover:shadow-xl"
        )}
      >
        <Icon className="w-10 h-10 text-white" />
        
        {/* Level number */}
        <div className="absolute -top-3 -right-3 w-8 h-8 bg-white dark:bg-gray-800 rounded-full flex items-center justify-center text-xs font-bold text-gray-700 dark:text-gray-300 border-2 border-gray-200 dark:border-gray-600 shadow-lg">
          {chapterNumber}-{levelNumber}
        </div>
        
        {/* Stars */}
        {level.isCompleted && level.stars > 0 && (
          <div className="absolute -bottom-4 left-1/2 transform -translate-x-1/2 flex space-x-1">
            {[1, 2, 3].map((star) => (
              <motion.div
                key={star}
                initial={{ scale: 0, rotate: 0 }}
                animate={{ scale: 1, rotate: 360 }}
                transition={{ delay: (index * 0.1) + (star * 0.1), duration: 0.5 }}
              >
                <Star
                  className={cn(
                    "w-4 h-4",
                    star <= level.stars
                      ? "text-yellow-400 fill-current drop-shadow-lg"
                      : "text-gray-300"
                  )}
                />
              </motion.div>
            ))}
          </div>
        )}
        
        {/* Special effects for completed levels */}
        {level.isCompleted && (
          <>
            {/* Success particles */}
            <motion.div
              className="absolute inset-0 pointer-events-none"
              initial={{ opacity: 0 }}
              animate={{ opacity: 1 }}
            >
              {[...Array(8)].map((_, i) => (
                <motion.div
                  key={i}
                  className="absolute w-2 h-2 bg-yellow-400 rounded-full"
                  style={{
                    left: "50%",
                    top: "50%",
                  }}
                  animate={{
                    x: [0, (Math.random() - 0.5) * 80],
                    y: [0, (Math.random() - 0.5) * 80],
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
          </>
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

const ChapterPlanet: React.FC<{
  chapter: any;
  x: number;
  y: number;
  chapterNumber: number;
  isCompleted: boolean;
  index: number;
}> = ({ chapter, x, y, chapterNumber, isCompleted, index }) => {
  return (
    <motion.div
      className="absolute transform -translate-x-1/2 -translate-y-1/2"
      style={{ left: x, top: y }}
      initial={{ opacity: 0, scale: 0, rotateY: -180 }}
      animate={{ opacity: 1, scale: 1, rotateY: 0 }}
      transition={{ delay: index * 0.3, duration: 1, type: "spring" }}
    >
      {/* Planet with ring */}
      <div className="relative">
        {/* Planet ring */}
        <motion.div
          className={cn(
            "absolute inset-0 w-32 h-32 rounded-full border-4",
            isCompleted 
              ? "border-emerald-400/60 shadow-lg shadow-emerald-400/30" 
              : "border-blue-400/60 shadow-lg shadow-blue-400/30"
          )}
          animate={{ 
            rotate: 360,
            scale: [1, 1.1, 1]
          }}
          transition={{ 
            rotate: { duration: 20, repeat: Infinity, ease: "linear" },
            scale: { duration: 3, repeat: Infinity }
          }}
        />
        
        {/* Inner ring */}
        <motion.div
          className={cn(
            "absolute inset-2 w-28 h-28 rounded-full border-2",
            isCompleted 
              ? "border-emerald-300/40" 
              : "border-blue-300/40"
          )}
          animate={{ 
            rotate: -360,
          }}
          transition={{ 
            rotate: { duration: 15, repeat: Infinity, ease: "linear" }
          }}
        />
        
        {/* Main planet */}
        <motion.div
          className={cn(
            "relative w-24 h-24 rounded-full flex items-center justify-center shadow-2xl m-4",
            isCompleted 
              ? "bg-gradient-to-br from-emerald-500 via-green-600 to-emerald-700 shadow-emerald-500/50" 
              : "bg-gradient-to-br from-blue-500 via-purple-600 to-indigo-700 shadow-blue-500/50"
          )}
          animate={{
            rotateY: [0, 360],
          }}
          transition={{
            duration: 10,
            repeat: Infinity,
            ease: "linear"
          }}
        >
          {/* Planet surface details */}
          <div className="absolute inset-2 rounded-full bg-gradient-to-br from-white/20 to-transparent" />
          <div className="absolute top-3 left-3 w-2 h-2 bg-white/40 rounded-full" />
          <div className="absolute bottom-4 right-3 w-1 h-1 bg-white/30 rounded-full" />
          
          {/* Chapter number */}
          <div className="text-2xl font-bold text-white z-10">
            {chapterNumber}
          </div>
          
          {/* Completion indicator */}
          {isCompleted && (
            <motion.div
              className="absolute -top-2 -right-2 w-8 h-8 bg-gradient-to-r from-yellow-400 to-orange-500 rounded-full flex items-center justify-center"
              animate={{ 
                rotate: [0, 360],
                scale: [1, 1.2, 1]
              }}
              transition={{ 
                rotate: { duration: 3, repeat: Infinity },
                scale: { duration: 2, repeat: Infinity }
              }}
            >
              <Trophy className="w-4 h-4 text-white" />
            </motion.div>
          )}
        </motion.div>
        
        {/* Chapter name badge */}
        <motion.div
          className="absolute -bottom-12 left-1/2 transform -translate-x-1/2 bg-black/80 text-white px-4 py-2 rounded-lg text-sm font-semibold whitespace-nowrap backdrop-blur-sm border border-white/20 max-w-48 text-center"
          initial={{ opacity: 0 }}
          animate={{ opacity: 1 }}
          transition={{ delay: (index * 0.3) + 0.5 }}
        >
          {chapter.title}
          {isCompleted && (
            <motion.span
              className="ml-2 text-green-400"
              initial={{ scale: 0 }}
              animate={{ scale: 1 }}
              transition={{ delay: (index * 0.3) + 0.8 }}
            >
              ✓
            </motion.span>
          )}
        </motion.div>
        
        {/* Celebration particles for completed chapters */}
        {isCompleted && (
          <div className="absolute inset-0 pointer-events-none">
            {[...Array(12)].map((_, i) => (
              <motion.div
                key={i}
                className="absolute w-3 h-3 bg-yellow-400 rounded-full"
                style={{
                  left: "50%",
                  top: "50%",
                }}
                animate={{
                  x: [0, (Math.random() - 0.5) * 120],
                  y: [0, -Math.random() * 60],
                  opacity: [1, 0],
                  scale: [1, 0],
                }}
                transition={{
                  duration: 3,
                  repeat: Infinity,
                  delay: i * 0.4,
                }}
              />
            ))}
          </div>
        )}
      </div>
    </motion.div>
  );
};

export const GamePath: React.FC<GamePathProps> = ({ levelPath, onLevelClick }) => {
  const containerRef = useRef<HTMLDivElement>(null);
  const { scrollYProgress } = useScroll({ container: containerRef });
  const pathProgress = useSpring(scrollYProgress, { stiffness: 100, damping: 30 });

  // Calculate path coordinates with more spacing
  const getPathCoordinates = () => {
    const coordinates: Array<{ 
      x: number; 
      y: number; 
      level: LevelWithChapter;
      chapterNumber: number;
      levelNumber: number;
      isChapterStart: boolean;
    }> = [];
    const containerWidth = 800;
    const levelSpacing = 300; // Increased spacing
    
    let currentChapter = '';
    let chapterNumber = 0;
    let levelInChapter = 0;
    
    levelPath.forEach((level, index) => {
      // Check if this is a new chapter
      if (level.chapter._id !== currentChapter) {
        currentChapter = level.chapter._id;
        chapterNumber++;
        levelInChapter = 1;
      } else {
        levelInChapter++;
      }
      
      const y = index * levelSpacing + 200;
      // Create a more pronounced winding path
      const amplitude = 200;
      const frequency = 0.008;
      const x = containerWidth / 2 + Math.sin(index * frequency * 15) * amplitude;
      
      coordinates.push({ 
        x, 
        y, 
        level,
        chapterNumber,
        levelNumber: levelInChapter,
        isChapterStart: levelInChapter === 1
      });
    });
    
    return coordinates;
  };

  const coordinates = getPathCoordinates();
  const totalHeight = coordinates.length * 300 + 400;

  return (
    <div 
      ref={containerRef}
      className="relative w-full overflow-hidden bg-gradient-to-b from-indigo-900 via-purple-900 to-pink-900 min-h-screen"
      style={{ height: `${totalHeight}px` }}
    >
      {/* Animated background */}
      <div className="absolute inset-0 overflow-hidden">
        {/* Stars */}
        {[...Array(100)].map((_, i) => (
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
        {[...Array(15)].map((_, i) => (
          <motion.div
            key={i}
            className="absolute w-6 h-6 bg-gradient-to-r from-blue-400/30 to-purple-400/30 rounded-full blur-sm"
            style={{
              left: `${Math.random() * 100}%`,
              top: `${Math.random() * 100}%`,
            }}
            animate={{
              y: [0, -30, 0],
              x: [0, Math.random() * 30 - 15, 0],
              opacity: [0.3, 0.8, 0.3],
            }}
            transition={{
              duration: 6 + Math.random() * 3,
              repeat: Infinity,
              delay: Math.random() * 2,
            }}
          />
        ))}
      </div>

      {/* SVG Path */}
      <svg
        className="absolute inset-0 w-full h-full pointer-events-none"
        style={{ height: `${totalHeight}px` }}
      >
        <defs>
          {/* Gradients */}
          <linearGradient id="pathGradientBg" x1="0%" y1="0%" x2="100%" y2="100%">
            <stop offset="0%" stopColor="#374151" />
            <stop offset="100%" stopColor="#1F2937" />
          </linearGradient>
          
          <linearGradient id="pathGradientActive" x1="0%" y1="0%" x2="100%" y2="100%">
            <stop offset="0%" stopColor="#3B82F6" />
            <stop offset="50%" stopColor="#8B5CF6" />
            <stop offset="100%" stopColor="#EC4899" />
          </linearGradient>
          
          <linearGradient id="pathGradientCompleted" x1="0%" y1="0%" x2="100%" y2="100%">
            <stop offset="0%" stopColor="#10B981" />
            <stop offset="50%" stopColor="#F59E0B" />
            <stop offset="100%" stopColor="#EF4444" />
          </linearGradient>
          
          <linearGradient id="pathGradientInactive" x1="0%" y1="0%" x2="100%" y2="100%">
            <stop offset="0%" stopColor="#6B7280" />
            <stop offset="100%" stopColor="#4B5563" />
          </linearGradient>
          
          <radialGradient id="particleGradient">
            <stop offset="0%" stopColor="#FBBF24" />
            <stop offset="100%" stopColor="#F59E0B" />
          </radialGradient>
          
          {/* Glow filter */}
          <filter id="glow">
            <feGaussianBlur stdDeviation="4" result="coloredBlur"/>
            <feMerge> 
              <feMergeNode in="coloredBlur"/>
              <feMergeNode in="SourceGraphic"/>
            </feMerge>
          </filter>
        </defs>
        
        {/* Draw path segments */}
        {coordinates.map((coord, index) => {
          if (index === coordinates.length - 1) return null;
          
          const nextCoord = coordinates[index + 1];
          const isCompleted = coord.level.isCompleted;
          const isActive = coord.level.isUnlocked;
          
          return (
            <PathSegment
              key={index}
              startX={coord.x}
              startY={coord.y}
              endX={nextCoord.x}
              endY={nextCoord.y}
              isCompleted={isCompleted}
              isActive={isActive}
            />
          );
        })}
      </svg>

      {/* Chapter planets and level nodes */}
      {coordinates.map((coord, index) => (
        <React.Fragment key={coord.level._id}>
          {/* Chapter planet for chapter starts */}
          {coord.isChapterStart && (
            <ChapterPlanet
              chapter={coord.level.chapter}
              x={coord.x}
              y={coord.y - 100}
              chapterNumber={coord.chapterNumber}
              isCompleted={levelPath.filter(l => l.chapter._id === coord.level.chapter._id).every(l => l.isCompleted)}
              index={index}
            />
          )}
          
          {/* Level node */}
          <LevelNode
            level={coord.level}
            x={coord.x}
            y={coord.y}
            index={index}
            chapterNumber={coord.chapterNumber}
            levelNumber={coord.levelNumber}
            onClick={() => onLevelClick?.(coord.level)}
          />
        </React.Fragment>
      ))}

      {/* Floating action button */}
      <motion.button
        className="fixed bottom-8 right-8 w-20 h-20 bg-gradient-to-r from-blue-500 to-purple-600 rounded-full flex items-center justify-center shadow-2xl shadow-blue-500/50 z-50"
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
            const element = document.querySelector(`[data-level-id="${nextLevel._id}"]`);
            element?.scrollIntoView({ behavior: 'smooth' });
          }
        }}
      >
        <Target className="w-10 h-10 text-white" />
      </motion.button>
    </div>
  );
};