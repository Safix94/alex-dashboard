import { NextResponse } from "next/server";

export async function GET() {
  // Stub — will be connected to real telemetry in a later phase
  return NextResponse.json({
    tokens: 0,
    cost: 0,
    model: "unknown",
  });
}
