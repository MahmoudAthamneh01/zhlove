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
    const status = searchParams.get('status');
    const page = parseInt(searchParams.get('page') || '1');
    const limit = parseInt(searchParams.get('limit') || '20');
    const skip = (page - 1) * limit;

    const where: any = {};
    if (status && status !== 'all') {
      where.status = status;
    }

    const [tournaments, total] = await Promise.all([
      prisma.tournament.findMany({
        where,
        include: {
          organizer: {
            select: {
              username: true,
              name: true,
            },
          },
          _count: {
            select: {
              participants: true,
            },
          },
        },
        orderBy: {
          createdAt: 'desc',
        },
        skip,
        take: limit,
      }),
      prisma.tournament.count({ where }),
    ]);

    const totalPages = Math.ceil(total / limit);

    return NextResponse.json({
      tournaments,
      pagination: {
        page,
        limit,
        total,
        totalPages,
      },
    });
  } catch (error) {
    console.error('Admin tournaments API error:', error);
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
    
    const tournament = await prisma.tournament.create({
      data: {
        title: data.title,
        description: data.description,
        type: data.type,
        maxParticipants: parseInt(data.maxParticipants),
        prizePool: data.prizePool ? parseFloat(data.prizePool) : null,
        prizeDescription: data.prizeDescription,
        startDate: new Date(data.startDate),
        endDate: data.endDate ? new Date(data.endDate) : null,
        registrationDeadline: data.registrationDeadline ? new Date(data.registrationDeadline) : null,
        organizerId: session.user.id,
        rules: data.rules,
        requirements: data.requirements,
        mapPool: data.mapPool,
        isPublic: data.isPublic !== false,
        allowSpectators: data.allowSpectators !== false,
      },
      include: {
        organizer: {
          select: {
            username: true,
            name: true,
          },
        },
        _count: {
          select: {
            participants: true,
          },
        },
      },
    });

    return NextResponse.json(tournament);
  } catch (error) {
    console.error('Create tournament error:', error);
    return NextResponse.json({ error: 'Internal server error' }, { status: 500 });
  }
} 