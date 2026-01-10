const mongoose = require('mongoose');

const transactionSchema = new mongoose.Schema({
  product: {
    type: mongoose.Schema.Types.ObjectId,
    ref: 'Product',
    required: true
  },
  buyer: {
    type: mongoose.Schema.Types.ObjectId,
    ref: 'User',
    required: true
  },
  seller: {
    type: mongoose.Schema.Types.ObjectId,
    ref: 'User',
    required: true
  },
  quantity: {
    type: Number,
    required: true,
    min: 1
  },
  unitPrice: {
    type: Number,
    required: true
  },
  totalAmount: {
    type: Number,
    required: true
  },
  commission: {
    type: Number,
    required: true
  },
  sellerAmount: {
    type: Number,
    required: true
  },
  status: {
    type: String,
    enum: ['pending', 'confirmed', 'paid', 'shipped', 'delivered', 'completed', 'cancelled', 'disputed'],
    default: 'pending'
  },
  paymentMethod: {
    type: String,
    enum: ['mpesa', 'cash', 'bank_transfer'],
    default: 'mpesa'
  },
  paymentReference: {
    type: String
  },
  deliveryDetails: {
    address: String,
    phone: String,
    notes: String,
    estimatedDelivery: Date
  },
  ratings: {
    buyerRating: {
      score: Number,
      comment: String,
      createdAt: Date
    },
    sellerRating: {
      score: Number,
      comment: String,
      createdAt: Date
    }
  },
  timeline: [{
    status: String,
    timestamp: Date,
    note: String
  }]
}, {
  timestamps: true
});

transactionSchema.index({ buyer: 1, status: 1 });
transactionSchema.index({ seller: 1, status: 1 });
transactionSchema.index({ status: 1, createdAt: -1 });

module.exports = mongoose.model('Transaction', transactionSchema);
