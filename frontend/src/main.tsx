import { createRoot } from 'react-dom/client'
import './index.css'
import App from './App.tsx'
import { BrowserRouter } from 'react-router'
import '@fontsource-variable/onest/index.css';
import '@fontsource/press-start-2p/index.css';
import { apiVariables } from './config/env.ts';
import axios from 'axios';

axios.defaults.baseURL = apiVariables.apiUrl
createRoot(document.getElementById('root')!).render(
  <BrowserRouter>
    <App />
  </BrowserRouter>,
)
