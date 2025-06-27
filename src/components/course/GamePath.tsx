import React, { useRef, useEffect, useState } from "react";
import { motion, useScroll, useTransform, useSpring, AnimatePresence } from "framer-motion";
import { 
  Play, 
  Lock, 
  CheckCircle, 
  Star, 
  Crown, 
  Zap, 
  Flame, 
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
  const pathData = `M ${startX} ${startY} Q ${(startX + endX) / 2 + (Math.random() - 0.5) * 100} ${(startY + endY) / 2} ${endX} ${endY}`;
  
  return (
    <g>
      {/* Background path */}
      <motion.path
        d={pathData}
        stroke="url(#pathGradientBg)"
        strokeWidth="12"
        fill="none"
        strokeLinecap="round"
        opacity={0.3}
      />
      
      {/* Active path */}
      <motion.path
        d={pathData}
        stroke={isCompleted ? "url(#pathGradientCompleted)" : isActive ? "url(#pathGradientActive)" : "url(#pathGradientInactive)"}
        strokeWidth="8"
        fill="none"
        strokeLinecap="round"
        initial={{ pathLength: 0 }}
        animate={{ pathLength: isCompleted ? 1 : isActive ? 0.5 : 0 }}
        transition={{ duration: 1.5, ease: "easeInOut" }}
      />
      
      {/* Animated particles */}
      {isCompleted && (
        <motion.circle
          r="3"
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
  onClick?: () => void;
}> = ({ level, x, y, index, onClick }) => {
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
          "absolute inset-0 rounded-full",
          level.isUnlocked ? "bg-gradient-to-r from-blue-400/30 to-purple-400/30" : "bg-gray-400/20"
        )}
        animate={{
          scale: level.isUnlocked ? [1, 1.3, 1] : 1,
          opacity: level.isUnlocked ? [0.3, 0.6, 0.3] : 0.2,
        }}
        transition={{ duration: 2, repeat: Infinity }}
      />
      
      {/* Main node */}
      <div
        className={cn(
          "relative w-16 h-16 rounded-full flex items-center justify-center shadow-2xl transition-all duration-300",
          `bg-gradient-to-br ${getNodeColor()}`,
          getGlowColor(),
          level.isUnlocked && "hover:shadow-xl"
        )}
      >
        <Icon className="w-8 h-8 text-white" />
        
        {/* Level number */}
        <div className="absolute -top-2 -right-2 w-6 h-6 bg-white dark:bg-gray-800 rounded-full flex items-center justify-center text-xs font-bold text-gray-700 dark:text-gray-300 border-2 border-gray-200 dark:border-gray-600 shadow-lg">
          {level.levelIndex + 1}
        </div>
        
        {/* Stars */}
        {level.isCompleted && level.stars > 0 && (
          <div className="absolute -bottom-3 left-1/2 transform -translate-x-1/2 flex space-x-1">
            {[1, 2, 3].map((star) => (
              <motion.div
                key={star}
                initial={{ scale: 0, rotate: 0 }}
                animate={{ scale: 1, rotate: 360 }}
                transition={{ delay: (index * 0.1) + (star * 0.1), duration: 0.5 }}
              >
                <Star
                  className={cn(
                    "w-3 h-3",
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
              {[...Array(6)].map((_, i) => (
                <motion.div
                  key={i}
                  className="absolute w-1 h-1 bg-yellow-400 rounded-full"
                  style={{
                    left: "50%",
                    top: "50%",
                  }}
                  animate={{
                    x: [0, (Math.random() - 0.5) * 60],
                    y: [0, (Math.random() - 0.5) * 60],
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
              className="absolute bottom-full mb-2 left-1/2 transform -translate-x-1/2 bg-black/90 text-white px-3 py-2 rounded-lg text-sm whitespace-nowrap z-50 backdrop-blur-sm border border-white/20"
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

const ChapterFlag: React.FC<{
  chapter: any;
  x: number;
  y: number;
  isCompleted: boolean;
  index: number;
}> = ({ chapter, x, y, isCompleted, index }) => {
  return (
    <motion.div
      className="absolute transform -translate-x-1/2"
      style={{ left: x, top: y - 60 }}
      initial={{ opacity: 0, scale: 0, y: 20 }}
      animate={{ opacity: 1, scale: 1, y: 0 }}
      transition={{ delay: index * 0.2, duration: 0.8, type: "spring" }}
    >
      {/* Flag pole */}
      <div className="relative">
        <motion.div
          className="w-2 h-16 bg-gradient-to-b from-yellow-400 to-orange-500 rounded-full shadow-lg mx-auto"
          animate={{ scaleY: [0.8, 1, 0.8] }}
          transition={{ duration: 3, repeat: Infinity }}
        />
        
        {/* Flag */}
        <motion.div
          className={cn(
            "absolute top-0 left-2 w-20 h-10 rounded-r-lg shadow-xl flex items-center justify-center text-white font-bold text-xs",
            isCompleted 
              ? "bg-gradient-to-r from-emerald-500 to-green-600" 
              : "bg-gradient-to-r from-yellow-400 to-orange-500"
          )}
          animate={{ 
            x: [0, 3, 0],
            rotateY: [0, 5, 0]
          }}
          transition={{ duration: 2, repeat: Infinity }}
        >
          {isCompleted ? (
            <Trophy className="w-4 h-4" />
          ) : (
            <Crown className="w-4 h-4" />
          )}
        </motion.div>
        
        {/* Chapter name badge */}
        <motion.div
          className="absolute -bottom-8 left-1/2 transform -translate-x-1/2 bg-black/80 text-white px-3 py-1 rounded-lg text-xs font-semibold whitespace-nowrap backdrop-blur-sm border border-white/20"
          initial={{ opacity: 0 }}
          animate={{ opacity: 1 }}
          transition={{ delay: (index * 0.2) + 0.5 }}
        >
          {chapter.title}
          {isCompleted && (
            <motion.span
              className="ml-2 text-green-400"
              initial={{ scale: 0 }}
              animate={{ scale: 1 }}
              transition={{ delay: (index * 0.2) + 0.8 }}
            >
              ✓
            </motion.span>
          )}
        </motion.div>
        
        {/* Celebration particles for completed chapters */}
        {isCompleted && (
          <div className="absolute top-0 left-0 pointer-events-none">
            {[...Array(8)].map((_, i) => (
              <motion.div
                key={i}
                className="absolute w-2 h-2 bg-yellow-400 rounded-full"
                style={{
                  left: "50%",
                  top: "20%",
                }}
                animate={{
                  x: [0, (Math.random() - 0.5) * 80],
                  y: [0, -Math.random() * 40],
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

  // Calculate path coordinates
  const getPathCoordinates = () => {
    const coordinates: Array<{ x: number; y: number; level: LevelWithChapter }> = [];
    const containerWidth = 800;
    const levelSpacing = 200;
    
    levelPath.forEach((level, index) => {
      const y = index * levelSpacing + 100;
      // Create a winding path
      const amplitude = 150;
      const frequency = 0.01;
      const x = containerWidth / 2 + Math.sin(index * frequency * 10) * amplitude;
      
      coordinates.push({ x, y, level });
    });
    
    return coordinates;
  };

  const coordinates = getPathCoordinates();
  const totalHeight = coordinates.length * 200 + 200;

  return (
    <div 
      ref={containerRef}
      className="relative w-full overflow-hidden bg-gradient-to-b from-indigo-900 via-purple-900 to-pink-900 min-h-screen"
      style={{ height: `${totalHeight}px` }}
    >
      {/* Animated background */}
      <div className="absolute inset-0 overflow-hidden">
        {/* Stars */}
        {[...Array(50)].map((_, i) => (
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
        {[...Array(10)].map((_, i) => (
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

      {/* Level nodes */}
      {coordinates.map((coord, index) => (
        <LevelNode
          key={coord.level._id}
          level={coord.level}
          x={coord.x}
          y={coord.y}
          index={index}
          onClick={() => onLevelClick?.(coord.level)}
        />
      ))}

      {/* Chapter flags */}
      {coordinates.map((coord, index) => {
        if (!coord.level.isChapterEnd) return null;
        
        const chapterLevels = levelPath.filter(l => l.chapter._id === coord.level.chapter._id);
        const isChapterCompleted = chapterLevels.every(l => l.isCompleted);
        
        return (
          <ChapterFlag
            key={`flag-${coord.level.chapter._id}`}
            chapter={coord.level.chapter}
            x={coord.x}
            y={coord.y}
            isCompleted={isChapterCompleted}
            index={index}
          />
        );
      })}

      {/* Progress indicator */}
      <motion.div
        className="fixed top-4 right-4 bg-black/80 backdrop-blur-sm rounded-xl p-4 border border-white/20 z-50"
        initial={{ opacity: 0, x: 100 }}
        animate={{ opacity: 1, x: 0 }}
        transition={{ delay: 1 }}
      >
        <div className="flex items-center space-x-3">
          <Rocket className="w-5 h-5 text-blue-400" />
          <div>
            <div className="text-white text-sm font-semibold">
              Progress: {Math.round(scrollYProgress.get() * 100)}%
            </div>
            <div className="text-gray-400 text-xs">
              {levelPath.filter(l => l.isCompleted).length} / {levelPath.length} levels
            </div>
          </div>
        </div>
      </motion.div>

      {/* Floating action button */}
      <motion.button
        className="fixed bottom-8 right-8 w-16 h-16 bg-gradient-to-r from-blue-500 to-purple-600 rounded-full flex items-center justify-center shadow-2xl shadow-blue-500/50 z-50"
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
        <Target className="w-8 h-8 text-white" />
      </motion.button>
    </div>
  );
};