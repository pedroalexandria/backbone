import React from 'react';
import { AgentIcon } from './AgentIcon';
import { NavigationIcon } from './NavigationIcon';

const AGENT_ICONS = [
  { id: 'ad', icon: '/icones/AD.png', name: 'AD' },
  { id: 'ai1', icon: '/icones/AI Assistant-1.png', name: 'AI Assistant 1' },
  { id: 'campaigns', icon: '/icones/Campaigns.png', name: 'Campaigns' },
  { id: 'customerservice', icon: '/icones/CustomerService.png', name: 'Customer Service' },
  { id: 'fullfilment', icon: '/icones/Fullfilment.png', name: 'Fullfilment' },
  { id: 'handling', icon: '/icones/Handling.png', name: 'Handling' },
  { id: 'insights', icon: '/icones/Insights.png', name: 'Insights' },
  { id: 'offers', icon: '/icones/Offers.png', name: 'Offers' },
  { id: 'productrec', icon: '/icones/ProductRec.png', name: 'Product Rec' },
  { id: 'salesassistant', icon: '/icones/SalesAssistant.png', name: 'Sales Assistant' },
  { id: 'search', icon: '/icones/Search.png', name: 'Search' },
  { id: 'thirdparty', icon: '/icones/ThirdParty.png', name: 'Third Party' },
  { id: 'visualeditor', icon: '/icones/VisualEditor.png', name: 'Visual Editor' },
  { id: 'vtexhelp', icon: '/icones/VTEXHelp.png', name: 'VTEX Help' },
  { id: 'projects', icon: '/icones/Projects.png', name: 'Projects' },
];

interface AgentSidebarProps {
  selectedAgent: string | null;
  onAgentClick: (agentId: string) => void;
  isExpanded: boolean;
  isHovered: boolean;
}

/**
 * Agent sidebar component with icons
 */
export const AgentSidebar: React.FC<AgentSidebarProps> = ({ 
  selectedAgent, 
  onAgentClick,
  isExpanded,
  isHovered
}) => {
  const mainIcons = AGENT_ICONS.slice(0, -2);
  const lastIcons = AGENT_ICONS.slice(-2);

  return (
    <aside 
      className={`w-20 bg-white flex flex-col items-center fixed left-0 top-0 h-full z-30 ${!isExpanded && !isHovered ? 'border-r border-gray-200' : ''}`} 
      style={{ paddingLeft: '24px', paddingRight: '24px' }}
    >
      {/* Logo */}
      <div style={{ marginTop: '16px', marginBottom: '24px' }}>
        <img 
          src="/icones/Logo.png" 
          alt="Logo"
          className="w-8 h-8"
          style={{ padding: 0 }}
          onError={(e) => {
            console.error('Failed to load logo');
            e.currentTarget.style.display = 'none';
          }}
        />
      </div>

      {/* Main Agent Icons */}
      <div className="flex flex-col gap-2">
        {mainIcons.map((agent) => (
          <AgentIcon
            key={agent.id}
            agent={agent}
            isSelected={selectedAgent === agent.id}
            onClick={onAgentClick}
          />
        ))}
        
        {/* Separator Line */}
        <div className="w-full h-px bg-gray-300 my-2" style={{ backgroundColor: '#E0E0E0' }}></div>
        
        {/* Last two icons */}
        {lastIcons.map((agent) => (
          <AgentIcon
            key={agent.id}
            agent={agent}
            isSelected={selectedAgent === agent.id}
            onClick={onAgentClick}
          />
        ))}
      </div>

      {/* Bottom Navigation Icons */}
      <div className="mt-auto flex flex-col gap-2" style={{ marginBottom: '24px' }}>
        <NavigationIcon icon="search" alt="Search" />
        <NavigationIcon 
          icon="notification" 
          alt="Notifications" 
          hasNotification={true}
          className="w-10 h-10 rounded-lg flex items-center justify-center text-gray-600 hover:bg-gray-100 transition-colors relative"
        />
        <NavigationIcon icon="user" alt="User Profile" />
      </div>
    </aside>
  );
};
