import * as SQLite from "expo-sqlite";

// Open or create database
export const db = (SQLite as any).openDatabase('expenses.db');

// Initialize tables
export const initDB = () => {
  db.transaction((tx) => {
    // Expenses table
    tx.executeSql(
      `CREATE TABLE IF NOT EXISTS expenses (
        id INTEGER PRIMARY KEY AUTOINCREMENT,
        title TEXT NOT NULL,
        amount REAL NOT NULL,
        category TEXT NOT NULL,
        date TEXT NOT NULL
      );`
    );

    // Budget table
    tx.executeSql(
      `CREATE TABLE IF NOT EXISTS budget (
        id INTEGER PRIMARY KEY NOT NULL,
        monthlyLimit REAL NOT NULL
      );`
    );
  });
};
