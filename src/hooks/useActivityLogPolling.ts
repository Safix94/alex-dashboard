'use client';

import { useEffect, useState, useCallback, useRef } from 'react';
import type { ActivityLogEntry as ActivityLog } from '@/components/ActivityLog';

export interface UseActivityLogPollingOptions {
  interval?: number; // Interval in milliseconds (default: 5000ms)
  filters?: {
    type?: string;
    agent?: string;
    dateFrom?: string;
    dateTo?: string;
    search?: string;
  };
  limit?: number;
  offset?: number;
  enabled?: boolean;
}

interface FetchResponse {
  entries: ActivityLog[];
  total: number;
  limit: number;
  offset: number;
}

export function useActivityLogPolling({
  interval = 5000,
  filters = {},
  limit = 50,
  offset = 0,
  enabled = true,
}: UseActivityLogPollingOptions = {}) {
  const [entries, setEntries] = useState<ActivityLog[]>([]);
  const [total, setTotal] = useState(0);
  const [isLoading, setIsLoading] = useState(false);
  const [error, setError] = useState<string | null>(null);
  const [hasMore, setHasMore] = useState(true);
  const intervalRef = useRef<NodeJS.Timeout | null>(null);
  const lastFetchRef = useRef<number>(0);

  const fetchLogs = useCallback(
    async (fetchOffset: number = offset) => {
      if (!enabled) return;

      try {
        setIsLoading(true);
        setError(null);

        const params = new URLSearchParams();
        if (filters.type) params.append('type', filters.type);
        if (filters.agent) params.append('agent', filters.agent);
        if (filters.dateFrom) params.append('dateFrom', filters.dateFrom);
        if (filters.dateTo) params.append('dateTo', filters.dateTo);
        if (filters.search) params.append('search', filters.search);
        params.append('limit', limit.toString());
        params.append('offset', fetchOffset.toString());

        const response = await fetch(`/api/alex/log?${params.toString()}`);
        if (!response.ok) throw new Error('Failed to fetch logs');

        const data: FetchResponse = await response.json();

        if (fetchOffset === 0) {
          // Initial load or filter change
          setEntries(data.entries);
        } else {
          // Load more - append to existing entries
          setEntries((prev) => [...prev, ...data.entries]);
        }

        setTotal(data.total);
        setHasMore(
          (fetchOffset + data.entries.length) < data.total
        );

        lastFetchRef.current = Date.now();
      } catch (err) {
        setError(err instanceof Error ? err.message : 'Unknown error');
        console.error('Failed to fetch activity logs:', err);
      } finally {
        setIsLoading(false);
      }
    },
    [enabled, filters, limit, offset]
  );

  // Initial fetch
  useEffect(() => {
    if (enabled) {
      fetchLogs(0);
    }
  }, [enabled, filters, fetchLogs]);

  // Poll for updates
  useEffect(() => {
    if (!enabled) {
      if (intervalRef.current) {
        clearInterval(intervalRef.current);
      }
      return;
    }

    intervalRef.current = setInterval(() => {
      fetchLogs(0); // Always fetch from offset 0 for polling
    }, interval);

    return () => {
      if (intervalRef.current) {
        clearInterval(intervalRef.current);
      }
    };
  }, [enabled, interval, fetchLogs]);

  const handleLoadMore = useCallback(() => {
    if (!isLoading && hasMore) {
      fetchLogs(entries.length);
    }
  }, [isLoading, hasMore, entries.length, fetchLogs]);

  const handleRefresh = useCallback(() => {
    fetchLogs(0);
  }, [fetchLogs]);

  return {
    entries,
    total,
    isLoading,
    error,
    hasMore,
    onLoadMore: handleLoadMore,
    onRefresh: handleRefresh,
    refetch: fetchLogs,
  };
}
