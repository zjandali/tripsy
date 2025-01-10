'use client';

import { useEffect, useState } from 'react';
import { useSession } from 'next-auth/react';
import { useRouter } from 'next/navigation';
import { Users, Search, UserMinus, MessageSquare, MapPin } from 'lucide-react';

interface User {
  id: string;
  name: string;
  email: string;
  image: string;
  location?: string;
  trips?: number;
  mutualFriends?: number;
  receivedFriendRequests: Array<{ id: string; status: string }>;
  sentFriendRequests: Array<{ id: string; status: string }>;
}

export default function FriendsPage() {
  const { data: session, status } = useSession();
  const router = useRouter();
  const [friends, setFriends] = useState<User[]>([]);
  const [searchQuery, setSearchQuery] = useState('');
  const [searchResults, setSearchResults] = useState<User[]>([]);
  const [pendingRequests, setPendingRequests] = useState<User[]>([]);

  useEffect(() => {
    if (status === 'unauthenticated') {
      router.push('/');
    }
  }, [status, router]);

  useEffect(() => {
    if (session?.user?.id) {
      fetchFriends();
      fetchPendingRequests();
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

      // Update the user's status in search results instead of removing them
      setSearchResults(prevResults =>
        prevResults.map(user => {
          if (user.id === friendId) {
            return {
              ...user,
              receivedFriendRequests: [{ id: 'temp', status: 'PENDING' }]
            };
          }
          return user;
        })
      );

      // Show success message (you can implement a toast notification here)
      alert('Friend request sent successfully!');
    } catch (error) {
      console.error('Error sending friend request:', error);
      alert(error instanceof Error ? error.message : 'Failed to send friend request');
    }
  };

  const fetchPendingRequests = async () => {
    const response = await fetch('/api/friends/pending');
    const data = await response.json();
    setPendingRequests(data);
  };

  const acceptFriendRequest = async (requestId: string) => {
    try {
      const response = await fetch('/api/friends/accept', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({ requestId }),
      });

      if (!response.ok) {
        throw new Error('Failed to accept friend request');
      }

      // Refresh the friends and pending requests lists
      fetchFriends();
      fetchPendingRequests();
    } catch (error) {
      console.error('Error accepting friend request:', error);
      alert('Failed to accept friend request');
    }
  };

  const cancelFriendRequest = async (requestId: string) => {
    try {
      const response = await fetch('/api/friends/cancel', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({ requestId }),
      });

      if (!response.ok) {
        throw new Error('Failed to cancel friend request');
      }

      // Update the search results to show "Add Friend" again
      setSearchResults(prevResults =>
        prevResults.map(user => {
          if (user.receivedFriendRequests.some(req => req.id === requestId)) {
            return {
              ...user,
              receivedFriendRequests: []
            };
          }
          return user;
        })
      );
    } catch (error) {
      console.error('Error canceling friend request:', error);
      alert('Failed to cancel friend request');
    }
  };

  const removeFriend = async (friendId: string) => {
    try {
      const response = await fetch('/api/friends/remove', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({ friendId }),
      });

      if (!response.ok) {
        throw new Error('Failed to remove friend');
      }

      // Update the friends list
      setFriends(prevFriends => 
        prevFriends.filter(friend => friend.id !== friendId)
      );
    } catch (error) {
      console.error('Error removing friend:', error);
      alert('Failed to remove friend');
    }
  };

  return (
    <div className="min-h-screen bg-gradient-to-b from-blue-600 to-blue-800 p-8">
      <div className="max-w-7xl mx-auto">
        <div className="flex items-center justify-between mb-8">
          <div className="flex items-center">
            <Users className="h-8 w-8 text-white" />
            <h1 className="text-3xl font-bold text-white ml-2">Friends</h1>
          </div>
          <div className="relative">
            <input
              type="text"
              placeholder="Search friends..."
              value={searchQuery}
              onChange={(e) => handleSearch(e.target.value)}
              className="pl-10 pr-4 py-2 rounded-lg bg-white/10 backdrop-blur-lg border border-white/20 text-white placeholder-white/50 focus:outline-none focus:ring-2 focus:ring-white/30 w-64"
            />
            <Search className="absolute left-3 top-2.5 h-5 w-5 text-white/50" />
          </div>
        </div>

        {pendingRequests.length > 0 && (
          <div className="mb-8">
            <h2 className="text-xl font-semibold text-white mb-4">Friend Requests</h2>
            <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
              {pendingRequests.map((user) => (
                <div key={user.id} className="bg-white/10 backdrop-blur-lg p-6 rounded-xl border border-white/20">
                  <div className="flex items-center mb-4">
                    <img src={user.image} alt={user.name} className="w-12 h-12 rounded-full" />
                    <div className="ml-4">
                      <h3 className="text-white font-semibold">{user.name}</h3>
                      <p className="text-white/70 text-sm">{user.email}</p>
                    </div>
                  </div>
                  <div className="flex gap-2">
                    <button
                      onClick={() => acceptFriendRequest(user.sentFriendRequests[0].id)}
                      className="flex-1 bg-white/20 hover:bg-white/30 text-white py-2 rounded-lg transition-colors"
                    >
                      Accept
                    </button>
                    <button
                      onClick={() => cancelFriendRequest(user.sentFriendRequests[0].id)}
                      className="flex-1 bg-white/10 hover:bg-white/20 text-white py-2 rounded-lg transition-colors"
                    >
                      Decline
                    </button>
                  </div>
                </div>
              ))}
            </div>
          </div>
        )}

        <div>
          <div className="mb-8">
            {searchResults.length > 0 && (
              <div className="mt-4 grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-4">
                {searchResults.map((user) => {
                  const isAlreadyFriend = friends.some(friend => friend.id === user.id);
                  
                  return (
                    <div key={user.id} className="p-4 rounded-lg border border-white/20 text-white">
                      <div className="flex items-center justify-between">
                        <div>
                          <p className="font-semibold">{user.name}</p>
                          <p className="text-sm text-white/70">{user.email}</p>
                        </div>
                        {isAlreadyFriend ? (
                          <span className="text-sm text-white/50">Already Friends</span>
                        ) : user.sentFriendRequests.length > 0 ? (
                          <button
                            onClick={() => acceptFriendRequest(user.sentFriendRequests[0].id)}
                            className="px-3 py-1 rounded-full border border-white/20 hover:bg-white hover:text-black transition-colors"
                          >
                            Accept Request
                          </button>
                        ) : user.receivedFriendRequests.length > 0 ? (
                          <button
                            onClick={() => cancelFriendRequest(user.receivedFriendRequests[0].id)}
                            className="px-3 py-1 rounded-full border border-white/20 hover:bg-red-500 hover:border-red-500 hover:text-white transition-colors"
                          >
                            Cancel Request
                          </button>
                        ) : (
                          <button
                            onClick={() => sendFriendRequest(user.id)}
                            className="px-3 py-1 rounded-full border border-white/20 hover:bg-white hover:text-black transition-colors"
                          >
                            Add Friend
                          </button>
                        )}
                      </div>
                    </div>
                  );
                })}
              </div>
            )}
          </div>
        </div>
        <div className="mb-8">
          <h2 className="text-xl font-semibold text-white mb-4">Your Friends</h2>
          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
            {friends.map((friend) => (
              <div key={friend.id} className="group bg-white/10 backdrop-blur-lg p-6 rounded-xl border border-white/20 hover:bg-white/20 transition-all">
                <div className="flex items-center mb-4">
                  <img src={friend.image} alt={friend.name} className="w-12 h-12 rounded-full" />
                  <div className="ml-4">
                    <h3 className="text-white font-semibold">{friend.name}</h3>
                    {friend.location && (
                      <div className="flex items-center text-white/70 text-sm">
                        <MapPin className="h-4 w-4 mr-1" />
                        {friend.location}
                      </div>
                    )}
                  </div>
                </div>
                <div className="flex gap-2">
                  <button className="flex-1 bg-white/20 hover:bg-white/30 text-white py-2 rounded-lg transition-colors flex items-center justify-center">
                    <MessageSquare className="h-4 w-4 mr-2" />
                    Message
                  </button>
                  <button
                    onClick={() => removeFriend(friend.id)}
                    className="flex-1 bg-white/10 hover:bg-white/20 text-white py-2 rounded-lg transition-colors flex items-center justify-center"
                  >
                    <UserMinus className="h-4 w-4 mr-2" />
                    Unfriend
                  </button>
                </div>
              </div>
            ))}
          </div>
        </div>
      </div>
    </div>
  );
} 