'use client';

import { useEffect, useState } from 'react';
import { useSession } from 'next-auth/react';
import { useRouter } from 'next/navigation';

interface User {
  id: string;
  name: string;
  email: string;
  image: string;
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
                    {user.sentFriendRequests.length > 0 ? (
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
              ))}
            </div>
          )}
        </div>

        {pendingRequests.length > 0 && (
          <div className="mb-8">
            <h2 className="text-xl font-semibold mb-4 text-white">Pending Friend Requests</h2>
            <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-4">
              {pendingRequests.map((user) => (
                <div key={user.id} className="p-4 rounded-lg border border-white/20 text-white">
                  <div className="flex items-center justify-between">
                    <div>
                      <p className="font-semibold">{user.name}</p>
                      <p className="text-sm text-white/70">{user.email}</p>
                    </div>
                    <button
                      onClick={() => acceptFriendRequest(user.sentFriendRequests[0].id)}
                      className="px-3 py-1 rounded-full border border-white/20 hover:bg-white hover:text-black transition-colors"
                    >
                      Accept Request
                    </button>
                  </div>
                </div>
              ))}
            </div>
          </div>
        )}

        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
          {friends.map((friend) => (
            <div key={friend.id} className="p-4 rounded-lg border border-white/20 text-white">
              <div className="flex items-center justify-between">
                <div>
                  <p className="font-semibold">{friend.name}</p>
                  <p className="text-sm text-white/70">{friend.email}</p>
                </div>
                <button
                  onClick={() => removeFriend(friend.id)}
                  className="px-3 py-1 rounded-full border border-white/20 hover:bg-red-500 hover:border-red-500 hover:text-white transition-colors"
                >
                  Remove Friend
                </button>
              </div>
            </div>
          ))}
        </div>
      </div>
    </div>
  );
} 