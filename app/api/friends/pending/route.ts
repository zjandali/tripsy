import { NextResponse } from 'next/server';
import { getServerSession } from 'next-auth';
import { prisma } from '@/lib/prisma';
import { authOptions } from '@/lib/auth';

export async function GET() {
  const session = await getServerSession(authOptions);
  
  if (!session?.user?.id) {
    return new NextResponse('Unauthorized', { status: 401 });
  }

  const pendingRequests = await prisma.user.findMany({
    where: {
      sentFriendRequests: {
        some: {
          receiverId: session.user.id,
          status: 'PENDING'
        }
      }
    },
    include: {
      sentFriendRequests: {
        where: {
          receiverId: session.user.id,
          status: 'PENDING'
        }
      }
    }
  });

  return NextResponse.json(pendingRequests);
} 