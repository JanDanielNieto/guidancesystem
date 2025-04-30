import React, { useState } from 'react';
import axios from 'axios';
import { useNavigate } from 'react-router-dom';
import '../css/styles.css'; // Ensure this path is correct

const Login = () => {
  const [username, setUsername] = useState('');
  const [password, setPassword] = useState('');
  const [error, setError] = useState('');
  const navigate = useNavigate();

  const handleLogin = async (e) => {
    e.preventDefault();
    try {
      const response = await axios.post('http://localhost:5000/api/login', {
        username,
        password,
      });

      // Store authentication token or flag in localStorage
      localStorage.setItem('authToken', 'true');

      // Show a success popup message
      alert(response.data.message);

      // Navigate to the Dashboard page
      navigate('/');
    } catch (err) {
      // Show an error popup message
      setError(err.response?.data?.error || 'An error occurred');
      alert(err.response?.data?.error || 'Login failed. Please try again.');
    }
  };

  return (
    <div className="background">
      <div className="top-bar">
        <h1>Guidance System</h1>
      </div>
      <div className="login-container">
        <div className="login-box">
          <h1>Login</h1>
          <form onSubmit={handleLogin}>
            <div>
              <label>Username:</label>
              <input
                type="text"
                value={username}
                onChange={(e) => setUsername(e.target.value)}
                required
              />
            </div>
            <div>
              <label>Password:</label>
              <input
                type="password"
                value={password}
                onChange={(e) => setPassword(e.target.value)}
                required
              />
            </div>
            {error && <p>{error}</p>}
            <button type="submit">Login</button>
          </form>
        </div>
      </div>
    </div>
  );
};

export default Login;