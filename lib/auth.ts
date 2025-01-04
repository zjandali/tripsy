
import { prisma } from '@/lib/prisma';
import { PrismaAdapter } from "@next-auth/prisma-adapter"
import GoogleProvider from 'next-auth/providers/google';
import {type Session, User } from 'next-auth';

export const authOptions = {
    adapter: PrismaAdapter(prisma),
    providers: [
      GoogleProvider({
        clientId: process.env.GOOGLE_CLIENT_ID!,
        clientSecret: process.env.GOOGLE_CLIENT_SECRET!,
        authorization: {
          params: {
            prompt: "select_account",
            access_type: "offline",
            response_type: "code"
          }
        }
      }),
    ],
    callbacks: {
      async session({ session, user }: { session: Session; user: User }) {
        if (session?.user) {
          session.user.id = user.id;
        }
        return session;
      },
    },
    events: {
      async signOut({ session }: { session: Session | null }) {
        if (session?.user?.id) {
          await prisma.account.deleteMany({
            where: { userId: session.user.id },
          });
          await prisma.session.deleteMany({
            where: { userId: session.user.id },
          });
        }
      },
    },
    secret: process.env.NEXTAUTH_SECRET,
  };