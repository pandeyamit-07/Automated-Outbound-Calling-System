
import { pool } from "../config/db.js";

export const Contact = {
  insertContact: async (name, phone, group) => {
    const sql = `
      INSERT INTO contacts (cust_name, phone_number, group_name)
      VALUES (?, ?, ?)
    `;
    const [result] = await pool.query(sql, [name, phone, group]);
    return result;
  },

  checkDuplicate: async (phone, group) => {
    const sql = `
      SELECT id FROM contacts
      WHERE phone_number = ? AND group_name = ?
    `;
    const [rows] = await pool.query(sql, [phone, group]);
    return rows.length > 0;
  },
};
