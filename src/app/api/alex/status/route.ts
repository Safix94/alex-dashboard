import { NextResponse } from "next/server";

export async function GET() {
  try {
    // Phase 2: Implement actual status checking from OpenClaw
    const status = {
      status: "online",
      uptime: "99.9%",
      lastCheck: new Date().toISOString(),
      message: "Phase 1: Stub implementation",
    };

    return NextResponse.json(status);
  } catch (error) {
    return NextResponse.json(
      { error: "Failed to fetch status" },
      { status: 500 }
    );
  }
}
