import React from 'react'
import { Routes, Route, useLocation } from 'react-router-dom'
import { AnimatePresence } from 'framer-motion'
import PageTransition from './components/PageTransition'
import Landing from './pages/Landing'
import Login from './pages/Login'
import Register from './pages/Register'
import Dashboard from './pages/Dashboard'
import AdminPanel from './pages/AdminPanel'
import Profile from './pages/Profile'
import Result from './pages/Result'
import MockInterview from './pages/MockInterview'
import MockTest from './pages/MockTest'

export default function App() {
  const location = useLocation();

  return (
    <AnimatePresence mode="wait">
      <Routes location={location} key={location.pathname}>
        <Route path='/' element={<PageTransition><Landing /></PageTransition>} />
        <Route path='/login' element={<PageTransition><Login /></PageTransition>} />
        <Route path='/register' element={<PageTransition><Register /></PageTransition>} />
        <Route path='/dashboard' element={<PageTransition><Dashboard /></PageTransition>} />
        <Route path='/admin' element={<PageTransition><AdminPanel /></PageTransition>} />
        <Route path='/profile' element={<PageTransition><Profile /></PageTransition>} />
        <Route path='/interview' element={<PageTransition><MockInterview /></PageTransition>} />
        <Route path='/mock-interview' element={<PageTransition><MockInterview /></PageTransition>} />
        <Route path='/mock-test' element={<PageTransition><MockTest /></PageTransition>} />
        <Route path='/result/:id' element={<PageTransition><Result /></PageTransition>} />
      </Routes>
    </AnimatePresence>
  )
}
