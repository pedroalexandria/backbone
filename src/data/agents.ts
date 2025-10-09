export type Agent = {
  id: string;
  name: string;
  role: string;
  avatar: string; // path under /public/agents
  pinned?: boolean;
  queues?: number;
};

export const agents: Agent[] = [
  {
    id: 'insights',
    name: 'Insights Agent',
    role: 'Análises e recomendações',
    avatar: '/agents/insights.png',
    pinned: true,
    queues: 3
  },
  {
    id: 'salesassistant',
    name: 'Sales Assistant',
    role: 'Ajuda em produtos e vendas',
    avatar: '/agents/salesassistant.png'
  },
  {
    id: 'customerservice',
    name: 'Customer Service',
    role: 'Atendimento e suporte',
    avatar: '/agents/customerservice.png'
  }
];
