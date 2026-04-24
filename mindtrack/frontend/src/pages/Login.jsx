import React, { useContext, useState } from 'react'
import { Context } from '../store'
import { useNavigate } from 'react-router-dom'

const Login = () => {
  const { login } = useContext(Context)
  const [email, setEmail] = useState('')
  const [password, setPassword] = useState('')
  const [msg, setMsg] = useState('')   // ✅ added
  const navigate = useNavigate()

  const handleSubmit = async e => {
    e.preventDefault()

    const response = await fetch('https://fullstackproject-mi89-subhan.onrender.com/api/login', {
      method: 'POST',
      headers: { 'Content-Type': 'application/json' },
      body: JSON.stringify({ email, password })
    })

    const data = await response.json()

    if (response.ok) {
      login(data.token, data.user)
      navigate('/dashboard')
    } else {
      setMsg(data.msg || 'Invalid email or password') // ✅ show error
    }
  }

  return (
    <div className='container py-5'>
      <h2>Login</h2>

      <form onSubmit={handleSubmit} className='col-md-6'>
        <input
          className='form-control mb-3'
          placeholder='Email'
          value={email}
          onChange={e => setEmail(e.target.value)}
        />

        <input
          className='form-control mb-3'
          type='password'
          placeholder='Password'
          value={password}
          onChange={e => setPassword(e.target.value)}
        />

        <button className='btn btn-primary'>Login</button>
      </form>

      {/* ✅ error message display */}
      {msg && (
        <div className='alert alert-danger mt-3 col-md-6'>
          {msg}
        </div>
      )}
    </div>
  )
}

export default Login