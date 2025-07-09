import { NextRequest, NextResponse } from 'next/server';
import { getServerSession } from 'next-auth';
import { authOptions } from '@/lib/auth';
import { prisma } from '@/lib/prisma';

export async function GET(
  request: NextRequest,
  { params }: { params: { pageId: string } }
) {
  try {
    const session = await getServerSession(authOptions);
    
    if (!session?.user || session.user.role !== 'admin') {
      return NextResponse.json({ error: 'Unauthorized' }, { status: 401 });
    }

    const page = await prisma.page.findUnique({
      where: { id: params.pageId },
      include: {
        author: {
          select: {
            username: true,
            name: true
          }
        }
      }
    });

    if (!page) {
      return NextResponse.json({ error: 'Page not found' }, { status: 404 });
    }

    return NextResponse.json({
      ...page,
      sections: page.content ? JSON.parse(page.content) : []
    });
  } catch (error) {
    console.error('Get page error:', error);
    return NextResponse.json({ error: 'Internal server error' }, { status: 500 });
  }
}

export async function PUT(
  request: NextRequest,
  { params }: { params: { pageId: string } }
) {
  try {
    const session = await getServerSession(authOptions);
    
    if (!session?.user || session.user.role !== 'admin') {
      return NextResponse.json({ error: 'Unauthorized' }, { status: 401 });
    }

    const data = await request.json();
    
    const updateData: any = {
      title: data.title,
      content: JSON.stringify(data.sections || []),
      metaTitle: data.metaTitle,
      metaDescription: data.metaDescription,
      type: data.type,
      status: data.status,
      language: data.language,
      updatedAt: new Date()
    };

    // Update publishedAt if status changes to published
    if (data.status === 'published') {
      updateData.publishedAt = new Date();
    }

    const page = await prisma.page.update({
      where: { id: params.pageId },
      data: updateData,
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
    console.error('Update page error:', error);
    return NextResponse.json({ error: 'Internal server error' }, { status: 500 });
  }
}

export async function DELETE(
  request: NextRequest,
  { params }: { params: { pageId: string } }
) {
  try {
    const session = await getServerSession(authOptions);
    
    if (!session?.user || session.user.role !== 'admin') {
      return NextResponse.json({ error: 'Unauthorized' }, { status: 401 });
    }

    await prisma.page.delete({
      where: { id: params.pageId }
    });

    return NextResponse.json({ success: true });
  } catch (error) {
    console.error('Delete page error:', error);
    return NextResponse.json({ error: 'Internal server error' }, { status: 500 });
  }
} 