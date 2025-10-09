import React from 'react';
import { getAgentTasks } from '../data/mockTasks';

type Props = {
  selectedAgentId: string | null;
};

export function AgentPanel({ selectedAgentId }: Props) {
  const tasks = getAgentTasks(selectedAgentId);
  return (
    <div className="agent-panel-root">
      <div className="section-header">Tarefas</div>
      <ul className="mt-3 space-y-2">
        {tasks.slice(0, 5).map((t) => (
          <li key={t.id} className="task-row">
            <div className="task-title">{t.title}</div>
            {t.hasNotification && <span className="task-dot" />}
          </li>
        ))}
      </ul>
    </div>
  );
}
