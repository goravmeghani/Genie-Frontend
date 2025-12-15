import React from 'react'
import { Navigate, useLocation } from 'react-router-dom'
import { useAuth } from '../contexts/AuthContext'

interface ProtectedRouteProps {
  children: React.ReactNode
  allowGuest?: boolean
}

const ProtectedRoute: React.FC<ProtectedRouteProps> = ({ children, allowGuest = true }) => {
  const { user, session, loading } = useAuth()
  const location = useLocation()

  // Show loading only briefly to avoid flickering
  if (loading) {
    return (
      <div className="min-h-screen bg-gray-900 flex items-center justify-center relative overflow-hidden">
        {/* Magical Background */}
        <div className="absolute inset-0 bg-gradient-to-br from-blue-900/20 via-purple-900/20 to-cyan-900/20"></div>
        
        {/* Floating Particles */}
        {[...Array(20)].map((_, i) => (
          <div
            key={i}
            className="absolute w-2 h-2 rounded-full animate-pulse"
            style={{
              left: `${Math.random() * 100}%`,
              top: `${Math.random() * 100}%`,
              background: `radial-gradient(circle, rgba(${Math.random() > 0.5 ? '59, 130, 246' : '139, 92, 246'}, 0.8), transparent)`,
              animationDelay: `${Math.random() * 3}s`,
              animationDuration: `${2 + Math.random() * 3}s`
            }}
          />
        ))}
        
        {/* Magical Orbs */}
        <div className="absolute top-1/4 left-1/4 w-32 h-32 rounded-full bg-gradient-to-r from-blue-500/10 to-purple-500/10 blur-xl animate-pulse"></div>
        <div className="absolute bottom-1/4 right-1/4 w-24 h-24 rounded-full bg-gradient-to-r from-cyan-500/10 to-pink-500/10 blur-xl animate-pulse" style={{ animationDelay: '1s' }}></div>
        <div className="absolute top-1/2 right-1/3 w-20 h-20 rounded-full bg-gradient-to-r from-purple-500/10 to-blue-500/10 blur-xl animate-pulse" style={{ animationDelay: '2s' }}></div>
        
        {/* Main Loading Content */}
        <div className="text-center relative z-10">
          <div className="relative">
            <div className="w-20 h-20 rounded-3xl bg-gradient-to-r from-indigo-500 via-purple-500 to-cyan-500 flex items-center justify-center mx-auto mb-6 animate-pulse relative overflow-hidden">
              <img src="/logo.svg" alt="Genie logo" className="w-12 h-12 relative z-10" />
              <div className="absolute inset-0 bg-gradient-to-r from-blue-400/30 via-purple-400/30 to-cyan-400/30 animate-pulse"></div>
            </div>
            
            {/* Rotating Ring */}
            <div className="absolute inset-0 w-20 h-20 mx-auto border-2 border-transparent border-t-blue-400 border-r-purple-400 rounded-full animate-spin"></div>
            <div className="absolute inset-0 w-20 h-20 mx-auto border-2 border-transparent border-b-cyan-400 border-l-pink-400 rounded-full animate-spin" style={{ animationDirection: 'reverse', animationDuration: '2s' }}></div>
          </div>
          
          <h2 className="text-2xl font-bold text-white mb-3 bg-gradient-to-r from-blue-400 via-purple-400 to-cyan-400 bg-clip-text text-transparent animate-pulse">
            Initializing Genie...
          </h2>
          <p className="text-gray-300 mb-4">Preparing your AI workspace</p>
          
          {/* Loading Dots */}
          <div className="flex justify-center space-x-2">
            {[0, 1, 2].map((i) => (
              <div
                key={i}
                className="w-3 h-3 rounded-full bg-gradient-to-r from-blue-400 to-purple-400 animate-bounce"
                style={{ animationDelay: `${i * 0.2}s` }}
              ></div>
            ))}
          </div>
        </div>
      </div>
    )
  }

  if (!session) {
    return <Navigate to="/home" replace state={{ from: location }} />
  }

  if (!allowGuest && !user) {
    return <Navigate to="/home" replace state={{ from: location }} />
  }

  return <>{children}</>
}

export default ProtectedRoute
