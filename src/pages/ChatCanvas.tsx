import React, { useEffect, useMemo, useState } from 'react';
import { useNavigate, useOutletContext, useSearchParams } from 'react-router-dom';
import { PromptInput } from '@/components/PromptInput';

interface OutletCtx { selectedAgent: string | null }

type ChatTab = 'chat' | 'content' | 'styles';

type CanvasTab = 'preview' | 'code';

type ChatRole = 'system' | 'user';

interface ChatMessage {
  id: string;
  role: ChatRole;
  content: string | string[]; // suporta lista
  actionCard?: {
    title: string;
    description?: string;
    thumbnailUrl?: string;
  };
}

const ActionButton: React.FC<React.ButtonHTMLAttributes<HTMLButtonElement>> = (props) => (
  <button
    {...props}
    className={`h-8 px-3 text-sm border transition-colors ${props.className || ''}`}
    style={{
      borderColor: 'var(--border-primary)',
      color: 'var(--text-primary)',
      fontFamily: 'Inter, sans-serif',
      fontWeight: 500,
      fontSize: 13,
      letterSpacing: '-0.02em',
      borderRadius: 8
    }}
  />
);

const agentIconById: Record<string, string> = {
  ad: '/icones/AD.png',
  ai1: '/icones/AI Assistant-1.png',
  campaigns: '/icones/Campaigns.png',
  customerservice: '/icones/CustomerService.png',
  fullfilment: '/icones/Fullfilment.png',
  handling: '/icones/Handling.png',
  insights: '/icones/Insights.png',
  offers: '/icones/Offers.png',
  productrec: '/icones/ProductRec.png',
  salesassistant: '/icones/SalesAssistant.png',
  search: '/icones/Search.png',
  thirdparty: '/icones/ThirdParty.png',
  visualeditor: '/icones/VisualEditor.png',
  vtexhelp: '/icones/VTEXHelp.png',
  projects: '/icones/Projects.png'
};

export const ChatCanvas: React.FC = () => {
  const navigate = useNavigate();
  const { selectedAgent } = useOutletContext<OutletCtx>();
  const [searchParams] = useSearchParams();
  const [isCanvasOpen, setIsCanvasOpen] = useState(true);
  const [chatTab, setChatTab] = useState<ChatTab>('chat');
  const [canvasTab, setCanvasTab] = useState<CanvasTab>('preview');
  const [splitRatio, setSplitRatio] = useState<number>(0.5); // canvas 50%, chat 50%
  const [isResizing, setIsResizing] = useState<boolean>(false);

  useEffect(() => {
    const handleMouseMove = (e: MouseEvent) => {
      if (!isResizing) return;
      const container = document.getElementById('chat-canvas-container');
      if (!container) return;
      const rect = container.getBoundingClientRect();
      const relativeX = e.clientX - rect.left; // px from left in container
      const ratio = Math.min(Math.max(relativeX / rect.width, 0.25), 0.75); // chat width
      setSplitRatio(1 - ratio); // canvas ratio on the right side
    };
    const handleMouseUp = () => setIsResizing(false);
    if (isResizing) {
      window.addEventListener('mousemove', handleMouseMove);
      window.addEventListener('mouseup', handleMouseUp);
    }
    return () => {
      window.removeEventListener('mousemove', handleMouseMove);
      window.removeEventListener('mouseup', handleMouseUp);
    };
  }, [isResizing]);

  const agentName = useMemo(() => selectedAgent ? selectedAgent : 'FastStore Visual Editor', [selectedAgent]);
  const agentIcon = useMemo(() => agentIconById[selectedAgent || 'visualeditor'] || '/icones/VisualEditor.png', [selectedAgent]);
  const taskTitle = searchParams.get('title') || 'Create product launch landing page';

  const mockMessages: ChatMessage[] = [
    {
      id: 'm1',
      role: 'system',
      content:
        "Okay, Daniel. Thank you for the context of your business. This information will be very important for setting up the configurations of your B2B operation.\n\nLet's jump to the topic of Integrations and External Services.\n\nWill catalog, pricing, inventory, and order management be done via ERP?"
    },
    { id: 'm2', role: 'user', content: 'Yes.' },
    { id: 'm3', role: 'system', content: 'Will there be integration with other systems?' },
    { id: 'm4', role: 'user', content: ['CRM', 'PIM', 'Fraud prevention', 'Logistics', 'BI'] },
    { id: 'm5', role: 'system', content: 'Does the ERP already have API integration with VTEX?' },
    { id: 'm6', role: 'user', content: 'No.' },
    {
      id: 'm7',
      role: 'system',
      content:
        "Understood. In that case, we will need to plan an integration layer. We can start by mapping master data: products, prices, and inventory. Then, we define the order flow and webhooks for status updates.\n\nDo you already have SLAs for synchronization frequency?"
    },
    {
      id: 'm8',
      role: 'user',
      content:
        "Products and prices every 30 minutes, inventory near real-time if possible. Orders can be synchronous with callbacks for updates."
    },
    {
      id: 'm9',
      role: 'system',
      content:
        "Perfect. We can use queues for inventory to ensure resilience and eventual consistency. For pricing, we will validate whether your ERP exposes breaks or special conditions for B2B customers."
    },
    { id: 'm10', role: 'user', content: 'Yes, there are price lists per customer segment and contract.' },
    {
      id: 'm11',
      role: 'system',
      content:
        "Great. We will model that as price tables and promotions with eligibility rules. Now, about checkout: will you require split shipments or multiple sellers in the same order?"
    },
    { id: 'm12', role: 'user', content: 'Yes, multiple warehouses. Split shipment is okay.' },
    {
      id: 'm13',
      role: 'system',
      content:
        "Noted. We will enable shipping policies by region and warehouse priority. For payments, do you use a PSP or require invoice/PO approvals?"
    },
    { id: 'm14', role: 'user', content: 'We need PO approvals and NET-30 invoicing for some buyers.' },
    {
      id: 'm15',
      role: 'system',
      content:
        "Understood. We will configure custom payment terms and an approval workflow. Next, let’s define content requirements for the landing page. Do you have brand guidelines?"
    },
    {
      id: 'm16',
      role: 'user',
      content:
        "Yes. Use our primary blue for CTAs, generous whitespace, and Inter for typography. Hero should highlight the new product line with a strong value proposition."
    },
    {
      id: 'm17',
      role: 'system',
      content:
        "I will draft a hero section with headline, subcopy, and primary CTA. Below, we will add a three-column benefit section and social proof. Do you want a pricing block?"
    },
    { id: 'm18', role: 'user', content: 'Yes, but keep it simple: three tiers with monthly pricing.' },
    {
      id: 'm19',
      role: 'system',
      content:
        "Got it. I will also propose a FAQ and a contact section at the bottom. For the canvas preview, we’ll enable a code view that mirrors the current layout structure."
    },
    {
      id: 'm20',
      role: 'user',
      content:
        "Sounds good. Please share the initial draft so I can review copy and spacing."
    },
    {
      id: 'm21',
      role: 'system',
      content:
        "Drafting now. Meanwhile, could you provide any specific assets (logos, product images) and a short elevator pitch (one sentence)?"
    },
    {
      id: 'm22',
      role: 'user',
      content:
        "Uploading assets shortly. Elevator pitch: ‘Experience unmatched performance with seamless B2B workflows designed for scale.’"
    },
    {
      id: 'm23',
      role: 'system',
      content:
        "Thanks. I’ll incorporate that into the hero. Also, do you prefer light or dark hero treatment over imagery?\n\nI generated a first canvas draft. You can open it here:",
      actionCard: {
        title: 'New Carousel Banner',
        description: 'Canvas interativo',
        thumbnailUrl: '/icones/Projects.png'
      }
    },
    { id: 'm24', role: 'user', content: 'Light, with subtle gradient and high contrast text.' },
    {
      id: 'm25',
      role: 'system',
      content:
        "Acknowledged. I will ensure accessibility with sufficient contrast ratios and keyboard navigation. The layout will be responsive across breakpoints and align with your type scale."
    },
    {
      id: 'm26',
      role: 'user',
      content:
        "Please keep the content width matching the prompt input and keep the spacing breathable."
    },
    {
      id: 'm27',
      role: 'system',
      content:
        "Understood. I’ll constrain chat and content containers to the same max widths and apply consistent paddings."
    },
    { id: 'm28', role: 'user', content: 'Perfect. Proceed.' },
    {
      id: 'm29',
      role: 'system',
      content:
        "Sharing the first pass shortly. I’ll annotate sections where I need your input on copy tone and CTA verbs."
    },
    {
      id: 'm30',
      role: 'user',
      content:
        "Great. I’ll review and leave comments as soon as it’s ready."
    }
  ];

  const renderMessage = (msg: ChatMessage) => {
    if (msg.role === 'system') {
      return (
        <div key={msg.id} className="w-full flex">
          <div className="text-[15px] max-w-[80%]" style={{ color: 'var(--text-primary)', lineHeight: '28px', letterSpacing: '-0.01em', fontWeight: 400 }}>
            {typeof msg.content === 'string' ? (
              msg.content.split('\n').map((p, i) => (
                <p key={i} className="mb-4 last:mb-0">{p}</p>
              ))
            ) : (
              <div />
            )}
            {msg.actionCard && (
              <div style={{ backgroundColor: 'transparent' }}>
                <button
                  onClick={() => { setIsCanvasOpen(true); setCanvasTab('preview'); }}
                  className="canvas-card mt-4"
                  aria-label="Open generated canvas"
                  style={{ backgroundColor: 'transparent' }}
                >
                <div style={{ display: 'flex', flexDirection: 'column', alignItems: 'flex-start', justifyContent: 'center', height: '100%' }}>
                  <span style={{ fontWeight: 500, color: 'var(--text-primary)', fontSize: '14px', lineHeight: '24px', height: '24px' }}>{msg.actionCard.title}</span>
                  {msg.actionCard.description && (
                    <span style={{ color: '#3D3D3D', fontSize: '12px', fontWeight: 400, lineHeight: '18px', height: '18px' }}>{msg.actionCard.description}</span>
                  )}
                </div>
                <span style={{ color: 'var(--text-primary)', fontSize: '14px', fontWeight: 400 }}>Open</span>
                </button>
              </div>
            )}
          </div>
        </div>
      );
    }

    // user bubble à direita
    return (
      <div key={msg.id} className="w-full flex items-end justify-end gap-3">
        <div className="rounded-2xl px-4 py-1.5 max-w-[80%]" style={{ backgroundColor: '#eef0f2', color: 'var(--text-primary)' }}>
          {Array.isArray(msg.content) ? (
            <ul className="list-none m-0 p-0 space-y-1">
              {msg.content.map((line, i) => (
                <li key={i} className="text-[15px]" style={{ lineHeight: '28px', letterSpacing: '-0.01em', fontWeight: 400 }}>{line}</li>
              ))}
            </ul>
          ) : (
            <span className="text-[15px]" style={{ lineHeight: '28px', letterSpacing: '-0.01em', fontWeight: 400 }}>{msg.content}</span>
          )}
        </div>
        <img src="/icones/User.png" alt="User" className="w-8 h-8 rounded-full" onError={(e) => { (e.currentTarget as HTMLImageElement).style.display = 'none'; }} />
      </div>
    );
  };

  return (
    <div className="min-h-screen" style={{ backgroundColor: 'var(--bg-secondary)' }}>
      {/* Topbar principal (64px) */}
      <div className="w-full flex items-center justify-between px-5 sticky top-0 z-40" style={{ height: 64, backgroundColor: 'var(--bg-primary)', borderBottom: '1px solid var(--border-primary)' }}>
        {/* Esquerda: ícone do agente (clique volta para Home) + título da task */}
        <div className="flex items-center gap-3">
          <button onClick={() => navigate('/')} aria-label="Go to agent home" className="close-button">
            <img src={agentIcon} alt="Agent" className="w-6 h-6" onError={(e) => { (e.currentTarget as HTMLImageElement).style.display = 'none'; }} />
          </button>
          <div className="faststore-title" style={{ lineHeight: '20px', whiteSpace: 'nowrap', overflow: 'hidden', textOverflow: 'ellipsis' }}>{taskTitle}</div>
        </div>
        {/* Direita: ação NewTask / Pin / More */}
        <div className="flex items-center gap-2">
          <ActionButton onClick={() => navigate('/chat-canvas')} className="flex items-center gap-2">
            <img 
              src="/icones/NewTask.png" 
              alt="New task"
              className="w-4 h-4"
              onError={(e) => { (e.currentTarget as HTMLImageElement).style.display = 'none'; }}
            />
            New task
          </ActionButton>
          <ActionButton>
            <img src="/icones/Pin.png" alt="Pin" className="w-4 h-4" />
          </ActionButton>
          <ActionButton>
            <span className="text-lg" style={{ lineHeight: 0 }}>⋯</span>
          </ActionButton>
        </div>
      </div>

      {/* Área abaixo: split chat/canvas */}
      <div id="chat-canvas-container" className="flex" style={{ minHeight: 'calc(100vh - 64px)', userSelect: isResizing ? 'none' : 'auto' }}>
        {/* CHAT */}
        <section 
          className="flex flex-col chat-section" 
          style={{
            borderRight: isCanvasOpen ? '1px solid var(--border-primary)' : 'none',
            backgroundColor: 'var(--bg-primary)',
            height: 'calc(100vh - 64px)',
            flexBasis: isCanvasOpen ? `${(1 - splitRatio) * 100}%` : '100%',
            minWidth: 0,
            position: 'relative'
          }}
        >
          {/* Resize hint line */}
          {isCanvasOpen && (
            <div
              className="resize-hint"
              onMouseDown={() => setIsResizing(true)}
              style={{
                position: 'absolute',
                right: -3,
                top: 0,
                width: 6,
                height: '100%',
                cursor: 'col-resize',
                zIndex: 10
              }}
            />
          )}
          {/* Chat header (64px) com pills - esquerda */}
          <div className="chat-pills flex items-center px-4 sticky top-0 z-30" style={{ backgroundColor: 'var(--bg-primary)', borderBottom: '1px solid var(--border-primary)' }}>
            <div className="flex items-center gap-2">
              {(['chat','content','styles'] as ChatTab[]).map(tab => (
                <button
                  key={tab}
                  onClick={() => setChatTab(tab)}
                  className={`chat-pill ${chatTab === tab ? 'active' : ''}`}
                >
                  {tab.charAt(0).toUpperCase() + tab.slice(1)}
                </button>
              ))}
            </div>
          </div>

          {/* Chat body - largura igual ao PromptInput */}
          <div className="flex-1 overflow-auto pt-6 px-6 pb-0">
            <div className="mx-auto w-full max-w-[768px]">
              {chatTab === 'chat' ? (
                <div className="space-y-[60px]">
                  {mockMessages.map(renderMessage)}
                </div>
              ) : (
                <div className="text-sm" style={{ color: 'var(--text-secondary)' }}>
                  {chatTab === 'content' && 'Content view (resumos, assets)...'}
                  {chatTab === 'styles' && 'Styles view (tokens, tipografia)...'}
                </div>
              )}
            </div>
          </div>

          {/* Prompt input fixo na base (sem pre-prompts) - mesmas max-ws */}
          <div className="px-6 pb-6 pt-4 sticky bottom-0 z-5" style={{ backgroundColor: 'var(--bg-primary)' }}>
            <div className="mx-auto w-full max-w-[768px]">
              <PromptInput agentName={agentName} onSendMessage={(m) => console.log('send', m)} />
            </div>
          </div>
        </section>


        {/* CANVAS */}
        {isCanvasOpen && (
          <section className="flex flex-col" style={{ backgroundColor: '#f0f0f0', height: 'calc(100vh - 64px)', flexBasis: `${splitRatio * 100}%`, minWidth: 0 }}>
            {/* Canvas header (64px) */}
            <div className="flex items-center justify-between px-4 sticky top-0 z-30" style={{ height: 64, borderBottom: '1px solid var(--border-primary)', backgroundColor: 'var(--bg-primary)' }}>
              <div className="flex items-center gap-3">
                <button
                  className="close-button"
                  onClick={() => setIsCanvasOpen(false)}
                  aria-label="Close canvas"
                  style={{ width: 32, height: 32, display: 'inline-flex', alignItems: 'center', justifyContent: 'center', borderRadius: 8 }}
                >
                  ✕
                </button>
                <div className="faststore-title">Canvas title</div>
              </div>
              <div className="flex items-center gap-2">
                <button className={`canvas-pill ${canvasTab === 'preview' ? 'active' : ''}`} onClick={() => setCanvasTab('preview')}>Preview</button>
                <button className={`canvas-pill ${canvasTab === 'code' ? 'active' : ''}`} onClick={() => setCanvasTab('code')}>Code</button>
              </div>
              <div className="flex items-center gap-2">
                <ActionButton>Share</ActionButton>
                <ActionButton>Export</ActionButton>
              </div>
            </div>

            {/* Canvas body */}
            <div className="flex-1 overflow-auto p-5" style={{ backgroundColor: '#f0f0f0' }}>
              {canvasTab === 'preview' ? (
                <div 
                  className="w-full h-full bg-white rounded-xl border"
                  style={{ 
                    borderColor: '#ffffff',
                    borderWidth: '12px',
                    minHeight: '400px'
                  }}
                >
                  {/* Área de preview do site */}
                  <iframe
                    src="https://www.vivara.com.br/?srsltid=AfmBOor8j6dYFuVYMKFgbxLkTlTZav0ularrfCtuxV9H-eM4Ix-ZYB5D"
                    className="w-full h-full rounded-lg"
                    style={{ border: 'none' }}
                    title="Website Preview"
                  />
                </div>
              ) : (
                <div 
                  className="w-full h-full bg-gray-900 rounded-xl"
                  style={{ 
                    minHeight: '400px'
                  }}
                >
                  {/* Code editor */}
                  <div className="p-4 h-full">
                    <div className="flex items-center gap-2 mb-4">
                      <div className="w-3 h-3 rounded-full bg-red-500"></div>
                      <div className="w-3 h-3 rounded-full bg-yellow-500"></div>
                      <div className="w-3 h-3 rounded-full bg-green-500"></div>
                      <span className="text-gray-400 text-sm ml-4">index.html</span>
                    </div>
                    <pre className="font-mono text-sm text-gray-300 whitespace-pre">
{`1  | <!DOCTYPE html>
2  | <html lang="en">
3  | <head>
4  |   <meta charset="UTF-8">
5  |   <title>Landing Page</title>
6  | </head>
7  | <body>
8  |   <h1>New Carousel Banner</h1>
9  |   <p>Canvas interativo</p>
10 | </body>
11 | </html>`}
                    </pre>
                  </div>
                </div>
              )}
            </div>
          </section>
        )}
      </div>
    </div>
  );
};
