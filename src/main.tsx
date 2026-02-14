import { StrictMode } from 'react'
import { createRoot } from 'react-dom/client'
import { QueryClient, QueryClientProvider, QueryCache } from '@tanstack/react-query'
import './index.css'
import App from './App.tsx'
import { AuthProvider } from './contexts/AuthContext.tsx'
import { logger } from './utils/logger'

const queryCache = new QueryCache({
  onError: (error, query) => {
    logger.error('Query error:', query.queryKey, error);
  },
});

const queryClient = new QueryClient({
  queryCache,
  defaultOptions: {
    queries: {
      retry: 1,
      refetchOnWindowFocus: false,
    },
    mutations: {
      onError: (err) => {
        logger.error('Mutation error:', err);
      },
    },
  },
});

// Log unhandled promise rejections (e.g. failed fetches or Supabase calls)
window.addEventListener('unhandledrejection', (event) => {
  logger.error('Unhandled promise rejection:', event.reason);
});

createRoot(document.getElementById('root')!).render(
  <StrictMode>
    <QueryClientProvider client={queryClient}>
      <AuthProvider>
        <App />
      </AuthProvider>
    </QueryClientProvider>
  </StrictMode>,
)
