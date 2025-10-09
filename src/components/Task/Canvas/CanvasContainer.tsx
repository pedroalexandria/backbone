import React from 'react';

export function CanvasContainer({ children }: { children?: React.ReactNode }) {
  return (
    <div className="canvas-container">
      <div className="mx-auto w-full max-w-[1024px]">
        {children ?? (
          <div className="aspect-video w-full bg-gray-100 rounded-lg grid place-items-center text-gray-500">
            Prévia do Canvas
          </div>
        )}
      </div>
    </div>
  );
}
