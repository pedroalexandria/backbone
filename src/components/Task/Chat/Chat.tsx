import React from 'react';
import { ChatHeader } from './ChatHeader';
import { ChatContainer, ChatMessage } from './ChatContainer';

const demoMessages: ChatMessage[] = [
  { id: '1', type: 'agent', content: 'Olá! Em que posso ajudar hoje?' },
  { id: '2', type: 'user', content: 'Quero um banner para Vivara, 1200x600, com CTA.' },
  { id: '3', type: 'agent', content: 'Perfeito! Vou gerar algumas variações no Canvas ao lado.' }
];

export function Chat() {
  return (
    <section className="chat-root">
      <ChatHeader />
      <ChatContainer messages={demoMessages} />
    </section>
  );
}
