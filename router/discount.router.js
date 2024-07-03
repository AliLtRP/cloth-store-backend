const express = require('express');
const router = express.Router();
const { discountRouter } = require("../models/discount");


router.post('/', discountRouter);

module.exports = router;