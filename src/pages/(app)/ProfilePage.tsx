import { useState } from "react";
import { motion } from "framer-motion";
import { 
  User, 
  Trophy, 
  Star, 
  Clock, 
  BookOpen, 
  Zap, 
  Target, 
  Calendar,
  TrendingUp,
  Award,
  Flame,
  Crown,
  Gem,
  Shield,
  Camera,
  Edit3,
  MapPin,
  Link as LinkIcon,
  MoreHorizontal
} from "lucide-react";

import { ViewContainer } from "@/components/layout/ViewContainer";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/Card";
import { Tabs, TabsList, TabsTrigger, TabsContent } from "@/components/ui/Tabs";
import Button from "@/components/ui/Button";
import Badge from "@/components/ui/Badge";
import Avatar from "@/components/ui/Avatar";
import ProgressRing from "@/components/ui/ProgressRing";
import { useAuth } from "@/hooks/use-auth";
import { useUserStats } from "@/hooks/use-stats";
import { useCoursesWithProgress } from "@/hooks/use-progress";
import { useCourseSearch } from "@/hooks/use-course";
import { formatDate, calculateLevelFromXp, calculateLevelProgress } from "@/lib/utils/class.utils";

// Achievement data
const achievements = [
  { id: 1, name: "First Steps", description: "Complete your first level", icon: "🎯", unlocked: true, date: "2024-01-15" },
  { id: 2, name: "Speed Learner", description: "Complete 5 levels in one day", icon: "⚡", unlocked: true, date: "2024-01-20" },
  { id: 3, name: "Perfect Score", description: "Get 100% on a level", icon: "💯", unlocked: true, date: "2024-01-25" },
  { id: 4, name: "Streak Master", description: "Maintain a 7-day streak", icon: "🔥", unlocked: false },
  { id: 5, name: "Course Conqueror", description: "Complete your first course", icon: "👑", unlocked: false },
  { id: 6, name: "Knowledge Seeker", description: "Complete 10 courses", icon: "📚", unlocked: false },
];

interface StatCardProps {
  title: string;
  value: string | number;
  subtitle?: string;
  icon: React.ReactNode;
  color: string;
  trend?: {
    value: number;
    isPositive: boolean;
  };
}

const StatCard: React.FC<StatCardProps> = ({ title, value, subtitle, icon, color, trend }) => (
  <Card className="relative overflow-hidden">
    <CardContent>
      <div className="flex items-center justify-between">
        <div className="flex-1">
          <p className="text-sm font-medium text-gray-600 dark:text-gray-400 mb-1">{title}</p>
          <p className="text-3xl font-bold text-gray-900 dark:text-gray-100">{value}</p>
          {subtitle && (
            <p className="text-sm text-gray-500 dark:text-gray-400 mt-1">{subtitle}</p>
          )}
          {trend && (
            <div className={`flex items-center mt-2 text-sm ${
              trend.isPositive ? 'text-green-600 dark:text-green-400' : 'text-red-600 dark:text-red-400'
            }`}>
              <TrendingUp className={`w-4 h-4 mr-1 ${!trend.isPositive ? 'rotate-180' : ''}`} />
              <span>{trend.isPositive ? '+' : ''}{trend.value}%</span>
            </div>
          )}
        </div>
        <div className={`p-3 rounded-2xl ${color}`}>
          {icon}
        </div>
      </div>
    </CardContent>
  </Card>
);

interface ActivityHeatmapProps {
  data: Array<{ date: string; value: number }>;
}

const ActivityHeatmap: React.FC<ActivityHeatmapProps> = ({ data }) => {
  // Generate last 12 weeks of data
  const weeks = 12;
  const daysPerWeek = 7;
  const today = new Date();
  
  const heatmapData = [];
  for (let week = weeks - 1; week >= 0; week--) {
    const weekData = [];
    for (let day = 0; day < daysPerWeek; day++) {
      const date = new Date(today);
      date.setDate(date.getDate() - (week * 7 + (6 - day)));
      
      const activity = data.find(d => d.date === date.toISOString().split('T')[0]);
      weekData.push({
        date: date.toISOString().split('T')[0],
        value: activity?.value || 0,
        day: date.getDay()
      });
    }
    heatmapData.push(weekData);
  }

  const getIntensity = (value: number) => {
    if (value === 0) return 'bg-gray-100 dark:bg-gray-800';
    if (value <= 2) return 'bg-green-200 dark:bg-green-900';
    if (value <= 4) return 'bg-green-400 dark:bg-green-700';
    if (value <= 6) return 'bg-green-600 dark:bg-green-500';
    return 'bg-green-800 dark:bg-green-400';
  };

  return (
    <div className="space-y-4">
      <div className="flex items-center justify-between">
        <h3 className="text-lg font-semibold text-gray-900 dark:text-gray-100">Activity</h3>
        <div className="flex items-center space-x-2 text-sm text-gray-500 dark:text-gray-400">
          <span>Less</span>
          <div className="flex space-x-1">
            {[0, 1, 2, 3, 4].map(level => (
              <div key={level} className={`w-3 h-3 rounded-sm ${getIntensity(level * 2)}`} />
            ))}
          </div>
          <span>More</span>
        </div>
      </div>
      
      <div className="grid grid-cols-12 gap-1">
        {heatmapData.map((week, weekIndex) => (
          <div key={weekIndex} className="space-y-1">
            {week.map((day, dayIndex) => (
              <div
                key={`${weekIndex}-${dayIndex}`}
                className={`w-3 h-3 rounded-sm ${getIntensity(day.value)} transition-colors hover:ring-2 hover:ring-primary-500 cursor-pointer`}
                title={`${day.date}: ${day.value} activities`}
              />
            ))}
          </div>
        ))}
      </div>
    </div>
  );
};

export function ProfilePage() {
  const { user } = useAuth();
  const [statsLoading, stats] = useUserStats();
  const [enrolledLoading, enrolledCourses] = useCoursesWithProgress();
  const [createdLoading, createdResults] = useCourseSearch("myCourses", {
    enabled: true,
    limit: 6,
    offset: 0,
  });

  const [activeTab, setActiveTab] = useState("overview");

  // Calculate user level and progress
  const userLevel = stats ? calculateLevelFromXp(stats.totalScore) : 1;
  const levelProgress = stats ? calculateLevelProgress(stats.totalScore) : 0;

  // Mock activity data (in real app, this would come from API)
  const activityData = stats?.dailyActivity?.map(activity => ({
    date: activity.date,
    value: activity.levelsCompleted
  })) || [];

  const createdCourses = createdResults?.courses || [];

  if (statsLoading || enrolledLoading || createdLoading) {
    return (
      <ViewContainer className="py-8">
        <div className="max-w-6xl mx-auto">
          <div className="animate-pulse space-y-8">
            {/* Profile header skeleton */}
            <div className="bg-gradient-to-r from-gray-200 to-gray-300 dark:from-gray-700 dark:to-gray-800 h-64 rounded-3xl"></div>
            
            {/* Stats grid skeleton */}
            <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-6">
              {[1, 2, 3, 4].map(i => (
                <div key={i} className="h-32 bg-gray-200 dark:bg-gray-700 rounded-2xl"></div>
              ))}
            </div>
          </div>
        </div>
      </ViewContainer>
    );
  }

  return (
    <ViewContainer className="py-8">
      <div className="max-w-6xl mx-auto space-y-8">
        {/* Profile Header */}
        <Card className="relative overflow-hidden bg-gradient-to-br from-primary-500 via-purple-600 to-pink-600 border-0 text-white">
          <CardContent>
            <div className="flex flex-col md:flex-row items-start md:items-center space-y-6 md:space-y-0 md:space-x-8">
              {/* Avatar and basic info */}
              <div className="flex items-center space-x-6">
                <div className="relative">
                  <Avatar 
                    size="xl" 
                    src={user?.avatarId ? `https://api.example.com/avatars/${user.avatarId}` : undefined}
                    fallback={user?.displayName?.charAt(0) || "U"}
                    variant="gradient"
                    className="w-24 h-24 border-4 border-white/20"
                  />
                  <button className="absolute -bottom-2 -right-2 p-2 bg-white/20 backdrop-blur-sm text-white rounded-full hover:bg-white/30 transition-colors">
                    <Camera className="w-4 h-4" />
                  </button>
                </div>
                
                <div>
                  <h1 className="text-3xl font-bold text-white mb-2">
                    {user?.displayName || "User"}
                  </h1>
                  <div className="flex items-center space-x-2 text-white/80 mb-3">
                    <span>@{user?.username || "username"}</span>
                    <span>•</span>
                    <div className="flex items-center space-x-1">
                      <Calendar className="w-4 h-4" />
                      <span>Joined {formatDate(user?.createdAt || new Date().toISOString())}</span>
                    </div>
                  </div>
                </div>
              </div>

              {/* Level and XP */}
              <div className="flex-1 md:text-right">
                <div className="flex flex-col md:items-end space-y-4">
                  <div className="flex items-center space-x-4">
                    <div className="text-center">
                      <div className="text-2xl font-bold text-white">Level {userLevel}</div>
                      <div className="text-sm text-white/70">Experience Level</div>
                    </div>
                    <ProgressRing 
                      progress={levelProgress} 
                      size={80} 
                      strokeWidth={6}
                      variant="neon"
                    >
                      <div className="text-center">
                        <div className="text-lg font-bold text-white">{Math.round(levelProgress)}%</div>
                      </div>
                    </ProgressRing>
                  </div>
                  
                  <div className="flex items-center space-x-6 text-center">
                    <div>
                      <div className="text-xl font-bold text-white">{stats?.totalScore || 0}</div>
                      <div className="text-xs text-white/70">Total XP</div>
                    </div>
                    <div>
                      <div className="text-xl font-bold text-white">{stats?.currentStreak || 0}</div>
                      <div className="text-xs text-white/70">Day Streak</div>
                    </div>
                    <div>
                      <div className="text-xl font-bold text-white">{stats?.totalStarsEarned || 0}</div>
                      <div className="text-xs text-white/70">Stars Earned</div>
                    </div>
                  </div>
                </div>
              </div>
            </div>
          </CardContent>
        </Card>

        {/* Stats Overview */}
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-6">
          <StatCard
            title="Courses Completed"
            value={stats?.totalCoursesCompleted || 0}
            subtitle="Total achievements"
            icon={<Trophy className="w-6 h-6 text-white" />}
            color="bg-gradient-to-br from-yellow-400 to-orange-500"
            trend={{ value: 12, isPositive: true }}
          />
          
          <StatCard
            title="Levels Completed"
            value={stats?.totalLevelsCompleted || 0}
            subtitle="Learning milestones"
            icon={<Target className="w-6 h-6 text-white" />}
            color="bg-gradient-to-br from-blue-400 to-purple-500"
            trend={{ value: 8, isPositive: true }}
          />
          
          <StatCard
            title="Time Spent"
            value={`${Math.round((stats?.totalTimeSpent || 0) / 60)}h`}
            subtitle="Learning hours"
            icon={<Clock className="w-6 h-6 text-white" />}
            color="bg-gradient-to-br from-green-400 to-emerald-500"
            trend={{ value: 15, isPositive: true }}
          />
          
          <StatCard
            title="Current Streak"
            value={`${stats?.currentStreak || 0} days`}
            subtitle={`Best: ${stats?.longestStreak || 0} days`}
            icon={<Flame className="w-6 h-6 text-white" />}
            color="bg-gradient-to-br from-red-400 to-pink-500"
            trend={{ value: 5, isPositive: true }}
          />
        </div>

        {/* Detailed Tabs */}
        <Tabs value={activeTab} onValueChange={setActiveTab}>
          <TabsList className="grid w-full grid-cols-4">
            <TabsTrigger value="overview">Overview</TabsTrigger>
            <TabsTrigger value="achievements">Achievements</TabsTrigger>
            <TabsTrigger value="courses">Courses</TabsTrigger>
            <TabsTrigger value="activity">Activity</TabsTrigger>
          </TabsList>

          {/* Overview Tab */}
          <TabsContent value="overview" className="space-y-6">
            <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
              {/* Recent Activity */}
              <Card>
                <CardHeader>
                  <CardTitle className="flex items-center space-x-2">
                    <TrendingUp className="w-5 h-5" />
                    <span>Recent Activity</span>
                  </CardTitle>
                </CardHeader>
                <CardContent>
                  <ActivityHeatmap data={activityData} />
                </CardContent>
              </Card>

              {/* Category Performance */}
              <Card>
                <CardHeader>
                  <CardTitle className="flex items-center space-x-2">
                    <BookOpen className="w-5 h-5" />
                    <span>Category Performance</span>
                  </CardTitle>
                </CardHeader>
                <CardContent>
                  <div className="space-y-4">
                    {stats?.categoryStats?.slice(0, 5).map((category, index) => (
                      <div key={category.category} className="flex items-center justify-between">
                        <div className="flex items-center space-x-3">
                          <div className="w-8 h-8 bg-primary-100 dark:bg-primary-900 rounded-lg flex items-center justify-center">
                            <span className="text-sm font-medium text-primary-600 dark:text-primary-400">
                              {category.category.charAt(0).toUpperCase()}
                            </span>
                          </div>
                          <div>
                            <div className="font-medium text-gray-900 dark:text-gray-100 capitalize">
                              {category.category}
                            </div>
                            <div className="text-sm text-gray-500 dark:text-gray-400">
                              {category.coursesCompleted} courses
                            </div>
                          </div>
                        </div>
                        <div className="text-right">
                          <div className="font-bold text-gray-900 dark:text-gray-100">
                            {category.totalScore}
                          </div>
                          <div className="text-sm text-gray-500 dark:text-gray-400">
                            XP
                          </div>
                        </div>
                      </div>
                    )) || (
                      <div className="text-center py-8 text-gray-500 dark:text-gray-400">
                        No category data available
                      </div>
                    )}
                  </div>
                </CardContent>
              </Card>
            </div>
          </TabsContent>

          {/* Achievements Tab */}
          <TabsContent value="achievements" className="space-y-6">
            <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
              {achievements.map((achievement) => (
                <Card key={achievement.id} className={`relative overflow-hidden ${
                  achievement.unlocked 
                    ? 'bg-gradient-to-br from-yellow-50 to-orange-50 dark:from-yellow-900/20 dark:to-orange-900/20 border-yellow-200 dark:border-yellow-800' 
                    : 'opacity-60'
                }`}>
                  <CardContent>
                    <div className="flex items-start space-x-4">
                      <div className={`text-4xl ${achievement.unlocked ? '' : 'grayscale'}`}>
                        {achievement.icon}
                      </div>
                      <div className="flex-1">
                        <h3 className="font-bold text-gray-900 dark:text-gray-100 mb-1">
                          {achievement.name}
                        </h3>
                        <p className="text-sm text-gray-600 dark:text-gray-400 mb-2">
                          {achievement.description}
                        </p>
                        {achievement.unlocked && achievement.date && (
                          <div className="flex items-center space-x-1 text-xs text-yellow-600 dark:text-yellow-400">
                            <Award className="w-3 h-3" />
                            <span>Unlocked {formatDate(achievement.date)}</span>
                          </div>
                        )}
                        {!achievement.unlocked && (
                          <Badge variant="outline" size="sm">
                            Locked
                          </Badge>
                        )}
                      </div>
                    </div>
                  </CardContent>
                </Card>
              ))}
            </div>
          </TabsContent>

          {/* Courses Tab */}
          <TabsContent value="courses" className="space-y-6">
            <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
              {/* Enrolled Courses */}
              <Card>
                <CardHeader>
                  <CardTitle className="flex items-center justify-between">
                    <div className="flex items-center space-x-2">
                      <BookOpen className="w-5 h-5" />
                      <span>Enrolled Courses</span>
                    </div>
                    <Badge variant="primary">{enrolledCourses.length}</Badge>
                  </CardTitle>
                </CardHeader>
                <CardContent>
                  <div className="space-y-4">
                    {enrolledCourses.slice(0, 3).map((item) => {
                      const { course, progress } = item;
                      const progressPercentage = progress.totalLevels > 0 
                        ? Math.round((progress.completedLevels / progress.totalLevels) * 100)
                        : 0;

                      return (
                        <div key={course._id} className="flex items-center space-x-4 p-4 bg-gray-50 dark:bg-gray-800 rounded-xl">
                          <div className="w-12 h-12 bg-gradient-to-br from-primary-500 to-accent-500 rounded-xl flex items-center justify-center text-white font-bold">
                            {course.title.charAt(0)}
                          </div>
                          <div className="flex-1 min-w-0">
                            <h4 className="font-medium text-gray-900 dark:text-gray-100 truncate">
                              {course.title}
                            </h4>
                            <div className="flex items-center space-x-2 mt-1">
                              <div className="flex-1 bg-gray-200 dark:bg-gray-700 rounded-full h-2">
                                <div 
                                  className="bg-gradient-to-r from-primary-500 to-accent-500 h-2 rounded-full transition-all duration-300"
                                  style={{ width: `${progressPercentage}%` }}
                                />
                              </div>
                              <span className="text-sm font-medium text-gray-600 dark:text-gray-400">
                                {progressPercentage}%
                              </span>
                            </div>
                          </div>
                        </div>
                      );
                    })}
                    
                    {enrolledCourses.length === 0 && (
                      <div className="text-center py-8 text-gray-500 dark:text-gray-400">
                        No enrolled courses yet
                      </div>
                    )}
                  </div>
                </CardContent>
              </Card>

              {/* Created Courses */}
              <Card>
                <CardHeader>
                  <CardTitle className="flex items-center justify-between">
                    <div className="flex items-center space-x-2">
                      <Edit3 className="w-5 h-5" />
                      <span>Created Courses</span>
                    </div>
                    <Badge variant="accent">{createdCourses.length}</Badge>
                  </CardTitle>
                </CardHeader>
                <CardContent>
                  <div className="space-y-4">
                    {createdCourses.slice(0, 3).map((course) => (
                      <div key={course._id} className="flex items-center space-x-4 p-4 bg-gray-50 dark:bg-gray-800 rounded-xl">
                        <div className="w-12 h-12 bg-gradient-to-br from-accent-500 to-orange-500 rounded-xl flex items-center justify-center text-white font-bold">
                          {course.title.charAt(0)}
                        </div>
                        <div className="flex-1 min-w-0">
                          <h4 className="font-medium text-gray-900 dark:text-gray-100 truncate">
                            {course.title}
                          </h4>
                          <div className="flex items-center space-x-4 mt-1 text-sm text-gray-500 dark:text-gray-400">
                            <span>{course.chaptersCount} chapters</span>
                            <span className="capitalize">{course.visibility}</span>
                          </div>
                        </div>
                      </div>
                    ))}
                    
                    {createdCourses.length === 0 && (
                      <div className="text-center py-8 text-gray-500 dark:text-gray-400">
                        No created courses yet
                      </div>
                    )}
                  </div>
                </CardContent>
              </Card>
            </div>
          </TabsContent>

          {/* Activity Tab */}
          <TabsContent value="activity" className="space-y-6">
            <Card>
              <CardHeader>
                <CardTitle className="flex items-center space-x-2">
                  <Calendar className="w-5 h-5" />
                  <span>Learning Activity</span>
                </CardTitle>
              </CardHeader>
              <CardContent>
                <ActivityHeatmap data={activityData} />
                
                <div className="mt-8 grid grid-cols-1 md:grid-cols-3 gap-6">
                  <div className="text-center p-4 bg-gray-50 dark:bg-gray-800 rounded-xl">
                    <div className="text-2xl font-bold text-gray-900 dark:text-gray-100 mb-1">
                      {stats?.totalLevelsCompleted || 0}
                    </div>
                    <div className="text-sm text-gray-500 dark:text-gray-400">
                      Total Levels
                    </div>
                  </div>
                  
                  <div className="text-center p-4 bg-gray-50 dark:bg-gray-800 rounded-xl">
                    <div className="text-2xl font-bold text-gray-900 dark:text-gray-100 mb-1">
                      {Math.round((stats?.totalTimeSpent || 0) / 3600)}h
                    </div>
                    <div className="text-sm text-gray-500 dark:text-gray-400">
                      Total Time
                    </div>
                  </div>
                  
                  <div className="text-center p-4 bg-gray-50 dark:bg-gray-800 rounded-xl">
                    <div className="text-2xl font-bold text-gray-900 dark:text-gray-100 mb-1">
                      {stats?.longestStreak || 0}
                    </div>
                    <div className="text-sm text-gray-500 dark:text-gray-400">
                      Best Streak
                    </div>
                  </div>
                </div>
              </CardContent>
            </Card>
          </TabsContent>
        </Tabs>
      </div>
    </ViewContainer>
  );
}