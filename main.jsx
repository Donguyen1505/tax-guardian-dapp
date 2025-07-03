import React from 'react';
import ReactDOM from 'react-dom/client';
import App from './App';
import './index.css';
import { Web3Provider } from './contexts/Web3Context';
import { QueryClient, QueryClientProvider } from '@tanstack/react-query';

// Tạo instance QueryClient với cấu hình mặc định
const queryClient = new QueryClient({
  defaultOptions: {
    queries: {
      staleTime: 5 * 60 * 1000, // 5 phút
      cacheTime: 10 * 60 * 1000, // 10 phút
      refetchOnWindowFocus: false,
      retry: 1,
    },
  },
});

ReactDOM.createRoot(document.getElementById('root')).render(
  <React.StrictMode>
    <QueryClientProvider client={queryClient}>
      <Web3Provider>
        <App />
      </Web3Provider>
    </QueryClientProvider>
  </React.StrictMode>
);

