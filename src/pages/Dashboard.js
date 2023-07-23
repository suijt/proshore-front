import React, { useState } from 'react';
import { Link, useNavigate } from 'react-router-dom';
import { getUser, removeUserSession } from '../utils/Common';
import apiClient from '../utils/Api';
import '../styles/dashboard.css';

const Dashboard = () => {
  const history = useNavigate();
  const user = getUser();
  const title = useFormInput('');
  const expiryDate = useFormInput('');
  const [error, setError] = useState(null);
  const [loading, setLoading] = useState(false);

  // handle click event of logout button
  const handleLogout = () => {
    removeUserSession();
    history('/');
  };

  const handleGenerate = (e) => {
    e.preventDefault();
    setError(null);
    setLoading(true);
    apiClient.post('/api/questionnaire/generate', {
      title: title.value,
      expiry_date: expiryDate.value
    })
    .then(response => {
      setLoading(false);
      history('/questionnaire/list');
    })
    .catch(error => {
      setLoading(false);
      if (error.response && error.response.status === 422) {
        setError(error.response.data.message);
      } else {
        setError("Something went wrong. Please try again later.");
      }
    });
  };

  return (
    <div className="dashboard-container">
      <div className="welcome-section">
        <h2>Welcome {user}!</h2>
        <button className="logout-button" type="button" onClick={handleLogout} >Logout</button>
      </div>
      <div className="generate-section">
        <h3>Generate Questionnaire</h3>
        <div className="input-section">
          <label>Title:</label>
          <input type="text" {...title} />
        </div>
        <div className="input-section">
          <label>Expiry Date:</label>
          <input type="date" {...expiryDate} />
        </div>
        {error && <p className="error-message">{error}</p>}
        <div className="input-section">
          <input type="button" value={loading ? 'Loading...' : 'Generate'} onClick={handleGenerate} disabled={loading} />
        </div>
      </div>
      <div className="go-to-list-section">
        <Link to="/questionnaire/list">
          <button className="go-to-list-button">Go to List</button>
        </Link>
      </div>
    </div>
  );
};

const useFormInput = initialValue => {
  const [value, setValue] = useState(initialValue);

  const handleChange = e => {
    setValue(e.target.value);
  };
  
  return {
    value,
    onChange: handleChange
  };
};

export default Dashboard;
