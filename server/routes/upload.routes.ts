import express from 'express';
import multer from 'multer';
import path from 'path';
import { v4 as uuidv4 } from 'uuid';
import { authenticate } from '../middleware/auth.middleware';

const router = express.Router();

// Configure multer storage
const storage = multer.diskStorage({
    destination: (req, file, cb) => {
        // Determine folder based on request body or default to 'general'
        const folder = req.body.type === 'trek' ? 'treks' : req.body.type === 'tour' ? 'tours' : 'general';
        const uploadPath = path.join(process.cwd(), 'public', 'uploads', folder);
        cb(null, uploadPath);
    },
    filename: (req, file, cb) => {
        // Generate unique filename: uuid-originalname
        const uniqueName = `${uuidv4()}-${file.originalname}`;
        cb(null, uniqueName);
    }
});

// File filter - only allow images
const fileFilter = (req: any, file: Express.Multer.File, cb: multer.FileFilterCallback) => {
    const allowedTypes = ['image/jpeg', 'image/jpg', 'image/png', 'image/webp'];

    if (allowedTypes.includes(file.mimetype)) {
        cb(null, true);
    } else {
        cb(new Error('Invalid file type. Only JPG, PNG, and WebP images are allowed.'));
    }
};

// Configure multer
const upload = multer({
    storage,
    fileFilter,
    limits: {
        fileSize: 5 * 1024 * 1024, // 5MB max file size
    }
});

// Middleware to check if user is admin
const checkAdmin: express.RequestHandler = (req, res, next) => {
    const adminEmails = process.env.ADMIN_EMAILS?.split(',') || [];
    if (!req.user || !adminEmails.includes(req.user.email)) {
        return res.status(403).json({ error: 'Admin access required' });
    }
    next();
};

// Upload single image
router.post('/upload', authenticate, checkAdmin, upload.single('image'), (req, res) => {
    try {
        if (!req.file) {
            return res.status(400).json({ error: 'No file uploaded' });
        }

        const folder = req.body.type === 'trek' ? 'treks' : req.body.type === 'tour' ? 'tours' : 'general';

        // Return the public URL
        const imageUrl = `/uploads/${folder}/${req.file.filename}`;

        res.json({
            success: true,
            url: imageUrl,
            filename: req.file.filename,
            size: req.file.size,
            mimetype: req.file.mimetype
        });
    } catch (error) {
        console.error('Upload error:', error);
        res.status(500).json({ error: 'Failed to upload image' });
    }
});

// Upload multiple images
router.post('/upload-multiple', authenticate, checkAdmin, upload.array('images', 10), (req, res) => {
    try {
        if (!req.files || !Array.isArray(req.files) || req.files.length === 0) {
            return res.status(400).json({ error: 'No files uploaded' });
        }

        const folder = req.body.type === 'trek' ? 'treks' : req.body.type === 'tour' ? 'tours' : 'general';

        // Return array of public URLs
        const imageUrls = req.files.map(file => ({
            url: `/uploads/${folder}/${file.filename}`,
            filename: file.filename,
            size: file.size,
            mimetype: file.mimetype
        }));

        res.json({
            success: true,
            images: imageUrls
        });
    } catch (error) {
        console.error('Upload error:', error);
        res.status(500).json({ error: 'Failed to upload images' });
    }
});

// Error handling middleware for multer
router.use((error: any, req: express.Request, res: express.Response, next: express.NextFunction) => {
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
