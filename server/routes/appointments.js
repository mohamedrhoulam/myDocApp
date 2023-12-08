const express = require("express");
const router = express.Router();
const appointmentsController = require("../controllers/appointmentsController");

router.get("/", appointmentsController.getAllAppointments);

module.exports = router;
