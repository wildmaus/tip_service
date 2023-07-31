import React from 'react';
import { StrictMode } from 'react';
import { createRoot } from 'react-dom/client';
import Railgun from './components/Railgun.jsx';
import App from './App';


const root = createRoot(document.getElementById('root'));
root.render(
  <StrictMode>
    <Railgun>
      <App />
    </Railgun>
  </StrictMode>
)