const express = require("express");
const router = express.Router();
const appointmentsController = require("../controllers/appointmentsController");

router.get("/", appointmentsController.getAllAppointments);
router.get("/:id", appointmentsController.getAppointmentById);
router.get("/status/:status", appointmentsController.getAppointmentsByStatus);
router.post("/", appointmentsController.createAppointment);
router.put("/:id", appointmentsController.updateAppointment);
router.delete("/:id", appointmentsController.deleteAppointment);

module.exports = router;
