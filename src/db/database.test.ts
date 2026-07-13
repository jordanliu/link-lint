import { SQLiteDatabase } from 'expo-sqlite';
import { migrateDatabase } from './database';

function databaseAt(version: number) {
  const tx = { execAsync: jest.fn().mockResolvedValue(undefined) };
  const db = {
    execAsync: jest.fn().mockResolvedValue(undefined),
    getFirstAsync: jest.fn().mockResolvedValue({ user_version: version }),
    withExclusiveTransactionAsync: jest.fn(async (work: (value: typeof tx) => Promise<void>) => work(tx)),
  } as unknown as SQLiteDatabase;
  return { db, tx };
}

describe('database migration', () => {
  test('configures SQLite and creates the complete schema for a fresh install', async () => {
    const { db, tx } = databaseAt(0);
    await migrateDatabase(db);
    expect(db.execAsync).toHaveBeenCalledWith('PRAGMA journal_mode = WAL; PRAGMA foreign_keys = ON;');
    expect(db.withExclusiveTransactionAsync).toHaveBeenCalledTimes(1);
    const schema = tx.execAsync.mock.calls[0][0] as string;
    expect(schema).toContain('CREATE TABLE saved_links');
    expect(schema).toContain('CREATE TABLE launch_attempts');
    expect(schema).toContain('CREATE TABLE settings');
    expect(schema).toContain("INSERT INTO settings VALUES (1,'ios',1,0,0,1,30,'system')");
    expect(schema).toContain('PRAGMA user_version = 1');
  });

  test('does not recreate schema when migration is current', async () => {
    const { db } = databaseAt(1);
    await migrateDatabase(db);
    expect(db.withExclusiveTransactionAsync).not.toHaveBeenCalled();
  });
});

