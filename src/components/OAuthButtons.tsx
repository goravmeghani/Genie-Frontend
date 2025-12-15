import React, { useEffect } from 'react'
import { motion } from 'framer-motion'
import { Button } from './ui/button'
import { Github, Mail } from 'lucide-react'
import { useAuth } from '../contexts/AuthContext'
import { useNavigate } from 'react-router-dom'

interface OAuthButtonsProps {
  variant?: 'default' | 'compact'
  onSuccess?: () => void
}

const OAuthButtons: React.FC<OAuthButtonsProps> = ({ variant = 'default', onSuccess }) => {
  const { signIn, loading, user } = useAuth()
  const navigate = useNavigate()
  const [isSigningIn, setIsSigningIn] = React.useState(false)

  // Redirect to dashboard when user becomes authenticated
  useEffect(() => {
    if (user && onSuccess) {
      console.log('🎯 User authenticated, calling onSuccess...')
      onSuccess()
    }
  }, [user, onSuccess])

  const handleSignIn = async (provider: 'github' | 'google') => {
    console.log(`🔥 BUTTON CLICKED: ${provider}`)
    console.log(`🔐 Attempting to sign in with ${provider}...`)
    console.log(`📍 Current URL: ${window.location.href}`)
    console.log(`🏠 Origin: ${window.location.origin}`)
    
    setIsSigningIn(true)
    
    try {
      // Call the signIn function from context
      console.log(`📞 Calling signIn function...`)
      const result = await signIn(provider)
      console.log(`📤 Sign in result:`, result)
      
      // Check if we got a redirect URL
      if (result?.data?.url) {
        console.log(`🔄 Got redirect URL, navigating to: ${result.data.url}`)
        window.location.href = result.data.url
      } else if (result?.error) {
        console.log(`❌ Sign in returned error:`, result.error)
        alert(`OAuth error: ${result.error}`)
        setIsSigningIn(false)
      } else {
        console.log(`⚠️ No redirect URL received`)
        alert(`${provider} OAuth is not properly configured. Please check your Supabase settings.`)
        setIsSigningIn(false)
      }
      
    } catch (error) {
      console.error(`❌ Error signing in with ${provider}:`, error)
      alert(`OAuth setup required for ${provider}.\n\nError: ${error}\n\nPlease configure the provider in your Supabase dashboard:\n1. Go to Authentication → Providers\n2. Enable ${provider} provider\n3. Add your Client ID and Secret\n\nSee GITHUB-OAUTH-SETUP.md for detailed instructions.`)
      setIsSigningIn(false)
    }
  }

  // Demo mode - simulate OAuth for testing
  const handleDemoSignIn = (provider: 'github' | 'google') => {
    console.log(`Demo sign in with ${provider}`)
    alert(`Demo mode: ${provider} sign in would work here. Configure OAuth providers in Supabase to enable real authentication.`)
  }

  if (variant === 'compact') {
    return (
      <div className="flex gap-2">
        <Button
          type="button"
          onClick={() => handleSignIn('github')}
          disabled={isSigningIn}
          className="flex-1 h-10 rounded-xl bg-gray-800 hover:bg-gray-700 text-white border border-gray-600"
        >
          <Github className="h-4 w-4 mr-2 text-cyan-300" />
          {isSigningIn ? 'Signing in...' : 'GitHub'}
        </Button>
        <Button
          type="button"
          onClick={() => handleSignIn('google')}
          disabled={isSigningIn}
          className="flex-1 h-10 rounded-xl bg-gray-800 hover:bg-gray-700 text-white border border-gray-600"
        >
          <Mail className="h-4 w-4 mr-2 text-cyan-300" />
          {isSigningIn ? 'Signing in...' : 'Google'}
        </Button>
      </div>
    )
  }

  return (
    <div className="space-y-3">
      <motion.div
        whileHover={{ scale: 1.02 }}
        whileTap={{ scale: 0.98 }}
        className="w-full"
      >
        <Button
          type="button"
          onClick={() => handleSignIn('github')}
          disabled={isSigningIn}
          className="w-full h-12 rounded-2xl bg-gray-900 hover:bg-gray-800 text-white border border-gray-700 hover:border-gray-600 transition-all duration-300"
        >
          <Github className="h-5 w-5 mr-3 text-cyan-300" />
          {isSigningIn ? 'Signing in...' : 'Continue with GitHub'}
        </Button>
      </motion.div>
      
      <motion.div
        whileHover={{ scale: 1.02 }}
        whileTap={{ scale: 0.98 }}
        className="w-full"
      >
        <Button
          type="button"
          onClick={() => handleSignIn('google')}
          disabled={isSigningIn}
          className="w-full h-12 rounded-2xl bg-gray-900 hover:bg-gray-800 text-white border border-gray-700 hover:border-gray-600 transition-all duration-300"
        >
          <Mail className="h-5 w-5 mr-3 text-cyan-300" />
          {isSigningIn ? 'Signing in...' : 'Continue with Google'}
        </Button>
      </motion.div>
    </div>
  )
}

export default OAuthButtons

