import React, { useEffect } from 'react';
import { Routes, Route, Navigate } from 'react-router-dom';
import { useAuth } from './context/authContext.jsx';
import { health, register } from './api.js'; // Import health and register

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
  // Quick test for API endpoints
  useEffect(() => {
    const testApi = async () => {
      try {
        const healthResponse = await health();
        console.log('Health check:', healthResponse.data);

        // Generate a unique email for each test run to avoid conflicts
        const uniqueEmail = `test-${Date.now()}@ex.com`;
        const registerResponse = await register({ email: uniqueEmail, password: "123456", username: "testuser" });
        console.log('Register test:', registerResponse.data);
      } catch (error) {
        console.error('API test failed:', error.response ? error.response.data : error.message);
      }
    };

    testApi();
  }, []);

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