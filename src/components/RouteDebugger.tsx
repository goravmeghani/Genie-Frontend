import React from 'react'
import { useLocation, useNavigate } from 'react-router-dom'
import { useAuth } from '../contexts/AuthContext'

const RouteDebugger: React.FC = () => {
  const location = useLocation()
  const navigate = useNavigate()
  const { user, loading } = useAuth()

  // Only show in development
  if (process.env.NODE_ENV !== 'development') {
    return null
  }

  return (
    <div className="fixed top-4 left-4 z-50 p-3 rounded-lg bg-black/80 text-white text-xs font-mono">
      <div>Current Path: {location.pathname}</div>
      <div>Auth Loading: {loading ? 'Yes' : 'No'}</div>
      <div>User: {user ? user.email : 'None'}</div>
      <div className="mt-2 space-x-2">
        <button 
          onClick={() => navigate('/home')}
          className="px-2 py-1 bg-blue-600 rounded text-xs"
        >
          Home
        </button>
        <button 
          onClick={() => navigate('/dashboard')}
          className="px-2 py-1 bg-green-600 rounded text-xs"
        >
          Dashboard
        </button>
      </div>
    </div>
  )
}

export default RouteDebugger






