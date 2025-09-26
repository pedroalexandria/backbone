import React, { useEffect, useMemo, useRef, useState } from 'react';
import { useNavigate, useOutletContext, useSearchParams } from 'react-router-dom';
import { PromptInput, LoadingSpinner, TypingIndicator } from '@/components';
import { gptService, GPTMessage } from '@/services/gptService';

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

// Botão icônico padronizado (32x32, raio 8) igual ao estilo do header
const IconButton: React.FC<React.ButtonHTMLAttributes<HTMLButtonElement>> = (props) => (
  <button
    {...props}
    className={`h-8 w-8 border inline-flex items-center justify-center transition-colors ${props.className || ''}`}
    style={{
      borderColor: 'var(--border-primary)',
      color: 'var(--text-secondary)',
      fontFamily: 'Inter, sans-serif',
      fontWeight: 500,
      fontSize: 16,
      letterSpacing: '-0.02em',
      borderRadius: 8,
      ...(props.style as React.CSSProperties)
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
  const [isCanvasVisible, setIsCanvasVisible] = useState<boolean>(true); // mantém montado p/ animar saída
  const closeTimeoutRef = useRef<number | null>(null);
  // modo code simples (sem explorer/abas)
  
  // Estado para drag and drop dos banners
  const [banners, setBanners] = useState([
    { id: '1', img: 'https://images.unsplash.com/photo-1512436991641-6745cdb1723f?w=64', title: 'Enjoy the happy moments', desc: 'Checkout the new summer collection.' },
    { id: '2', img: 'https://images.unsplash.com/photo-1519681393784-d120267933ba?w=64', title: 'Get yourself a pair of Jordans!', desc: 'Check out the latest Jordan Air collection and find the perfect pair to...' },
    { id: '3', img: 'https://images.unsplash.com/photo-1519741497674-611481863552?w=64', title: 'Game-Changing Kicks Just Landed.', desc: 'The new Nike collection is here — fast, bold, unstoppable.' },
    { id: '4', img: 'https://images.unsplash.com/photo-1519744792095-2f2205e87b6f?w=64', title: 'Fresh Looks. Fierce Performance.', desc: 'Meet the shoes redefining comfort and control. Available now.' },
    { id: '5', img: 'https://images.unsplash.com/photo-1518544801976-3e159e50e5bb?w=64', title: 'Unleash New Energy.', desc: "Nike's newest silhouettes are made to move. Grab your pair." },
  ]);
  const [draggedItem, setDraggedItem] = useState<string | null>(null);
  const [dragOverItem, setDragOverItem] = useState<string | null>(null);
  
  // Estado para chat real com GPT
  const [realMessages, setRealMessages] = useState<ChatMessage[]>([]);
  const [isLoading, setIsLoading] = useState(false);
  
  // Ref para o container do chat
  const chatContainerRef = useRef<HTMLDivElement>(null);

  // Função para scroll automático
  const scrollToBottom = () => {
    if (chatContainerRef.current) {
      // Usa setTimeout para garantir que o DOM foi atualizado
      setTimeout(() => {
        if (chatContainerRef.current) {
          chatContainerRef.current.scrollTo({
            top: chatContainerRef.current.scrollHeight,
            behavior: 'smooth'
          });
        }
      }, 50);
    }
  };

  // Scroll automático quando mensagens mudam
  useEffect(() => {
    // Delay maior para garantir que as animações CSS terminaram
    const timer = setTimeout(() => {
      scrollToBottom();
    }, 100);
    
    return () => clearTimeout(timer);
  }, [realMessages, isLoading]);

  const highlight = (code: string, lang: string): string => {
    // Syntax highlighting melhorado com mais cores e indentação
    let html = code
      .replace(/&/g, '&amp;')
      .replace(/</g, '&lt;')
      .replace(/>/g, '&gt;');
    
    if (lang === 'html') {
      html = html
        // Comentários HTML primeiro
        .replace(/(&lt;!--[\s\S]*?--&gt;)/g, '<span class="tok-cmt">$1</span>')
        // CSS dentro de style tags
        .replace(/(&lt;style[^&]*&gt;)([\s\S]*?)(&lt;\/style&gt;)/g, (match, open, css, close) => {
          const highlightedCss = css
            // Comentários CSS
            .replace(/(\/\*[\s\S]*?\*\/)/g, '<span class="tok-cmt">$1</span>')
            // Seletores CSS (mais específico)
            .replace(/([.#]?[\w-]+)\s*\{/g, '<span class="tok-selector">$1</span> {')
            // Propriedades CSS
            .replace(/([\w-]+)\s*:/g, '<span class="tok-prop">$1</span>:')
            // Valores CSS (incluindo cores hex, px, etc)
            .replace(/:\s*([^;]+);/g, ': <span class="tok-value">$1</span>;');
          return open + highlightedCss + close;
        })
        // Tags HTML (mais específico)
        .replace(/(&lt;\/?)([\w-]+)([^&]*?&gt;)/g, '$1<span class="tok-tag">$2</span>$3')
        // Atributos HTML
        .replace(/([\w-]+)=(&quot;[^&]*?&quot;)/g, '<span class="tok-attr">$1</span>=<span class="tok-str">$2</span>');
    }
    
    if (lang === 'css') {
      html = html
        .replace(/(\/\*[\s\S]*?\*\/)/g, '<span class="tok-cmt">$1</span>')
        .replace(/("[^"]*"|'[^']*')/g, '<span class="tok-str">$1</span>')
        .replace(/\b(const|let|var|export|import|return|if|else|function|from|as|type|interface|extends|new)\b/g, '<span class="tok-kw">$1</span>');
    }

    if (lang === 'ts' || lang === 'tsx' || lang === 'js') {
      html = html
        .replace(/(\/\*\*[\s\S]*?\*\/)/g, '<span class="tok-doc">$1</span>')
        .replace(/(\/\*[\s\S]*?\*\/|\/\/.*?$)/gm, '<span class="tok-cmt">$1</span>')
        .replace(/\b(import|from|export|return|if|else|function|const|let|var|new|await|async|try|catch|finally|throw|switch|case|break|continue)\b/g, '<span class="tok-kw">$1</span>')
        .replace(/(`[^`]*`|"[^"]*"|'[^']*')/g, '<span class="tok-str">$1</span>')
        .replace(/\b(0x[\da-fA-F]+|\d+\.?\d*)\b/g, '<span class="tok-num">$1</span>')
        .replace(/(:\s*)([A-Za-z_][\w<>,\s\[\]?]*)/g, '$1<span class="tok-type">$2</span>')
        .replace(/\b(Promise|Request|Response|Record|Array|string|number|boolean|unknown|any|void|never)\b/g, '<span class="tok-type">$1</span>')
        .replace(/\bfunction\s+([A-Za-z_][\w]*)/g, 'function <span class="tok-func">$1</span>')
        .replace(/(@[A-Za-z_][\w]*)/g, '<span class="tok-annot">$1</span>')
        .replace(/(===|!==|==|!=|=>|>=|<=|\+\+|--|\+|-|\*|\/|%=|=)/g, '<span class="tok-op">$1</span>');
    }
    return html;
  };

  // Código HTML de um site para simular
  const codeHtml = `<!DOCTYPE html>
<html lang="pt-BR">
<head>
    <meta charset="UTF-8">
    <meta name="viewport" content="width=device-width, initial-scale=1.0">
    <title>Landing Page - Produto Incrível</title>
    <style>
        * {
            margin: 0;
            padding: 0;
            box-sizing: border-box;
        }
        
        body {
            font-family: 'Inter', -apple-system, BlinkMacSystemFont, sans-serif;
            line-height: 1.6;
            color: #333;
            background: linear-gradient(135deg, #667eea 0%, #764ba2 100%);
        }
        
        .container {
            max-width: 1200px;
            margin: 0 auto;
            padding: 0 20px;
        }
        
        header {
            background: rgba(255, 255, 255, 0.95);
            backdrop-filter: blur(10px);
            position: fixed;
            width: 100%;
            top: 0;
            z-index: 1000;
            box-shadow: 0 2px 20px rgba(0, 0, 0, 0.1);
        }
        
        nav {
            display: flex;
            justify-content: space-between;
            align-items: center;
            padding: 1rem 0;
        }
        
        .logo {
            font-size: 1.5rem;
            font-weight: 700;
            color: #667eea;
        }
        
        .nav-links {
            display: flex;
            list-style: none;
            gap: 2rem;
        }
        
        .nav-links a {
            text-decoration: none;
            color: #333;
            font-weight: 500;
            transition: color 0.3s ease;
        }
        
        .nav-links a:hover {
            color: #667eea;
        }
        
        .cta-button {
            background: linear-gradient(45deg, #667eea, #764ba2);
            color: white;
            padding: 0.75rem 1.5rem;
            border: none;
            border-radius: 25px;
            font-weight: 600;
            cursor: pointer;
            transition: transform 0.3s ease;
        }
        
        .cta-button:hover {
            transform: translateY(-2px);
        }
        
        .hero {
            padding: 120px 0 80px;
            text-align: center;
            color: white;
        }
        
        .hero h1 {
            font-size: 3.5rem;
            font-weight: 800;
            margin-bottom: 1rem;
            background: linear-gradient(45deg, #fff, #f0f0f0);
            -webkit-background-clip: text;
            -webkit-text-fill-color: transparent;
            background-clip: text;
        }
        
        .hero p {
            font-size: 1.25rem;
            margin-bottom: 2rem;
            opacity: 0.9;
        }
        
        .hero-buttons {
            display: flex;
            gap: 1rem;
            justify-content: center;
            flex-wrap: wrap;
        }
        
        .btn-primary {
            background: white;
            color: #667eea;
            padding: 1rem 2rem;
            border: none;
            border-radius: 30px;
            font-weight: 600;
            font-size: 1.1rem;
            cursor: pointer;
            transition: all 0.3s ease;
        }
        
        .btn-primary:hover {
            transform: translateY(-3px);
            box-shadow: 0 10px 30px rgba(0, 0, 0, 0.2);
        }
        
        .btn-secondary {
            background: transparent;
            color: white;
            padding: 1rem 2rem;
            border: 2px solid white;
            border-radius: 30px;
            font-weight: 600;
            font-size: 1.1rem;
            cursor: pointer;
            transition: all 0.3s ease;
        }
        
        .btn-secondary:hover {
            background: white;
            color: #667eea;
        }
        
        .features {
            padding: 80px 0;
            background: white;
        }
        
        .features h2 {
            text-align: center;
            font-size: 2.5rem;
            margin-bottom: 3rem;
            color: #333;
        }
        
        .features-grid {
            display: grid;
            grid-template-columns: repeat(auto-fit, minmax(300px, 1fr));
            gap: 2rem;
        }
        
        .feature-card {
            text-align: center;
            padding: 2rem;
            border-radius: 15px;
            background: #f8f9ff;
            transition: transform 0.3s ease;
        }
        
        .feature-card:hover {
            transform: translateY(-5px);
        }
        
        .feature-icon {
            width: 60px;
            height: 60px;
            background: linear-gradient(45deg, #667eea, #764ba2);
            border-radius: 50%;
            margin: 0 auto 1rem;
            display: flex;
            align-items: center;
            justify-content: center;
            color: white;
            font-size: 1.5rem;
        }
        
        .feature-card h3 {
            font-size: 1.5rem;
            margin-bottom: 1rem;
            color: #333;
        }
        
        .feature-card p {
            color: #666;
            line-height: 1.6;
        }
        
        .testimonials {
            padding: 80px 0;
            background: linear-gradient(135deg, #f093fb 0%, #f5576c 100%);
            color: white;
        }
        
        .testimonials h2 {
            text-align: center;
            font-size: 2.5rem;
            margin-bottom: 3rem;
        }
        
        .testimonial-grid {
            display: grid;
            grid-template-columns: repeat(auto-fit, minmax(300px, 1fr));
            gap: 2rem;
        }
        
        .testimonial-card {
            background: rgba(255, 255, 255, 0.1);
            padding: 2rem;
            border-radius: 15px;
            backdrop-filter: blur(10px);
        }
        
        .testimonial-text {
            font-style: italic;
            margin-bottom: 1rem;
            font-size: 1.1rem;
        }
        
        .testimonial-author {
            font-weight: 600;
        }
        
        footer {
            background: #333;
            color: white;
            padding: 40px 0;
            text-align: center;
        }
        
        @media (max-width: 768px) {
            .hero h1 {
                font-size: 2.5rem;
            }
            
            .nav-links {
                display: none;
            }
            
            .hero-buttons {
                flex-direction: column;
                align-items: center;
            }
        }
    </style>
</head>
<body>
    <header>
        <nav class="container">
            <div class="logo">ProdutoInc</div>
            <ul class="nav-links">
                <li><a href="#home">Início</a></li>
                <li><a href="#features">Recursos</a></li>
                <li><a href="#testimonials">Depoimentos</a></li>
                <li><a href="#contact">Contato</a></li>
            </ul>
            <button class="cta-button">Começar Agora</button>
        </nav>
    </header>

    <main>
        <section class="hero" id="home">
            <div class="container">
                <h1>Transforme Sua Vida Hoje</h1>
                <p>Descubra a solução revolucionária que milhares de pessoas já estão usando para alcançar seus objetivos.</p>
                <div class="hero-buttons">
                    <button class="btn-primary">Experimentar Grátis</button>
                    <button class="btn-secondary">Ver Demonstração</button>
                </div>
            </div>
        </section>

        <section class="features" id="features">
            <div class="container">
                <h2>Por Que Escolher Nosso Produto?</h2>
                <div class="features-grid">
                    <div class="feature-card">
                        <div class="feature-icon">⚡</div>
                        <h3>Super Rápido</h3>
                        <p>Nossa tecnologia de ponta garante velocidade incomparável em todas as operações.</p>
                    </div>
                    <div class="feature-card">
                        <div class="feature-icon">🔒</div>
                        <h3>100% Seguro</h3>
                        <p>Seus dados estão protegidos com criptografia de nível bancário e backup automático.</p>
                    </div>
                    <div class="feature-card">
                        <div class="feature-icon">📱</div>
                        <h3>Multiplataforma</h3>
                        <p>Funciona perfeitamente em desktop, tablet e smartphone com sincronização em tempo real.</p>
                    </div>
                </div>
            </div>
        </section>

        <section class="testimonials" id="testimonials">
            <div class="container">
                <h2>O Que Nossos Clientes Dizem</h2>
                <div class="testimonial-grid">
                    <div class="testimonial-card">
                        <p class="testimonial-text">"Este produto mudou completamente minha produtividade. Recomendo para todos!"</p>
                        <p class="testimonial-author">- Maria Silva, Empresária</p>
                    </div>
                    <div class="testimonial-card">
                        <p class="testimonial-text">"Interface intuitiva e resultados incríveis. Vale cada centavo investido."</p>
                        <p class="testimonial-author">- João Santos, Designer</p>
                    </div>
                    <div class="testimonial-card">
                        <p class="testimonial-text">"Suporte excepcional e produto de qualidade premium. Não consigo mais viver sem!"</p>
                        <p class="testimonial-author">- Ana Costa, Desenvolvedora</p>
                    </div>
                </div>
            </div>
        </section>
    </main>

    <footer>
        <div class="container">
            <p>&copy; 2024 ProdutoInc. Todos os direitos reservados.</p>
        </div>
    </footer>
</body>
</html>`;
  const codeLineCount = codeHtml.split('\n').length;

  const FolderIcon: React.FC<{ open?: boolean }> = ({ open }) => (
    <span style={{ color: '#f59e0b', display: 'inline-block', width: 14 }}>📂</span>
  );
  const FileIcon: React.FC<{ name: string }> = ({ name }) => {
    const ext = name.split('.').pop();
    const color = ext === 'tsx' || ext === 'ts' ? '#60a5fa' : ext === 'css' ? '#22d3ee' : '#f43f5e';
    return <span style={{ color, display: 'inline-block', width: 14 }}>📄</span>;
  };
  type SimpleFileNode = { type: 'file' | 'folder'; name: string; children?: SimpleFileNode[] };
  const TreeNode: React.FC<{
    node: SimpleFileNode;
    depth: number;
    activeFile: string;
    onOpenFile: (f: string) => void;
    expandedFolders: Record<string, boolean>;
    onToggleFolder: (name: string) => void;
  }> = ({ node, depth, activeFile, onOpenFile, expandedFolders, onToggleFolder }) => {
    const paddingLeft = 8 + depth * 12;
    if (node.type === 'file') {
      return (
        <div style={{ paddingLeft }}>
          <button
            className="w-full text-left px-2 py-1 ide-file-button"
            style={{ backgroundColor: activeFile === node.name ? '#111827' : 'transparent' }}
            onClick={() => onOpenFile(node.name)}
          >
            <FileIcon name={node.name} /> <span className="ml-1">{node.name}</span>
          </button>
        </div>
      );
    }
    const isOpen = !!expandedFolders[node.name];
    return (
      <div>
        <div style={{ paddingLeft }}>
          <button
            className="w-full text-left px-2 py-1 ide-file-button"
            onClick={() => onToggleFolder(node.name)}
          >
            <FolderIcon open={isOpen} /> <span className="ml-1">{node.name}</span>
          </button>
        </div>
        {isOpen && node.children?.map((child: SimpleFileNode) => (
          <TreeNode
            key={child.name}
            node={child}
            depth={depth + 1}
            activeFile={activeFile}
            onOpenFile={onOpenFile}
            expandedFolders={expandedFolders}
            onToggleFolder={onToggleFolder}
          />
        ))}
      </div>
    );
  };

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

  // Garante que ao abrir o canvas ele fique visível e cancela qualquer timeout pendente
  useEffect(() => {
    if (isCanvasOpen) {
      if (closeTimeoutRef.current) {
        window.clearTimeout(closeTimeoutRef.current);
        closeTimeoutRef.current = null;
      }
      setIsCanvasVisible(true);
    }
  }, [isCanvasOpen]);

  const agentName = useMemo(() => selectedAgent ? selectedAgent : 'FastStore Visual Editor', [selectedAgent]);
  const agentIcon = useMemo(() => agentIconById[selectedAgent || 'visualeditor'] || '/icones/VisualEditor.png', [selectedAgent]);
  const taskTitle = searchParams.get('title') || 'Create product launch landing page';

  // Handlers para drag and drop
  const handleDragStart = (e: React.DragEvent, bannerId: string) => {
    setDraggedItem(bannerId);
    e.dataTransfer.effectAllowed = 'move';
    e.dataTransfer.setData('text/html', bannerId);
  };

  const handleDragOver = (e: React.DragEvent, targetBannerId: string) => {
    e.preventDefault();
    e.dataTransfer.dropEffect = 'move';
    // Só atualiza se mudou de item para evitar re-renders desnecessários
    if (dragOverItem !== targetBannerId) {
      setDragOverItem(targetBannerId);
    }
  };

  const handleDrop = (e: React.DragEvent, targetBannerId: string) => {
    e.preventDefault();
    const draggedBannerId = e.dataTransfer.getData('text/html');
    
    if (draggedBannerId === targetBannerId) return;

    setBanners(prevBanners => {
      const newBanners = [...prevBanners];
      const draggedIndex = newBanners.findIndex(b => b.id === draggedBannerId);
      const targetIndex = newBanners.findIndex(b => b.id === targetBannerId);
      
      // Remove o item arrastado
      const [draggedBanner] = newBanners.splice(draggedIndex, 1);
      // Insere na nova posição
      newBanners.splice(targetIndex, 0, draggedBanner);
      
      return newBanners;
    });
    
    setDraggedItem(null);
  };

  const handleDragEnd = () => {
    setDraggedItem(null);
    setDragOverItem(null);
  };

  const handleDragLeave = (e: React.DragEvent) => {
    // Só limpa se realmente saiu do elemento (não de um child)
    if (!e.currentTarget.contains(e.relatedTarget as Node)) {
      setDragOverItem(null);
    }
  };

  // Função para enviar mensagem para GPT
  const sendMessageToGPT = async (message: string) => {
    if (!message.trim() || isLoading) return;

    setIsLoading(true);
    
    // Adiciona mensagem do usuário
    const userMessage: ChatMessage = {
      id: `user-${Date.now()}`,
      role: 'user',
      content: message,
    };
    
    setRealMessages(prev => [...prev, userMessage]);
    
    // Scroll imediatamente após adicionar mensagem do usuário
    setTimeout(scrollToBottom, 150);

    try {
      // Prepara mensagens para GPT (inclui histórico)
      const gptMessages: GPTMessage[] = [
        gptService.createSystemMessage(selectedAgent || 'ai1'),
        ...realMessages.map(msg => ({
          role: msg.role === 'system' ? 'assistant' as const : msg.role,
          content: typeof msg.content === 'string' ? msg.content : msg.content.join('\n'),
        })),
        { role: 'user' as const, content: message },
      ];

      // Chama API do GPT
      const response = await gptService.sendMessage(gptMessages);
      
      // Adiciona resposta do GPT diretamente (sem typing effect)
      const gptMessage: ChatMessage = {
        id: `gpt-${Date.now()}`,
        role: 'system',
        content: response.content,
      };
      
      setRealMessages(prev => [...prev, gptMessage]);
      
      // Scroll adicional quando a resposta chega
      setTimeout(scrollToBottom, 200);
      
    } catch (error) {
      console.error('Erro ao enviar mensagem para GPT:', error);
      
      // Adiciona mensagem de erro
      const errorMessageText = error instanceof Error && error.message.includes('quota') 
        ? 'Você excedeu a cota da sua conta OpenAI. Verifique seus créditos em https://platform.openai.com/account/billing'
        : 'Desculpe, ocorreu um erro ao processar sua mensagem. Verifique se a chave da API está configurada corretamente.';
        
      const errorMessage: ChatMessage = {
        id: `error-${Date.now()}`,
        role: 'system',
        content: errorMessageText,
      };
      
      setRealMessages(prev => [...prev, errorMessage]);
    } finally {
      setIsLoading(false);
    }
  };

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
        <div key={msg.id} className="w-full flex chat-message-system">
          <div className="text-[15px] max-w-[80%]" style={{ color: 'var(--text-primary)', lineHeight: '24px', letterSpacing: '-0.01em', fontWeight: 400 }}>
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
      <div key={msg.id} className="w-full flex items-end justify-end gap-3 chat-message-user">
        <div className="rounded-2xl px-4 py-1.5 max-w-[80%]" style={{ backgroundColor: '#eef0f2', color: 'var(--text-primary)' }}>
          {Array.isArray(msg.content) ? (
            <ul className="list-none m-0 p-0 space-y-1">
              {msg.content.map((line, i) => (
                <li key={i} className="text-[15px]" style={{ lineHeight: '24px', letterSpacing: '-0.01em', fontWeight: 400 }}>{line}</li>
              ))}
            </ul>
          ) : (
            <span className="text-[15px]" style={{ lineHeight: '24px', letterSpacing: '-0.01em', fontWeight: 400 }}>{msg.content}</span>
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
      <div
        id="chat-canvas-container"
        className="flex"
        style={{ minHeight: 'calc(100vh - 64px)', userSelect: isResizing ? 'none' : 'auto' }}
        onMouseUp={() => setIsResizing(false)}
        onMouseLeave={() => setIsResizing(false)}
      >
        {/* CHAT */}
        <section 
          className="flex flex-col chat-section chat-panel" 
          style={{
            borderRight: isCanvasVisible ? '1px solid var(--border-primary)' : 'none',
            backgroundColor: 'var(--bg-primary)',
            height: 'calc(100vh - 64px)',
            flexBasis: isCanvasVisible ? `${(1 - splitRatio) * 100}%` : '100%',
            minWidth: 0,
            position: 'relative'
          }}
        >
          {/* Resize hint line */}
          {isCanvasVisible && (
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
                zIndex: 1000
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
          <div ref={chatContainerRef} className="flex-1 overflow-auto pt-6 px-6 pb-8">
            <div className="mx-auto w-full max-w-[768px]">
              {chatTab === 'chat' ? (
                <div className="space-y-[60px] pb-4">
                  {/* Mostra mensagens reais se existirem, senão mostra mock */}
                  {(realMessages.length > 0 ? realMessages : mockMessages).map(renderMessage)}
                  
                  {/* Indicador de carregamento */}
                  {isLoading && (
                    <div className="w-full flex chat-message-loading">
                      <div className="text-[15px] max-w-[80%]" style={{ color: 'var(--text-primary)', lineHeight: '24px', letterSpacing: '-0.01em', fontWeight: 400 }}>
                        <div className="flex items-center gap-2">
                          <LoadingSpinner size="sm" variant="modern" />
                          <TypingIndicator />
                        </div>
                      </div>
                    </div>
                  )}
                </div>
              ) : (
                <>
                  {chatTab === 'content' && (
                    <div className="w-full max-w-[768px]" style={{ backgroundColor: '#e8e8e8', borderRadius: 12 }}>
                      <div
                        className="bg-white rounded-xl"
                        style={{
                          borderBottomLeftRadius: 12,
                          borderBottomRightRadius: 12,
                          borderWidth: 0
                        }}
                      >
                        {/* Header breadcrumb + título */}
                        <div className="px-4 py-3">
                          <div className="flex items-center gap-2" style={{ fontSize: 14, letterSpacing: '-0.02em' }}>
                            <span style={{ color: 'var(--text-secondary)', fontWeight: 400 }}>Sections</span>
                            <span style={{ color: 'var(--text-secondary)' }}>/</span>
                            <span style={{ color: 'var(--text-primary)', fontWeight: 500 }}>Hero carousel</span>
                          </div>
                        </div>

                        {/* Card: Banners list */}
                        <div className="p-4">
                          <div className="rounded-xl border" style={{ borderColor: 'var(--border-primary)', backgroundColor: 'var(--bg-primary)', boxShadow: '0 1px 2px rgba(0, 0, 0, 0.16)' }}>
                            <div className="px-4 py-3 rounded-t-xl">
                              <div style={{ color: '#1F1F1F', fontFamily: 'Inter, sans-serif', fontWeight: 600, fontSize: 14, letterSpacing: '-0.02em' }}>Banners</div>
                            </div>

                            {/* Items */}
                            {banners.map((it, idx, arr) => (
                              <React.Fragment key={it.id}>
                                {/* Drop indicator - aparece antes do item quando está sendo arrastado sobre ele */}
                                {draggedItem && draggedItem !== it.id && dragOverItem === it.id && (
                                  <div 
                                    className="h-1 mx-3 my-1 rounded-full"
                                    style={{ backgroundColor: 'var(--ide-accent)' }}
                                  />
                                )}
                                
                                <div 
                                  className={`flex items-center gap-3 px-3 py-2 ${idx < arr.length - 1 ? 'border-b' : ''} ${draggedItem === it.id ? 'opacity-50' : ''}`} 
                                  style={{ borderColor: 'var(--border-primary)' }}
                                  draggable
                                  onDragStart={(e) => handleDragStart(e, it.id)}
                                  onDragOver={(e) => handleDragOver(e, it.id)}
                                  onDrop={(e) => handleDrop(e, it.id)}
                                  onDragEnd={handleDragEnd}
                                  onDragLeave={handleDragLeave}
                                  onDragEnter={(e) => {
                                    e.preventDefault();
                                    if (dragOverItem !== it.id) {
                                      setDragOverItem(it.id);
                                    }
                                  }}
                                >
                                  <IconButton aria-label="Drag" className="border-0 cursor-move" style={{ border: 'none', background: 'transparent', color: 'var(--text-tertiary)' }}>⋮⋮</IconButton>
                                  <img src={it.img} alt="thumb" className="w-10 h-10 rounded" />
                                  <div className="min-w-0 flex-1">
                                    <div className="truncate" style={{ color: 'var(--text-primary)', fontFamily: 'Inter, sans-serif', fontWeight: 500, fontSize: 14, letterSpacing: '-0.02em' }}>{it.title}</div>
                                    <div className="truncate" style={{ color: 'var(--text-secondary)', fontSize: 13, letterSpacing: '-0.02em' }}>{it.desc}</div>
                                  </div>
                                  <IconButton aria-label="More" className="border-0" style={{ border: 'none', background: 'transparent', color: 'var(--text-tertiary)' }}>⋯</IconButton>
                                </div>
                              </React.Fragment>
                            ))}

                            {/* Add banner */}
                            <div className="px-3 py-3">
                              <ActionButton className="flex items-center gap-2 w-full justify-center">
                                <span className="text-[16px]">＋</span>
                                <span>Add banner</span>
                              </ActionButton>
                            </div>
                          </div>
                        </div>

                        {/* Switch + selects + input */}
                        <div className="px-4 pb-4 space-y-4">
                          {/* Show controls */}
                          <div className="rounded-xl border" style={{ borderColor: 'var(--border-primary)', backgroundColor: 'var(--bg-primary)', boxShadow: '0 1px 2px rgba(0, 0, 0, 0.16)' }}>
                            <label className="flex items-center gap-3 px-4 py-3 cursor-pointer custom-checkbox">
                              <div className="relative">
                                <input 
                                  type="checkbox" 
                                  defaultChecked 
                                  className="sr-only" 
                                />
                                <div className="w-5 h-5 border-2 rounded border-gray-300 bg-white flex items-center justify-center transition-all duration-200 hover:border-gray-400">
                                  <svg 
                                    className="w-3 h-3 text-white opacity-0 transition-opacity duration-200" 
                                    fill="currentColor" 
                                    viewBox="0 0 20 20"
                                  >
                                    <path 
                                      fillRule="evenodd" 
                                      d="M16.707 5.293a1 1 0 010 1.414l-8 8a1 1 0 01-1.414 0l-4-4a1 1 0 011.414-1.414L8 12.586l7.293-7.293a1 1 0 011.414 0z" 
                                      clipRule="evenodd" 
                                    />
                                  </svg>
                                </div>
                              </div>
                              <span style={{ color: 'var(--text-primary)', fontSize: 14, letterSpacing: '-0.02em' }}>Show controls</span>
                            </label>
                          </div>

                          {/* Control type */}
                          <div className="rounded-xl border" style={{ borderColor: 'var(--border-primary)', backgroundColor: 'var(--bg-primary)', boxShadow: '0 1px 2px rgba(0, 0, 0, 0.16)' }}>
                            <div className="px-4 py-3">
                              <div style={{ color: '#1F1F1F', fontFamily: 'Inter, sans-serif', fontWeight: 600, fontSize: 14, letterSpacing: '-0.02em' }}>Control type</div>
                            </div>
                            <div className="p-4">
                              <select
                                className="w-full h-10 px-3 pr-16 rounded-lg border text-[14px]"
                                style={{
                                  borderColor: 'var(--border-primary)',
                                  background: 'white',
                                  fontFamily: 'Inter, sans-serif',
                                  WebkitAppearance: 'none',
                                  appearance: 'none',
                                  backgroundImage:
                                    "url('data:image/svg+xml;utf8,<svg xmlns=\"http://www.w3.org/2000/svg\" width=\"20\" height=\"20\" viewBox=\"0 0 24 24\" fill=\"none\" stroke=\"%231F1F1F\" stroke-width=\"2\" stroke-linecap=\"round\" stroke-linejoin=\"round\"><polyline points=\"6 9 12 15 18 9\"></polyline></svg>')",
                                  backgroundRepeat: 'no-repeat',
                                  backgroundPosition: 'right 12px center'
                                }}
                                defaultValue="dots"
                              >
                                <option value="dots">Dots</option>
                                <option value="arrows">Arrows</option>
                                <option value="none">None</option>
                              </select>
                            </div>
                          </div>

                          {/* Transition type */}
                          <div className="rounded-xl border" style={{ borderColor: 'var(--border-primary)', backgroundColor: 'var(--bg-primary)', boxShadow: '0 1px 2px rgba(0, 0, 0, 0.16)' }}>
                            <div className="px-4 py-3">
                              <div style={{ color: '#1F1F1F', fontFamily: 'Inter, sans-serif', fontWeight: 600, fontSize: 14, letterSpacing: '-0.02em' }}>Transition type</div>
                            </div>
                            <div className="p-4">
                              <select
                                className="w-full h-10 px-3 pr-16 rounded-lg border text-[14px]"
                                style={{
                                  borderColor: 'var(--border-primary)',
                                  background: 'white',
                                  fontFamily: 'Inter, sans-serif',
                                  WebkitAppearance: 'none',
                                  appearance: 'none',
                                  backgroundImage:
                                    "url('data:image/svg+xml;utf8,<svg xmlns=\"http://www.w3.org/2000/svg\" width=\"20\" height=\"20\" viewBox=\"0 0 24 24\" fill=\"none\" stroke=\"%231F1F1F\" stroke-width=\"2\" stroke-linecap=\"round\" stroke-linejoin=\"round\"><polyline points=\"6 9 12 15 18 9\"></polyline></svg>')",
                                  backgroundRepeat: 'no-repeat',
                                  backgroundPosition: 'right 12px center'
                                }}
                                defaultValue="slide-out"
                              >
                                <option value="slide-out">Slide out</option>
                                <option value="fade">Fade</option>
                                <option value="slide-in">Slide in</option>
                              </select>
                            </div>
                          </div>

                          {/* Delay time */}
                          <div className="rounded-xl border" style={{ borderColor: 'var(--border-primary)', backgroundColor: 'var(--bg-primary)', boxShadow: '0 1px 2px rgba(0, 0, 0, 0.16)' }}>
                            <div className="px-4 py-3">
                              <div style={{ color: '#1F1F1F', fontFamily: 'Inter, sans-serif', fontWeight: 600, fontSize: 14, letterSpacing: '-0.02em' }}>Delay time</div>
                            </div>
                            <div className="p-4 flex">
                              <input type="number" defaultValue={5} className="flex-1 h-10 px-3 rounded-l-lg border text-[14px]" style={{ borderColor: 'var(--border-primary)', background: 'white', fontFamily: 'Inter, sans-serif' }} />
                              <div className="h-10 px-3 flex items-center rounded-r-lg border-l-0 border text-[14px]" style={{ borderColor: 'var(--border-primary)', background: 'white', color: 'var(--text-secondary)', fontFamily: 'Inter, sans-serif' }}>sec.</div>
                            </div>
                          </div>
                        </div>
                      </div>
                    </div>
                  )}
                  {chatTab === 'styles' && (
                    <div className="text-sm" style={{ color: 'var(--text-secondary)' }}>Styles view (tokens, tipografia)...</div>
                  )}
                </>
              )}
            </div>
          </div>

          {/* Prompt input fixo na base (sem pre-prompts) - esconder quando Content ativo */}
          {chatTab !== 'content' && (
            <div className="px-6 pb-6 sticky bottom-0 z-5" style={{ background: 'transparent', position: 'relative' }}>
              {/* Overlay de gradiente sem criar espaço extra */}
              <div style={{
                position: 'absolute',
                left: 0,
                right: 0,
                bottom: 0,
                height: '56px',
                pointerEvents: 'none',
                background: 'linear-gradient(to top, var(--bg-primary) 0%, var(--bg-primary) 60%, transparent 100%)',
                zIndex: 1
              }} />
              <div className="mx-auto w-full max-w-[768px] py-4" style={{ position: 'relative', zIndex: 2 }}>
                <PromptInput agentName={agentName} onSendMessage={sendMessageToGPT} />
              </div>
            </div>
          )}
        </section>


        {/* CANVAS */}
        {isCanvasVisible && (
          <section
            className={`flex flex-col canvas-panel ${isCanvasOpen ? 'open' : ''}`}
            style={{
              backgroundColor: '#f0f0f0',
              height: 'calc(100vh - 64px)',
              flexBasis: `${splitRatio * 100}%`,
              minWidth: 0
            }}
          >
            {/* Canvas header (64px) */}
            <div className="flex items-center justify-between px-4 sticky top-0 z-30" style={{ height: 64, borderBottom: '1px solid var(--border-primary)', backgroundColor: 'var(--bg-primary)' }}>
              <div className="flex items-center gap-3">
                <button
                  className="close-button"
                  onClick={() => {
                    setIsCanvasOpen(false);
                    // aguarda animação para desmontar (sincronizado com CSS)
                    if (closeTimeoutRef.current) {
                      window.clearTimeout(closeTimeoutRef.current);
                    }
                    closeTimeoutRef.current = window.setTimeout(() => {
                      setIsCanvasVisible(false);
                      closeTimeoutRef.current = null;
                    }, 200);
                  }}
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
            <div
              className={"flex-1 overflow-auto px-5 pt-5 pb-0"}
              style={{ backgroundColor: '#f0f0f0' }}
            >
              {canvasTab === 'preview' ? (
                <div 
                  className="w-full h-full bg-white rounded-xl border"
                  style={{ 
                    borderColor: '#ffffff',
                    borderWidth: '12px',
                    minHeight: '400px',
                    borderBottomLeftRadius: 0,
                    borderBottomRightRadius: 0
                  }}
                >
                  {/* Área de preview do site */}
                  <iframe
                    src="https://www.vivara.com.br/?srsltid=AfmBOor8j6dYFuVYMKFgbxLkTlTZav0ularrfCtuxV9H-eM4Ix-ZYB5D"
                    className="w-full h-full rounded-lg"
                    style={{ border: 'none', pointerEvents: isResizing ? 'none' as const : 'auto' as const }}
                    title="Website Preview"
                  />
                </div>
              ) : (
                <div className="w-full h-full" style={{ minHeight: '400px' }}>
                  {/* Moldura igual ao preview: caixa branca com borda espessa e cantos arredondados */}
                  <div
                    className="w-full h-full bg-white rounded-xl border"
                    style={{ borderColor: 'var(--ide-bg)', borderWidth: '12px', minHeight: '400px', borderBottomLeftRadius: 0, borderBottomRightRadius: 0 }}
                  >
                    {/* Editor simples ocupando todo o container - dark mode interno */}
                    <div className="w-full h-full code-view">
                      <div className="h-full overflow-auto code-view">
                        <div className="flex rounded-lg overflow-hidden">
                          <div className="code-gutter py-5">
                            {Array.from({ length: codeLineCount }).map((_, i) => (
                              <div key={i} className="code-line">{i + 1}</div>
                            ))}
                          </div>
                          <pre className="font-mono whitespace-pre px-5 py-5 flex-1"
                            dangerouslySetInnerHTML={{ __html: highlight(codeHtml, 'html') }}
                          />
                        </div>
                      </div>
                    </div>
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
