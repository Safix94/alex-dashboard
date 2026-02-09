"use client";

import Link from "next/link";
import { Button } from "@/components/ui/button";
import { ArrowLeft } from "lucide-react";

export default function APIReferencePage() {
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
          <h1 className="text-4xl font-bold text-foreground">API Reference</h1>
          
          <section className="mt-8">
            <h2 className="text-2xl font-semibold text-foreground mt-6 mb-4">Available Endpoints</h2>
            <p className="text-muted-foreground mb-4">
              The Alex Dashboard exposes several API endpoints for managing tasks, activity logs, usage metrics, and notes.
            </p>
          </section>

          <section className="mt-8">
            <h3 className="text-xl font-semibold text-foreground mb-4">Tasks API</h3>
            <div className="bg-muted p-4 rounded-lg mb-4 font-mono text-sm">
              <p className="text-primary">GET /api/alex/tasks</p>
            </div>
            <p className="text-muted-foreground mb-4">
              Fetch all tasks from the board, organized by column (todo, inprogress, done, archive).
            </p>
            <div className="bg-muted p-4 rounded-lg mb-4 font-mono text-sm">
              <p className="text-primary">PATCH /api/alex/tasks</p>
            </div>
            <p className="text-muted-foreground mb-4">
              Move a task to a different column. Updates Asana automatically.
            </p>
          </section>

          <section className="mt-8">
            <h3 className="text-xl font-semibold text-foreground mb-4">Activity Log API</h3>
            <div className="bg-muted p-4 rounded-lg mb-4 font-mono text-sm">
              <p className="text-primary">GET /api/alex/log</p>
            </div>
            <p className="text-muted-foreground mb-4">
              Fetch activity logs with optional filtering by type, agent, date range, and search terms.
            </p>
            <p className="text-muted-foreground mb-4">
              <strong>Query Parameters:</strong>
            </p>
            <ul className="list-disc list-inside text-muted-foreground space-y-1 mb-4">
              <li><code>type</code> - Filter by log type (message, tool_call, cron, event)</li>
              <li><code>agent</code> - Filter by agent (main, subagent)</li>
              <li><code>search</code> - Full-text search</li>
              <li><code>limit</code> - Number of entries (default: 50)</li>
              <li><code>offset</code> - Pagination offset</li>
            </ul>
          </section>

          <section className="mt-8">
            <h3 className="text-xl font-semibold text-foreground mb-4">Usage API</h3>
            <div className="bg-muted p-4 rounded-lg mb-4 font-mono text-sm">
              <p className="text-primary">GET /api/alex/usage</p>
            </div>
            <p className="text-muted-foreground mb-4">
              Get real-time usage statistics: tokens used, API calls, and estimated costs.
            </p>
          </section>

          <section className="mt-8">
            <h3 className="text-xl font-semibold text-foreground mb-4">Notes API</h3>
            <div className="bg-muted p-4 rounded-lg mb-4 font-mono text-sm">
              <p className="text-primary">GET /api/alex/notes</p>
            </div>
            <p className="text-muted-foreground mb-4">Fetch saved notes.</p>
            <div className="bg-muted p-4 rounded-lg mb-4 font-mono text-sm">
              <p className="text-primary">POST /api/alex/notes</p>
            </div>
            <p className="text-muted-foreground mb-4">Create a new note.</p>
          </section>

          <section className="mt-8">
            <h2 className="text-2xl font-semibold text-foreground mt-6 mb-4">Authentication</h2>
            <p className="text-muted-foreground mb-4">
              All endpoints are currently accessible without authentication. In production, implement OAuth2 or API key authentication.
            </p>
          </section>
        </article>
      </div>
    </div>
  );
}
