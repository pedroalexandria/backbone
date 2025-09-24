import React, { useState } from 'react';
import { AgentSidebar } from '../../components/AgentSidebar';
import { ExpandedSidebar } from '../../components/ExpandedSidebar';

/**
 * Main layout component
 */
export function RootLayout() {
  const [expandedSidebar, setExpandedSidebar] = useState(false);
  const [selectedAgent, setSelectedAgent] = useState<string | null>(null);

  const handleAgentClick = (agentId: string) => {
    setSelectedAgent(agentId);
    setExpandedSidebar(true);
  };

  const handleCloseSidebar = () => {
    setExpandedSidebar(false);
  };

  return (
    <div className="min-h-screen bg-gray-50 flex">
      <AgentSidebar 
        selectedAgent={selectedAgent}
        onAgentClick={handleAgentClick}
        isExpanded={expandedSidebar}
      />

      {expandedSidebar && (
        <ExpandedSidebar onClose={handleCloseSidebar} />
      )}

      {/* Main Content */}
      <main 
        className="flex-1 bg-white flex items-center justify-center" 
        style={{ marginLeft: expandedSidebar ? '380px' : '80px' }}
      >
        <div className="text-center">
          <h1 className="text-4xl font-light text-gray-900">Home do agente</h1>
        </div>
      </main>
    </div>
  );
}