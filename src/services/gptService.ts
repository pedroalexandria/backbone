// Serviço para integração com OpenAI GPT
export interface GPTMessage {
  role: 'system' | 'user' | 'assistant';
  content: string;
}

export interface GPTResponse {
  content: string;
  usage?: {
    prompt_tokens: number;
    completion_tokens: number;
    total_tokens: number;
  };
}

class GPTService {
  private apiKey: string;
  private baseUrl: string = 'https://api.openai.com/v1';
  private useHuggingFace: boolean = false;

  constructor() {
    // A chave da API será configurada via variável de ambiente
    this.apiKey = (import.meta as any).env?.VITE_OPENAI_API_KEY || '';
    
    // Se não tem chave OpenAI, usa modo demo
    if (!this.apiKey) {
      this.useHuggingFace = true;
      console.log('🔧 Modo Demo ativado - Sem chave de API OpenAI');
    }
  }

  async sendMessage(
    messages: GPTMessage[],
    model: string = 'gpt-3.5-turbo',
    temperature: number = 0.7
  ): Promise<GPTResponse> {
    // Se não tem chave ou excedeu cota, usa modo demo
    if (!this.apiKey || this.useHuggingFace) {
      return this.sendMessageDemo(messages);
    }

    try {
      const response = await fetch(`${this.baseUrl}/chat/completions`, {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
          'Authorization': `Bearer ${this.apiKey}`,
        },
        body: JSON.stringify({
          model,
          messages,
          temperature,
          max_tokens: 1000,
          stream: false,
        }),
      });

      if (!response.ok) {
        const errorData = await response.json();
        if (errorData.error?.message?.includes('quota')) {
          // Se excedeu cota, muda para modo demo
          this.useHuggingFace = true;
          return this.sendMessageDemo(messages);
        }
        throw new Error(`OpenAI API error: ${errorData.error?.message || 'Unknown error'}`);
      }

      const data = await response.json();
      
      return {
        content: data.choices[0]?.message?.content || 'No response received',
        usage: data.usage,
      };
    } catch (error) {
      console.error('Error calling OpenAI API:', error);
      // Em caso de erro, usa modo demo
      return this.sendMessageDemo(messages);
    }
  }

  private async sendMessageDemo(messages: GPTMessage[]): Promise<GPTResponse> {
    // Simula delay de API
    await new Promise(resolve => setTimeout(resolve, 1000 + Math.random() * 2000));

    const lastUserMessage = messages.filter(m => m.role === 'user').pop();
    if (!lastUserMessage) {
      return {
        content: 'Olá! Como posso ajudá-lo hoje?',
        usage: { prompt_tokens: 0, completion_tokens: 0, total_tokens: 0 }
      };
    }

    const userText = lastUserMessage.content.toLowerCase();
    
    // Respostas inteligentes baseadas no contexto
    const responses = [
      'Entendo sua pergunta. Vou analisar isso e fornecer uma solução adequada.',
      'Excelente pergunta! Baseado no contexto, posso sugerir algumas abordagens.',
      'Vou ajudá-lo com isso. Deixe-me pensar na melhor estratégia.',
      'Perfeito! Essa é uma questão importante que merece atenção.',
      'Entendo o que você precisa. Vou elaborar uma resposta detalhada.',
      'Ótima pergunta! Vou fornecer insights valiosos sobre esse tópico.',
      'Vou analisar sua solicitação e apresentar as melhores opções.',
      'Interessante! Deixe-me compartilhar algumas ideias sobre isso.',
      'Entendo perfeitamente. Vou criar uma solução personalizada para você.',
      'Excelente! Vou elaborar uma resposta completa e prática.'
    ];

    // Respostas específicas baseadas em palavras-chave
    if (userText.includes('vtex')) {
      return {
        content: 'Como especialista em VTEX, posso ajudá-lo com configurações da plataforma, desenvolvimento de componentes, otimização de performance e integrações. O que especificamente você gostaria de saber sobre VTEX?',
        usage: { prompt_tokens: 0, completion_tokens: 0, total_tokens: 0 }
      };
    }

    if (userText.includes('marketing') || userText.includes('campanha')) {
      return {
        content: 'Para estratégias de marketing e campanhas, recomendo focar em segmentação de público, análise de dados e otimização de conversão. Que tipo de campanha você está planejando?',
        usage: { prompt_tokens: 0, completion_tokens: 0, total_tokens: 0 }
      };
    }

    if (userText.includes('vendas') || userText.includes('venda')) {
      return {
        content: 'Para otimizar vendas, sugiro trabalhar com prospecção qualificada, follow-up sistemático e análise de funil de vendas. Qual etapa do processo de vendas você gostaria de melhorar?',
        usage: { prompt_tokens: 0, completion_tokens: 0, total_tokens: 0 }
      };
    }

    if (userText.includes('produto') || userText.includes('produtos')) {
      return {
        content: 'Para gestão de produtos, recomendo análise de catálogo, otimização de descrições, estratégias de pricing e recomendações personalizadas. Que aspecto da gestão de produtos você quer abordar?',
        usage: { prompt_tokens: 0, completion_tokens: 0, total_tokens: 0 }
      };
    }

    if (userText.includes('cliente') || userText.includes('atendimento')) {
      return {
        content: 'Para melhorar o atendimento ao cliente, sugiro implementar chatbots inteligentes, análise de sentimentos e estratégias de retenção. Como posso ajudá-lo a otimizar a experiência do cliente?',
        usage: { prompt_tokens: 0, completion_tokens: 0, total_tokens: 0 }
      };
    }

    // Resposta aleatória inteligente
    const randomResponse = responses[Math.floor(Math.random() * responses.length)];
    return {
      content: `${randomResponse}\n\n*Modo Demo: Esta é uma resposta simulada. Para respostas reais do GPT, configure uma chave de API válida.*`,
      usage: { prompt_tokens: 0, completion_tokens: 0, total_tokens: 0 }
    };
  }

  // Método para criar mensagens do sistema baseadas no agente selecionado
  createSystemMessage(agentName: string): GPTMessage {
    const agentPrompts: Record<string, string> = {
      'ad': 'Você é um assistente especializado em marketing digital e publicidade. Ajude com campanhas, segmentação de público e otimização de anúncios.',
      'ai1': 'Você é um assistente de IA geral, especializado em automação e inteligência artificial. Ajude com integração de sistemas e soluções de IA.',
      'campaigns': 'Você é um especialista em campanhas de marketing. Ajude com planejamento, execução e análise de campanhas digitais.',
      'customerservice': 'Você é um especialista em atendimento ao cliente. Ajude com estratégias de suporte, chatbots e experiência do cliente.',
      'fullfilment': 'Você é um especialista em fulfillment e logística. Ajude com otimização de processos de entrega e gestão de estoque.',
      'handling': 'Você é um especialista em gestão de processos. Ajude com automação de workflows e otimização de operações.',
      'insights': 'Você é um analista de dados especializado em insights de negócio. Ajude com análise de dados e relatórios estratégicos.',
      'offers': 'Você é um especialista em ofertas e promoções. Ajude com estratégias de pricing e campanhas promocionais.',
      'productrec': 'Você é um especialista em recomendação de produtos. Ajude com algoritmos de recomendação e personalização.',
      'salesassistant': 'Você é um assistente de vendas. Ajude com estratégias de vendas, prospecção e fechamento de negócios.',
      'search': 'Você é um especialista em busca e SEO. Ajude com otimização de motores de busca e estratégias de conteúdo.',
      'thirdparty': 'Você é um especialista em integrações de terceiros. Ajude com APIs, webhooks e integrações de sistemas.',
      'visualeditor': 'Você é um especialista em design visual e edição. Ajude com criação de conteúdo visual e design de interfaces.',
      'vtexhelp': 'Você é um especialista em VTEX. Ajude com configurações da plataforma, desenvolvimento e otimização de e-commerce.',
      'projects': 'Você é um gerente de projetos especializado em metodologias ágeis. Ajude com planejamento, execução e acompanhamento de projetos.',
    };

    const defaultPrompt = 'Você é um assistente inteligente especializado em e-commerce e tecnologia. Ajude com perguntas e tarefas relacionadas ao seu domínio.';

    return {
      role: 'system',
      content: agentPrompts[agentName] || defaultPrompt,
    };
  }
}

export const gptService = new GPTService();
