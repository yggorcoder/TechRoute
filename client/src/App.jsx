import React from 'react';
import { Routes, Route } from 'react-router-dom';

// 1. Importe os componentes das suas páginas
import HomePage from './pages/HomePage';
import RegisterPage from './pages/RegisterPage';
import DashboardPage from './pages/DashboardPage';

// Importe o CSS principal se tiver um
import './App.css';

function App() {
  return (
    <Routes>
      {/* 2. Defina as rotas da sua aplicação */}
      <Route path="/" element={<HomePage />} />
      <Route path="/register" element={<RegisterPage />} />
      <Route path="/dashboard" element={<DashboardPage />} />
    </Routes>
  );
}

export default App;
