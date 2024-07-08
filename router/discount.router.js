const express = require('express');
const router = express.Router();

const { discountRouter, getAllDiscount, getDiscountById, updateDiscount,deleteDiscount } = require("../models/discount");

router.post('/', discountRouter);
router.get('/all', getAllDiscount)
router.get('/', getDiscountById)
router.put('/update', updateDiscount)
router.delete('/delete',deleteDiscount);



module.exports = router;