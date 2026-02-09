export default function LogPage() {
  return (
    <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-8">
      <div className="space-y-8">
        {/* Header */}
        <div>
          <h1 className="text-4xl font-bold text-foreground">Activity Log</h1>
          <p className="text-muted-foreground mt-2">
            Timeline of all actions and events from OpenClaw.
          </p>
        </div>

        {/* Log View */}
        <div className="bg-card border border-border rounded-lg p-6 space-y-4">
          <div className="flex flex-col items-center justify-center py-16">
            <div className="text-center">
              <p className="text-muted-foreground mb-2">No log entries yet</p>
              <p className="text-sm text-muted-foreground">
                Real-time activity logs will appear here in Phase 2
              </p>
            </div>
          </div>
        </div>

        {/* Filters */}
        <div className="bg-card border border-border rounded-lg p-6">
          <h3 className="text-lg font-semibold text-foreground mb-4">Filters</h3>
          <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
            <div>
              <label className="block text-sm font-medium text-foreground mb-2">
                Date Range
              </label>
              <input
                type="date"
                className="w-full px-3 py-2 border border-input rounded-md bg-background text-foreground"
                disabled
              />
            </div>
            <div>
              <label className="block text-sm font-medium text-foreground mb-2">
                Event Type
              </label>
              <select
                className="w-full px-3 py-2 border border-input rounded-md bg-background text-foreground"
                disabled
              >
                <option>All Events</option>
              </select>
            </div>
            <div>
              <label className="block text-sm font-medium text-foreground mb-2">
                Status
              </label>
              <select
                className="w-full px-3 py-2 border border-input rounded-md bg-background text-foreground"
                disabled
              >
                <option>All</option>
              </select>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
}
