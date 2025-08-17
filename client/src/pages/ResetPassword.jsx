import { useEffect, useState } from 'react'
import { Link, useNavigate, useSearchParams } from 'react-router-dom'
import api from '../api'

export default function ResetPassword() {
  const [params] = useSearchParams()
  const navigate = useNavigate()
  const emailParam = params.get('email') || ''
  const tokenParam = params.get('token') || ''
  const [email, setEmail] = useState(emailParam)
  const [token, setToken] = useState(tokenParam)
  const [password, setPassword] = useState('')
  const [ok, setOk] = useState(false)
  const [error, setError] = useState('')

  useEffect(() => {
    setEmail(emailParam); setToken(tokenParam)
  }, [emailParam, tokenParam])

  const onSubmit = async (e) => {
    e.preventDefault()
    setError('')
    try {
      await api.post('/api/auth/reset-password', { email, token, newPassword: password })
      setOk(true)
      setTimeout(() => navigate('/login'), 1500)
    } catch (e) {
      setError(e?.response?.data?.error || 'Failed to reset password')
    }
  }

  return (
    <div className="container">
      <div className="card" style={{ maxWidth: 420, margin: '24px auto' }}>
        <h2>Create a new password</h2>
        {ok ? (
          <div className="small">Password updated. Redirecting to login...</div>
        ) : (
          <form onSubmit={onSubmit} className="grid" style={{ gap: 12 }}>
            <input className="input" type="email" value={email} onChange={e => setEmail(e.target.value)} placeholder="Email" required />
            <input className="input" type="text" value={token} onChange={e => setToken(e.target.value)} placeholder="Token" required />
            <input className="input" type="password" value={password} onChange={e => setPassword(e.target.value)} placeholder="New Password" required />
            {error && <div className="small" style={{ color: '#c00' }}>{error}</div>}
            <button className="btn">Update password</button>
          </form>
        )}
        <div className="row" style={{ marginTop: 12 }}><Link to="/login">Back to log in</Link></div>
      </div>
    </div>
  )
}
