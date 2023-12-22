const express = require("express");
const router = express.Router();
const patientController = require("../controllers/patientController");

router.get("/", patientController.getAllPatients);
router.get("/:id", patientController.getPatientById);
router.post("/", patientController.createPatient);
router.put("/:id", patientController.updatePatient);
router.delete("/:id", patientController.deletePatient);
router.get("/withAppointments", patientController.getPatientsWithAppointments);
router.get("/withoutAppointments", patientController.getPatientsWithoutAppointments);
router.get("/:id/age", patientController.getPatientAge);

module.exports = router;