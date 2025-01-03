'use client';
import AuthButton from '../components/AuthButton';
import { useSession } from 'next-auth/react';
import { useRouter } from 'next/navigation'
import { useEffect } from 'react';

export default function Dashboard() {
  const { data: session, status } = useSession();
  const router = useRouter();

  useEffect(() => {
    if (status === 'unauthenticated') {
      router.push('/');
    }
  }, [status, router]);

  if (status === 'loading') {
    return (
      <div className="flex justify-center items-center min-h-screen">
        <div className="text-lg">Loading...</div>
      </div>
    );
  }

  if (!session) {
    return null;
  }

  return (
    <div className="min-h-screen p-8">
      <div className="max-w-7xl mx-auto">
        <div className="flex justify-between items-center mb-8 text-white">
          <h1 className="text-2xl font-bold">Dashboard</h1>
          <div className="flex items-center gap-4">
            <div className="absolute top-4 right-4">
            <AuthButton />
            </div>
          </div>
        </div>
        
        {/* Add your dashboard content here */}
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
          <div className="p-6 rounded-lg border border-solid border-black/[.08] dark:border-white/[.145] text-white">
            <h2 className="text-xl font-semibold mb-4">Past Trips</h2>
            <p>Your dashboard content goes here</p>
          </div>
          
          <div className="p-6 rounded-lg border border-solid border-black/[.08] dark:border-white/[.145] text-white">
            <h2 className="text-xl font-semibold mb-4">Friends</h2>
            <p>Your activity content goes here</p>
          </div>
          
          <div className="p-6 rounded-lg border border-solid border-black/[.08] dark:border-white/[.145] text-white">
            <h2 className="text-xl font-semibold mb-4">Upcoming Trips</h2>
            <p>Your events content goes here</p>
          </div>

          
          <div className="p-6 rounded-lg border border-solid border-black/[.08] dark:border-white/[.145] text-white">
            <h2 className="text-xl font-semibold mb-4">Plan a Trip</h2>
            <p>Your events content goes here</p>
          </div>
        </div>
      </div>
    </div>
  );
} 