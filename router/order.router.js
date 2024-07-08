const express = require('express');
const router = express.Router();

const { orderRouter, getRecentOrder, updateOrder, deleteOrder } = require("../models/order");

router.get('/', orderRouter);
router.get('/all', getAllOrders);
router.post('/', getRecentOrder);
router.put('/update', updateOrder);
router.delete('/delete', deleteOrder);

module.exports = router;