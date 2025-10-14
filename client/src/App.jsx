import React from 'react';
import { Routes, Route, Navigate } from 'react-router-dom';
import { useAuth } from './context/authContext.jsx';

// 1. Importe os componentes das suas páginas
import HomePage from './pages/HomePage.jsx';
import RegisterPage from './pages/RegisterPage.jsx';
import DashboardPage from './pages/DashboardPage.jsx';
import LoginPage from './pages/LoginPage.jsx';
import RegistrationForm from './components/RegistrationForm.jsx';

// Importe o CSS principal se tiver um
import './App.css';
import RegisterVisit from './pages/RegisterVisit.jsx';

function ProtectedRoute({ children }) {
  const { isAuthenticated } = useAuth();
  if (!isAuthenticated) {
    return <Navigate to="/login" replace />;
  }
  return children;
}

function App() {
  return (
    <Routes>
      {/* 2. Defina as rotas da sua aplicação */}
      <Route path="/" element={<HomePage />} />
      <Route path="/register" element={<RegisterPage />} />
      <Route path="/login" element={<LoginPage />} />

      <Route
        path="/dashboard"
        element={
          <ProtectedRoute>
            <DashboardPage />
          </ProtectedRoute>
        }
      />
      <Route
        path="/register-visit"
        element={
          <ProtectedRoute>
            <RegisterVisit />
          </ProtectedRoute>
        }
      />
    </Routes>
  );
}

export default App;
