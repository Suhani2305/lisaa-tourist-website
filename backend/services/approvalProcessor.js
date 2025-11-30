const Tour = require('../models/Tour');
const AdminApproval = require('../models/AdminApproval');

const processApproval = async (approval) => {
  try {
    const { actionType, data, originalData, entityId } = approval;

    switch (actionType) {
      case 'package_create':
        // Create the tour - ensure it's active so it shows on website
        const tourData = { ...data };
        if (tourData.isActive === undefined) {
          tourData.isActive = true; // Make it visible on website
        }
        const newTour = new Tour(tourData);
        await newTour.save();
        console.log('✅ Package created after approval:', newTour._id);
        return { success: true, message: 'Package created successfully', tour: newTour };

      case 'package_update':
        // Update the tour - ensure it remains active
        const updateData = { ...data };
        if (updateData.isActive === undefined) {
          // Keep existing isActive status if not specified
          const existingTour = await Tour.findById(entityId);
          if (existingTour) {
            updateData.isActive = existingTour.isActive !== false; // Default to true
          }
        }
        const updatedTour = await Tour.findByIdAndUpdate(
          entityId,
          updateData,
          { new: true, runValidators: true }
        );
        if (!updatedTour) {
          throw new Error('Tour not found');
        }
        console.log('✅ Package updated after approval:', updatedTour._id);
        return { success: true, message: 'Package updated successfully', tour: updatedTour };

      case 'package_delete':
        // Delete (deactivate) the tour
        const deletedTour = await Tour.findByIdAndUpdate(
          entityId,
          { isActive: false },
          { new: true }
        );
        if (!deletedTour) {
          throw new Error('Tour not found');
        }
        return { success: true, message: 'Package deleted successfully', tour: deletedTour };

      case 'package_publish':
        // Publish the tour
        const publishedTour = await Tour.findByIdAndUpdate(
          entityId,
          { isActive: true },
          { new: true }
        );
        if (!publishedTour) {
          throw new Error('Tour not found');
        }
        return { success: true, message: 'Package published successfully', tour: publishedTour };

      default:
        throw new Error(`Unknown action type: ${actionType}`);
    }
  } catch (error) {
    console.error('Error processing approval:', error);
    throw error;
  }
};

module.exports = {
  processApproval
};

