'use client';

import React, { useState } from 'react';
import { X } from 'lucide-react';
import { Button } from '@/components/ui/button';
import { Card } from '@/components/ui/card';

export interface ActivityLogFiltersState {
  type?: string;
  agent?: string;
  dateFrom?: string;
  dateTo?: string;
  search?: string;
}

interface ActivityLogFiltersProps {
  onFiltersChange: (filters: ActivityLogFiltersState) => void;
  isLoading?: boolean;
}

export default function ActivityLogFilters({
  onFiltersChange,
  isLoading = false,
}: ActivityLogFiltersProps) {
  const [filters, setFilters] = useState<ActivityLogFiltersState>({});
  const [isExpanded, setIsExpanded] = useState(false);

  const handleFilterChange = (
    key: keyof ActivityLogFiltersState,
    value: string | undefined
  ) => {
    const newFilters = { ...filters, [key]: value };
    if (!value) delete newFilters[key];
    setFilters(newFilters);
  };

  const handleApply = () => {
    onFiltersChange(filters);
    setIsExpanded(false);
  };

  const handleReset = () => {
    setFilters({});
    onFiltersChange({});
  };

  const activeFilters = Object.keys(filters).length;

  return (
    <div className="space-y-3">
      {/* Filter Toggle Button */}
      <Button
        variant="outline"
        size="sm"
        onClick={() => setIsExpanded(!isExpanded)}
        className={`w-full gap-2 ${activeFilters > 0 ? 'bg-primary/10 border-primary/50' : ''}`}
      >
        <span className="text-base">🔍</span>
        <span>Filters</span>
        {activeFilters > 0 && (
          <span className="ml-auto inline-flex items-center justify-center w-5 h-5 bg-primary/20 text-xs rounded-full text-primary font-medium">
            {activeFilters}
          </span>
        )}
      </Button>

      {/* Expanded Filters Panel */}
      {isExpanded && (
        <Card className="p-4 space-y-4 bg-card/50 border-border/50">
          {/* Type Filter */}
          <div className="space-y-2">
            <label className="text-sm font-medium text-foreground">Type</label>
            <div className="grid grid-cols-2 gap-2">
              {[
                { value: 'cron', label: '⏰ Cron' },
                { value: 'tool_call', label: '🔧 Tool Call' },
                { value: 'message', label: '💬 Message' },
                { value: 'event', label: '⚡ Event' },
              ].map((option) => (
                <Button
                  key={option.value}
                  variant={
                    filters.type === option.value ? 'default' : 'outline'
                  }
                  size="sm"
                  onClick={() =>
                    handleFilterChange(
                      'type',
                      filters.type === option.value ? undefined : option.value
                    )
                  }
                  className="justify-start"
                  disabled={isLoading}
                >
                  {option.label}
                </Button>
              ))}
            </div>
          </div>

          {/* Agent Filter */}
          <div className="space-y-2">
            <label className="text-sm font-medium text-foreground">Agent</label>
            <div className="flex gap-2">
              {[
                { value: 'main', label: 'Main' },
                { value: 'subagent', label: 'Subagent' },
              ].map((option) => (
                <Button
                  key={option.value}
                  variant={
                    filters.agent === option.value ? 'default' : 'outline'
                  }
                  size="sm"
                  onClick={() =>
                    handleFilterChange(
                      'agent',
                      filters.agent === option.value ? undefined : option.value
                    )
                  }
                  disabled={isLoading}
                >
                  {option.label}
                </Button>
              ))}
            </div>
          </div>

          {/* Date Range Filters */}
          <div className="grid grid-cols-2 gap-3">
            <div className="space-y-2">
              <label className="text-sm font-medium text-foreground">
                From
              </label>
              <input
                type="datetime-local"
                value={filters.dateFrom || ''}
                onChange={(e) =>
                  handleFilterChange(
                    'dateFrom',
                    e.target.value || undefined
                  )
                }
                disabled={isLoading}
                className="w-full px-3 py-2 bg-background border border-border rounded-md text-sm text-foreground placeholder-muted-foreground focus:outline-none focus:ring-2 focus:ring-primary/50"
              />
            </div>
            <div className="space-y-2">
              <label className="text-sm font-medium text-foreground">To</label>
              <input
                type="datetime-local"
                value={filters.dateTo || ''}
                onChange={(e) =>
                  handleFilterChange('dateTo', e.target.value || undefined)
                }
                disabled={isLoading}
                className="w-full px-3 py-2 bg-background border border-border rounded-md text-sm text-foreground placeholder-muted-foreground focus:outline-none focus:ring-2 focus:ring-primary/50"
              />
            </div>
          </div>

          {/* Search Input */}
          <div className="space-y-2">
            <label className="text-sm font-medium text-foreground">
              Search
            </label>
            <div className="relative">
              <input
                type="text"
                placeholder="Search in description..."
                value={filters.search || ''}
                onChange={(e) =>
                  handleFilterChange('search', e.target.value || undefined)
                }
                disabled={isLoading}
                className="w-full px-3 py-2 bg-background border border-border rounded-md text-sm text-foreground placeholder-muted-foreground focus:outline-none focus:ring-2 focus:ring-primary/50"
              />
              {filters.search && (
                <button
                  onClick={() => handleFilterChange('search', undefined)}
                  className="absolute right-2 top-1/2 -translate-y-1/2 text-muted-foreground hover:text-foreground"
                >
                  <X className="w-4 h-4" />
                </button>
              )}
            </div>
          </div>

          {/* Action Buttons */}
          <div className="flex gap-2 pt-2 border-t border-border">
            <Button
              size="sm"
              onClick={handleApply}
              disabled={isLoading}
              className="flex-1"
            >
              Apply Filters
            </Button>
            {activeFilters > 0 && (
              <Button
                variant="outline"
                size="sm"
                onClick={handleReset}
                disabled={isLoading}
                className="flex-1"
              >
                Reset
              </Button>
            )}
          </div>
        </Card>
      )}
    </div>
  );
}
