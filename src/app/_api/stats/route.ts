import { NextResponse } from 'next/server'
import { prisma } from '@/lib/prisma'

export async function GET() {
  try {
    // Get real-time stats from database
    const [
      totalUsers,
      totalClans,
      activeTournaments,
      totalForumPosts,
      onlineUsers,
      totalReplays,
      completedMatches,
      totalBadges
    ] = await Promise.all([
      prisma.user.count(),
      prisma.clan.count(),
      prisma.tournament.count({
        where: {
          status: { in: ['upcoming', 'active'] }
        }
      }),
      prisma.forumPost.count(),
      prisma.user.count({
        where: {
          status: 'online',
          lastSeen: {
            gte: new Date(Date.now() - 15 * 60 * 1000) // Active in last 15 minutes
          }
        }
      }),
      prisma.replay.count(),
      prisma.matchReport.count(),
      prisma.badge.count()
    ])

    // Get recent activity stats
    const last24Hours = new Date(Date.now() - 24 * 60 * 60 * 1000)
    const [
      newUsersToday,
      newPostsToday,
      newTournamentsToday,
      newClansToday
    ] = await Promise.all([
      prisma.user.count({
        where: {
          joinedAt: { gte: last24Hours }
        }
      }),
      prisma.forumPost.count({
        where: {
          createdAt: { gte: last24Hours }
        }
      }),
      prisma.tournament.count({
        where: {
          createdAt: { gte: last24Hours }
        }
      }),
      prisma.clan.count({
        where: {
          foundedAt: { gte: last24Hours }
        }
      })
    ])

    // Get top clans
    const topClans = await prisma.clan.findMany({
      take: 5,
      orderBy: {
        points: 'desc'
      },
      select: {
        id: true,
        name: true,
        tag: true,
        points: true,
        wins: true,
        losses: true,
        _count: {
          select: {
            members: true
          }
        }
      }
    })

    // Get top players
    const topPlayers = await prisma.user.findMany({
      take: 5,
      orderBy: {
        points: 'desc'
      },
      select: {
        id: true,
        username: true,
        name: true,
        image: true,
        points: true,
        wins: true,
        losses: true,
        rank: true
      }
    })

    // Get recent forum posts
    const recentPosts = await prisma.forumPost.findMany({
      take: 5,
      orderBy: {
        createdAt: 'desc'
      },
      select: {
        id: true,
        title: true,
        createdAt: true,
        author: {
          select: {
            username: true,
            name: true,
            image: true
          }
        },
        _count: {
          select: {
            comments: true,
            likes: true
          }
        }
      }
    })

    const stats = {
      overview: {
        totalUsers,
        totalClans,
        activeTournaments,
        totalForumPosts,
        onlineUsers,
        totalReplays,
        completedMatches,
        totalBadges
      },
      activity: {
        newUsersToday,
        newPostsToday,
        newTournamentsToday,
        newClansToday
      },
      leaderboards: {
        topClans: topClans.map((clan: any) => ({
          ...clan,
          memberCount: clan._count.members,
          winRate: clan.wins + clan.losses > 0 ? (clan.wins / (clan.wins + clan.losses)) * 100 : 0
        })),
        topPlayers: topPlayers.map((player: any) => ({
          ...player,
          winRate: player.wins + player.losses > 0 ? (player.wins / (player.wins + player.losses)) * 100 : 0
        }))
      },
      recent: {
        forumPosts: recentPosts
      },
      lastUpdated: new Date().toISOString()
    }

    return NextResponse.json(stats)
  } catch (error) {
    console.error('Error fetching stats:', error)
    return NextResponse.json(
      { error: 'Failed to fetch stats' },
      { status: 500 }
    )
  }
} 