const express = require('express');
const router = express.Router();
const Media = require('../models/Media');
const { upload, uploadToCloudinary } = require('../middleware/upload');
const cloudinary = require('../config/cloudinary');

// Helper function to normalize category values to valid enum values
const normalizeCategory = (category) => {
  if (!category) return 'Other';
  
  const validCategories = ['Destinations', 'Tours', 'Events', 'Testimonials', 'Marketing', 'Other'];
  
  // Check if it's already a valid category
  if (validCategories.includes(category)) {
    return category;
  }
  
  // Normalize subcategories to parent categories
  const categoryLower = category.toLowerCase();
  
  if (categoryLower.startsWith('destination')) {
    return 'Destinations';
  }
  if (categoryLower.startsWith('tour')) {
    return 'Tours';
  }
  if (categoryLower.startsWith('event')) {
    return 'Events';
  }
  if (categoryLower.startsWith('testimonial')) {
    return 'Testimonials';
  }
  if (categoryLower.startsWith('market')) {
    return 'Marketing';
  }
  
  // Default to 'Other' if no match found
  return 'Other';
};

// Get all media files
router.get('/', async (req, res) => {
  try {
    const { type, category, search, isActive } = req.query;
    let query = {};
    
    if (type && type !== 'all') {
      query.type = type;
    }
    
    if (category && category !== 'all') {
      query.category = category;
    }
    
    if (isActive !== undefined) {
      query.isActive = isActive === 'true';
    }
    
    if (search) {
      query.$or = [
        { name: { $regex: search, $options: 'i' } },
        { title: { $regex: search, $options: 'i' } },
        { description: { $regex: search, $options: 'i' } },
        { tags: { $in: [new RegExp(search, 'i')] } }
      ];
    }
    
    const mediaFiles = await Media.find(query).sort({ createdAt: -1 });
    
    res.json(mediaFiles);
  } catch (error) {
    console.error('Get media files error:', error);
    res.status(500).json({ message: 'Server error' });
  }
});

// Get media by ID
router.get('/:id', async (req, res) => {
  try {
    const media = await Media.findById(req.params.id);
    
    if (!media) {
      return res.status(404).json({ message: 'Media file not found' });
    }
    
    // Increment views
    media.views += 1;
    await media.save();
    
    res.json(media);
  } catch (error) {
    console.error('Get media error:', error);
    res.status(500).json({ message: 'Server error' });
  }
});

// Upload single file
router.post('/upload', upload.single('file'), uploadToCloudinary, async (req, res) => {
  try {
    if (!req.file || !req.file.cloudinary) {
      return res.status(400).json({ message: 'No file uploaded or upload failed' });
    }

    const cloudinaryResult = req.file.cloudinary;

    // Determine media type from file
    const fileType = req.file.mimetype?.split('/')[0] || 'document';
    const typeMap = {
      'image': 'image',
      'video': 'video',
      'audio': 'audio',
      'application': 'document'
    };
    const mediaType = typeMap[fileType] || 'document';

    // Get file extension
    const fileName = req.file.originalname || 'untitled';
    const fileExtension = fileName.split('.').pop()?.toUpperCase() || '';

    // Create media data
    const mediaData = {
      name: fileName,
      title: req.body.title || fileName.split('.')[0].replace(/[-_]/g, ' '),
      type: mediaType,
      category: normalizeCategory(req.body.category),
      format: fileExtension,
      url: cloudinaryResult.secure_url, // Cloudinary URL
      thumbnail: mediaType === 'image' ? cloudinaryResult.secure_url : (req.body.thumbnail || ''),
      size: cloudinaryResult.bytes || req.file.size || 0,
      dimensions: req.body.dimensions || (cloudinaryResult.width && cloudinaryResult.height ? `${cloudinaryResult.width}x${cloudinaryResult.height}` : ''),
      mimeType: req.file.mimetype || '',
      alt: req.body.alt || fileName,
      description: req.body.description || `Uploaded ${mediaType}`,
      tags: req.body.tags ? (Array.isArray(req.body.tags) ? req.body.tags : req.body.tags.split(',')) : [],
      uploadedBy: req.body.uploadedBy || 'Admin',
      isActive: req.body.isActive !== undefined ? req.body.isActive : true
    };

    const media = new Media(mediaData);
    await media.save();

    res.status(201).json({ 
      message: 'Media file uploaded successfully', 
      media,
      cloudinaryId: cloudinaryResult.public_id
    });
  } catch (error) {
    console.error('Upload media error:', error);
    res.status(500).json({ message: 'Server error', error: error.message });
  }
});

// Upload multiple files
router.post('/upload-multiple', upload.array('files', 10), uploadToCloudinary, async (req, res) => {
  try {
    if (!req.files || req.files.length === 0) {
      return res.status(400).json({ message: 'No files uploaded' });
    }

    const uploadedMedia = [];

    for (const file of req.files) {
      if (!file.cloudinary) {
        console.error('Cloudinary upload failed for file:', file.originalname);
        continue;
      }

      const cloudinaryResult = file.cloudinary;

      // Determine media type from file
      const fileType = file.mimetype?.split('/')[0] || 'document';
      const typeMap = {
        'image': 'image',
        'video': 'video',
        'audio': 'audio',
        'application': 'document'
      };
      const mediaType = typeMap[fileType] || 'document';

      // Get file extension
      const fileName = file.originalname || 'untitled';
      const fileExtension = fileName.split('.').pop()?.toUpperCase() || '';

      // Create media data
      const mediaData = {
        name: fileName,
        title: fileName.split('.')[0].replace(/[-_]/g, ' '),
        type: mediaType,
        category: normalizeCategory(req.body.category),
        format: fileExtension,
        url: cloudinaryResult.secure_url, // Cloudinary URL
        thumbnail: mediaType === 'image' ? cloudinaryResult.secure_url : '',
        size: cloudinaryResult.bytes || file.size || 0,
        dimensions: cloudinaryResult.width && cloudinaryResult.height ? `${cloudinaryResult.width}x${cloudinaryResult.height}` : '',
        mimeType: file.mimetype || '',
        alt: fileName,
        description: `Uploaded ${mediaType}`,
        tags: [],
        uploadedBy: 'Admin',
        isActive: true
      };

      const media = new Media(mediaData);
      await media.save();
      uploadedMedia.push(media);
    }

    if (uploadedMedia.length === 0) {
      return res.status(500).json({ message: 'Failed to upload files' });
    }

    res.status(201).json({ 
      message: `${uploadedMedia.length} file(s) uploaded successfully`, 
      media: uploadedMedia
    });
  } catch (error) {
    console.error('Upload multiple media error:', error);
    res.status(500).json({ message: 'Server error', error: error.message });
  }
});

// Create media file (for backward compatibility - accepts URL or base64)
router.post('/', async (req, res) => {
  try {
    const mediaData = { ...req.body };
    
    // Normalize category if provided
    if (mediaData.category) {
      mediaData.category = normalizeCategory(mediaData.category);
    }
    
    // If base64 is provided, upload to Cloudinary first
    if (mediaData.url && mediaData.url.startsWith('data:')) {
      try {
        // Upload base64 to Cloudinary
        const result = await cloudinary.uploader.upload(mediaData.url, {
          folder: 'lisaa-tourist-website',
          resource_type: 'auto'
        });
        
        mediaData.url = result.secure_url;
        if (mediaData.type === 'image') {
          mediaData.thumbnail = result.secure_url;
        }
      } catch (uploadError) {
        console.error('Cloudinary upload error:', uploadError);
        // Continue with base64 if Cloudinary fails
      }
    }
    
    const media = new Media(mediaData);
    await media.save();
    
    res.status(201).json({ message: 'Media file created successfully', media });
  } catch (error) {
    console.error('Create media error:', error);
    res.status(500).json({ message: 'Server error' });
  }
});

// Update media file
router.put('/:id', async (req, res) => {
  try {
    const updateData = {
      ...req.body,
      lastModified: new Date()
    };
    
    // Normalize category if being updated
    if (updateData.category) {
      updateData.category = normalizeCategory(updateData.category);
    }
    
    const media = await Media.findByIdAndUpdate(
      req.params.id,
      updateData,
      { new: true, runValidators: true }
    );
    
    if (!media) {
      return res.status(404).json({ message: 'Media file not found' });
    }
    
    res.json({ message: 'Media file updated successfully', media });
  } catch (error) {
    console.error('Update media error:', error);
    res.status(500).json({ message: 'Server error' });
  }
});

// Delete media file (also delete from Cloudinary)
router.delete('/:id', async (req, res) => {
  try {
    const media = await Media.findById(req.params.id);
    
    if (!media) {
      return res.status(404).json({ message: 'Media file not found' });
    }

    // Delete from Cloudinary if URL is from Cloudinary
    if (media.url && media.url.includes('cloudinary.com')) {
      try {
        // Map media type to Cloudinary resource type
        const getResourceType = (mediaType) => {
          switch (mediaType) {
            case 'image':
              return 'image';
            case 'video':
              return 'video';
            case 'audio':
              return 'video'; // Audio files are stored as video type in Cloudinary
            case 'document':
            default:
              return 'raw'; // Documents and other files are stored as raw
          }
        };

        // Extract public_id from URL
        // Cloudinary URLs format: https://res.cloudinary.com/{cloud_name}/{resource_type}/upload/v{version}/{folder}/{public_id}.{format}
        // or: https://res.cloudinary.com/{cloud_name}/{resource_type}/upload/{folder}/{public_id}.{format}
        let publicId;
        
        // Find the /upload/ part in the URL
        const uploadIndex = media.url.indexOf('/upload/');
        if (uploadIndex !== -1) {
          // Get everything after /upload/
          let pathAfterUpload = media.url.substring(uploadIndex + 8); // +8 for '/upload/'
          
          // Remove version number if present (format: v1234567890/)
          pathAfterUpload = pathAfterUpload.replace(/^v\d+\//, '');
          
          // Remove query parameters if present (everything after ?)
          if (pathAfterUpload.includes('?')) {
            pathAfterUpload = pathAfterUpload.split('?')[0];
          }
          
          // Remove file extension (everything after last dot)
          const lastDotIndex = pathAfterUpload.lastIndexOf('.');
          if (lastDotIndex !== -1) {
            publicId = pathAfterUpload.substring(0, lastDotIndex);
          } else {
            publicId = pathAfterUpload;
          }
          
          // If public_id doesn't include folder, prepend default folder
          if (!publicId.includes('/')) {
            publicId = `lisaa-tourist-website/${publicId}`;
          }
        } else {
          // Fallback: extract filename from URL
          const urlParts = media.url.split('/');
          const fileName = urlParts[urlParts.length - 1].split('.')[0];
          publicId = `lisaa-tourist-website/${fileName}`;
        }
        
        const resourceType = getResourceType(media.type);
        
        await cloudinary.uploader.destroy(publicId, {
          resource_type: resourceType
        });
      } catch (cloudinaryError) {
        console.error('Cloudinary delete error:', cloudinaryError);
        // Continue with database delete even if Cloudinary delete fails
      }
    }
    
    await Media.findByIdAndDelete(req.params.id);
    
    res.json({ message: 'Media file deleted successfully' });
  } catch (error) {
    console.error('Delete media error:', error);
    res.status(500).json({ message: 'Server error' });
  }
});

// Increment downloads
router.post('/:id/download', async (req, res) => {
  try {
    const media = await Media.findById(req.params.id);
    
    if (!media) {
      return res.status(404).json({ message: 'Media file not found' });
    }
    
    media.downloads += 1;
    await media.save();
    
    res.json({ message: 'Download count updated', downloads: media.downloads });
  } catch (error) {
    console.error('Update download count error:', error);
    res.status(500).json({ message: 'Server error' });
  }
});

// Increment likes
router.post('/:id/like', async (req, res) => {
  try {
    const media = await Media.findById(req.params.id);
    
    if (!media) {
      return res.status(404).json({ message: 'Media file not found' });
    }
    
    media.likes += 1;
    await media.save();
    
    res.json({ message: 'Like count updated', likes: media.likes });
  } catch (error) {
    console.error('Update like count error:', error);
    res.status(500).json({ message: 'Server error' });
  }
});

module.exports = router;

