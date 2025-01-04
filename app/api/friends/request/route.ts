import { NextResponse } from 'next/server';
import { getServerSession } from 'next-auth';
import { prisma } from '@/lib/prisma';
import { authOptions } from '@/lib/auth';

export async function POST(request: Request) {
  const session = await getServerSession(authOptions);
  
  if (!session?.user?.id) {
    return new NextResponse('Unauthorized', { status: 401 });
  }

  const { friendId } = await request.json();

  // Check if friend request already exists
  const existingRequest = await prisma.friendRequest.findUnique({
    where: {
      senderId_receiverId: {
        senderId: session.user.id,
        receiverId: friendId,
      },
    },
  });

  if (existingRequest) {
    return new NextResponse('Friend request already exists', { status: 400 });
  }

  // Check if they're already friends
  const existingFriendship = await prisma.user.findFirst({
    where: {
      id: session.user.id,
      friends: {
        some: {
          id: friendId
        }
      }
    }
  });

  if (existingFriendship) {
    return new NextResponse('Already friends', { status: 400 });
  }

  // Create friend request
  const friendRequest = await prisma.friendRequest.create({
    data: {
      senderId: session.user.id,
      receiverId: friendId,
    },
  });

  return NextResponse.json(friendRequest);
} 