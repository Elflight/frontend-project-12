// import { useState } from 'react'
import { BrowserRouter, Routes, Route } from 'react-router-dom'
import PATHS from './routes.js'

import LoginPage from './pages/login.jsx'
import SignupPage from './pages/signup.jsx'
import MainPage from './pages/main.jsx'
import NotfoundPage from './pages/notfound.jsx'

import ProtectedRoute from './components/ProtectedRoute.jsx';
import GuestRoute from './components/GuestRoute.jsx'

import 'bootstrap/dist/css/bootstrap.min.css'

function App() {
  return (
    <BrowserRouter>
      <Routes>
        <Route 
        path={PATHS.MAIN} 
        element={
          <ProtectedRoute>
            <MainPage />
          </ProtectedRoute>
        } />
        <Route
        path={PATHS.LOGIN} 
        element={
          <GuestRoute>
            <LoginPage />
          </GuestRoute>
        } />
        <Route 
        path={PATHS.SIGNUP} 
        element={
          <GuestRoute>
            <SignupPage />
          </GuestRoute>
        } />
        <Route path="*" element={<NotfoundPage />} />
      </Routes>
    </BrowserRouter>
  )
}

export default App
