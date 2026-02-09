import { useEffect, useState, useCallback } from 'react';
import { mapApiToPresence, getRelativeTime, PresenceState, ApiStatusResponse } from '@/lib/statusMapper';

interface UsePresencePollingOptions {
  interval?: number;
  enabled?: boolean;
}

export function usePresencePolling(options: UsePresencePollingOptions = {}) {
  const { interval = 15000, enabled = true } = options;

  const [presenceState, setPresenceState] = useState<PresenceState>({
    status: 'ready',
    label: 'Klaar voor taken',
    emoji: '🧠',
  });

  const [isLoading, setIsLoading] = useState(false);
  const [error, setError] = useState<string | null>(null);

  const fetchStatus = useCallback(async () => {
    if (!enabled) return;

    setIsLoading(true);
    try {
      const response = await fetch('/api/alex/status', {
        method: 'GET',
        headers: {
          'Content-Type': 'application/json',
        },
      });

      if (!response.ok) {
        throw new Error(`HTTP ${response.status}`);
      }

      const data: ApiStatusResponse = await response.json();
      const newState = mapApiToPresence(data);

      // Update relative time if lastAction exists
      if (newState.lastAction) {
        newState.lastAction.relativeTime = getRelativeTime(newState.lastAction.timestamp);
      }

      setPresenceState(newState);
      setError(null);
    } catch (err) {
      const errorMessage = err instanceof Error ? err.message : 'Unknown error';
      console.error('[usePresencePolling] Error fetching status:', errorMessage);
      setError(errorMessage);
      // Set error state but keep existing presence state
      setPresenceState((prev) => ({
        ...prev,
        status: 'error',
        label: `Probleem: ${errorMessage}`,
      }));
    } finally {
      setIsLoading(false);
    }
  }, [enabled]);

  // Initial fetch and polling setup
  useEffect(() => {
    if (!enabled) return;

    // Fetch immediately on mount or when enabled
    fetchStatus();

    // Set up polling interval
    const timer = setInterval(fetchStatus, interval);

    return () => clearInterval(timer);
  }, [enabled, interval, fetchStatus]);

  return {
    ...presenceState,
    isLoading,
    error,
    refetch: fetchStatus,
  };
}
