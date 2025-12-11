
import { pool } from "../config/db.js";

export const Group = {
  async getAll() {
    const [rows] = await pool.query("SELECT group_name FROM groups");
    return rows.map(r => r.group_name);
  },

  async findGroup(name) {
    const [rows] = await pool.query("SELECT * FROM groups WHERE group_name = ?", [name]);
    return rows.length > 0 ? rows[0] : null;
  },

  async createGroup(name) {
    await pool.query("INSERT INTO groups (group_name) VALUES (?)", [name]);
  }
};

