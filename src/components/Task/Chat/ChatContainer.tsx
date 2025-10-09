import React from 'react';
import clsx from 'clsx';

export type ChatMessage = {
  id: string;
  type: 'user' | 'agent';
  content: string;
};

export function ChatContainer({ messages }: { messages: ChatMessage[] }) {
  return (
    <div className="chat-container">
      <div className="mx-auto w-full max-w-[800px] space-y-4">
        {messages.map((m) => (
          <div
            key={m.id}
            className={clsx(
              'chat-bubble',
              m.type === 'user' ? 'chat-user' : 'chat-agent'
            )}
          >
            {m.content}
          </div>
        ))}
      </div>
    </div>
  );
}
