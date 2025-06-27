import React from 'react';

import { cn } from '@/lib/utils/class.utils';

interface CardProps {
  className?: string;
  children: React.ReactNode;
  hoverable?: boolean;
}

export function Card({ className, children, hoverable = false, ...props }: CardProps) {
  return (
    <div 
      className={cn(
        'bg-white dark:bg-gray-800 rounded-2xl shadow-card overflow-hidden transition-all duration-200',
        hoverable && 'hover:shadow-card-hover transform hover:-translate-y-1',
        className
      )} 
      {...props}
    >
      {children}
    </div>
  );
}

interface CardHeaderProps {
  className?: string;
  children: React.ReactNode;
}

export function CardHeader({ className, children, ...props }: CardHeaderProps) {
  return (
    <div className={cn('space-y-1.5 mb-4', className)} {...props}>
      {children}
    </div>
  );
}

interface CardTitleProps {
  className?: string;
  children: React.ReactNode;
  as?: React.ElementType;
}

export function CardTitle({ className, children, as: Component = 'h3', ...props }: CardTitleProps) {
  return (
    <Component className={cn('text-xl font-semibold dark:text-white', className)} {...props}>
      {children}
    </Component>
  );
}

interface CardDescriptionProps {
  className?: string;
  children: React.ReactNode;
}

export function CardDescription({ className, children, ...props }: CardDescriptionProps) {
  return (
    <p className={cn('text-sm text-text-secondary dark:text-gray-400', className)} {...props}>
      {children}
    </p>
  );
}

interface CardContentProps {
  className?: string;
  children: React.ReactNode;
}

export function CardContent({ className, children, ...props }: CardContentProps) {
  return (
    <div className={cn('', className)} {...props}>
      {children}
    </div>
  );
}

interface CardFooterProps {
  className?: string;
  children: React.ReactNode;
}

export function CardFooter({ className, children, ...props }: CardFooterProps) {
  return (
    <div className={cn('flex items-center mt-4 pt-4 border-t dark:border-gray-700', className)} {...props}>
      {children}
    </div>
  );
}
