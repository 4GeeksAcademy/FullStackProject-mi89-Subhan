import React from 'react'
import { BrowserRouter, Routes, Route } from 'react-router-dom'
import { ContextProvider } from './store'
import Navigation from './components/Navbar'
import Home from './pages/Home'
import Login from './pages/Login'
import Signup from './pages/Signup'
import Dashboard from './pages/Dashboard'
import Mood from './pages/Mood'
import Journal from './pages/Journal'
import Resources from './pages/Resources'

const Layout = () => {
  return (
    <ContextProvider>
      <BrowserRouter>
        <Navigation />
        <Routes>
          <Route path='/' element={<Home />} />
          <Route path='/login' element={<Login />} />
          <Route path='/signup' element={<Signup />} />
          <Route path='/dashboard' element={<Dashboard />} />
          <Route path='/mood' element={<Mood />} />
          <Route path='/journal' element={<Journal />} />
          <Route path='/resources' element={<Resources />} />
        </Routes>
      </BrowserRouter>
    </ContextProvider>
  )
}

export default Layout