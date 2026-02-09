import { NextResponse } from "next/server";

export async function GET() {
  try {
    // Phase 2: Implement actual task fetching from OpenClaw/Asana
    const tasks = {
      total: 0,
      pending: [],
      completed: [],
      message: "Phase 1: Stub implementation",
    };

    return NextResponse.json(tasks);
  } catch (error) {
    return NextResponse.json(
      { error: "Failed to fetch tasks" },
      { status: 500 }
    );
  }
}
