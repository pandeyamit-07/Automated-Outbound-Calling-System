// src/models/contacts.model.js
import { runQuery } from '../utils/runQuery.js';

export async function countByStatus(status) {
  if (status) {
    const rows = await runQuery('SELECT COUNT(*) AS count FROM contacts WHERE status = ?', [status]);
    return Number(rows[0].count);
  } else {
    const rows = await runQuery('SELECT status, COUNT(*) AS count FROM contacts GROUP BY status');
    return rows.map(r => ({ status: r.status, count: Number(r.count) }));
  }
}
