const express = require('express');
const router = express.Router();

const { discountRouter, getAllDiscount, getDiscountById, updateDiscount, deleteDiscount } = require("../models/discount");

router.get('/', getDiscountById)
router.get('/all', getAllDiscount)
router.post('/', discountRouter);
router.put('/update', updateDiscount)
router.delete('/delete', deleteDiscount);



module.exports = router;