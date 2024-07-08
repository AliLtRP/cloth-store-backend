const express = require('express');
const router = express.Router();

const {voucherRouter,getAllVouchers,getVoucherById,updateVoucher} = require ('../models/voucher');

router.post('/' , voucherRouter);
router.get('/all' ,getAllVouchers );
router.get('/' ,getVoucherById );
router.put('/' ,updateVoucher );


module.exports = router;
