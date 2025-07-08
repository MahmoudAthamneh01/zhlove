import { NextRequest, NextResponse } from 'next/server';
import { getServerSession } from 'next-auth';
import { authOptions } from '@/lib/auth';
import { prisma } from '@/lib/prisma';

export async function GET(request: NextRequest) {
  try {
    const session = await getServerSession(authOptions);
    
    if (!session?.user || session.user.role !== 'admin') {
      return NextResponse.json({ error: 'Unauthorized' }, { status: 401 });
    }

    const { searchParams } = new URL(request.url);
    const page = parseInt(searchParams.get('page') || '1');
    const limit = parseInt(searchParams.get('limit') || '20');
    const skip = (page - 1) * limit;

    const [badges, total] = await Promise.all([
      prisma.badge.findMany({
        include: {
          _count: {
            select: {
              userBadges: true,
            },
          },
        },
        orderBy: {
          id: 'desc',
        },
        skip,
        take: limit,
      }),
      prisma.badge.count(),
    ]);

    const totalPages = Math.ceil(total / limit);

    return NextResponse.json({
      badges,
      pagination: {
        page,
        limit,
        total,
        totalPages,
      },
    });
  } catch (error) {
    console.error('Admin badges API error:', error);
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
    
    const badge = await prisma.badge.create({
      data: {
        name: data.name,
        description: data.description,
        icon: data.icon,
        category: data.category || 'general',
      },
      include: {
        _count: {
          select: {
            userBadges: true,
          },
        },
      },
    });

    return NextResponse.json(badge);
  } catch (error) {
    console.error('Create badge error:', error);
    return NextResponse.json({ error: 'Internal server error' }, { status: 500 });
  }
} 