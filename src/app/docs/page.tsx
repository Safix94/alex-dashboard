export default function DocsPage() {
  return (
    <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-8">
      <div className="space-y-8">
        {/* Header */}
        <div>
          <h1 className="text-4xl font-bold text-foreground">Documentation</h1>
          <p className="text-muted-foreground mt-2">
            Learn how to use the Alex Dashboard and OpenClaw integration.
          </p>
        </div>

        {/* Coming Soon */}
        <div className="bg-card border border-border rounded-lg p-8 text-center">
          <h2 className="text-2xl font-semibold text-foreground mb-2">
            Docs Viewer Coming Soon
          </h2>
          <p className="text-muted-foreground">
            This feature will be implemented in Phase 6. For now, check the README files in the project.
          </p>
        </div>
      </div>
    </div>
  );
}
