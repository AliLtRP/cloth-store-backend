const express = require('express');
const router = express.Router();

const { voucherRouter, getAllVouchers, getVoucherById, updateVoucher, deleteVoucher } = require('../models/voucher');

router.post('/', voucherRouter);
router.get('/all', getAllVouchers);
router.get('/', getVoucherById);
router.put('/update', updateVoucher);
router.delete('/delete', deleteVoucher);



module.exports = router;
