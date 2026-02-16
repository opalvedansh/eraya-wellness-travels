import { NextResponse } from 'next/server';
import { prisma } from '@/../server/services/prisma';

export const dynamic = 'force-dynamic';

export async function GET() {
    try {
        const treks = await prisma.trek.findMany({
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
                images: true,
                latitude: true,
                longitude: true,
                tags: true,
                isFeatured: true,
                createdAt: true,
                maxGroupSize: true,
            },
            orderBy: [
                { isFeatured: "desc" },
                { createdAt: "desc" }
            ],
        });

        return NextResponse.json(treks, {
            headers: {
                'Cache-Control': 'public, max-age=300, s-maxage=300, stale-while-revalidate=600',
            },
        });
    } catch (error) {
        console.error("Failed to fetch treks", error);
        return NextResponse.json(
            { error: "Failed to fetch treks" },
            { status: 500 }
        );
    }
}
