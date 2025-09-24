import React from 'react';
import ReactDOM from 'react-dom/client';
import { createBrowserRouter, RouterProvider } from 'react-router-dom';
import './index.css';
import { RootLayout } from './modules/layouts/RootLayout';
import { Placeholder } from './modules/common/Placeholder';

const router = createBrowserRouter([
  {
    path: '/',
    element: <RootLayout />,
    children: [
      { index: true, element: <Placeholder title="Início" /> },
      { path: 'projetos', element: <Placeholder title="Projetos" /> },
      { path: 'agente', element: <Placeholder title="Agente" /> }
    ]
  }
]);

ReactDOM.createRoot(document.getElementById('root')!).render(
  <React.StrictMode>
    <RouterProvider router={router} />
  </React.StrictMode>
);

