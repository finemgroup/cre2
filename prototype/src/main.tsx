import { StrictMode } from 'react';
import { createRoot } from 'react-dom/client';
import { BrowserRouter } from 'react-router-dom';

import App from './App';
import { MotionRoot } from '@/lib/motion/MotionRoot';
import './index.css';

createRoot(document.getElementById('root')!).render(
  <StrictMode>
    <BrowserRouter>
      <MotionRoot>
        <App />
      </MotionRoot>
    </BrowserRouter>
  </StrictMode>
);
