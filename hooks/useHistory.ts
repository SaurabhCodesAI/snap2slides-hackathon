// hooks/useHistory.ts
'use client';

import { useState, useEffect, useCallback } from 'react';

interface Conversion {
  _id: string;
  summary: string;
  timestamp: string;
  themeUsed: string;
  outputType: 'pptx' | 'interactive';
  generatedSlidesUrl?: string;
}

export const useHistory = () => {
  const [conversions, setConversions] = useState<Conversion[]>([]);
  const [isLoading, setIsLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);

  const fetchHistory = useCallback(async () => {
    try {
      setIsLoading(true);
      setError(null);
      
      const response = await fetch('/api/history');
      if (!response.ok) {
        throw new Error('Failed to fetch history');
      }
      
      const result = await response.json();
      setConversions(result.data || []);
    } catch (err: any) {
      setError(err.message || 'Failed to load history');
      console.error('Error fetching history:', err);
    } finally {
      setIsLoading(false);
    }
  }, []);

  useEffect(() => {
    fetchHistory();
  }, [fetchHistory]);

  const refreshHistory = useCallback(() => {
    fetchHistory();
  }, [fetchHistory]);

  return {
    conversions,
    isLoading,
    error,
    refreshHistory
  };
};
