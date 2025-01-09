'use client';
import AuthButton from '../components/AuthButton';
import { useSession } from 'next-auth/react';
import { useRouter } from 'next/navigation'
import { useEffect } from 'react';
import { Plane, Users, Calendar, MessageSquare, History, Plus } from 'lucide-react';
import Image from 'next/image';

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
    <div className="min-h-screen bg-gradient-to-b from-blue-600 to-blue-800 p-8">
      <div className="max-w-7xl mx-auto">
        <div className="flex justify-between items-center mb-8">
          <div className="flex items-center">
            <Plane className="h-8 w-8 text-white" />
            <h1 className="text-3xl font-bold text-white ml-2">Dashboard</h1>
          </div>
          <div className="flex items-center gap-4">
            <div className="flex items-center">
              <Image
                src="https://images.unsplash.com/photo-1539571696357-5a69c17a67c6"
                alt="Profile"
                width={40}
                height={40}
                className="rounded-full border-2 border-white"
              />
              <AuthButton />
            </div>
          </div>
        </div>
        
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
          <div 
            onClick={() => router.push('/trips/past')}
            className="group bg-white/10 backdrop-blur-lg p-6 rounded-xl border border-white/20 hover:bg-white/20 transition-all cursor-pointer"
          >
            <div className="bg-white/20 w-12 h-12 rounded-lg flex items-center justify-center mb-4 group-hover:bg-white/30 transition-colors">
              <History className="h-6 w-6 text-white" />
            </div>
            <h2 className="text-xl font-semibold mb-2 text-white">Past Trips</h2>
            <p className="text-white/80">View your travel history and memories</p>
          </div>
          
          <div 
            onClick={() => router.push('/friends')}
            className="group bg-white/10 backdrop-blur-lg p-6 rounded-xl border border-white/20 hover:bg-white/20 transition-all cursor-pointer"
          >
            <div className="bg-white/20 w-12 h-12 rounded-lg flex items-center justify-center mb-4 group-hover:bg-white/30 transition-colors">
              <Users className="h-6 w-6 text-white" />
            </div>
            <h2 className="text-xl font-semibold mb-2 text-white">Friends</h2>
            <p className="text-white/80">Connect with travel buddies</p>
          </div>
          
          <div 
            onClick={() => router.push('/trips/upcoming')}
            className="group bg-white/10 backdrop-blur-lg p-6 rounded-xl border border-white/20 hover:bg-white/20 transition-all cursor-pointer"
          >
            <div className="bg-white/20 w-12 h-12 rounded-lg flex items-center justify-center mb-4 group-hover:bg-white/30 transition-colors">
              <Calendar className="h-6 w-6 text-white" />
            </div>
            <h2 className="text-xl font-semibold mb-2 text-white">Upcoming Trips</h2>
            <p className="text-white/80">See your planned adventures</p>
          </div>

          <div 
            onClick={() => router.push('/trips/plan')}
            className="group bg-white/10 backdrop-blur-lg p-6 rounded-xl border border-white/20 hover:bg-white/20 transition-all cursor-pointer"
          >
            <div className="bg-white/20 w-12 h-12 rounded-lg flex items-center justify-center mb-4 group-hover:bg-white/30 transition-colors">
              <Plus className="h-6 w-6 text-white" />
            </div>
            <h2 className="text-xl font-semibold mb-2 text-white">Plan a Trip</h2>
            <p className="text-white/80">Start planning your next journey</p>
          </div>

          <div 
            onClick={() => router.push('/messages')}
            className="group bg-white/10 backdrop-blur-lg p-6 rounded-xl border border-white/20 hover:bg-white/20 transition-all cursor-pointer"
          >
            <div className="bg-white/20 w-12 h-12 rounded-lg flex items-center justify-center mb-4 group-hover:bg-white/30 transition-colors">
              <MessageSquare className="h-6 w-6 text-white" />
            </div>
            <h2 className="text-xl font-semibold mb-2 text-white">Messages</h2>
            <p className="text-white/80">Message your friends</p>
          </div>

          <div className="bg-white/10 backdrop-blur-lg p-6 rounded-xl border border-white/20">
            <h2 className="text-xl font-semibold mb-4 text-white">Quick Stats</h2>
            <div className="space-y-4">
              <div className="flex justify-between items-center">
                <span className="text-white/80">Upcoming Trips</span>
                <span className="text-white font-semibold">3</span>
              </div>
              <div className="flex justify-between items-center">
                <span className="text-white/80">Travel Friends</span>
                <span className="text-white font-semibold">12</span>
              </div>
              <div className="flex justify-between items-center">
                <span className="text-white/80">Countries Visited</span>
                <span className="text-white font-semibold">8</span>
              </div>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
} 