import { NextRequest, NextResponse } from 'next/server';
import { getServerSession } from 'next-auth';
import { authOptions } from '@/lib/auth';
import { prisma } from '@/lib/prisma';

// POST - Publish home page changes
export async function POST(request: NextRequest) {
  try {
    const session = await getServerSession(authOptions);
    
    if (!session?.user) {
      return NextResponse.json({ error: 'Unauthorized' }, { status: 401 });
    }

    // Check if user is admin
    const user = await prisma.user.findUnique({
      where: { id: session.user.id }
    });

    if (!user || user.role !== 'admin') {
      return NextResponse.json({ error: 'Forbidden' }, { status: 403 });
    }

    // Get the latest home page configuration
    const homeConfig = await prisma.cmsContent.findFirst({
      where: {
        type: 'HOME_PAGE',
        isActive: true
      },
      orderBy: {
        updatedAt: 'desc'
      }
    });

    if (!homeConfig) {
      return NextResponse.json(
        { error: 'No home page configuration found' }, 
        { status: 404 }
      );
    }

    // Publish the configuration
    const publishedConfig = await prisma.cmsContent.update({
      where: { id: homeConfig.id },
      data: {
        isPublished: true,
        publishedAt: new Date(),
        updatedBy: user.id
      }
    });

    // Optional: Clear any cache or trigger regeneration
    // This could include revalidating static pages, clearing CDN cache, etc.
    
    return NextResponse.json({
      success: true,
      id: publishedConfig.id,
      publishedAt: publishedConfig.publishedAt?.toISOString(),
      message: 'Home page changes published successfully'
    });

  } catch (error) {
    console.error('Error publishing home config:', error);
    return NextResponse.json(
      { error: 'Internal server error' }, 
      { status: 500 }
    );
  }
} 