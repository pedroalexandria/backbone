import React from 'react';

export function TaskBody({ children }: { children?: React.ReactNode }) {
  return (
    <div className="task-body">
      {children}
    </div>
  );
}
