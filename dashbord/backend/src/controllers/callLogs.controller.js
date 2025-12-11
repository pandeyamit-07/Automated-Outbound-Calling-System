// src/controllers/callLogs.controller.js
import * as callLogsModel from '../models/callLogs.model.js';

function todayIST() {
  const now = new Date();
  return now.toLocaleDateString("en-CA", { timeZone: "Asia/Kolkata" }); // "YYYY-MM-DD"
}

export async function getStatusCount(req, res) {
  const { status } = req.query;
  if (!status) return res.status(400).json({ error: "Missing 'status' query param" });
  const count = await callLogsModel.countByStatus(status);
  res.json({ table: 'call_logs', status, count });
}



export async function getCompletedByUserInput(req, res) {
  try {
    console.log(">>> CONTROLLER: getCompletedByUserInput incoming query:", req.query);

    let { type, date_from, date_to } = req.query;

    if (!type) {
      return res.status(400).json({ error: "type query param required (not_null|blank|timeout)" });
    }

    // Normalize empty strings -> undefined
    if (typeof date_from === "string" && date_from.trim() === "") date_from = undefined;
    if (typeof date_to === "string" && date_to.trim() === "") date_to = undefined;

    // Default to today if neither provided
    if (!date_from && !date_to) {
      const today = todayIST();
      date_from = today;
      date_to = today;
    }

    console.log(">>> CONTROLLER: using date_from, date_to:", date_from, date_to);

    const count = await callLogsModel.countCompletedByUserInput(type, date_from, date_to);

    res.json({ type, date_from, date_to, count });
  } catch (err) {
    console.error(">>> CONTROLLER: getCompletedByUserInput error:", err);
    res.status(err?.status || 500).json({ error: err?.message || "Failed to get completed by userinput" });
  }
}



export async function getByDuration(req, res) {
  try {
    let { min, date_from, date_to } = req.query;

    if (!min) return res.status(400).json({ error: "min query param required" });

    // normalize empty strings
    if (typeof date_from === "string" && date_from.trim() === "") date_from = undefined;
    if (typeof date_to === "string" && date_to.trim() === "") date_to = undefined;

    // default to today if neither provided
    if (!date_from && !date_to) {
      const t = todayIST();
      date_from = t;
      date_to = t;
    }

    const count = await callLogsModel.countByDuration(Number(min), date_from, date_to);
    res.json({ min: Number(min), date_from, date_to, count });
  } catch (err) {
    console.error("getByDuration error:", err);
    res.status(500).json({ error: "Failed to get duration count" });
  }
}



export async function list(req, res) {
  try {
    const {
      status,
      min_duration,
      userinput,
      date_from,
      date_to,
      limit = 25,
      offset = 0,
    } = req.query;

    console.log("Incoming query:", req.query);

    // 🧹 Clean filter object
    const filters = {};

    // ✅ Status Filter
    if (status && status.toLowerCase() !== "any") {
      filters.status = status.toLowerCase();
    }

    // ✅ Min Duration Filter
    if (!Number.isNaN(Number(min_duration))) {
      filters.min_duration = Number(min_duration);
    } else {
      filters.min_duration = 0;
    }

    // ✅ User Input Filter
    if (userinput && userinput.toLowerCase() !== "any") {
      const type = userinput.toLowerCase();

      if (type === "answer") {
        filters.user_input_condition = `
          user_input IS NOT NULL 
          AND TRIM(user_input) != '' 
          AND user_input <> 'timeout'
        `;
      } else if (type === "blank") {
        filters.user_input_condition = `
          (user_input IS NULL OR TRIM(user_input) = '')
        `;
      } else if (type === "timeout") {
        filters.user_input_condition = `user_input = 'timeout'`;
      }
    }

    // ✅ Date Range Filter
    if (date_from) filters.date_from = date_from;
    if (date_to) filters.date_to = date_to;

    console.log("Applied filters:", filters);

    // ✅ DB Query call
    const rows = await callLogsModel.find(filters, Number(limit), Number(offset));

    res.json({ filters, count: rows.length, rows });
  } catch (err) {
    console.error("list error:", err);
    res.status(500).json({ error: "Failed to fetch call logs" });
  }
}

