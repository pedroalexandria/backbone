import React, { useState } from 'react';
import { Sidebar } from './components/Sidebar';
import { agents as agentsData } from './data/agents';
import { Task } from './components/Task/Task';

export default function App() {
  const [collapsed, setCollapsed] = useState(false);
  const [selectedAgentId, setSelectedAgentId] = useState<string | null>(agentsData[0]?.id ?? null);

  return (
    <div className="min-h-screen bg-gray-50 flex">
      <Sidebar
        agents={agentsData}
        selectedAgentId={selectedAgentId}
        collapsed={collapsed}
        onSelectAgent={setSelectedAgentId}
        onToggleCollapse={() => setCollapsed((v) => !v)}
      />

      <main className="flex-1 bg-white">
        <Task />
      </main>
    </div>
  );
}
