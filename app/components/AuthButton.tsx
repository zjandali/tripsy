'use client';

import { signIn, signOut, useSession } from 'next-auth/react';

export default function AuthButton() {
  const { data: session, status } = useSession();

  const handleSignIn = async () => {
    await signIn('google', { callbackUrl: '/dashboard' });
  };

  const handleSignOut = async () => {
    if (typeof window !== 'undefined') {
      // Clear all storage
      window.localStorage.clear();
      window.sessionStorage.clear();
      
      // Clear all cookies
      document.cookie.split(';').forEach(cookie => {
        document.cookie = cookie
          .replace(/^ +/, '')
          .replace(/=.*/, `=;expires=${new Date().toUTCString()};path=/`);
      });
    }
    
    // Call federated signout first
    await fetch('/api/auth/federated-signout');
    
    // Then perform NextAuth signout
    await signOut({
      callbackUrl: '/',
      redirect: true,
    });
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
            onClick={handleSignOut}
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