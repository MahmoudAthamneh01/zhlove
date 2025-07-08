import { NextResponse } from 'next/server'
import { getServerSession } from 'next-auth'
import { authOptions } from '@/lib/auth'
import { prisma } from '@/lib/prisma'

export async function GET(request: Request) {
  try {
    const { searchParams } = new URL(request.url)
    const search = searchParams.get('search')
    const limit = parseInt(searchParams.get('limit') || '20')
    const offset = parseInt(searchParams.get('offset') || '0')
    const orderBy = searchParams.get('orderBy') || 'points'
    const order = searchParams.get('order') || 'desc'

    const whereClause = search
      ? {
          OR: [
            { username: { contains: search, mode: 'insensitive' as const } },
            { name: { contains: search, mode: 'insensitive' as const } },
            { email: { contains: search, mode: 'insensitive' as const } }
          ]
        }
      : {}

    const users = await prisma.user.findMany({
      where: whereClause,
      select: {
        id: true,
        username: true,
        name: true,
        email: true,
        image: true,
        rank: true,
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
        _count: {
          select: {
            forumPosts: true,
            forumComments: true,
            tournamentParticipants: true
          }
        }
      },
      orderBy: {
        [orderBy]: order as 'asc' | 'desc'
      },
      take: limit,
      skip: offset
    })

    const total = await prisma.user.count({ where: whereClause })

    return NextResponse.json({
      users: users.map((user: any) => ({
        ...user,
        clan: user.clanMember?.clan || null,
        winRate: user.wins + user.losses > 0 ? (user.wins / (user.wins + user.losses)) * 100 : 0
      })),
      total,
      hasMore: offset + limit < total
    })
  } catch (error) {
    console.error('Error fetching users:', error)
    return NextResponse.json(
      { error: 'Failed to fetch users' },
      { status: 500 }
    )
  }
} 