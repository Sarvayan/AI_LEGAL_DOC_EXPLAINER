import { useState } from 'react'
import { Link, useNavigate, useLocation } from 'react-router-dom'
import useAuth from '../hooks/useAuth'

export default function Login() {
  const { login, loading } = useAuth()
  const [email, setEmail] = useState('')
  const [password, setPassword] = useState('')
  const [error, setError] = useState('')
  const navigate = useNavigate()
  const location = useLocation()
  const from = location.state?.from?.pathname || '/dashboard'

  const onSubmit = async (e) => {
    e.preventDefault()
    setError('')
    const { ok, error } = await login(email, password)
    if (ok) navigate(from, { replace: true })
    else setError(error)
  }

  return (
    <div className="container">
      <div className="card" style={{ maxWidth: 420, margin: '24px auto' }}>
        <h2>Log in</h2>
        <form onSubmit={onSubmit} className="grid" style={{ gap: 12 }}>
          <input className="input" type="email" value={email} onChange={e => setEmail(e.target.value)} placeholder="Email" required />
          <input className="input" type="password" value={password} onChange={e => setPassword(e.target.value)} placeholder="Password" required />
          {error && <div className="small" style={{ color: '#c00' }}>{error}</div>}
          <button className="btn" disabled={loading}>{loading ? '...' : 'Log in'}</button>
        </form>
        <div className="row" style={{ justifyContent: 'space-between', marginTop: 12 }}>
          <Link to="/signup">Create account</Link>
          <Link to="/forgot-password">Forgot password?</Link>
        </div>
      </div>
    </div>
  )
}
