import { NextResponse } from 'next/server'
import { getServerSession } from 'next-auth'
import { authOptions } from '@/lib/auth'
import { prisma } from '@/lib/prisma'
import bcrypt from 'bcryptjs'

export async function GET(
  request: Request,
  { params }: { params: { userId: string } }
) {
  try {
    const user = await prisma.user.findUnique({
      where: {
        id: params.userId
      },
      select: {
        id: true,
        username: true,
        name: true,
        email: true,
        image: true,
        bio: true,
        rank: true,
        role: true,
        points: true,
        wins: true,
        losses: true,
        xp: true,
        level: true,
        status: true,
        lastSeen: true,
        joinedAt: true,
        isVerified: true,
        clanMember: {
          include: {
            clan: {
              select: {
                id: true,
                name: true,
                tag: true,
                logo: true
              }
            }
          }
        },
        badges: {
          include: {
            badge: true
          }
        },
        forumPosts: {
          select: {
            id: true,
            title: true,
            createdAt: true,
            _count: {
              select: {
                comments: true,
                likes: true
              }
            }
          },
          orderBy: {
            createdAt: 'desc'
          },
          take: 5
        },
        replays: {
          select: {
            id: true,
            title: true,
            createdAt: true,
            likes: true,
            downloads: true
          },
          orderBy: {
            createdAt: 'desc'
          },
          take: 5
        },
        _count: {
          select: {
            forumPosts: true,
            forumComments: true,
            tournamentParticipants: true,
            replays: true,
            badges: true
          }
        }
      }
    })

    if (!user) {
      return NextResponse.json(
        { error: 'User not found' },
        { status: 404 }
      )
    }

    const winRate = user.wins + user.losses > 0 ? (user.wins / (user.wins + user.losses)) * 100 : 0

    return NextResponse.json({
      ...user,
      clan: user.clanMember?.clan || null,
      winRate
    })
  } catch (error) {
    console.error('Error fetching user:', error)
    return NextResponse.json(
      { error: 'Failed to fetch user' },
      { status: 500 }
    )
  }
}

export async function PUT(
  request: Request,
  { params }: { params: { userId: string } }
) {
  try {
    const session = await getServerSession(authOptions)
    
    if (!session?.user?.id) {
      return NextResponse.json(
        { error: 'Unauthorized' },
        { status: 401 }
      )
    }

    // Users can only update their own profile or admins can update any
    const currentUser = await prisma.user.findUnique({
      where: { id: session.user.id },
      select: { isAdmin: true }
    })

    if (session.user.id !== params.userId && !currentUser?.isAdmin) {
      return NextResponse.json(
        { error: 'Forbidden' },
        { status: 403 }
      )
    }

    const { name, bio, image, email, currentPassword, newPassword } = await request.json()

    // Validate email format if provided
    if (email && !/^[^\s@]+@[^\s@]+\.[^\s@]+$/.test(email)) {
      return NextResponse.json(
        { error: 'Invalid email format' },
        { status: 400 }
      )
    }

    const updateData: any = {}
    
    if (name !== undefined) updateData.name = name
    if (bio !== undefined) updateData.bio = bio
    if (image !== undefined) updateData.image = image
    if (email !== undefined) updateData.email = email

    // Handle password change
    if (newPassword && currentPassword) {
      const user = await prisma.user.findUnique({
        where: { id: params.userId },
        select: { password: true }
      })

      if (!user?.password) {
        return NextResponse.json(
          { error: 'No password set for this account' },
          { status: 400 }
        )
      }

      const isValidPassword = await bcrypt.compare(currentPassword, user.password)
      if (!isValidPassword) {
        return NextResponse.json(
          { error: 'Current password is incorrect' },
          { status: 400 }
        )
      }

      updateData.password = await bcrypt.hash(newPassword, 12)
    }

    const updatedUser = await prisma.user.update({
      where: { id: params.userId },
      data: updateData,
      select: {
        id: true,
        username: true,
        name: true,
        email: true,
        image: true,
        bio: true,
        rank: true,
        points: true,
        wins: true,
        losses: true,
        xp: true,
        level: true,
        status: true,
        lastSeen: true,
        joinedAt: true,
        isVerified: true
      }
    })

    return NextResponse.json(updatedUser)
  } catch (error) {
    console.error('Error updating user:', error)
    return NextResponse.json(
      { error: 'Failed to update user' },
      { status: 500 }
    )
  }
} 