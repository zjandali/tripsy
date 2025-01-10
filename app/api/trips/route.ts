import { NextResponse } from 'next/server';
import { getServerSession } from 'next-auth';
import { prisma } from '@/lib/prisma';
import { authOptions } from '@/lib/auth';

export async function POST(request: Request) {
  const session = await getServerSession(authOptions);
  
  if (!session?.user?.id) {
    return new NextResponse('Unauthorized', { status: 401 });
  }

  const tripData = await request.json();

  const trip = await prisma.trip.create({
    data: {
      ...tripData,
      creatorId: session.user.id,
      participants: {
        connect: tripData.participants.map((id: string) => ({ id }))
      }
    }
  });

  return NextResponse.json(trip);
} 