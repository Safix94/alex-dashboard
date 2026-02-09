'use client';

import { PresenceComponent } from '@/components/PresenceComponent';
import { usePresencePolling } from '@/hooks/usePresencePolling';

export function Sidebar() {
  const { status, emoji, label, lastAction } = usePresencePolling({
    interval: 15000,
    enabled: true,
  });

  return (
    <aside className="fixed left-0 top-16 w-[200px] h-[calc(100vh-64px)] bg-sidebar border-r border-border p-4 flex flex-col gap-8 overflow-y-auto z-40">
      {/* Presence Component */}
      <div>
        <PresenceComponent
          status={status}
          emoji={emoji}
          label={label}
          lastAction={lastAction}
        />
      </div>

      {/* Divider */}
      <div className="border-t border-border" />

      {/* Notes Panel Placeholder */}
      <div className="flex-1 flex flex-col gap-2">
        <h3 className="text-sm font-semibold text-foreground">Notes</h3>
        <p className="text-xs text-muted-foreground">
          [Notes panel coming in Phase 7]
        </p>
      </div>
    </aside>
  );
}
