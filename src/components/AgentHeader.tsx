import React from 'react';
import { AGENT_ICONS } from '../constants';

interface AgentHeaderProps {
  agentId: string | null;
  agentName: string;
  author: string;
}

/**
 * Agent header component with icon, title and author
 */
export const AgentHeader: React.FC<AgentHeaderProps> = ({ agentId, agentName, author }) => {
  const getAgentIcon = () => {
    if (!agentId) return '/icones/VisualEditor.png';
    const match = AGENT_ICONS.find(a => a.id === agentId);
    return match ? match.icon : '/icones/VisualEditor.png';
  };

  return (
    <div className="text-center mb-8">
      {/* Agent Icon */}
      <div className="mb-4">
        <img 
          src={encodeURI(`${getAgentIcon()}?v=${Date.now()}`)} 
          alt={agentName}
          className="w-16 h-16 mx-auto"
          onError={(e) => {
            console.error('Failed to load agent icon', getAgentIcon());
            e.currentTarget.style.display = 'none';
          }}
        />
      </div>
      
      {/* Agent Title */}
      <h1 className="agent-title" style={{ color: 'var(--text-primary)', marginBottom: 0 }}>{agentName}</h1>
      
      {/* Created by */}
      <p
        className="text-sm"
        style={{
          color: '#9ca3af',
          fontFamily: 'Inter, sans-serif',
          fontWeight: 400,
          fontSize: 13,
          letterSpacing: '-0.02em'
        }}
      >
        Created by <span style={{ fontWeight: 500, color: '#9ca3af' }}>{author}</span>
      </p>
    </div>
  );
};
