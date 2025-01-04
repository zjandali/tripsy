import { NextResponse } from 'next/server';
import { getServerSession } from 'next-auth';
import { prisma } from '@/lib/prisma';
import { authOptions } from '@/lib/auth';

export async function GET() {
  const session = await getServerSession(authOptions);
  
  if (!session?.user?.id) {
    return new NextResponse('Unauthorized', { status: 401 });
  }

  const friends = await prisma.user.findUnique({
    where: { id: session.user.id },
    include: {
      friends: true,
      friendsOf: true,
    },
  });

  // Remove duplicates by creating a Map with user IDs as keys
  const uniqueFriends = new Map();
  [...(friends?.friends || []), ...(friends?.friendsOf || [])].forEach(friend => {
    if (!uniqueFriends.has(friend.id)) {
      uniqueFriends.set(friend.id, friend);
    }
  });
  
  return NextResponse.json(Array.from(uniqueFriends.values()));
}

export async function POST(request: Request) {
  const session = await getServerSession(authOptions);
  
  if (!session?.user?.id) {
    return new NextResponse('Unauthorized', { status: 401 });
  }

  const { friendId } = await request.json();

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

  const friendRequest = await prisma.friendRequest.create({
    data: {
      senderId: session.user.id,
      receiverId: friendId,
    },
  });

  return NextResponse.json(friendRequest);
} 