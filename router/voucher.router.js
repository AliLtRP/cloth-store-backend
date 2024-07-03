const express = require('express');
const router = express.Router();

const {voucherRouter} = require ('../models/voucher');

router.post('/' , voucherRouter);

module.exports = router;
