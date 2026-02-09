'use client';

import React, { useState } from 'react';
import { formatDistanceToNow, format } from 'date-fns';
import { nl } from 'date-fns/locale';
import { ChevronDown, RefreshCw } from 'lucide-react';
import { Badge } from '@/components/ui/badge';
import { Button } from '@/components/ui/button';
import { ScrollArea } from '@/components/ui/scroll-area';

export interface ActivityLogEntry {
  id: number;
  timestamp: string;
  type: 'cron' | 'tool_call' | 'message' | 'event';
  agent: 'main' | 'subagent';
  icon?: string;
  description: string;
  details_json?: string;
}

interface ActivityLogProps {
  entries: ActivityLogEntry[];
  total: number;
  isLoading?: boolean;
  onLoadMore?: () => void;
  onRefresh?: () => void;
  hasMore?: boolean;
}

// Type icons mapping
const typeIcons: Record<string, string> = {
  cron: '⏰',
  tool_call: '🔧',
  message: '💬',
  event: '⚡',
};

// Agent labels
const agentLabels: Record<string, string> = {
  main: 'main',
  subagent: 'subagent',
};

export default function ActivityLog({
  entries,
  total,
  isLoading = false,
  onLoadMore,
  onRefresh,
  hasMore = true,
}: ActivityLogProps) {
  const [expandedId, setExpandedId] = useState<number | null>(null);

  const toggleExpanded = (id: number) => {
    setExpandedId(expandedId === id ? null : id);
  };

  // Format time as HH:MM
  const formatTime = (timestamp: string): string => {
    return format(new Date(timestamp), 'HH:mm');
  };

  return (
    <div className="w-full h-full flex flex-col gap-4">
      {/* Header with controls */}
      <div className="flex items-center justify-between px-1">
        <div className="flex items-center gap-2">
          <h2 className="text-lg font-semibold text-foreground">
            Activity Timeline
          </h2>
          <Badge variant="outline" className="font-mono">
            {total} total
          </Badge>
        </div>
        <Button
          variant="ghost"
          size="sm"
          onClick={onRefresh}
          disabled={isLoading}
          className="gap-2"
        >
          <RefreshCw
            className={`w-4 h-4 ${isLoading ? 'animate-spin' : ''}`}
          />
          <span className="hidden sm:inline">Refresh</span>
        </Button>
      </div>

      {/* Timeline */}
      <ScrollArea className="flex-1 h-[600px] pr-4">
        <div className="space-y-2 pb-4">
          {entries.length === 0 ? (
            <div className="flex flex-col items-center justify-center py-12 text-center">
              <p className="text-muted-foreground text-sm">
                {isLoading ? 'Laden...' : 'Geen activity logs gevonden'}
              </p>
            </div>
          ) : (
            entries.map((entry) => {
              const icon = typeIcons[entry.type] || '📝';
              const time = formatTime(entry.timestamp);
              const agent = agentLabels[entry.agent];
              const fullTime = format(
                new Date(entry.timestamp),
                'PPP HH:mm:ss'
              );

              return (
                <div
                  key={entry.id}
                  onClick={() => toggleExpanded(entry.id)}
                  className={`
                    px-3 py-2 rounded-lg border transition-all duration-200 cursor-pointer
                    font-mono text-sm
                    ${
                      expandedId === entry.id
                        ? 'bg-primary/10 border-primary/50 shadow-md'
                        : 'bg-card/50 border-border hover:bg-card hover:border-primary/30'
                    }
                  `}
                  title={fullTime}
                >
                  {/* Main line: [icon time] description (agent) ✅/status */}
                  <div className="flex items-start justify-between gap-2">
                    <div className="flex-1 min-w-0">
                      <span className="text-xs text-muted-foreground">
                        [
                        <span className="text-base align-middle">{icon}</span>
                        <span className="text-foreground font-semibold">
                          {' '}
                          {time}
                        </span>
                        ]
                      </span>
                      <span className="text-foreground ml-1 break-words">
                        {entry.description}
                      </span>
                      <span className="text-muted-foreground ml-1">
                        ({agent})
                      </span>
                    </div>

                    {/* Status indicator or expand arrow */}
                    {entry.details_json ? (
                      <ChevronDown
                        className={`w-4 h-4 text-muted-foreground flex-shrink-0 transition-transform duration-200 mt-0.5 ${
                          expandedId === entry.id ? 'rotate-180' : ''
                        }`}
                      />
                    ) : (
                      <span className="text-lg flex-shrink-0">✅</span>
                    )}
                  </div>

                  {/* Expanded details */}
                  {expandedId === entry.id && entry.details_json && (
                    <div className="mt-2 pt-2 border-t border-border/50">
                      <pre className="text-xs bg-muted/30 p-2 rounded overflow-x-auto text-muted-foreground max-h-48 overflow-y-auto">
                        {JSON.stringify(JSON.parse(entry.details_json), null, 2)}
                      </pre>
                    </div>
                  )}
                </div>
              );
            })
          )}
        </div>
      </ScrollArea>

      {/* Load More Button */}
      {hasMore && entries.length > 0 && (
        <div className="flex justify-center pt-2 border-t border-border">
          <Button
            variant="outline"
            size="sm"
            onClick={onLoadMore}
            disabled={isLoading}
            className="gap-2"
          >
            {isLoading ? (
              <>
                <span className="inline-block w-4 h-4 border-2 border-current border-t-transparent rounded-full animate-spin" />
                Laden...
              </>
            ) : (
              'Meer laden'
            )}
          </Button>
        </div>
      )}
    </div>
  );
}
