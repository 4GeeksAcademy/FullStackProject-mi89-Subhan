import React, { useState } from 'react'
import { useNavigate } from 'react-router-dom'

const Signup = () => {
  const [email, setEmail] = useState('')
  const [password, setPassword] = useState('')
  const navigate = useNavigate()

  const handleSubmit = async e => {
    e.preventDefault()
    const response = await fetch('https://fullstackproject-mi89-subhan.onrender.com/api/signup', {
      method: 'POST',
      headers: { 'Content-Type': 'application/json' },
      body: JSON.stringify({ email, password })
    })
    if (response.ok) navigate('/login')
  }

  return (
    <div className='container py-5'>
      <h2>Signup</h2>
      <form onSubmit={handleSubmit} className='col-md-6'>
        <input className='form-control mb-3' placeholder='Email' value={email} onChange={e => setEmail(e.target.value)} />
        <input className='form-control mb-3' type='password' placeholder='Password' value={password} onChange={e => setPassword(e.target.value)} />
        <button className='btn btn-success'>Create Account</button>
      </form>
    </div>
  )
}

export default Signup