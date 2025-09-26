import React from 'react';

interface LoadingSpinnerProps {
  size?: 'sm' | 'md' | 'lg';
  className?: string;
  variant?: 'dots' | 'pulse' | 'wave' | 'ripple' | 'modern';
}

export const LoadingSpinner: React.FC<LoadingSpinnerProps> = ({ 
  size = 'md', 
  className = '',
  variant = 'modern'
}) => {
  const sizes = {
    sm: { dot: 'w-1 h-1', wave: 'w-1 h-3', pulse: 'w-1.5 h-1.5', ripple: 'w-3 h-3' },
    md: { dot: 'w-1.5 h-1.5', wave: 'w-1.5 h-4', pulse: 'w-2 h-2', ripple: 'w-4 h-4' },
    lg: { dot: 'w-2 h-2', wave: 'w-2 h-5', pulse: 'w-3 h-3', ripple: 'w-5 h-5' }
  };

  const currentSizes = sizes[size];

  if (variant === 'dots') {
    return (
      <div className={`flex items-center justify-center gap-1 ${className}`}>
        <div className={`${currentSizes.dot} bg-gray-400 rounded-full loading-dot`}></div>
        <div className={`${currentSizes.dot} bg-gray-400 rounded-full loading-dot`}></div>
        <div className={`${currentSizes.dot} bg-gray-400 rounded-full loading-dot`}></div>
      </div>
    );
  }

  if (variant === 'pulse') {
    return (
      <div className={`flex items-center justify-center ${className}`}>
        <div className={`${currentSizes.pulse} bg-blue-500 rounded-full animate-pulse`}></div>
      </div>
    );
  }

  if (variant === 'wave') {
    return (
      <div className={`flex items-center justify-center gap-1 ${className}`}>
        <div className={`${currentSizes.wave} bg-blue-500 rounded-full wave-bar`}></div>
        <div className={`${currentSizes.wave} bg-blue-500 rounded-full wave-bar`}></div>
        <div className={`${currentSizes.wave} bg-blue-500 rounded-full wave-bar`}></div>
        <div className={`${currentSizes.wave} bg-blue-500 rounded-full wave-bar`}></div>
        <div className={`${currentSizes.wave} bg-blue-500 rounded-full wave-bar`}></div>
      </div>
    );
  }

  if (variant === 'ripple') {
    return (
      <div className={`flex items-center justify-center ${className}`}>
        <div className={`${currentSizes.ripple} border-2 border-blue-500 rounded-full ripple-effect`}></div>
      </div>
    );
  }

  // Modern variant (default) - ChatGPT style with larger dots
  return (
    <div className={`flex items-center justify-center gap-1 ${className}`}>
      <div className={`${currentSizes.pulse} bg-gray-300 rounded-full modern-dot`}></div>
      <div className={`${currentSizes.pulse} bg-gray-300 rounded-full modern-dot`}></div>
      <div className={`${currentSizes.pulse} bg-gray-300 rounded-full modern-dot`}></div>
    </div>
  );
};

export default LoadingSpinner;
