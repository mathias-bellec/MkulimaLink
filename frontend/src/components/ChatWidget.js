import React, { useState, useEffect, useRef } from 'react';
import { MessageCircle, X, Send, Loader2 } from 'lucide-react';
import { useChat } from '../hooks/useSocket';
import { useAuthStore } from '../store/authStore';

function ChatWidget({ chatId, recipientId, recipientName, onClose }) {
  const [message, setMessage] = useState('');
  const messagesEndRef = useRef(null);
  const { user } = useAuthStore();
  const { messages, typing, sendMessage, startTyping, stopTyping } = useChat(chatId);

  useEffect(() => {
    messagesEndRef.current?.scrollIntoView({ behavior: 'smooth' });
  }, [messages]);

  const handleSend = (e) => {
    e.preventDefault();
    if (!message.trim()) return;
    sendMessage(message, recipientId);
    setMessage('');
  };

  const handleTyping = (e) => {
    setMessage(e.target.value);
    startTyping();
    setTimeout(stopTyping, 2000);
  };

  return (
    <div className="fixed bottom-4 right-4 w-80 md:w-96 bg-white rounded-lg shadow-2xl z-50 flex flex-col max-h-[500px]">
      <div className="flex items-center justify-between p-4 border-b bg-primary-600 text-white rounded-t-lg">
        <div>
          <h3 className="font-semibold">{recipientName}</h3>
          {typing && <p className="text-xs text-primary-200">typing...</p>}
        </div>
        <button onClick={onClose} className="p-1 hover:bg-primary-700 rounded">
          <X size={20} />
        </button>
      </div>

      <div className="flex-1 overflow-y-auto p-4 space-y-3 min-h-[200px] max-h-[300px]">
        {messages.length === 0 ? (
          <p className="text-center text-gray-500 text-sm">Start a conversation</p>
        ) : (
          messages.map((msg, idx) => (
            <div
              key={idx}
              className={`flex ${msg.senderId === user?._id ? 'justify-end' : 'justify-start'}`}
            >
              <div
                className={`max-w-[80%] p-3 rounded-lg ${
                  msg.senderId === user?._id
                    ? 'bg-primary-600 text-white'
                    : 'bg-gray-100 text-gray-800'
                }`}
              >
                <p className="text-sm">{msg.message}</p>
                <p className={`text-xs mt-1 ${
                  msg.senderId === user?._id ? 'text-primary-200' : 'text-gray-500'
                }`}>
                  {new Date(msg.timestamp).toLocaleTimeString([], { hour: '2-digit', minute: '2-digit' })}
                </p>
              </div>
            </div>
          ))
        )}
        <div ref={messagesEndRef} />
      </div>

      <form onSubmit={handleSend} className="p-3 border-t flex gap-2">
        <input
          type="text"
          value={message}
          onChange={handleTyping}
          placeholder="Type a message..."
          className="flex-1 px-3 py-2 border rounded-lg focus:outline-none focus:ring-2 focus:ring-primary-500 text-sm"
        />
        <button
          type="submit"
          disabled={!message.trim()}
          className="p-2 bg-primary-600 text-white rounded-lg hover:bg-primary-700 disabled:opacity-50"
        >
          <Send size={20} />
        </button>
      </form>
    </div>
  );
}

export function ChatButton({ onClick, unreadCount }) {
  return (
    <button
      onClick={onClick}
      className="fixed bottom-4 right-4 p-4 bg-primary-600 text-white rounded-full shadow-lg hover:bg-primary-700 z-40"
    >
      <MessageCircle size={24} />
      {unreadCount > 0 && (
        <span className="absolute -top-1 -right-1 w-6 h-6 bg-red-500 text-white text-xs rounded-full flex items-center justify-center">
          {unreadCount > 9 ? '9+' : unreadCount}
        </span>
      )}
    </button>
  );
}

export default ChatWidget;
