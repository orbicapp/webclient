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
  Rocket,
  Gem,
  Lock,
  Play,
  UserPlus
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
  
  // Sticky panel transforms - More dramatic scaling
  const panelScale = useTransform(scrollY, [300, 600], [1, 0.7]);
  const panelHeight = useTransform(scrollY, [300, 600], [1, 0.6]);
  const panelWidth = useTransform(scrollY, [300, 600], [1, 0.8]);

  // ✅ Check if user is enrolled (has progress)
  const isEnrolled = progress && progress.levelProgress && progress.levelProgress.length > 0;

  // Use the custom hook to calculate the level path
  const levelPath = useCoursePath({ 
    chapters: chapters || [], 
    levels: levels || [], 
    progress: isEnrolled ? progress : null // ✅ Only pass progress if enrolled
  });

  // Get course statistics
  const courseStats = useCourseStats(levelPath);

  const handleLevelClick = (level: any) => {
    if (!isEnrolled) {
      // Show join course modal or redirect to enrollment
      console.log("User needs to join course first");
      return;
    }
    console.log("Level clicked:", level);
    // TODO: Navigate to level or start game session
  };

  const handleJoinCourse = async () => {
    console.log("Joining course:", courseId);
    // TODO: Implement course enrollment logic
    // This would typically call an API to enroll the user
    // and then refresh the progress data
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
      <div className="min-h-screen bg-gradient-to-b from-red-900 via-pink-900 to-purple-900 flex items-center justify-center p-4">
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

      {/* Epic Course Header - Full Width and Responsive */}
      <motion.div
        className="relative z-10 w-full"
        style={{ opacity: headerOpacity, scale: headerScale }}
      >
        <div className="relative h-96 md:h-[500px] overflow-hidden w-full">
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
                  delay: i * 0.3,
                }}
              />
            ))}
          </div>

          {/* Content - Properly centered */}
          <div className="relative z-10 h-full flex items-center">
            <div className="w-full px-4 sm:px-6 lg:px-8 max-w-7xl mx-auto">
              <div className="flex flex-col lg:flex-row items-end justify-between">
                <div className="flex-1 mb-8 lg:mb-0">
                  {/* Badges */}
                  <motion.div
                    className="flex flex-wrap gap-2 sm:gap-3 mb-4 sm:mb-6"
                    initial={{ opacity: 0, y: 20 }}
                    animate={{ opacity: 1, y: 0 }}
                    transition={{ delay: 0.2 }}
                  >
                    <Badge variant="neon" size="md" glow>
                      <Gem className="w-3 h-3 sm:w-4 sm:h-4 mr-1 sm:mr-2" />
                      {course.lang.toUpperCase()}
                    </Badge>
                    <Badge variant="gradient" size="md" glow>
                      <Shield className="w-3 h-3 sm:w-4 sm:h-4 mr-1 sm:mr-2" />
                      {course.category}
                    </Badge>
                    <Badge variant="outline" size="md" className="text-white border-white/50 bg-white/10 backdrop-blur-sm">
                      <Crown className="w-3 h-3 sm:w-4 sm:h-4 mr-1 sm:mr-2" />
                      {courseStats.totalChapters} Chapters
                    </Badge>
                    <Badge variant="outline" size="md" className="text-white border-white/50 bg-white/10 backdrop-blur-sm">
                      <Target className="w-3 h-3 sm:w-4 sm:h-4 mr-1 sm:mr-2" />
                      {courseStats.totalLevels} Levels
                    </Badge>
                    
                    {/* ✅ Preview/Enrolled Badge */}
                    {!isEnrolled && (
                      <Badge variant="warning" size="md" glow>
                        <Lock className="w-3 h-3 sm:w-4 sm:h-4 mr-1 sm:mr-2" />
                        Preview Mode
                      </Badge>
                    )}
                  </motion.div>
                  
                  {/* Title */}
                  <motion.h1
                    className="text-3xl sm:text-4xl md:text-5xl lg:text-6xl font-bold text-white mb-4 sm:mb-6 leading-tight"
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
                    className="text-lg sm:text-xl text-gray-200 mb-6 sm:mb-8 max-w-3xl leading-relaxed"
                    initial={{ opacity: 0, y: 20 }}
                    animate={{ opacity: 1, y: 0 }}
                    transition={{ delay: 0.4 }}
                  >
                    {course.description}
                  </motion.p>
                  
                  {/* Meta info */}
                  <motion.div
                    className="flex flex-col sm:flex-row sm:items-center sm:space-x-8 space-y-2 sm:space-y-0 text-sm text-gray-300"
                    initial={{ opacity: 0, y: 20 }}
                    animate={{ opacity: 1, y: 0 }}
                    transition={{ delay: 0.5 }}
                  >
                    <div className="flex items-center space-x-2">
                      <Users className="w-4 h-4 sm:w-5 sm:h-5 text-blue-400" />
                      <span>By {course.author}</span>
                    </div>
                    <div className="flex items-center space-x-2">
                      <Clock className="w-4 h-4 sm:w-5 sm:h-5 text-purple-400" />
                      <span>{formatDate(course.createdAt)}</span>
                    </div>
                    <div className="flex items-center space-x-2">
                      <BookOpen className="w-4 h-4 sm:w-5 sm:h-5 text-pink-400" />
                      <span className="capitalize">{course.visibility}</span>
                    </div>
                  </motion.div>
                </div>

                {/* Epic Progress Ring or Join Button */}
                <motion.div
                  className="lg:ml-8"
                  initial={{ opacity: 0, scale: 0 }}
                  animate={{ opacity: 1, scale: 1 }}
                  transition={{ delay: 0.6, type: "spring" }}
                >
                  {isEnrolled ? (
                    // ✅ Show progress ring if enrolled
                    <div className="relative">
                      <ProgressRing 
                        progress={courseStats.progressPercentage} 
                        size={120} 
                        strokeWidth={10}
                        glow={courseStats.progressPercentage > 50}
                        variant={courseStats.progressPercentage > 75 ? "rainbow" : "neon"}
                      >
                        <div className="text-center">
                          <div className="text-2xl sm:text-3xl font-bold text-white mb-1">
                            {courseStats.progressPercentage}%
                          </div>
                          <div className="text-xs sm:text-sm text-gray-300">Complete</div>
                          <div className="flex items-center justify-center mt-2">
                            <Star className="w-3 h-3 sm:w-4 sm:h-4 text-yellow-400 mr-1" />
                            <span className="text-xs sm:text-sm text-yellow-400 font-semibold">
                              {courseStats.totalStars}
                            </span>
                          </div>
                        </div>
                      </ProgressRing>
                      
                      {/* Floating achievement icons */}
                      {courseStats.progressPercentage > 25 && (
                        <motion.div
                          className="absolute -top-4 -right-4 w-6 h-6 sm:w-8 sm:h-8 bg-gradient-to-r from-yellow-400 to-orange-500 rounded-full flex items-center justify-center"
                          animate={{ 
                            rotate: [0, 360],
                            scale: [1, 1.2, 1]
                          }}
                          transition={{ 
                            rotate: { duration: 3, repeat: Infinity },
                            scale: { duration: 2, repeat: Infinity }
                          }}
                        >
                          <Flame className="w-3 h-3 sm:w-4 sm:h-4 text-white" />
                        </motion.div>
                      )}
                      
                      {courseStats.progressPercentage > 75 && (
                        <motion.div
                          className="absolute -bottom-4 -left-4 w-6 h-6 sm:w-8 sm:h-8 bg-gradient-to-r from-purple-500 to-pink-500 rounded-full flex items-center justify-center"
                          animate={{ 
                            scale: [1, 1.3, 1],
                            opacity: [0.8, 1, 0.8]
                          }}
                          transition={{ duration: 1.5, repeat: Infinity }}
                        >
                          <Trophy className="w-3 h-3 sm:w-4 sm:h-4 text-white" />
                        </motion.div>
                      )}
                    </div>
                  ) : (
                    // ✅ Show join button if not enrolled
                    <div className="text-center">
                      <motion.div
                        className="w-32 h-32 bg-gradient-to-br from-orange-500 via-red-500 to-pink-500 rounded-full flex items-center justify-center mx-auto mb-4 shadow-2xl shadow-orange-500/50 border-4 border-white/20"
                        animate={{ 
                          scale: [1, 1.05, 1],
                          boxShadow: [
                            "0 0 20px rgba(249, 115, 22, 0.5)",
                            "0 0 40px rgba(249, 115, 22, 0.8)",
                            "0 0 20px rgba(249, 115, 22, 0.5)"
                          ]
                        }}
                        transition={{ duration: 2, repeat: Infinity }}
                      >
                        <Lock className="w-16 h-16 text-white" />
                      </motion.div>
                      
                      <Button
                        onClick={handleJoinCourse}
                        size="lg"
                        className="bg-gradient-to-r from-orange-500 via-red-500 to-pink-500 hover:from-orange-600 hover:via-red-600 hover:to-pink-600 text-white font-bold px-8 py-4 rounded-2xl shadow-2xl shadow-orange-500/50 hover:shadow-orange-500/70 transition-all duration-300"
                        leftIcon={<UserPlus className="w-5 h-5" />}
                        glow
                      >
                        Join Course
                      </Button>
                      
                      <p className="text-white/70 text-sm mt-2">
                        Start your learning journey
                      </p>
                    </div>
                  )}
                </motion.div>
              </div>
            </div>
          </div>
        </div>
      </motion.div>

      {/* Course Stats Dashboard - Sticky Floating Island */}
      {levelPath.length > 0 && (
        <motion.div
          className="sticky top-4 z-40 flex justify-center px-4"
          style={{ 
            scale: panelScale,
            scaleY: panelHeight,
            scaleX: panelWidth
          }}
          initial={{ opacity: 0, y: 50 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ delay: 0.7 }}
        >
          <Card variant="glass" className="bg-black/50 backdrop-blur-xl border-white/20 shadow-2xl rounded-2xl overflow-hidden">
            <div className="p-2 sm:p-4">
              {/* ✅ Title based on enrollment status */}
              <div className="text-center mb-3">
                <h3 className="text-sm sm:text-base font-bold text-white flex items-center justify-center space-x-2">
                  {isEnrolled ? (
                    <>
                      <Trophy className="w-4 h-4 text-yellow-400" />
                      <span>Your Progress</span>
                    </>
                  ) : (
                    <>
                      <BookOpen className="w-4 h-4 text-blue-400" />
                      <span>Course Preview</span>
                    </>
                  )}
                </h3>
              </div>
              
              <div className="grid grid-cols-4 gap-1 sm:gap-3 text-center">
                <motion.div
                  whileHover={{ scale: 1.05 }}
                  className="p-1 sm:p-3 rounded-lg bg-gradient-to-br from-blue-500/20 to-purple-500/20 border border-blue-500/30"
                >
                  <div className="text-sm sm:text-2xl font-bold text-blue-400 mb-1 flex items-center justify-center">
                    <Target className="w-3 h-3 sm:w-5 sm:h-5 mr-1" />
                    <span className="hidden sm:inline">
                      {isEnrolled ? courseStats.completedLevels : courseStats.totalLevels}
                    </span>
                    <span className="sm:hidden">
                      {isEnrolled ? courseStats.completedLevels : courseStats.totalLevels}
                    </span>
                  </div>
                  <div className="text-xs text-gray-300 hidden sm:block">
                    {isEnrolled ? `of ${courseStats.totalLevels} Levels` : "Total Levels"}
                  </div>
                  <div className="text-xs text-gray-300 sm:hidden">
                    Levels
                  </div>
                </motion.div>
                
                <motion.div
                  whileHover={{ scale: 1.05 }}
                  className="p-1 sm:p-3 rounded-lg bg-gradient-to-br from-purple-500/20 to-pink-500/20 border border-purple-500/30"
                >
                  <div className="text-sm sm:text-2xl font-bold text-purple-400 mb-1 flex items-center justify-center">
                    <Crown className="w-3 h-3 sm:w-5 sm:h-5 mr-1" />
                    <span>
                      {isEnrolled ? courseStats.completedChapters : courseStats.totalChapters}
                    </span>
                  </div>
                  <div className="text-xs text-gray-300 hidden sm:block">
                    {isEnrolled ? `of ${courseStats.totalChapters} Chapters` : "Total Chapters"}
                  </div>
                  <div className="text-xs text-gray-300 sm:hidden">
                    Chapters
                  </div>
                </motion.div>
                
                <motion.div
                  whileHover={{ scale: 1.05 }}
                  className="p-1 sm:p-3 rounded-lg bg-gradient-to-br from-yellow-500/20 to-orange-500/20 border border-yellow-500/30"
                >
                  <div className="text-sm sm:text-2xl font-bold text-yellow-400 mb-1 flex items-center justify-center">
                    <Star className="w-3 h-3 sm:w-5 sm:h-5 mr-1" />
                    <span>
                      {isEnrolled ? courseStats.totalStars : courseStats.maxPossibleStars}
                    </span>
                  </div>
                  <div className="text-xs text-gray-300 hidden sm:block">
                    {isEnrolled ? `of ${courseStats.maxPossibleStars} Stars` : "Max Stars"}
                  </div>
                  <div className="text-xs text-gray-300 sm:hidden">
                    Stars
                  </div>
                </motion.div>
                
                <motion.div
                  whileHover={{ scale: 1.05 }}
                  className="p-1 sm:p-3 rounded-lg bg-gradient-to-br from-green-500/20 to-emerald-500/20 border border-green-500/30"
                >
                  <div className="text-sm sm:text-2xl font-bold text-green-400 mb-1 flex items-center justify-center">
                    {isEnrolled ? (
                      <>
                        <Zap className="w-3 h-3 sm:w-5 sm:h-5 mr-1" />
                        <span>{courseStats.progressPercentage}%</span>
                      </>
                    ) : (
                      <>
                        <Lock className="w-3 h-3 sm:w-5 sm:h-5 mr-1" />
                        <span>0%</span>
                      </>
                    )}
                  </div>
                  <div className="text-xs text-gray-300 hidden sm:block">
                    {isEnrolled ? "Complete" : "Locked"}
                  </div>
                  <div className="text-xs text-gray-300 sm:hidden">
                    {isEnrolled ? "Done" : "Locked"}
                  </div>
                </motion.div>
              </div>
            </div>
          </Card>
        </motion.div>
      )}

      {/* Game Path */}
      <div className="relative z-10 mt-8 sm:mt-12">
        {levelPath.length === 0 ? (
          <motion.div
            className="max-w-4xl mx-auto px-4 sm:px-6"
            initial={{ opacity: 0, y: 50 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ delay: 0.8 }}
          >
            <Card variant="glass" className="text-center py-12 sm:py-16 bg-black/40 backdrop-blur-xl border-white/20">
              <motion.div
                className="w-16 h-16 sm:w-24 sm:h-24 bg-gradient-to-br from-gray-500 to-gray-700 rounded-full flex items-center justify-center mx-auto mb-4 sm:mb-6"
                animate={{ 
                  scale: [1, 1.1, 1],
                  opacity: [0.7, 1, 0.7]
                }}
                transition={{ duration: 2, repeat: Infinity }}
              >
                <BookOpen className="w-8 h-8 sm:w-12 sm:h-12 text-gray-300" />
              </motion.div>
              <h3 className="text-xl sm:text-2xl font-bold text-white mb-4">
                Adventure Coming Soon
              </h3>
              <p className="text-gray-300 mb-6 max-w-md mx-auto text-sm sm:text-base">
                This quest doesn't have any chapters or levels yet. The adventure is being prepared!
              </p>
              <Button variant="primary" glow>
                <Target className="w-4 h-4 mr-2" />
                Explore Other Quests
              </Button>
            </Card>
          </motion.div>
        ) : (
          <GamePath 
            levelPath={levelPath} 
            onLevelClick={handleLevelClick}
          />
        )}
      </div>

      {/* Course Completion Celebration - Only show if enrolled and completed */}
      {isEnrolled && courseStats.isCompleted && (
        <motion.div
          className="fixed inset-0 z-50 flex items-center justify-center bg-black/80 backdrop-blur-sm p-4"
          initial={{ opacity: 0 }}
          animate={{ opacity: 1 }}
          transition={{ delay: 2 }}
        >
          <motion.div
            className="text-center max-w-md"
            initial={{ scale: 0, rotate: -180 }}
            animate={{ scale: 1, rotate: 0 }}
            transition={{ type: "spring", duration: 1 }}
          >
            <motion.div
              className="w-24 h-24 sm:w-32 sm:h-32 bg-gradient-to-r from-yellow-400 via-orange-500 to-red-500 rounded-full flex items-center justify-center mx-auto mb-6 sm:mb-8 shadow-2xl shadow-orange-500/50"
              animate={{
                rotate: [0, 360],
                scale: [1, 1.2, 1],
              }}
              transition={{
                rotate: { duration: 3, repeat: Infinity },
                scale: { duration: 2, repeat: Infinity },
              }}
            >
              <Trophy className="w-12 h-12 sm:w-16 sm:h-16 text-white" />
            </motion.div>
            
            <h2 className="text-4xl sm:text-6xl font-bold text-white mb-4">
              QUEST COMPLETED!
            </h2>
            <p className="text-lg sm:text-2xl text-gray-300 mb-6 sm:mb-8">
              You are now a master of {course.title}!
            </p>
            
            <div className="flex flex-col sm:flex-row items-center justify-center space-y-3 sm:space-y-0 sm:space-x-6">
              <Badge variant="neon" size="lg" glow>
                <Crown className="w-4 h-4 sm:w-5 sm:h-5 mr-2" />
                Quest Master
              </Badge>
              <Badge variant="gradient" size="lg" glow>
                <Zap className="w-4 h-4 sm:w-5 sm:h-5 mr-2" />
                {progress?.totalScore || 0} XP Earned
              </Badge>
            </div>
          </motion.div>
        </motion.div>
      )}

      {/* ✅ Join Course Overlay for non-enrolled users */}
      {!isEnrolled && (
        <motion.div
          className="fixed bottom-8 left-1/2 transform -translate-x-1/2 z-50"
          initial={{ opacity: 0, y: 100 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ delay: 1, duration: 0.5 }}
        >
          <Card variant="glass" className="bg-black/80 backdrop-blur-xl border-orange-500/50 shadow-2xl">
            <div className="p-6 text-center">
              <div className="flex items-center justify-center space-x-3 mb-4">
                <Lock className="w-6 h-6 text-orange-400" />
                <h3 className="text-lg font-bold text-white">
                  Ready to Start Learning?
                </h3>
              </div>
              <p className="text-gray-300 mb-4 text-sm">
                Join this course to unlock all levels and track your progress
              </p>
              <Button
                onClick={handleJoinCourse}
                size="lg"
                className="bg-gradient-to-r from-orange-500 to-red-500 hover:from-orange-600 hover:to-red-600 text-white font-bold px-8 py-3 rounded-xl shadow-lg shadow-orange-500/50 hover:shadow-orange-500/70 transition-all duration-300"
                leftIcon={<UserPlus className="w-5 h-5" />}
                glow
                fullWidth
              >
                Join Course Now
              </Button>
            </div>
          </Card>
        </motion.div>
      )}
    </div>
  );
}

export default CourseDetailPage;