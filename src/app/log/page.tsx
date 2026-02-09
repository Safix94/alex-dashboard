'use client';

import React, { useState, useCallback } from 'react';
import ActivityLog from '@/components/ActivityLog';
import ActivityLogFilters, {
  ActivityLogFiltersState,
} from '@/components/ActivityLogFilters';
import { useActivityLogPolling } from '@/hooks/useActivityLogPolling';

export default function LogPage() {
  const [filters, setFilters] = useState<ActivityLogFiltersState>({});

  const {
    entries,
    total,
    isLoading,
    error,
    hasMore,
    onLoadMore,
    onRefresh,
  } = useActivityLogPolling({
    interval: 5000,
    filters,
    limit: 50,
    enabled: true,
  });

  const handleFiltersChange = useCallback(
    (newFilters: ActivityLogFiltersState) => {
      setFilters(newFilters);
    },
    []
  );

  return (
    <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-8">
      <div className="space-y-6">
        {/* Header */}
        <div>
          <h1 className="text-4xl font-bold text-foreground">Activity Log</h1>
          <p className="text-muted-foreground mt-2">
            Track all activities, events, and updates from the OpenClaw system.
          </p>
        </div>

        {/* Main Container */}
        <div className="grid grid-cols-1 lg:grid-cols-4 gap-6">
          {/* Sidebar: Filters */}
          <div className="lg:col-span-1">
            <ActivityLogFilters
              onFiltersChange={handleFiltersChange}
              isLoading={isLoading}
            />
          </div>

          {/* Main: Timeline */}
          <div className="lg:col-span-3">
            {error && (
              <div className="mb-4 p-4 bg-destructive/10 border border-destructive/20 rounded-lg text-destructive text-sm">
                Error: {error}
              </div>
            )}
            <ActivityLog
              entries={entries}
              total={total}
              isLoading={isLoading}
              hasMore={hasMore}
              onLoadMore={onLoadMore}
              onRefresh={onRefresh}
            />
          </div>
        </div>
      </div>
    </div>
  );
}
