import React from 'react';
import { Navigate, Outlet } from 'react-router-dom';
import { getToken } from './Common';

// handle the private routes
const PrivateRoutes = () => {
  return getToken() ? <Outlet /> : <Navigate to="/" />
}

export default PrivateRoutes;