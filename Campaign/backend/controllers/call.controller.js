

import { originateNumber, callEmitter } from "../config/ami.js";
import { pool } from "../config/db.js";

let isCalling = false;
let selectedGroup = null;

// 📌 Get next pending number
async function getNextContact() {
  const [rows] = await pool.query(
    "SELECT * FROM contacts WHERE group_name=? AND status='pending' ORDER BY id ASC LIMIT 1",
    [selectedGroup]
  );
  return rows[0] || null;
}

// 📌 Core calling logic
async function startSequentialCallingInternal() {
  if (isCalling) {
    console.log("⛔ Already calling...");
    return;
  }

  isCalling = true;

  try {
    const contact = await getNextContact();
    if (!contact) {
      console.log("✔ No pending contacts in group:", selectedGroup);
      isCalling = false;
      return;
    }

    console.log(
      `📞 Dialing Contact -> ID=${contact.id}, Phone=${contact.phone_number}`
    );

    try {
      await originateNumber(contact);

      await pool.query("UPDATE contacts SET status='processing' WHERE id=?", [
        contact.id,
      ]);

      console.log(`➡️ Contact ${contact.id} marked PROCESSING`);
    } catch (err) {
      console.error("❌ originateNumber failed:", err);

      await pool.query("UPDATE contacts SET status='failed' WHERE id=?", [
        contact.id,
      ]);

      isCalling = false;
    }
  } catch (err) {
    console.error("❌ Internal Error:", err);
    isCalling = false;
  }
}

// ⭐ PUBLIC API – SAVE CAMPAIGN + START CALLING ⭐
export const startCalls = async (req, res) => {
  try {
    const { campaign_name, group_name } = req.body;

    if (!campaign_name || !group_name) {
      return res.status(400).json({
        error: true,
        message: "campaign_name and group_name are required",
      });
    }

    selectedGroup = group_name;

    // 1️⃣ Save campaign to DB
    const [result] = await pool.query(
      "INSERT INTO campaigns (campaign_name, group_name, status) VALUES (?, ?, ?)",
      [campaign_name, group_name, "running"]
    );

    const campaignId = result.insertId;

    console.log("📌 Campaign Saved:", campaignId);

    // 2️⃣ Start Calling
    startSequentialCallingInternal();

    res.json({
      error: false,
      message: "Campaign started",
      campaign_id: campaignId,
      group: selectedGroup,
    });
  } catch (err) {
    console.error("Campaign Start Error:", err);
    res.status(500).json({ error: true, message: err.message });
  }
};

// 📞 Save DTMF Response
export const postDtmf = async (req, res) => {
  try {
    const { call_id, input } = req.body;

    if (!call_id || !input)
      return res
        .status(400)
        .json({ error: "Missing call_id or input in body" });

    await pool.query(
      "INSERT INTO dtmf_responses (call_id, user_input) VALUES (?, ?)",
      [call_id, input]
    );

    await pool.query("UPDATE call_logs SET user_input = ? WHERE id = ?", [
      input,
      call_id,
    ]);

    console.log(`Saved DTMF: call_id=${call_id}, input=${input}`);

    res.json({ success: true });
  } catch (err) {
    console.error("DTMF save error:", err);
    res.status(500).json({ error: "Database error" });
  }
};

// 📞 CALL COMPLETED → NEXT NUMBER
let listenerRegistered = false;

if (!listenerRegistered) {
  listenerRegistered = true;

  callEmitter.on("callCompleted", async ({ callId, status } = {}) => {
    try {
      console.log("📞 callCompleted", { callId, status });

      await new Promise((r) => setTimeout(r, 3000));

      isCalling = false;

      const [rows] = await pool.query(
        "SELECT id FROM contacts WHERE status='pending' AND group_name=? ORDER BY id ASC LIMIT 1",
        [selectedGroup]
      );

      console.log("Next pending:", rows[0] || "None");

      await startSequentialCallingInternal();
    } catch (err) {
      console.error("Error in callCompleted listener:", err);
      isCalling = false;
    }
  });
}
