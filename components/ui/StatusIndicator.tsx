// components/ui/StatusIndicator.tsx
'use client';

import { memo } from 'react';
import { motion, AnimatePresence } from 'framer-motion';

interface StatusIndicatorProps {
  status: 'idle' | 'saving' | 'saved' | 'error';
  className?: string;
}

const StatusIndicator = memo<StatusIndicatorProps>(({ status, className = '' }) => {
  const statusConfig = {
    idle: { color: 'text-gray-400', icon: null, text: '' },
    saving: {
      color: 'text-blue-500',
      icon: (
        <div className="w-3 h-3 border border-blue-500 border-t-transparent rounded-full animate-spin" />
      ),
      text: 'Saving...'
    },
    saved: {
      color: 'text-green-500',
      icon: (
        <svg className="w-3 h-3" fill="none" stroke="currentColor" viewBox="0 0 24 24">
          <path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M5 13l4 4L19 7" />
        </svg>
      ),
      text: 'Saved'
    },
    error: {
      color: 'text-red-500',
      icon: (
        <svg className="w-3 h-3" fill="none" stroke="currentColor" viewBox="0 0 24 24">
          <path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M6 18L18 6M6 6l12 12" />
        </svg>
      ),
      text: 'Error'
    }
  };

  const config = statusConfig[status];

  return (
    <AnimatePresence>
      {status !== 'idle' && (
        <motion.div
          initial={{ opacity: 0, x: 20 }}
          animate={{ opacity: 1, x: 0 }}
          exit={{ opacity: 0, x: 20 }}
          className={`flex items-center space-x-1 text-xs ${config.color} ${className}`}
        >
          {config.icon}
          <span>{config.text}</span>
        </motion.div>
      )}
    </AnimatePresence>
  );
});

StatusIndicator.displayName = 'StatusIndicator';

export default StatusIndicator;
