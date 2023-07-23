// src/components/Quiz.js
import React, { useEffect, useState } from 'react';
import axios from 'axios';

const Quiz = () => {
  const [quizzes, setQuizzes] = useState([]);

  useEffect(() => {
    // Fetch quizzes from your Laravel API
    axios.get('/api/quizzes')
      .then(response => {
        setQuizzes(response.data);
      })
      .catch(error => {
        console.error(error);
      });
  }, []);

  return (
    <div>
      <h1>Quizzes</h1>
      <ul>
        {quizzes.map(quiz => (
          <li key={quiz.id}>
            {quiz.title}
          </li>
        ))}
      </ul>
    </div>
  );
};

export default Quiz;
