const express = require("express");
const router = express.Router();
const db = require("../config/db");

router.get("/", async (req, res) => {
  try {
    const result = await db.query("SELECT * FROM todays_appointments");
    res.json(result.rows);
  } catch (error) {
    console.error("Error fetching today's appointments:", error);
    res.status(500).json({ error: "Internal server error" });
  }
});

module.exports = router;