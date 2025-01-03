'use client';

import { signIn, signOut, useSession } from 'next-auth/react';
import { useRouter } from 'next/navigation';

export default function AuthButton() {
  const { data: session, status } = useSession();
  const router = useRouter();

  const handleSignIn = async () => {
    await signIn('google', { callbackUrl: '/dashboard' });
  };

  if (status === 'loading') {
    return (
      <div className="flex justify-center">
        <button className="rounded-full px-4 py-2 bg-gray-200 text-gray-400" disabled>
          Loading...
        </button>
      </div>
    );
  }

  if (session) {
    return (
      <div className="flex justify-center">
        <div className="flex items-center gap-4">
          <span className="text-sm text-white">Welcome, {session.user?.name}</span>
          <button
            onClick={() => signOut({ callbackUrl: '/' })}
            className="rounded-full border-2 border-solid border-white transition-colors flex items-center justify-center hover:bg-white hover:text-black px-4 py-2 text-white"
          >
            Sign Out
          </button>
        </div>
      </div>
    );
  }

  return (
    <div className="flex justify-center">
      <button
        onClick={handleSignIn}
        className="rounded-full border-2 border-solid border-white transition-colors flex items-center justify-center bg-white text-black hover:bg-white/90 px-4 py-2"
      >
        Sign In with Google
      </button>
    </div>
  );
} 