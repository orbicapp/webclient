import { motion, useScroll, useTransform } from "framer-motion";
import { useParams } from "react-router-dom";
import { 
  Flag, 
  Star, 
  Lock, 
  Play, 
  CheckCircle, 
  Trophy, 
  Zap, 
  Crown,
  Target,
  Flame,
  BookOpen,
  Clock,
  Users
} from "lucide-react";

import { useCourse } from "@/hooks/use-course";
import { useCourseLevels } from "@/hooks/use-level";
import { useCourseChapters } from "@/hooks/use-chapter";
import { useCourseProgress } from "@/hooks/use-progress";
import { Level } from "@/services/level-service";
import { Chapter } from "@/services/chapter-service";
import { Card } from "@/components/ui/Card";
import Badge from "@/components/ui/Badge";
import Button from "@/components/ui/Button";
import ProgressRing from "@/components/ui/ProgressRing";
import { cn } from "@/lib/utils/class.utils";
import { formatDate } from "@/lib/utils/class.utils";

interface LevelWithChapter extends Level {
  chapter: Chapter;
  isChapterEnd: boolean;
  levelIndex: number;
  isCompleted: boolean;
  isUnlocked: boolean;
  stars: number;
}

export function CourseDetailPage() {
  const { courseId } = useParams<{ courseId: string }>();
  const [loading, course, error] = useCourse(courseId!);
  const [levelsLoading, levels] = useCourseLevels(courseId!);
  const [chaptersLoading, chapters] = useCourseChapters(courseId!);
  const [progressLoading, progress] = useCourseProgress(courseId!);

  const { scrollY } = useScroll();
  const pathOffset = useTransform(scrollY, [0, 2000], [0, 100]);

  if (loading || levelsLoading || chaptersLoading || progressLoading) {
    return (
      <div className="min-h-screen bg-gradient-to-b from-primary-50 via-background to-accent-50 dark:from-gray-900 dark:via-gray-800 dark:to-gray-900">
        <div className="max-w-4xl mx-auto px-4 py-8">
          {/* Header Skeleton */}
          <div className="animate-pulse mb-12">
            <div className="h-64 bg-gradient-to-r from-gray-200 to-gray-300 dark:from-gray-700 dark:to-gray-600 rounded-3xl mb-6"></div>
            <div className="h-8 bg-gray-200 dark:bg-gray-700 rounded-xl mb-4 w-3/4"></div>
            <div className="h-4 bg-gray-200 dark:bg-gray-700 rounded-lg w-1/2"></div>
          </div>

          {/* Path Skeleton */}
          <div className="space-y-8">
            {[1, 2, 3, 4, 5].map((i) => (
              <div key={i} className="flex items-center space-x-6">
                <div className="w-16 h-16 bg-gray-200 dark:bg-gray-700 rounded-full animate-pulse"></div>
                <div className="flex-1">
                  <div className="h-6 bg-gray-200 dark:bg-gray-700 rounded-lg mb-2 w-1/3"></div>
                  <div className="h-4 bg-gray-200 dark:bg-gray-700 rounded-lg w-2/3"></div>
                </div>
              </div>
            ))}
          </div>
        </div>
      </div>
    );
  }

  if (error || !course) {
    return (
      <div className="min-h-screen bg-gradient-to-b from-error-50 to-background dark:from-gray-900 dark:to-gray-800 flex items-center justify-center">
        <Card className="max-w-md mx-auto text-center">
          <div className="p-8">
            <div className="w-16 h-16 bg-error-100 dark:bg-error-900/30 rounded-full flex items-center justify-center mx-auto mb-4">
              <BookOpen className="w-8 h-8 text-error-600 dark:text-error-400" />
            </div>
            <h1 className="text-2xl font-bold text-error-600 dark:text-error-400 mb-2">
              Course Not Found
            </h1>
            <p className="text-gray-600 dark:text-gray-400 mb-6">
              {error || "The course you're looking for doesn't exist."}
            </p>
            <Button variant="primary" as="a" href="/courses">
              Browse Courses
            </Button>
          </div>
        </Card>
      </div>
    );
  }

  // Combine levels with their chapters and create the path
  const levelPath: LevelWithChapter[] = [];
  let levelIndex = 0;

  chapters
    .sort((a, b) => a.order - b.order)
    .forEach((chapter) => {
      const chapterLevels = levels
        .filter((level) => level.chapterId === chapter._id)
        .sort((a, b) => a.order - b.order);

      chapterLevels.forEach((level, index) => {
        const isChapterEnd = index === chapterLevels.length - 1;
        const isCompleted = progress?.levelProgress?.some(
          (lp) => lp.levelId === level._id && lp.completed
        ) || false;
        const isUnlocked = levelIndex === 0 || levelPath[levelIndex - 1]?.isCompleted || false;
        const levelProgress = progress?.levelProgress?.find(
          (lp) => lp.levelId === level._id
        );
        const stars = levelProgress?.score ? Math.min(3, Math.floor(levelProgress.score / 33.33)) : 0;

        levelPath.push({
          ...level,
          chapter,
          isChapterEnd,
          levelIndex,
          isCompleted,
          isUnlocked,
          stars,
        });
        levelIndex++;
      });
    });

  const courseProgress = progress ? 
    Math.round((progress.completedLevels / progress.totalLevels) * 100) : 0;

  const thumbnailUrl = course.thumbnailId 
    ? `https://images.pexels.com/photos/${course.thumbnailId}/pexels-photo-${course.thumbnailId}.jpeg?auto=compress&cs=tinysrgb&w=800&h=400&fit=crop`
    : `https://images.pexels.com/photos/4144923/pexels-photo-4144923.jpeg?auto=compress&cs=tinysrgb&w=800&h=400&fit=crop`;

  return (
    <div className="min-h-screen bg-gradient-to-b from-primary-50 via-background to-accent-50 dark:from-gray-900 dark:via-gray-800 dark:to-gray-900 relative overflow-hidden">
      {/* Animated Background Elements */}
      <div className="absolute inset-0 overflow-hidden pointer-events-none">
        <motion.div
          className="absolute top-20 left-10 w-4 h-4 bg-primary-400/30 rounded-full"
          animate={{ y: [0, -20, 0], opacity: [0.3, 0.7, 0.3] }}
          transition={{ duration: 3, repeat: Infinity }}
        />
        <motion.div
          className="absolute top-40 right-20 w-6 h-6 bg-accent-400/30 rounded-full"
          animate={{ y: [0, -30, 0], opacity: [0.3, 0.8, 0.3] }}
          transition={{ duration: 4, repeat: Infinity, delay: 1 }}
        />
        <motion.div
          className="absolute bottom-40 left-1/4 w-3 h-3 bg-secondary-400/30 rounded-full"
          animate={{ y: [0, -15, 0], opacity: [0.3, 0.6, 0.3] }}
          transition={{ duration: 2.5, repeat: Infinity, delay: 2 }}
        />
      </div>

      <div className="max-w-4xl mx-auto px-4 py-8 relative z-10">

        {levels.length}
        {/* Course Header */}
        <motion.div
          initial={{ opacity: 0, y: -50 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ duration: 0.8 }}
          className="mb-12"
        >
          <Card variant="gradient" className="overflow-hidden border-0 shadow-2xl shadow-primary-500/20">
            {/* Hero Image */}
            <div className="relative h-64 bg-gradient-to-r from-primary-600 via-purple-600 to-accent-600">
              <img
                src={thumbnailUrl}
                alt={course.title}
                className="w-full h-full object-cover mix-blend-overlay opacity-80"
              />
              
              {/* Overlay Content */}
              <div className="absolute inset-0 bg-gradient-to-t from-black/60 via-transparent to-transparent flex items-end">
                <div className="p-8 text-white w-full">
                  <div className="flex flex-wrap gap-2 mb-4">
                    <Badge variant="neon" size="sm">
                      {course.lang.toUpperCase()}
                    </Badge>
                    <Badge variant="gradient" size="sm">
                      {course.category}
                    </Badge>
                    <Badge variant="outline" size="sm" className="text-white border-white/50">
                      {course.chaptersCount} Chapters
                    </Badge>
                  </div>
                  
                  <h1 className="text-4xl font-bold mb-3 text-shadow-lg">
                    {course.title}
                  </h1>
                  <p className="text-lg text-gray-200 mb-4 max-w-2xl">
                    {course.description}
                  </p>
                  
                  <div className="flex items-center space-x-6 text-sm">
                    <div className="flex items-center space-x-2">
                      <Users className="w-4 h-4" />
                      <span>By {course.author}</span>
                    </div>
                    <div className="flex items-center space-x-2">
                      <Clock className="w-4 h-4" />
                      <span>{formatDate(course.createdAt)}</span>
                    </div>
                  </div>
                </div>
              </div>

              {/* Progress Ring */}
              <div className="absolute top-6 right-6">
                <ProgressRing 
                  progress={courseProgress} 
                  size={80} 
                  strokeWidth={6}
                  glow={courseProgress > 50}
                  variant={courseProgress > 75 ? "rainbow" : "neon"}
                >
                  <div className="text-center">
                    <div className="text-lg font-bold text-white">{courseProgress}%</div>
                    <div className="text-xs text-gray-200">Complete</div>
                  </div>
                </ProgressRing>
              </div>
            </div>
          </Card>
        </motion.div>

        {/* Learning Path */}
        <div className="relative">
          {/* Animated Path Line */}
          <motion.div
            className="absolute left-8 top-0 bottom-0 w-1 bg-gradient-to-b from-primary-500 via-purple-500 to-accent-500 rounded-full shadow-lg shadow-primary-500/50"
            style={{
              background: `linear-gradient(to bottom, 
                #A042FF 0%, 
                #8A2BE2 25%, 
                #F59E0B 50%, 
                #10B981 75%, 
                #06B6D4 100%)`
            }}
          />

          {/* Animated Path Glow */}
          <motion.div
            className="absolute left-7 top-0 w-3 h-full bg-gradient-to-b from-primary-400/50 via-purple-400/50 to-accent-400/50 rounded-full blur-sm"
            animate={{ opacity: [0.5, 1, 0.5] }}
            transition={{ duration: 2, repeat: Infinity }}
          />

          {/* Level Nodes */}
          <div className="space-y-8 relative z-10">
            {levelPath.map((level, index) => (
              <motion.div
                key={level._id}
                initial={{ opacity: 0, x: -50 }}
                animate={{ opacity: 1, x: 0 }}
                transition={{ delay: index * 0.1, duration: 0.6 }}
                className="relative"
              >
                {/* Level Node */}
                <div className="flex items-center space-x-6">
                  {/* Node Circle */}
                  <motion.div
                    className={cn(
                      "relative w-16 h-16 rounded-full flex items-center justify-center shadow-lg transition-all duration-300 z-20",
                      level.isCompleted
                        ? "bg-gradient-to-br from-success-400 to-success-600 shadow-success-500/50"
                        : level.isUnlocked
                        ? "bg-gradient-to-br from-primary-500 to-purple-600 shadow-primary-500/50 hover:scale-110 cursor-pointer"
                        : "bg-gradient-to-br from-gray-400 to-gray-600 shadow-gray-500/30"
                    )}
                    whileHover={level.isUnlocked ? { scale: 1.1 } : {}}
                    whileTap={level.isUnlocked ? { scale: 0.95 } : {}}
                  >
                    {level.isCompleted ? (
                      <CheckCircle className="w-8 h-8 text-white" />
                    ) : level.isUnlocked ? (
                      <Play className="w-8 h-8 text-white" />
                    ) : (
                      <Lock className="w-8 h-8 text-white" />
                    )}

                    {/* Level Number */}
                    <div className="absolute -top-2 -right-2 w-6 h-6 bg-white dark:bg-gray-800 rounded-full flex items-center justify-center text-xs font-bold text-gray-700 dark:text-gray-300 border-2 border-gray-200 dark:border-gray-600">
                      {level.levelIndex + 1}
                    </div>

                    {/* Stars */}
                    {level.isCompleted && level.stars > 0 && (
                      <div className="absolute -bottom-2 left-1/2 transform -translate-x-1/2 flex space-x-1">
                        {[1, 2, 3].map((star) => (
                          <Star
                            key={star}
                            className={cn(
                              "w-3 h-3",
                              star <= level.stars
                                ? "text-yellow-400 fill-current"
                                : "text-gray-300"
                            )}
                          />
                        ))}
                      </div>
                    )}

                    {/* Glow Effect for Active Level */}
                    {level.isUnlocked && !level.isCompleted && (
                      <motion.div
                        className="absolute inset-0 rounded-full bg-primary-400/30"
                        animate={{ scale: [1, 1.3, 1], opacity: [0.5, 0, 0.5] }}
                        transition={{ duration: 2, repeat: Infinity }}
                      />
                    )}
                  </motion.div>

                  {/* Level Content */}
                  <div className="flex-1">
                    <Card 
                      className={cn(
                        "transition-all duration-300",
                        level.isUnlocked ? "hover:shadow-lg cursor-pointer" : "opacity-75"
                      )}
                      hoverable={level.isUnlocked}
                    >
                      <div className="p-4">
                        <div className="flex items-start justify-between mb-2">
                          <div>
                            <h3 className="text-lg font-bold text-gray-900 dark:text-gray-100 mb-1">
                              {level.title}
                            </h3>
                            <p className="text-sm text-gray-600 dark:text-gray-400 mb-2">
                              {level.description}
                            </p>
                            <div className="flex items-center space-x-2">
                              <Badge variant="secondary" size="sm">
                                {level.chapter.title}
                              </Badge>
                              <Badge variant="outline" size="sm">
                                {level.questions.length} Questions
                              </Badge>
                            </div>
                          </div>

                          {level.isUnlocked && (
                            <Button
                              variant={level.isCompleted ? "success" : "primary"}
                              size="sm"
                              className="shrink-0"
                            >
                              {level.isCompleted ? (
                                <>
                                  <Trophy className="w-4 h-4 mr-2" />
                                  Review
                                </>
                              ) : (
                                <>
                                  <Play className="w-4 h-4 mr-2" />
                                  Start
                                </>
                              )}
                            </Button>
                          )}
                        </div>
                      </div>
                    </Card>
                  </div>
                </div>

                {/* Chapter End Flag */}
                {level.isChapterEnd && (
                  <motion.div
                    initial={{ opacity: 0, scale: 0 }}
                    animate={{ opacity: 1, scale: 1 }}
                    transition={{ delay: (index * 0.1) + 0.3, duration: 0.5 }}
                    className="absolute left-12 -bottom-4 z-30"
                  >
                    <div className="relative">
                      {/* Flag Pole */}
                      <div className="w-1 h-12 bg-gradient-to-b from-yellow-400 to-orange-500 rounded-full shadow-lg"></div>
                      
                      {/* Flag */}
                      <motion.div
                        className="absolute top-0 left-1 w-16 h-8 bg-gradient-to-r from-yellow-400 to-orange-500 rounded-r-lg shadow-lg flex items-center justify-center"
                        animate={{ x: [0, 2, 0] }}
                        transition={{ duration: 2, repeat: Infinity }}
                      >
                        <Crown className="w-4 h-4 text-white" />
                      </motion.div>

                      {/* Chapter Complete Badge */}
                      <div className="absolute -bottom-8 left-1/2 transform -translate-x-1/2 whitespace-nowrap">
                        <Badge variant="gradient" size="sm" className="shadow-lg">
                          <Flag className="w-3 h-3 mr-1" />
                          Chapter Complete!
                        </Badge>
                      </div>

                      {/* Celebration Particles */}
                      {level.isCompleted && (
                        <>
                          <motion.div
                            className="absolute top-2 -left-2 w-2 h-2 bg-yellow-400 rounded-full"
                            animate={{ 
                              y: [0, -20, 0], 
                              opacity: [1, 0, 1],
                              scale: [1, 0.5, 1]
                            }}
                            transition={{ duration: 2, repeat: Infinity }}
                          />
                          <motion.div
                            className="absolute top-1 -right-2 w-1.5 h-1.5 bg-orange-400 rounded-full"
                            animate={{ 
                              y: [0, -15, 0], 
                              opacity: [1, 0, 1],
                              scale: [1, 0.5, 1]
                            }}
                            transition={{ duration: 1.5, repeat: Infinity, delay: 0.5 }}
                          />
                        </>
                      )}
                    </div>
                  </motion.div>
                )}
              </motion.div>
            ))}
          </div>

          {/* Course Completion Celebration */}
          {courseProgress === 100 && (
            <motion.div
              initial={{ opacity: 0, scale: 0 }}
              animate={{ opacity: 1, scale: 1 }}
              transition={{ delay: 1, duration: 0.8 }}
              className="mt-12 text-center"
            >
              <Card variant="gradient" className="bg-gradient-to-r from-yellow-400 via-orange-500 to-red-500 text-white border-0 shadow-2xl shadow-orange-500/50">
                <div className="p-8">
                  <motion.div
                    animate={{ rotate: [0, 10, -10, 0] }}
                    transition={{ duration: 2, repeat: Infinity }}
                    className="w-20 h-20 bg-white/20 rounded-full flex items-center justify-center mx-auto mb-4"
                  >
                    <Trophy className="w-12 h-12 text-white" />
                  </motion.div>
                  <h2 className="text-3xl font-bold mb-2">Congratulations!</h2>
                  <p className="text-lg text-white/90 mb-4">
                    You've completed the entire course!
                  </p>
                  <div className="flex items-center justify-center space-x-4">
                    <Badge variant="neon" size="lg">
                      <Flame className="w-4 h-4 mr-2" />
                      Course Master
                    </Badge>
                    <Badge variant="outline" size="lg" className="text-white border-white/50">
                      <Zap className="w-4 h-4 mr-2" />
                      {progress?.totalScore || 0} XP Earned
                    </Badge>
                  </div>
                </div>
              </Card>
            </motion.div>
          )}
        </div>
      </div>
    </div>
  );
}

export default CourseDetailPage;