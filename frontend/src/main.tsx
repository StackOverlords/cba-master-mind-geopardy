import { createRoot } from 'react-dom/client'
import './index.css'
import App from './App.tsx'
import { BrowserRouter } from 'react-router'
import '@fontsource-variable/onest/index.css';
import { apiVariables } from './config/env.ts';
import axios from 'axios';
import { checkAuthOnStart } from './services/authService.ts';

checkAuthOnStart()
axios.defaults.baseURL = apiVariables.apiUrl
createRoot(document.getElementById('root')!).render(
  <BrowserRouter>
    <App />
  </BrowserRouter>,
)
