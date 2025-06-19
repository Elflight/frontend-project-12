// import { useState } from 'react'
import { BrowserRouter, Routes, Route } from 'react-router-dom'
import PATHS from './routes.js'

import LoginPage from './pages/login.jsx'
import SignupPage from './pages/signup.jsx'
import MainPage from './pages/main.jsx'
import NotfoundPage from './pages/notfound.jsx'

function App() {
  return (
    <BrowserRouter>
      <Routes>
        <Route path={PATHS.MAIN} element={<MainPage />} />
        <Route path={PATHS.LOGIN} element={<LoginPage />} />
        <Route path={PATHS.SIGNUP} element={<SignupPage />} />
        <Route path="*" element={<NotfoundPage />} />
      </Routes>
    </BrowserRouter>
  )
}

export default App
