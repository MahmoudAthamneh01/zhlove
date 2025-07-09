import { NextResponse } from 'next/server'
import { getServerSession } from 'next-auth'
import { authOptions } from '@/lib/auth'
import { prisma } from '@/lib/prisma'

export async function GET() {
  try {
    const badges = await prisma.badge.findMany({
      include: {
        userBadges: {
          include: {
            user: {
              select: {
                id: true,
                username: true,
                name: true,
                image: true
              }
            }
          },
          take: 10, // Show top 10 users with this badge
          orderBy: {
            earnedAt: 'desc'
          }
        },
        _count: {
          select: {
            userBadges: true
          }
        }
      },
      orderBy: {
        name: 'asc'
      }
    })

    return NextResponse.json(
      badges.map((badge: any) => ({
        ...badge,
        recipientCount: badge._count.userBadges,
        recentRecipients: badge.userBadges.map((ub: any) => ub.user)
      }))
    )
  } catch (error) {
    console.error('Error fetching badges:', error)
    return NextResponse.json(
      { error: 'Failed to fetch badges' },
      { status: 500 }
    )
  }
}

export async function POST(request: Request) {
  try {
    const session = await getServerSession(authOptions)
    
    if (!session?.user?.id) {
      return NextResponse.json(
        { error: 'Unauthorized' },
        { status: 401 }
      )
    }

    // Check if user is admin
    const user = await prisma.user.findUnique({
      where: { id: session.user.id },
      select: { isAdmin: true, isModerator: true }
    })

    if (!user?.isAdmin && !user?.isModerator) {
      return NextResponse.json(
        { error: 'Forbidden - Admin or Moderator access required' },
        { status: 403 }
      )
    }

    const { userId, badgeId, reason } = await request.json()

    // Validate required fields
    if (!userId || !badgeId) {
      return NextResponse.json(
        { error: 'Missing required fields: userId, badgeId' },
        { status: 400 }
      )
    }

    // Check if user exists
    const targetUser = await prisma.user.findUnique({
      where: { id: userId },
      select: { id: true, username: true }
    })

    if (!targetUser) {
      return NextResponse.json(
        { error: 'User not found' },
        { status: 404 }
      )
    }

    // Check if badge exists
    const badge = await prisma.badge.findUnique({
      where: { id: badgeId },
      select: { id: true, name: true }
    })

    if (!badge) {
      return NextResponse.json(
        { error: 'Badge not found' },
        { status: 404 }
      )
    }

    // Check if user already has this badge
    const existingBadge = await prisma.userBadge.findUnique({
      where: {
        userId_badgeId: {
          userId,
          badgeId
        }
      }
    })

    if (existingBadge) {
      return NextResponse.json(
        { error: 'User already has this badge' },
        { status: 400 }
      )
    }

    // Award the badge
    const userBadge = await prisma.userBadge.create({
      data: {
        userId,
        badgeId
      },
      include: {
        badge: true,
        user: {
          select: {
            id: true,
            username: true,
            name: true,
            image: true
          }
        }
      }
    })

    // Create notification for the user
    await prisma.notification.create({
      data: {
        userId,
        title: 'Badge Awarded!',
        message: `You have been awarded the "${badge.name}" badge!`,
        type: 'badge'
      }
    })

    return NextResponse.json(userBadge, { status: 201 })
  } catch (error) {
    console.error('Error awarding badge:', error)
    return NextResponse.json(
      { error: 'Failed to award badge' },
      { status: 500 }
    )
  }
} 