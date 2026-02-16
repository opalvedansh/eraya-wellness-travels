import { NextResponse } from 'next/server';
import { prisma } from '@/../server/services/prisma';

export const dynamic = 'force-dynamic';

export async function GET(
    request: Request,
    { params }: { params: { key: string } }
) {
    const key = params.key;

    try {
        const setting = await prisma.siteSettings.findUnique({
            where: { key },
        });

        if (!setting) {
            // Return null JSON to match Express behavior
            return NextResponse.json(null);
        }

        const content = JSON.parse(setting.value);

        return NextResponse.json(content, {
            headers: {
                'Cache-Control': 'public, max-age=300, s-maxage=300, stale-while-revalidate=600',
            },
        });
    } catch (error) {
        console.error("Failed to fetch content setting", { key, error });
        return NextResponse.json(
            { error: "Failed to fetch content" },
            { status: 500 }
        );
    }
}
