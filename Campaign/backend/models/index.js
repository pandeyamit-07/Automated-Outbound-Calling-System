// models/index.js
const { pool } = require('../config/db.config');

module.exports = {
  query: (sql, params) => pool.execute(sql, params)
};
