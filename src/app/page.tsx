"use client";

import { TaskBoard } from "@/components/TaskBoard";
import ActivityLog from "@/components/ActivityLog";
import { NotesPanel } from "@/components/NotesPanel";
import { UsageDisplay } from "@/components/UsageDisplay";
import { useActivityLogPolling } from "@/hooks/useActivityLogPolling";

export default function Dashboard() {
  const {
    entries,
    total,
    isLoading,
    hasMore,
    onLoadMore,
    onRefresh,
  } = useActivityLogPolling({
    interval: 15000,
    limit: 10,
    enabled: true,
  });

  return (
    <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-8">
      <div className="space-y-8">
        {/* Header */}
        <div className="flex items-center justify-between">
          <div>
            <h1 className="text-4xl font-bold text-foreground">Dashboard</h1>
            <p className="text-muted-foreground mt-2">
              Welcome to the Alex Dashboard. This is your personal assistant control center.
            </p>
          </div>
          <UsageDisplay />
        </div>

        {/* Main Grid: Tasks + Notes */}
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-4 md:gap-6">
          {/* Task Board (full on mobile, 2/3 on desktop) */}
          <div className="md:col-span-1 lg:col-span-2">
            <TaskBoard />
          </div>

          {/* Notes Panel (full on mobile, 1/3 on desktop) */}
          <div className="md:col-span-1 lg:col-span-1">
            <NotesPanel />
          </div>
        </div>

        {/* Activity Log (Full Width) */}
        <div>
          <h2 className="text-2xl font-bold text-foreground mb-4">Recent Activity</h2>
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
  );
}
