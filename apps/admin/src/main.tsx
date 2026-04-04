import { StrictMode } from 'react';
import { createRoot } from 'react-dom/client';
import { init } from '@nammabus/shared/api';
import { QueryProvider } from './components/providers/query-provider';
import App from './App.tsx';
import './index.css';

// Initialize the shared API client with the backend URL from environment variables.
init({
  baseUrl: import.meta.env.VITE_PUBLIC_API_URL || 'http://localhost:3000',
});

createRoot(document.getElementById('root')!).render(
  <StrictMode>
    <QueryProvider>
      <App />
    </QueryProvider>
  </StrictMode>
);
