import { useEffect, useState, useCallback } from 'react';
import { initSocket, getSocket, disconnectSocket } from '../utils/socket';
import { useAuthStore } from '../store/authStore';

export const useSocket = () => {
  const [connected, setConnected] = useState(false);
  const { token } = useAuthStore();

  useEffect(() => {
    if (!token) {
      disconnectSocket();
      setConnected(false);
      return;
    }

    const socket = initSocket();
    if (!socket) return;

    socket.on('connect', () => setConnected(true));
    socket.on('disconnect', () => setConnected(false));

    return () => {
      socket.off('connect');
      socket.off('disconnect');
    };
  }, [token]);

  const emit = useCallback((event, data) => {
    const socket = getSocket();
    if (socket?.connected) {
      socket.emit(event, data);
    }
  }, []);

  const on = useCallback((event, callback) => {
    const socket = getSocket();
    if (socket) {
      socket.on(event, callback);
      return () => socket.off(event, callback);
    }
    return () => {};
  }, []);

  return { connected, emit, on };
};

export const useNotifications = (onNotification) => {
  const { on } = useSocket();

  useEffect(() => {
    const unsubscribe = on('notification', onNotification);
    return unsubscribe;
  }, [on, onNotification]);
};

export const useChat = (chatId) => {
  const { emit, on, connected } = useSocket();
  const [messages, setMessages] = useState([]);
  const [typing, setTyping] = useState(null);

  useEffect(() => {
    if (!chatId || !connected) return;

    emit('join_chat', chatId);

    const unsubMessage = on('new_message', (message) => {
      if (message.chatId === chatId) {
        setMessages(prev => [...prev, message]);
      }
    });

    const unsubTyping = on('user_typing', (data) => {
      setTyping(data.userName);
    });

    const unsubStopTyping = on('user_stop_typing', () => {
      setTyping(null);
    });

    return () => {
      emit('leave_chat', chatId);
      unsubMessage();
      unsubTyping();
      unsubStopTyping();
    };
  }, [chatId, connected, emit, on]);

  const sendMessage = useCallback((message, recipientId) => {
    emit('send_message', { chatId, message, recipientId });
  }, [chatId, emit]);

  const startTyping = useCallback(() => {
    emit('typing', { chatId });
  }, [chatId, emit]);

  const stopTyping = useCallback(() => {
    emit('stop_typing', { chatId });
  }, [chatId, emit]);

  return { messages, typing, sendMessage, startTyping, stopTyping };
};

export const useDeliveryTracking = (deliveryId) => {
  const { emit, on, connected } = useSocket();
  const [location, setLocation] = useState(null);
  const [status, setStatus] = useState(null);

  useEffect(() => {
    if (!deliveryId || !connected) return;

    emit('track_delivery', deliveryId);

    const unsubLocation = on('location_update', (data) => {
      if (data.deliveryId === deliveryId) {
        setLocation({ lat: data.latitude, lng: data.longitude });
      }
    });

    const unsubStatus = on('delivery_update', (data) => {
      if (data.deliveryId === deliveryId) {
        setStatus(data.status);
      }
    });

    return () => {
      unsubLocation();
      unsubStatus();
    };
  }, [deliveryId, connected, emit, on]);

  return { location, status };
};

export default useSocket;
