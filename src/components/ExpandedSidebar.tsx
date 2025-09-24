import React, { useMemo, useState } from 'react';
import { CSSTransition } from 'react-transition-group';
import { TaskItem } from './TaskItem';
import { getAgentTasks, MockTask } from '@/data/mockTasks';
import { getAgentPinnedCards } from '@/data/mockTasks';

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

interface ExpandedSidebarProps {
  onClose: () => void;
  selectedAgent?: string | null;
  isPinned?: boolean;
}

type SidebarTab = 'tasks' | 'pinned' | 'queues';

/**
 * Expanded sidebar component with tasks
 */
export const ExpandedSidebar: React.FC<ExpandedSidebarProps> = ({ onClose, selectedAgent, isPinned }) => {
  const [activeTab, setActiveTab] = useState<SidebarTab>('tasks');

  const tasks = useMemo(() => getAgentTasks(selectedAgent || null), [selectedAgent]);
  const pinnedCards = useMemo(() => getAgentPinnedCards(selectedAgent || null), [selectedAgent]);

  const pendingTasks = tasks.filter((task: MockTask) => task.category === 'pending');
  const todayTasks = tasks.filter((task: MockTask) => task.category === 'today');
  const yesterdayTasks = tasks.filter((task: MockTask) => task.category === 'yesterday');

  return (
    <aside 
      className="w-[300px] border-r flex flex-col fixed top-0 h-full z-40 left-0 sm:left-20"
      style={{ 
        backgroundColor: '#F5F5F5',
        borderColor: 'var(--border-primary)'
      }}
    >
      {/* Header */}
      <div className="pt-[18px] pb-2 pr-5">
        <div className="flex items-center justify-between mb-5">
          <span className="faststore-title">
            {selectedAgent 
              ? `${AGENT_ICONS.find(agent => agent.id === selectedAgent)?.name || 'Agent'} Agent`
              : 'FastStore Visual Editor Agent'}
          </span>
          <button 
            onClick={onClose}
            className="close-button transition-opacity"
          >
            <img 
              src={isPinned ? "/icones/SidebarClose.png" : "/icones/SidebarClose.png"} 
              alt={isPinned ? "Unpin sidebar" : "Pin sidebar"}
              className="w-5 h-5 opacity-40 hover:opacity-100 transition-opacity"
              onError={(e) => {
                console.error('Failed to load close icon');
                e.currentTarget.style.display = 'none';
              }}
            />
          </button>
        </div>
        
        {/* New Task Button */}
        <button className="new-task-button w-full text-gray-700 px-4 rounded-lg flex items-center gap-2 transition-colors">
          <img 
            src="/icones/NewTask.png" 
            alt="New task"
            className="w-4 h-4"
            onError={(e) => {
              console.error('Failed to load new task icon');
              e.currentTarget.style.display = 'none';
            }}
          />
          New task
        </button>
      </div>

      {/* Tabs */}
      <div className="tabs-container pr-5">
        <div className="flex gap-3">
          <button
            className={`tab-button font-medium ${activeTab === 'tasks' ? 'active border-b-2' : 'text-gray-500'}`}
            onClick={() => setActiveTab('tasks')}
          >
            Tasks
          </button>
          <button
            className={`tab-button font-medium ${activeTab === 'pinned' ? 'active border-b-2' : 'text-gray-500'}`}
            onClick={() => setActiveTab('pinned')}
          >
            Pinned
          </button>
          <button
            className={`tab-button font-medium ${activeTab === 'queues' ? 'active border-b-2' : 'text-gray-500'}`}
            onClick={() => setActiveTab('queues')}
          >
            Queues
          </button>
        </div>
      </div>

      {/* Content */}
      <div className="flex-1 overflow-y-auto py-4 pr-5">
        {activeTab === 'tasks' && (
          <div>
            {/* Pending Tasks */}
            {pendingTasks.length > 0 && (
              <div className="mb-4">
                <h3 className="section-title mb-1" style={{ fontWeight: 400, fontFamily: 'Inter, sans-serif' }}>Pending tasks</h3>
                <div className="space-y-0.5">
                  {pendingTasks.map((task: MockTask) => (
                    <TaskItem key={task.id} task={{ title: task.title, hasNotification: task.hasNotification }} />
                  ))}
                </div>
              </div>
            )}

            {/* Today */}
            {todayTasks.length > 0 && (
              <div className="mb-4">
                <h3 className="section-title mb-1" style={{ fontWeight: 400, fontFamily: 'Inter, sans-serif' }}>Today</h3>
                <div className="space-y-0.5">
                  {todayTasks.map((task: MockTask) => (
                    <TaskItem key={task.id} task={{ title: task.title, hasNotification: task.hasNotification }} />
                  ))}
                </div>
              </div>
            )}

            {/* Yesterday */}
            {yesterdayTasks.length > 0 && (
              <div className="mb-4">
                <h3 className="section-title mb-1" style={{ fontWeight: 400, fontFamily: 'Inter, sans-serif' }}>Yesterday</h3>
                <div className="space-y-0.5">
                  {yesterdayTasks.map((task: MockTask) => (
                    <TaskItem key={task.id} task={{ title: task.title, hasNotification: task.hasNotification }} />
                  ))}
                </div>
              </div>
            )}
          </div>
        )}

        {activeTab === 'pinned' && (
          <div className="mb-2">
            <h3 className="section-title mb-1" style={{ fontWeight: 400, fontFamily: 'Inter, sans-serif' }}>Pinned tasks</h3>
            <div className="space-y-0.5">
              {pinnedCards.map((c) => (
                <div key={c.id} className="task-item rounded-md flex items-center justify-between px-2 py-1">
                  <span className="truncate" style={{ color: 'var(--text-primary)' }}>{c.title}</span>
                  <img
                    src="/icones/Pin.png"
                    alt="Pinned"
                    className="w-4 h-4 opacity-70"
                    onError={(e) => {
                      const target = e.currentTarget as HTMLImageElement;
                      if (!target.dataset.fallback) {
                        target.dataset.fallback = '1';
                        target.src = '/../icones/Pin.png';
                      } else {
                        target.style.display = 'none';
                      }
                    }}
                  />
                </div>
              ))}
            </div>
          </div>
        )}

        {activeTab === 'queues' && (
          <div>
            <h3 className="section-title mb-1" style={{ fontWeight: 400, fontFamily: 'Inter, sans-serif' }}>Work queues</h3>
            <div className="space-y-0.5">
              {['Incoming requests queue (mock)', 'Processing queue (mock)', 'Completed queue (mock)'].map((label, idx) => (
                <div key={idx} className="task-item rounded-md flex items-center justify-between px-2 py-1">
                  <span className="truncate" style={{ color: 'var(--text-primary)' }}>{label}</span>
                  <img
                    src="/icones/Queue.png"
                    alt="Queue"
                    className="w-4 h-4 opacity-70"
                    onError={(e) => {
                      const target = e.currentTarget as HTMLImageElement;
                      if (!target.dataset.fallback) {
                        target.dataset.fallback = '1';
                        target.src = '/../icones/Queue.png';
                      } else {
                        target.style.display = 'none';
                      }
                    }}
                  />
                </div>
              ))}
            </div>
          </div>
        )}
      </div>
    </aside>
  );
};
