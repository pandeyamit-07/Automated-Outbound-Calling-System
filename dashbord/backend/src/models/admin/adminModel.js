// src/model/admin/adminModel.js

import db from "../../config/db.js";

export const findAdminByEmail = (email) => {
  return new Promise((resolve, reject) => {
    const q = "SELECT * FROM admin WHERE email = ? LIMIT 1";

    db.query(q, [email], (err, data) => {
      if (err) reject(err);
      else resolve(data[0]);
    });
  });
};
