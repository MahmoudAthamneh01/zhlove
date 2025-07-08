import { NextResponse } from 'next/server'
import { prisma } from '@/lib/prisma'

export async function GET(request: Request) {
  try {
    const { searchParams } = new URL(request.url)
    const type = searchParams.get('type') || 'points' // points, wins, level, winRate
    const limit = parseInt(searchParams.get('limit') || '50')
    const offset = parseInt(searchParams.get('offset') || '0')
    const search = searchParams.get('search')

    const whereClause = search
      ? {
          OR: [
            { username: { contains: search, mode: 'insensitive' as const } },
            { name: { contains: search, mode: 'insensitive' as const } }
          ]
        }
      : {}

    let orderBy: any = { points: 'desc' }
    
    switch (type) {
      case 'wins':
        orderBy = { wins: 'desc' }
        break
      case 'level':
        orderBy = { level: 'desc' }
        break
      case 'winRate':
        // For win rate, we'll calculate it in the query
        orderBy = [
          { wins: 'desc' },
          { losses: 'asc' }
        ]
        break
    }

    const users = await prisma.user.findMany({
      where: whereClause,
      select: {
        id: true,
        username: true,
        name: true,
        image: true,
        rank: true,
        points: true,
        wins: true,
        losses: true,
        xp: true,
        level: true,
        joinedAt: true,
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
            badge: {
              select: {
                id: true,
                name: true,
                description: true,
                icon: true
              }
            }
          },
          take: 3 // Show top 3 badges
        }
      },
      orderBy,
      take: limit,
      skip: offset
    })

    const total = await prisma.user.count({ where: whereClause })

    const rankings = users.map((user: any, index: number) => {
      const totalGames = user.wins + user.losses
      const winRate = totalGames > 0 ? (user.wins / totalGames) * 100 : 0

      return {
        rank: offset + index + 1,
        ...user,
        clan: user.clanMember?.clan || null,
        winRate: Math.round(winRate * 100) / 100, // Round to 2 decimal places
        totalGames
      }
    })

    return NextResponse.json({
      rankings,
      total,
      hasMore: offset + limit < total,
      type
    })
  } catch (error) {
    console.error('Error fetching rankings:', error)
    return NextResponse.json(
      { error: 'Failed to fetch rankings' },
      { status: 500 }
    )
  }
} 