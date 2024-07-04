const express = require('express');
const router = express.Router();
const { discountRouter, getAllDiscount, getDiscountById } = require("../models/discount");

router.post('/', discountRouter);
router.get('/all', getAllDiscount)
router.get('/', getDiscountById)

module.exports = router;