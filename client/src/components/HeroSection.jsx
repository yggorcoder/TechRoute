import React from 'react';
import { Link } from 'react-router-dom';

function HeroSection() {
  return (
    <section className="hero-section text-center text-white d-flex align-items-center justify-content-center">
      <div className="container">
        <h1 className="display-3 fw-bold mb-4">TechRoute Visit Management</h1>
        <p className="lead my-4 fs-4">Streamline your technical visits with our comprehensive management system.</p>
        <Link to="/register-visit" className="btn btn-primary btn-lg fw-bold px-4 py-3">Register New Visit</Link>
      </div>
    </section>
  );
}

export default HeroSection;