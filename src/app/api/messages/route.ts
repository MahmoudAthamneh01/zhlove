import { NextResponse } from 'next/server'
import { getServerSession } from 'next-auth'
import { authOptions } from '@/lib/auth'
import { prisma } from '@/lib/prisma'

export async function GET(request: Request) {
  try {
    const session = await getServerSession(authOptions)
    
    if (!session?.user?.id) {
      return NextResponse.json(
        { error: 'Unauthorized' },
        { status: 401 }
      )
    }

    const { searchParams } = new URL(request.url)
    const conversationWith = searchParams.get('with')
    const limit = parseInt(searchParams.get('limit') || '20')
    const offset = parseInt(searchParams.get('offset') || '0')

    if (conversationWith) {
      // Get messages in a specific conversation
      const messages = await prisma.message.findMany({
        where: {
          OR: [
            {
              senderId: session.user.id,
              receiverId: conversationWith
            },
            {
              senderId: conversationWith,
              receiverId: session.user.id
            }
          ]
        },
        include: {
          sender: {
            select: {
              id: true,
              username: true,
              name: true,
              image: true
            }
          },
          receiver: {
            select: {
              id: true,
              username: true,
              name: true,
              image: true
            }
          }
        },
        orderBy: {
          createdAt: 'desc'
        },
        take: limit,
        skip: offset
      })

      // Mark messages as read
      await prisma.message.updateMany({
        where: {
          senderId: conversationWith,
          receiverId: session.user.id,
          isRead: false
        },
        data: {
          isRead: true
        }
      })

      return NextResponse.json(messages.reverse()) // Reverse to show oldest first
    } else {
      // Get all conversations (latest message with each user)
      const conversations = await prisma.$queryRaw`
        SELECT DISTINCT
          CASE 
            WHEN sender_id = ${session.user.id} THEN receiver_id
            ELSE sender_id
          END as user_id,
          MAX(created_at) as last_message_date
        FROM messages 
        WHERE sender_id = ${session.user.id} OR receiver_id = ${session.user.id}
        GROUP BY user_id
        ORDER BY last_message_date DESC
        LIMIT ${limit}
        OFFSET ${offset}
      ` as { user_id: string; last_message_date: Date }[]

      const userIds = conversations.map(conv => conv.user_id)
      
      if (userIds.length === 0) {
        return NextResponse.json([])
      }

      // Get user details and latest messages
      const users = await prisma.user.findMany({
        where: {
          id: { in: userIds }
        },
        select: {
          id: true,
          username: true,
          name: true,
          image: true,
          status: true
        }
      })

      const latestMessages = await Promise.all(
        userIds.map(async (userId) => {
          return await prisma.message.findFirst({
            where: {
              OR: [
                { senderId: session.user.id, receiverId: userId },
                { senderId: userId, receiverId: session.user.id }
              ]
            },
            orderBy: { createdAt: 'desc' }
          })
        })
      )

      // Get unread count for each conversation
      const unreadCounts = await Promise.all(
        userIds.map(async (userId) => {
          const count = await prisma.message.count({
            where: {
              senderId: userId,
              receiverId: session.user.id,
              isRead: false
            }
          })
          return { userId, count }
        })
      )

      const conversationsWithDetails = conversations.map((conv, index) => {
        const user = users.find((u: any) => u.id === conv.user_id)
        const latestMessage = latestMessages[index]
        const unreadCount = unreadCounts.find(uc => uc.userId === conv.user_id)?.count || 0

        return {
          user,
          latestMessage,
          unreadCount,
          lastMessageDate: conv.last_message_date
        }
      })

      return NextResponse.json(conversationsWithDetails)
    }
  } catch (error) {
    console.error('Error fetching messages:', error)
    return NextResponse.json(
      { error: 'Failed to fetch messages' },
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

    const { receiverId, content } = await request.json()

    // Validate required fields
    if (!receiverId || !content) {
      return NextResponse.json(
        { error: 'Missing required fields: receiverId, content' },
        { status: 400 }
      )
    }

    // Validate content length
    if (content.length > 1000) {
      return NextResponse.json(
        { error: 'Message cannot exceed 1,000 characters' },
        { status: 400 }
      )
    }

    // Check if receiver exists
    const receiver = await prisma.user.findUnique({
      where: { id: receiverId },
      select: { id: true }
    })

    if (!receiver) {
      return NextResponse.json(
        { error: 'Receiver not found' },
        { status: 404 }
      )
    }

    // Cannot send message to self
    if (receiverId === session.user.id) {
      return NextResponse.json(
        { error: 'Cannot send message to yourself' },
        { status: 400 }
      )
    }

    const message = await prisma.message.create({
      data: {
        content,
        senderId: session.user.id,
        receiverId
      },
      include: {
        sender: {
          select: {
            id: true,
            username: true,
            name: true,
            image: true
          }
        },
        receiver: {
          select: {
            id: true,
            username: true,
            name: true,
            image: true
          }
        }
      }
    })

    // Create notification for receiver
    await prisma.notification.create({
      data: {
        userId: receiverId,
        title: 'New Message',
        message: `You have a new message from ${session.user.name || session.user.email}`,
        type: 'message'
      }
    })

    return NextResponse.json(message, { status: 201 })
  } catch (error) {
    console.error('Error sending message:', error)
    return NextResponse.json(
      { error: 'Failed to send message' },
      { status: 500 }
    )
  }
} 