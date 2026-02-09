"use client";

import { useCallback, useEffect, useRef, useState } from "react";

export type BoardColumnId = "todo" | "inprogress" | "done" | "archive";

export type BoardTask = {
  gid: string;
  name: string;
  permalink_url?: string;
  due_on?: string | null;
  due_at?: string | null;
};

export type TasksResponse = {
  projectGid: string;
  sections: Record<BoardColumnId, { gid: string; name: string }>;
  tasks: Record<BoardColumnId, BoardTask[]>;
  fetchedAt: string;
};

const DEFAULT_POLL_MS = 30_000;

function getPollMs() {
  const v = process.env.NEXT_PUBLIC_TASKS_POLL_INTERVAL;
  const n = v ? Number(v) : DEFAULT_POLL_MS;
  if (!Number.isFinite(n) || n < 5_000) return DEFAULT_POLL_MS;
  return n;
}

export function useTasksPolling() {
  const [data, setData] = useState<TasksResponse | null>(null);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);

  const pollMsRef = useRef(getPollMs());

  const fetchTasks = useCallback(async () => {
    try {
      setError(null);
      const res = await fetch("/api/alex/tasks", { cache: "no-store" });
      if (!res.ok) {
        const msg = await res.text();
        throw new Error(msg || `HTTP ${res.status}`);
      }
      const json = (await res.json()) as TasksResponse;
      setData(json);
    } catch (e) {
      setError(e instanceof Error ? e.message : "Failed to fetch tasks");
    } finally {
      setLoading(false);
    }
  }, []);

  useEffect(() => {
    fetchTasks();
    const id = window.setInterval(fetchTasks, pollMsRef.current);
    return () => window.clearInterval(id);
  }, [fetchTasks]);

  const refresh = useCallback(() => {
    setLoading(true);
    void fetchTasks();
  }, [fetchTasks]);

  return { data, loading, error, refresh, setData };
}
