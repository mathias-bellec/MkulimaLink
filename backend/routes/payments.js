const express = require('express');
const router = express.Router();
const axios = require('axios');
const { protect } = require('../middleware/auth');
const Transaction = require('../models/Transaction');
const User = require('../models/User');

const getMpesaToken = async () => {
  const auth = Buffer.from(
    `${process.env.MPESA_CONSUMER_KEY}:${process.env.MPESA_CONSUMER_SECRET}`
  ).toString('base64');

  try {
    const response = await axios.get(
      'https://sandbox.safaricom.co.ke/oauth/v1/generate?grant_type=client_credentials',
      {
        headers: {
          Authorization: `Basic ${auth}`
        }
      }
    );
    return response.data.access_token;
  } catch (error) {
    throw new Error('Failed to get M-Pesa token');
  }
};

router.post('/mpesa/initiate', protect, async (req, res) => {
  try {
    const { transactionId, phoneNumber } = req.body;

    const transaction = await Transaction.findById(transactionId);
    if (!transaction) {
      return res.status(404).json({ message: 'Transaction not found' });
    }

    if (transaction.buyer.toString() !== req.user._id.toString()) {
      return res.status(403).json({ message: 'Not authorized' });
    }

    const token = await getMpesaToken();
    const timestamp = new Date().toISOString().replace(/[^0-9]/g, '').slice(0, -3);
    const password = Buffer.from(
      `${process.env.MPESA_SHORTCODE}${process.env.MPESA_PASSKEY}${timestamp}`
    ).toString('base64');

    const stkPushData = {
      BusinessShortCode: process.env.MPESA_SHORTCODE,
      Password: password,
      Timestamp: timestamp,
      TransactionType: 'CustomerPayBillOnline',
      Amount: Math.round(transaction.totalAmount),
      PartyA: phoneNumber,
      PartyB: process.env.MPESA_SHORTCODE,
      PhoneNumber: phoneNumber,
      CallBackURL: process.env.MPESA_CALLBACK_URL,
      AccountReference: `MKUL${transaction._id}`,
      TransactionDesc: `Payment for ${transaction.product}`
    };

    const response = await axios.post(
      'https://sandbox.safaricom.co.ke/mpesa/stkpush/v1/processrequest',
      stkPushData,
      {
        headers: {
          Authorization: `Bearer ${token}`
        }
      }
    );

    transaction.paymentReference = response.data.CheckoutRequestID;
    await transaction.save();

    res.json({
      message: 'Payment initiated successfully',
      checkoutRequestId: response.data.CheckoutRequestID
    });
  } catch (error) {
    console.error('M-Pesa error:', error.response?.data || error.message);
    res.status(500).json({ message: 'Payment initiation failed', error: error.message });
  }
});

router.post('/mpesa/callback', async (req, res) => {
  try {
    const { Body } = req.body;
    const { stkCallback } = Body;

    const checkoutRequestId = stkCallback.CheckoutRequestID;
    const resultCode = stkCallback.ResultCode;

    const transaction = await Transaction.findOne({ paymentReference: checkoutRequestId });
    
    if (transaction) {
      if (resultCode === 0) {
        transaction.status = 'paid';
        transaction.timeline.push({
          status: 'paid',
          timestamp: new Date(),
          note: 'Payment received via M-Pesa'
        });
        await transaction.save();

        const seller = await User.findById(transaction.seller);
        seller.balance += transaction.sellerAmount;
        await seller.save();
      } else {
        transaction.status = 'cancelled';
        transaction.timeline.push({
          status: 'cancelled',
          timestamp: new Date(),
          note: 'Payment failed'
        });
        await transaction.save();
      }
    }

    res.json({ ResultCode: 0, ResultDesc: 'Success' });
  } catch (error) {
    console.error('Callback error:', error);
    res.json({ ResultCode: 1, ResultDesc: 'Failed' });
  }
});

router.post('/premium/subscribe', protect, async (req, res) => {
  try {
    const { plan, phoneNumber } = req.body;
    
    const prices = {
      monthly: parseInt(process.env.PREMIUM_MONTHLY_PRICE) || 10000,
      yearly: parseInt(process.env.PREMIUM_YEARLY_PRICE) || 100000
    };

    const amount = prices[plan];
    if (!amount) {
      return res.status(400).json({ message: 'Invalid plan' });
    }

    const token = await getMpesaToken();
    const timestamp = new Date().toISOString().replace(/[^0-9]/g, '').slice(0, -3);
    const password = Buffer.from(
      `${process.env.MPESA_SHORTCODE}${process.env.MPESA_PASSKEY}${timestamp}`
    ).toString('base64');

    const stkPushData = {
      BusinessShortCode: process.env.MPESA_SHORTCODE,
      Password: password,
      Timestamp: timestamp,
      TransactionType: 'CustomerPayBillOnline',
      Amount: amount,
      PartyA: phoneNumber,
      PartyB: process.env.MPESA_SHORTCODE,
      PhoneNumber: phoneNumber,
      CallBackURL: `${process.env.MPESA_CALLBACK_URL}/premium`,
      AccountReference: `PREMIUM_${req.user._id}`,
      TransactionDesc: `MkulimaLink Premium ${plan} subscription`
    };

    const response = await axios.post(
      'https://sandbox.safaricom.co.ke/mpesa/stkpush/v1/processrequest',
      stkPushData,
      {
        headers: {
          Authorization: `Bearer ${token}`
        }
      }
    );

    const expiryDate = new Date();
    if (plan === 'monthly') {
      expiryDate.setMonth(expiryDate.getMonth() + 1);
    } else {
      expiryDate.setFullYear(expiryDate.getFullYear() + 1);
    }

    req.user.isPremium = true;
    req.user.premiumExpiresAt = expiryDate;
    await req.user.save();

    res.json({
      message: 'Premium subscription activated',
      expiresAt: expiryDate,
      checkoutRequestId: response.data.CheckoutRequestID
    });
  } catch (error) {
    console.error('Premium subscription error:', error.response?.data || error.message);
    res.status(500).json({ message: 'Subscription failed', error: error.message });
  }
});

router.get('/balance', protect, async (req, res) => {
  try {
    res.json({ balance: req.user.balance });
  } catch (error) {
    res.status(500).json({ message: error.message });
  }
});

router.post('/withdraw', protect, async (req, res) => {
  try {
    const { amount, phoneNumber } = req.body;

    if (amount > req.user.balance) {
      return res.status(400).json({ message: 'Insufficient balance' });
    }

    if (amount < 100) {
      return res.status(400).json({ message: 'Minimum withdrawal is TZS 100' });
    }

    req.user.balance -= amount;
    await req.user.save();

    res.json({
      message: 'Withdrawal request submitted',
      newBalance: req.user.balance
    });
  } catch (error) {
    res.status(500).json({ message: error.message });
  }
});

module.exports = router;
