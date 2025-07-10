"use client";

import React, { useState } from 'react';
import ChatWindow from '../components/ChatWindow';
import type { ChatMessage, User } from '../types/marketplace';

const mockUser: User = { id: 'u1', name: 'Moi', email: 'me@mail.com', isVerified: true };
const mockOther: User = { id: 'u2', name: 'Alice', email: 'alice@mail.com', isVerified: true };
const mockMessages: ChatMessage[] = [
  { id: 'm1', from: mockUser, to: mockOther, text: 'Bonjour !', sentAt: '2024-01-01T10:00:00.000Z' },
  { id: 'm2', from: mockOther, to: mockUser, text: 'Salut !', sentAt: '2024-01-01T10:01:00.000Z' },
];

export default function MessagesPage() {
  const [messages, setMessages] = useState(mockMessages);
  return (
    <div className="max-w-2xl mx-auto py-10">
      <h1 className="text-2xl font-bold mb-4">Mes messages</h1>
      <ChatWindow messages={messages} currentUser={mockUser} onSend={text => setMessages([...messages, { id: Date.now().toString(), from: mockUser, to: mockOther, text, sentAt: new Date().toISOString() }])} />
    </div>
  );
} 