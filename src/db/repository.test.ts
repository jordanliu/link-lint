import { SQLiteDatabase } from 'expo-sqlite';
import { Repository } from './repository';

function fakeDatabase() {
  const tx = { execAsync: jest.fn().mockResolvedValue(undefined) };
  return {
    getAllAsync: jest.fn().mockResolvedValue([]),
    getFirstAsync: jest.fn(),
    runAsync: jest.fn().mockResolvedValue({ lastInsertRowId: 42, changes: 1 }),
    withExclusiveTransactionAsync: jest.fn(async (work: (value: typeof tx) => Promise<void>) => work(tx)),
    tx,
  };
}

describe('SQLite repository', () => {
  test('maps persisted settings into typed values', async () => {
    const db = fakeDatabase();
    db.getFirstAsync.mockResolvedValue({ default_platform:'ios',default_environment_id:1,confirm_before_open:0,reopen_last_link:1,mask_sensitive:1,retention_days:30,appearance:'system' });
    const settings = await new Repository(db as unknown as SQLiteDatabase).settings();
    expect(settings).toEqual({ defaultPlatform:'ios',defaultEnvironmentId:1,confirmBeforeOpen:false,reopenLastLink:true,maskSensitive:true,retentionDays:30,appearance:'system' });
  });

  test('creates a saved link and returns its database id', async () => {
    const db = fakeDatabase();
    const id = await new Repository(db as unknown as SQLiteDatabase).saveLink({name:'Checkout',link:'myapp://checkout',platform:'ios',environmentId:null,notes:'QA'});
    expect(id).toBe(42);
    expect(db.runAsync).toHaveBeenCalledWith(expect.stringContaining('INSERT INTO saved_links'),'Checkout','myapp://checkout','ios',null,'QA',expect.any(String),expect.any(String));
  });

  test('purges only records older than the selected retention', async () => {
    const db = fakeDatabase(); const repo = new Repository(db as unknown as SQLiteDatabase);
    await repo.purgeHistory(30);
    expect(db.runAsync).toHaveBeenCalledWith(expect.stringContaining('DELETE FROM launch_attempts'),'-30 days');
    db.runAsync.mockClear(); await repo.purgeHistory(0);
    expect(db.runAsync).not.toHaveBeenCalled();
  });

  test('resets local data transactionally with confirmation disabled', async () => {
    const db = fakeDatabase(); await new Repository(db as unknown as SQLiteDatabase).resetAll();
    expect(db.withExclusiveTransactionAsync).toHaveBeenCalledTimes(1);
    const sql = db.tx.execAsync.mock.calls[0][0] as string;
    expect(sql).toContain('DELETE FROM launch_attempts');
    expect(sql).toContain('DELETE FROM saved_links');
    expect(sql).toContain('confirm_before_open=0');
    expect(sql).toContain("INSERT INTO sensitive_parameter_names");
  });
});
