import { NextResponse } from 'next/server';
import { prisma } from '@/../server/services/prisma';

export const dynamic = 'force-dynamic';

export async function GET() {
    try {
        const tours = await prisma.tour.findMany({
            where: { isActive: true },
            select: {
                id: true,
                name: true,
                slug: true,
                location: true,
                price: true,
                duration: true,
                difficulty: true,
                rating: true,
                coverImage: true,
                images: true, // Needed for fallback if coverImage is missing
                latitude: true,
                longitude: true,
                tags: true,
                isFeatured: true,
                createdAt: true, // Used for sorting if needed
                maxGroupSize: true, // displayed in card
            },
            orderBy: [
                { isFeatured: "desc" },
                { createdAt: "desc" }
            ],
        });

        return NextResponse.json(tours, {
            headers: {
                'Cache-Control': 'public, max-age=300, s-maxage=300, stale-while-revalidate=600',
            },
        });
    } catch (error) {
        console.error("Failed to fetch tours", error);
        return NextResponse.json(
            { error: "Failed to fetch tours" },
            { status: 500 }
        );
    }
}
