import React, { useState } from 'react';
import type { Question, User } from '../types/marketplace';

type QnASectionProps = {
  productId: string;
  questions: Question[];
  currentUser?: User;
  onAsk?: (text: string) => void;
  onAnswer?: (questionId: string, answer: string) => void;
};

export default function QnASection({ productId, questions, currentUser, onAsk, onAnswer }: QnASectionProps) {
  const [questionText, setQuestionText] = useState('');
  return (
    <div className="my-6">
      <h3 className="text-lg font-bold mb-2">Questions & Réponses</h3>
      <ul className="space-y-3 mb-4">
        {questions.map(q => (
          <li key={q.id} className="border rounded p-2 bg-gray-50 dark:bg-gray-800">
            <div className="font-medium text-sm text-blue-700 dark:text-blue-300">{q.user.name} :</div>
            <div className="mb-1">{q.text}</div>
            {q.answer ? (
              <div className="text-green-700 dark:text-green-400 text-sm">Réponse : {q.answer}</div>
            ) : currentUser && onAnswer ? (
              <form onSubmit={e => { e.preventDefault(); onAnswer(q.id, questionText); setQuestionText(''); }}>
                <input type="text" value={questionText} onChange={e => setQuestionText(e.target.value)} className="border rounded px-2 py-1 mr-2" placeholder="Répondre..." />
                <button type="submit" className="bg-blue-600 text-white px-2 py-1 rounded">Répondre</button>
              </form>
            ) : null}
          </li>
        ))}
      </ul>
      {currentUser && onAsk && (
        <form onSubmit={e => { e.preventDefault(); onAsk(questionText); setQuestionText(''); }} className="flex gap-2">
          <input type="text" value={questionText} onChange={e => setQuestionText(e.target.value)} className="border rounded px-2 py-1 flex-1" placeholder="Poser une question..." />
          <button type="submit" className="bg-blue-600 text-white px-3 py-1 rounded">Envoyer</button>
        </form>
      )}
    </div>
  );
} 