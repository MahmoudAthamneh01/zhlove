import { NextRequest, NextResponse } from 'next/server';
import { getServerSession } from 'next-auth';
import { authOptions } from '@/lib/auth';
import { prisma } from '@/lib/prisma';

export async function DELETE(
  request: NextRequest,
  { params }: { params: { tournamentId: string } }
) {
  try {
    const session = await getServerSession(authOptions);
    
    if (!session?.user || session.user.role !== 'admin') {
      return NextResponse.json({ error: 'Unauthorized' }, { status: 401 });
    }

    // First delete all participants
    await prisma.tournamentParticipant.deleteMany({
      where: { tournamentId: params.tournamentId },
    });

    // Then delete the tournament
    await prisma.tournament.delete({
      where: { id: params.tournamentId },
    });

    return NextResponse.json({ success: true });
  } catch (error) {
    console.error('Delete tournament error:', error);
    return NextResponse.json({ error: 'Internal server error' }, { status: 500 });
  }
} 