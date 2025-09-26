import React from 'react';

type PlaceholderProps = {
  title: string;
};

export function Placeholder({ title }: PlaceholderProps) {
  return (
    <div className="p-8">
      <h1 className="text-2xl font-semibold tracking-tight">{title}</h1>
      <p className="mt-2 text-sm text-white/60">
        Conteúdo desta página será implementado posteriormente.
      </p>
    </div>
  );
}

