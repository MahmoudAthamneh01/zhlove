import { NextRequest, NextResponse } from 'next/server';
import { getServerSession } from 'next-auth';
import { authOptions } from '@/lib/auth';
import { prisma } from '@/lib/prisma';

export async function POST(
  request: NextRequest,
  { params }: { params: { postId: string } }
) {
  try {
    const session = await getServerSession(authOptions);
    
    if (!session?.user) {
      return NextResponse.json({ error: 'Unauthorized' }, { status: 401 });
    }

    const { postId } = params;

    // Check if post exists
    const post = await prisma.forumPost.findUnique({
      where: { id: postId }
    });

    if (!post) {
      return NextResponse.json({ error: 'Post not found' }, { status: 404 });
    }

    // Check if user already liked this post
    const existingLike = await prisma.postLike.findUnique({
      where: {
        userId_postId: {
          userId: session.user.id,
          postId: postId
        }
      }
    });

    if (existingLike) {
      // Unlike the post
      await prisma.postLike.delete({
        where: {
          userId_postId: {
            userId: session.user.id,
            postId: postId
          }
        }
      });
      
      return NextResponse.json({ liked: false, message: 'Post unliked' });
    } else {
      // Like the post
      await prisma.postLike.create({
        data: {
          userId: session.user.id,
          postId: postId
        }
      });
      
      return NextResponse.json({ liked: true, message: 'Post liked' });
    }

  } catch (error) {
    console.error('Like post API error:', error);
    return NextResponse.json(
      { error: 'Failed to like/unlike post' },
      { status: 500 }
    );
  }
} 