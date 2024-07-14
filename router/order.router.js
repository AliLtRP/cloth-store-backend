const express = require('express');
const router = express.Router();

const { orderRouter, getRecentOrder, updateOrder, deleteOrder, getAllOrders, getOrderById } = require("../models/order");
const isAuth = require('../middleware');

router.get('/', isAuth, getOrderById);
router.get('/all', isAuth, getAllOrders);
router.post('/', isAuth, orderRouter);
router.put('/update', isAuth, updateOrder);
router.delete('/delete', isAuth, deleteOrder);


module.exports = router;