import { NextResponse } from 'next/server';
import { prisma } from '@/../server/services/prisma';

export const dynamic = 'force-dynamic';

export async function GET(request: Request) {
    try {
        const { searchParams } = new URL(request.url);
        const featured = searchParams.get('featured');

        const where: any = {
            isApproved: true
        };

        if (featured === 'true') {
            where.isFeatured = true;
        }

        const testimonials = await prisma.testimonial.findMany({
            where,
            orderBy: [
                { isFeatured: 'desc' },
                { createdAt: 'desc' }
            ],
            select: {
                id: true,
                name: true,
                location: true,
                experience: true,
                rating: true,
                review: true,
                avatar: true,
                createdAt: true
            }
        });

        return NextResponse.json(testimonials, {
            headers: {
                'Cache-Control': 'public, max-age=300, s-maxage=300, stale-while-revalidate=600',
            },
        });
    } catch (error) {
        console.error("Failed to fetch testimonials", error);
        return NextResponse.json(
            { error: "Failed to fetch testimonials" },
            { status: 500 }
        );
    }
}
