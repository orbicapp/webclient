import React from "react";
import { motion } from "framer-motion";
import { Calendar, User, Eye, Globe, Lock, Link as LinkIcon } from "lucide-react";
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
    ? `https://images.pexels.com/photos/${course.thumbnailId}/pexels-photo-${course.thumbnailId}.jpeg?auto=compress&cs=tinysrgb&w=800&h=400&fit=crop`
    : `https://images.pexels.com/photos/4144923/pexels-photo-4144923.jpeg?auto=compress&cs=tinysrgb&w=800&h=400&fit=crop`;

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
      whileHover={{ y: -4 }}
      transition={{ duration: 0.3 }}
      className={cn("group cursor-pointer", className)}
    >
      <Link to={`/course/${course._id}`}>
        <div className="relative overflow-hidden rounded-2xl shadow-lg hover:shadow-2xl transition-all duration-500 bg-gray-900">
          {/* Background Thumbnail */}
          <div className="relative h-48 overflow-hidden">
            <img
              src={thumbnailUrl}
              alt={course.title}
              className="w-full h-full object-cover transition-transform duration-700 group-hover:scale-110"
            />
            
            {/* Gradient Overlay */}
            <div className="absolute inset-0 bg-gradient-to-t from-gray-900 via-gray-900/60 to-transparent" />
            
            {/* Top Tags */}
            <div className="absolute top-3 left-3 right-3 flex items-start justify-between">
              <div className="flex flex-wrap gap-2">
                {/* Language Badge */}
                <Badge 
                  variant="neon" 
                  size="sm"
                  className="bg-black/50 backdrop-blur-sm border-primary-500/50 text-primary-300"
                >
                  {course.lang.toUpperCase()}
                </Badge>
                
                {/* Visibility Badge */}
                <Badge 
                  variant={getVisibilityColor() as any}
                  size="sm"
                  className="bg-black/50 backdrop-blur-sm"
                >
                  <span className="flex items-center space-x-1">
                    {getVisibilityIcon()}
                    <span className="capitalize">{course.visibility}</span>
                  </span>
                </Badge>
                
                {/* Category Badge */}
                <Badge 
                  variant="gradient" 
                  size="sm"
                  className="bg-black/50 backdrop-blur-sm"
                >
                  {course.category}
                </Badge>
              </div>
              
              {/* Chapters Count */}
              <div className="bg-black/60 backdrop-blur-sm rounded-lg px-2 py-1 border border-white/20">
                <span className="text-xs text-white font-bold">
                  {course.chaptersCount} chapters
                </span>
              </div>
            </div>

            {/* Hover Play Button */}
            <div className="absolute inset-0 flex items-center justify-center opacity-0 group-hover:opacity-100 transition-opacity duration-300">
              <div className="w-16 h-16 bg-primary-600/90 backdrop-blur-sm rounded-full flex items-center justify-center shadow-lg shadow-primary-500/50 transform scale-75 group-hover:scale-100 transition-transform duration-300">
                <div className="w-0 h-0 border-l-[12px] border-l-white border-t-[8px] border-t-transparent border-b-[8px] border-b-transparent ml-1" />
              </div>
            </div>
          </div>

          {/* Content Area */}
          <div className="relative p-4 bg-gradient-to-b from-gray-900 to-black">
            {/* Title */}
            <h3 className="text-lg font-bold text-white mb-2 line-clamp-2 group-hover:text-primary-300 transition-colors duration-300">
              {course.title}
            </h3>

            {/* Description */}
            <p className="text-sm text-gray-300 mb-4 line-clamp-2 leading-relaxed">
              {course.description}
            </p>

            {/* Footer */}
            <div className="flex items-center justify-between">
              {/* Left side - Date */}
              {showDate && (
                <div className="flex items-center space-x-1 text-xs text-gray-400">
                  <Calendar className="w-3 h-3" />
                  <span>{formatDate(course.createdAt)}</span>
                </div>
              )}

              {/* Right side - Author */}
              {showAuthor && (
                <div className="flex items-center space-x-1 text-xs text-gray-400">
                  <User className="w-3 h-3" />
                  <span className="truncate max-w-24">{course.author}</span>
                </div>
              )}
            </div>

            {/* Glow Effect on Hover */}
            <div className="absolute inset-0 bg-gradient-to-r from-primary-500/0 via-primary-500/5 to-accent-500/0 opacity-0 group-hover:opacity-100 transition-opacity duration-500 rounded-2xl" />
          </div>

          {/* Shine Effect */}
          <div className="absolute inset-0 bg-gradient-to-r from-transparent via-white/10 to-transparent -translate-x-full group-hover:translate-x-full transition-transform duration-1000" />
          
          {/* Border Glow */}
          <div className="absolute inset-0 rounded-2xl border border-transparent group-hover:border-primary-500/30 transition-colors duration-500" />
        </div>
      </Link>
    </motion.div>
  );
};

export default CourseCard;