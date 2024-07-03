const express = require('express');
const { createCategoryToProduct } = require('../models/categoryToProduct');
const router = express.Router();


router.get('/', (req, res) => {
    res.send('ok')
});

router.post('/', createCategoryToProduct);

module.exports = router;