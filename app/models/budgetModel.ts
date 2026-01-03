import { db } from "../db/database"; // Make sure path is correct

// Save or update the monthly budget (only one row)
export const setMonthlyBudget = (amount) => {
  return new Promise((resolve, reject) => {
    db.transaction((tx) => {
      // Clear any previous budget
      tx.executeSql(`DELETE FROM budget`);

      // Insert new budget
      tx.executeSql(
        `INSERT INTO budget (id, monthlyLimit) VALUES (1, ?)`,
        [amount],
        (_, result) => resolve(result),
        (_, error) => reject(error)
      );
    });
  });
};

// Get the saved monthly budget
export const getMonthlyBudget = () => {
  return new Promise((resolve, reject) => {
    db.transaction((tx) => {
      tx.executeSql(
        `SELECT monthlyLimit FROM budget WHERE id = 1`,
        [],
        (_, result) => {
          if (result.rows.length > 0) {
            resolve(result.rows.item(0).monthlyLimit);
          } else {
            resolve(0); // default if no budget set
          }
        },
        (_, error) => reject(error)
      );
    });
  });
};
