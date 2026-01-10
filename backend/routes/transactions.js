const express = require('express');
const router = express.Router();
const Transaction = require('../models/Transaction');
const Product = require('../models/Product');
const User = require('../models/User');
const { protect } = require('../middleware/auth');
const { sendSMS } = require('../utils/sms');

router.post('/', protect, async (req, res) => {
  try {
    const { productId, quantity, deliveryDetails } = req.body;

    const product = await Product.findById(productId).populate('seller');
    if (!product) {
      return res.status(404).json({ message: 'Product not found' });
    }

    if (product.quantity < quantity) {
      return res.status(400).json({ message: 'Insufficient quantity available' });
    }

    if (product.seller._id.toString() === req.user._id.toString()) {
      return res.status(400).json({ message: 'Cannot buy your own product' });
    }

    const totalAmount = product.price * quantity;
    const commissionRate = parseFloat(process.env.COMMISSION_RATE) || 0.05;
    const commission = totalAmount * commissionRate;
    const sellerAmount = totalAmount - commission;

    const transaction = await Transaction.create({
      product: productId,
      buyer: req.user._id,
      seller: product.seller._id,
      quantity,
      unitPrice: product.price,
      totalAmount,
      commission,
      sellerAmount,
      deliveryDetails,
      timeline: [{
        status: 'pending',
        timestamp: new Date(),
        note: 'Transaction created'
      }]
    });

    product.quantity -= quantity;
    if (product.quantity === 0) {
      product.status = 'sold';
    }
    await product.save();

    await sendSMS(
      product.seller.phone,
      `New order for ${product.name}! Quantity: ${quantity}. Buyer: ${req.user.name}. Total: TZS ${sellerAmount.toLocaleString()}`
    );

    await sendSMS(
      req.user.phone,
      `Order confirmed for ${product.name}. Quantity: ${quantity}. Total: TZS ${totalAmount.toLocaleString()}. Seller: ${product.seller.name}`
    );

    res.status(201).json(transaction);
  } catch (error) {
    res.status(500).json({ message: error.message });
  }
});

router.get('/my/purchases', protect, async (req, res) => {
  try {
    const transactions = await Transaction.find({ buyer: req.user._id })
      .populate('product')
      .populate('seller', 'name phone rating')
      .sort('-createdAt');
    res.json(transactions);
  } catch (error) {
    res.status(500).json({ message: error.message });
  }
});

router.get('/my/sales', protect, async (req, res) => {
  try {
    const transactions = await Transaction.find({ seller: req.user._id })
      .populate('product')
      .populate('buyer', 'name phone rating')
      .sort('-createdAt');
    res.json(transactions);
  } catch (error) {
    res.status(500).json({ message: error.message });
  }
});

router.get('/:id', protect, async (req, res) => {
  try {
    const transaction = await Transaction.findById(req.params.id)
      .populate('product')
      .populate('buyer', 'name phone location')
      .populate('seller', 'name phone location');

    if (!transaction) {
      return res.status(404).json({ message: 'Transaction not found' });
    }

    if (transaction.buyer._id.toString() !== req.user._id.toString() &&
        transaction.seller._id.toString() !== req.user._id.toString()) {
      return res.status(403).json({ message: 'Not authorized to view this transaction' });
    }

    res.json(transaction);
  } catch (error) {
    res.status(500).json({ message: error.message });
  }
});

router.put('/:id/status', protect, async (req, res) => {
  try {
    const { status, note } = req.body;
    const transaction = await Transaction.findById(req.params.id);

    if (!transaction) {
      return res.status(404).json({ message: 'Transaction not found' });
    }

    if (transaction.buyer.toString() !== req.user._id.toString() &&
        transaction.seller.toString() !== req.user._id.toString()) {
      return res.status(403).json({ message: 'Not authorized to update this transaction' });
    }

    transaction.status = status;
    transaction.timeline.push({
      status,
      timestamp: new Date(),
      note: note || `Status updated to ${status}`
    });

    await transaction.save();
    res.json(transaction);
  } catch (error) {
    res.status(500).json({ message: error.message });
  }
});

router.post('/:id/rate', protect, async (req, res) => {
  try {
    const { rating, comment } = req.body;
    const transaction = await Transaction.findById(req.params.id);

    if (!transaction) {
      return res.status(404).json({ message: 'Transaction not found' });
    }

    if (transaction.status !== 'completed') {
      return res.status(400).json({ message: 'Can only rate completed transactions' });
    }

    const isBuyer = transaction.buyer.toString() === req.user._id.toString();
    const isSeller = transaction.seller.toString() === req.user._id.toString();

    if (!isBuyer && !isSeller) {
      return res.status(403).json({ message: 'Not authorized to rate this transaction' });
    }

    if (isBuyer) {
      transaction.ratings.sellerRating = {
        score: rating,
        comment,
        createdAt: new Date()
      };
      const seller = await User.findById(transaction.seller);
      seller.updateRating(rating);
      await seller.save();
    } else {
      transaction.ratings.buyerRating = {
        score: rating,
        comment,
        createdAt: new Date()
      };
      const buyer = await User.findById(transaction.buyer);
      buyer.updateRating(rating);
      await buyer.save();
    }

    await transaction.save();
    res.json({ message: 'Rating submitted successfully' });
  } catch (error) {
    res.status(500).json({ message: error.message });
  }
});

router.get('/stats/dashboard', protect, async (req, res) => {
  try {
    const isFarmer = req.user.role === 'farmer';
    const query = isFarmer ? { seller: req.user._id } : { buyer: req.user._id };

    const totalTransactions = await Transaction.countDocuments(query);
    const completedTransactions = await Transaction.countDocuments({ ...query, status: 'completed' });
    
    const revenueData = await Transaction.aggregate([
      { $match: { ...query, status: 'completed' } },
      {
        $group: {
          _id: null,
          totalRevenue: { $sum: isFarmer ? '$sellerAmount' : '$totalAmount' },
          totalCommission: { $sum: '$commission' }
        }
      }
    ]);

    const revenue = revenueData.length > 0 ? revenueData[0] : { totalRevenue: 0, totalCommission: 0 };

    res.json({
      totalTransactions,
      completedTransactions,
      totalRevenue: revenue.totalRevenue,
      totalCommission: revenue.totalCommission
    });
  } catch (error) {
    res.status(500).json({ message: error.message });
  }
});

module.exports = router;
