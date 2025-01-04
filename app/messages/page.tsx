'use client';

import { useEffect, useState, useRef } from 'react';
import { useSession } from 'next-auth/react';
import { useRouter } from 'next/navigation';

interface Message {
  id: string;
  content: string;
  senderId: string;
  receiverId: string;
  createdAt: string;
  read: boolean;
}

interface Friend {
  id: string;
  name: string;
  email: string;
  image: string;
}

export default function MessagesPage() {
  const { data: session, status } = useSession();
  const router = useRouter();
  const [friends, setFriends] = useState<Friend[]>([]);
  const [selectedFriend, setSelectedFriend] = useState<Friend | null>(null);
  const [messages, setMessages] = useState<Message[]>([]);
  const [newMessage, setNewMessage] = useState('');
  const messagesEndRef = useRef<HTMLDivElement>(null);

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

  useEffect(() => {
    if (selectedFriend) {
      fetchMessages(selectedFriend.id);
      const interval = setInterval(() => fetchMessages(selectedFriend.id), 3000);
      return () => clearInterval(interval);
    }
  }, [selectedFriend]);

  useEffect(() => {
    messagesEndRef.current?.scrollIntoView({ behavior: 'smooth' });
  }, [messages]);

  const fetchFriends = async () => {
    const response = await fetch('/api/friends');
    const data = await response.json();
    setFriends(data);
  };

  const fetchMessages = async (friendId: string) => {
    const response = await fetch(`/api/messages?friendId=${friendId}`);
    const data = await response.json();
    setMessages(data);
  };

  const sendMessage = async (e: React.FormEvent) => {
    e.preventDefault();
    if (!selectedFriend || !newMessage.trim()) return;

    try {
      const response = await fetch('/api/messages', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({
          content: newMessage,
          receiverId: selectedFriend.id,
        }),
      });

      if (!response.ok) throw new Error('Failed to send message');

      const message = await response.json();
      setMessages(prev => [...prev, message]);
      setNewMessage('');
    } catch (error) {
      console.error('Error sending message:', error);
      alert('Failed to send message');
    }
  };

  return (
    <div className="min-h-screen p-8">
      <div className="max-w-7xl mx-auto">
        <h1 className="text-2xl font-bold mb-8 text-white">Messages</h1>
        
        <div className="grid grid-cols-4 gap-6 h-[600px]">
          {/* Friends list */}
          <div className="col-span-1 border border-white/20 rounded-lg p-4 overflow-y-auto">
            {friends.map((friend) => (
              <div
                key={friend.id}
                onClick={() => setSelectedFriend(friend)}
                className={`p-4 rounded-lg cursor-pointer transition-colors ${
                  selectedFriend?.id === friend.id
                    ? 'bg-white/10'
                    : 'hover:bg-white/5'
                }`}
              >
                <p className="font-semibold text-white">{friend.name}</p>
              </div>
            ))}
          </div>

          {/* Messages */}
          <div className="col-span-3 border border-white/20 rounded-lg p-4 flex flex-col">
            {selectedFriend ? (
              <>
                <div className="flex-1 overflow-y-auto mb-4">
                  {messages.map((message) => (
                    <div
                      key={message.id}
                      className={`mb-4 ${
                        message.senderId === session?.user?.id
                          ? 'text-right'
                          : 'text-left'
                      }`}
                    >
                      <div
                        className={`inline-block p-3 rounded-lg ${
                          message.senderId === session?.user?.id
                            ? 'bg-blue-500 text-white'
                            : 'bg-white/10 text-white'
                        }`}
                      >
                        {message.content}
                      </div>
                    </div>
                  ))}
                  <div ref={messagesEndRef} />
                </div>
                <form onSubmit={sendMessage} className="flex gap-2">
                  <input
                    type="text"
                    value={newMessage}
                    onChange={(e) => setNewMessage(e.target.value)}
                    placeholder="Type a message..."
                    className="flex-1 p-2 rounded-lg border border-white/20 bg-transparent text-white"
                  />
                  <button
                    type="submit"
                    className="px-4 py-2 rounded-lg bg-blue-500 text-white hover:bg-blue-600 transition-colors"
                  >
                    Send
                  </button>
                </form>
              </>
            ) : (
              <div className="flex-1 flex items-center justify-center text-white/50">
                Select a friend to start messaging
              </div>
            )}
          </div>
        </div>
      </div>
    </div>
  );
} 