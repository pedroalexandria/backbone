import React, { useEffect, useState, useMemo, useRef } from 'react';
import { useOutletContext } from 'react-router-dom';
import { AgentHeader } from '../components/AgentHeader';
import { PromptInput } from '../components/PromptInput';
import { PrePrompts } from '../components/PrePrompts';
import { PinnedSection } from '../components/PinnedSection';
import { getAgentPinnedCards } from '@/data/mockTasks';

interface OutletCtx { selectedAgent: string | null }

/**
 * Agent home page component
 */
export const AgentHome: React.FC = () => {
  const { selectedAgent } = useOutletContext<OutletCtx>();
  const [showHeader, setShowHeader] = useState(false);
  const [showPrompt, setShowPrompt] = useState(false);
  const [showGrid, setShowGrid] = useState(false);
  const hasAnimatedRef = useRef(false);
  const getAgentInfo = () => {
    const agents = {
      'visualeditor': { name: 'FastStore Visual Editor', author: 'VTEX' },
      'ad': { name: 'AD Agent', author: 'VTEX' },
      'ai1': { name: 'AI Assistant 1', author: 'VTEX' },
      'campaigns': { name: 'Campaigns Agent', author: 'VTEX' },
      'customerservice': { name: 'Customer Service', author: 'VTEX' },
      'fullfilment': { name: 'Fullfilment Agent', author: 'VTEX' },
      'handling': { name: 'Handling Agent', author: 'VTEX' },
      'insights': { name: 'Insights Agent', author: 'VTEX' },
      'offers': { name: 'Offers Agent', author: 'VTEX' },
      'productrec': { name: 'Product Rec Agent', author: 'VTEX' },
      'salesassistant': { name: 'Sales Assistant', author: 'VTEX' },
      'search': { name: 'Search Agent', author: 'VTEX' },
      'thirdparty': { name: 'Third Party Agent', author: 'VTEX' },
      'vtexhelp': { name: 'VTEX Help Agent', author: 'VTEX' },
      'projects': { name: 'Projects Agent', author: 'VTEX' },
    };
    
    return agents[selectedAgent as keyof typeof agents] || { name: 'FastStore Visual Editor', author: 'VTEX' };
  };

  const agentInfo = getAgentInfo();

  useEffect(() => {
    if (hasAnimatedRef.current) {
      setShowHeader(true);
      setShowPrompt(true);
      setShowGrid(true);
      return;
    }

    setShowHeader(false);
    setShowPrompt(false);
    setShowGrid(false);

    const t1 = setTimeout(() => setShowHeader(true), 10);
    const t2 = setTimeout(() => setShowPrompt(true), 90);
    const t3 = setTimeout(() => setShowGrid(true), 180);

    hasAnimatedRef.current = true;

    return () => {
      clearTimeout(t1);
      clearTimeout(t2);
      clearTimeout(t3);
    };
  }, [selectedAgent]);

  const pinnedCards = useMemo(() => getAgentPinnedCards(selectedAgent), [selectedAgent]);

  const handleSendMessage = (message: string) => {
    console.log('Sending message:', message);
  };

  const handlePromptClick = (prompt: string) => {
    console.log('Prompt clicked:', prompt);
  };

  return (
    <div 
      className="min-h-screen flex items-center justify-center px-6 py-8"
      style={{ backgroundColor: 'var(--bg-secondary)' }}
    >
      <div className="max-w-4xl w-full flex flex-col items-center">
        {/* Agent Header */}
        <div className={`fade-only ${showHeader ? 'show' : ''}`}>
          <AgentHeader 
            agentId={selectedAgent}
            agentName={agentInfo.name}
            author={agentInfo.author}
          />
        </div>
        
        {/* Prompt Input */}
        <div className={`fade-only ${showPrompt ? 'show' : ''}`}>
          <PromptInput 
            agentName={agentInfo.name}
            onSendMessage={handleSendMessage}
          />
          
          {/* Pre-prompts */}
          <PrePrompts onPromptClick={handlePromptClick} />
        </div>
        
        {/* Pinned Section */}
        <div className={`fade-seq ${showGrid ? 'show' : ''}`}>
          <PinnedSection cards={pinnedCards} animate={true} />
        </div>
      </div>
    </div>
  );
};
