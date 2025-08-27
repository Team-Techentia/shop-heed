const express = require('express');
const { handleRazorpayWebhook } = require('../controller/webhookController');
const router = express.Router();

router.post('/razorpay', express.json({ verify: (req, res, buf) => { req.rawBody = buf.toString(); }}), handleRazorpayWebhook);

module.exports = router;
