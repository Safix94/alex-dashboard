import { NextResponse } from "next/server";
import {
  getProjectSectionMap,
  listTasksBySection,
  moveTaskToSection,
} from "@/lib/asana";

const PROJECT_GID = "1213167484617812";

export type BoardColumnId = "todo" | "inprogress" | "done" | "archive";

function parseColumnId(v: unknown): BoardColumnId {
  if (v === "todo" || v === "inprogress" || v === "done" || v === "archive") return v;
  throw new Error("Invalid column id");
}

export async function GET() {
  try {
    const sectionMap = await getProjectSectionMap(PROJECT_GID);
    const grouped = await listTasksBySection({
      projectGid: PROJECT_GID,
      sectionMap,
    });

    return NextResponse.json({
      projectGid: PROJECT_GID,
      sections: sectionMap,
      tasks: grouped,
      fetchedAt: new Date().toISOString(),
    });
  } catch (error) {
    const message = error instanceof Error ? error.message : "Unknown error";
    
    // Fallback to mock data if Asana unavailable (e.g., ASANA_PAT not set on Vercel)
    if (message.includes("Missing env var") || message.includes("Asana")) {
      console.warn("Asana API unavailable, returning mock data:", message);
      
      const mockSectionMap = {
        todo: { gid: "1", name: "To Do" },
        inprogress: { gid: "2", name: "In Progress" },
        done: { gid: "3", name: "Done" },
        archive: { gid: "4", name: "Archive" },
      };

      const mockTasks = {
        todo: [
          {
            gid: "t1",
            name: "Setup dashboard on Vercel",
            due_on: new Date(Date.now() + 3 * 24 * 60 * 60 * 1000).toISOString().split("T")[0],
            completed: false,
          },
          {
            gid: "t2",
            name: "Configure Asana API",
            due_on: null,
            completed: false,
          },
        ],
        inprogress: [
          {
            gid: "t3",
            name: "Fix Activity Log on Vercel",
            due_on: new Date().toISOString().split("T")[0],
            completed: false,
          },
        ],
        done: [
          {
            gid: "t4",
            name: "Phase 1: Project Setup",
            due_on: new Date(Date.now() - 5 * 24 * 60 * 60 * 1000).toISOString().split("T")[0],
            completed: true,
          },
          {
            gid: "t5",
            name: "Phase 5: Activity Log",
            due_on: new Date(Date.now() - 1 * 24 * 60 * 60 * 1000).toISOString().split("T")[0],
            completed: true,
          },
        ],
        archive: [],
      };

      return NextResponse.json({
        projectGid: PROJECT_GID,
        sections: mockSectionMap,
        tasks: mockTasks,
        fetchedAt: new Date().toISOString(),
        mock: true,
      });
    }

    return NextResponse.json(
      { error: "Failed to fetch tasks", message },
      { status: 500 }
    );
  }
}

export async function PATCH(req: Request) {
  try {
    const body = (await req.json()) as {
      taskGid?: string;
      toColumn?: BoardColumnId;
    };

    if (!body?.taskGid) {
      return NextResponse.json({ error: "taskGid is required" }, { status: 400 });
    }

    const toColumn = parseColumnId(body.toColumn);
    const sectionMap = await getProjectSectionMap(PROJECT_GID);
    const targetSectionGid = sectionMap[toColumn].gid;

    await moveTaskToSection({
      projectGid: PROJECT_GID,
      taskGid: body.taskGid,
      sectionGid: targetSectionGid,
    });

    return NextResponse.json({ ok: true });
  } catch (error) {
    const message = error instanceof Error ? error.message : "Unknown error";
    return NextResponse.json(
      { error: "Failed to move task", message },
      { status: 500 }
    );
  }
}
