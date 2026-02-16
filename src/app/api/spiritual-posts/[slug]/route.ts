import { NextResponse } from 'next/server';
import { prisma } from '@/../server/services/prisma';

export const dynamic = 'force-dynamic';

export async function GET(
    request: Request,
    { params }: { params: { slug: string } }
) {
    const slug = params.slug;

    try {
        const post = await prisma.spiritualPost.findUnique({
            where: { slug },
        });

        if (!post) {
            return new NextResponse("Post not found", { status: 404 });
        }

        if (!post.isPublished) {
            return new NextResponse("Post not found", { status: 404 });
        }

        return NextResponse.json(post, {
            headers: {
                'Cache-Control': 'public, max-age=300, s-maxage=300, stale-while-revalidate=600',
            },
        });
    } catch (error) {
        console.error("Failed to fetch spiritual post", { error });
        return NextResponse.json(
            { error: "Failed to fetch spiritual post" },
            { status: 500 }
        );
    }
}
