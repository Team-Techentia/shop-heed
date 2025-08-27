const crypto = require('crypto');
const Order = require('../../Model/orderModel');
const Event = require('../../Model/eventModel');
require("dotenv").config()

// not used this webhook

const handleRazorpayWebhook = async (req, res) => {
  const secret = 'YOUR_RAZORPAY_SECRET';
  const shasum = crypto.createHmac(process.env.HMAC_KEY, secret);
  shasum.update(req.rawBody);
  const digest = shasum.digest('hex');

  if (digest === req.headers['x-razorpay-signature']) {
    try {
      const event = new Event(req.body);
      await event.save();

      const { event: eventType, payload } = req.body;
      if (eventType === 'payment.captured') {
        const { order_id } = payload.payment.entity;
        await Order.updateOne({ orderId: order_id }, { paymentStatus: 'completed' });
      } else if (eventType === 'payment.failed') {
        const { order_id } = payload.payment.entity;
        await Order.updateOne({ orderId: order_id }, { paymentStatus: 'failed' });
      }

      res.status(200).json({ status: 'Ok' });
    } catch (error) {
     return res.status(500).json({ error: 'Failed to save event' });
    }
  } else {
   return res.status(400).json({ error: 'Invalid signature' });
  }
};

module.exports = { handleRazorpayWebhook };
