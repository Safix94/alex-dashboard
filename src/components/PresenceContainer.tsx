'use client';

import { PresenceComponent } from '@/components/PresenceComponent';
import { usePresencePolling } from '@/hooks/usePresencePolling';

/**
 * PresenceContainer - Wrapper component that fetches and displays Alex's presence
 * Handles polling logic and updates the UI based on status changes
 */
export function PresenceContainer() {
  const { status, emoji, label, lastAction } = usePresencePolling({
    interval: 15000, // Poll every 15 seconds
    enabled: true,
  });

  return (
    <PresenceComponent
      status={status}
      emoji={emoji}
      label={label}
      lastAction={lastAction}
    />
  );
}
