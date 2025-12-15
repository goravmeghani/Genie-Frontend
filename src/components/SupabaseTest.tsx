import React, { useEffect, useState } from 'react'
import { supabase } from '../lib/supabaseClient'

const SupabaseTest: React.FC = () => {
  const [status, setStatus] = useState<'testing' | 'connected' | 'error'>('testing')
  const [error, setError] = useState<string>('')

  useEffect(() => {
    const testConnection = async () => {
      try {
        console.log('🧪 Testing Supabase connection...')
        
        // Test basic connection
        const { data, error } = await supabase.auth.getSession()
        
        if (error) {
          console.error('❌ Supabase auth error:', error)
          setError(error.message)
          setStatus('error')
        } else {
          console.log('✅ Supabase connected successfully')
          console.log('📋 Current session:', data.session)
          setStatus('connected')
        }
      } catch (err) {
        console.error('❌ Connection test failed:', err)
        setError(err instanceof Error ? err.message : 'Unknown error')
        setStatus('error')
      }
    }

    testConnection()
  }, [])

  return (
    <div className="fixed bottom-4 left-4 z-50 p-3 rounded-lg bg-black/80 text-white text-xs font-mono">
      <div className="mb-2">Supabase Status:</div>
      <div className="flex items-center gap-2">
        <div className={`w-2 h-2 rounded-full ${
          status === 'connected' ? 'bg-green-400' : 
          status === 'error' ? 'bg-red-400' : 'bg-yellow-400'
        }`} />
        <span>
          {status === 'connected' ? 'Connected' : 
           status === 'error' ? 'Error' : 'Testing...'}
        </span>
      </div>
      {error && (
        <div className="mt-2 text-red-300 text-xs">
          {error}
        </div>
      )}
    </div>
  )
}

export default SupabaseTest






