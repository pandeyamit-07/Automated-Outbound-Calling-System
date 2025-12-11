// import { runQuery } from '../utils/runQuery.js';

// export async function countByStatus(status) {
//   const rows = await runQuery('SELECT COUNT(*) AS count FROM call_logs WHERE status = ?', [status]);
//   return Number(rows[0]?.count ?? 0);
// }


// export async function countCompletedByUserInput(type, date_from, date_to) {
//   let whereDate = "";
//   const params = [];

// if (date_from && date_to) {
//     // Use call_start_time (better for call-specific date) — compare DATE(call_start_time)
//     whereDate = " AND DATE(call_start_time) BETWEEN ? AND ? ";
//     params.push(date_from, date_to);
//   } else if (date_from) {
//     whereDate = " AND DATE(call_start_time) >= ? ";
//     params.push(date_from);
//   } else if (date_to) {
//     whereDate = " AND DATE(call_start_time) <= ? ";
//     params.push(date_to);
//   }

//   if (type === 'not_null') {
//     // ✅ exclude 'timeout' values
//     const rows = await runQuery(
//       `SELECT COUNT(*) AS count
//        FROM call_logs
//        WHERE status = 'completed'
//          AND user_input IS NOT NULL
//          AND TRIM(user_input) != ''
//          AND LOWER(TRIM(user_input)) <> 'timeout'${whereDate}`,
//       params
         
//     );
//     return Number(rows[0]?.count ?? 0);
//   } else if (type === 'blank') {
//     const rows = await runQuery(
//       `SELECT COUNT(*) AS count
//        FROM call_logs
//        WHERE status = 'completed'
//          AND (user_input IS NULL OR TRIM(user_input) = '')${whereDate}`,
//       params
//     );
//     return Number(rows[0]?.count ?? 0);

//   } else if (type === 'timeout') {
//     const rows = await runQuery(
//       `SELECT COUNT(*) AS count
//        FROM call_logs
//        WHERE status = 'completed'
//          AND LOWER(TRIM(user_input)) = 'timeout'${whereDate}`,
//       params
//     );
//     return Number(rows[0]?.count ?? 0);
//   } else {
//     throw Object.assign(
//       new Error('Invalid type. Use: not_null | blank | timeout'),
//       { status: 400 }
//     );
//   }
// }




// export async function countByDuration(min, date_from, date_to) {
//   const params = [min];
//   let query = `SELECT COUNT(*) AS count FROM call_logs WHERE call_duration >= ?`;

//   if (date_from && date_to) {
//     query += ` AND DATE(call_start_time) BETWEEN ? AND ?`;
//     params.push(date_from, date_to);
//   } else if (date_from) {
//     query += ` AND DATE(call_start_time) >= ?`;
//     params.push(date_from);
//   } else if (date_to) {
//     query += ` AND DATE(call_start_time) <= ?`;
//     params.push(date_to);
//   }

//   const rows = await runQuery(query, params);
//   return Number(rows[0]?.count ?? 0);
// }
// // created_at



// export async function find(filters, limit, offset) {
//   let query = `SELECT * FROM call_logs WHERE 1=1`;
//   const params = [];

//   // status
//   if (filters.status) {
//     query += ` AND status = ?`;
//     params.push(filters.status);
//   }

//   // duration
//   if (filters.min_duration) {
//     query += ` AND (call_duration IS NULL OR call_duration >= ?)`;
//     params.push(filters.min_duration);
//   }

//   // user_input
//   if (filters.user_input_condition) {
//     query += ` AND ${filters.user_input_condition}`;
//   }

//   // date range
//   if (filters.date_from && filters.date_to) {
//     query += ` AND DATE(created_at) BETWEEN ? AND ?`;
//     params.push(filters.date_from, filters.date_to);
//   } else if (filters.date_from) {
//     query += ` AND DATE(created_at) >= ?`;
//     params.push(filters.date_from);
//   } else if (filters.date_to) {
//     query += ` AND DATE(created_at) <= ?`;
//     params.push(filters.date_to);
//   }

//   // order & pagination
//   query += ` ORDER BY id DESC LIMIT ? OFFSET ?`;
//   params.push(limit, offset);

//   console.log("Final SQL Query =>", query, params);

//   return await runQuery(query, params);
// }















// src/models/callLogs.model.js
import { runQuery } from "../utils/runQuery.js";

/* ------------------------ COUNT STATUS ------------------------ */
export async function countByStatus(status) {
  const rows = await runQuery(
    "SELECT COUNT(*) AS count FROM call_logs WHERE status = ?",
    [status]
  );
  return Number(rows[0]?.count ?? 0);
}

/* ------------------ COUNT COMPLETED BY USER INPUT ------------------ */
export async function countCompletedByUserInput(type, date_from, date_to) {
  let whereDate = "";
  const params = [];

  if (date_from && date_to) {
    whereDate = " AND DATE(created_at) BETWEEN ? AND ?";
    params.push(date_from, date_to);
  } else if (date_from) {
    whereDate = " AND DATE(created_at) >= ?";
    params.push(date_from);
  } else if (date_to) {
    whereDate = " AND DATE(created_at) <= ?";
    params.push(date_to);
  }

  if (type === "not_null") {
    const rows = await runQuery(
      `
      SELECT COUNT(*) AS count
      FROM call_logs
      WHERE status = 'completed'
        AND user_input IS NOT NULL
        AND TRIM(user_input) != ''
        AND LOWER(TRIM(user_input)) <> 'timeout'
        ${whereDate}
      `,
      params
    );
    return Number(rows[0]?.count ?? 0);
  }

  if (type === "blank") {
    const rows = await runQuery(
      `
      SELECT COUNT(*) AS count
      FROM call_logs
      WHERE status = 'completed'
        AND (user_input IS NULL OR TRIM(user_input) = '')
        ${whereDate}
      `,
      params
    );
    return Number(rows[0]?.count ?? 0);
  }

  if (type === "timeout") {
    const rows = await runQuery(
      `
      SELECT COUNT(*) AS count
      FROM call_logs
      WHERE status = 'completed'
        AND LOWER(TRIM(user_input)) = 'timeout'
        ${whereDate}
      `,
      params
    );
    return Number(rows[0]?.count ?? 0);
  }

  throw Object.assign(new Error("Invalid type"), { status: 400 });
}

/* ------------------------ COUNT BY DURATION ------------------------ */
export async function countByDuration(min, date_from, date_to) {
  const params = [min];
  let query = `SELECT COUNT(*) AS count FROM call_logs WHERE call_duration >= ?`;

  if (date_from && date_to) {
    query += ` AND DATE(created_at) BETWEEN ? AND ?`;
    params.push(date_from, date_to);
  } else if (date_from) {
    query += ` AND DATE(created_at) >= ?`;
    params.push(date_from);
  } else if (date_to) {
    query += ` AND DATE(created_at) <= ?`;
    params.push(date_to);
  }

  const rows = await runQuery(query, params);
  return Number(rows[0]?.count ?? 0);
}

/* ------------------------------ FIND ------------------------------ */
export async function find(filters, limit, offset) {
  let query = `
    SELECT 
      call_logs.*,
      contacts.cust_name AS cust_name
    FROM call_logs
    LEFT JOIN contacts ON contacts.id = call_logs.contact_id
    WHERE 1=1
  `;
  const params = [];

  // status
  if (filters.status) {
    query += " AND call_logs.status = ?";
    params.push(filters.status);
  }

  // duration
  if (filters.min_duration) {
    query += " AND (call_logs.call_duration IS NULL OR call_logs.call_duration >= ?)";
    params.push(filters.min_duration);
  }

  // user_input → two systems supported
  if (filters.user_input_condition) {
    query += ` AND ${filters.user_input_condition}`;
  } else if (filters.userinput) {
    const ui = filters.userinput.toLowerCase().trim();
    if (ui === "answer") {
      query += `
        AND call_logs.user_input IS NOT NULL
        AND TRIM(call_logs.user_input) != ''
        AND LOWER(TRIM(call_logs.user_input)) <> 'timeout'
      `;
    } else if (ui === "blank") {
      query += ` AND (call_logs.user_input IS NULL OR TRIM(call_logs.user_input) = '') `;
    } else if (ui === "timeout") {
      query += ` AND LOWER(TRIM(call_logs.user_input)) = 'timeout' `;
    }
  }

  // 🔥 DATE always on created_at (OLD behavior — chart uses this)
  if (filters.date_from && filters.date_to) {
    query += " AND DATE(call_logs.created_at) BETWEEN ? AND ?";
    params.push(filters.date_from, filters.date_to);
  } else if (filters.date_from) {
    query += " AND DATE(call_logs.created_at) >= ?";
    params.push(filters.date_from);
  } else if (filters.date_to) {
    query += " AND DATE(call_logs.created_at) <= ?";
    params.push(filters.date_to);
  }

  // order & pagination
  query += " ORDER BY call_logs.id DESC LIMIT ? OFFSET ?";
  params.push(limit, offset);

  console.log("Final SQL Query =>", query, params);

  return await runQuery(query, params);
}
