"use client";

import { format } from "date-fns";
import { Badge } from "@/components/ui/badge";
import { Card, CardContent } from "@/components/ui/card";
import type { BoardColumnId, BoardTask } from "@/hooks/useTasksPolling";

export function TaskCard({
  task,
  column,
}: {
  task: BoardTask;
  column: BoardColumnId;
}) {
  const due = task.due_on ? format(new Date(task.due_on), "dd MMM") : null;

  return (
    <a
      href={task.permalink_url || `https://app.asana.com/0/${task.gid}`}
      target="_blank"
      rel="noreferrer"
      className="block"
    >
      <Card className="hover:bg-muted/40 transition-colors">
        <CardContent className="p-3 space-y-2">
          <div className="text-sm font-medium leading-snug">{task.name}</div>
          <div className="flex items-center justify-between gap-2">
            <Badge variant="secondary" className="text-xs">
              {column === "todo"
                ? "To Do"
                : column === "inprogress"
                  ? "In Progress"
                  : column === "done"
                    ? "Done"
                    : "Archive"}
            </Badge>
            {due ? (
              <div className="text-xs text-muted-foreground">Due {due}</div>
            ) : null}
          </div>
        </CardContent>
      </Card>
    </a>
  );
}
