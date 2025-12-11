// src/utils/runQuery.js
import pool from '../config/db.js';

export async function runQuery(sql, params = []) {
  console.log('SQL ▶', sql);
  console.log('PARAMS ▶', JSON.stringify(params));
  const [rows] = await pool.query(sql, params);
  return rows;
}
