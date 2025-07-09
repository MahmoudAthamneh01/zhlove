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

    // Check if user already bookmarked this post
    const existingBookmark = await prisma.userBookmark.findFirst({
      where: {
        userId: session.user.id,
        postId: postId
      }
    });

    if (existingBookmark) {
      // Remove bookmark
      await prisma.userBookmark.delete({
        where: {
          id: existingBookmark.id
        }
      });
      
      return NextResponse.json({ bookmarked: false, message: 'Bookmark removed' });
    } else {
      // Add bookmark
      await prisma.userBookmark.create({
        data: {
          userId: session.user.id,
          postId: postId,
          type: 'forum_post'
        }
      });
      
      return NextResponse.json({ bookmarked: true, message: 'Post bookmarked' });
    }

  } catch (error) {
    console.error('Bookmark post API error:', error);
    return NextResponse.json(
      { error: 'Failed to bookmark/unbookmark post' },
      { status: 500 }
    );
  }
} 