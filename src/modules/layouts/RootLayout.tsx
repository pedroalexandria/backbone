import React, { useState } from 'react';
import { CSSTransition } from 'react-transition-group';
import { Outlet } from 'react-router-dom';
import { AgentSidebar } from '../../components/AgentSidebar';
import { ExpandedSidebar } from '../../components/ExpandedSidebar';
// import { ThemeToggle } from '../../components/ThemeToggle';
import { useTheme } from '../../hooks/useTheme';

/**
 * Main layout component
 */
export function RootLayout() {
  const [expandedSidebar, setExpandedSidebar] = useState(false);
  const [selectedAgent, setSelectedAgent] = useState<string | null>(null);
  const [hoverSidebar, setHoverSidebar] = useState(false);
  const [isPinned, setIsPinned] = useState(false);
  const { theme, toggleTheme } = useTheme();

  const handleAgentClick = (agentId: string) => {
    setSelectedAgent(agentId);
    // Não expandir/fixar quando for apenas hover (colapsada). Apenas troca o agente.
    if (!hoverSidebar && !isPinned) {
      setExpandedSidebar(true);
    }
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
        className="fixed left-0 top-0 h-full z-[200]"
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

        {/* Theme Toggle desativado temporariamente */}
        {/* <div className="fixed top-4 right-4 z-50">
          <ThemeToggle theme={theme} onToggle={toggleTheme} />
        </div> */}

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
        className="main-content flex-1 bg-white" 
        style={{ marginLeft: expandedSidebar || isPinned ? '380px' : '80px' }}
      >
        <Outlet context={{ selectedAgent }} />
      </main>
    </div>
  );
}