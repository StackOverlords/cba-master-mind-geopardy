import { createRoot } from 'react-dom/client'
import './index.css'
import App from './App.tsx'
import { BrowserRouter } from 'react-router'
import '@fontsource-variable/onest/index.css';
import '@fontsource/press-start-2p/index.css';
import { apiVariables } from './config/env.ts';
import axios from 'axios';
import { QueryClient, QueryClientProvider } from '@tanstack/react-query'

axios.defaults.baseURL = apiVariables.apiUrl
const queryClient = new QueryClient()
createRoot(document.getElementById('root')!).render(
  <QueryClientProvider client={queryClient}>
    <BrowserRouter>
      <App />
    </BrowserRouter>
  </QueryClientProvider>
)
