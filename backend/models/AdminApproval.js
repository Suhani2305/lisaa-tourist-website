const mongoose = require('mongoose');

const adminApprovalSchema = new mongoose.Schema({
  actionType: {
    type: String,
    required: true,
    enum: ['package_create', 'package_update', 'package_delete', 'package_publish', 
           'offer_create', 'offer_update', 'offer_delete',
           'admin_create', 'admin_update', 'admin_delete',
           'content_update', 'settings_change']
  },
  requestedBy: {
    type: mongoose.Schema.Types.ObjectId,
    ref: 'AdminUser',
    required: true
  },
  status: {
    type: String,
    enum: ['pending', 'approved', 'rejected'],
    default: 'pending'
  },
  approvedBy: {
    type: mongoose.Schema.Types.ObjectId,
    ref: 'AdminUser',
    default: null
  },
  approvedAt: {
    type: Date,
    default: null
  },
  rejectionReason: {
    type: String,
    default: null
  },
  data: {
    type: mongoose.Schema.Types.Mixed,
    required: true
  },
  // Store the original data before changes (for updates)
  originalData: {
    type: mongoose.Schema.Types.Mixed,
    default: null
  },
  // Reference to the entity being modified (if applicable)
  entityId: {
    type: mongoose.Schema.Types.ObjectId,
    default: null
  },
  entityType: {
    type: String,
    default: null
  },
  notes: {
    type: String,
    default: null
  }
}, {
  timestamps: true
});

// Index for efficient queries
adminApprovalSchema.index({ status: 1, actionType: 1 });
adminApprovalSchema.index({ requestedBy: 1 });
adminApprovalSchema.index({ approvedBy: 1 });

module.exports = mongoose.model('AdminApproval', adminApprovalSchema);

