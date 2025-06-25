/* eslint-disable @typescript-eslint/no-explicit-any */
import { type ClassValue, clsx } from "clsx";
import { twMerge } from "tailwind-merge";

/**
 * Combines Tailwind CSS classes using clsx and tailwind-merge
 */
export function cn(...inputs: ClassValue[]) {
  return twMerge(clsx(inputs));
}

/**
 * Formats a number as a compact string (e.g., 1.2K, 1.5M)
 */
export function formatCompact(num: number): string {
  return Intl.NumberFormat("en-US", {
    notation: "compact",
    maximumFractionDigits: 1,
  }).format(num);
}

/**
 * Calculates the experience points (XP) required for a specific level
 */
export function calculateXpForLevel(level: number): number {
  return Math.floor(100 * Math.pow(1.5, level - 1));
}

/**
 * Calculates the current level based on total XP
 */
export function calculateLevelFromXp(totalXp: number): number {
  let level = 1;
  let xpRequired = 100;

  while (totalXp >= xpRequired) {
    totalXp -= xpRequired;
    level += 1;
    xpRequired = calculateXpForLevel(level);
  }

  return level;
}

/**
 * Calculates the percentage of XP progress towards the next level
 */
export function calculateLevelProgress(totalXp: number): number {
  const level = calculateLevelFromXp(totalXp);
  const xpForCurrentLevel = calculateXpForLevel(level);
  const xpForPreviousLevel = level > 1 ? calculateXpForLevel(level - 1) : 0;

  const currentLevelXp = totalXp - xpForPreviousLevel;
  const progress = (currentLevelXp / xpForCurrentLevel) * 100;

  return Math.min(Math.max(progress, 0), 100);
}

/**
 * Truncates text with ellipsis
 */
export function truncateText(text: string, maxLength: number): string {
  return text.length > maxLength ? text.substring(0, maxLength) + "..." : text;
}

/**
 * Delays execution for a specified time
 */
export function delay(ms: number): Promise<void> {
  return new Promise((resolve) => setTimeout(resolve, ms));
}

/**
 * Shuffles array elements (Fisher-Yates algorithm)
 */
export function shuffleArray<T>(array: T[]): T[] {
  const newArray = [...array];
  for (let i = newArray.length - 1; i > 0; i--) {
    const j = Math.floor(Math.random() * (i + 1));
    [newArray[i], newArray[j]] = [newArray[j], newArray[i]];
  }
  return newArray;
}

/**
 * Formats a date string to a readable format
 */
export function formatDate(date: Date | string): string {
  if (typeof date === "string") {
    date = new Date(date);
  }
  return date.toLocaleDateString("en-US", {
    year: "numeric",
    month: "short",
    day: "numeric",
  });
}

/**
 * Calculates time difference in days
 */
export function daysSince(date: Date | string): number {
  const startDate = typeof date === "string" ? new Date(date) : date;
  const currentDate = new Date();

  const timeDiff = currentDate.getTime() - startDate.getTime();
  return Math.floor(timeDiff / (1000 * 3600 * 24));
}

/**
 * Generates a random ID (for mock data)
 */
export function generateId(): string {
  return Math.random().toString(36).substring(2, 15);
}

/**
 * Handles API errors
 */
export function handleApiError(error: any): string {
  if (error?.response?.data?.message) {
    return error.response.data.message;
  }
  if (error?.message) {
    return error.message;
  }
  return "An unexpected error occurred";
}

/**
 * Calculates reading time for text content
 */
export function calculateReadingTime(text: string): number {
  const wordsPerMinute = 200;
  const wordCount = text.split(/\s+/).length;
  return Math.ceil(wordCount / wordsPerMinute);
}
