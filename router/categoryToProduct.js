const express = require('express');
const { createCategoryToProduct, getAllProductsAttachToCategory } = require('../models/categoryToProduct');
const router = express.Router();


router.get('/', getAllProductsAttachToCategory);

router.post('/', createCategoryToProduct);

module.exports = router;