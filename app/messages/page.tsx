"use client";

import React, { useState, useEffect } from 'react';
import ChatWindow, { ChatMessage } from '../components/ChatWindow';
import type { User } from '../types/marketplace';
import { useSearchParams } from 'next/navigation';

const mockUsers: User[] = [
  { id: 'u1', name: 'Moi', email: 'me@mail.com', isVerified: true },
  { id: 'u2', name: 'Alice', email: 'alice@mail.com', isVerified: true },
  { id: 'u3', name: 'Bechir', email: 'bechir@mail.com', isVerified: true },
];

const mockProducts = [
  { id: 'p1', name: 'Casque Gamer Pro', image: 'https://images.unsplash.com/photo-1517336714731-489689fd1ca8?q=80&w=800&auto=format&fit=crop' },
  { id: 'p2', name: 'Laptop Lenovo ThinkPad', image: 'https://images.unsplash.com/photo-1519389950473-47ba0277781c?q=80&w=800&auto=format&fit=crop' },
];

function getChatKey(userA: string, userB: string, productId?: string) {
  return `chat_${[userA, userB].sort().join('_')}${productId ? '_' + productId : ''}`;
}

export default function MessagesPage() {
  const searchParams = useSearchParams();
  const [currentUser] = useState<User>(mockUsers[0]);
  const [otherUserId, setOtherUserId] = useState<string>(() => searchParams.get('user') || mockUsers[1].id);
  const [productId, setProductId] = useState<string>(() => searchParams.get('product') || '');
  const [messages, setMessages] = useState<ChatMessage[]>([]);

  const otherUser = mockUsers.find(u => u.id === otherUserId)!;
  const productContext = mockProducts.find(p => p.id === productId);

  useEffect(() => {
    setOtherUserId(searchParams.get('user') || otherUserId);
    setProductId(searchParams.get('product') || productId);
    // eslint-disable-next-line
  }, [searchParams]);

  useEffect(() => {
    const key = getChatKey(currentUser.id, otherUserId, productId);
    const stored = localStorage.getItem(key);
    setMessages(stored ? JSON.parse(stored) : []);
  }, [currentUser.id, otherUserId, productId]);

  const handleSend = (msg: ChatMessage) => {
    const key = getChatKey(currentUser.id, otherUserId, productId);
    const newMessages = [...messages, msg];
    setMessages(newMessages);
    localStorage.setItem(key, JSON.stringify(newMessages));
  };

  return (
    <div className="max-w-2xl mx-auto py-10">
      <h1 className="text-2xl font-bold mb-4">Messagerie</h1>
      <div className="mb-4 flex gap-2 items-center">
        <label className="font-medium">Avec :</label>
        <select value={otherUserId} onChange={e => setOtherUserId(e.target.value)} className="border rounded px-2 py-1">
          {mockUsers.filter(u => u.id !== currentUser.id).map(u => (
            <option key={u.id} value={u.id}>{u.name}</option>
          ))}
        </select>
        <label className="font-medium ml-4">Produit :</label>
        <select value={productId} onChange={e => setProductId(e.target.value)} className="border rounded px-2 py-1">
          <option value="">(Aucun)</option>
          {mockProducts.map(p => (
            <option key={p.id} value={p.id}>{p.name}</option>
          ))}
        </select>
      </div>
      <ChatWindow
        messages={messages}
        currentUser={currentUser}
        otherUser={otherUser}
        onSend={handleSend}
        productContext={productContext}
      />
    </div>
  );
} 