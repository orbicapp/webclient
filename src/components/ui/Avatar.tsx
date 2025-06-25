import { User } from "lucide-react";
import React from "react";

import { cn } from "@/lib/utils/class.utils";

export interface AvatarProps extends React.HTMLAttributes<HTMLDivElement> {
  src?: string;
  alt?: string;
  fallback?: React.ReactNode;
  size?: "xs" | "sm" | "md" | "lg" | "xl";
  border?: boolean;
  borderColor?: string;
  status?: "online" | "offline" | "away";
  statusPosition?: "top-right" | "bottom-right";
}

const sizeMap = {
  xs: "w-6 h-6 text-xs",
  sm: "w-8 h-8 text-sm",
  md: "w-10 h-10 text-base",
  lg: "w-12 h-12 text-lg",
  xl: "w-16 h-16 text-xl",
};

const statusColorMap = {
  online: "bg-success-500",
  offline: "bg-gray-400",
  away: "bg-warning-500",
};

const statusSizeMap = {
  xs: "w-1.5 h-1.5",
  sm: "w-2 h-2",
  md: "w-2.5 h-2.5",
  lg: "w-3 h-3",
  xl: "w-4 h-4",
};

const Avatar = React.forwardRef<HTMLDivElement, AvatarProps>(
  (
    {
      className,
      src,
      alt = "Avatar",
      fallback,
      size = "md",
      border = false,
      borderColor = "white",
      status,
      statusPosition = "bottom-right",
      ...props
    },
    ref
  ) => {
    const [hasImageError, setHasImageError] = React.useState(false);

    return (
      <div
        ref={ref}
        className={cn(
          "relative inline-block rounded-full bg-gray-200 overflow-hidden",
          sizeMap[size],
          border && `ring-2 ring-${borderColor}`,
          className
        )}
        {...props}
      >
        {src && !hasImageError ? (
          <img
            src={src}
            alt={alt}
            className="w-full h-full object-cover"
            onError={() => setHasImageError(true)}
          />
        ) : (
          <div className="flex h-full w-full items-center justify-center bg-primary-100 text-primary-800">
            {fallback || <User className="w-3/5 h-3/5" />}
          </div>
        )}

        {status && (
          <span
            className={cn(
              "absolute block rounded-full ring-2 ring-white",
              statusColorMap[status],
              statusSizeMap[size],
              statusPosition === "top-right"
                ? "top-0 right-0 transform translate-x-1/4 -translate-y-1/4"
                : "bottom-0 right-0 transform translate-x-1/4 translate-y-1/4"
            )}
          />
        )}
      </div>
    );
  }
);

Avatar.displayName = "Avatar";

export default Avatar;
