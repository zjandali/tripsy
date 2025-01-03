'use client';

import Image from "next/image";
import AuthButton from './components/AuthButton';
import { useSession } from 'next-auth/react';
import { useRouter } from 'next/navigation';

export default function Home() {
  const { data: session } = useSession();
  const router = useRouter();

  return (
    <div className="min-h-screen flex items-center justify-center p-8 pb-20 sm:p-20 font-[family-name:var(--font-geist-sans)]">
      <div className="absolute top-4 right-4">
        <AuthButton />
      </div>
      <button
        onClick={() => router.push('/dashboard')}
        className="rounded-full border border-solid border-white/20 transition-colors flex items-center justify-center bg-white text-black hover:bg-white/90 px-4 py-2"
      >
        Go to Dashboard
      </button>
      {session && (
        <div className="absolute top-4 left-4">
         
        </div>
      )}
    </div>
  );
}
