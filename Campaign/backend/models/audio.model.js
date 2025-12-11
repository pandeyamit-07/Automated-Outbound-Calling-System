
import { pool } from "../config/db.js";

export const Audio = {
  create: async ({ name, original_filename, file_path, duration_seconds }) => {
    const sql = `
      INSERT INTO audios (name, original_filename, file_path, duration_seconds)
      VALUES (?, ?, ?, ?)
    `;
    const [result] = await pool.query(sql, [
      name,
      original_filename,
      file_path,
      duration_seconds,
    ]);
    return {
      id: result.insertId,
      name,
      original_filename,
      file_path,
      duration_seconds,
    };
  },

  findAll: async () => {
    const [rows] = await pool.query(
      "SELECT * FROM audios ORDER BY created_at DESC"
    );
    return rows;
  },

  findById: async (id) => {
    const [rows] = await pool.query("SELECT * FROM audios WHERE id = ?", [id]);
    return rows[0];
  },
};
