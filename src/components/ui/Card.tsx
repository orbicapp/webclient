import React from 'react';

import { cn } from '@/lib/utils/class.utils';

interface CardProps {
  className?: string;
  children: React.ReactNode;
  hoverable?: boolean;
  variant?: 'default' | 'gradient' | 'glass' | 'neon';
}

export function Card({ 
  className, 
  children, 
  hoverable = false, 
  variant = 'default',
  ...props 
}: CardProps) {
  const variantStyles = {
    default: 'bg-white dark:bg-gray-800 border border-gray-200 dark:border-gray-700',
    gradient: 'bg-gradient-to-br from-white to-gray-50 dark:from-gray-800 dark:to-gray-900 border border-gray-200/50 dark:border-gray-700/50',
    glass: 'bg-white/80 dark:bg-gray-800/80 backdrop-blur-lg border border-white/20 dark:border-gray-700/20',
    neon: 'bg-gray-900 border-2 border-primary-500/30 shadow-lg shadow-primary-500/20'
  };

  return (
    <div 
      className={cn(
        'rounded-2xl shadow-card overflow-hidden transition-all duration-300 p-6',
        variantStyles[variant],
        hoverable && 'hover:shadow-card-hover hover:scale-[1.02] transform cursor-pointer',
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
    <div className={cn('space-y-1.5 mb-6', className)} {...props}>
      {children}
    </div>
  );
}

interface CardTitleProps {
  className?: string;
  children: React.ReactNode;
  as?: React.ElementType;
  gradient?: boolean;
}

export function CardTitle({ 
  className, 
  children, 
  as: Component = 'h3', 
  gradient = false,
  ...props 
}: CardTitleProps) {
  return (
    <Component 
      className={cn(
        'text-xl font-bold',
        gradient 
          ? 'bg-gradient-to-r from-primary-600 to-accent-600 bg-clip-text text-transparent dark:from-primary-400 dark:to-accent-400'
          : 'text-gray-900 dark:text-white',
        className
      )} 
      {...props}
    >
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
    <p className={cn('text-sm text-gray-600 dark:text-gray-400', className)} {...props}>
      {children}
    </p>
  );
}

interface CardContentProps {
  className?: string;
  children: React.ReactNode;
  noPadding?: boolean;
}

export function CardContent({ className, children, noPadding = false, ...props }: CardContentProps) {
  return (
    <div className={cn(!noPadding && '', className)} {...props}>
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
    <div className={cn('flex items-center mt-6 pt-4 border-t border-gray-200 dark:border-gray-700', className)} {...props}>
      {children}
    </div>
  );
}