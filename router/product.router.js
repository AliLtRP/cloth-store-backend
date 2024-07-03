const express = require('express');
const { createProduct, getProduct, getAllProducts, updateProduct, deleteProduct } = require('../models/product');
const router = express.Router();


router.get('/', createProduct);
router.get('/', getProduct);
router.get('/', getAllProducts);
router.put('/', updateProduct);
router.delete('/', deleteProduct);


module.exports = router;