import { pool } from "../config/db.js";

export const getDashboardStats = async (req, res) => {
  try {
    // ✔ Correct table names
    const [audios] = await pool.query("SELECT COUNT(*) AS total FROM audios");
    const [groups] = await pool.query("SELECT COUNT(*) AS total FROM groups");
    const [campaigns] = await pool.query("SELECT COUNT(*) AS total FROM campaigns");

    const [completed] = await pool.query(
      "SELECT COUNT(*) AS done FROM contacts WHERE status='completed'"
    );

    const [all] = await pool.query("SELECT COUNT(*) AS total FROM contacts");

    let successRate = "0%";
    if (all[0].total > 0) {
      successRate =
        Math.round((completed[0].done / all[0].total) * 100) + "%";
    }

    res.json({
      audios: audios[0].total,
      groups: groups[0].total,
      campaigns: campaigns[0].total,
      successRate,
    });

  } catch (err) {
    console.log("DASHBOARD ERROR:", err);
    res.status(500).json({ error: true, message: err.message });
  }
};
