const express = require("express");
const router = express.Router();
const certificatesController = require("../controllers/certificatesController");

router.get("/", certificatesController.getAllCertificates);
router.put("/", certificatesController.updateCertificate);
router.delete("/:id", certificatesController.deleteCertificate);
router.post("/", certificatesController.addCertificate);

module.exports = router;