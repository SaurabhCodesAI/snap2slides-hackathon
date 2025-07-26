// components/ui/AIProcessingNotification.tsx
'use client';

import { motion, AnimatePresence } from 'framer-motion';
import { SparklesIcon, BeakerIcon, BoltIcon } from '@heroicons/react/24/outline';

interface AIProcessingNotificationProps {
  stage: 'analyzing' | 'generating-theme' | 'creating-notes' | 'optimizing' | 'complete';
  isVisible: boolean;
}

const STAGE_CONFIG = {
  analyzing: {
    icon: BeakerIcon,
    title: 'Advanced AI Analysis',
    description: 'Gemini 1.5 Pro is analyzing your image with enhanced prompts...',
    color: 'from-blue-500 to-cyan-500',
    particles: 12
  },
  'generating-theme': {
    icon: SparklesIcon,
    title: 'Smart Theme Generation',
    description: 'Creating custom theme using color psychology...',
    color: 'from-purple-500 to-pink-500',
    particles: 8
  },
  'creating-notes': {
    icon: BoltIcon,
    title: 'Speaker Notes Creation',
    description: 'Generating intelligent presentation coaching notes...',
    color: 'from-green-500 to-emerald-500',
    particles: 10
  },
  optimizing: {
    icon: SparklesIcon,
    title: 'Content Optimization',
    description: 'Optimizing slide flow and cognitive load...',
    color: 'from-orange-500 to-red-500',
    particles: 15
  },
  complete: {
    icon: SparklesIcon,
    title: 'AI Enhancement Complete',
    description: 'Your presentation has been enhanced with advanced AI features!',
    color: 'from-emerald-500 to-green-500',
    particles: 20
  }
};

export default function AIProcessingNotification({ stage, isVisible }: AIProcessingNotificationProps) {
  const config = STAGE_CONFIG[stage];

  return (
    <AnimatePresence>
      {isVisible && (
        <motion.div
          initial={{ opacity: 0, scale: 0.8, y: 50 }}
          animate={{ opacity: 1, scale: 1, y: 0 }}
          exit={{ opacity: 0, scale: 0.8, y: 50 }}
          transition={{ 
            type: "spring", 
            stiffness: 500, 
            damping: 30,
            mass: 0.8
          }}
          className="fixed bottom-6 right-6 z-50 max-w-sm"
        >
          <div className={`
            relative overflow-hidden rounded-2xl p-6 shadow-2xl border border-white/20
            bg-gradient-to-r ${config.color}
          `}>
            {/* Animated background particles */}
            <div className="absolute inset-0 overflow-hidden">
              {Array.from({ length: config.particles }).map((_, i) => (
                <motion.div
                  key={i}
                  className="absolute w-1 h-1 bg-white/30 rounded-full"
                  initial={{ 
                    x: Math.random() * 300, 
                    y: Math.random() * 150,
                    opacity: 0 
                  }}
                  animate={{ 
                    x: Math.random() * 300 + 50, 
                    y: Math.random() * 150 + 50,
                    opacity: [0, 1, 0] 
                  }}
                  transition={{ 
                    duration: 2 + Math.random() * 2, 
                    repeat: Infinity,
                    delay: Math.random() * 2 
                  }}
                />
              ))}
            </div>

            {/* Content */}
            <div className="relative z-10 flex items-start gap-4">
              {/* Icon */}
              <div className="flex-shrink-0">
                <div className="w-12 h-12 bg-white/20 rounded-xl flex items-center justify-center backdrop-blur-sm">
                  <config.icon className="w-6 h-6 text-white" />
                </div>
              </div>

              {/* Text */}
              <div className="flex-1 min-w-0">
                <h3 className="text-lg font-semibold text-white mb-1">
                  {config.title}
                </h3>
                <p className="text-white/90 text-sm leading-relaxed">
                  {config.description}
                </p>
                
                {/* Progress indicator for non-complete stages */}
                {stage !== 'complete' && (
                  <div className="mt-3 flex items-center gap-1">
                    {Array.from({ length: 3 }).map((_, i) => (
                      <motion.div
                        key={i}
                        className="w-2 h-2 bg-white/60 rounded-full"
                        animate={{ 
                          scale: [1, 1.2, 1],
                          opacity: [0.6, 1, 0.6]
                        }}
                        transition={{ 
                          duration: 1,
                          repeat: Infinity,
                          delay: i * 0.2
                        }}
                      />
                    ))}
                    <span className="ml-2 text-xs text-white/80 font-medium">
                      Processing...
                    </span>
                  </div>
                )}
              </div>
            </div>

            {/* Glow effect */}
            <motion.div
              className={`
                absolute inset-0 opacity-50 blur-xl
                bg-gradient-to-r ${config.color}
              `}
              animate={{ 
                opacity: [0.3, 0.6, 0.3],
                scale: [1, 1.05, 1]
              }}
              transition={{ 
                duration: 2, 
                repeat: Infinity,
                ease: "easeInOut"
              }}
            />
          </div>
        </motion.div>
      )}
    </AnimatePresence>
  );
}
