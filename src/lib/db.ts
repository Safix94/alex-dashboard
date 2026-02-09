import Database from 'better-sqlite3';
import path from 'path';
import fs from 'fs';

// Database path — use /tmp on Vercel (serverless, writable), .data locally
const isVercel = !!process.env.VERCEL;
const dbDir = process.env.DB_PATH || (isVercel ? '/tmp' : path.join(process.cwd(), '.data'));
const dbPath = path.join(dbDir, 'alex-dashboard.db');

// Ensure directory exists
if (!fs.existsSync(dbDir)) {
  fs.mkdirSync(dbDir, { recursive: true });
}

// Initialize database connection
const db = new Database(dbPath);

// Enable foreign keys
db.pragma('foreign_keys = ON');

// Initialize schema if needed
function initializeSchema() {
  const schemaPath = path.join(process.cwd(), 'src/lib/schema.sql');
  const schema = fs.readFileSync(schemaPath, 'utf-8');
  
  // Execute schema file (split by semicolons and execute each statement)
  const statements = schema
    .split(';')
    .map((s) => s.trim())
    .filter((s) => s.length > 0);

  statements.forEach((statement) => {
    db.exec(statement);
  });
}

// Initialize schema on first load
try {
  initializeSchema();
  // Seed with sample data if in development
  if (process.env.NODE_ENV === 'development') {
    const { seedActivityLogs } = require('./seed');
    seedActivityLogs();
  }
} catch (error) {
  console.error('Failed to initialize schema:', error);
}

export default db;

// Type definitions
export interface ActivityLog {
  id?: number;
  timestamp?: string;
  type: 'cron' | 'tool_call' | 'message' | 'event';
  agent: 'main' | 'subagent';
  icon?: string;
  description: string;
  details_json?: string;
  created_at?: string;
}

// Helper functions
export function addActivityLog(log: ActivityLog): number {
  const stmt = db.prepare(`
    INSERT INTO activity_logs (type, agent, icon, description, details_json)
    VALUES (?, ?, ?, ?, ?)
  `);
  
  const result = stmt.run(
    log.type,
    log.agent,
    log.icon || null,
    log.description,
    log.details_json || null
  );

  return result.lastInsertRowid as number;
}

export interface FetchLogsOptions {
  type?: string;
  agent?: string;
  dateFrom?: string;
  dateTo?: string;
  search?: string;
  limit?: number;
  offset?: number;
}

export function fetchActivityLogs(options: FetchLogsOptions) {
  const {
    type,
    agent,
    dateFrom,
    dateTo,
    search,
    limit = 50,
    offset = 0,
  } = options;

  // Build base query
  let query = 'SELECT * FROM activity_logs WHERE 1=1';
  const params: any[] = [];

  if (type) {
    query += ' AND type = ?';
    params.push(type);
  }

  if (agent) {
    query += ' AND agent = ?';
    params.push(agent);
  }

  if (dateFrom) {
    query += ' AND timestamp >= ?';
    params.push(dateFrom);
  }

  if (dateTo) {
    query += ' AND timestamp <= ?';
    params.push(dateTo);
  }

  if (search) {
    query += ' AND (description LIKE ? OR details_json LIKE ?)';
    const searchTerm = `%${search}%`;
    params.push(searchTerm, searchTerm);
  }

  // Count total
  const countQuery = query.replace('SELECT *', 'SELECT COUNT(*) as count');
  const countStmt = db.prepare(countQuery);
  const countResult = countStmt.get(...params) as { count: number };

  // Fetch paginated results
  query += ' ORDER BY timestamp DESC LIMIT ? OFFSET ?';
  params.push(limit, offset);

  const stmt = db.prepare(query);
  const entries = stmt.all(...params) as ActivityLog[];

  return {
    entries,
    total: countResult.count,
    limit,
    offset,
  };
}

export function clearActivityLogs() {
  db.exec('DELETE FROM activity_logs');
}

// ─── Notes ────────────────────────────────────────────────────────────

export type NoteCategory = 'general' | 'todo' | 'idea' | 'reference' | 'memory';

export interface Note {
  id?: number;
  title: string;
  content: string;
  category: NoteCategory;
  pinned?: number;
  archived?: number;
  tags?: string | null;
  source?: string;
  created_at?: string;
  updated_at?: string;
}

export interface FetchNotesOptions {
  category?: string;
  pinned?: boolean;
  archived?: boolean;
  search?: string;
  limit?: number;
  offset?: number;
}

export function addNote(note: Note): number {
  const stmt = db.prepare(`
    INSERT INTO notes (title, content, category, pinned, archived, tags, source)
    VALUES (?, ?, ?, ?, ?, ?, ?)
  `);

  const result = stmt.run(
    note.title,
    note.content,
    note.category || 'general',
    note.pinned ? 1 : 0,
    note.archived ? 1 : 0,
    note.tags || null,
    note.source || 'api',
  );

  return result.lastInsertRowid as number;
}

export function fetchNotes(options: FetchNotesOptions) {
  const {
    category,
    pinned,
    archived,
    search,
    limit = 50,
    offset = 0,
  } = options;

  let query = 'SELECT * FROM notes WHERE 1=1';
  const params: (string | number)[] = [];

  if (category) {
    query += ' AND category = ?';
    params.push(category);
  }

  if (pinned !== undefined) {
    query += ' AND pinned = ?';
    params.push(pinned ? 1 : 0);
  }

  // Default: hide archived unless explicitly requested
  if (archived !== undefined) {
    query += ' AND archived = ?';
    params.push(archived ? 1 : 0);
  } else {
    query += ' AND archived = 0';
  }

  if (search) {
    query += ' AND (title LIKE ? OR content LIKE ? OR tags LIKE ?)';
    const term = `%${search}%`;
    params.push(term, term, term);
  }

  // Count
  const countQuery = query.replace('SELECT *', 'SELECT COUNT(*) as count');
  const countResult = db.prepare(countQuery).get(...params) as { count: number };

  // Fetch — pinned first, then newest
  query += ' ORDER BY pinned DESC, created_at DESC LIMIT ? OFFSET ?';
  params.push(limit, offset);

  const entries = db.prepare(query).all(...params) as Note[];

  return {
    entries,
    total: countResult.count,
    limit,
    offset,
  };
}

export function getNoteById(id: number): Note | undefined {
  return db.prepare('SELECT * FROM notes WHERE id = ?').get(id) as Note | undefined;
}

export function updateNote(id: number, updates: Partial<Pick<Note, 'title' | 'content' | 'category' | 'pinned' | 'archived' | 'tags'>>): boolean {
  const fields: string[] = [];
  const params: (string | number | null)[] = [];

  if (updates.title !== undefined) { fields.push('title = ?'); params.push(updates.title); }
  if (updates.content !== undefined) { fields.push('content = ?'); params.push(updates.content); }
  if (updates.category !== undefined) { fields.push('category = ?'); params.push(updates.category); }
  if (updates.pinned !== undefined) { fields.push('pinned = ?'); params.push(updates.pinned ? 1 : 0); }
  if (updates.archived !== undefined) { fields.push('archived = ?'); params.push(updates.archived ? 1 : 0); }
  if (updates.tags !== undefined) { fields.push('tags = ?'); params.push(updates.tags); }

  if (fields.length === 0) return false;

  fields.push("updated_at = datetime('now')");
  params.push(id);

  const stmt = db.prepare(`UPDATE notes SET ${fields.join(', ')} WHERE id = ?`);
  const result = stmt.run(...params);
  return result.changes > 0;
}

export function deleteNote(id: number): boolean {
  const result = db.prepare('DELETE FROM notes WHERE id = ?').run(id);
  return result.changes > 0;
}
