import { NextResponse } from 'next/server'
import { prisma } from '@/lib/prisma'

export async function GET(
  request: Request,
  { params }: { params: { clanId: string } }
) {
  try {
    const clan = await prisma.clan.findUnique({
      where: {
        id: params.clanId
      },
      include: {
        owner: {
          select: {
            id: true,
            username: true,
            name: true,
            image: true,
            rank: true,
          }
        },
        members: {
          include: {
            user: {
              select: {
                id: true,
                username: true,
                name: true,
                image: true,
                rank: true,
                points: true,
                wins: true,
                losses: true,
                level: true,
                joinedAt: true,
              }
            }
          },
          orderBy: [
            { role: 'desc' }, // owner first, then leaders, then members
            { joinedAt: 'asc' }
          ]
        },
        wars1: {
          include: {
            clan2: {
              select: {
                id: true,
                name: true,
                tag: true,
                logo: true,
              }
            }
          },
          orderBy: {
            createdAt: 'desc'
          },
          take: 10
        },
        wars2: {
          include: {
            clan1: {
              select: {
                id: true,
                name: true,
                tag: true,
                logo: true,
              }
            }
          },
          orderBy: {
            createdAt: 'desc'
          },
          take: 10
        },
        _count: {
          select: {
            members: true,
            wars1: true,
            wars2: true,
          }
        }
      }
    })

    if (!clan) {
      return NextResponse.json(
        { error: 'Clan not found' },
        { status: 404 }
      )
    }

    // Combine wars from both relations
    const allWars = [
      ...clan.wars1.map((war: any) => ({
        ...war,
        opponent: war.clan2,
        isHomeTeam: true
      })),
      ...clan.wars2.map((war: any) => ({
        ...war,
        opponent: war.clan1,
        isHomeTeam: false
      }))
    ].sort((a, b) => new Date(b.createdAt).getTime() - new Date(a.createdAt).getTime())

    // Destructure to exclude wars1 and wars2 from the response
    const { wars1, wars2, ...clanData } = clan

    const response = {
      ...clanData,
      wars: allWars.slice(0, 10), // Latest 10 wars
      totalWars: clan._count.wars1 + clan._count.wars2
    }

    return NextResponse.json(response)
  } catch (error) {
    console.error('Error fetching clan:', error)
    return NextResponse.json(
      { error: 'Failed to fetch clan' },
      { status: 500 }
    )
  }
} 