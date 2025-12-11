const { pool } = require('../config/db.config');

module.exports = {
  insertCallLog: async (contactId, phone) => {
    const [res] = await pool.query('INSERT INTO call_logs (contact_id, phone_number, status) VALUES (?, ?, ?)', [contactId, phone, 'initiated']);
    return res.insertId;
  },
  updateCallStatus: async (callId, status, extras = {}) => {
    const { device = null, end_status = null } = extras;
    await pool.query('UPDATE call_logs SET status = ?, device = ?, end_status = ? WHERE id = ?', [status, device, end_status, callId]);
  }
};
