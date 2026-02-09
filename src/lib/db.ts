import Database from 'better-sqlite3';
import path from 'path';
import fs from 'fs';

// Database path - use data directory in workspace
const dbDir = process.env.DB_PATH || path.join(process.cwd(), '.data');
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
