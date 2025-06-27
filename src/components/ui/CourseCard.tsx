import React from "react";
import { motion } from "framer-motion";
import { Calendar, User, Globe, Lock, Link as LinkIcon, BookOpen } from "lucide-react";
import { Link } from "react-router-dom";

import { cn } from "@/lib/utils/class.utils";
import Badge from "./Badge";
import { Course } from "@/services/course-service";
import { formatDate } from "@/lib/utils/class.utils";

interface CourseCardProps {
  course: Course;
  className?: string;
  showAuthor?: boolean;
  showDate?: boolean;
  variant?: "default" | "compact" | "featured";
}

const CourseCard: React.FC<CourseCardProps> = ({
  course,
  className,
  showAuthor = true,
  showDate = true,
  variant = "default",
}) => {
  const thumbnailUrl = course.thumbnailId 
    ? `https://images.pexels.com/photos/${course.thumbnailId}/pexels-photo-${course.thumbnailId}.jpeg?auto=compress&cs=tinysrgb&w=400&h=200&fit=crop`
    : `https://images.pexels.com/photos/4144923/pexels-photo-4144923.jpeg?auto=compress&cs=tinysrgb&w=400&h=200&fit=crop`;

  const getVisibilityIcon = () => {
    switch (course.visibility) {
      case "public":
        return <Globe className="w-3 h-3" />;
      case "private":
        return <Lock className="w-3 h-3" />;
      case "link-only":
        return <LinkIcon className="w-3 h-3" />;
      default:
        return <Globe className="w-3 h-3" />;
    }
  };

  const getVisibilityColor = () => {
    switch (course.visibility) {
      case "public":
        return "success";
      case "private":
        return "error";
      case "link-only":
        return "warning";
      default:
        return "secondary";
    }
  };

  return (
    <motion.div
      initial={{ opacity: 0, y: 20 }}
      animate={{ opacity: 1, y: 0 }}
      whileHover={{ y: -2 }}
      transition={{ duration: 0.2 }}
      className={cn("group cursor-pointer", className)}
    >
      <Link to={`/course/${course._id}`}>
        <div className="bg-white dark:bg-gray-800 rounded-2xl shadow-card hover:shadow-card-hover transition-all duration-300 overflow-hidden border border-gray-200 dark:border-gray-700">
          {/* Thumbnail Header */}
          <div className="relative h-32 bg-gray-100 dark:bg-gray-700 overflow-hidden">
            <img
              src={thumbnailUrl}
              alt={course.title}
              className="w-full h-full object-cover transition-transform duration-300 group-hover:scale-105"
            />
            
            {/* Top Tags */}
            <div className="absolute top-2 left-2 right-2 flex items-start justify-between">
              <div className="flex flex-wrap gap-1">
                {/* Language Badge */}
                <Badge variant="primary" size="sm">
                  {course.lang.toUpperCase()}
                </Badge>
                
                {/* Visibility Badge */}
                <Badge variant={getVisibilityColor() as any} size="sm">
                  <span className="flex items-center space-x-1">
                    {getVisibilityIcon()}
                  </span>
                </Badge>
                
                {/* Category Badge */}
                <Badge variant="accent" size="sm">
                  {course.category}
                </Badge>
              </div>
              
              {/* Chapters Count */}
              <div className="bg-white/90 dark:bg-gray-800/90 backdrop-blur-sm rounded-lg px-2 py-1 border border-gray-200/50 dark:border-gray-600/50">
                <span className="text-xs text-gray-700 dark:text-gray-300 font-medium flex items-center space-x-1">
                  <BookOpen className="w-3 h-3" />
                  <span>{course.chaptersCount}</span>
                </span>
              </div>
            </div>
          </div>

          {/* Content Area */}
          <div className="p-4">
            {/* Title */}
            <h3 className="text-lg font-bold text-gray-900 dark:text-gray-100 mb-2 line-clamp-2 group-hover:text-primary-600 dark:group-hover:text-primary-400 transition-colors duration-200">
              {course.title}
            </h3>

            {/* Description */}
            <p className="text-sm text-gray-600 dark:text-gray-400 mb-4 line-clamp-2 leading-relaxed">
              {course.description}
            </p>

            {/* Footer */}
            <div className="flex items-center justify-between pt-2 border-t border-gray-100 dark:border-gray-700">
              {/* Left side - Date */}
              {showDate && (
                <div className="flex items-center space-x-1 text-xs text-gray-500 dark:text-gray-400">
                  <Calendar className="w-3 h-3" />
                  <span>{formatDate(course.createdAt)}</span>
                </div>
              )}

              {/* Right side - Author */}
              {showAuthor && (
                <div className="flex items-center space-x-1 text-xs text-gray-500 dark:text-gray-400">
                  <User className="w-3 h-3" />
                  <span className="truncate max-w-24 font-medium">{course.author}</span>
                </div>
              )}
            </div>
          </div>
        </div>
      </Link>
    </motion.div>
  );
};

export default CourseCard;