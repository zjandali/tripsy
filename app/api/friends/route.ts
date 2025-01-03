import { NextResponse } from 'next/server';
import { getServerSession } from 'next-auth';
import { prisma } from '@/lib/prisma';
import { authOptions } from '../auth/[...nextauth]/route';

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

  const allFriends = [...(friends?.friends || []), ...(friends?.friendsOf || [])];
  
  return NextResponse.json(allFriends);
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