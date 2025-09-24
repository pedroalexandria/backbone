import React from 'react';
import { useNavigate } from 'react-router-dom';

interface TaskItemType {
  title: string;
  hasNotification?: boolean;
}

interface TaskItemProps {
  task: TaskItemType;
}

/**
 * Individual task item component
 */
export const TaskItem: React.FC<TaskItemProps> = ({ task }) => {
  const navigate = useNavigate();
  const handleClick = () => {
    const q = new URLSearchParams({ title: task.title }).toString();
    navigate(`/chat-canvas?${q}`);
  };
  return (
    <div
      className="task-item flex items-center justify-between rounded-lg cursor-pointer"
      onClick={handleClick}
    >
      <span className="text-sm text-gray-700 flex-1 truncate">{task.title}</span>
      {task.hasNotification && (
        <div className="w-2 h-2 bg-red-500 rounded-full flex-shrink-0" style={{ marginRight: 0 }}></div>
      )}
    </div>
  );
};
