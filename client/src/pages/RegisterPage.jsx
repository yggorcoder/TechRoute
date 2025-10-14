import React from 'react';
import Header from '../components/Header';
import Footer from '../components/Footer';
import RegistrationForm from '../components/RegistrationForm.jsx';
import './RegisterPage.css';

function RegisterPage() {
  return (
    <>
      <Header />
      <main className="login-container">
        <RegistrationForm />
      </main>
      <Footer />
    </>
  );
}

export default RegisterPage;