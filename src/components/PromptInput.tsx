import React, { useState } from 'react';
import { useNavigate } from 'react-router-dom';

interface PromptInputProps {
  agentName: string;
  onSendMessage: (message: string) => void;
}

/**
 * Prompt input component with action bar
 */
export const PromptInput: React.FC<PromptInputProps> = ({ agentName, onSendMessage }) => {
  const [message, setMessage] = useState('');
  const navigate = useNavigate();

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    if (message.trim()) {
      onSendMessage(message.trim());
      setMessage('');
      navigate('/chat-canvas');
    }
  };

  return (
    <div className="mb-5 w-full">
      <form onSubmit={handleSubmit} className="relative w-full flex justify-center">
        <div 
          className="relative border rounded-[28px] flex flex-col overflow-hidden prompt-box w-full max-w-[600px] sm:max-w-[640px] md:max-w-[720px] lg:max-w-[800px] xl:max-w-[960px] h-[100px]"
          style={{ 
            backgroundColor: 'var(--bg-primary)',
            borderColor: 'var(--border-primary)',
            paddingLeft: 24,
            paddingRight: 12,
            paddingTop: 16,
            paddingBottom: 12
          }}
        >
          {/* Text area (top) */}
          <div className="flex-1 flex items-center">
            <input
              type="text"
              value={message}
              onChange={(e) => setMessage(e.target.value)}
              placeholder={`Message ${agentName}...`}
              className="flex-1 h-full border-none focus:outline-none bg-transparent"
              style={{ 
                color: 'var(--text-primary)',
                fontFamily: 'Inter, sans-serif',
                fontWeight: 400,
                fontSize: 16,
                letterSpacing: '-0.02em'
              }}
            />
          </div>

          {/* Action bar (bottom) */}
          <div 
            className="h-10 flex items-center justify-between"
          >
            {/* Add button */}
            <button
              type="button"
              className="w-8 h-8 rounded-lg flex items-center justify-center transition-colors prompt-icon"
              style={{ marginLeft: -8 }}
              aria-label="Add"
              onClick={() => navigate('/chat-canvas')}
            >
              <img 
                src={`/icones/Add.png?v=${Date.now()}`}
                alt="Add"
                className="w-8 h-8 object-contain"
                onError={(e) => { 
                  console.error('Falha ao carregar ícone Add.png');
                  e.currentTarget.style.display = 'none'; 
                }}
              />
            </button>

            {/* Send button */}
            <button
              type="submit"
              className="w-10 h-10 rounded-full flex items-center justify-center text-white ml-3 send-button"
              aria-label="Send"
            >
              <img 
                src={`/icones/Send.png?v=${Date.now()}`}
                alt="Send"
                className="w-5 h-5 object-contain"
                onError={(e) => { 
                  console.error('Falha ao carregar ícone Send.png');
                  e.currentTarget.style.display = 'none'; 
                }}
              />
            </button>
          </div>
        </div>
      </form>
    </div>
  );
};
