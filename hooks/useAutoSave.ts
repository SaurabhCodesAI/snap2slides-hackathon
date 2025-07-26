// hooks/useAutoSave.ts
'use client';

import { useEffect, useRef, useCallback } from 'react';

interface UseAutoSaveOptions {
  delay?: number; // milliseconds
  enabled?: boolean;
  onSave: () => Promise<void> | void;
  dependencies: any[];
}

// Simple debounce function
function debounce<T extends (...args: any[]) => any>(
  func: T,
  delay: number
): T & { cancel: () => void } {
  let timeoutId: NodeJS.Timeout;
  
  const debouncedFunc = ((...args: any[]) => {
    clearTimeout(timeoutId);
    timeoutId = setTimeout(() => func(...args), delay);
  }) as T & { cancel: () => void };
  
  debouncedFunc.cancel = () => clearTimeout(timeoutId);
  
  return debouncedFunc;
}

export const useAutoSave = ({
  delay = 2000,
  enabled = true,
  onSave,
  dependencies
}: UseAutoSaveOptions) => {
  const lastSavedRef = useRef<string>('');
  const isSavingRef = useRef(false);

  const debouncedSave = useCallback(
    debounce(async () => {
      if (!enabled || isSavingRef.current) return;

      const currentData = JSON.stringify(dependencies);
      
      // Only save if data has actually changed
      if (currentData === lastSavedRef.current) return;

      try {
        isSavingRef.current = true;
        await onSave();
        lastSavedRef.current = currentData;
      } catch (error) {
        console.error('Auto-save failed:', error);
      } finally {
        isSavingRef.current = false;
      }
    }, delay),
    [onSave, enabled, delay, ...dependencies]
  );

  useEffect(() => {
    if (!enabled) return;

    debouncedSave();

    return () => {
      debouncedSave.cancel();
    };
  }, dependencies);

  const forceSave = useCallback(async () => {
    debouncedSave.cancel();
    await onSave();
    lastSavedRef.current = JSON.stringify(dependencies);
  }, [debouncedSave, onSave, dependencies]);

  return {
    forceSave,
    isSaving: isSavingRef.current
  };
};
