import { NextRequest, NextResponse } from 'next/server';
import { getServerSession } from 'next-auth';
import { authOptions } from '@/lib/auth';
import { prisma } from '@/lib/prisma';

export async function DELETE(
  request: NextRequest,
  { params }: { params: { clanId: string; userId: string } }
) {
  try {
    const session = await getServerSession(authOptions);
    
    if (!session?.user || session.user.role !== 'admin') {
      return NextResponse.json({ error: 'Unauthorized' }, { status: 401 });
    }

    await prisma.clanMember.delete({
      where: {
        userId: params.userId,
        clanId: params.clanId,
      },
    });

    return NextResponse.json({ success: true });
  } catch (error) {
    console.error('Remove clan member error:', error);
    return NextResponse.json({ error: 'Internal server error' }, { status: 500 });
  }
} 