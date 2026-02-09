import { NextResponse } from "next/server";
import db, { fetchActivityLogs, addActivityLog, ActivityLog } from "@/lib/db";

export async function GET(request: Request) {
  try {
    const { searchParams } = new URL(request.url);

    const type = searchParams.get("type") || undefined;
    const agent = searchParams.get("agent") || undefined;
    const dateFrom = searchParams.get("dateFrom") || undefined;
    const dateTo = searchParams.get("dateTo") || undefined;
    const search = searchParams.get("search") || undefined;
    const limit = parseInt(searchParams.get("limit") || "50");
    const offset = parseInt(searchParams.get("offset") || "0");

    const result = fetchActivityLogs({
      type,
      agent,
      dateFrom,
      dateTo,
      search,
      limit,
      offset,
    });

    return NextResponse.json(result);
  } catch (error) {
    console.error("Failed to fetch logs:", error);
    return NextResponse.json(
      { error: "Failed to fetch logs" },
      { status: 500 }
    );
  }
}

export async function POST(request: Request) {
  try {
    const body = await request.json();

    const {
      type,
      agent,
      icon,
      description,
      details_json,
    }: ActivityLog = body;

    // Validate required fields
    if (!type || !agent || !description) {
      return NextResponse.json(
        { error: "Missing required fields: type, agent, description" },
        { status: 400 }
      );
    }

    // Validate enum values
    if (!["cron", "tool_call", "message", "event"].includes(type)) {
      return NextResponse.json(
        { error: "Invalid type. Must be: cron, tool_call, message, event" },
        { status: 400 }
      );
    }

    if (!["main", "subagent"].includes(agent)) {
      return NextResponse.json(
        { error: "Invalid agent. Must be: main, subagent" },
        { status: 400 }
      );
    }

    // Add log entry
    const id = addActivityLog({
      type: type as "cron" | "tool_call" | "message" | "event",
      agent: agent as "main" | "subagent",
      icon,
      description,
      details_json,
    });

    return NextResponse.json(
      { id, message: "Activity log entry created" },
      { status: 201 }
    );
  } catch (error) {
    console.error("Failed to create activity log:", error);
    return NextResponse.json(
      { error: "Failed to create activity log" },
      { status: 500 }
    );
  }
}
