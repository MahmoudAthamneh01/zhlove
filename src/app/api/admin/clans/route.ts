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

    const [clans, total] = await Promise.all([
      prisma.clan.findMany({
        where: {},
        include: {
          owner: {
            select: {
              username: true,
              name: true
            }
          },
          _count: {
            select: {
              members: true
            }
          },
          members: {
            include: {
              user: {
                select: {
                  username: true,
                  name: true
                }
              }
            }
          }
        },
        orderBy: {
          points: 'desc'
        },
        skip,
        take: limit,
      }),
      prisma.clan.count(),
    ]);

    const totalPages = Math.ceil(total / limit);

    return NextResponse.json({
      clans,
      pagination: {
        page,
        limit,
        total,
        totalPages,
      },
    });
  } catch (error) {
    console.error('Admin clans API error:', error);
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
    
    const clan = await prisma.clan.create({
      data: {
        name: data.name,
        tag: data.tag,
        description: data.description,
        ownerId: data.ownerId,
        maxMembers: parseInt(data.maxMembers) || 4,
        isRecruiting: data.isRecruiting !== false,
      },
      include: {
        owner: {
          select: {
            username: true,
            name: true,
          },
        },
        _count: {
          select: {
            members: true,
          },
        },
      },
    });

    return NextResponse.json(clan);
  } catch (error) {
    console.error('Create clan error:', error);
    return NextResponse.json({ error: 'Internal server error' }, { status: 500 });
  }
} 