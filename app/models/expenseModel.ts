import { type SQLiteDatabase } from 'expo-sqlite';

export interface Expense {
  id: number;
  title: string;
  amount: number;
  category: string;
  date: string;
}

// Add a new expense
export const addExpense = async (db: SQLiteDatabase, title: string, amount: number, category: string, date: string) => {
  const result = await db.runAsync(
    `INSERT INTO expenses (title, amount, category, date) VALUES (?, ?, ?, ?)`,
    [title, amount, category, date]
  );
  return result;
};

// Get all expenses (most recent first)
export const getExpenses = async (db: SQLiteDatabase): Promise<Expense[]> => {
  const allRows = await db.getAllAsync<Expense>(
    `SELECT * FROM expenses ORDER BY date DESC`
  );
  return allRows;
};

// Delete an expense
export const deleteExpense = async (db: SQLiteDatabase, id: number) => {
  const result = await db.runAsync(
    `DELETE FROM expenses WHERE id = ?`,
    [id]
  );
  return result;
};

// Update an existing expense
export const updateExpense = async (db: SQLiteDatabase, id: number, title: string, amount: number, category: string, date: string) => {
  const result = await db.runAsync(
    `UPDATE expenses SET title = ?, amount = ?, category = ?, date = ? WHERE id = ?`,
    [title, amount, category, date, id]
  );
  return result;
};
