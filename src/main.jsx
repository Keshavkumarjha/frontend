import React from 'react'
import ReactDOM from 'react-dom/client'
import { RouterProvider } from 'react-router-dom'
import { QueryClient, QueryClientProvider } from '@tanstack/react-query'
import { Toaster } from 'react-hot-toast'
import { router } from './router/routes'
import './index.css'

const queryClient = new QueryClient({
  defaultOptions: {
    queries: { retry: 1, staleTime: 30_000, refetchOnWindowFocus: false },
  },
})

ReactDOM.createRoot(document.getElementById('root')).render(
  <React.StrictMode>
    <QueryClientProvider client={queryClient}>
      <RouterProvider router={router} />
      <Toaster
        position="top-right"
        toastOptions={{
          style: { background: '#161b27', color: '#e2e8f0', border: '1px solid #1e2535', fontSize: '14px' },
          success: { iconTheme: { primary: '#34d399', secondary: '#161b27' } },
          error:   { iconTheme: { primary: '#f87171', secondary: '#161b27' } },
        }}
      />
    </QueryClientProvider>
  </React.StrictMode>
)
