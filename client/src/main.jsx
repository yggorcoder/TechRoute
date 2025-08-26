import React from 'react';
import ReactDOM from 'react-dom/client';
import { BrowserRouter } from 'react-router-dom'; // <-- A importação
import App from './App.jsx';
import './index.css';

ReactDOM.createRoot(document.getElementById('root')).render(
  <React.StrictMode>
    <BrowserRouter> {/* <-- O <App /> precisa estar DENTRO do BrowserRouter */}
      <App />
    </BrowserRouter>
  </React.StrictMode>,
)