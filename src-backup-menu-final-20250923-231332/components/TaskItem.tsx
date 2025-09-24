import React from 'react';

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
  return (
    <div className="task-item flex items-center justify-between rounded-lg cursor-pointer">
      <span className="text-sm text-gray-700 flex-1 truncate">{task.title}</span>
      {task.hasNotification && (
        <div className="w-2 h-2 bg-red-500 rounded-full flex-shrink-0" style={{ marginRight: 0 }}></div>
      )}
    </div>
  );
};
