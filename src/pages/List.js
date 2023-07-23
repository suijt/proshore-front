import React, { useState, useEffect } from 'react';
import { useNavigate } from 'react-router-dom';
import { getUser, removeUserSession } from '../utils/Common';
import apiClient from '../utils/Api';
import { Link } from 'react-router-dom';
import '../styles/list.css'

const List = () => {
  const history = useNavigate();
  const user = getUser();
  const [items, setItems] = useState([]);
  const [loading, setLoading] = useState(false);
  const [successMessage, setSuccessMessage] = useState('');
  const [errorMessage, setErrorMessage] = useState('');

  useEffect(() => {
    fetchQuestionnaire();
  }, []);

  const handleLogout = () => {
    removeUserSession();
    history('/');
  }

  const fetchQuestionnaire = async () => {
    try {
      const response = await apiClient.get('/api/questionnaire');
      setItems(response.data.data);
    } catch (error) {
      console.error(error);
    }
  };

  const handleInvitation = async (itemId) => {
    setLoading(true);
    try {
      const response = await apiClient.post('/api/questionnaire/invite', { questionnaireId: itemId });
      setSuccessMessage(response.data.message);
      setErrorMessage('');
    } catch (error) {
      console.error(error);
      setErrorMessage("Something went wrong. Please try again later.");
    } finally {
      setLoading(false);
    }
  }

  return (
    <div>
      <div className="header">
        <h2>Welcome {user}!</h2>
        <button className="logout-button" onClick={handleLogout}>Logout</button>
      </div>
      <Link to="/dashboard"><button className="dashboard-button">Go to Dashboard</button></Link>
      <div>
        <h2>Questionnaires</h2>
        {successMessage && <div className="success-message">{successMessage}</div>}
        {errorMessage && <div className="error-message">{errorMessage}</div>}
        <table className="questionnaire-table">
          <thead>
            <tr>
              <th>Title</th>
              <th>Expiry Date</th>
              <th>Actions</th>
            </tr>
          </thead>
          <tbody>
            {items.map(item => (
              <tr key={item.id}>
                <td>{item.title}</td>
                <td>{item.expiry_date}</td>
                <td>
                  <button
                    className="send-invitation-button"
                    onClick={() => handleInvitation(item.id)}
                    disabled={loading}
                  >
                    {loading ? 'Sending...' : 'Send Invitation'}
                  </button>
                </td>
              </tr>
            ))}
          </tbody>
        </table>
      </div>
    </div>
  );
}

export default List;
