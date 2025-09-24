import React from 'react';

const cn = (...classes: (string | undefined | null | false)[]): string => {
  return classes.filter(Boolean).join(' ');
};

interface AgentIconType {
  id: string;
  icon: string;
  name: string;
}

interface AgentIconProps {
  agent: AgentIconType;
  isSelected: boolean;
  onClick: (agentId: string) => void;
}

/**
 * Individual agent icon component
 */
export const AgentIcon: React.FC<AgentIconProps> = ({ 
  agent, 
  isSelected, 
  onClick 
}) => {
  const handleClick = () => onClick(agent.id);

  return (
    <button
      onClick={handleClick}
      className={cn(
        "agent-icon w-10 h-10 rounded-lg flex items-center justify-center transition-colors",
        isSelected && "selected"
      )}
    >
      <img 
        src={`${agent.icon}?v=${Date.now()}`} 
        alt={agent.name}
        className="w-7 h-7"
        onError={(e) => {
          console.error('Failed to load icon:', agent.icon);
          e.currentTarget.style.display = 'none';
        }}
      />
    </button>
  );
};
