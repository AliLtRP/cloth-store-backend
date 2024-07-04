const express = require('express');
const router = express.Router();

const { discountRouter, getAllDiscount, getDiscountById, updateDiscount } = require("../models/discount");

router.post('/', discountRouter);
router.get('/all', getAllDiscount)
router.get('/', getDiscountById)
router.put('/', updateDiscount)


module.exports = router;