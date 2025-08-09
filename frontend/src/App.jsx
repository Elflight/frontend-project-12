// import { useState } from 'react'
import { BrowserRouter, Routes, Route } from 'react-router-dom'
import PATHS from './routes.js'

import { ToastContainer } from 'react-toastify'
import 'react-toastify/dist/ReactToastify.css'

import LoginPage from './pages/login.jsx'
import SignupPage from './pages/signup.jsx'
import MainPage from './pages/main.jsx'
import NotfoundPage from './pages/notfound.jsx'

import ProtectedRoute from './components/ProtectedRoute.jsx'
import GuestRoute from './components/GuestRoute.jsx'
import Header from './components/Header.jsx'

import 'bootstrap/dist/css/bootstrap.min.css'

const App = () => {
  return (
    <BrowserRouter>
      <Header />
      <ToastContainer
        position="top-right"
        autoClose={3000}
        hideProgressBar={false}
        newestOnTop={false}
        closeOnClick
        rtl={false}
        pauseOnFocusLoss
        draggable
        pauseOnHover
      />
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
