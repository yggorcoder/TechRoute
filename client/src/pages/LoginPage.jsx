import React, { useState } from 'react';
import { useAuth } from '../context/authContext';
import Header from '../components/Header';
import Footer from '../components/Footer';
import './LoginPage.css'; //Importa o css
import { Link, useNavigate } from 'react-router-dom';

function LoginPage() {
    const [username, setUsername] = useState('');
    const [password, setPassword] = useState('');
    const [error, setError] = useState('');
    const navigate = useNavigate();
    const auth = useAuth();

    const handleSubmit = async (e) => {
        e.preventDefault();
        setError(''); //limpa erros anteriores
        try {
            await auth.login(username, password);
            navigate('/dashboard'); //readireciona para o dashboard em caso de sucesso
        } catch (err) {
            // Define uma mensagem de erro genérica
            setError('Invalid username or password. Please, try again.');
            console.error('Login failed:', err);
        }
    };

    return (
        <>
        <Header/>
        <main className="login-container">
         <div className='login-form'>
          <form onSubmit={handleSubmit}>
            <h1 className='h3 mb-3 fw-normal'>Please sign in</h1>

            {/*exibe a mensagem de erro, se houver */}
            {error && <div className='alert alert-danger'>{error}</div>}

            <div className='form-floating mb-3'>
              <input
                type='text'
                className='form-control'
                id='username'
                value={username}
                onChange={(e) => setUsername(e.target.value)}
                required
              />
              <label htmlFor='username'>Username</label>
            </div>

            <div className='form-floating mb-3'>
              <input
                type='password'
                className='form-control'
                id='password'
                placeholder='Password'
                value={password}
                onChange={(e) => setPassword(e.target.value)}
                required
              />
              <label htmlFor='password'>Password</label>
            </div>

            <button className='w-100 btn btn-lg btn-primary' type='submit'>
              Sign in
            </button>
            <p className='mt-4 text-center'>
                Don't have an account? <Link to='/register'>Sign Up</Link>
            </p>
           </form>
          </div>
        </main>
        <Footer/>
        </>
    );
}

export default LoginPage;