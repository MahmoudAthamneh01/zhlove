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

    const { role } = await request.json();
    const { userId } = params;

    if (!['user', 'moderator', 'admin'].includes(role)) {
      return NextResponse.json({ error: 'Invalid role' }, { status: 400 });
    }

    // Prevent users from removing their own admin role
    if (userId === session.user.id && role !== 'admin') {
      return NextResponse.json({ 
        error: 'Cannot remove your own admin privileges' 
      }, { status: 400 });
    }

    const updatedUser = await prisma.user.update({
      where: { id: userId },
      data: {
        role,
        isAdmin: role === 'admin',
        isModerator: role === 'moderator' || role === 'admin',
      },
      select: {
        id: true,
        username: true,
        role: true,
        isAdmin: true,
        isModerator: true,
      }
    });

    return NextResponse.json(updatedUser);

  } catch (error) {
    console.error('Update user role error:', error);
    return NextResponse.json({ error: 'Internal server error' }, { status: 500 });
  }
} 