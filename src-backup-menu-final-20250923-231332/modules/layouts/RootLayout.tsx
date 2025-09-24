import React, { useState } from 'react';
import { CSSTransition } from 'react-transition-group';
import { AgentSidebar } from '../../components/AgentSidebar';
import { ExpandedSidebar } from '../../components/ExpandedSidebar';

/**
 * Main layout component
 */
export function RootLayout() {
  const [expandedSidebar, setExpandedSidebar] = useState(false);
  const [selectedAgent, setSelectedAgent] = useState<string | null>(null);
  const [hoverSidebar, setHoverSidebar] = useState(false);
  const [isPinned, setIsPinned] = useState(false);

  const handleAgentClick = (agentId: string) => {
    setSelectedAgent(agentId);
    setExpandedSidebar(true);
  };

  const handleCloseSidebar = () => {
    setIsPinned(!isPinned);
    if (isPinned) {
      setExpandedSidebar(false);
    }
  };

  const handleMouseEnter = () => {
    if (!expandedSidebar && !isPinned) {
      setHoverSidebar(true);
    }
  };

  const handleMouseLeave = () => {
    if (!isPinned) {
      setHoverSidebar(false);
    }
  };

  return (
    <div className="min-h-screen bg-gray-50 flex">
      {/* Hover area wrapper */}
      <div 
        className="fixed left-0 top-0 h-full z-20"
        style={{ width: expandedSidebar || hoverSidebar || isPinned ? '380px' : '80px' }}
        onMouseEnter={handleMouseEnter}
        onMouseLeave={handleMouseLeave}
      >
        <AgentSidebar 
          selectedAgent={selectedAgent}
          onAgentClick={handleAgentClick}
          isExpanded={expandedSidebar}
          isHovered={hoverSidebar}
        />

        <CSSTransition
          in={expandedSidebar || hoverSidebar || isPinned}
          timeout={200}
          classNames="sidebar"
          unmountOnExit
        >
          <ExpandedSidebar onClose={handleCloseSidebar} selectedAgent={selectedAgent} isPinned={isPinned} />
        </CSSTransition>
      </div>

      {/* Main Content */}
      <main 
        className="main-content flex-1 bg-white flex items-center justify-center" 
        style={{ marginLeft: expandedSidebar || isPinned ? '380px' : '80px' }}
      >
        <div className="text-center">
          <h1 className="text-4xl font-light text-gray-900">Home do agente</h1>
        </div>
      </main>
    </div>
  );
}