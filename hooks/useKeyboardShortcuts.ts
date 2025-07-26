// Keyboard shortcuts hook - makes the app feel professional and fast
// Let users do common actions with keyboard shortcuts like Ctrl+S, Ctrl+Z, etc.
'use client';

import { useEffect, useCallback } from 'react';

interface KeyboardShortcuts {
  [key: string]: () => void; // Map keyboard combinations to functions
}

interface UseKeyboardShortcutsOptions {
  enabled?: boolean;      // Turn shortcuts on/off
  preventDefault?: boolean; // Stop browser from handling the key
}

export const useKeyboardShortcuts = (
  shortcuts: KeyboardShortcuts,
  options: UseKeyboardShortcutsOptions = {}
) => {
  const { enabled = true, preventDefault = true } = options;

  // Handle when user presses keys
  const handleKeyDown = useCallback((event: KeyboardEvent) => {
    if (!enabled) return; // Shortcuts are disabled

    // Figure out what key combination was pressed
    const key = event.key.toLowerCase();
    const modifiers = [];
    
    // Check for modifier keys (Ctrl, Alt, Shift)
    if (event.ctrlKey || event.metaKey) modifiers.push('ctrl'); // metaKey = Cmd on Mac
    if (event.altKey) modifiers.push('alt');
    if (event.shiftKey) modifiers.push('shift');
    
    // Create a string like "ctrl+s" or "ctrl+shift+z"
    const combination = modifiers.length > 0 
      ? `${modifiers.join('+')}+${key}` 
      : key;

    // See if we have a function to run for this key combination
    const handler = shortcuts[combination];
    
    if (handler) {
      if (preventDefault) {
        // Stop the browser from doing its default thing (like Ctrl+S opening save dialog)
        event.preventDefault();
        event.stopPropagation();
      }
      // Run our custom function
      handler();
    }
  }, [shortcuts, enabled, preventDefault]);

  // Set up the keyboard listener when component mounts
  useEffect(() => {
    if (!enabled) return;

    document.addEventListener('keydown', handleKeyDown);
    return () => document.removeEventListener('keydown', handleKeyDown);
  }, [handleKeyDown, enabled]);

  return { enabled };
};

// Common shortcut combinations
export const SHORTCUTS = {
  NEW: 'ctrl+n',
  SAVE: 'ctrl+s',
  COPY: 'ctrl+c',
  PASTE: 'ctrl+v',
  UNDO: 'ctrl+z',
  REDO: 'ctrl+y',
  PRESENT: 'f5',
  EXIT_PRESENT: 'escape',
  NEXT_SLIDE: 'arrowright',
  PREV_SLIDE: 'arrowleft',
  FULLSCREEN: 'f11',
  HELP: 'ctrl+/',
  FIND: 'ctrl+f'
} as const;
