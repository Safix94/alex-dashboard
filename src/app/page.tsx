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

        {/* Status Cards Grid */}
        <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
          <div className="bg-card border border-border rounded-lg p-6">
            <h3 className="text-lg font-semibold text-foreground">Status</h3>
            <p className="text-muted-foreground text-sm mt-1">System status will appear here</p>
            <div className="mt-4 text-3xl font-bold text-primary">—</div>
          </div>

          <div className="bg-card border border-border rounded-lg p-6">
            <h3 className="text-lg font-semibold text-foreground">Tasks</h3>
            <p className="text-muted-foreground text-sm mt-1">Pending tasks from OpenClaw</p>
            <div className="mt-4 text-3xl font-bold text-secondary">0</div>
          </div>

          <div className="bg-card border border-border rounded-lg p-6">
            <h3 className="text-lg font-semibold text-foreground">Uptime</h3>
            <p className="text-muted-foreground text-sm mt-1">System availability</p>
            <div className="mt-4 text-3xl font-bold text-accent">—</div>
          </div>
        </div>

        {/* Recent Activity */}
        <div className="bg-card border border-border rounded-lg p-6">
          <h2 className="text-2xl font-bold text-foreground">Recent Activity</h2>
          <p className="text-muted-foreground mt-2">No activity yet. Phase 2 will add real data.</p>
        </div>
      </div>
    </div>
  );
}
