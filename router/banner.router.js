const express = require('express');
const router = express.Router();

const {bannerRouter} = require ('../models/banner');

router.post('/' , bannerRouter);

module.exports = router;