require("dotenv").config();

const { Pool } = require("pg");

const pool = new Pool({
  user: "postgres",
  host: "localhost",
  database: "mydocdb",
  password: "mohaMED01",
  port: "5432",
});

module.exports = {
  query: (text, params, callback) => {
    return pool.query(text, params, callback);
  },
};
