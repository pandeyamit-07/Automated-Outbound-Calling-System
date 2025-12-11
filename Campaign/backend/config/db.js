

import mysql from "mysql2/promise";
import fs from "fs";
import path from "path";
import dotenv from "dotenv";

dotenv.config();

// ---- Database Config ----
export const pool = mysql.createPool({
  host: process.env.DB_HOST || "localhost",
  user: process.env.DB_USER || "root",
  password: process.env.DB_PASS || "",
  database: process.env.DB_NAME || "campaign_db",
  waitForConnections: true,
  connectionLimit: 10,
  queueLimit: 0,
});

// ---- Test Connection on Startup ----
export async function testDB() {
  try {
    const [rows] = await pool.query("SELECT 1");
    console.log("✅ MySQL Connected Successfully!");
  } catch (err) {
    console.error("❌ MySQL Connection Failed:", err.message);
    process.exit(1);
  }
}

// ---- Ensure Upload Directory Exists ----
export function ensureUploadDir() {
  const dir = path.resolve(process.cwd(), process.env.UPLOAD_DIR || "uploads");

  if (!fs.existsSync(dir)) {
    fs.mkdirSync(dir, { recursive: true });
    console.log("📁 Upload folder created:", dir);
  } else {
    console.log("📁 Upload folder exists:", dir);
  }
}

