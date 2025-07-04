import { StrictMode } from 'react';
import { createRoot } from 'react-dom/client';
import { BrowserRouter } from 'react-router-dom'; // React Router importieren
import App from './App.jsx';
import './index.css';

createRoot(document.getElementById('root')).render(

    <BrowserRouter>
      <App />
    </BrowserRouter>

);
