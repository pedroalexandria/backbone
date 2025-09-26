import React from 'react';
import { LoadingSpinner } from './LoadingSpinner';

export const LoadingDemo: React.FC = () => {
  const variants = ['dots', 'pulse', 'wave', 'ripple', 'modern'] as const;
  const sizes = ['sm', 'md', 'lg'] as const;

  return (
    <div className="p-8 space-y-8">
      <h2 className="text-2xl font-bold mb-6">Loading Spinner Variants</h2>
      
      {variants.map(variant => (
        <div key={variant} className="space-y-4">
          <h3 className="text-lg font-semibold capitalize">{variant} Loading</h3>
          <div className="flex items-center gap-8">
            {sizes.map(size => (
              <div key={size} className="flex flex-col items-center gap-2">
                <span className="text-sm text-gray-600">{size}</span>
                <LoadingSpinner size={size} variant={variant} />
              </div>
            ))}
          </div>
        </div>
      ))}
    </div>
  );
};

export default LoadingDemo;
