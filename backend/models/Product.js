const mongoose = require('mongoose');
const { isBefore, differenceInDays } = require('date-fns');

const productSchema = new mongoose.Schema({
  name: {
    type: String,
    required: true,
    trim: true
  },
  category: {
    type: String,
    required: true,
    enum: ['medicine', 'food', 'cosmetics', 'other'],
    default: 'medicine'
  },
  expiryDate: {
    type: Date,
    required: true
  },
  quantity: {
    type: Number,
    required: true,
    min: 1,
    default: 1
  },
  batchNumber: {
    type: String,
    trim: true
  },
  status: {
    type: String,
    enum: ['active', 'expired', 'expiring_soon'],
    default: 'active'
  },
  daysUntilExpiry: {
    type: Number,
    default: function() {
      return differenceInDays(this.expiryDate, new Date());
    }
  },
  createdAt: {
    type: Date,
    default: Date.now
  }
});

// Update status and daysUntilExpiry before saving
productSchema.pre('save', function(next) {
  const today = new Date();
  const daysLeft = differenceInDays(this.expiryDate, today);
  
  this.daysUntilExpiry = daysLeft;
  
  if (isBefore(this.expiryDate, today)) {
    this.status = 'expired';
  } else if (daysLeft <= 30) {
    this.status = 'expiring_soon';
  } else {
    this.status = 'active';
  }
  
  next();
});

// Static method to find expiring products
productSchema.statics.findExpiringProducts = function(daysThreshold = 30) {
  const today = new Date();
  const thresholdDate = new Date();
  thresholdDate.setDate(today.getDate() + daysThreshold);
  
  return this.find({
    expiryDate: {
      $gte: today,
      $lte: thresholdDate
    },
    status: { $ne: 'expired' }
  });
};

// Static method to find expired products
productSchema.statics.findExpiredProducts = function() {
  return this.find({
    expiryDate: { $lt: new Date() },
    status: { $ne: 'expired' }
  });
};

module.exports = mongoose.model('Product', productSchema);