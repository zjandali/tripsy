'use client';

import { useEffect, useState, useRef } from 'react';
import { useSession } from 'next-auth/react';
import { useRouter } from 'next/navigation';
import { MessageSquare, Search, Phone, Video, Info, Send, Image as ImageIcon, Smile, Users } from 'lucide-react';

interface Message {
  id: string;
  content: string;
  senderId: string;
  receiverId: string;
  createdAt: string;
  read: boolean;
  time?: string;
}

interface Friend {
  id: string;
  name: string;
  email: string;
  image: string;
  lastMessage?: string;
  time?: string;
  unread?: number;
  online?: boolean;
  isGroup?: boolean;
  members?: string[];
}

const formatMessageDate = (dateStr: string) => {
  const date = new Date(dateStr);
  const today = new Date();
  const yesterday = new Date(today);
  yesterday.setDate(yesterday.getDate() - 1);

  if (date.toDateString() === today.toDateString()) {
    return 'Today';
  } else if (date.toDateString() === yesterday.toDateString()) {
    return 'Yesterday';
  } else {
    return date.toLocaleDateString('en-US', { 
      weekday: 'long',
      month: 'long', 
      day: 'numeric'
    });
  }
};

export default function MessagesPage() {
  const { data: session, status } = useSession();
  const router = useRouter();
  const [friends, setFriends] = useState<Friend[]>([]);
  const [selectedFriend, setSelectedFriend] = useState<Friend | null>(null);
  const [messages, setMessages] = useState<Message[]>([]);
  const [newMessage, setNewMessage] = useState('');
  const messagesEndRef = useRef<HTMLDivElement>(null);
  const [searchQuery, setSearchQuery] = useState('');

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

  const groupMessagesByDate = (messages: Message[]) => {
    const groups: { [key: string]: Message[] } = {};
    
    messages.forEach(message => {
      const date = formatMessageDate(message.createdAt);
      if (!groups[date]) {
        groups[date] = [];
      }
      groups[date].push(message);
    });

    return groups;
  };

  return (
    <div className="min-h-screen bg-gradient-to-b from-blue-600 to-blue-800">
      <div className="max-w-7xl mx-auto p-8">
        <div className="bg-white/10 backdrop-blur-lg rounded-xl border border-white/20 h-[calc(100vh-8rem)] flex overflow-hidden">
          {/* Sidebar */}
          <div className="w-80 border-r border-white/20">
            <div className="p-4">
              <div className="flex items-center justify-between mb-4">
                <div className="flex items-center">
                  <MessageSquare className="h-6 w-6 text-white" />
                  <h1 className="text-xl font-bold text-white ml-2">Messages</h1>
                </div>
              </div>
              <div className="relative mb-4">
                <input
                  type="text"
                  placeholder="Search messages..."
                  value={searchQuery}
                  onChange={(e) => setSearchQuery(e.target.value)}
                  className="w-full pl-10 pr-4 py-2 rounded-lg bg-white/10 border border-white/20 text-white placeholder-white/50 focus:outline-none focus:ring-2 focus:ring-white/30"
                />
                <Search className="absolute left-3 top-2.5 h-5 w-5 text-white/50" />
              </div>
            </div>
            <div className="overflow-y-auto h-[calc(100vh-16rem)]">
              {friends.map((friend) => (
                <div
                  key={friend.id}
                  onClick={() => setSelectedFriend(friend)}
                  className={`p-4 hover:bg-white/10 cursor-pointer transition-colors ${
                    selectedFriend?.id === friend.id ? 'bg-white/10' : ''
                  }`}
                >
                  <div className="flex items-center">
                    <div className="relative">
                      <img src={friend.image} alt={friend.name} className="w-12 h-12 rounded-full" />
                      {friend.online && (
                        <div className="absolute bottom-0 right-0 w-3 h-3 bg-green-400 rounded-full border-2 border-blue-800"></div>
                      )}
                    </div>
                    <div className="ml-4 flex-1">
                      <div className="flex justify-between items-center">
                        <h3 className="text-white font-semibold">{friend.name}</h3>
                        <span className="text-white/50 text-sm">{friend.time}</span>
                      </div>
                      <p className="text-white/70 text-sm truncate">{friend.lastMessage}</p>
                    </div>
                    {friend.unread && friend.unread > 0 && (
                      <div className="ml-2 bg-white/20 rounded-full w-5 h-5 flex items-center justify-center">
                        <span className="text-white text-xs">{friend.unread}</span>
                      </div>
                    )}
                  </div>
                </div>
              ))}
            </div>
          </div>

          {/* Chat Area */}
          <div className="flex-1 flex flex-col">
            {selectedFriend ? (
              <>
                {/* Chat Header */}
                <div className="p-4 border-b border-white/20 flex items-center justify-between">
                  <div className="flex items-center">
                    <img src={selectedFriend.image} alt={selectedFriend.name} className="w-10 h-10 rounded-full" />
                    <div className="ml-4">
                      <h2 className="text-white font-semibold">{selectedFriend.name}</h2>
                      {selectedFriend.isGroup ? (
                        <div className="flex items-center text-white/50 text-sm">
                          <Users className="h-4 w-4 mr-1" />
                          {selectedFriend.members?.join(', ')}
                        </div>
                      ) : (
                        <span className="text-white/50 text-sm">
                          {selectedFriend.online ? 'Online' : 'Offline'}
                        </span>
                      )}
                    </div>
                  </div>
                  <div className="flex items-center gap-4">
                    <button className="p-2 hover:bg-white/10 rounded-lg transition-colors">
                      <Phone className="h-5 w-5 text-white/70" />
                    </button>
                    <button className="p-2 hover:bg-white/10 rounded-lg transition-colors">
                      <Video className="h-5 w-5 text-white/70" />
                    </button>
                    <button className="p-2 hover:bg-white/10 rounded-lg transition-colors">
                      <Info className="h-5 w-5 text-white/70" />
                    </button>
                  </div>
                </div>

                {/* Messages */}
                <div className="flex-1 overflow-y-auto p-4">
                  <div className="space-y-6">
                    {Object.entries(groupMessagesByDate(messages)).map(([date, dateMessages]) => (
                      <div key={date} className="space-y-4">
                        <div className="flex justify-center">
                          <span className="bg-white/10 text-white/70 text-xs px-3 py-1 rounded-full">
                            {date}
                          </span>
                        </div>
                        {dateMessages.map((message) => (
                          <div
                            key={message.id}
                            className={`flex ${message.senderId === session?.user?.id ? 'justify-end' : 'justify-start'}`}
                          >
                            <div
                              className={`max-w-[70%] rounded-lg p-3 ${
                                message.senderId === session?.user?.id
                                  ? 'bg-white/20 text-white'
                                  : 'bg-white/10 text-white'
                              }`}
                            >
                              <p>{message.content}</p>
                              <span className="text-white/50 text-xs mt-1 block">
                                {new Date(message.createdAt).toLocaleTimeString([], { 
                                  hour: '2-digit', 
                                  minute: '2-digit' 
                                })}
                              </span>
                            </div>
                          </div>
                        ))}
                      </div>
                    ))}
                    <div ref={messagesEndRef} />
                  </div>
                </div>

                {/* Message Input */}
                <form onSubmit={sendMessage} className="p-4 border-t border-white/20">
                  <div className="flex items-center gap-2">
                    <button type="button" className="p-2 hover:bg-white/10 rounded-lg transition-colors">
                      <ImageIcon className="h-5 w-5 text-white/70" />
                    </button>
                    <button type="button" className="p-2 hover:bg-white/10 rounded-lg transition-colors">
                      <Smile className="h-5 w-5 text-white/70" />
                    </button>
                    <input
                      type="text"
                      value={newMessage}
                      onChange={(e) => setNewMessage(e.target.value)}
                      placeholder="Type a message..."
                      className="flex-1 bg-white/10 border border-white/20 rounded-lg px-4 py-2 text-white placeholder-white/50 focus:outline-none focus:ring-2 focus:ring-white/30"
                    />
                    <button
                      type="submit"
                      className="p-2 bg-white/20 hover:bg-white/30 rounded-lg transition-colors"
                    >
                      <Send className="h-5 w-5 text-white" />
                    </button>
                  </div>
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