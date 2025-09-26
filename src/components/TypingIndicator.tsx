import React from 'react';

interface TypingIndicatorProps {
  className?: string;
}

export const TypingIndicator: React.FC<TypingIndicatorProps> = ({ 
  className = '' 
}) => {
  return (
    <span className={`typing-gradient ${className}`}>
      typing
    </span>
  );
};

export default TypingIndicator;
