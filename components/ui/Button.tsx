// Button component - a beautiful, reusable button that works everywhere
// Designed to feel premium and responsive, with nice animations and states
'use client';

import { memo, forwardRef } from 'react';
import { cn } from '@/lib/utils';

interface ButtonProps extends React.ButtonHTMLAttributes<HTMLButtonElement> {
  variant?: 'primary' | 'secondary' | 'danger' | 'ghost';
  size?: 'sm' | 'md' | 'lg';
  isLoading?: boolean;
  leftIcon?: React.ReactNode;
  rightIcon?: React.ReactNode;
}

const Button = memo(forwardRef<HTMLButtonElement, ButtonProps>(({
  children,
  className,
  variant = 'primary',
  size = 'md',
  isLoading = false,
  leftIcon,
  rightIcon,
  disabled,
  ...props
}, ref) => {
  // Base styles that every button gets - smooth transitions and focus states
  const baseClasses = 'inline-flex items-center justify-center font-semibold transition-all duration-300 focus:outline-none focus:ring-4 focus:ring-offset-0 disabled:cursor-not-allowed transform hover:scale-[1.02] active:scale-[0.98]';
  
  // Different visual styles for different use cases
  const variants = {
    primary: 'bg-gradient-to-r from-blue-600 via-purple-600 to-pink-600 hover:from-blue-700 hover:via-purple-700 hover:to-pink-700 text-white shadow-2xl focus:ring-blue-500/50 disabled:opacity-60',
    secondary: 'bg-white/10 border border-white/20 text-white hover:bg-white/15 backdrop-blur-md shadow-lg focus:ring-white/30 disabled:opacity-60',
    danger: 'bg-gradient-to-r from-red-500 to-red-600 hover:from-red-600 hover:to-red-700 text-white shadow-lg focus:ring-red-500/50 disabled:opacity-60',
    ghost: 'text-white hover:bg-white/10 focus:ring-white/30 disabled:opacity-60' // Subtle, minimal button
  };
  
  // Different sizes for different contexts
  const sizes = {
    sm: 'px-3 py-1.5 text-sm rounded-lg',     // Small buttons for tight spaces
    md: 'px-6 py-3 text-base rounded-xl',     // Standard size for most uses
    lg: 'px-8 py-4 text-lg rounded-2xl'       // Large buttons for important actions
  };

  return (
    <button
      ref={ref}
      className={cn(
        baseClasses,
        variants[variant],
        sizes[size],
        className
      )}
      disabled={isLoading || disabled}
      {...props}
    >
      {isLoading && (
        <div className="w-4 h-4 border-2 border-white/30 border-t-white rounded-full animate-spin mr-2" />
      )}
      {!isLoading && leftIcon && <span className="mr-2">{leftIcon}</span>}
      {children}
      {!isLoading && rightIcon && <span className="ml-2">{rightIcon}</span>}
    </button>
  );
}));

Button.displayName = 'Button';

export default Button;
