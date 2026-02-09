export type AsanaTask = {
  gid: string;
  name: string;
  permalink_url?: string;
  due_on?: string | null;
  due_at?: string | null;
  completed?: boolean;
  memberships?: Array<{ project?: { gid: string }; section?: { gid: string; name?: string } }>;
};

type SectionMap = {
  todo: { gid: string; name: string };
  inprogress: { gid: string; name: string };
  done: { gid: string; name: string };
};

type CacheEntry = {
  expiresAt: number;
  map: SectionMap;
};

const SECTION_CACHE_TTL_MS = 5 * 60 * 1000;

let sectionCache: CacheEntry | null = null;

function requireEnv(name: string): string {
  const v = process.env[name];
  if (!v) throw new Error(`Missing env var: ${name}`);
  return v;
}

async function asanaFetch<T>(path: string, init?: RequestInit): Promise<T> {
  const pat = requireEnv("ASANA_PAT");
  const res = await fetch(`https://app.asana.com/api/1.0${path}`, {
    ...init,
    headers: {
      Authorization: `Bearer ${pat}`,
      "Content-Type": "application/json",
      ...(init?.headers ?? {}),
    },
    // Next.js route handler: avoid caching
    cache: "no-store",
  });

  const json = await res.json().catch(() => ({}));
  if (!res.ok) {
    const msg = typeof json === "object" && json && "errors" in json ? JSON.stringify(json) : res.statusText;
    throw new Error(`Asana API error (${res.status}): ${msg}`);
  }
  return json as T;
}

function normalize(s: string): string {
  return s.trim().toLowerCase();
}

function matchSection(sections: Array<{ gid: string; name: string }>, names: string[]) {
  const set = new Set(names.map((n) => normalize(n)));
  return sections.find((s) => set.has(normalize(s.name)));
}

export async function getProjectSectionMap(projectGid: string): Promise<SectionMap> {
  const now = Date.now();
  if (sectionCache && sectionCache.expiresAt > now) return sectionCache.map;

  const secRes = await asanaFetch<{ data: Array<{ gid: string; name: string }> }>(
    `/projects/${projectGid}/sections?limit=100`
  );

  const sections = secRes.data ?? [];

  const todo = matchSection(sections, ["Nog te doen", "To Do", "Todo"]);
  const inprogress = matchSection(sections, ["Bezig", "In Progress"]);
  const done = matchSection(sections, ["Done", "Klaar", "Afgewerkt"]);

  if (!todo || !inprogress || !done) {
    const names = sections.map((s) => s.name).join(", ");
    throw new Error(
      `Required Asana sections not found. Found sections: [${names}]. Expected names include: todo=[Nog te doen|To Do|Todo], inprogress=[Bezig|In Progress], done=[Done|Klaar|Afgewerkt]`
    );
  }

  const map: SectionMap = {
    todo: { gid: todo.gid, name: todo.name },
    inprogress: { gid: inprogress.gid, name: inprogress.name },
    done: { gid: done.gid, name: done.name },
  };

  sectionCache = { map, expiresAt: now + SECTION_CACHE_TTL_MS };
  return map;
}

export async function listTasksBySection(params: {
  projectGid: string;
  sectionMap: SectionMap;
}): Promise<{ todo: AsanaTask[]; inprogress: AsanaTask[]; done: AsanaTask[] }> {
  const { projectGid, sectionMap } = params;

  const fields = [
    "gid",
    "name",
    "permalink_url",
    "due_on",
    "due_at",
    "completed",
    "memberships.project.gid",
    "memberships.section.gid",
    "memberships.section.name",
  ].join(",");

  // Asana: easiest grouping is to list tasks per section
  const fetchSectionTasks = async (sectionGid: string) => {
    const res = await asanaFetch<{ data: AsanaTask[] }>(
      `/sections/${sectionGid}/tasks?limit=100&opt_fields=${encodeURIComponent(fields)}`
    );
    return res.data ?? [];
  };

  const [todo, inprogress, done] = await Promise.all([
    fetchSectionTasks(sectionMap.todo.gid),
    fetchSectionTasks(sectionMap.inprogress.gid),
    fetchSectionTasks(sectionMap.done.gid),
  ]);

  // Ensure tasks truly belong to the project (just in case)
  const filterByProject = (tasks: AsanaTask[]) =>
    tasks.filter((t) =>
      (t.memberships ?? []).some((m) => m.project?.gid === projectGid)
    );

  return {
    todo: filterByProject(todo),
    inprogress: filterByProject(inprogress),
    done: filterByProject(done),
  };
}

export async function moveTaskToSection(params: {
  projectGid: string;
  taskGid: string;
  sectionGid: string;
}): Promise<void> {
  const { projectGid, taskGid, sectionGid } = params;

  await asanaFetch(`/sections/${sectionGid}/addTask`, {
    method: "POST",
    body: JSON.stringify({ data: { task: taskGid } }),
  });

  // Ensure membership exists (usually does), but adding to section already implies project membership.
  // Optionally could add to project: POST /tasks/{taskGid}/addProject
  // Not doing unless needed.
  void projectGid;
}
