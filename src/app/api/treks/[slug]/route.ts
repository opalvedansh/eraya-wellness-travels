import { NextResponse } from 'next/server';
import { prisma } from '@/../server/services/prisma';

export const dynamic = 'force-dynamic';

export async function GET(
    request: Request,
    { params }: { params: { slug: string } }
) {
    const slug = params.slug;

    try {
        const trek = await prisma.trek.findUnique({
            where: { slug },
        });

        if (!trek) {
            return new NextResponse("Trek not found", { status: 404 });
        }

        if (!trek.isActive) {
            return new NextResponse("Trek not found", { status: 404 });
        }

        return NextResponse.json(trek, {
            headers: {
                'Cache-Control': 'public, max-age=60, s-maxage=60, stale-while-revalidate=600',
            },
        });
    } catch (error) {
        console.error("Failed to fetch trek", { slug, error });
        return NextResponse.json(
            { error: "Failed to fetch trek" },
            { status: 500 }
        );
    }
}
