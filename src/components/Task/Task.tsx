import React from 'react';
import { TaskHeader } from './TaskHeader';
import { TaskBody } from './TaskBody';
import { Chat } from './Chat/Chat';
import { Canvas } from './Canvas/Canvas';

export function Task() {
  return (
    <div className="task-root">
      <TaskHeader />
      <TaskBody>
        <div className="task-split">
          <div className="task-chat">
            <Chat />
          </div>
          <div className="task-canvas">
            <Canvas />
          </div>
        </div>
      </TaskBody>
    </div>
  );
}
