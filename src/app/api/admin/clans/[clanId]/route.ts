import { NextRequest, NextResponse } from 'next/server';
import { getServerSession } from 'next-auth';
import { authOptions } from '@/lib/auth';
import { prisma } from '@/lib/prisma';

export async function DELETE(
  request: NextRequest,
  { params }: { params: { clanId: string } }
) {
  try {
    const session = await getServerSession(authOptions);
    
    if (!session?.user || session.user.role !== 'admin') {
      return NextResponse.json({ error: 'Unauthorized' }, { status: 401 });
    }

    // First delete all clan members
    await prisma.clanMember.deleteMany({
      where: { clanId: params.clanId },
    });

    // Delete clan wars where this clan participated
    await prisma.clanWar.deleteMany({
      where: {
        OR: [
          { clan1Id: params.clanId },
          { clan2Id: params.clanId },
        ],
      },
    });

    // Then delete the clan
    await prisma.clan.delete({
      where: { id: params.clanId },
    });

    return NextResponse.json({ success: true });
  } catch (error) {
    console.error('Delete clan error:', error);
    return NextResponse.json({ error: 'Internal server error' }, { status: 500 });
  }
} 