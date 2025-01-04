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

  await prisma.user.update({
    where: { id: session.user.id },
    data: {
      friends: {
        disconnect: { id: friendId },
      },
      friendsOf: {
        disconnect: { id: friendId },
      },
    },
  });

  return NextResponse.json({ success: true });
} 