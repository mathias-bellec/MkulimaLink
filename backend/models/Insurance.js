const mongoose = require('mongoose');

const insuranceSchema = new mongoose.Schema({
  policyholder: {
    type: mongoose.Schema.Types.ObjectId,
    ref: 'User',
    required: true
  },
  type: {
    type: String,
    enum: ['crop', 'livestock', 'equipment', 'transit', 'weather'],
    required: true
  },
  policyNumber: {
    type: String,
    unique: true,
    required: true
  },
  status: {
    type: String,
    enum: ['pending', 'active', 'expired', 'cancelled', 'claimed'],
    default: 'pending'
  },
  coverage: {
    cropType: String,
    farmSize: Number,
    farmLocation: {
      region: String,
      district: String,
      coordinates: {
        latitude: Number,
        longitude: Number
      }
    },
    coverageAmount: {
      type: Number,
      required: true
    },
    deductible: {
      type: Number,
      default: 0
    },
    coveredRisks: [{
      type: String,
      enum: ['drought', 'flood', 'pest', 'disease', 'hail', 'frost', 'fire', 'theft', 'accident']
    }]
  },
  premium: {
    amount: {
      type: Number,
      required: true
    },
    frequency: {
      type: String,
      enum: ['monthly', 'quarterly', 'annually', 'seasonal'],
      default: 'seasonal'
    },
    nextDueDate: Date,
    payments: [{
      amount: Number,
      date: Date,
      reference: String,
      status: {
        type: String,
        enum: ['pending', 'completed', 'failed']
      }
    }]
  },
  period: {
    startDate: {
      type: Date,
      required: true
    },
    endDate: {
      type: Date,
      required: true
    },
    season: String
  },
  claims: [{
    claimNumber: String,
    type: String,
    description: String,
    amount: Number,
    status: {
      type: String,
      enum: ['submitted', 'under_review', 'approved', 'rejected', 'paid'],
      default: 'submitted'
    },
    evidence: [{
      type: String,
      url: String,
      description: String
    }],
    submittedAt: Date,
    reviewedAt: Date,
    approvedAmount: Number,
    paidAt: Date,
    rejectionReason: String,
    notes: String
  }],
  documents: [{
    type: {
      type: String,
      enum: ['policy', 'receipt', 'claim_form', 'evidence', 'other']
    },
    url: String,
    name: String,
    uploadedAt: Date
  }],
  weatherData: {
    linkedStation: String,
    thresholds: {
      rainfall: {
        min: Number,
        max: Number
      },
      temperature: {
        min: Number,
        max: Number
      }
    },
    automaticTrigger: Boolean
  },
  riskScore: {
    type: Number,
    min: 0,
    max: 100
  },
  partner: {
    name: String,
    code: String,
    contactEmail: String
  }
}, {
  timestamps: true
});

insuranceSchema.index({ policyholder: 1, status: 1 });
insuranceSchema.index({ policyNumber: 1 });
insuranceSchema.index({ type: 1, 'period.endDate': 1 });

insuranceSchema.pre('save', function(next) {
  if (!this.policyNumber) {
    this.policyNumber = 'INS' + Date.now().toString(36).toUpperCase() + Math.random().toString(36).substring(2, 6).toUpperCase();
  }
  next();
});

insuranceSchema.statics.calculatePremium = function(type, coverageAmount, options = {}) {
  const baseRates = {
    crop: 0.05,
    livestock: 0.04,
    equipment: 0.03,
    transit: 0.02,
    weather: 0.06
  };
  
  let rate = baseRates[type] || 0.05;
  
  if (options.region === 'high_risk') rate *= 1.3;
  if (options.previousClaims > 0) rate *= 1 + (options.previousClaims * 0.1);
  if (options.farmSize > 10) rate *= 0.95;
  if (options.organicCertified) rate *= 0.9;
  
  const premium = coverageAmount * rate;
  
  return {
    annualPremium: Math.round(premium),
    monthlyPremium: Math.round(premium / 12),
    seasonalPremium: Math.round(premium / 2),
    rate: rate * 100,
    coverageAmount,
    deductible: Math.round(coverageAmount * 0.1)
  };
};

insuranceSchema.methods.submitClaim = async function(claimData) {
  const claimNumber = 'CLM' + Date.now().toString(36).toUpperCase();
  
  this.claims.push({
    claimNumber,
    ...claimData,
    status: 'submitted',
    submittedAt: new Date()
  });
  
  await this.save();
  return this.claims[this.claims.length - 1];
};

module.exports = mongoose.model('Insurance', insuranceSchema);
