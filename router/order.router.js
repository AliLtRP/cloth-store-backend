const express = require('express');
const router = express.Router();

const {orderRouter,getRecentOrder,getAllOrders,updateOrder,deleteOrder,getOrderById} = require("../models/order");

router.post('/',orderRouter);
router.get('/recent',getRecentOrder);
router.get('/all',getAllOrders);
router.get('/',getOrderById);
router.put('/',updateOrder);

module.exports = router;