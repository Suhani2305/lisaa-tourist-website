const express = require('express');
const router = express.Router();
const AdminApproval = require('../models/AdminApproval');
const AdminUser = require('../models/AdminUser');
const { authenticateAdmin, requireSuperadmin, requireAdmin } = require('../middleware/adminAuth');
const { processApproval } = require('../services/approvalProcessor');
const { sendApprovalNotificationEmail } = require('../services/emailService');

// Get all approvals (Superadmin only) - shows all statuses, not dismissed after approval/rejection
router.get('/pending', authenticateAdmin, requireSuperadmin, async (req, res) => {
  try {
    const { status } = req.query;
    // Show all approvals by default, allow filtering by status
    // This ensures approved/rejected requests remain visible
    const query = status && status !== 'all' ? { status } : {};
    
    const approvals = await AdminApproval.find(query)
      .populate('requestedBy', 'name email role')
      .populate('approvedBy', 'name email role')
      .sort({ createdAt: -1 });

    res.json(approvals);
  } catch (error) {
    console.error('Get approvals error:', error);
    res.status(500).json({ message: 'Failed to fetch approvals' });
  }
});

// Get approvals by requesting admin (Admin can ONLY see their own requests, not other Admins' requests)
router.get('/my-requests', authenticateAdmin, requireAdmin, async (req, res) => {
  try {
    const { status } = req.query;
    // CRITICAL: Filter by requestedBy to ensure Admin can ONLY see their own requests
    // This prevents Admin from seeing other Admins' approval requests
    const query = { requestedBy: req.adminId };
    if (status && status !== 'all') {
      query.status = status;
    }
    
    // Find approvals where requestedBy matches the current admin's ID
    const approvals = await AdminApproval.find(query)
      .populate('approvedBy', 'name email role')
      .sort({ createdAt: -1 });

    res.json(approvals);
  } catch (error) {
    console.error('Get my approvals error:', error);
    res.status(500).json({ message: 'Failed to fetch approvals' });
  }
});

// Create approval request
router.post('/request', authenticateAdmin, requireAdmin, async (req, res) => {
  try {
    const { actionType, data, originalData, entityId, entityType, notes } = req.body;

    if (!actionType || !data) {
      return res.status(400).json({ message: 'Action type and data are required' });
    }

    // Superadmin actions don't need approval
    if (req.admin.role === 'Superadmin') {
      return res.status(400).json({ message: 'Superadmin actions do not require approval' });
    }

    const approval = new AdminApproval({
      actionType,
      requestedBy: req.adminId,
      data,
      originalData,
      entityId,
      entityType,
      notes
    });

    await approval.save();
    await approval.populate('requestedBy', 'name email role');

    res.status(201).json({
      message: 'Approval request created successfully',
      approval
    });
  } catch (error) {
    console.error('Create approval error:', error);
    res.status(500).json({ message: 'Failed to create approval request' });
  }
});

// Approve request (Superadmin only)
router.post('/:id/approve', authenticateAdmin, requireSuperadmin, async (req, res) => {
  try {
    const { notes } = req.body;
    const approval = await AdminApproval.findById(req.params.id);

    if (!approval) {
      return res.status(404).json({ message: 'Approval request not found' });
    }

    if (approval.status !== 'pending') {
      return res.status(400).json({ message: 'Approval request already processed' });
    }

    approval.status = 'approved';
    approval.approvedBy = req.adminId;
    approval.approvedAt = new Date();
    if (notes) approval.notes = notes;

    // Process the approval action
    try {
      const result = await processApproval(approval);
      await approval.save();
      
      // Populate requestedBy for email notification
      await approval.populate('requestedBy', 'name email role');
      
      // Send notification email to the admin who requested (asynchronously)
      if (approval.requestedBy && approval.requestedBy.email) {
        sendApprovalNotificationEmail({
          admin: approval.requestedBy,
          approval: approval.toObject(),
          action: 'approved'
        }).catch(emailError => {
          console.error('Failed to send approval notification email:', emailError);
          // Don't fail the approval if email fails
        });
      }
      
      res.json({
        message: 'Approval request approved and processed successfully',
        approval,
        result
      });
    } catch (error) {
      console.error('Error processing approval:', error);
      approval.status = 'pending'; // Revert status if processing fails
      await approval.save();
      return res.status(500).json({ 
        message: 'Failed to process approval', 
        error: error.message 
      });
    }
  } catch (error) {
    console.error('Approve error:', error);
    res.status(500).json({ message: 'Failed to approve request' });
  }
});

// Reject request (Superadmin only)
router.post('/:id/reject', authenticateAdmin, requireSuperadmin, async (req, res) => {
  try {
    const { rejectionReason } = req.body;
    const approval = await AdminApproval.findById(req.params.id);

    if (!approval) {
      return res.status(404).json({ message: 'Approval request not found' });
    }

    if (approval.status !== 'pending') {
      return res.status(400).json({ message: 'Approval request already processed' });
    }

    if (!rejectionReason) {
      return res.status(400).json({ message: 'Rejection reason is required' });
    }

    approval.status = 'rejected';
    approval.approvedBy = req.adminId;
    approval.approvedAt = new Date();
    approval.rejectionReason = rejectionReason;

    await approval.save();
    
    // Populate requestedBy for email notification
    await approval.populate('requestedBy', 'name email role');
    
    // Send notification email to the admin who requested (asynchronously)
    if (approval.requestedBy && approval.requestedBy.email) {
      sendApprovalNotificationEmail({
        admin: approval.requestedBy,
        approval: approval.toObject(),
        action: 'rejected'
      }).catch(emailError => {
        console.error('Failed to send rejection notification email:', emailError);
        // Don't fail the rejection if email fails
      });
    }

    res.json({
      message: 'Approval request rejected',
      approval
    });
  } catch (error) {
    console.error('Reject error:', error);
    res.status(500).json({ message: 'Failed to reject request' });
  }
});

// Get single approval
router.get('/:id', authenticateAdmin, requireAdmin, async (req, res) => {
  try {
    const approval = await AdminApproval.findById(req.params.id)
      .populate('requestedBy', 'name email role')
      .populate('approvedBy', 'name email role');

    if (!approval) {
      return res.status(404).json({ message: 'Approval not found' });
    }

    // Admin can only see their own requests, Superadmin can see all
    if (req.admin.role === 'Admin' && approval.requestedBy._id.toString() !== req.adminId.toString()) {
      return res.status(403).json({ message: 'Access denied' });
    }

    res.json(approval);
  } catch (error) {
    console.error('Get approval error:', error);
    res.status(500).json({ message: 'Failed to fetch approval' });
  }
});

module.exports = router;

