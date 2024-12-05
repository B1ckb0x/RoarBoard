import React, { useState } from 'react';
import { useNavigate } from 'react-router-dom';
import './Login.css';

const Login = () => {
  const [email, setEmail] = useState('');
  const [password, setPassword] = useState('');
  const [message, setMessage] = useState('');
  const navigate = useNavigate();


  const handleLogin = async (e) => {
    e.preventDefault();

    try {
      const response = await fetch('http://localhost:3001/users/login', {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
        },
        credentials: 'include',
        body: JSON.stringify({
          email,
          password,
        }),
      });

      const data = await response.json();

      if (response.ok) {
        // Save userId in localStorage
        localStorage.setItem('userId', data.userId); // Storing userId
        setMessage(data.message);
        navigate('/clubs'); // Redirect to /clubs after successful login
      } else {
        setMessage('Login failed: ' + data.error);
      }
    } catch (error) {
      setMessage('Login failed: ' + error.message);
    }
  };



  return (
    <div className="login-container">
      <h2>Login</h2>
      <form onSubmit={handleLogin} className="login-form">
        <div className="form-group">
          <label>Email:</label>
          <input
            type="email"
            value={email}
            onChange={(e) => setEmail(e.target.value)}
            required
            className="form-control"
          />
        </div>
        <div className="form-group">
          <label>Password:</label>
          <input
            type="password"
            value={password}
            onChange={(e) => setPassword(e.target.value)}
            required
            className="form-control"
          />
        </div>
        <button type="submit" className="btn btn-primary">Login</button>
      </form>

      <p className="register-link">
        Don't have an account? <a href="http://localhost:3000/register">Register here</a>
      </p>

      {message && <p className="message">{message}</p>}
    </div>
  );
};

export default Login;
