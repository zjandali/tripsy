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

  const friendRequest = await prisma.friendRequest.findUnique({
    where: { id: requestId },
  });

  if (!friendRequest || friendRequest.senderId !== session.user.id) {
    return new NextResponse('Friend request not found', { status: 404 });
  }

  await prisma.friendRequest.delete({
    where: { id: requestId },
  });

  return NextResponse.json({ success: true });
} 