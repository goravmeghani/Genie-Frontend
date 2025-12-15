import React from 'react'
import { useNavigate } from 'react-router-dom'

const TestRoute: React.FC = () => {
  const navigate = useNavigate()

  return (
    <div className="min-h-screen bg-gray-900 text-white flex items-center justify-center">
      <div className="text-center">
        <h1 className="text-4xl font-bold mb-4">Test Route</h1>
        <p className="text-gray-300 mb-8">This is a test route to verify routing is working.</p>
        <div className="space-x-4">
          <button 
            onClick={() => navigate('/home')}
            className="px-6 py-3 bg-blue-600 rounded-xl hover:bg-blue-700 transition-colors"
          >
            Go to Home
          </button>
          <button 
            onClick={() => navigate('/dashboard')}
            className="px-6 py-3 bg-green-600 rounded-xl hover:bg-green-700 transition-colors"
          >
            Go to Dashboard
          </button>
        </div>
      </div>
    </div>
  )
}

export default TestRoute






