import { NextApiRequest, NextApiResponse } from 'next';
import { getServerSession } from 'next-auth';
import { prisma } from '@/lib/prisma';
import { authOptions } from '@/lib/auth';

export default async function handler(req: NextApiRequest, res: NextApiResponse) {
  const session = await getServerSession(authOptions);

  if (session?.user?.id) {
    // Delete all accounts and sessions for the user
    await prisma.account.deleteMany({
      where: { userId: session.user.id },
    });
    await prisma.session.deleteMany({
      where: { userId: session.user.id },
    });
    
    // Clear cookies
    res.setHeader('Set-Cookie', [
      'next-auth.session-token=; Path=/; Expires=Thu, 01 Jan 1970 00:00:00 GMT',
      'next-auth.callback-url=; Path=/; Expires=Thu, 01 Jan 1970 00:00:00 GMT',
      'next-auth.csrf-token=; Path=/; Expires=Thu, 01 Jan 1970 00:00:00 GMT',
      '__Secure-next-auth.session-token=; Path=/; Expires=Thu, 01 Jan 1970 00:00:00 GMT',
    ]);
  }

  res.redirect('/');
}
