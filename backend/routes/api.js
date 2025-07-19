const express = require('express');
const router = express.Router();
const productController = require('../controllers/productController');

// Product routes
router.post('/', productController.addProduct);
router.get('/', productController.getAllProducts);
router.get('/expiring', productController.getExpiringProducts);
router.get('/expired', productController.getExpiredProducts);
router.get('/scan', productController.scanProducts);
router.get('/stats', productController.getProductStats);
router.delete('/:id', productController.deleteProduct);

module.exports = router;