import { NextRequest, NextResponse } from 'next/server';
import { getServerSession } from 'next-auth';
import { authOptions } from '@/lib/auth';
import { prisma } from '@/lib/prisma';

export async function PATCH(
  request: NextRequest,
  { params }: { params: { tournamentId: string } }
) {
  try {
    const session = await getServerSession(authOptions);
    
    if (!session?.user || session.user.role !== 'admin') {
      return NextResponse.json({ error: 'Unauthorized' }, { status: 401 });
    }

    const { status } = await request.json();
    
    const tournament = await prisma.tournament.update({
      where: { id: params.tournamentId },
      data: { status },
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
    console.error('Update tournament status error:', error);
    return NextResponse.json({ error: 'Internal server error' }, { status: 500 });
  }
} 