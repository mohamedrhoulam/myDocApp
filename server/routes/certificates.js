const express = require("express");
const router = express.Router();
const certificatesController = require("../controllers/certificatesController");

router.get("/", certificatesController.getAllCertificates);
router.put("/", certificatesController.updateCertificate);
router.post("/", certificatesController.addCertificate);
router.delete("/:id", certificatesController.deleteCertificate);

module.exports = router;