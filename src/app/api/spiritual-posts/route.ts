import { NextResponse } from 'next/server';
import { prisma } from '@/../server/services/prisma';

export const dynamic = 'force-dynamic';

export async function GET(request: Request) {
    try {
        const { searchParams } = new URL(request.url);
        const page = searchParams.get('page') || "1";
        const limit = searchParams.get('limit') || "10";
        const tag = searchParams.get('tag');
        const featured = searchParams.get('featured');

        const skip = (parseInt(page) - 1) * parseInt(limit);

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
                take: parseInt(limit),
                select: {
                    id: true,
                    title: true,
                    slug: true,
                    excerpt: true,
                    coverImage: true,
                    category: true,
                    tags: true,
                    author: true,
                    publishDate: true,
                    readTime: true,
                    isFeatured: true,
                    // content: false
                }
            }),
            prisma.spiritualPost.count({ where }),
        ]);

        return NextResponse.json({
            posts,
            pagination: {
                total,
                page: parseInt(page),
                limit: parseInt(limit),
                totalPages: Math.ceil(total / parseInt(limit)),
            },
        }, {
            headers: {
                'Cache-Control': 'public, max-age=300, s-maxage=300, stale-while-revalidate=600',
            },
        });
    } catch (error) {
        console.error("Failed to fetch spiritual posts", error);
        return NextResponse.json(
            { error: "Failed to fetch spiritual posts" },
            { status: 500 }
        );
    }
}
