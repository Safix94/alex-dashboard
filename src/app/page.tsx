import { TaskBoard } from "@/components/TaskBoard";

export default function Dashboard() {
  return (
    <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-8">
      <div className="space-y-8">
        {/* Header */}
        <div>
          <h1 className="text-4xl font-bold text-foreground">Dashboard</h1>
          <p className="text-muted-foreground mt-2">
            Welcome to the Alex Dashboard. This is your personal assistant control center.
          </p>
        </div>

        <TaskBoard />

        {/* Recent Activity */}
        <div className="bg-card border border-border rounded-lg p-6">
          <h2 className="text-2xl font-bold text-foreground">Recent Activity</h2>
          <p className="text-muted-foreground mt-2">No activity yet. Phase 5 will add real-time activity logging.</p>
        </div>
      </div>
    </div>
  );
}
