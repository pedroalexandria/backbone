import React from 'react';
import ReactDOM from 'react-dom/client';
import { createBrowserRouter, RouterProvider } from 'react-router-dom';
import './index.css';
import { RootLayout } from './modules/layouts/RootLayout';
import { AgentHome } from './pages/AgentHome';
import { ChatCanvas } from './pages/ChatCanvas';

const router = createBrowserRouter([
  {
    path: '/',
    element: <RootLayout />,
    children: [
      { index: true, element: <AgentHome /> },
      { path: 'chat-canvas', element: <ChatCanvas /> }
    ]
  }
]);

ReactDOM.createRoot(document.getElementById('root')!).render(
  <React.StrictMode>
    <RouterProvider router={router} />
  </React.StrictMode>
);

