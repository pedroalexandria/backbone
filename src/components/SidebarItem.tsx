import React from 'react';
import clsx from 'clsx';
import type { Agent } from '../data/agents';

type Props = {
  agent: Agent;
  selected?: boolean;
  collapsed?: boolean;
  onClick?: (agentId: string) => void;
};

export function SidebarItem({ agent, selected, collapsed, onClick }: Props) {
  return (
    <button
      type="button"
      className={clsx(
        'sidebar-item',
        selected && 'ring-2 ring-primary-500',
        'focus:outline-none focus:ring-2 focus:ring-primary-500'
      )}
      title={agent.name}
      onClick={() => onClick?.(agent.id)}
    >
      <img
        src={agent.avatar || '/icons/placeholder.svg'}
        alt={agent.name}
        className="h-10 w-10 rounded-full object-cover"
        onError={(e) => {
          (e.currentTarget as HTMLImageElement).src = '/icons/placeholder.svg';
        }}
      />
      {!collapsed && (
        <div className="ml-3 text-left">
          <div className="typo-subtitle">{agent.name}</div>
          <div className="typo-body-sm text-gray-500">{agent.role}</div>
        </div>
      )}
    </button>
  );
}
