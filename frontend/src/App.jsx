// import { useState } from 'react'
import { BrowserRouter, Routes, Route } from 'react-router-dom'
import PATHS from './routes.js'

import { Provider, ErrorBoundary } from '@rollbar/react'

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

const rollbarConfig = {
  accessToken: '557b534cd332442aa8ff81799d32a2ec7e1c5fe1a4fcd230eccaff6deea8a7fa3938ccf1d69b687684bb47a59de43879',
  environment: 'development',
}

const App = () => {
  return (
    <Provider config={rollbarConfig}>
      <ErrorBoundary>
        <div className="d-flex flex-column h-100">
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
        </div>
      </ErrorBoundary>
    </Provider>
  )
}

export default App
