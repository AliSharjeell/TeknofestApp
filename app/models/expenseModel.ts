import { db } from "../db/database";

// Add a new expense
export const addExpense = (title, amount, category, date) => {
  return new Promise((resolve, reject) => {
    db.transaction((tx) => {
      tx.executeSql(
        `INSERT INTO expenses (title, amount, category, date) VALUES (?, ?, ?, ?)`,
        [title, amount, category, date],
        (_, result) => resolve(result),
        (_, error) => reject(error)
      );
    });
  });
};

// Get all expenses (most recent first)
export const getExpenses = () => {
  return new Promise((resolve, reject) => {
    db.transaction((tx) => {
      tx.executeSql(
        `SELECT * FROM expenses ORDER BY date DESC`,
        [],
        (_, result) => resolve(result.rows._array),
        (_, error) => reject(error)
      );
    });
  });
};

// Delete an expense
export const deleteExpense = (id) => {
  return new Promise((resolve, reject) => {
    db.transaction((tx) => {
      tx.executeSql(
        `DELETE FROM expenses WHERE id = ?`,
        [id],
        (_, result) => resolve(result),
        (_, error) => reject(error)
      );
    });
  });
};

// Update an existing expense
export const updateExpense = (id, title, amount, category, date) => {
  return new Promise((resolve, reject) => {
    db.transaction((tx) => {
      tx.executeSql(
        `UPDATE expenses SET title = ?, amount = ?, category = ?, date = ? WHERE id = ?`,
        [title, amount, category, date, id],
        (_, result) => resolve(result),
        (_, error) => reject(error)
      );
    });
  });
};
