import React from 'react'
import { useSelector } from 'react-redux'
import { Navigate } from 'react-router-dom'
import PATHS from '../routes'

const ProtectedRoute = ({ children }) => {
  const isAuthorized = useSelector((state) => state.auth.isAuthorized)
  return isAuthorized ? children : <Navigate to={PATHS.LOGIN} replace />
}

export default ProtectedRoute
