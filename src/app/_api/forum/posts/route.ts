import { NextRequest, NextResponse } from 'next/server'
import { getServerSession } from 'next-auth'
import { authOptions } from '@/lib/auth'
import { prisma } from '@/lib/prisma'

export async function GET(request: NextRequest) {
  try {
    const { searchParams } = new URL(request.url)
    const category = searchParams.get('category') || 'all'
    const sort = searchParams.get('sort') || 'recent'
    const search = searchParams.get('search') || ''
    const language = searchParams.get('language') || 'ar'
    const page = parseInt(searchParams.get('page') || '1')
    const limit = parseInt(searchParams.get('limit') || '10')
    const offset = (page - 1) * limit

    const where: any = {}
    
    if (category !== 'all') {
      where.category = category
    }
    
    if (search) {
      where.OR = [
        { title: { contains: search, mode: 'insensitive' } },
        { content: { contains: search, mode: 'insensitive' } }
      ]
    }

    let orderBy: any = {}
    switch (sort) {
      case 'popular':
        orderBy = [{ views: 'desc' }, { createdAt: 'desc' }]
        break
      case 'liked':
        orderBy = [
          { likes: { _count: 'desc' } },
          { createdAt: 'desc' }
        ]
        break
      case 'replied':
        orderBy = [
          { comments: { _count: 'desc' } },
          { createdAt: 'desc' }
        ]
        break
      default:
        orderBy = [{ isPinned: 'desc' }, { createdAt: 'desc' }]
    }

    const posts = await prisma.forumPost.findMany({
      where,
      include: {
        author: {
          select: {
            id: true,
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
        },
        likes: true // We'll filter this on the client side for current user
      },
      orderBy,
      skip: offset,
      take: limit
    })

    const total = await prisma.forumPost.count({ where })

    const formattedPosts = posts.map(post => ({
      id: post.id,
      title: post.title,
      content: post.content,
      author: post.author,
      createdAt: post.createdAt.toISOString(),
      updatedAt: post.updatedAt.toISOString(),
      replies: post._count.comments,
      likes: post._count.likes,
      views: post.views,
      isPinned: post.isPinned,
      tags: JSON.parse(post.tags || '[]'),
      category: post.category,
      isLiked: false, // Will be determined by user session
      isBookmarked: false // Will be determined by user session
    }))

    return NextResponse.json({
      posts: formattedPosts,
      pagination: {
        page,
        limit,
        total,
        totalPages: Math.ceil(total / limit)
      }
    })
  } catch (error) {
    console.error('Forum posts API error:', error)
    return NextResponse.json(
      { error: 'Failed to fetch posts' },
      { status: 500 }
    )
  }
}

export async function POST(request: NextRequest) {
  try {
    const session = await getServerSession(authOptions)
    
    if (!session?.user) {
      return NextResponse.json({ error: 'Unauthorized' }, { status: 401 })
    }

    const { title, content, category, tags, language } = await request.json()

    if (!title?.trim() || !content?.trim()) {
      return NextResponse.json(
        { error: 'Title and content are required' },
        { status: 400 }
      )
    }

    const post = await prisma.forumPost.create({
      data: {
        title: title.trim(),
        content: content.trim(),
        category: category || 'discussion',
        tags: JSON.stringify(tags || []),
        authorId: session.user.id,
        views: 0,
        isPinned: false
      },
      include: {
        author: {
          select: {
            id: true,
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

    const formattedPost = {
      id: post.id,
      title: post.title,
      content: post.content,
      author: post.author,
      createdAt: post.createdAt.toISOString(),
      updatedAt: post.updatedAt.toISOString(),
      replies: post._count.comments,
      likes: post._count.likes,
      views: post.views,
      isPinned: post.isPinned,
      tags: JSON.parse(post.tags || '[]'),
      category: post.category,
      isLiked: false,
      isBookmarked: false
    }

    return NextResponse.json({ post: formattedPost }, { status: 201 })
  } catch (error) {
    console.error('Create post API error:', error)
    return NextResponse.json(
      { error: 'Failed to create post' },
      { status: 500 }
    )
  }
} 