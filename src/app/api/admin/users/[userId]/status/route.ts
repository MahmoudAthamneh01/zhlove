import { NextRequest, NextResponse } from 'next/server';
import { getServerSession } from 'next-auth';
import { authOptions } from '@/lib/auth';
import { prisma } from '@/lib/prisma';

export async function PATCH(
  request: NextRequest,
  { params }: { params: { userId: string } }
) {
  try {
    const session = await getServerSession(authOptions);

    if (!session || session.user.role !== 'admin') {
      return NextResponse.json({ error: 'Unauthorized' }, { status: 401 });
    }

    const { status } = await request.json();
    const { userId } = params;

    if (!['active', 'banned', 'suspended'].includes(status)) {
      return NextResponse.json({ error: 'Invalid status' }, { status: 400 });
    }

    // Prevent users from banning themselves
    if (userId === session.user.id && status !== 'active') {
      return NextResponse.json({ 
        error: 'Cannot ban yourself' 
      }, { status: 400 });
    }

    const updatedUser = await prisma.user.update({
      where: { id: userId },
      data: { status },
      select: {
        id: true,
        username: true,
        status: true,
      }
    });

    return NextResponse.json(updatedUser);

  } catch (error) {
    console.error('Update user status error:', error);
    return NextResponse.json({ error: 'Internal server error' }, { status: 500 });
  }
} 