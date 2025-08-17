import { Link, useLocation, useNavigate } from 'react-router-dom'
import useAuth from '../hooks/useAuth'

export default function Navbar() {
  const { user, logout } = useAuth()
  const location = useLocation()
  const navigate = useNavigate()

  return (
    <div className="nav">
      <div className="row">
        <h1>AI Legal Doc Explainer</h1>
        <span className="badge">CodeStorm AI</span>
      </div>
      <div className="row">
        {user ? (
          <>
            <span className="small">{user.email}</span>
            <button className="btn secondary" onClick={() => { logout(); navigate('/login') }}>Logout</button>
          </>
        ) : (
          location.pathname !== '/login' && <Link to="/login" className="btn">Login</Link>
        )}
      </div>
    </div>
  )
}
