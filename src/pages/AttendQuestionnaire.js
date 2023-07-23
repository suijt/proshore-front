import React, { useEffect, useState } from 'react';
import { useLocation, useNavigate } from 'react-router-dom';
import apiClient from '../utils/Api';
import ErrorPage from './ErrorPage';
import '../styles/attendQuestionnaire.css';

const AttendQuestionnaire = () => {
  const [questionnaireData, setQuestionnaireData] = useState(null);
  const [selectedAnswers, setSelectedAnswers] = useState({});
  const location = useLocation();
  const history = useNavigate();
  const [isSubmitting, setIsSubmitting] = useState(false);
  const [submissionSuccess, setSubmissionSuccess] = useState(false);
  const [hasError, setHasError] = useState(false);

  useEffect(() => {
    const token = new URLSearchParams(location.search).get('token');
    if (token) {
      fetchQuestionnaireData(token);
    }
  }, [location.search]);

  const fetchQuestionnaireData = async (token) => {
    try {
      const response = await apiClient.get(`api/questionnaire/getQuestion/${token}`);
      setQuestionnaireData(response.data.data);
    } catch (error) {
      console.error(error);
      setQuestionnaireData(null);
      setHasError(true);
    }
  };

  const handleAnswerSelection = (questionId, answerId) => {
    setSelectedAnswers((prevSelectedAnswers) => ({
      ...prevSelectedAnswers,
      [questionId]: answerId,
    }));
  };

  const handleSubmit = async (e) => {
    e.preventDefault();

    const formData = {
      student_id: questionnaireData.student_id,
      questionnaire_id: questionnaireData.questionnaire_id,
      answers: Object.entries(selectedAnswers).map(([questionId, answerId]) => ({
        question_id: parseInt(questionId),
        answer_id: parseInt(answerId),
      })),
    };

    try {
      setIsSubmitting(true);
      const response = await apiClient.post('/api/questionnaire/submit', formData);
      setSelectedAnswers({});
      setSubmissionSuccess(true);

      setTimeout(() => {
        setIsSubmitting(false);
        setSubmissionSuccess(false);
        history('/success-page');
      }, 1000);
    } catch (error) {
      console.error(error);
      setIsSubmitting(false);
    }
  };

  if (hasError) {
    return <ErrorPage />;
  }

  if (!questionnaireData) {
    return <p>Loading...</p>;
  }

  return (
    <div className="container">
      <h2>Questionnaire</h2>
      {submissionSuccess && <p className="submission-success">Thank you for submitting the questionnaire!</p>}
      <form onSubmit={handleSubmit}>
        {questionnaireData.questions.map((question) => (
          <div key={question.id} className="question">
            <p>{question.question}</p>
            <ul className="options">
              {question.answers.map((answer) => (
                <li key={answer.id} className="option">
                  {/* <label> */}
                    <input
                      type="radio"
                      name={`question-${question.id}`}
                      value={answer.id}
                      checked={selectedAnswers[question.id] === answer.id}
                      onChange={() => handleAnswerSelection(question.id, answer.id)}
                    />
                    {answer.answer}
                  {/* </label> */}
                </li>
              ))}
            </ul>
          </div>
        ))}
        <button type="submit" className="submit-button" disabled={isSubmitting}>
          {isSubmitting ? 'Submitting...' : 'Submit Answers'}
        </button>
      </form>
    </div>
  );
};

export default AttendQuestionnaire;
