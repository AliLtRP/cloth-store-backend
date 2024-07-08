const express = require('express');
const router = express.Router();

const { voucherRouter, getAllVouchers, getVoucherById, updateVoucher, deleteVoucher } = require('../models/voucher');

router.get('/', getVoucherById);
router.get('/all', getAllVouchers);
router.post('/', voucherRouter);
router.put('/update', updateVoucher);
router.put('/delete', deleteVoucher);


module.exports = router;
