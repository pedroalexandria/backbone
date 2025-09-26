import React, { useState, useEffect } from 'react';

interface TypingEffectProps {
  text: string;
  speed?: number;
  onComplete?: () => void;
  className?: string;
}

export const TypingEffect: React.FC<TypingEffectProps> = ({ 
  text, 
  speed = 100, 
  onComplete,
  className = '' 
}) => {
  const [displayedText, setDisplayedText] = useState('');
  const [currentWordIndex, setCurrentWordIndex] = useState(0);
  const [isTyping, setIsTyping] = useState(true);

  // Divide o texto em palavras
  const words = text.split(' ');

  useEffect(() => {
    if (currentWordIndex < words.length) {
      const timeout = setTimeout(() => {
        const newText = words.slice(0, currentWordIndex + 1).join(' ');
        setDisplayedText(newText);
        setCurrentWordIndex(prev => prev + 1);
      }, speed);

      return () => clearTimeout(timeout);
    } else {
      setIsTyping(false);
      if (onComplete) {
        onComplete();
      }
    }
  }, [currentWordIndex, words, speed, onComplete]);

  // Reset quando o texto muda
  useEffect(() => {
    setDisplayedText('');
    setCurrentWordIndex(0);
    setIsTyping(true);
  }, [text]);

  return (
    <span className={className}>
      {displayedText}
      {isTyping && (
        <span className="typing-dots">...</span>
      )}
    </span>
  );
};

export default TypingEffect;
