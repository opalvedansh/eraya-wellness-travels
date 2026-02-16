import { NextResponse } from 'next/server';
import { prisma } from '@/../server/services/prisma';

export const dynamic = 'force-dynamic';

export async function GET(
    request: Request,
    { params }: { params: { slug: string } }
) {
    const slug = params.slug;

    try {
        const tour = await prisma.tour.findUnique({
            where: { slug },
        });

        if (!tour) {
            return new NextResponse("Tour not found", { status: 404 });
        }

        // Only return if active (or allow viewing inactive for admin preview but we'll stick to basic logic for now)
        if (!tour.isActive) {
            return new NextResponse("Tour not found", { status: 404 });
        }

        return NextResponse.json(tour, {
            headers: {
                'Cache-Control': 'public, max-age=60, s-maxage=60, stale-while-revalidate=600',
            },
        });
    } catch (error) {
        console.error("Failed to fetch tour", { slug, error });
        return NextResponse.json(
            { error: "Failed to fetch tour" },
            { status: 500 }
        );
    }
}
