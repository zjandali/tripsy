import { NextResponse } from 'next/server';
import { getServerSession } from 'next-auth';
import { prisma } from '@/lib/prisma';
import { authOptions } from '@/lib/auth';

export async function POST(request: Request) {
  const session = await getServerSession(authOptions);
  
  if (!session?.user?.id) {
    return new NextResponse('Unauthorized', { status: 401 });
  }

  const { requestId } = await request.json();

  // Get the friend request
  const friendRequest = await prisma.friendRequest.findUnique({
    where: { id: requestId },
  });

  if (!friendRequest || friendRequest.receiverId !== session.user.id) {
    return new NextResponse('Friend request not found', { status: 404 });
  }

  // Create the friendship
  await prisma.$transaction([
    // Update friend request status
    prisma.friendRequest.update({
      where: { id: requestId },
      data: { status: 'ACCEPTED' },
    }),
    // Connect current user to sender
    prisma.user.update({
      where: { id: session.user.id },
      data: {
        friends: {
          connect: { id: friendRequest.senderId },
        },
      },
    }),
    // Connect sender to current user
    prisma.user.update({
      where: { id: friendRequest.senderId },
      data: {
        friends: {
          connect: { id: session.user.id },
        },
      },
    }),
  ]);

  return NextResponse.json({ success: true });
} 