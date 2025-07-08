import { NextResponse } from 'next/server';
import { prisma } from '@/lib/prisma';

export async function GET() {
  try {
    // Get current date for today's stats
    const today = new Date();
    today.setHours(0, 0, 0, 0);
    
    const tomorrow = new Date(today);
    tomorrow.setDate(tomorrow.getDate() + 1);

    // Calculate stats in parallel
    const [
      totalPosts,
      activeMembers,
      todaysPosts,
      onlineUsers
    ] = await Promise.all([
      // Total posts count
      prisma.forumPost.count(),
      
      // Active members (users who posted or commented in last 30 days)
      prisma.user.count({
        where: {
          OR: [
            {
              forumPosts: {
                some: {
                  createdAt: {
                    gte: new Date(Date.now() - 30 * 24 * 60 * 60 * 1000)
                  }
                }
              }
            },
            {
              forumComments: {
                some: {
                  createdAt: {
                    gte: new Date(Date.now() - 30 * 24 * 60 * 60 * 1000)
                  }
                }
              }
            }
          ]
        }
      }),
      
      // Today's posts
      prisma.forumPost.count({
        where: {
          createdAt: {
            gte: today,
            lt: tomorrow
          }
        }
      }),
      
      // Online users (users seen in last hour)
      prisma.user.count({
        where: {
          status: 'online',
          lastSeen: {
            gte: new Date(Date.now() - 60 * 60 * 1000) // Last hour
          }
        }
      })
    ]);

    return NextResponse.json({
      totalPosts,
      activeMembers,
      todaysPosts,
      onlineNow: onlineUsers
    });

  } catch (error) {
    console.error('Forum stats API error:', error);
    return NextResponse.json(
      { error: 'Failed to fetch forum stats' },
      { status: 500 }
    );
  }
} 