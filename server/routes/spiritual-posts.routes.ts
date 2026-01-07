import { Router, Request, Response } from "express";
import { prisma } from "../services/prisma";
import { authenticate } from "../middleware/auth.middleware";
import logger from "../services/logger";

const router = Router();

// Middleware to check if user is admin (reuse from admin.routes.ts pattern)
async function requireAdmin(req: Request, res: Response, next: Function) {
    try {
        const user = req.user;

        if (!user || !user.userId) {
            return res.status(401).json({ error: "Not authenticated" });
        }

        const dbUser = await prisma.user.findUnique({
            where: { id: user.userId },
            select: { isAdmin: true },
        });

        if (!dbUser || !dbUser.isAdmin) {
            return res.status(403).json({ error: "Admin access required" });
        }

        next();
    } catch (error) {
        logger.error("Admin middleware error", { error });
        res.status(500).json({ error: "Failed to verify admin status" });
    }
}

// ==================== PUBLIC ENDPOINTS ====================

// Get all published posts (with pagination and filtering)
router.get("/", async (req: Request, res: Response) => {
    try {
        const { page = "1", limit = "10", tag, featured } = req.query;
        const skip = (parseInt(page as string) - 1) * parseInt(limit as string);

        const where: any = { isPublished: true };

        if (tag) {
            where.tags = { has: tag };
        }

        if (featured === "true") {
            where.isFeatured = true;
        }

        const [posts, total] = await Promise.all([
            prisma.spiritualPost.findMany({
                where,
                orderBy: { publishDate: "desc" },
                skip,
                take: parseInt(limit as string),
            }),
            prisma.spiritualPost.count({ where }),
        ]);

        res.json({
            posts,
            pagination: {
                total,
                page: parseInt(page as string),
                limit: parseInt(limit as string),
                totalPages: Math.ceil(total / parseInt(limit as string)),
            },
        });
    } catch (error) {
        logger.error("Failed to fetch spiritual posts", { error });
        res.status(500).json({ error: "Failed to fetch spiritual posts" });
    }
});

// Get single post by slug
router.get("/:slug", async (req: Request, res: Response) => {
    try {
        const { slug } = req.params;

        const post = await prisma.spiritualPost.findUnique({
            where: { slug },
        });

        if (!post) {
            return res.status(404).json({ error: "Post not found" });
        }

        // Only return published posts for public endpoint
        if (!post.isPublished) {
            return res.status(404).json({ error: "Post not found" });
        }

        res.json(post);
    } catch (error) {
        logger.error("Failed to fetch spiritual post", { error });
        res.status(500).json({ error: "Failed to fetch spiritual post" });
    }
});

// ==================== ADMIN ENDPOINTS ====================

// Get all posts (including drafts) - Admin only
router.get("/admin/all", authenticate, requireAdmin, async (req: Request, res: Response) => {
    try {
        const posts = await prisma.spiritualPost.findMany({
            orderBy: { createdAt: "desc" },
        });

        res.json(posts);
    } catch (error) {
        logger.error("Failed to fetch spiritual posts", { error });
        res.status(500).json({ error: "Failed to fetch spiritual posts" });
    }
});

// Create new post - Admin only
router.post("/admin", authenticate, requireAdmin, async (req: Request, res: Response) => {
    try {
        const { title, excerpt, content, coverImage, category, tags, author, publishDate, isPublished, isFeatured, readTime } = req.body;

        // Generate slug from title
        const slug = title
            .toLowerCase()
            .replace(/[^a-z0-9]+/g, "-")
            .replace(/^-+|-+$/g, "");

        const post = await prisma.spiritualPost.create({
            data: {
                slug,
                title,
                excerpt,
                content,
                coverImage,
                category: category || "Spiritual Insights",
                tags: tags || [],
                author: author || "Eraya Team",
                publishDate: publishDate ? new Date(publishDate) : new Date(),
                isPublished: isPublished || false,
                isFeatured: isFeatured || false,
                readTime,
            },
        });

        logger.info("Spiritual post created", { postId: post.id, userId: req.user?.userId });
        res.status(201).json(post);
    } catch (error) {
        logger.error("Failed to create spiritual post", { error });

        if (error.code === "P2002") {
            return res.status(400).json({ error: "A post with this slug already exists" });
        }

        res.status(500).json({ error: "Failed to create spiritual post" });
    }
});

// Update post - Admin only
router.put("/admin/:id", authenticate, requireAdmin, async (req: Request, res: Response) => {
    try {
        const { id } = req.params;
        const { title, slug, excerpt, content, coverImage, category, tags, author, publishDate, isPublished, isFeatured, readTime } = req.body;

        const data: any = {};

        if (title !== undefined) data.title = title;
        if (slug !== undefined) data.slug = slug;
        if (excerpt !== undefined) data.excerpt = excerpt;
        if (content !== undefined) data.content = content;
        if (coverImage !== undefined) data.coverImage = coverImage;
        if (category !== undefined) data.category = category;
        if (tags !== undefined) data.tags = tags;
        if (author !== undefined) data.author = author;
        if (publishDate !== undefined) data.publishDate = new Date(publishDate);
        if (isPublished !== undefined) data.isPublished = isPublished;
        if (isFeatured !== undefined) data.isFeatured = isFeatured;
        if (readTime !== undefined) data.readTime = readTime;

        const post = await prisma.spiritualPost.update({
            where: { id },
            data,
        });

        logger.info("Spiritual post updated", { postId: post.id, userId: req.user?.userId });
        res.json(post);
    } catch (error) {
        logger.error("Failed to update spiritual post", { error });

        if (error.code === "P2002") {
            return res.status(400).json({ error: "A post with this slug already exists" });
        }

        res.status(500).json({ error: "Failed to update spiritual post" });
    }
});

// Delete post - Admin only
router.delete("/admin/:id", authenticate, requireAdmin, async (req: Request, res: Response) => {
    try {
        const { id } = req.params;

        await prisma.spiritualPost.delete({
            where: { id },
        });

        logger.info("Spiritual post deleted", { postId: id, userId: req.user?.userId });
        res.json({ message: "Spiritual post deleted successfully" });
    } catch (error) {
        logger.error("Failed to delete spiritual post", { error });
        res.status(500).json({ error: "Failed to delete spiritual post" });
    }
});

// Toggle publish status - Admin only
router.patch("/admin/:id/publish", authenticate, requireAdmin, async (req: Request, res: Response) => {
    try {
        const { id } = req.params;

        const post = await prisma.spiritualPost.findUnique({
            where: { id },
        });

        if (!post) {
            return res.status(404).json({ error: "Post not found" });
        }

        const updatedPost = await prisma.spiritualPost.update({
            where: { id },
            data: { isPublished: !post.isPublished },
        });

        logger.info("Spiritual post publish status toggled", {
            postId: id,
            isPublished: updatedPost.isPublished,
            userId: req.user?.userId
        });

        res.json(updatedPost);
    } catch (error) {
        logger.error("Failed to toggle publish status", { error });
        res.status(500).json({ error: "Failed to toggle publish status" });
    }
});

export default router;
