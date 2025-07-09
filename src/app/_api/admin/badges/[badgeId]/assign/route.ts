import { NextRequest, NextResponse } from 'next/server';
import { getServerSession } from 'next-auth';
import { authOptions } from '@/lib/auth';
import { prisma } from '@/lib/prisma';

export async function POST(
  request: NextRequest,
  { params }: { params: { badgeId: string } }
) {
  try {
    const session = await getServerSession(authOptions);
    
    if (!session?.user || session.user.role !== 'admin') {
      return NextResponse.json({ error: 'Unauthorized' }, { status: 401 });
    }

    const { userId } = await request.json();

    // Check if user already has this badge
    const existingBadge = await prisma.userBadge.findFirst({
      where: {
        userId,
        badgeId: params.badgeId,
      },
    });

    if (existingBadge) {
      return NextResponse.json({ error: 'User already has this badge' }, { status: 400 });
    }

    const userBadge = await prisma.userBadge.create({
      data: {
        userId,
        badgeId: params.badgeId,
      },
      include: {
        badge: true,
        user: {
          select: {
            username: true,
            name: true,
          },
        },
      },
    });

    return NextResponse.json(userBadge);
  } catch (error) {
    console.error('Assign badge error:', error);
    return NextResponse.json({ error: 'Internal server error' }, { status: 500 });
  }
} 