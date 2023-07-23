import React from 'react';
import { Routes, Route } from 'react-router-dom';

import PrivateRoutes from './utils/PrivateRoutes';
import PublicRoutes from './utils/PublicRoutes';

import Dashboard from './pages/Dashboard';
import Home from './pages/Home';
import List from './pages/List';
import AttendQuestionnaire from './pages/AttendQuestionnaire';
import SuccessPage from './pages/SuccessPage';
import ErrorPage from './pages/ErrorPage';

function App() {
  return (
      <div className="content">
        <Routes>
        <Route index element={<Home />} />
          <Route element={<PublicRoutes />}>
            <Route path="/questionnaire/attend" element={<AttendQuestionnaire />} />
            <Route path="/success-page" element={<SuccessPage />} />
            <Route path="/error-page" element={<ErrorPage />} />
          </Route>
          <Route element={<PrivateRoutes />}>
            <Route path="/dashboard" element={<Dashboard />} />
            <Route path="/questionnaire/list" element={<List />} />
          </Route>
        </Routes>
      </div>
  );
}

export default App;