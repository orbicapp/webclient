import { motion, useScroll, useTransform } from "framer-motion";
import { useParams } from "react-router-dom";
import { 
  BookOpen,
  Clock,
  Users,
  Star,
  Trophy,
  Zap,
  Crown,
  Target,
  Flame,
  Shield,
  Gem
} from "lucide-react";

import { useCourse } from "@/hooks/use-course";
import { useCourseLevels } from "@/hooks/use-level";
import { useCourseChapters } from "@/hooks/use-chapter";
import { useCourseProgress } from "@/hooks/use-progress";
import { useCoursePath, useCourseStats } from "@/hooks/use-course-path";
import { Card } from "@/components/ui/Card";
import Badge from "@/components/ui/Badge";
import Button from "@/components/ui/Button";
import ProgressRing from "@/components/ui/ProgressRing";
import { GamePath } from "@/components/course/GamePath";
import { cn } from "@/lib/utils/class.utils";
import { formatDate } from "@/lib/utils/class.utils";

export function CourseDetailPage() {
  const { courseId } = useParams<{ courseId: string }>();
  const [loading, course, error] = useCourse(courseId!);
  const [levelsLoading, levels] = useCourseLevels(courseId!);
  const [chaptersLoading, chapters] = useCourseChapters(courseId!);
  const [progressLoading, progress] = useCourseProgress(courseId!);

  const { scrollY } = useScroll();
  const headerOpacity = useTransform(scrollY, [0, 300], [1, 0]);
  const headerScale = useTransform(scrollY, [0, 300], [1, 0.8]);

  // Use the custom hook to calculate the level path
  const levelPath = useCoursePath({ 
    chapters: chapters || [], 
    levels: levels || [], 
    progress 
  });

  // Get course statistics
  const courseStats = useCourseStats(levelPath);

  const handleLevelClick = (level: any) => {
    console.log("Level clicked:", level);
    // TODO: Navigate to level or start game session
  };

  if (loading || levelsLoading || chaptersLoading || progressLoading) {
    return (
      <div className="min-h-screen bg-gradient-to-b from-indigo-900 via-purple-900 to-pink-900">
        {/* Epic loading screen */}
        <div className="flex items-center justify-center min-h-screen">
          <motion.div
            className="text-center"
            initial={{ opacity: 0, scale: 0.5 }}
            animate={{ opacity: 1, scale: 1 }}
            transition={{ duration: 0.8 }}
          >
            <motion.div
              className="w-32 h-32 bg-gradient-to-r from-blue-500 via-purple-500 to-pink-500 rounded-full flex items-center justify-center mx-auto mb-8 shadow-2xl shadow-purple-500/50"
              animate={{
                rotate: 360,
                scale: [1, 1.1, 1],
              }}
              transition={{
                rotate: { duration: 2, repeat: Infinity, ease: "linear" },
                scale: { duration: 1.5, repeat: Infinity },
              }}
            >
              <Rocket className="w-16 h-16 text-white" />
            </motion.div>
            
            <motion.h1
              className="text-4xl font-bold text-white mb-4"
              animate={{ opacity: [0.5, 1, 0.5] }}
              transition={{ duration: 2, repeat: Infinity }}
            >
              Loading Adventure...
            </motion.h1>
            
            <motion.div
              className="flex justify-center space-x-2"
              initial={{ opacity: 0 }}
              animate={{ opacity: 1 }}
              transition={{ delay: 0.5 }}
            >
              {[0, 1, 2].map((i) => (
                <motion.div
                  key={i}
                  className="w-3 h-3 bg-white rounded-full"
                  animate={{
                    scale: [1, 1.5, 1],
                    opacity: [0.5, 1, 0.5],
                  }}
                  transition={{
                    duration: 1,
                    repeat: Infinity,
                    delay: i * 0.2,
                  }}
                />
              ))}
            </motion.div>
          </motion.div>
        </div>
      </div>
    );
  }

  if (error || !course) {
    return (
      <div className="min-h-screen bg-gradient-to-b from-red-900 via-pink-900 to-purple-900 flex items-center justify-center">
        <Card className="max-w-md mx-auto text-center" variant="glass">
          <div className="p-8">
            <motion.div
              className="w-16 h-16 bg-red-500/20 rounded-full flex items-center justify-center mx-auto mb-4"
              animate={{ scale: [1, 1.1, 1] }}
              transition={{ duration: 2, repeat: Infinity }}
            >
              <BookOpen className="w-8 h-8 text-red-400" />
            </motion.div>
            <h1 className="text-2xl font-bold text-red-400 mb-2">
              Quest Not Found
            </h1>
            <p className="text-gray-300 mb-6">
              {error || "The adventure you're looking for doesn't exist."}
            </p>
            <Button variant="primary" as="a" href="/courses" glow>
              <Target className="w-4 h-4 mr-2" />
              Explore Quests
            </Button>
          </div>
        </Card>
      </div>
    );
  }

  const thumbnailUrl = course.thumbnailId 
    ? `https://images.pexels.com/photos/${course.thumbnailId}/pexels-photo-${course.thumbnailId}.jpeg?auto=compress&cs=tinysrgb&w=1200&h=400&fit=crop`
    : `https://images.pexels.com/photos/4144923/pexels-photo-4144923.jpeg?auto=compress&cs=tinysrgb&w=1200&h=400&fit=crop`;

  return (
    <div className="min-h-screen bg-gradient-to-b from-indigo-900 via-purple-900 to-pink-900 relative overflow-hidden">
      {/* Animated background elements */}
      <div className="absolute inset-0 overflow-hidden pointer-events-none">
        {/* Floating geometric shapes */}
        {[...Array(20)].map((_, i) => (
          <motion.div
            key={i}
            className="absolute"
            style={{
              left: `${Math.random() * 100}%`,
              top: `${Math.random() * 100}%`,
            }}
            animate={{
              y: [0, -30, 0],
              x: [0, Math.random() * 20 - 10, 0],
              rotate: [0, 360],
              opacity: [0.1, 0.3, 0.1],
            }}
            transition={{
              duration: 5 + Math.random() * 5,
              repeat: Infinity,
              delay: Math.random() * 2,
            }}
          >
            <div className={cn(
              "w-4 h-4 rounded-full",
              i % 3 === 0 ? "bg-blue-400/20" : i % 3 === 1 ? "bg-purple-400/20" : "bg-pink-400/20"
            )} />
          </motion.div>
        ))}
      </div>

      {/* Epic Course Header */}
      <motion.div
        className="relative z-10"
        style={{ opacity: headerOpacity, scale: headerScale }}
      >
        <div className="relative h-96 overflow-hidden">
          {/* Background image with overlay */}
          <div className="absolute inset-0">
            <img
              src={thumbnailUrl}
              alt={course.title}
              className="w-full h-full object-cover"
            />
            <div className="absolute inset-0 bg-gradient-to-t from-black via-black/50 to-transparent" />
            <div className="absolute inset-0 bg-gradient-to-r from-indigo-900/80 via-purple-900/60 to-pink-900/80" />
          </div>
          
          {/* Animated particles overlay */}
          <div className="absolute inset-0">
            {[...Array(30)].map((_, i) => (
              <motion.div
                key={i}
                className="absolute w-1 h-1 bg-white rounded-full"
                style={{
                  left: `${Math.random() * 100}%`,
                  top: `${Math.random() * 100}%`,
                }}
                animate={{
                  opacity: [0, 1, 0],
                  scale: [0, 1, 0],
                }}
                transition={{
                  duration: 3,
                  repeat: Infinity,
                  delay: Math.random() * 3,
                }}
              />
            ))}
          </div>

          {/* Content */}
          <div className="relative z-10 h-full flex items-center">
            <div className="max-w-6xl mx-auto px-6 w-full">
              <div className="flex items-end justify-between">
                <div className="flex-1">
                  {/* Badges */}
                  <motion.div
                    className="flex flex-wrap gap-3 mb-6"
                    initial={{ opacity: 0, y: 20 }}
                    animate={{ opacity: 1, y: 0 }}
                    transition={{ delay: 0.2 }}
                  >
                    <Badge variant="neon" size="md" glow>
                      <Gem className="w-4 h-4 mr-2" />
                      {course.lang.toUpperCase()}
                    </Badge>
                    <Badge variant="gradient" size="md" glow>
                      <Shield className="w-4 h-4 mr-2" />
                      {course.category}
                    </Badge>
                    <Badge variant="outline" size="md" className="text-white border-white/50 bg-white/10 backdrop-blur-sm">
                      <Crown className="w-4 h-4 mr-2" />
                      {courseStats.totalChapters} Chapters
                    </Badge>
                    <Badge variant="outline" size="md" className="text-white border-white/50 bg-white/10 backdrop-blur-sm">
                      <Target className="w-4 h-4 mr-2" />
                      {courseStats.totalLevels} Levels
                    </Badge>
                  </motion.div>
                  
                  {/* Title */}
                  <motion.h1
                    className="text-6xl font-bold text-white mb-6 leading-tight"
                    initial={{ opacity: 0, y: 30 }}
                    animate={{ opacity: 1, y: 0 }}
                    transition={{ delay: 0.3 }}
                    style={{
                      textShadow: "0 0 30px rgba(255,255,255,0.5), 0 0 60px rgba(139,92,246,0.3)",
                    }}
                  >
                    {course.title}
                  </motion.h1>
                  
                  {/* Description */}
                  <motion.p
                    className="text-xl text-gray-200 mb-8 max-w-3xl leading-relaxed"
                    initial={{ opacity: 0, y: 20 }}
                    animate={{ opacity: 1, y: 0 }}
                    transition={{ delay: 0.4 }}
                  >
                    {course.description}
                  </motion.p>
                  
                  {/* Meta info */}
                  <motion.div
                    className="flex items-center space-x-8 text-sm text-gray-300"
                    initial={{ opacity: 0, y: 20 }}
                    animate={{ opacity: 1, y: 0 }}
                    transition={{ delay: 0.5 }}
                  >
                    <div className="flex items-center space-x-2">
                      <Users className="w-5 h-5 text-blue-400" />
                      <span>By {course.author}</span>
                    </div>
                    <div className="flex items-center space-x-2">
                      <Clock className="w-5 h-5 text-purple-400" />
                      <span>{formatDate(course.createdAt)}</span>
                    </div>
                    <div className="flex items-center space-x-2">
                      <BookOpen className="w-5 h-5 text-pink-400" />
                      <span className="capitalize">{course.visibility}</span>
                    </div>
                  </motion.div>
                </div>

                {/* Epic Progress Ring */}
                <motion.div
                  className="ml-8"
                  initial={{ opacity: 0, scale: 0 }}
                  animate={{ opacity: 1, scale: 1 }}
                  transition={{ delay: 0.6, type: "spring" }}
                >
                  <div className="relative">
                    <ProgressRing 
                      progress={courseStats.progressPercentage} 
                      size={140} 
                      strokeWidth={12}
                      glow={courseStats.progressPercentage > 50}
                      variant={courseStats.progressPercentage > 75 ? "rainbow" : "neon"}
                    >
                      <div className="text-center">
                        <div className="text-3xl font-bold text-white mb-1">
                          {courseStats.progressPercentage}%
                        </div>
                        <div className="text-sm text-gray-300">Complete</div>
                        <div className="flex items-center justify-center mt-2">
                          <Star className="w-4 h-4 text-yellow-400 mr-1" />
                          <span className="text-sm text-yellow-400 font-semibold">
                            {courseStats.totalStars}
                          </span>
                        </div>
                      </div>
                    </ProgressRing>
                    
                    {/* Floating achievement icons */}
                    {courseStats.progressPercentage > 25 && (
                      <motion.div
                        className="absolute -top-4 -right-4 w-8 h-8 bg-gradient-to-r from-yellow-400 to-orange-500 rounded-full flex items-center justify-center"
                        animate={{ 
                          rotate: [0, 360],
                          scale: [1, 1.2, 1]
                        }}
                        transition={{ 
                          rotate: { duration: 3, repeat: Infinity },
                          scale: { duration: 2, repeat: Infinity }
                        }}
                      >
                        <Flame className="w-4 h-4 text-white" />
                      </motion.div>
                    )}
                    
                    {courseStats.progressPercentage > 75 && (
                      <motion.div
                        className="absolute -bottom-4 -left-4 w-8 h-8 bg-gradient-to-r from-purple-500 to-pink-500 rounded-full flex items-center justify-center"
                        animate={{ 
                          scale: [1, 1.3, 1],
                          opacity: [0.8, 1, 0.8]
                        }}
                        transition={{ duration: 1.5, repeat: Infinity }}
                      >
                        <Trophy className="w-4 h-4 text-white" />
                      </motion.div>
                    )}
                  </div>
                </motion.div>
              </div>
            </div>
          </div>
        </div>
      </motion.div>

      {/* Course Stats Dashboard */}
      {levelPath.length > 0 && (
        <motion.div
          className="relative z-10 -mt-20 mx-6"
          initial={{ opacity: 0, y: 50 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ delay: 0.7 }}
        >
          <Card variant="glass" className="max-w-6xl mx-auto bg-black/40 backdrop-blur-xl border-white/20">
            <div className="grid grid-cols-2 md:grid-cols-4 gap-6 text-center p-6">
              <motion.div
                whileHover={{ scale: 1.05 }}
                className="p-4 rounded-xl bg-gradient-to-br from-blue-500/20 to-purple-500/20 border border-blue-500/30"
              >
                <div className="text-3xl font-bold text-blue-400 mb-2 flex items-center justify-center">
                  <Target className="w-6 h-6 mr-2" />
                  {courseStats.completedLevels}
                </div>
                <div className="text-sm text-gray-300">
                  of {courseStats.totalLevels} Levels
                </div>
              </motion.div>
              
              <motion.div
                whileHover={{ scale: 1.05 }}
                className="p-4 rounded-xl bg-gradient-to-br from-purple-500/20 to-pink-500/20 border border-purple-500/30"
              >
                <div className="text-3xl font-bold text-purple-400 mb-2 flex items-center justify-center">
                  <Crown className="w-6 h-6 mr-2" />
                  {courseStats.completedChapters}
                </div>
                <div className="text-sm text-gray-300">
                  of {courseStats.totalChapters} Chapters
                </div>
              </motion.div>
              
              <motion.div
                whileHover={{ scale: 1.05 }}
                className="p-4 rounded-xl bg-gradient-to-br from-yellow-500/20 to-orange-500/20 border border-yellow-500/30"
              >
                <div className="text-3xl font-bold text-yellow-400 mb-2 flex items-center justify-center">
                  <Star className="w-6 h-6 mr-2" />
                  {courseStats.totalStars}
                </div>
                <div className="text-sm text-gray-300">
                  of {courseStats.maxPossibleStars} Stars
                </div>
              </motion.div>
              
              <motion.div
                whileHover={{ scale: 1.05 }}
                className="p-4 rounded-xl bg-gradient-to-br from-green-500/20 to-emerald-500/20 border border-green-500/30"
              >
                <div className="text-3xl font-bold text-green-400 mb-2 flex items-center justify-center">
                  <Zap className="w-6 h-6 mr-2" />
                  {courseStats.progressPercentage}%
                </div>
                <div className="text-sm text-gray-300">
                  Complete
                </div>
              </motion.div>
            </div>
          </Card>
        </motion.div>
      )}

      {/* Game Path */}
      <div className="relative z-10 mt-12">
        {levelPath.length === 0 ? (
          <motion.div
            className="max-w-4xl mx-auto px-6"
            initial={{ opacity: 0, y: 50 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ delay: 0.8 }}
          >
            <Card variant="glass" className="text-center py-16 bg-black/40 backdrop-blur-xl border-white/20">
              <motion.div
                className="w-24 h-24 bg-gradient-to-br from-gray-500 to-gray-700 rounded-full flex items-center justify-center mx-auto mb-6"
                animate={{ 
                  scale: [1, 1.1, 1],
                  opacity: [0.7, 1, 0.7]
                }}
                transition={{ duration: 2, repeat: Infinity }}
              >
                <BookOpen className="w-12 h-12 text-gray-300" />
              </motion.div>
              <h3 className="text-2xl font-bold text-white mb-4">
                Adventure Coming Soon
              </h3>
              <p className="text-gray-300 mb-6 max-w-md mx-auto">
                This quest doesn't have any chapters or levels yet. The adventure is being prepared!
              </p>
              <Button variant="primary" glow>
                <Target className="w-4 h-4 mr-2" />
                Explore Other Quests
              </Button>
            </Card>
          </motion.div>
        ) : (
          <GamePath levelPath={levelPath} onLevelClick={handleLevelClick} />
        )}
      </div>

      {/* Course Completion Celebration */}
      {courseStats.isCompleted && (
        <motion.div
          className="fixed inset-0 z-50 flex items-center justify-center bg-black/80 backdrop-blur-sm"
          initial={{ opacity: 0 }}
          animate={{ opacity: 1 }}
          transition={{ delay: 2 }}
        >
          <motion.div
            className="text-center"
            initial={{ scale: 0, rotate: -180 }}
            animate={{ scale: 1, rotate: 0 }}
            transition={{ type: "spring", duration: 1 }}
          >
            <motion.div
              className="w-32 h-32 bg-gradient-to-r from-yellow-400 via-orange-500 to-red-500 rounded-full flex items-center justify-center mx-auto mb-8 shadow-2xl shadow-orange-500/50"
              animate={{
                rotate: [0, 360],
                scale: [1, 1.2, 1],
              }}
              transition={{
                rotate: { duration: 3, repeat: Infinity },
                scale: { duration: 2, repeat: Infinity },
              }}
            >
              <Trophy className="w-16 h-16 text-white" />
            </motion.div>
            
            <h2 className="text-6xl font-bold text-white mb-4">
              QUEST COMPLETED!
            </h2>
            <p className="text-2xl text-gray-300 mb-8">
              You are now a master of {course.title}!
            </p>
            
            <div className="flex items-center justify-center space-x-6">
              <Badge variant="neon" size="lg" glow>
                <Crown className="w-5 h-5 mr-2" />
                Quest Master
              </Badge>
              <Badge variant="gradient" size="lg" glow>
                <Zap className="w-5 h-5 mr-2" />
                {progress?.totalScore || 0} XP Earned
              </Badge>
            </div>
          </motion.div>
        </motion.div>
      )}
    </div>
  );
}

export default CourseDetailPage;