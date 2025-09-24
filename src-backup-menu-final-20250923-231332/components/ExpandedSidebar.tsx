import React from 'react';
import { CSSTransition } from 'react-transition-group';
import { TaskItem } from './TaskItem';

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

/**
 * Expanded sidebar component with tasks
 */
export const ExpandedSidebar: React.FC<ExpandedSidebarProps> = ({ onClose, selectedAgent, isPinned }) => {
  return (
    <aside className="w-[300px] bg-white border-r border-gray-200 flex flex-col fixed left-20 top-0 h-full z-10">
      {/* Header */}
      <div className="pt-[18px] pb-2 pr-5">
        <div className="flex items-center justify-between mb-5">
          <span className="faststore-title">
            {selectedAgent ? `${AGENT_ICONS.find(agent => agent.id === selectedAgent)?.name || 'Agent'} Tasks` : 'FastStore Visual Editor'}
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
          <button className="tab-button active border-b-2 font-medium">Tasks</button>
          <button className="tab-button text-gray-500 font-medium">Pinned</button>
          <button className="tab-button text-gray-500 font-medium">Queues</button>
        </div>
      </div>

      {/* Task Lists */}
      <div className="flex-1 overflow-y-auto py-4 pr-5">
        {/* Pending Tasks */}
        <div className="mb-4">
          <h3 className="section-title mb-1">Pending tasks</h3>
          <div className="space-y-0.5">
            <TaskItem task={{ title: "Develop a social media marketing str...", hasNotification: true }} />
            <TaskItem task={{ title: "Update user onboarding process bas...", hasNotification: true }} />
          </div>
        </div>

        {/* Today */}
        <div className="mb-4">
          <h3 className="section-title mb-1">Today</h3>
          <div className="space-y-0.5">
            <TaskItem task={{ title: "New task...", hasNotification: false }} />
            <TaskItem task={{ title: "[Sep-07-25] Task suggestions (8)", hasNotification: true }} />
          </div>
        </div>

        {/* Yesterday */}
        <div className="mb-4">
          <h3 className="section-title mb-1">Yesterday</h3>
          <div className="space-y-0.5">
            <TaskItem task={{ title: "Evaluate website traffic data for Q3" }} />
            <TaskItem task={{ title: "Create content calendar for upcoming..." }} />
            <TaskItem task={{ title: "Conduct user surveys to gather feedb..." }} />
            <TaskItem task={{ title: "Analyze competitor strategies and mar..." }} />
            <TaskItem task={{ title: "Develop a social media marketing str...", hasNotification: true }} />
            <TaskItem task={{ title: "Optimize landing pages for better conv...", hasNotification: true }} />
            <TaskItem task={{ title: "Prepare a presentation on the impact o..." }} />
            <TaskItem task={{ title: "Set up A/B testing for email campaigns" }} />
            <TaskItem task={{ title: "Review customer service interactions f...", hasNotification: true }} />
            <TaskItem task={{ title: "Update user onboarding process bas...", hasNotification: true }} />
            <TaskItem task={{ title: "Collaborate with design team for websi..." }} />
            <TaskItem task={{ title: "Monitor ad performance and adjust bu...", hasNotification: true }} />
            <TaskItem task={{ title: "Plan a webinar series to engage potent..." }} />
            <TaskItem task={{ title: "Create a report on sales performance..." }} />
            <TaskItem task={{ title: "Initiate a loyalty program to enhance c..." }} />
            <TaskItem task={{ title: "Review and update privacy policy in lig..." }} />
            <TaskItem task={{ title: "Conduct a SWOT analysis for the upco..." }} />
            <TaskItem task={{ title: "Launch a referral program to incentiviz..." }} />
            <TaskItem task={{ title: "Research and implement new tools for..." }} />
            <TaskItem task={{ title: "Host focus groups to test new product..." }} />
          </div>
        </div>
      </div>
    </aside>
  );
};
