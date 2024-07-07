import React from 'react'
import { hydrateRoot } from 'react-dom/client'
import App from './components/App'
import { BrowserRouter } from 'react-router-dom'
import { HydrationBoundary, QueryClientProvider } from '@tanstack/react-query'
import { getQueryClient } from './routes'
const queryClient = getQueryClient()

const dehydratedState = window.__REACT_QUERY_STATE__ ?? {}

hydrateRoot(
  document.getElementById('root'),
  <QueryClientProvider client={queryClient}>
    <HydrationBoundary state={dehydratedState}>
      <BrowserRouter>
        <App />
      </BrowserRouter>
    </HydrationBoundary>
  </QueryClientProvider>,
)
