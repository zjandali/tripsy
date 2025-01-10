'use client';

import { Calendar,  Plane, Hotel, Camera, Utensils, CreditCard, Search, X } from 'lucide-react';
import { useState, useEffect } from 'react';
import { useSession } from 'next-auth/react';
import { useRouter } from 'next/navigation';

interface TripDetails {
  id?: string;
  name: string;
  startDate: string;
  endDate: string;
  selectedDestination?: Destination;
  participants: string[];
  budget?: number;
  status: 'draft' | 'active' | 'completed';
}

interface Destination {
  id: number;
  name: string;
  image: string;
  description: string;
}

function App() {
  const { status } = useSession();
  const router = useRouter();
  const [selectedFriends, setSelectedFriends] = useState<string[]>([]);
  const [searchQuery, setSearchQuery] = useState('');
  const [tripDetails, setTripDetails] = useState<TripDetails>({
    name: '',
    startDate: '',
    endDate: '',
    participants: [],
    status: 'draft'
  });
  const [budget, setBudget] = useState<string>('');

  useEffect(() => {
    if (status === 'unauthenticated') {
      router.push('/');
    }
  }, [status, router]);

  const handleTripNameChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    setTripDetails(prev => ({
      ...prev,
      name: e.target.value
    }));
  };

  const handleDateChange = (type: 'start' | 'end', value: string) => {
    setTripDetails(prev => ({
      ...prev,
      [type === 'start' ? 'startDate' : 'endDate']: value
    }));
  };

  const handleBudgetChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    const value = e.target.value;
    setBudget(value);
    setTripDetails(prev => ({
      ...prev,
      budget: parseFloat(value) || 0
    }));
  };

  const saveDraft = async () => {
    try {
      const response = await fetch('/api/trips', {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
        },
        body: JSON.stringify({
          ...tripDetails,
          participants: selectedFriends,
          status: 'draft'
        }),
      });

      if (!response.ok) {
        throw new Error('Failed to save draft');
      }

      router.push('/dashboard');
    } catch (error) {
      console.error('Error saving draft:', error);
      // Add error handling UI here
    }
  };

  const createTrip = async () => {
    try {
      const response = await fetch('/api/trips', {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
        },
        body: JSON.stringify({
          ...tripDetails,
          participants: selectedFriends,
          status: 'active'
        }),
      });

      if (!response.ok) {
        throw new Error('Failed to create trip');
      }

      router.push('/dashboard');
    } catch (error) {
      console.error('Error creating trip:', error);
      // Add error handling UI here
    }
  };

  const friends = [
    {
      id: 1,
      name: 'Sarah Wilson',
      image: 'https://images.unsplash.com/photo-1494790108377-be9c29b29330?auto=format&fit=crop&w=800&q=80',
    },
    {
      id: 2,
      name: 'Michael Chen',
      image: 'https://images.unsplash.com/photo-1507003211169-0a1dd7228f2d?auto=format&fit=crop&w=800&q=80',
    },
    {
      id: 3,
      name: 'Emma Thompson',
      image: 'https://images.unsplash.com/photo-1438761681033-6461ffad8d80?auto=format&fit=crop&w=800&q=80',
    }
  ];

  const destinations = [
    {
      id: 1,
      name: 'Paris, France',
      image: 'https://images.unsplash.com/photo-1502602898657-3e91760cbb34?auto=format&fit=crop&w=800&q=80',
      description: 'The City of Light awaits with its iconic landmarks and romantic atmosphere.'
    },
    {
      id: 2,
      name: 'Tokyo, Japan',
      image: 'https://images.unsplash.com/photo-1503899036084-c55cdd92da26?auto=format&fit=crop&w=800&q=80',
      description: 'Experience the perfect blend of tradition and modern technology.'
    },
    {
      id: 3,
      name: 'Santorini, Greece',
      image: 'https://images.unsplash.com/photo-1613395877344-13d4a8e0d49e?auto=format&fit=crop&w=800&q=80',
      description: 'Stunning sunsets and white-washed buildings overlooking the Aegean Sea.'
    }
  ];

  const toggleFriend = (name: string) => {
    setSelectedFriends(prev => 
      prev.includes(name) 
        ? prev.filter(f => f !== name)
        : [...prev, name]
    );
  };

  return (
    <div className="min-h-screen bg-gradient-to-b from-blue-600 to-blue-800">
      <div className="max-w-7xl mx-auto p-8">
        <div className="space-y-8">
          {/* Header */}
          <div className="text-white">
            <h1 className="text-4xl font-bold mb-2">Plan Your Trip</h1>
            <p className="text-white/70">Create unforgettable memories with friends</p>
          </div>

          {/* Main Planning Section */}
          <div className="grid grid-cols-1 lg:grid-cols-3 gap-8">
            {/* Left Column - Trip Details */}
            <div className="lg:col-span-2 space-y-6">
              {/* Basic Info Card */}
              <div className="bg-white/10 backdrop-blur-lg rounded-xl border border-white/20 p-6">
                <h2 className="text-xl font-semibold text-white mb-4">Trip Details</h2>
                <div className="space-y-4">
                  <div>
                    <label className="block text-white/70 mb-2">Trip Name</label>
                    <input
                      type="text"
                      placeholder="e.g., Summer Adventure 2024"
                      value={tripDetails.name}
                      onChange={handleTripNameChange}
                      className="w-full bg-white/10 border border-white/20 rounded-lg px-4 py-2 text-white placeholder-white/50 focus:outline-none focus:ring-2 focus:ring-white/30"
                    />
                  </div>
                  <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                    <div>
                      <label className="block text-white/70 mb-2">Start Date</label>
                      <div className="relative">
                        <Calendar className="absolute left-3 top-2.5 h-5 w-5 text-white/50" />
                        <input
                          type="date"
                          value={tripDetails.startDate}
                          onChange={(e) => handleDateChange('start', e.target.value)}
                          className="w-full pl-10 bg-white/10 border border-white/20 rounded-lg px-4 py-2 text-white focus:outline-none focus:ring-2 focus:ring-white/30"
                        />
                      </div>
                    </div>
                    <div>
                      <label className="block text-white/70 mb-2">End Date</label>
                      <div className="relative">
                        <Calendar className="absolute left-3 top-2.5 h-5 w-5 text-white/50" />
                        <input
                          type="date"
                          className="w-full pl-10 bg-white/10 border border-white/20 rounded-lg px-4 py-2 text-white focus:outline-none focus:ring-2 focus:ring-white/30"
                        />
                      </div>
                    </div>
                  </div>
                </div>
              </div>

              {/* Destination Inspiration */}
              <div className="bg-white/10 backdrop-blur-lg rounded-xl border border-white/20 p-6">
                <h2 className="text-xl font-semibold text-white mb-4">Popular Destinations</h2>
                <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-4">
                  {destinations.map(destination => (
                    <div
                      key={destination.id}
                      className="relative group cursor-pointer overflow-hidden rounded-lg"
                    >
                      <img
                        src={destination.image}
                        alt={destination.name}
                        className="w-full h-48 object-cover transition-transform group-hover:scale-110"
                      />
                      <div className="absolute inset-0 bg-gradient-to-t from-black/70 to-transparent flex flex-col justify-end p-4">
                        <h3 className="text-white font-semibold">{destination.name}</h3>
                        <p className="text-white/70 text-sm">{destination.description}</p>
                      </div>
                    </div>
                  ))}
                </div>
              </div>

              {/* Activities Section */}
              <div className="bg-white/10 backdrop-blur-lg rounded-xl border border-white/20 p-6">
                <h2 className="text-xl font-semibold text-white mb-4">What to Plan</h2>
                <div className="grid grid-cols-2 md:grid-cols-4 gap-4">
                  <button className="flex flex-col items-center p-4 bg-white/10 rounded-lg hover:bg-white/20 transition-colors">
                    <Plane className="h-6 w-6 text-white mb-2" />
                    <span className="text-white">Flights</span>
                  </button>
                  <button className="flex flex-col items-center p-4 bg-white/10 rounded-lg hover:bg-white/20 transition-colors">
                    <Hotel className="h-6 w-6 text-white mb-2" />
                    <span className="text-white">Hotels</span>
                  </button>
                  <button className="flex flex-col items-center p-4 bg-white/10 rounded-lg hover:bg-white/20 transition-colors">
                    <Camera className="h-6 w-6 text-white mb-2" />
                    <span className="text-white">Activities</span>
                  </button>
                  <button className="flex flex-col items-center p-4 bg-white/10 rounded-lg hover:bg-white/20 transition-colors">
                    <Utensils className="h-6 w-6 text-white mb-2" />
                    <span className="text-white">Restaurants</span>
                  </button>
                </div>
              </div>
            </div>

            {/* Right Column - Travel Companions */}
            <div className="space-y-6">
              {/* Friends Selection */}
              <div className="bg-white/10 backdrop-blur-lg rounded-xl border border-white/20 p-6">
                <h2 className="text-xl font-semibold text-white mb-4">Travel Companions</h2>
                <div className="space-y-4">
                  <div className="relative">
                    <Search className="absolute left-3 top-2.5 h-5 w-5 text-white/50" />
                    <input
                      type="text"
                      placeholder="Search friends..."
                      value={searchQuery}
                      onChange={(e) => setSearchQuery(e.target.value)}
                      className="w-full pl-10 bg-white/10 border border-white/20 rounded-lg px-4 py-2 text-white placeholder-white/50 focus:outline-none focus:ring-2 focus:ring-white/30"
                    />
                  </div>
                  
                  {/* Selected Friends */}
                  {selectedFriends.length > 0 && (
                    <div className="flex flex-wrap gap-2 p-2 bg-white/5 rounded-lg">
                      {selectedFriends.map(friend => (
                        <div
                          key={friend}
                          className="flex items-center gap-1 bg-white/10 rounded-full px-3 py-1"
                        >
                          <span className="text-white text-sm">{friend}</span>
                          <button
                            onClick={() => toggleFriend(friend)}
                            className="text-white/70 hover:text-white"
                          >
                            <X className="h-4 w-4" />
                          </button>
                        </div>
                      ))}
                    </div>
                  )}

                  {/* Friends List */}
                  <div className="space-y-2">
                    {friends.map(friend => (
                      <div
                        key={friend.id}
                        onClick={() => toggleFriend(friend.name)}
                        className={`flex items-center p-2 rounded-lg cursor-pointer transition-colors ${
                          selectedFriends.includes(friend.name)
                            ? 'bg-white/20'
                            : 'hover:bg-white/10'
                        }`}
                      >
                        <img
                          src={friend.image}
                          alt={friend.name}
                          className="w-10 h-10 rounded-full"
                        />
                        <span className="ml-3 text-white">{friend.name}</span>
                      </div>
                    ))}
                  </div>
                </div>
              </div>

              {/* Budget Planner */}
              <div className="bg-white/10 backdrop-blur-lg rounded-xl border border-white/20 p-6">
                <h2 className="text-xl font-semibold text-white mb-4">Budget Planner</h2>
                <div className="space-y-4">
                  <div>
                    <label className="block text-white/70 mb-2">Total Budget</label>
                    <div className="relative">
                      <CreditCard className="absolute left-3 top-2.5 h-5 w-5 text-white/50" />
                      <input
                        type="number"
                        placeholder="Enter amount"
                        value={budget}
                        onChange={handleBudgetChange}
                        className="w-full pl-10 bg-white/10 border border-white/20 rounded-lg px-4 py-2 text-white placeholder-white/50 focus:outline-none focus:ring-2 focus:ring-white/30"
                      />
                    </div>
                  </div>
                  <button className="w-full bg-white/20 hover:bg-white/30 text-white rounded-lg px-4 py-2 transition-colors">
                    Calculate Split
                  </button>
                </div>
              </div>
            </div>
          </div>

          {/* Action Buttons */}
          <div className="flex justify-end gap-4">
            <button 
              onClick={saveDraft}
              className="px-6 py-2 bg-white/10 hover:bg-white/20 text-white rounded-lg transition-colors"
            >
              Save Draft
            </button>
            <button 
              onClick={createTrip}
              className="px-6 py-2 bg-blue-500 hover:bg-blue-600 text-white rounded-lg transition-colors"
            >
              Create Trip
            </button>
          </div>
        </div>
      </div>
    </div>
  );
}

export default App;