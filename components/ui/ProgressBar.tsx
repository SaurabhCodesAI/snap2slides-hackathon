// components/ui/ProgressBar.tsx
'use client';

import { memo } from 'react';
import { motion } from 'framer-motion';

interface ProgressBarProps {
  progress: number; // 0-100
  label?: string;
  className?: string;
  size?: 'sm' | 'md' | 'lg';
}

const ProgressBar = memo<ProgressBarProps>(({ 
  progress, 
  label, 
  className = '',
  size = 'md'
}) => {
  const sizeClasses = {
    sm: 'h-1',
    md: 'h-2',
    lg: 'h-3'
  };

  const textSizeClasses = {
    sm: 'text-xs',
    md: 'text-sm',
    lg: 'text-base'
  };

  const clampedProgress = Math.min(Math.max(progress, 0), 100);

  return (
    <div className={`w-full ${className}`}>
      {label && (
        <div className={`flex justify-between items-center mb-2 ${textSizeClasses[size]}`}>
          <span className="text-white/80 font-medium">{label}</span>
          <span className="text-white/60">{Math.round(clampedProgress)}%</span>
        </div>
      )}
      <div className={`bg-white/20 rounded-full overflow-hidden ${sizeClasses[size]}`}>
        <motion.div
          className="h-full bg-gradient-to-r from-blue-500 to-purple-500 rounded-full"
          initial={{ width: 0 }}
          animate={{ width: `${clampedProgress}%` }}
          transition={{ duration: 0.5, ease: 'easeInOut' }}
        />
      </div>
    </div>
  );
});

ProgressBar.displayName = 'ProgressBar';

export default ProgressBar;
