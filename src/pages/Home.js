import React, { useState } from 'react';
import { useNavigate } from 'react-router-dom';
import apiClient from '../utils/Api';
import { setUserSession } from '../utils/Common';
import '../styles/login.css';

const Home = () => {
  const history = useNavigate();
  const email = useFormInput('');
  const password = useFormInput('');
  const [error, setError] = useState(null);
  const [loading, setLoading] = useState(false);

  const handleLogin = (e) => {
    e.preventDefault();
    setError(null);
    setLoading(true);
    apiClient.get('/sanctum/csrf-cookie')
      .then(response => {
        apiClient.post('/api/login', {
          email: email.value,
          password: password.value
        }).then(response => {
          setLoading(false);
          setUserSession(response.data.data.token, response.data.data.name);
          history('/dashboard');
        }).catch(error => {
          setLoading(false);
          if (error.response.status === 422) setError(error.response.data.message);
          else setError("Something went wrong. Please try again later.");
        });
      });
  }

  return (
    <div className="login-container">
      <div className="login-box">
        <h2 className="login-heading">Login</h2>
        {error && <div className="error-message">{error}</div>}
        <div className="form-group">
          <input
            type="email"
            id="email"
            {...email}
            autoComplete="new-password"
            placeholder="Email"
          />
        </div>
        <div className="form-group">
          <input
            type="password"
            id="password"
            {...password}
            autoComplete="new-password"
            placeholder="Password"
          />
        </div>
        <button
          className="login-button"
          onClick={handleLogin}
          disabled={loading}
        >
          {loading ? 'Loading...' : 'Login'}
        </button>
      </div>
    </div>
  );
}

const useFormInput = initialValue => {
  const [value, setValue] = useState(initialValue);

  const handleChange = e => {
    setValue(e.target.value);
  }
  return {
    value,
    onChange: handleChange
  }
}

export default Home;
