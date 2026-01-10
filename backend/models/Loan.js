const mongoose = require('mongoose');

const loanSchema = new mongoose.Schema({
  borrower: {
    type: mongoose.Schema.Types.ObjectId,
    ref: 'User',
    required: true
  },
  amount: {
    type: Number,
    required: true,
    min: 10000,
    max: 5000000
  },
  purpose: {
    type: String,
    enum: ['seeds', 'fertilizer', 'equipment', 'labor', 'other'],
    required: true
  },
  interestRate: {
    type: Number,
    required: true,
    default: 15
  },
  duration: {
    type: Number,
    required: true,
    min: 1,
    max: 12
  },
  status: {
    type: String,
    enum: ['pending', 'approved', 'disbursed', 'repaying', 'completed', 'defaulted', 'rejected'],
    default: 'pending'
  },
  creditScore: {
    type: Number,
    min: 0,
    max: 100
  },
  approvedAmount: {
    type: Number
  },
  disbursedAt: {
    type: Date
  },
  dueDate: {
    type: Date
  },
  repayments: [{
    amount: Number,
    date: Date,
    method: String,
    reference: String
  }],
  totalRepaid: {
    type: Number,
    default: 0
  },
  remainingBalance: {
    type: Number
  },
  collateral: {
    type: String
  },
  guarantor: {
    type: mongoose.Schema.Types.ObjectId,
    ref: 'User'
  },
  originationFee: {
    type: Number,
    default: 0
  }
}, {
  timestamps: true
});

loanSchema.index({ borrower: 1, status: 1 });
loanSchema.index({ status: 1, dueDate: 1 });

loanSchema.methods.calculateCreditScore = async function() {
  const User = mongoose.model('User');
  const Transaction = mongoose.model('Transaction');
  
  const user = await User.findById(this.borrower);
  const completedTransactions = await Transaction.countDocuments({
    $or: [{ buyer: this.borrower }, { seller: this.borrower }],
    status: 'completed'
  });
  
  let score = 50;
  
  if (user.verified) score += 10;
  if (user.isPremium) score += 10;
  if (user.rating >= 4.5) score += 15;
  if (completedTransactions >= 10) score += 10;
  if (completedTransactions >= 50) score += 5;
  
  const previousLoans = await this.constructor.find({
    borrower: this.borrower,
    status: { $in: ['completed', 'repaying'] }
  });
  
  if (previousLoans.length > 0) {
    const onTimePayments = previousLoans.filter(l => l.status === 'completed').length;
    score += Math.min(onTimePayments * 2, 10);
  }
  
  this.creditScore = Math.min(score, 100);
  return this.creditScore;
};

module.exports = mongoose.model('Loan', loanSchema);
