const express = require('express');
const router = express.Router();

const { orderRouter, getRecentOrder, updateOrder, deleteOrder, getAllOrders, getOrderById } = require("../models/order");

router.get('/', getOrderById);
router.get('/all', getAllOrders);
router.post('/', orderRouter);
router.put('/update', updateOrder);
router.delete('/delete', deleteOrder);

module.exports = router;