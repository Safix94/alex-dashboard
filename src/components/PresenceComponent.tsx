'use client';

import { PresenceStatus } from '@/lib/statusMapper';
import '@/styles/presence-animations.css';

interface LastAction {
  tool: string;
  description?: string;
  timestamp: string;
  relativeTime: string;
}

interface PresenceComponentProps {
  status: PresenceStatus;
  emoji: string;
  label: string;
  lastAction?: LastAction;
}

/**
 * Presence Component - Shows Alex's current status with animated emoji
 * 
 * Status States:
 * - ready: Static brain, pulsing gold glow
 * - working: Bouncing brain, brighter gold
 * - thinking: Sparkle effect, purple glow
 * - idle: Dimmed brain, soft glow
 * - error: Red tint, shaking, red glow
 */
export function PresenceComponent({
  status,
  emoji,
  label,
  lastAction,
}: PresenceComponentProps) {
  // Get status dot color
  const getStatusDotColor = (): string => {
    switch (status) {
      case 'ready':
        return 'bg-green-500';
      case 'working':
        return 'bg-blue-500';
      case 'thinking':
        return 'bg-purple-500';
      case 'idle':
        return 'bg-yellow-500';
      case 'error':
        return 'bg-red-500';
      default:
        return 'bg-gray-500';
    }
  };

  return (
    <div className="fixed left-0 top-16 w-[200px] h-screen bg-card border-r border-border p-4 flex flex-col items-center z-40">
      {/* Glow Ring Container */}
      <div className={`relative w-32 h-32 rounded-full flex items-center justify-center mb-4 presence-glow--${status}`}>
        {/* Emoji with animation */}
        <div
          className={`text-6xl select-none presence-emoji--${status}`}
          role="img"
          aria-label={label}
        >
          {emoji}
        </div>

        {/* Status Dot (top-right) */}
        <div
          className={`absolute top-2 right-2 w-4 h-4 rounded-full ${getStatusDotColor()} ring-2 ring-background`}
          aria-label={`Status: ${status}`}
        />
      </div>

      {/* Name */}
      <h2 className="text-sm font-semibold text-foreground mb-1">Alex</h2>

      {/* Status Label */}
      <p className="text-xs text-muted-foreground text-center mb-4 line-clamp-2">
        {label}
      </p>

      {/* Last Action (if available) */}
      {lastAction && (
        <div className="w-full mt-auto pt-4 border-t border-border text-center">
          <p className="text-xs font-medium text-muted-foreground mb-1">
            Last: <span className="capitalize">{lastAction.tool}</span>
          </p>
          <p className="text-xs text-muted-foreground">
            @{lastAction.relativeTime}
          </p>
          {lastAction.description && (
            <p className="text-xs text-muted-foreground mt-1 line-clamp-2">
              {lastAction.description}
            </p>
          )}
        </div>
      )}
    </div>
  );
}
