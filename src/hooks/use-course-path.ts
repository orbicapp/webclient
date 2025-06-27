import { useMemo } from "react";

import { Chapter } from "@/services/chapter-service";
import { Level } from "@/services/level-service";
import { CourseProgress } from "@/services/progress-service";

export interface LevelWithChapter extends Level {
  chapter: Chapter;
  isChapterEnd: boolean;
  levelIndex: number;
  isCompleted: boolean;
  isUnlocked: boolean;
  stars: number;
}

interface UseCoursePathOptions {
  chapters: Chapter[];
  levels: Level[];
  progress?: CourseProgress | null;
}

export const useCoursePath = ({ 
  chapters, 
  levels, 
  progress 
}: UseCoursePathOptions): LevelWithChapter[] => {
  return useMemo(() => {
    console.log("useCoursePath - Input data:", {
      chapters: chapters?.length || 0,
      levels: levels?.length || 0,
      progress: !!progress,
      chaptersData: chapters,
      levelsData: levels
    });

    const levelPath: LevelWithChapter[] = [];
    let levelIndex = 0;

    // Early return if no data
    if (!chapters || chapters.length === 0) {
      console.log("useCoursePath - No chapters found");
      return levelPath;
    }

    if (!levels || levels.length === 0) {
      console.log("useCoursePath - No levels found");
      return levelPath;
    }

    // Sort chapters by order
    const sortedChapters = [...chapters].sort((a, b) => a.order - b.order);
    console.log("useCoursePath - Sorted chapters:", sortedChapters.map(c => ({ id: c._id, title: c.title, order: c.order })));

    sortedChapters.forEach((chapter) => {
      // Get levels for this chapter and sort by order
      const chapterLevels = levels
        .filter((level) => {
          const matches = level.chapterId === chapter._id;
          if (!matches) {
            console.log(`Level ${level._id} (${level.title}) does not match chapter ${chapter._id} (${chapter.title})`);
          }
          return matches;
        })
        .sort((a, b) => a.order - b.order);

      console.log(`Chapter ${chapter.title} has ${chapterLevels.length} levels:`, 
        chapterLevels.map(l => ({ id: l._id, title: l.title, order: l.order, chapterId: l.chapterId }))
      );

      chapterLevels.forEach((level, index) => {
        const isChapterEnd = index === chapterLevels.length - 1;
        
        // Check if level is completed
        const isCompleted = progress?.levelProgress?.some(
          (lp) => lp.levelId === level._id && lp.completed
        ) || false;
        
        // Check if level is unlocked (first level or previous level completed)
        const isUnlocked = levelIndex === 0 || 
          (levelPath[levelIndex - 1]?.isCompleted) || false;
        
        // Get level progress for stars calculation
        const levelProgress = progress?.levelProgress?.find(
          (lp) => lp.levelId === level._id
        );
        
        // Calculate stars (0-3 based on score)
        const stars = levelProgress?.score 
          ? Math.min(3, Math.floor(levelProgress.score / 33.33)) 
          : 0;

        const levelWithChapter: LevelWithChapter = {
          ...level,
          chapter,
          isChapterEnd,
          levelIndex,
          isCompleted,
          isUnlocked,
          stars,
        };

        levelPath.push(levelWithChapter);
        levelIndex++;
      });
    });

    console.log("useCoursePath - Final level path:", levelPath.length, levelPath);
    return levelPath;
  }, [chapters, levels, progress]);
};

// Additional helper hook for course statistics
export const useCourseStats = (levelPath: LevelWithChapter[]) => {
  return useMemo(() => {
    const totalLevels = levelPath.length;
    const completedLevels = levelPath.filter(level => level.isCompleted).length;
    const totalStars = levelPath.reduce((sum, level) => sum + level.stars, 0);
    const maxPossibleStars = totalLevels * 3;
    const progressPercentage = totalLevels > 0 ? Math.round((completedLevels / totalLevels) * 100) : 0;
    
    // Get unique chapters
    const chapters = Array.from(
      new Set(levelPath.map(level => level.chapter._id))
    ).map(chapterId => 
      levelPath.find(level => level.chapter._id === chapterId)?.chapter
    ).filter(Boolean) as Chapter[];
    
    const completedChapters = chapters.filter(chapter => {
      const chapterLevels = levelPath.filter(level => level.chapter._id === chapter._id);
      return chapterLevels.every(level => level.isCompleted);
    });

    const stats = {
      totalLevels,
      completedLevels,
      totalStars,
      maxPossibleStars,
      progressPercentage,
      totalChapters: chapters.length,
      completedChapters: completedChapters.length,
      isCompleted: progressPercentage === 100,
    };

    console.log("useCourseStats - Calculated stats:", stats);
    return stats;
  }, [levelPath]);
};