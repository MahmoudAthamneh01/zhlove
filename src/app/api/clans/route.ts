import { NextResponse } from 'next/server'
import { getServerSession } from 'next-auth'
import { authOptions } from '@/lib/auth'
import { prisma } from '@/lib/prisma'

export async function GET() {
  try {
    const clans = await prisma.clan.findMany({
      include: {
        owner: {
          select: {
            id: true,
            username: true,
            name: true,
            image: true,
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
              }
            }
          }
        },
        _count: {
          select: {
            members: true,
          }
        }
      },
      orderBy: {
        points: 'desc'
      }
    })

    return NextResponse.json(clans)
  } catch (error) {
    console.error('Error fetching clans:', error)
    return NextResponse.json(
      { error: 'Failed to fetch clans' },
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

    const { name, tag, description } = await request.json()

    // Validate required fields
    if (!name || !tag) {
      return NextResponse.json(
        { error: 'Name and tag are required' },
        { status: 400 }
      )
    }

    // Check if user is already in a clan
    const existingMember = await prisma.clanMember.findUnique({
      where: {
        userId: session.user.id
      }
    })

    if (existingMember) {
      return NextResponse.json(
        { error: 'You are already a member of a clan' },
        { status: 400 }
      )
    }

    // Check if clan name or tag already exists
    const existingClan = await prisma.clan.findFirst({
      where: {
        OR: [
          { name },
          { tag }
        ]
      }
    })

    if (existingClan) {
      return NextResponse.json(
        { error: 'Clan name or tag already exists' },
        { status: 400 }
      )
    }

    // Create clan and add owner as member
    const clan = await prisma.clan.create({
      data: {
        name,
        tag,
        description,
        ownerId: session.user.id,
        members: {
          create: {
            userId: session.user.id,
            role: 'owner'
          }
        }
      },
      include: {
        owner: {
          select: {
            id: true,
            username: true,
            name: true,
            image: true,
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
              }
            }
          }
        }
      }
    })

    return NextResponse.json(clan, { status: 201 })
  } catch (error) {
    console.error('Error creating clan:', error)
    return NextResponse.json(
      { error: 'Failed to create clan' },
      { status: 500 }
    )
  }
} 