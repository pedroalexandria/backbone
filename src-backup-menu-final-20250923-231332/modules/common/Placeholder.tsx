import React from 'react';

type PlaceholderProps = {
  title: string;
};

export function Placeholder({ title }: PlaceholderProps) {
  return (
    <div className="p-8">
      <h1 className="text-2xl font-semibold tracking-tight text-gray-900">{title}</h1>
      <p className="mt-2 text-sm text-gray-600">
        Conteúdo desta página será implementado posteriormente.
      </p>
    </div>
  );
}

