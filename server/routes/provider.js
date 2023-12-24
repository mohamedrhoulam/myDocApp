const express = require('express');
const router = express.Router();
const providerController = require('../controllers/providerController');

router.get('/', providerController.getAllProviders);
router.get('/:PROV_ID', providerController.getProviderById);
router.post('/', providerController.createProvider);
router.put('/:PROV_ID', providerController.updateProvider);
router.delete('/:PROV_ID', providerController.deleteProvider);

module.exports = router;