-- Activity Logs Table
CREATE TABLE IF NOT EXISTS activity_logs (
  id INTEGER PRIMARY KEY AUTOINCREMENT,
  timestamp DATETIME DEFAULT CURRENT_TIMESTAMP NOT NULL,
  type TEXT NOT NULL CHECK(type IN ('cron', 'tool_call', 'message', 'event')),
  agent TEXT NOT NULL CHECK(agent IN ('main', 'subagent')),
  icon TEXT,
  description TEXT NOT NULL,
  details_json TEXT,
  created_at DATETIME DEFAULT CURRENT_TIMESTAMP
);

-- Indexes for fast filtering
CREATE INDEX IF NOT EXISTS idx_activity_logs_timestamp ON activity_logs(timestamp DESC);
CREATE INDEX IF NOT EXISTS idx_activity_logs_type ON activity_logs(type);
CREATE INDEX IF NOT EXISTS idx_activity_logs_agent ON activity_logs(agent);
CREATE INDEX IF NOT EXISTS idx_activity_logs_description ON activity_logs(description);
