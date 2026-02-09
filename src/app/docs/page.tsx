export default function DocsPage() {
  return (
    <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-8">
      <div className="space-y-8">
        {/* Header */}
        <div>
          <h1 className="text-4xl font-bold text-foreground">Documentation</h1>
          <p className="text-muted-foreground mt-2">
            Learn how to use Alex Dashboard and OpenClaw integrations.
          </p>
        </div>

        {/* Documentation Sections */}
        <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
          {[
            {
              title: "Getting Started",
              description: "Learn the basics of Alex Dashboard",
              icon: "🚀",
            },
            {
              title: "API Reference",
              description: "Complete API documentation",
              icon: "📚",
            },
            {
              title: "Configuration",
              description: "Setup and configure your dashboard",
              icon: "⚙️",
            },
            {
              title: "Advanced Usage",
              description: "Advanced features and customization",
              icon: "🔧",
            },
          ].map((doc) => (
            <div
              key={doc.title}
              className="bg-card border border-border rounded-lg p-6 hover:border-primary transition-colors cursor-pointer"
            >
              <div className="text-3xl mb-3">{doc.icon}</div>
              <h3 className="text-xl font-semibold text-foreground">{doc.title}</h3>
              <p className="text-muted-foreground mt-2">{doc.description}</p>
              <button className="mt-4 px-4 py-2 bg-primary text-primary-foreground rounded-md hover:opacity-90 transition-opacity disabled:opacity-50 cursor-not-allowed">
                Read More
              </button>
            </div>
          ))}
        </div>

        {/* Quick Links */}
        <div className="bg-card border border-border rounded-lg p-6">
          <h2 className="text-2xl font-bold text-foreground mb-4">Quick Links</h2>
          <ul className="space-y-3">
            <li>
              <a href="#" className="text-primary hover:underline">
                → View OpenClaw Documentation
              </a>
            </li>
            <li>
              <a href="#" className="text-primary hover:underline">
                → GitHub Repository
              </a>
            </li>
            <li>
              <a href="#" className="text-primary hover:underline">
                → Report an Issue
              </a>
            </li>
          </ul>
        </div>
      </div>
    </div>
  );
}
