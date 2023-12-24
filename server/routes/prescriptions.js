const express = require("express");
const router = express.Router();
const prescriptionsController = require("../controllers/prescriptionsController");

router.get("/", prescriptionsController.getAllPrescriptions);
router.put("/", prescriptionsController.updatePrescription);
router.delete("/:doc_id", prescriptionsController.deletePrescription);
router.post("/", prescriptionsController.addPrescription);



module.exports = router;