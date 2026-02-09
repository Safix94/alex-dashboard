import db, { addActivityLog } from './db';

export function seedActivityLogs() {
  try {
    // Check if we already have data
    const checkStmt = db.prepare('SELECT COUNT(*) as count FROM activity_logs');
    const result = checkStmt.get() as { count: number };

    if (result.count > 0) {
      console.log(`Database already has ${result.count} activity logs, skipping seed.`);
      return;
    }

    console.log('Seeding activity logs...');

    const now = new Date();
    const mockLogs = [
      {
        timestamp: new Date(now.getTime() - 30 * 1000).toISOString(),
        type: 'message' as const,
        agent: 'main' as const,
        icon: '💬',
        description: 'User sent message to Dashboard',
        details_json: JSON.stringify({
          channel: 'telegram',
          messageId: '12345',
          text: 'Phase 5 started',
        }),
      },
      {
        timestamp: new Date(now.getTime() - 2 * 60 * 1000).toISOString(),
        type: 'tool_call' as const,
        agent: 'main' as const,
        icon: '🔧',
        description: 'Executed shell command: npm run build',
        details_json: JSON.stringify({
          tool: 'exec',
          command: 'npm run build',
          exitCode: 0,
        }),
      },
      {
        timestamp: new Date(now.getTime() - 5 * 60 * 1000).toISOString(),
        type: 'cron' as const,
        agent: 'main' as const,
        icon: '⏰',
        description: 'Heartbeat check completed',
        details_json: JSON.stringify({
          type: 'heartbeat',
          checks: ['email', 'calendar'],
          status: 'ok',
        }),
      },
      {
        timestamp: new Date(now.getTime() - 10 * 60 * 1000).toISOString(),
        type: 'event' as const,
        agent: 'subagent' as const,
        icon: '⚡',
        description: 'Phase 5: Activity Log initialized',
        details_json: JSON.stringify({
          phase: 5,
          task: 'Activity Log',
          status: 'in_progress',
        }),
      },
      {
        timestamp: new Date(now.getTime() - 15 * 60 * 1000).toISOString(),
        type: 'tool_call' as const,
        agent: 'main' as const,
        icon: '🔧',
        description: 'Database initialized with schema',
        details_json: JSON.stringify({
          tool: 'db',
          action: 'initialize_schema',
          tables: ['activity_logs'],
        }),
      },
      {
        timestamp: new Date(now.getTime() - 20 * 60 * 1000).toISOString(),
        type: 'message' as const,
        agent: 'subagent' as const,
        icon: '💬',
        description: 'Subagent started for Phase 5',
        details_json: JSON.stringify({
          subagent_id: '9876fa27-af4d-491b-81ae-506b6341fdd6',
          session: 'agent:main:subagent:9876fa27-af4d-491b-81ae-506b6341fdd6',
        }),
      },
    ];

    mockLogs.forEach((log) => {
      addActivityLog(log);
    });

    console.log(`Seeded ${mockLogs.length} activity logs`);
  } catch (error) {
    console.error('Failed to seed activity logs:', error);
  }
}
