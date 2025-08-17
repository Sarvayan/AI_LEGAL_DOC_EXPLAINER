import { useState } from 'react'
import { Link } from 'react-router-dom'
import api from '../api'

export default function ForgotPassword() {
  const [email, setEmail] = useState('')
  const [sent, setSent] = useState(false)
  const [error, setError] = useState('')

  const onSubmit = async (e) => {
    e.preventDefault()
    setError('')
    try {
      await api.post('/api/auth/forgot-password', { email })
      setSent(true)
    } catch (e) {
      setError(e?.response?.data?.error || 'Failed to send reset email')
    }
  }

  return (
    <div className="container">
      <div className="card" style={{ maxWidth: 420, margin: '24px auto' }}>
        <h2>Reset your password</h2>
        {sent ? (
          <div className="small">If the email exists, a reset link has been sent. Please check your inbox.</div>
        ) : (
          <form onSubmit={onSubmit} className="grid" style={{ gap: 12 }}>
            <input className="input" type="email" value={email} onChange={e => setEmail(e.target.value)} placeholder="Email" required />
            {error && <div className="small" style={{ color: '#c00' }}>{error}</div>}
            <button className="btn">Send reset link</button>
          </form>
        )}
        <div className="row" style={{ marginTop: 12 }}><Link to="/login">Back to log in</Link></div>
      </div>
    </div>
  )
}
