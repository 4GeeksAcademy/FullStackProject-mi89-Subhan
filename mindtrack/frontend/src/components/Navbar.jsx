import React, { useContext } from 'react'
import { Link } from 'react-router-dom'
import { Context } from '../store'

const Navigation = () => {
  const { token, logout } = useContext(Context)

  return (
    <nav className='navbar navbar-expand-lg px-4'>
      <Link className='navbar-brand' to='/'>MindTrack</Link>
      <div className='navbar-nav ms-auto'>
        <Link className='nav-link' to='/dashboard'>Dashboard</Link>
        <Link className='nav-link' to='/mood'>Mood</Link>
        <Link className='nav-link' to='/journal'>Journal</Link>
        <Link className='nav-link' to='/resources'>Resources</Link>
        {!token ? (
          <>
            <Link className='nav-link' to='/login'>Login</Link>
            <Link className='nav-link' to='/signup'>Signup</Link>
          </>
        ) : (
          <button className='btn btn-outline-light ms-2' onClick={logout}>Logout</button>
        )}
      </div>
    </nav>
  )
}

export default Navigation