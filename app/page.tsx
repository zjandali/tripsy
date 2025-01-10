'use client';

import AuthButton from '@/app/components/AuthButton';
import { useSession } from 'next-auth/react';
import { useRouter } from 'next/navigation';
import { Plane, Users, Calendar, MapPin, ArrowRight } from 'lucide-react';

export default function Home() {
  const { data: session } = useSession();
  const router = useRouter();

  return (
    <div className="min-h-screen bg-gradient-to-b from-blue-50 to-white">
      {/* Navigation */}
      <nav className="bg-white shadow-sm">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          <div className="flex justify-between h-16 items-center">
            <div className="flex items-center">
              <Plane className="h-8 w-8 text-blue-600" />
              <span className="ml-2 text-2xl font-bold text-blue-600">Tripsy</span>
            </div>
            <div className="hidden md:flex space-x-8">
              <a href="#" className="text-gray-600 hover:text-blue-600">How it works</a>
              <a href="#" className="text-gray-600 hover:text-blue-600">Features</a>
              <a href="#" className="text-gray-600 hover:text-blue-600">Pricing</a>
            </div>
            <div className="flex items-center space-x-4">
              <AuthButton />
              {session && (
                <button
                  onClick={() => router.push('/dashboard')}
                  className="bg-blue-600 text-white px-4 py-2 rounded-lg hover:bg-blue-700"
                >
                  Dashboard
                </button>
              )}
            </div>
          </div>
        </div>
      </nav>

      {/* Hero Section */}
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 pt-16 pb-24">
        <div className="text-center">
          <h1 className="text-5xl font-bold text-gray-900 mb-6">
            Plan Amazing Trips with Friends,
            <span className="text-blue-600"> Together</span>
          </h1>
          <p className="text-xl text-gray-600 mb-8 max-w-2xl mx-auto">
            Make group travel planning easy and fun. Collaborate on itineraries, split costs,
            and create unforgettable memories with Tripsy, Powered by AI.
          </p>
          <button className="bg-blue-600 text-white px-8 py-4 rounded-lg text-lg font-semibold hover:bg-blue-700 transition-colors flex items-center mx-auto">
            Start Planning Your Trip
            <ArrowRight className="ml-2 h-5 w-5" />
          </button>
        </div>

        {/* Feature Cards */}
        <div className="grid md:grid-cols-3 gap-8 mt-20">
          <div className="bg-white p-8 rounded-xl shadow-sm hover:shadow-md transition-shadow">
            <div className="bg-blue-100 w-12 h-12 rounded-lg flex items-center justify-center mb-4">
              <Users className="h-6 w-6 text-blue-600" />
            </div>
            <h3 className="text-xl font-semibold mb-2">Collaborative Planning</h3>
            <p className="text-gray-600">Invite friends, vote on destinations, and make decisions together.</p>
          </div>

          <div className="bg-white p-8 rounded-xl shadow-sm hover:shadow-md transition-shadow">
            <div className="bg-blue-100 w-12 h-12 rounded-lg flex items-center justify-center mb-4">
              <Calendar className="h-6 w-6 text-blue-600" />
            </div>
            <h3 className="text-xl font-semibold mb-2">Smart Scheduling</h3>
            <p className="text-gray-600">Find the perfect dates that work for everyone in your group.</p>
          </div>

          <div className="bg-white p-8 rounded-xl shadow-sm hover:shadow-md transition-shadow">
            <div className="bg-blue-100 w-12 h-12 rounded-lg flex items-center justify-center mb-4">
              <MapPin className="h-6 w-6 text-blue-600" />
            </div>
            <h3 className="text-xl font-semibold mb-2">Itinerary Builder</h3>
            <p className="text-gray-600">Create and share detailed travel plans with your group.</p>
          </div>
        </div>
      </div>
    </div>
  );
}