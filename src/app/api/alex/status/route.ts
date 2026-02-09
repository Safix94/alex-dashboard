import { NextResponse } from "next/server";

// Demo statuses for testing different states
const DEMO_STATUSES = [
  {
    status: "ready",
    label: "Klaar voor taken",
    emoji: "🧠",
    lastAction: {
      tool: "asana",
      description: "Loaded 15 tasks",
      timestamp: new Date(Date.now() - 2 * 60000).toISOString(),
      relativeTime: "2m ago",
    },
  },
  {
    status: "working",
    label: "Bezig: github",
    emoji: "🧠",
    lastAction: {
      tool: "github",
      description: "Pushing commit",
      timestamp: new Date(Date.now() - 30000).toISOString(),
      relativeTime: "30s ago",
    },
  },
  {
    status: "thinking",
    label: "Denken…",
    emoji: "🧠",
    lastAction: {
      tool: "reasoning",
      description: "Processing logic",
      timestamp: new Date(Date.now() - 5000).toISOString(),
      relativeTime: "just now",
    },
  },
  {
    status: "idle",
    label: "Wachtend",
    emoji: "🧠",
    lastAction: {
      tool: "system",
      description: "No recent activity",
      timestamp: new Date(Date.now() - 1 * 3600000).toISOString(),
      relativeTime: "1h ago",
    },
  },
];

export async function GET(request: Request) {
  try {
    // Check for demo mode query parameter
    const url = new URL(request.url);
    const demoMode = url.searchParams.get("demo");

    if (demoMode && !isNaN(parseInt(demoMode))) {
      // Return specific demo status
      const index = parseInt(demoMode) % DEMO_STATUSES.length;
      return NextResponse.json(DEMO_STATUSES[index]);
    }

    // Default: Return "ready" status with rotating demo data
    const now = new Date();
    const seconds = now.getSeconds();
    const statusIndex = Math.floor(seconds / 15) % DEMO_STATUSES.length;

    return NextResponse.json(DEMO_STATUSES[statusIndex]);
  } catch (error) {
    return NextResponse.json(
      { 
        status: "error",
        label: "Probleem: API error",
        emoji: "🧠",
        error: error instanceof Error ? error.message : "Failed to fetch status" 
      },
      { status: 500 }
    );
  }
}
