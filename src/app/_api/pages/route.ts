import { NextRequest, NextResponse } from 'next/server';
import { prisma } from '@/lib/prisma';

// Force dynamic rendering for this API route
export const dynamic = 'force-dynamic'

export async function GET(request: NextRequest) {
  try {
    const { searchParams } = new URL(request.url);
    const type = searchParams.get('type');
    const language = searchParams.get('language') || 'ar';
    const status = searchParams.get('status') || 'published';
    const slug = searchParams.get('slug');

    const where: any = {
      status,
      language,
    };

    if (type) {
      where.type = type;
    }

    if (slug) {
      where.slug = slug;
    }

    const pages = await prisma.page.findMany({
      where,
      select: {
        id: true,
        title: true,
        slug: true,
        content: true,
        metaTitle: true,
        metaDescription: true,
        type: true,
        status: true,
        language: true,
        createdAt: true,
        updatedAt: true,
        publishedAt: true,
        author: {
          select: {
            username: true,
            name: true,
          },
        },
      },
      orderBy: {
        publishedAt: 'desc',
      },
    });

    // If looking for a specific slug, return single page
    if (slug && pages.length > 0) {
      return NextResponse.json({ page: pages[0] });
    }

    return NextResponse.json({ pages });
  } catch (error) {
    console.error('Pages API error:', error);
    return NextResponse.json({ error: 'Internal server error' }, { status: 500 });
  }
} 