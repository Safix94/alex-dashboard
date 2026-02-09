"use client";

import Link from "next/link";
import { Button } from "@/components/ui/button";
import { ArrowLeft } from "lucide-react";

export default function GettingStartedPage() {
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
          <h1 className="text-4xl font-bold text-foreground">Getting Started</h1>
          
          <section className="mt-8">
            <h2 className="text-2xl font-semibold text-foreground mt-6 mb-4">Welcome to Alex Dashboard</h2>
            <p className="text-muted-foreground mb-4">
              The Alex Dashboard is your personal assistant's control center. It provides real-time visibility into your AI assistant's activities, task management, and usage tracking.
            </p>
          </section>

          <section className="mt-8">
            <h2 className="text-2xl font-semibold text-foreground mt-6 mb-4">Key Features</h2>
            <ul className="list-disc list-inside text-muted-foreground space-y-2 mb-4">
              <li><strong>Task Board:</strong> Kanban-style task management synced with Asana</li>
              <li><strong>Activity Log:</strong> Real-time timeline of all actions and events</li>
              <li><strong>Usage Display:</strong> Track tokens, API calls, and estimated costs</li>
              <li><strong>Docs Viewer:</strong> Built-in documentation with search and navigation</li>
              <li><strong>Notes Panel:</strong> Quick notes with automatic status tracking</li>
              <li><strong>Subagent Indicator:</strong> Monitor when subagents are working</li>
              <li><strong>Mobile Responsive:</strong> Works seamlessly on all devices</li>
            </ul>
          </section>

          <section className="mt-8">
            <h2 className="text-2xl font-semibold text-foreground mt-6 mb-4">Dashboard Tabs</h2>
            <div className="space-y-4 mb-4">
              <div>
                <h3 className="font-semibold text-foreground">Dashboard</h3>
                <p className="text-muted-foreground">Main view with task board, recent activity, and status indicators.</p>
              </div>
              <div>
                <h3 className="font-semibold text-foreground">Docs</h3>
                <p className="text-muted-foreground">Documentation and guides for using the Dashboard.</p>
              </div>
              <div>
                <h3 className="font-semibold text-foreground">Log</h3>
                <p className="text-muted-foreground">Complete activity log with filtering and search capabilities.</p>
              </div>
            </div>
          </section>

          <section className="mt-8">
            <h2 className="text-2xl font-semibold text-foreground mt-6 mb-4">Next Steps</h2>
            <ol className="list-decimal list-inside text-muted-foreground space-y-2 mb-4">
              <li>Explore the Task Board to manage your tasks</li>
              <li>Check the Activity Log to see what's happening</li>
              <li>Monitor Usage Display for cost tracking</li>
              <li>Read the API Reference for integration details</li>
            </ol>
          </section>
        </article>
      </div>
    </div>
  );
}
