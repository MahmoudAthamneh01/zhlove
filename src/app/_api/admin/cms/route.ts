import { NextRequest, NextResponse } from 'next/server';
import { getServerSession } from 'next-auth';
import { authOptions } from '@/lib/auth';
import { prisma } from '@/lib/prisma';

interface PageWithAuthor {
  id: string;
  title: string;
  slug: string;
  content: string | null;
  metaTitle: string | null;
  metaDescription: string | null;
  type: string;
  status: string;
  language: string;
  authorId: string;
  createdAt: Date;
  updatedAt: Date;
  publishedAt: Date | null;
  author: {
    username: string;
    name: string | null;
  };
}

export async function GET(request: NextRequest) {
  try {
    const session = await getServerSession(authOptions);
    
    if (!session?.user || session.user.role !== 'admin') {
      return NextResponse.json({ error: 'Unauthorized' }, { status: 401 });
    }

    const { searchParams } = new URL(request.url);
    const language = searchParams.get('language') || 'ar';
    const type = searchParams.get('type');
    const status = searchParams.get('status');

    const where: any = {
      language
    };

    if (type) {
      where.type = type;
    }

    if (status) {
      where.status = status;
    }

    const pages = await prisma.page.findMany({
      where,
      include: {
        author: {
          select: {
            username: true,
            name: true
          }
        }
      },
      orderBy: {
        updatedAt: 'desc'
      }
    });

    return NextResponse.json({
      pages: pages.map((page: PageWithAuthor) => {
        let sections = [];
        if (page.content) {
          try {
            sections = JSON.parse(page.content);
          } catch (e) {
            // If content is not JSON (legacy HTML content), treat as single section
            sections = [{
              id: 'legacy-content',
              type: 'rich_text',
              data: {
                content: page.content
              }
            }];
          }
        }
        return {
          ...page,
          sections
        };
      })
    });
  } catch (error) {
    console.error('CMS API error:', error);
    return NextResponse.json({ error: 'Internal server error' }, { status: 500 });
  }
}

export async function POST(request: NextRequest) {
  try {
    const session = await getServerSession(authOptions);
    
    if (!session?.user || session.user.role !== 'admin') {
      return NextResponse.json({ error: 'Unauthorized' }, { status: 401 });
    }

    const data = await request.json();
    
    // Generate slug from title if not provided
    const slug = data.slug || data.title
      .toLowerCase()
      .replace(/[^\w\s-]/g, '')
      .replace(/\s+/g, '-');

    const page = await prisma.page.create({
      data: {
        title: data.title,
        slug,
        content: JSON.stringify(data.sections || []),
        metaTitle: data.metaTitle || data.title,
        metaDescription: data.metaDescription || '',
        type: data.type || 'game_info',
        status: 'draft',
        language: data.language || 'ar',
        authorId: session.user.id
      },
      include: {
        author: {
          select: {
            username: true,
            name: true
          }
        }
      }
    });

    return NextResponse.json({
      ...page,
      sections: page.content ? JSON.parse(page.content) : []
    });
  } catch (error) {
    console.error('Create page error:', error);
    return NextResponse.json({ error: 'Internal server error' }, { status: 500 });
  }
} 