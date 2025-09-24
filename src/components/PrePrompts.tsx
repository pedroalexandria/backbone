import React from 'react';

interface PrePromptsProps {
  onPromptClick: (prompt: string) => void;
}

/**
 * Pre-prompts component with quick action buttons
 */
export const PrePrompts: React.FC<PrePromptsProps> = ({ onPromptClick }) => {
  const prompts = [
    'Create landing page',
    'Create banners', 
    'Check SEO',
    'Edit theme'
  ];

  return (
    <div className="mb-[60px] w-full flex justify-center">
      <div className="flex items-center justify-center gap-2 md:gap-3 flex-wrap w-full max-w-[600px] sm:max-w-[640px] md:max-w-[720px] lg:max-w-[800px] xl:max-w-[960px]">
        {prompts.map((prompt, index) => (
          <button
            key={index}
            onClick={() => onPromptClick(prompt)}
            className="px-3 py-2 rounded-[12px] transition-colors text-sm font-medium preprompt-button"
            style={{
              backgroundColor: 'var(--bg-tertiary)',
              color: '#1F1F1F',
              letterSpacing: '-0.01em',
              fontFamily: 'Inter, sans-serif',
              fontWeight: 500
            }}
          >
            {prompt}
          </button>
        ))}
        
        {/* Plus Icon */}
        <button
          type="button"
          className="w-8 h-8 rounded-lg flex items-center justify-center text-gray-500 hover:bg-gray-100 transition-colors"
        >
          <svg className="w-5 h-5" fill="none" stroke="currentColor" viewBox="0 0 24 24">
            <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M12 4v16m8-8H4" />
          </svg>
        </button>
      </div>
    </div>
  );
};
