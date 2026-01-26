const express = require('express');
const { createOrder, verifyPayment, getOrderByUserId, updateOrderStatus, getOrderById, deleteOrder, generateInvoicing } = require('../controller/orderController');
const router = express.Router();
const auth = require("../auth/index")
const { authenticateToken, userAuthorisation, adminAuthorisation, } = auth

router.post('/create-order', authenticateToken, createOrder);
router.post('/verify-payment', authenticateToken, userAuthorisation, verifyPayment);
router.post('/update-order-status', updateOrderStatus);
router.get('/order-List', authenticateToken, userAuthorisation, getOrderByUserId);
router.get('/get/order/:id', authenticateToken, userAuthorisation, getOrderById);
router.put("/delete/order/:id", deleteOrder)
router.get('/generate-invoicing/:orderId', generateInvoicing);


module.exports = router;
