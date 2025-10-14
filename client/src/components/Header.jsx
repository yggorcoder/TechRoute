import React from 'react';
import { Link, useNavigate } from 'react-router-dom';
import { HashLink } from 'react-router-hash-link'; // Para links âncora como #features
import { useAuth } from '../context/authContext';

function Header() {
  const { isAuthenticated, user, logout } = useAuth();
  const navigate = useNavigate();

  const handleLogout = () => {
    logout();
    navigate('/login');
  };

  return (
    <header className="navbar navbar-expand-lg fixed-top navbar-dark">
      <div className="container">
        <Link className="navbar-brand fw-bold" to="/">
          <i className="bi bi-compass-fill me-2"></i> TechRoute
        </Link>
        <button className="navbar-toggler" type="button" data-bs-toggle="collapse" data-bs-target="#navbarNav" aria-controls="navbarNav" aria-expanded="false" aria-label="Toggle navigation">
          <span className="navbar-toggler-icon"></span>
        </button>
        <div className="collapse navbar-collapse" id="navbarNav">
          <ul className="navbar-nav ms-auto">
            <li className="nav-item">
              <Link className="nav-link active" aria-current="page" to="/">Home</Link>
            </li>
            <li className="nav-item">
              {/* Usamos HashLink para rolar suavemente para a seção */}
              <HashLink className="nav-link" smooth to="/#features">Features</HashLink>
            </li>
            <li className="nav-item">
              <HashLink className="nav-link" smooth to="/#about">About Us</HashLink>
            </li>

            {/* lógica condicional para exibir botões*/}
            {isAuthenticated ? (
              <>
                <li className='nav-item'>
                  <Link className='nav-link' to='/dashboard'>Dashboard</Link>
                </li>
            <li className="nav-item">
              {user && <span className='navbar-text me-3'>
                Welcome, {user.username}!
              </span>}
              </li>
              <li className="nav-item">
                <button className="btn btn-outline-primary" onClick={handleLogout}>
                  Logout
                </button>
              </li>
              </>
            ) : (
              //se não tiver autenticado
              <>
                <li className="nav-item">
                  <Link to="/login" className="btn btn-outline-primary ms-2">
                    Login
                  </Link>
                </li>
              </>
            )}
          </ul>
        </div>
      </div>
    </header>
  );
}

export default Header;