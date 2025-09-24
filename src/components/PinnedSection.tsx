import React, { useEffect, useState } from 'react';
import { useNavigate } from 'react-router-dom';

const STAGGER_DELAY_MS = 70; // ajuste aqui o delay entre cards do grid

interface PinnedCard {
  id: string;
  title: string;
  description?: string;
  type: 'website' | 'metric' | 'task';
  image?: string;
  score?: number;
  status?: string;
  timeAgo?: string;
}

interface PinnedSectionProps {
  cards: PinnedCard[];
  animate?: boolean;
}

/**
 * Pinned section component with metric and task cards
 */
export const PinnedSection: React.FC<PinnedSectionProps> = ({ cards, animate = false }) => {
  const [showIndexes, setShowIndexes] = useState<boolean[]>([]);
  const navigate = useNavigate();

  useEffect(() => {
    if (!animate) return;
    setShowIndexes([]);
    const timeouts: number[] = [];
    cards.forEach((_, idx) => {
      const t = window.setTimeout(() => {
        setShowIndexes((prev) => {
          const next = [...prev];
          next[idx] = true;
          return next;
        });
      }, idx * STAGGER_DELAY_MS);
      timeouts.push(t);
    });
    return () => {
      timeouts.forEach((t) => window.clearTimeout(t));
    };
  }, [cards, animate]);

  const isShown = (index: number) => !animate || !!showIndexes[index];

  const handleNavigate = (title: string) => {
    const q = new URLSearchParams({ title }).toString();
    navigate(`/chat-canvas?${q}`);
  };

  const renderCard = (card: PinnedCard, index: number) => (
    <div
      key={card.id}
      className={`rounded-xl shadow-sm border stagger-item ${isShown(index) ? 'show' : ''} ${card.type === 'task' ? 'p-5 task-card' : 'p-4'}`}
      style={{ backgroundColor: 'var(--bg-primary)' }}
      onClick={() => handleNavigate(card.title)}
      role="button"
    >
      {card.type === 'website' && (
        <div>
          <div className="aspect-video rounded-lg mb-3 flex items-center justify-center" style={{ backgroundColor: 'var(--bg-tertiary)' }}>
            {card.image ? (
              <img src={card.image} alt={card.title} className="w-full h-full object-cover rounded-lg" />
            ) : (
              <div className="text-sm" style={{ color: 'var(--text-tertiary)' }}>Website Preview</div>
            )}
          </div>
          <h3 className="font-semibold text-sm" style={{ color: 'var(--text-primary)' }}>{card.title}</h3>
        </div>
      )}

      {card.type === 'metric' && (
        <div className="text-center">
          <div className="w-16 h-16 mx-auto mb-3 relative">
            <svg className="w-full h-full transform -rotate-90" viewBox="0 0 100 100">
              <circle cx="50" cy="50" r="40" stroke="var(--border-primary)" strokeWidth="8" fill="none" />
              <circle cx="50" cy="50" r="40" stroke="#10b981" strokeWidth="8" fill="none" strokeDasharray={`${(card.score || 0) * 2.51} 251`} strokeLinecap="round" />
            </svg>
            <div className="absolute inset-0 flex items-center justify-center">
              <span className="text-lg font-bold" style={{ color: 'var(--text-primary)' }}>{card.score}</span>
            </div>
          </div>
          <h3 className="font-semibold text-sm mb-1" style={{ color: 'var(--text-primary)' }}>{card.title}</h3>
          <p className="text-xs" style={{ color: 'var(--text-secondary)' }}>{card.status}</p>
        </div>
      )}

      {card.type === 'task' && (
        <div>
          <h3
            className="mb-2 line-clamp-2"
            style={{
              color: 'var(--text-primary)',
              fontFamily: 'Inter, sans-serif',
              fontWeight: 600,
              fontSize: 16,
              lineHeight: '140%',
              letterSpacing: '-0.03em',
              minHeight: '44.8px',
              overflow: 'hidden'
            }}
          >
            {card.title}
          </h3>
          {card.description && (
            <p className="line-clamp-2" style={{ color: '#707070', fontFamily: 'Inter, sans-serif', fontWeight: 400, fontSize: 13, lineHeight: '20px', letterSpacing: '-0.01em' }}>
              {card.description}
            </p>
          )}
          {card.timeAgo && (
            <p className={card.description ? 'mt-5' : ''} style={{ color: 'var(--text-tertiary)', fontFamily: 'Inter, sans-serif', fontWeight: 400, fontSize: 12, letterSpacing: '-0.01em' }}>
              {card.timeAgo}
            </p>
          )}
        </div>
      )}
    </div>
  );

  return (
    <div className="mx-auto w-full max-w-[960px] sm:max-w-[640px] md:max-w-[720px] lg:max-w-[960px] xl:max-w-[1120px] 2xl:max-w-[1280px] px-4">
      <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-4 md:gap-5">
        {cards.map((card, i) => renderCard(card, i))}
      </div>
    </div>
  );
};
