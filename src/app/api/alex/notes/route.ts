import { NextResponse } from "next/server";
import {
  fetchNotes,
  addNote,
  updateNote,
  deleteNote,
  getNoteById,
  type Note,
  type NoteCategory,
} from "@/lib/db";

const VALID_CATEGORIES: NoteCategory[] = [
  "general",
  "todo",
  "idea",
  "reference",
  "memory",
];

export async function GET(request: Request) {
  try {
    const { searchParams } = new URL(request.url);

    const category = searchParams.get("category") || undefined;
    const search = searchParams.get("search") || undefined;
    const limit = parseInt(searchParams.get("limit") || "50");
    const offset = parseInt(searchParams.get("offset") || "0");

    const pinned = searchParams.has("pinned")
      ? searchParams.get("pinned") === "true"
      : undefined;

    const archived = searchParams.has("archived")
      ? searchParams.get("archived") === "true"
      : undefined;

    const result = fetchNotes({
      category,
      pinned,
      archived,
      search,
      limit,
      offset,
    });

    return NextResponse.json(result);
  } catch (error) {
    console.error("Failed to fetch notes:", error);
    return NextResponse.json(
      { error: "Failed to fetch notes" },
      { status: 500 }
    );
  }
}

export async function POST(request: Request) {
  try {
    const body = await request.json();

    const { title, content, category, pinned, tags, source } = body as Partial<Note>;

    // Validate required fields
    if (!title || !content) {
      return NextResponse.json(
        { error: "Missing required fields: title, content" },
        { status: 400 }
      );
    }

    // Validate category if provided
    if (category && !VALID_CATEGORIES.includes(category)) {
      return NextResponse.json(
        {
          error: `Invalid category. Must be one of: ${VALID_CATEGORIES.join(", ")}`,
        },
        { status: 400 }
      );
    }

    const id = addNote({
      title,
      content,
      category: category || "general",
      pinned: pinned ? 1 : 0,
      tags: tags || null,
      source: source || "api",
    });

    const note = getNoteById(id);

    return NextResponse.json(
      { id, message: "Note created", note },
      { status: 201 }
    );
  } catch (error) {
    console.error("Failed to create note:", error);
    return NextResponse.json(
      { error: "Failed to create note" },
      { status: 500 }
    );
  }
}

export async function PATCH(request: Request) {
  try {
    const body = await request.json();
    const { id, ...updates } = body;

    if (!id || typeof id !== "number") {
      return NextResponse.json(
        { error: "Missing or invalid id (must be a number)" },
        { status: 400 }
      );
    }

    // Validate category if provided
    if (updates.category && !VALID_CATEGORIES.includes(updates.category)) {
      return NextResponse.json(
        {
          error: `Invalid category. Must be one of: ${VALID_CATEGORIES.join(", ")}`,
        },
        { status: 400 }
      );
    }

    const success = updateNote(id, updates);

    if (!success) {
      return NextResponse.json(
        { error: "Note not found or no changes made" },
        { status: 404 }
      );
    }

    const note = getNoteById(id);
    return NextResponse.json({ message: "Note updated", note });
  } catch (error) {
    console.error("Failed to update note:", error);
    return NextResponse.json(
      { error: "Failed to update note" },
      { status: 500 }
    );
  }
}

export async function DELETE(request: Request) {
  try {
    const { searchParams } = new URL(request.url);
    const id = parseInt(searchParams.get("id") || "");

    if (isNaN(id)) {
      return NextResponse.json(
        { error: "Missing or invalid id parameter" },
        { status: 400 }
      );
    }

    const success = deleteNote(id);

    if (!success) {
      return NextResponse.json(
        { error: "Note not found" },
        { status: 404 }
      );
    }

    return NextResponse.json({ message: "Note deleted", id });
  } catch (error) {
    console.error("Failed to delete note:", error);
    return NextResponse.json(
      { error: "Failed to delete note" },
      { status: 500 }
    );
  }
}
