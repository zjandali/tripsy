'use client';

import { useEffect, useState } from 'react';
import { useSession } from 'next-auth/react';
import { useRouter } from 'next/navigation';
import Image from 'next/image'

interface User {
  id: string;
  name: string;
  email: string;
  image: string;
  receivedFriendRequests: Array<{ id: string; status: string }>;
}

export default function FriendsPage() {
  const { data: session, status } = useSession();
  const router = useRouter();
  const [friends, setFriends] = useState<User[]>([]);
  const [searchQuery, setSearchQuery] = useState('');
  const [searchResults, setSearchResults] = useState<User[]>([]);

  useEffect(() => {
    if (status === 'unauthenticated') {
      router.push('/');
    }
  }, [status, router]);

  useEffect(() => {
    if (session?.user?.id) {
      fetchFriends();
    }
  }, [session]);

  const fetchFriends = async () => {
    const response = await fetch('/api/friends');
    const data = await response.json();
    setFriends(data);
  };

  const handleSearch = async (query: string) => {
    setSearchQuery(query);
    
    // Clear results if query doesn't match current results
    if (searchResults.length > 0 && !searchResults.some(user => 
      user.name?.toLowerCase().includes(query.toLowerCase()) || 
      user.email?.toLowerCase().includes(query.toLowerCase())
    )) {
      setSearchResults([]);
    }
    
    if (query.length < 3) {
      setSearchResults([]);
      return;
    }

    const response = await fetch(`/api/users/search?q=${query}`);
    const data = await response.json();
    setSearchResults(data);
  };

  const sendFriendRequest = async (friendId: string) => {
    try {
      const response = await fetch('/api/friends/request', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({ friendId }),
      });

      if (!response.ok) {
        const error = await response.text();
        throw new Error(error);
      }

      // Remove the user from search results after sending request
      setSearchResults(prevResults => 
        prevResults.filter(user => user.id !== friendId)
      );

      // Show success message (you can implement a toast notification here)
      alert('Friend request sent successfully!');
    } catch (error) {
      console.error('Error sending friend request:', error);
      alert(error instanceof Error ? error.message : 'Failed to send friend request');
    }
  };

  return (
    <div className="min-h-screen p-8">
      <div className="max-w-7xl mx-auto">
        <h1 className="text-2xl font-bold mb-8 text-white">Friends</h1>
        
        <div className="mb-8">
          <input
            type="text"
            placeholder="Search users..."
            value={searchQuery}
            onChange={(e) => handleSearch(e.target.value)}
            className="w-full p-2 rounded-lg border border-white/20 bg-transparent text-white"
          />
          
          {searchResults.length > 0 && (
            <div className="mt-4 grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-4">
              {searchResults.map((user) => (
                <div key={user.id} className="p-4 rounded-lg border border-white/20 text-white">
                  <div className="flex items-center justify-between">
                    <div>
                      <p className="font-semibold">{user.name}</p>
                      <p className="text-sm text-white/70">{user.email}</p>
                    </div>
                    <button
                      onClick={() => sendFriendRequest(user.id)}
                      disabled={user.receivedFriendRequests.length > 0}
                      className={`px-3 py-1 rounded-full border border-white/20 transition-colors ${
                        user.receivedFriendRequests.length > 0
                          ? 'bg-white/10 cursor-not-allowed'
                          : 'hover:bg-white hover:text-black'
                      }`}
                    >
                      {user.receivedFriendRequests.length > 0 ? 'Request Sent' : 'Add Friend'}
                    </button>
                  </div>
                </div>
              ))}
            </div>
          )}
        </div>

        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
          {friends.map((friend) => (
            <div key={friend.id} className="p-6 rounded-lg border border-white/20 text-white">
              <div className="flex items-center gap-4">
                {friend.image && (
                  <Image
                    src={friend.image}
                    alt={friend.name || ''}
                    className="w-12 h-12 rounded-full"
                    width={48}
                    height={48}
                  />
                )}
                <div>
                  <h3 className="font-semibold">{friend.name}</h3>
                  <p className="text-sm text-white/70">{friend.email}</p>
                </div>
              </div>
            </div>
          ))}
        </div>
      </div>
    </div>
  );
} 