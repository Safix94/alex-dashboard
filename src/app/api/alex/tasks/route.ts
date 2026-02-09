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
