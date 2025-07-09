import { NextResponse } from 'next/server'
import { getServerSession } from 'next-auth'
import { authOptions } from '@/lib/auth'
import { prisma } from '@/lib/prisma'

export async function GET(request: Request) {
  try {
    const { searchParams } = new URL(request.url)
    const status = searchParams.get('status') // active, upcoming, completed, cancelled
    const search = searchParams.get('search')
    const limit = parseInt(searchParams.get('limit') || '20')
    const offset = parseInt(searchParams.get('offset') || '0')

    const whereClause: any = {}
    
    if (status) {
      whereClause.status = status
    }
    
    if (search) {
      whereClause.OR = [
        { title: { contains: search, mode: 'insensitive' } },
        { description: { contains: search, mode: 'insensitive' } }
      ]
    }

    const tournaments = await prisma.tournament.findMany({
      where: whereClause,
      include: {
        organizer: {
          select: {
            id: true,
            username: true,
            name: true,
            image: true
          }
        },
        participants: {
          include: {
            user: {
              select: {
                id: true,
                username: true,
                name: true,
                image: true,
                rank: true
              }
            }
          }
        },
        _count: {
          select: {
            participants: true
          }
        }
      },
      orderBy: {
        createdAt: 'desc'
      },
      take: limit,
      skip: offset
    })

    const total = await prisma.tournament.count({ where: whereClause })

    return NextResponse.json({
      tournaments,
      total,
      hasMore: offset + limit < total
    })
  } catch (error) {
    console.error('Error fetching tournaments:', error)
    return NextResponse.json(
      { error: 'Failed to fetch tournaments' },
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

    const {
      title,
      description,
      type,
      format,
      maxParticipants,
      prizePool,
      prizeDescription,
      entryFee,
      startDate,
      endDate,
      registrationDeadline,
      rules,
      requirements,
      isPublic,
      allowSpectators,
      streamUrl,
      mapPool
    } = await request.json()

    // Validate required fields
    if (!title || !type || !format || !startDate) {
      return NextResponse.json(
        { error: 'Missing required fields: title, type, format, startDate' },
        { status: 400 }
      )
    }

    // Validate dates
    const start = new Date(startDate)
    const end = endDate ? new Date(endDate) : null
    const regDeadline = registrationDeadline ? new Date(registrationDeadline) : null

    if (start <= new Date()) {
      return NextResponse.json(
        { error: 'Start date must be in the future' },
        { status: 400 }
      )
    }

    if (end && end <= start) {
      return NextResponse.json(
        { error: 'End date must be after start date' },
        { status: 400 }
      )
    }

    if (regDeadline && regDeadline >= start) {
      return NextResponse.json(
        { error: 'Registration deadline must be before start date' },
        { status: 400 }
      )
    }

    const tournament = await prisma.tournament.create({
      data: {
        title,
        description,
        type,
        format,
        maxParticipants: maxParticipants || 16,
        prizePool: prizePool || 0,
        prizeDescription,
        entryFee: entryFee || 0,
        startDate: start,
        endDate: end,
        registrationDeadline: regDeadline,
        rules,
        requirements,
        isPublic: isPublic !== false, // default to true
        allowSpectators: allowSpectators !== false, // default to true
        streamUrl,
        mapPool,
        organizerId: session.user.id,
        status: 'upcoming'
      },
      include: {
        organizer: {
          select: {
            id: true,
            username: true,
            name: true,
            image: true
          }
        }
      }
    })

    return NextResponse.json(tournament, { status: 201 })
  } catch (error) {
    console.error('Error creating tournament:', error)
    return NextResponse.json(
      { error: 'Failed to create tournament' },
      { status: 500 }
    )
  }
} 