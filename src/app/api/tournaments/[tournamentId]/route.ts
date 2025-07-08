import { NextResponse } from 'next/server'
import { getServerSession } from 'next-auth'
import { authOptions } from '@/lib/auth'
import { prisma } from '@/lib/prisma'

export async function GET(
  request: Request,
  { params }: { params: { tournamentId: string } }
) {
  try {
    const tournament = await prisma.tournament.findUnique({
      where: {
        id: params.tournamentId
      },
      include: {
        organizer: {
          select: {
            id: true,
            username: true,
            name: true,
            image: true,
            rank: true
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
                rank: true,
                points: true,
                wins: true,
                losses: true
              }
            }
          },
          orderBy: {
            registeredAt: 'asc'
          }
        }
      }
    })

    if (!tournament) {
      return NextResponse.json(
        { error: 'Tournament not found' },
        { status: 404 }
      )
    }

    return NextResponse.json(tournament)
  } catch (error) {
    console.error('Error fetching tournament:', error)
    return NextResponse.json(
      { error: 'Failed to fetch tournament' },
      { status: 500 }
    )
  }
}

export async function POST(
  request: Request,
  { params }: { params: { tournamentId: string } }
) {
  try {
    const session = await getServerSession(authOptions)
    
    if (!session?.user?.id) {
      return NextResponse.json(
        { error: 'Unauthorized' },
        { status: 401 }
      )
    }

    const { action } = await request.json()

    if (action === 'join') {
      // Check if tournament exists and is joinable
      const tournament = await prisma.tournament.findUnique({
        where: { id: params.tournamentId },
        include: {
          participants: true,
          _count: {
            select: {
              participants: true
            }
          }
        }
      })

      if (!tournament) {
        return NextResponse.json(
          { error: 'Tournament not found' },
          { status: 404 }
        )
      }

      if (tournament.status !== 'upcoming') {
        return NextResponse.json(
          { error: 'Tournament is not accepting registrations' },
          { status: 400 }
        )
      }

      if (tournament.registrationDeadline && new Date() > tournament.registrationDeadline) {
        return NextResponse.json(
          { error: 'Registration deadline has passed' },
          { status: 400 }
        )
      }

      if (tournament._count.participants >= tournament.maxParticipants) {
        return NextResponse.json(
          { error: 'Tournament is full' },
          { status: 400 }
        )
      }

      // Check if user is already registered
      const existingParticipant = await prisma.tournamentParticipant.findUnique({
        where: {
          userId_tournamentId: {
            userId: session.user.id,
            tournamentId: params.tournamentId
          }
        }
      })

      if (existingParticipant) {
        return NextResponse.json(
          { error: 'You are already registered for this tournament' },
          { status: 400 }
        )
      }

      // Register user for tournament
      const participant = await prisma.tournamentParticipant.create({
        data: {
          tournamentId: params.tournamentId,
          userId: session.user.id
        },
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
      })

      // Create notification for organizer
      await prisma.notification.create({
        data: {
          userId: tournament.organizerId,
          title: 'New Tournament Registration',
          message: `${session.user.name || session.user.email} has joined your tournament "${tournament.title}"`,
          type: 'tournament'
        }
      })

      return NextResponse.json(participant, { status: 201 })
    } else if (action === 'leave') {
      // Remove user from tournament
      const participant = await prisma.tournamentParticipant.findUnique({
        where: {
          userId_tournamentId: {
            userId: session.user.id,
            tournamentId: params.tournamentId
          }
        }
      })

      if (!participant) {
        return NextResponse.json(
          { error: 'You are not registered for this tournament' },
          { status: 400 }
        )
      }

      await prisma.tournamentParticipant.delete({
        where: {
          userId_tournamentId: {
            userId: session.user.id,
            tournamentId: params.tournamentId
          }
        }
      })

      return NextResponse.json({ success: true })
    } else {
      return NextResponse.json(
        { error: 'Invalid action. Use "join" or "leave"' },
        { status: 400 }
      )
    }
  } catch (error) {
    console.error('Error managing tournament participation:', error)
    return NextResponse.json(
      { error: 'Failed to manage tournament participation' },
      { status: 500 }
    )
  }
} 