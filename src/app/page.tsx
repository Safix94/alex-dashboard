"use client";

import { TaskBoard } from "@/components/TaskBoard";
import ActivityLog from "@/components/ActivityLog";
import { NotesPanel } from "@/components/NotesPanel";
import { UsageDisplay } from "@/components/UsageDisplay";

export default function Dashboard() {
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
        <div className="grid grid-cols-1 lg:grid-cols-3 gap-6">
          {/* Task Board (2/3 width) */}
          <div className="lg:col-span-2">
            <TaskBoard />
          </div>

          {/* Notes Panel (1/3 width) */}
          <div className="lg:col-span-1">
            <NotesPanel />
          </div>
        </div>

        {/* Activity Log (Full Width) */}
        <div>
          <h2 className="text-2xl font-bold text-foreground mb-4">Recent Activity</h2>
          <ActivityLog
            entries={[]}
            total={0}
            isLoading={false}
            hasMore={false}
          />
        </div>
      </div>
    </div>
  );
}
