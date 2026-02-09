"use client";

import { useState, useEffect } from "react";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Badge } from "@/components/ui/badge";
import { ScrollArea } from "@/components/ui/scroll-area";
import { Trash2, Send, Pin } from "lucide-react";

interface Note {
  id: number;
  title: string;
  content: string;
  category: string;
  pinned: number;
  archived: number;
  tags: string | null;
  source: string;
  created_at: string;
  updated_at: string;
}

const CATEGORY_COLORS: Record<string, string> = {
  general: "bg-gray-100 text-gray-700 dark:bg-gray-800 dark:text-gray-300",
  todo: "bg-blue-100 text-blue-700 dark:bg-blue-900 dark:text-blue-300",
  idea: "bg-purple-100 text-purple-700 dark:bg-purple-900 dark:text-purple-300",
  reference: "bg-green-100 text-green-700 dark:bg-green-900 dark:text-green-300",
  memory: "bg-amber-100 text-amber-700 dark:bg-amber-900 dark:text-amber-300",
};

const CATEGORY_ICONS: Record<string, string> = {
  general: "📝",
  todo: "☑️",
  idea: "💡",
  reference: "📌",
  memory: "🧠",
};

export function NotesPanel() {
  const [notes, setNotes] = useState<Note[]>([]);
  const [input, setInput] = useState("");
  const [loading, setLoading] = useState(false);
  const [total, setTotal] = useState(0);

  useEffect(() => {
    fetchNotes();
    const interval = setInterval(fetchNotes, 30000);
    return () => clearInterval(interval);
  }, []);

  const fetchNotes = async () => {
    try {
      const res = await fetch("/api/alex/notes?limit=20");
      if (res.ok) {
        const data = await res.json();
        setNotes(data.entries || []);
        setTotal(data.total || 0);
      }
    } catch (error) {
      console.error("Failed to fetch notes:", error);
    }
  };

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    if (!input.trim()) return;

    setLoading(true);
    try {
      const res = await fetch("/api/alex/notes", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({
          title: input.trim(),
          content: input.trim(),
          category: "general",
          source: "dashboard",
        }),
      });

      if (res.ok) {
        setInput("");
        fetchNotes();
      }
    } catch (error) {
      console.error("Failed to save note:", error);
    } finally {
      setLoading(false);
    }
  };

  const deleteNote = async (id: number) => {
    try {
      const res = await fetch(`/api/alex/notes?id=${id}`, { method: "DELETE" });
      if (res.ok) {
        fetchNotes();
      }
    } catch (error) {
      console.error("Failed to delete note:", error);
    }
  };

  const togglePin = async (note: Note) => {
    try {
      const res = await fetch("/api/alex/notes", {
        method: "PATCH",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({ id: note.id, pinned: !note.pinned }),
      });
      if (res.ok) {
        fetchNotes();
      }
    } catch (error) {
      console.error("Failed to toggle pin:", error);
    }
  };

  return (
    <div className="bg-card border border-border rounded-lg p-6 flex flex-col h-full">
      <div className="flex items-center justify-between mb-4">
        <h3 className="text-lg font-semibold text-foreground">Quick Notes</h3>
        {total > 0 && (
          <span className="text-xs text-muted-foreground">{total} notes</span>
        )}
      </div>

      {/* Input */}
      <form onSubmit={handleSubmit} className="mb-4">
        <div className="flex gap-2">
          <Input
            placeholder="Add a note..."
            value={input}
            onChange={(e) => setInput(e.target.value)}
            disabled={loading}
            className="text-sm"
          />
          <Button
            size="sm"
            type="submit"
            disabled={loading || !input.trim()}
          >
            <Send className="w-4 h-4" />
          </Button>
        </div>
      </form>

      {/* Notes List */}
      <ScrollArea className="flex-1">
        <div className="space-y-2 pr-4">
          {notes.length === 0 ? (
            <p className="text-xs text-muted-foreground text-center py-4">
              No notes yet. Add one to get started.
            </p>
          ) : (
            notes.map((note) => (
              <div
                key={note.id}
                className={`bg-muted p-3 rounded border text-sm space-y-2 ${
                  note.pinned ? "border-amber-400/50" : "border-border"
                }`}
              >
                <div className="flex items-start justify-between gap-2">
                  <div className="flex-1 min-w-0">
                    <p className="text-foreground font-medium break-words">
                      {note.pinned ? "📌 " : ""}
                      {note.title}
                    </p>
                    {note.content !== note.title && (
                      <p className="text-muted-foreground text-xs mt-1 break-words line-clamp-2">
                        {note.content}
                      </p>
                    )}
                  </div>
                  <div className="flex items-center gap-1 shrink-0">
                    <button
                      onClick={() => togglePin(note)}
                      className={`transition ${
                        note.pinned
                          ? "text-amber-500 hover:text-amber-600"
                          : "text-muted-foreground hover:text-foreground"
                      }`}
                      title={note.pinned ? "Unpin" : "Pin"}
                    >
                      <Pin className="w-3 h-3" />
                    </button>
                    <button
                      onClick={() => deleteNote(note.id)}
                      className="text-muted-foreground hover:text-destructive transition"
                      title="Delete"
                    >
                      <Trash2 className="w-3 h-3" />
                    </button>
                  </div>
                </div>
                <div className="flex items-center justify-between">
                  <Badge
                    variant="secondary"
                    className={`text-xs ${CATEGORY_COLORS[note.category] || ""}`}
                  >
                    {CATEGORY_ICONS[note.category] || "📝"} {note.category}
                  </Badge>
                  <span className="text-xs text-muted-foreground">
                    {new Date(note.created_at + "Z").toLocaleString(undefined, {
                      month: "short",
                      day: "numeric",
                      hour: "2-digit",
                      minute: "2-digit",
                    })}
                  </span>
                </div>
                {note.tags && (
                  <div className="flex flex-wrap gap-1">
                    {note.tags.split(",").map((tag) => (
                      <span
                        key={tag}
                        className="text-xs bg-background text-muted-foreground px-1.5 py-0.5 rounded"
                      >
                        #{tag.trim()}
                      </span>
                    ))}
                  </div>
                )}
              </div>
            ))
          )}
        </div>
      </ScrollArea>
    </div>
  );
}
