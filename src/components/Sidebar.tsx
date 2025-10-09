import React from 'react';
import clsx from 'clsx';
import { SidebarItem } from './SidebarItem';
import { AgentPanel } from './AgentPanel';
import type { Agent } from '../data/agents';

type Props = {
  agents: Agent[];
  selectedAgentId: string | null;
  collapsed: boolean;
  onSelectAgent: (agentId: string) => void;
  onToggleCollapse?: () => void;
};

export function Sidebar({ agents, selectedAgentId, collapsed, onSelectAgent, onToggleCollapse }: Props) {
  return (
    <aside className={clsx('sidebar-root', collapsed ? 'w-20' : 'w-80')} aria-label="Agentes">
      <div className="flex items-center justify-between px-3 py-3">
        <div className={clsx('text-sm font-semibold', collapsed && 'sr-only')}>Agentes</div>
        <button type="button" className={clsx('icon-button', collapsed && 'mx-auto')} onClick={onToggleCollapse} aria-label="Alternar sidebar">
          <span className="block h-1 w-5 bg-gray-400 rounded" />
        </button>
      </div>
      <div className="space-y-2 px-2">
        {agents.map((agent) => (
          <SidebarItem
            key={agent.id}
            agent={agent}
            selected={selectedAgentId === agent.id}
            collapsed={collapsed}
            onClick={onSelectAgent}
          />
        ))}
      </div>
      {!collapsed && (
        <div className="mt-4 border-t border-gray-200 pt-4">
          <AgentPanel selectedAgentId={selectedAgentId} />
        </div>
      )}
    </aside>
  );
}
