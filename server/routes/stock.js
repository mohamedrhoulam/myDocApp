const express = require('express');
const router = express.Router();
const stockController = require('../controllers/stockController');

router.get('/', stockController.getAllStocks);
router.get('/:MED_serial_num', stockController.getStockBySerialNum);
router.get('/provider/:PROV_ID', stockController.getStocksByProvider);
router.get('/recent', stockController.getRecentStocks);
router.post('/', stockController.addStock);
router.put('/:MED_serial_num', stockController.updateStock);
router.delete('/:MED_serial_num', stockController.deleteStock);

module.exports = router;