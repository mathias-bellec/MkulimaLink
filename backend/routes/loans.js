const express = require('express');
const router = express.Router();
const Loan = require('../models/Loan');
const { protect } = require('../middleware/auth');

router.post('/apply', protect, async (req, res) => {
  try {
    const { amount, purpose, duration, collateral, guarantorId } = req.body;

    if (amount < 10000 || amount > 5000000) {
      return res.status(400).json({ message: 'Loan amount must be between 10,000 and 5,000,000 TZS' });
    }

    const activeLoan = await Loan.findOne({
      borrower: req.user._id,
      status: { $in: ['approved', 'disbursed', 'repaying'] }
    });

    if (activeLoan) {
      return res.status(400).json({ message: 'You already have an active loan' });
    }

    const loan = new Loan({
      borrower: req.user._id,
      amount,
      purpose,
      duration,
      collateral,
      guarantor: guarantorId,
      originationFee: amount * 0.02
    });

    await loan.calculateCreditScore();

    if (loan.creditScore < 40) {
      loan.status = 'rejected';
      await loan.save();
      return res.status(400).json({ 
        message: 'Loan application rejected due to low credit score',
        creditScore: loan.creditScore
      });
    }

    let approvedAmount = amount;
    if (loan.creditScore < 60) {
      approvedAmount = amount * 0.7;
    } else if (loan.creditScore < 80) {
      approvedAmount = amount * 0.85;
    }

    loan.approvedAmount = approvedAmount;
    loan.status = 'approved';
    
    const dueDate = new Date();
    dueDate.setMonth(dueDate.getMonth() + duration);
    loan.dueDate = dueDate;

    const totalInterest = (approvedAmount * loan.interestRate * duration) / (12 * 100);
    loan.remainingBalance = approvedAmount + totalInterest + loan.originationFee;

    await loan.save();

    res.status(201).json({
      message: 'Loan approved!',
      loan,
      creditScore: loan.creditScore,
      approvedAmount,
      totalRepayment: loan.remainingBalance,
      monthlyPayment: loan.remainingBalance / duration
    });
  } catch (error) {
    res.status(500).json({ message: error.message });
  }
});

router.get('/my-loans', protect, async (req, res) => {
  try {
    const loans = await Loan.find({ borrower: req.user._id })
      .sort('-createdAt');

    const stats = {
      totalLoans: loans.length,
      activeLoans: loans.filter(l => ['approved', 'disbursed', 'repaying'].includes(l.status)).length,
      completedLoans: loans.filter(l => l.status === 'completed').length,
      totalBorrowed: loans.filter(l => l.status !== 'rejected').reduce((sum, l) => sum + (l.approvedAmount || 0), 0),
      totalRepaid: loans.reduce((sum, l) => sum + l.totalRepaid, 0)
    };

    res.json({ loans, stats });
  } catch (error) {
    res.status(500).json({ message: error.message });
  }
});

router.post('/:id/repay', protect, async (req, res) => {
  try {
    const { amount, paymentReference } = req.body;
    const loan = await Loan.findById(req.params.id);

    if (!loan) {
      return res.status(404).json({ message: 'Loan not found' });
    }

    if (loan.borrower.toString() !== req.user._id.toString()) {
      return res.status(403).json({ message: 'Not authorized' });
    }

    if (loan.status === 'completed') {
      return res.status(400).json({ message: 'Loan already repaid' });
    }

    loan.repayments.push({
      amount,
      date: new Date(),
      method: 'mpesa',
      reference: paymentReference
    });

    loan.totalRepaid += amount;
    loan.remainingBalance -= amount;

    if (loan.remainingBalance <= 0) {
      loan.status = 'completed';
      loan.remainingBalance = 0;
    } else {
      loan.status = 'repaying';
    }

    await loan.save();

    res.json({
      message: 'Payment recorded successfully',
      remainingBalance: loan.remainingBalance,
      status: loan.status
    });
  } catch (error) {
    res.status(500).json({ message: error.message });
  }
});

router.get('/credit-score', protect, async (req, res) => {
  try {
    const tempLoan = new Loan({ borrower: req.user._id, amount: 100000, duration: 6, purpose: 'seeds' });
    const creditScore = await tempLoan.calculateCreditScore();

    const eligibility = {
      score: creditScore,
      maxLoanAmount: creditScore >= 80 ? 5000000 : creditScore >= 60 ? 2000000 : creditScore >= 40 ? 500000 : 0,
      interestRate: creditScore >= 80 ? 12 : creditScore >= 60 ? 15 : 18,
      eligible: creditScore >= 40
    };

    res.json(eligibility);
  } catch (error) {
    res.status(500).json({ message: error.message });
  }
});

module.exports = router;
