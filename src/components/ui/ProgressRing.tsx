import { motion } from "framer-motion";
import React from "react";

import { cn } from "@/lib/utils/class.utils";

interface ProgressRingProps {
  progress: number; // 0 to 100
  size?: number;
  strokeWidth?: number;
  className?: string;
  bgColor?: string;
  progressColor?: string;
  children?: React.ReactNode;
  animate?: boolean;
  glow?: boolean;
  variant?: "default" | "neon" | "rainbow";
}

const ProgressRing: React.FC<ProgressRingProps> = ({
  progress,
  size = 60,
  strokeWidth = 6,
  className,
  bgColor = "#E2E8F0",
  progressColor,
  children,
  animate = true,
  glow = false,
  variant = "default",
}) => {
  // Ensure progress is between 0 and 100
  const normalizedProgress = Math.min(100, Math.max(0, progress));

  // Calculate radius and circumference
  const radius = (size - strokeWidth) / 2;
  const circumference = 2 * Math.PI * radius;

  // Calculate stroke dash offset based on progress
  const strokeDashoffset =
    circumference - (normalizedProgress / 100) * circumference;

  // Define gradient colors based on variant
  const getProgressColor = () => {
    if (progressColor) return progressColor;
    
    switch (variant) {
      case "neon":
        return "url(#neonGradient)";
      case "rainbow":
        return "url(#rainbowGradient)";
      default:
        return "url(#progressGradient)";
    }
  };

  return (
    <div
      className={cn(
        "relative inline-flex items-center justify-center",
        glow && "filter drop-shadow-lg",
        className
      )}
    >
      <svg 
        width={size} 
        height={size} 
        viewBox={`0 0 ${size} ${size}`}
        className={glow ? "filter drop-shadow-[0_0_8px_rgba(160,66,255,0.6)]" : ""}
      >
        <defs>
          <linearGradient
            id="progressGradient"
            x1="0%"
            y1="0%"
            x2="100%"
            y2="100%"
          >
            <stop offset="0%" stopColor="#A042FF" />
            <stop offset="50%" stopColor="#F59E0B" />
            <stop offset="100%" stopColor="#10B981" />
          </linearGradient>
          
          <linearGradient
            id="neonGradient"
            x1="0%"
            y1="0%"
            x2="100%"
            y2="100%"
          >
            <stop offset="0%" stopColor="#00FFFF" />
            <stop offset="50%" stopColor="#FF00FF" />
            <stop offset="100%" stopColor="#FFFF00" />
          </linearGradient>
          
          <linearGradient
            id="rainbowGradient"
            x1="0%"
            y1="0%"
            x2="100%"
            y2="100%"
          >
            <stop offset="0%" stopColor="#FF0000" />
            <stop offset="16.66%" stopColor="#FF8000" />
            <stop offset="33.33%" stopColor="#FFFF00" />
            <stop offset="50%" stopColor="#00FF00" />
            <stop offset="66.66%" stopColor="#0080FF" />
            <stop offset="83.33%" stopColor="#8000FF" />
            <stop offset="100%" stopColor="#FF0080" />
          </linearGradient>
          
          {glow && (
            <filter id="glow">
              <feGaussianBlur stdDeviation="3" result="coloredBlur"/>
              <feMerge> 
                <feMergeNode in="coloredBlur"/>
                <feMergeNode in="SourceGraphic"/>
              </feMerge>
            </filter>
          )}
        </defs>

        {/* Background circle */}
        <circle
          cx={size / 2}
          cy={size / 2}
          r={radius}
          fill="none"
          stroke={bgColor}
          strokeWidth={strokeWidth}
          className="opacity-20"
        />

        {/* Progress circle */}
        <motion.circle
          cx={size / 2}
          cy={size / 2}
          r={radius}
          fill="none"
          stroke={getProgressColor()}
          strokeWidth={strokeWidth}
          strokeDasharray={circumference}
          strokeLinecap="round"
          initial={{ strokeDashoffset: circumference }}
          animate={{
            strokeDashoffset: animate ? strokeDashoffset : circumference,
          }}
          transition={{ 
            duration: 1.5, 
            ease: "easeOut",
            delay: 0.2
          }}
          className="progress-ring-circle"
          filter={glow ? "url(#glow)" : undefined}
        />
      </svg>

      {/* Center content */}
      {children && (
        <div className="absolute inset-0 flex items-center justify-center">
          {children}
        </div>
      )}
    </div>
  );
};

export default ProgressRing;