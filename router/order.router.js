const express = require('express');
const router = express.Router();

const {orderRouter} = require("../models/order");

router.post('/',orderRouter);

module.exports = router;