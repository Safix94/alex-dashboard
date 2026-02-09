"use client";

import Link from "next/link";
import { Button } from "@/components/ui/button";
import { ArrowLeft } from "lucide-react";

export default function ConfigurationPage() {
  return (
    <div className="max-w-4xl mx-auto px-4 sm:px-6 lg:px-8 py-8">
      <div className="space-y-8">
        {/* Back Button */}
        <Link href="/docs">
          <Button variant="ghost">
            <ArrowLeft className="w-4 h-4 mr-2" />
            Back to Docs
          </Button>
        </Link>

        {/* Content */}
        <article className="prose prose-invert max-w-none">
          <h1 className="text-4xl font-bold text-foreground">Configuration</h1>
          
          <section className="mt-8">
            <h2 className="text-2xl font-semibold text-foreground mt-6 mb-4">Environment Variables</h2>
            <p className="text-muted-foreground mb-4">
              Create a <code>.env.local</code> file in the project root with the following variables:
            </p>
            <div className="bg-muted p-4 rounded-lg mb-4 font-mono text-sm overflow-x-auto">
              <pre className="text-primary whitespace-pre-wrap">{`# Asana Integration
ASANA_API_KEY=your_asana_token
ASANA_PROJECT_GID=your_project_gid

# OpenAI / API Keys
OPENAI_API_KEY=your_openai_key

# Database
DATABASE_URL=file:./.data/alex-dashboard.db

# Polling Intervals (ms)
POLLING_INTERVAL=30000
USAGE_REFRESH_INTERVAL=30000`}</pre>
            </div>
          </section>

          <section className="mt-8">
            <h2 className="text-2xl font-semibold text-foreground mt-6 mb-4">Running Locally</h2>
            <div className="space-y-4 mb-4">
              <div>
                <h3 className="font-semibold text-foreground mb-2">1. Install Dependencies</h3>
                <div className="bg-muted p-4 rounded-lg font-mono text-sm">
                  <pre className="text-primary">npm install</pre>
                </div>
              </div>
              <div>
                <h3 className="font-semibold text-foreground mb-2">2. Setup Environment</h3>
                <div className="bg-muted p-4 rounded-lg font-mono text-sm">
                  <pre className="text-primary">cp .env.example .env.local</pre>
                </div>
                <p className="text-muted-foreground mt-2">Edit <code>.env.local</code> with your API keys.</p>
              </div>
              <div>
                <h3 className="font-semibold text-foreground mb-2">3. Run Development Server</h3>
                <div className="bg-muted p-4 rounded-lg font-mono text-sm">
                  <pre className="text-primary">npm run dev</pre>
                </div>
                <p className="text-muted-foreground mt-2">Open http://localhost:3000 in your browser.</p>
              </div>
            </div>
          </section>

          <section className="mt-8">
            <h2 className="text-2xl font-semibold text-foreground mt-6 mb-4">Production Deployment</h2>
            <p className="text-muted-foreground mb-4">
              This project is configured for deployment on Vercel.
            </p>
            <div className="space-y-4 mb-4">
              <div>
                <h3 className="font-semibold text-foreground mb-2">1. Push to GitHub</h3>
                <p className="text-muted-foreground">Ensure your code is committed to the main branch.</p>
              </div>
              <div>
                <h3 className="font-semibold text-foreground mb-2">2. Connect to Vercel</h3>
                <p className="text-muted-foreground">
                  Import your GitHub repository in Vercel and set up environment variables.
                </p>
              </div>
              <div>
                <h3 className="font-semibold text-foreground mb-2">3. Deploy</h3>
                <p className="text-muted-foreground">
                  Vercel will automatically deploy on every push to main.
                </p>
              </div>
            </div>
          </section>

          <section className="mt-8">
            <h2 className="text-2xl font-semibold text-foreground mt-6 mb-4">Database Setup</h2>
            <p className="text-muted-foreground mb-4">
              The dashboard uses SQLite for activity logs and notes storage.
            </p>
            <p className="text-muted-foreground mb-4">
              Database is automatically initialized on first run. Location: <code>.data/alex-dashboard.db</code>
            </p>
          </section>

          <section className="mt-8">
            <h2 className="text-2xl font-semibold text-foreground mt-6 mb-4">Troubleshooting</h2>
            <div className="space-y-4 mb-4">
              <div>
                <h3 className="font-semibold text-foreground text-sm">Tasks not loading?</h3>
                <p className="text-muted-foreground text-sm">
                  Check that <code>ASANA_API_KEY</code> and <code>ASANA_PROJECT_GID</code> are set correctly.
                </p>
              </div>
              <div>
                <h3 className="font-semibold text-foreground text-sm">Database errors?</h3>
                <p className="text-muted-foreground text-sm">
                  Ensure <code>.data</code> directory exists and is writable. Delete <code>.data/alex-dashboard.db</code> to reset.
                </p>
              </div>
              <div>
                <h3 className="font-semibold text-foreground text-sm">Build failing?</h3>
                <p className="text-muted-foreground text-sm">
                  Run <code>npm run build</code> locally to debug. Check for TypeScript errors.
                </p>
              </div>
            </div>
          </section>
        </article>
      </div>
    </div>
  );
}
