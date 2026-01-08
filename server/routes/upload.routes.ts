import { Router, Request, Response } from 'express';
import multer from 'multer';
import { v4 as uuidv4 } from 'uuid';
import { authenticate } from '../middleware/auth.middleware';
import logger from '../services/logger';
import { supabaseAdmin, STORAGE_BUCKET } from '../lib/supabase';

const router = Router();

// Use memory storage for multer (files stay in memory, not saved to disk)
const upload = multer({
    storage: multer.memoryStorage(),
    limits: {
        fileSize: 5 * 1024 * 1024, // 5MB max
    },
    fileFilter: (req, file, cb) => {
        const allowedTypes = ['image/jpeg', 'image/jpg', 'image/png', 'image/webp'];
        if (allowedTypes.includes(file.mimetype)) {
            cb(null, true);
        } else {
            cb(new Error('Invalid file type. Only JPG, PNG, and WebP images are allowed.'));
        }
    },
});

// Middleware to check if user is admin
const checkAdmin = (req: Request, res: Response, next: Function) => {
    const adminEmails = process.env.ADMIN_EMAILS?.split(',').map(e => e.trim()) || [];
    if (!req.user || !adminEmails.includes(req.user.email)) {
        return res.status(403).json({ error: 'Admin access required' });
    }
    next();
};

// Upload single image to Supabase Storage
router.post('/upload', authenticate, checkAdmin, upload.single('image'), async (req: Request, res: Response) => {
    try {
        if (!req.file) {
            return res.status(400).json({ error: 'No file uploaded' });
        }

        const folder = req.body.type === 'trek'
            ? 'treks'
            : req.body.type === 'tour'
                ? 'tours'
                : req.body.type === 'about'
                    ? `about/${req.body.subType || 'general'}` // team, partners, or general
                    : 'general';

        // Generate unique filename
        const fileExt = req.file.originalname.split('.').pop();
        const fileName = `${folder}/${uuidv4()}.${fileExt}`;

        // Upload to Supabase Storage
        const { data, error } = await supabaseAdmin.storage
            .from(STORAGE_BUCKET)
            .upload(fileName, req.file.buffer, {
                contentType: req.file.mimetype,
                upsert: false,
            });

        if (error) {
            logger.error('Supabase upload error:', error);
            return res.status(500).json({ error: 'Failed to upload to storage' });
        }

        // Get public URL
        const { data: urlData } = supabaseAdmin.storage
            .from(STORAGE_BUCKET)
            .getPublicUrl(fileName);

        res.json({
            success: true,
            url: urlData.publicUrl,
            filename: fileName,
            size: req.file.size,
            mimetype: req.file.mimetype,
        });

        logger.info('Image uploaded to Supabase Storage', {
            fileName,
            size: req.file.size,
            userId: req.user?.userId
        });
    } catch (error: any) {
        logger.error('Upload error:', error);
        res.status(500).json({ error: 'Failed to upload image' });
    }
});

// Upload multiple images to Supabase Storage
router.post('/upload-multiple', authenticate, checkAdmin, upload.array('images', 10), async (req: Request, res: Response) => {
    try {
        if (!req.files || !Array.isArray(req.files) || req.files.length === 0) {
            return res.status(400).json({ error: 'No files uploaded' });
        }

        const folder = req.body.type === 'trek'
            ? 'treks'
            : req.body.type === 'tour'
                ? 'tours'
                : req.body.type === 'about'
                    ? `about/${req.body.subType || 'general'}`
                    : 'general';
        const uploadedImages = [];

        // Upload each file to Supabase
        for (const file of req.files) {
            const fileExt = file.originalname.split('.').pop();
            const fileName = `${folder}/${uuidv4()}.${fileExt}`;

            const { data, error } = await supabaseAdmin.storage
                .from(STORAGE_BUCKET)
                .upload(fileName, file.buffer, {
                    contentType: file.mimetype,
                    upsert: false,
                });

            if (error) {
                logger.error('Supabase upload error:', error);
                continue; // Skip failed uploads
            }

            // Get public URL
            const { data: urlData } = supabaseAdmin.storage
                .from(STORAGE_BUCKET)
                .getPublicUrl(fileName);

            uploadedImages.push({
                url: urlData.publicUrl,
                filename: fileName,
                size: file.size,
                mimetype: file.mimetype,
            });
        }

        res.json({
            success: true,
            images: uploadedImages,
        });

        logger.info('Multiple images uploaded to Supabase Storage', {
            count: uploadedImages.length,
            userId: req.user?.userId
        });
    } catch (error: any) {
        logger.error('Upload error:', error);
        res.status(500).json({ error: 'Failed to upload images' });
    }
});

// Error handling middleware for multer
router.use((error: any, req: Request, res: Response, next: Function) => {
    if (error instanceof multer.MulterError) {
        if (error.code === 'LIMIT_FILE_SIZE') {
            return res.status(400).json({ error: 'File size too large. Maximum size is 5MB.' });
        }
        return res.status(400).json({ error: error.message });
    }

    if (error.message.includes('Invalid file type')) {
        return res.status(400).json({ error: error.message });
    }

    next(error);
});

export default router;
