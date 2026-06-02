import { BrowserRouter } from 'react-router-dom';
import { createRoot } from 'react-dom/client';
import { QueryClient, QueryClientProvider } from '@tanstack/react-query';
import './index.css';
import App from './App.jsx';
import { TenantProvider } from './tenant/TenantProvider.jsx';

const queryClient = new QueryClient({
  defaultOptions: {
    queries: {
      retry: 1,
      refetchOnWindowFocus: false,
      staleTime: 30_000,
    },
  },
});

createRoot(document.getElementById('root')).render(
  <QueryClientProvider client={queryClient}>
    <BrowserRouter>
      <TenantProvider>
        <App />
      </TenantProvider>
    </BrowserRouter>
  </QueryClientProvider>,
);
