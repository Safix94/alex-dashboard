"use client";

import { useCallback, useMemo, useState } from "react";
import {
  DndContext,
  DragEndEvent,
  DragOverlay,
  PointerSensor,
  useSensor,
  useSensors,
} from "@dnd-kit/core";
import {
  SortableContext,
  verticalListSortingStrategy,
  useSortable,
} from "@dnd-kit/sortable";
import { CSS } from "@dnd-kit/utilities";

import { Button } from "@/components/ui/button";
import { ScrollArea } from "@/components/ui/scroll-area";
import { Separator } from "@/components/ui/separator";
import { TaskCard } from "@/components/TaskCard";
import type { BoardColumnId, BoardTask } from "@/hooks/useTasksPolling";
import { useTasksPolling } from "@/hooks/useTasksPolling";

const columns: Array<{ id: BoardColumnId; title: string }> = [
  { id: "todo", title: "To Do" },
  { id: "inprogress", title: "In Progress" },
  { id: "done", title: "Done" },
  { id: "archive", title: "Archive" },
];

function Column({
  id,
  title,
  tasks,
}: {
  id: BoardColumnId;
  title: string;
  tasks: BoardTask[];
}) {
  return (
    <div className="rounded-lg border bg-card flex flex-col min-h-[420px]">
      <div className="p-3 flex items-center justify-between">
        <div className="text-sm font-semibold">{title}</div>
        <div className="text-xs text-muted-foreground">{tasks.length}</div>
      </div>
      <Separator />
      <ScrollArea className="flex-1">
        <div className="p-3 space-y-2">
          <SortableContext
            id={id}
            items={tasks.map((t) => t.gid)}
            strategy={verticalListSortingStrategy}
          >
            {tasks.map((t) => (
              <SortableTask key={t.gid} task={t} column={id} />
            ))}
          </SortableContext>
        </div>
      </ScrollArea>
    </div>
  );
}

function SortableTask({ task, column }: { task: BoardTask; column: BoardColumnId }) {
  const { attributes, listeners, setNodeRef, transform, transition, isDragging } =
    useSortable({ id: task.gid, data: { column, task } });

  const style = {
    transform: CSS.Transform.toString(transform),
    transition,
    opacity: isDragging ? 0.5 : 1,
  } as React.CSSProperties;

  return (
    <div ref={setNodeRef} style={style} {...attributes} {...listeners}>
      <TaskCard task={task} column={column} />
    </div>
  );
}

export function TaskBoard() {
  const { data, loading, error, refresh, setData } = useTasksPolling();
  const [moving, setMoving] = useState<string | null>(null);
  const [activeTask, setActiveTask] = useState<{
    task: BoardTask;
    column: BoardColumnId;
  } | null>(null);

  const sensors = useSensors(useSensor(PointerSensor, { activationConstraint: { distance: 6 } }));

  const tasksByColumn = useMemo(() => {
    return (
      data?.tasks ?? {
        todo: [],
        inprogress: [],
        done: [],
        archive: [],
      }
    );
  }, [data]);

  const findColumnOfTask = useCallback(
    (gid: string): BoardColumnId | null => {
      for (const c of columns) {
        if (tasksByColumn[c.id]?.some((t) => t.gid === gid)) return c.id;
      }
      return null;
    },
    [tasksByColumn]
  );

  const onDragStart = useCallback(
    (event: any) => {
      const t = event?.active?.data?.current?.task as BoardTask | undefined;
      const col = event?.active?.data?.current?.column as BoardColumnId | undefined;
      if (t && col) setActiveTask({ task: t, column: col });
    },
    []
  );

  const onDragEnd = useCallback(
    async (event: DragEndEvent) => {
      setActiveTask(null);
      const activeId = String(event.active.id);
      const overId = event.over?.id ? String(event.over.id) : null;
      if (!overId) return;

      const fromColumn = findColumnOfTask(activeId);
      const toColumn = (columns.find((c) => c.id === overId)?.id ??
        findColumnOfTask(overId)) as BoardColumnId | null;

      if (!fromColumn || !toColumn) return;
      if (fromColumn === toColumn) return;

      // optimistic UI
      const task = tasksByColumn[fromColumn].find((t) => t.gid === activeId);
      if (!task) return;

      setData((prev) => {
        if (!prev) return prev;
        const next = structuredClone(prev);
        next.tasks[fromColumn] = next.tasks[fromColumn].filter((t) => t.gid !== activeId);
        next.tasks[toColumn] = [task, ...next.tasks[toColumn]];
        return next;
      });

      setMoving(activeId);
      try {
        const res = await fetch("/api/alex/tasks", {
          method: "PATCH",
          headers: { "Content-Type": "application/json" },
          body: JSON.stringify({ taskGid: activeId, toColumn }),
        });
        if (!res.ok) {
          const msg = await res.text();
          throw new Error(msg || `HTTP ${res.status}`);
        }
        // re-sync from server
        refresh();
      } catch {
        // revert by refetch
        refresh();
      } finally {
        setMoving(null);
      }
    },
    [findColumnOfTask, refresh, setData, tasksByColumn]
  );

  return (
    <div className="space-y-3">
      <div className="flex items-center justify-between gap-3">
        <div>
          <div className="text-lg font-semibold">Tasks</div>
          <div className="text-xs text-muted-foreground">
            Synced with Asana • refreshes every ~{Math.round((process.env.NEXT_PUBLIC_TASKS_POLL_INTERVAL ? Number(process.env.NEXT_PUBLIC_TASKS_POLL_INTERVAL) : 30000) / 1000)}s
          </div>
        </div>
        <Button onClick={refresh} variant="secondary" disabled={loading || !!moving}>
          {loading ? "Loading…" : moving ? "Moving…" : "Refresh"}
        </Button>
      </div>

      {error ? (
        <div className="text-sm text-destructive whitespace-pre-wrap">{error}</div>
      ) : null}

      <DndContext
        sensors={sensors}
        onDragStart={onDragStart}
        onDragEnd={onDragEnd}
      >
        <div className="grid grid-cols-1 md:grid-cols-4 gap-3">
          {columns.map((c) => (
            <Column
              key={c.id}
              id={c.id}
              title={c.title}
              tasks={tasksByColumn[c.id]}
            />
          ))}
        </div>

        <DragOverlay>
          {activeTask ? <TaskCard task={activeTask.task} column={activeTask.column} /> : null}
        </DragOverlay>
      </DndContext>
    </div>
  );
}
