    import { pool } from "../config/db.js";

export const Campaign = {
  async createCampaign(campaign_name, group_name) {
    const [result] = await pool.query(
      "INSERT INTO campaigns (campaign_name, group_name, status) VALUES (?, ?, ?)",
      [campaign_name, group_name, "pending"]
    );

    return result.insertId;
  }
};
