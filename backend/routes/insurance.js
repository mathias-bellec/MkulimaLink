const express = require('express');
const router = express.Router();
const Insurance = require('../models/Insurance');
const { protect } = require('../middleware/auth');

router.get('/products', async (req, res) => {
  try {
    const products = [
      {
        type: 'crop',
        name: 'Crop Protection Insurance',
        description: 'Protect your crops against drought, floods, pests, and diseases',
        coverageOptions: [100000, 500000, 1000000, 5000000],
        coveredRisks: ['drought', 'flood', 'pest', 'disease', 'hail'],
        premium: '5% of coverage amount'
      },
      {
        type: 'livestock',
        name: 'Livestock Insurance',
        description: 'Coverage for cattle, goats, sheep, and poultry',
        coverageOptions: [50000, 200000, 500000, 2000000],
        coveredRisks: ['disease', 'accident', 'theft'],
        premium: '4% of coverage amount'
      },
      {
        type: 'weather',
        name: 'Weather Index Insurance',
        description: 'Automatic payouts when weather conditions trigger thresholds',
        coverageOptions: [100000, 500000, 1000000],
        coveredRisks: ['drought', 'flood', 'frost'],
        premium: '6% of coverage amount',
        features: ['Automatic satellite monitoring', 'No claim filing needed']
      },
      {
        type: 'equipment',
        name: 'Equipment Insurance',
        description: 'Protect your farming equipment and machinery',
        coverageOptions: [500000, 2000000, 10000000],
        coveredRisks: ['theft', 'fire', 'accident'],
        premium: '3% of coverage amount'
      },
      {
        type: 'transit',
        name: 'Transit Insurance',
        description: 'Coverage for products during transportation',
        coverageOptions: [50000, 200000, 500000],
        coveredRisks: ['accident', 'theft', 'damage'],
        premium: '2% of cargo value'
      }
    ];

    res.json(products);
  } catch (error) {
    res.status(500).json({ message: error.message });
  }
});

router.post('/quote', protect, async (req, res) => {
  try {
    const { type, coverageAmount, region, farmSize, previousClaims, organicCertified } = req.body;

    const quote = Insurance.calculatePremium(type, coverageAmount, {
      region,
      farmSize,
      previousClaims: previousClaims || 0,
      organicCertified
    });

    res.json({
      ...quote,
      type,
      validUntil: new Date(Date.now() + 7 * 24 * 60 * 60 * 1000)
    });
  } catch (error) {
    res.status(500).json({ message: error.message });
  }
});

router.post('/purchase', protect, async (req, res) => {
  try {
    const { type, coverageAmount, coverage, period, paymentFrequency, paymentReference } = req.body;

    const premium = Insurance.calculatePremium(type, coverageAmount, {
      region: coverage.farmLocation?.region
    });

    const insurance = await Insurance.create({
      policyholder: req.user._id,
      type,
      status: 'active',
      coverage: {
        ...coverage,
        coverageAmount,
        deductible: premium.deductible,
        coveredRisks: coverage.coveredRisks || ['drought', 'flood', 'pest']
      },
      premium: {
        amount: premium.seasonalPremium,
        frequency: paymentFrequency || 'seasonal',
        nextDueDate: new Date(Date.now() + 180 * 24 * 60 * 60 * 1000),
        payments: [{
          amount: premium.seasonalPremium,
          date: new Date(),
          reference: paymentReference,
          status: 'completed'
        }]
      },
      period: {
        startDate: new Date(),
        endDate: new Date(Date.now() + 365 * 24 * 60 * 60 * 1000),
        season: period?.season || 'masika'
      },
      partner: {
        name: 'MkulimaLink Insurance Partners',
        code: 'MKLINS'
      }
    });

    res.status(201).json({
      message: 'Insurance policy created successfully',
      policy: insurance
    });
  } catch (error) {
    res.status(500).json({ message: error.message });
  }
});

router.get('/my-policies', protect, async (req, res) => {
  try {
    const { status } = req.query;
    const query = { policyholder: req.user._id };
    
    if (status) {
      query.status = status;
    }

    const policies = await Insurance.find(query).sort('-createdAt');

    const stats = {
      totalPolicies: policies.length,
      activePolicies: policies.filter(p => p.status === 'active').length,
      totalCoverage: policies.filter(p => p.status === 'active')
        .reduce((sum, p) => sum + p.coverage.coverageAmount, 0),
      totalClaims: policies.reduce((sum, p) => sum + p.claims.length, 0)
    };

    res.json({ policies, stats });
  } catch (error) {
    res.status(500).json({ message: error.message });
  }
});

router.get('/policy/:id', protect, async (req, res) => {
  try {
    const policy = await Insurance.findById(req.params.id);

    if (!policy) {
      return res.status(404).json({ message: 'Policy not found' });
    }

    if (policy.policyholder.toString() !== req.user._id.toString()) {
      return res.status(403).json({ message: 'Not authorized' });
    }

    res.json(policy);
  } catch (error) {
    res.status(500).json({ message: error.message });
  }
});

router.post('/policy/:id/claim', protect, async (req, res) => {
  try {
    const { type, description, amount, evidence } = req.body;
    const policy = await Insurance.findById(req.params.id);

    if (!policy) {
      return res.status(404).json({ message: 'Policy not found' });
    }

    if (policy.policyholder.toString() !== req.user._id.toString()) {
      return res.status(403).json({ message: 'Not authorized' });
    }

    if (policy.status !== 'active') {
      return res.status(400).json({ message: 'Policy is not active' });
    }

    const claim = await policy.submitClaim({
      type,
      description,
      amount,
      evidence: evidence || []
    });

    res.status(201).json({
      message: 'Claim submitted successfully',
      claim
    });
  } catch (error) {
    res.status(500).json({ message: error.message });
  }
});

router.get('/policy/:id/claims', protect, async (req, res) => {
  try {
    const policy = await Insurance.findById(req.params.id);

    if (!policy) {
      return res.status(404).json({ message: 'Policy not found' });
    }

    if (policy.policyholder.toString() !== req.user._id.toString()) {
      return res.status(403).json({ message: 'Not authorized' });
    }

    res.json(policy.claims);
  } catch (error) {
    res.status(500).json({ message: error.message });
  }
});

router.post('/policy/:id/renew', protect, async (req, res) => {
  try {
    const { paymentReference } = req.body;
    const policy = await Insurance.findById(req.params.id);

    if (!policy) {
      return res.status(404).json({ message: 'Policy not found' });
    }

    if (policy.policyholder.toString() !== req.user._id.toString()) {
      return res.status(403).json({ message: 'Not authorized' });
    }

    policy.period.startDate = policy.period.endDate;
    policy.period.endDate = new Date(policy.period.endDate.getTime() + 365 * 24 * 60 * 60 * 1000);
    policy.status = 'active';

    policy.premium.payments.push({
      amount: policy.premium.amount,
      date: new Date(),
      reference: paymentReference,
      status: 'completed'
    });

    policy.premium.nextDueDate = new Date(Date.now() + 180 * 24 * 60 * 60 * 1000);

    await policy.save();

    res.json({
      message: 'Policy renewed successfully',
      policy
    });
  } catch (error) {
    res.status(500).json({ message: error.message });
  }
});

module.exports = router;
