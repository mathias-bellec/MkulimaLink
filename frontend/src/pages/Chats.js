import React, { useState } from 'react';
import { useQuery } from '@tanstack/react-query';
import { MessageCircle, Search, User } from 'lucide-react';
import { formatDistanceToNow } from 'date-fns';
import api from '../api/axios';
import ChatWidget from '../components/ChatWidget';
import { useAuthStore } from '../store/authStore';

function Chats() {
  const { user } = useAuthStore();
  const [selectedChat, setSelectedChat] = useState(null);
  const [searchTerm, setSearchTerm] = useState('');

  const { data: chats, isLoading } = useQuery({
    queryKey: ['chats'],
    queryFn: async () => {
      const response = await api.get('/chat');
      return response.data;
    }
  });

  const filteredChats = chats?.filter(chat => {
    const otherParticipant = chat.participants.find(p => p._id !== user?._id);
    return otherParticipant?.name.toLowerCase().includes(searchTerm.toLowerCase());
  });

  const getOtherParticipant = (chat) => {
    return chat.participants.find(p => p._id !== user?._id);
  };

  return (
    <div className="max-w-4xl mx-auto">
      <h1 className="text-3xl font-bold text-gray-900 mb-2">Messages</h1>
      <p className="text-gray-600 mb-8">Chat with buyers and sellers</p>

      <div className="mb-6 relative">
        <Search className="absolute left-3 top-1/2 -translate-y-1/2 text-gray-400" size={20} />
        <input
          type="text"
          placeholder="Search conversations..."
          value={searchTerm}
          onChange={(e) => setSearchTerm(e.target.value)}
          className="input-field pl-10"
        />
      </div>

      {isLoading ? (
        <div className="space-y-4">
          {[1, 2, 3].map(i => (
            <div key={i} className="card">
              <div className="flex items-center gap-4">
                <div className="skeleton w-12 h-12 rounded-full"></div>
                <div className="flex-1">
                  <div className="skeleton h-5 w-1/3 mb-2"></div>
                  <div className="skeleton h-4 w-2/3"></div>
                </div>
              </div>
            </div>
          ))}
        </div>
      ) : filteredChats?.length > 0 ? (
        <div className="space-y-3">
          {filteredChats.map(chat => {
            const other = getOtherParticipant(chat);
            return (
              <button
                key={chat._id}
                onClick={() => setSelectedChat(chat)}
                className={`card w-full text-left hover:shadow-md transition-shadow ${
                  chat.unreadCount > 0 ? 'border-l-4 border-l-primary-500' : ''
                }`}
              >
                <div className="flex items-center gap-4">
                  <div className="w-12 h-12 bg-primary-100 rounded-full flex items-center justify-center">
                    <User className="text-primary-600" size={24} />
                  </div>
                  <div className="flex-1 min-w-0">
                    <div className="flex items-center justify-between">
                      <h3 className="font-semibold text-gray-900 truncate">{other?.name}</h3>
                      {chat.lastMessage?.timestamp && (
                        <span className="text-xs text-gray-500">
                          {formatDistanceToNow(new Date(chat.lastMessage.timestamp), { addSuffix: true })}
                        </span>
                      )}
                    </div>
                    <p className="text-sm text-gray-600 truncate">
                      {chat.lastMessage?.content || 'No messages yet'}
                    </p>
                    {chat.product && (
                      <span className="text-xs text-primary-600">
                        Re: {chat.product.name}
                      </span>
                    )}
                  </div>
                  {chat.unreadCount > 0 && (
                    <span className="w-6 h-6 bg-primary-500 text-white text-xs rounded-full flex items-center justify-center">
                      {chat.unreadCount}
                    </span>
                  )}
                </div>
              </button>
            );
          })}
        </div>
      ) : (
        <div className="text-center py-12">
          <MessageCircle className="mx-auto text-gray-400 mb-4" size={64} />
          <h3 className="text-xl font-semibold text-gray-700 mb-2">No Conversations Yet</h3>
          <p className="text-gray-500">Start chatting with sellers by visiting a product page</p>
        </div>
      )}

      {selectedChat && (
        <ChatWidget
          chatId={selectedChat._id}
          recipientId={getOtherParticipant(selectedChat)?._id}
          recipientName={getOtherParticipant(selectedChat)?.name}
          onClose={() => setSelectedChat(null)}
        />
      )}
    </div>
  );
}

export default Chats;
