import { type SQLiteDatabase } from 'expo-sqlite';

export async function migrateDbIfNeeded(db: SQLiteDatabase) {
  const DATABASE_VERSION = 1;
  // getUserVersionAsync is not available in all versions, checking manually via specific table versioning or PRAGMA if needed.
  // For simplicity in this "offline-first" refactor without complex migrations, we'll use execAsync with IF NOT EXISTS.

  // Expenses table
  await db.execAsync(`
    PRAGMA journal_mode = WAL;
    CREATE TABLE IF NOT EXISTS expenses (
      id INTEGER PRIMARY KEY AUTOINCREMENT,
      title TEXT NOT NULL,
      amount REAL NOT NULL,
      category TEXT NOT NULL,
      date TEXT NOT NULL
    );
  `);

  // Budget table
  await db.execAsync(`
    CREATE TABLE IF NOT EXISTS budget (
      id INTEGER PRIMARY KEY NOT NULL,
      monthlyLimit REAL NOT NULL
    );
  `);
}
