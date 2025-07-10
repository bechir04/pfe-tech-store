"use client";

import React, { useState, useRef, useEffect } from 'react';
import type { ChatMessage, User } from '../types/marketplace';

type ChatWindowProps = {
  messages: ChatMessage[];
  currentUser: User;
  onSend: (text: string) => void;
};

export default function ChatWindow({ messages, currentUser, onSend }: ChatWindowProps) {
  const [text, setText] = useState('');
  const messagesEndRef = useRef<HTMLDivElement>(null);

  useEffect(() => {
    messagesEndRef.current?.scrollIntoView({ behavior: 'smooth' });
  }, [messages]);

  return (
    <div className="flex flex-col h-96 border rounded bg-white dark:bg-gray-900">
      <div className="flex-1 overflow-y-auto p-4 space-y-2">
        {messages.map(m => (
          <div key={m.id} className={`flex ${m.from.id === currentUser.id ? 'justify-end' : 'justify-start'}`}>
            <div className={`px-3 py-2 rounded-lg max-w-xs ${m.from.id === currentUser.id ? 'bg-cyan-500 text-white' : 'bg-gray-200 dark:bg-gray-700 text-gray-900 dark:text-white'}`}>
              <div className="text-xs font-semibold mb-1">{m.from.name}</div>
              <div>{m.text}</div>
              <div className="text-xs text-gray-400 mt-1">{new Date(m.sentAt).toLocaleTimeString()}</div>
            </div>
          </div>
        ))}
        <div ref={messagesEndRef} />
      </div>
      <form onSubmit={e => { e.preventDefault(); onSend(text); setText(''); }} className="flex p-2 border-t gap-2">
        <input type="text" value={text} onChange={e => setText(e.target.value)} className="flex-1 border rounded px-2 py-1" placeholder="Votre message..." />
        <button type="submit" className="bg-blue-600 text-white px-3 py-1 rounded">Envoyer</button>
      </form>
    </div>
  );
} 