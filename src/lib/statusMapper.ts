export type PresenceStatus = 'ready' | 'working' | 'thinking' | 'idle' | 'error';

export interface PresenceState {
  status: PresenceStatus;
  label: string;
  emoji: string;
  lastAction?: {
    tool: string;
    description?: string;
    timestamp: string;
    relativeTime: string;
  };
}

export interface ApiStatusResponse {
  status?: string;
  label?: string;
  emoji?: string;
  lastAction?: {
    tool?: string;
    description?: string;
    timestamp?: string;
    relativeTime?: string;
  };
  error?: string;
}

const statusLabels: Record<PresenceStatus, string> = {
  ready: 'Klaar voor taken',
  working: 'Bezig',
  thinking: 'Denken…',
  idle: 'Wachtend',
  error: 'Probleem',
};

/**
 * Maps API response to component state
 * Handles various API response formats and provides sensible defaults
 */
export function mapApiToPresence(apiResponse: ApiStatusResponse): PresenceState {
  // Determine status
  let status: PresenceStatus = 'ready';
  
  if (apiResponse.error) {
    status = 'error';
  } else if (apiResponse.status) {
    const statusMap: Record<string, PresenceStatus> = {
      ready: 'ready',
      online: 'ready',
      working: 'working',
      active: 'working',
      thinking: 'thinking',
      processing: 'thinking',
      idle: 'idle',
      offline: 'idle',
      error: 'error',
    };
    status = statusMap[apiResponse.status.toLowerCase()] || 'ready';
  }

  // Determine label
  let label = apiResponse.label || statusLabels[status];
  if (status === 'working' && apiResponse.lastAction?.tool) {
    label = `${statusLabels[status]}: ${apiResponse.lastAction.tool}`;
  }
  if (status === 'error' && apiResponse.error) {
    label = `${statusLabels[status]}: ${apiResponse.error}`;
  }

  const presenceState: PresenceState = {
    status,
    label,
    emoji: apiResponse.emoji || '🧠',
    ...(apiResponse.lastAction && {
      lastAction: {
        tool: apiResponse.lastAction.tool || 'unknown',
        description: apiResponse.lastAction.description,
        timestamp: apiResponse.lastAction.timestamp || new Date().toISOString(),
        relativeTime: apiResponse.lastAction.relativeTime || 'just now',
      },
    }),
  };

  return presenceState;
}

/**
 * Calculates relative time from ISO timestamp
 * e.g., "2m ago", "1h ago", "just now"
 */
export function getRelativeTime(timestamp: string | Date): string {
  const date = typeof timestamp === 'string' ? new Date(timestamp) : timestamp;
  const now = new Date();
  const secondsAgo = Math.floor((now.getTime() - date.getTime()) / 1000);

  if (secondsAgo < 30) return 'just now';
  if (secondsAgo < 60) return `${secondsAgo}s ago`;
  
  const minutesAgo = Math.floor(secondsAgo / 60);
  if (minutesAgo < 60) return `${minutesAgo}m ago`;
  
  const hoursAgo = Math.floor(minutesAgo / 60);
  if (hoursAgo < 24) return `${hoursAgo}h ago`;
  
  const daysAgo = Math.floor(hoursAgo / 24);
  return `${daysAgo}d ago`;
}
