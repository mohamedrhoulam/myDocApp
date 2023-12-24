const express = require('express');
const router = express.Router();
const medicineController = require('../controllers/medicineController');

router.get('/', medicineController.getAllMedicines);
router.get('/:med_serial_num', medicineController.getMedicineById);
router.post('/', medicineController.createMedicine);
router.put('/:med_serial_num', medicineController.updateMedicine);
router.delete('/:med_serial_num', medicineController.deleteMedicine);
router.get('/api/medicines/expired', medicineController.getExpiredMedicines);


module.exports = router;