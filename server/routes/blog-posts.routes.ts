import { Router, Request, Response } from "express";
import { prisma } from "../services/prisma";
import { authenticate } from "../middleware/auth.middleware";
import logger from "../services/logger";

const router = Router();

// Middleware to check if user is admin
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
        const { page = "1", limit = "10", category, featured } = req.query;
        const skip = (parseInt(page as string) - 1) * parseInt(limit as string);

        const where: any = { isPublished: true };

        if (category) {
            where.category = category;
        }

        if (featured === "true") {
            where.featured = true;
        }

        const [posts, total] = await Promise.all([
            prisma.blogPost.findMany({
                where,
                orderBy: { publishDate: "desc" },
                skip,
                take: parseInt(limit as string),
            }),
            prisma.blogPost.count({ where }),
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
        logger.error("Failed to fetch blog posts", { error });
        res.status(500).json({ error: "Failed to fetch blog posts" });
    }
});

// Get featured posts
router.get("/featured", async (req: Request, res: Response) => {
    try {
        const posts = await prisma.blogPost.findMany({
            where: { isPublished: true, featured: true },
            orderBy: { publishDate: "desc" },
            take: 3,
        });

        res.json(posts);
    } catch (error) {
        logger.error("Failed to fetch featured posts", { error });
        res.status(500).json({ error: "Failed to fetch featured posts" });
    }
});

// Get posts by category
router.get("/category/:category", async (req: Request, res: Response) => {
    try {
        const { category } = req.params;
        const posts = await prisma.blogPost.findMany({
            where: { isPublished: true, category },
            orderBy: { publishDate: "desc" },
        });

        res.json(posts);
    } catch (error) {
        logger.error("Failed to fetch posts by category", { error });
        res.status(500).json({ error: "Failed to fetch posts by category" });
    }
});

// Get single post by slug
router.get("/:slug", async (req: Request, res: Response) => {
    try {
        const { slug } = req.params;

        const post = await prisma.blogPost.findUnique({
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
        logger.error("Failed to fetch blog post", { error });
        res.status(500).json({ error: "Failed to fetch blog post" });
    }
});

// ==================== ADMIN ENDPOINTS ====================

// Get all posts (including drafts) - Admin only
router.get("/admin/all", authenticate, requireAdmin, async (req: Request, res: Response) => {
    try {
        const posts = await prisma.blogPost.findMany({
            orderBy: { createdAt: "desc" },
        });

        res.json(posts);
    } catch (error) {
        logger.error("Failed to fetch blog posts", { error });
        res.status(500).json({ error: "Failed to fetch blog posts" });
    }
});

// Create new post - Admin only
router.post("/admin", authenticate, requireAdmin, async (req: Request, res: Response) => {
    try {
        const {
            title, excerpt, content, featuredImage, category, tags,
            authorName, authorAvatar, authorBio, publishDate, readTime,
            featured, isPublished
        } = req.body;

        // Generate slug from title
        const slug = title
            .toLowerCase()
            .replace(/[^a-z0-9]+/g, "-")
            .replace(/^-+|-+$/g, "");

        const post = await prisma.blogPost.create({
            data: {
                slug,
                title,
                excerpt,
                content,
                featuredImage,
                category: category || "Travel Tips",
                tags: tags || [],
                authorName: authorName || "Eraya Team",
                authorAvatar,
                authorBio,
                publishDate: publishDate ? new Date(publishDate) : new Date(),
                readTime,
                featured: featured || false,
                isPublished: isPublished || false,
            },
        });

        logger.info("Blog post created", { postId: post.id, userId: req.user?.userId });
        res.status(201).json(post);
    } catch (error) {
        logger.error("Failed to create blog post", { error });

        if (error.code === "P2002") {
            return res.status(400).json({ error: "A post with this slug already exists" });
        }

        res.status(500).json({ error: "Failed to create blog post" });
    }
});

// Update post - Admin only
router.put("/admin/:id", authenticate, requireAdmin, async (req: Request, res: Response) => {
    try {
        const { id } = req.params;
        const {
            title, slug, excerpt, content, featuredImage, category, tags,
            authorName, authorAvatar, authorBio, publishDate, readTime,
            featured, isPublished
        } = req.body;

        const data: any = {};

        if (title !== undefined) data.title = title;
        if (slug !== undefined) data.slug = slug;
        if (excerpt !== undefined) data.excerpt = excerpt;
        if (content !== undefined) data.content = content;
        if (featuredImage !== undefined) data.featuredImage = featuredImage;
        if (category !== undefined) data.category = category;
        if (tags !== undefined) data.tags = tags;
        if (authorName !== undefined) data.authorName = authorName;
        if (authorAvatar !== undefined) data.authorAvatar = authorAvatar;
        if (authorBio !== undefined) data.authorBio = authorBio;
        if (publishDate !== undefined) data.publishDate = new Date(publishDate);
        if (readTime !== undefined) data.readTime = readTime;
        if (featured !== undefined) data.featured = featured;
        if (isPublished !== undefined) data.isPublished = isPublished;

        const post = await prisma.blogPost.update({
            where: { id },
            data,
        });

        logger.info("Blog post updated", { postId: post.id, userId: req.user?.userId });
        res.json(post);
    } catch (error) {
        logger.error("Failed to update blog post", { error });

        if (error.code === "P2002") {
            return res.status(400).json({ error: "A post with this slug already exists" });
        }

        res.status(500).json({ error: "Failed to update blog post" });
    }
});

// Delete post - Admin only
router.delete("/admin/:id", authenticate, requireAdmin, async (req: Request, res: Response) => {
    try {
        const { id } = req.params;

        await prisma.blogPost.delete({
            where: { id },
        });

        logger.info("Blog post deleted", { postId: id, userId: req.user?.userId });
        res.json({ message: "Blog post deleted successfully" });
    } catch (error) {
        logger.error("Failed to delete blog post", { error });
        res.status(500).json({ error: "Failed to delete blog post" });
    }
});

// Toggle publish status - Admin only
router.patch("/admin/:id/publish", authenticate, requireAdmin, async (req: Request, res: Response) => {
    try {
        const { id } = req.params;

        const post = await prisma.blogPost.findUnique({
            where: { id },
        });

        if (!post) {
            return res.status(404).json({ error: "Post not found" });
        }

        const updatedPost = await prisma.blogPost.update({
            where: { id },
            data: { isPublished: !post.isPublished },
        });

        logger.info("Blog post publish status toggled", {
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

// Toggle featured status - Admin only
router.patch("/admin/:id/feature", authenticate, requireAdmin, async (req: Request, res: Response) => {
    try {
        const { id } = req.params;

        const post = await prisma.blogPost.findUnique({
            where: { id },
        });

        if (!post) {
            return res.status(404).json({ error: "Post not found" });
        }

        const updatedPost = await prisma.blogPost.update({
            where: { id },
            data: { featured: !post.featured },
        });

        logger.info("Blog post featured status toggled", {
            postId: id,
            featured: updatedPost.featured,
            userId: req.user?.userId
        });

        res.json(updatedPost);
    } catch (error) {
        logger.error("Failed to toggle featured status", { error });
        res.status(500).json({ error: "Failed to toggle featured status" });
    }
});

export default router;
