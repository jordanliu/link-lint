import { SQLiteDatabase } from 'expo-sqlite';

export async function migrateDatabase(db: SQLiteDatabase) {
  await db.execAsync('PRAGMA journal_mode = WAL; PRAGMA foreign_keys = ON;');
  const row = await db.getFirstAsync<{ user_version: number }>('PRAGMA user_version');
  if ((row?.user_version ?? 0) >= 1) return;
  await db.withExclusiveTransactionAsync(async (tx) => {
    await tx.execAsync(`
      CREATE TABLE environments (id INTEGER PRIMARY KEY AUTOINCREMENT, name TEXT NOT NULL, base_url TEXT NOT NULL, custom_scheme TEXT, is_built_in INTEGER NOT NULL DEFAULT 0, created_at TEXT NOT NULL DEFAULT CURRENT_TIMESTAMP, updated_at TEXT NOT NULL DEFAULT CURRENT_TIMESTAMP);
      CREATE TABLE saved_links (id INTEGER PRIMARY KEY AUTOINCREMENT, name TEXT NOT NULL, link TEXT NOT NULL, platform TEXT NOT NULL CHECK(platform IN ('android','ios')), environment_id INTEGER REFERENCES environments(id) ON DELETE SET NULL, notes TEXT NOT NULL DEFAULT '', last_used_at TEXT, reported_result TEXT, created_at TEXT NOT NULL DEFAULT CURRENT_TIMESTAMP, updated_at TEXT NOT NULL DEFAULT CURRENT_TIMESTAMP);
      CREATE TABLE launch_attempts (id INTEGER PRIMARY KEY AUTOINCREMENT, final_link TEXT NOT NULL, attempted_at TEXT NOT NULL, platform TEXT NOT NULL, environment_id INTEGER REFERENCES environments(id) ON DELETE SET NULL, environment_name TEXT NOT NULL, handoff_result TEXT NOT NULL, error_code TEXT, error_message TEXT, reported_result TEXT, saved_link_id INTEGER REFERENCES saved_links(id) ON DELETE SET NULL);
      CREATE TABLE settings (id INTEGER PRIMARY KEY CHECK(id=1), default_platform TEXT NOT NULL, default_environment_id INTEGER NOT NULL, confirm_before_open INTEGER NOT NULL, reopen_last_link INTEGER NOT NULL, mask_sensitive INTEGER NOT NULL, retention_days INTEGER NOT NULL, appearance TEXT NOT NULL);
      CREATE TABLE sensitive_parameter_names (name TEXT PRIMARY KEY COLLATE NOCASE);
      CREATE TABLE editor_state (id INTEGER PRIMARY KEY CHECK(id=1), link TEXT NOT NULL DEFAULT '', platform TEXT NOT NULL, environment_id INTEGER NOT NULL, saved_link_id INTEGER);
      INSERT INTO environments (name, base_url, custom_scheme, is_built_in) VALUES ('Development','https://dev.example.com','myapp-dev',1),('Staging','https://staging.example.com','myapp-staging',1),('Production','https://example.com','myapp',1);
      INSERT INTO settings VALUES (1,'ios',1,0,0,1,30,'system');
      INSERT INTO editor_state VALUES (1,'', 'ios',1,NULL);
      INSERT INTO sensitive_parameter_names(name) VALUES ('token'),('access_token'),('auth'),('authorization'),('api_key'),('code'),('password'),('secret'),('signature'),('sig');
      PRAGMA user_version = 1;
    `);
  });
}
