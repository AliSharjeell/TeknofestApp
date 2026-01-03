import { type SQLiteDatabase } from 'expo-sqlite';

// Save or update the monthly budget (only one row)
export const setMonthlyBudget = async (db: SQLiteDatabase, amount: number) => {
  // Clear any previous budget
  await db.runAsync(`DELETE FROM budget`);
  // Insert new budget
  const result = await db.runAsync(
    `INSERT INTO budget (id, monthlyLimit) VALUES (1, ?)`,
    [amount]
  );
  return result;
};

// Get the saved monthly budget
export const getMonthlyBudget = async (db: SQLiteDatabase): Promise<number> => {
  const result = await db.getFirstAsync<{ monthlyLimit: number }>(
    `SELECT monthlyLimit FROM budget WHERE id = 1`
  );
  if (result) {
    return result.monthlyLimit;
  }
  return 0; // default if no budget set
};
