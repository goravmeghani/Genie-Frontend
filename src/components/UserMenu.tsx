import React, { useState } from 'react'
import { motion, AnimatePresence } from 'framer-motion'
import { Button } from './ui/button'
import { User, LogOut, Settings, ChevronDown } from 'lucide-react'
import { useAuth } from '../contexts/AuthContext'
import { useNavigate } from 'react-router-dom'

const UserMenu: React.FC = () => {
  const { user, signOut } = useAuth()
  const [isOpen, setIsOpen] = useState(false)
  const navigate = useNavigate()

  if (!user) return null

  const userInitials = user.user_metadata?.full_name
    ?.split(' ')
    .map((n: string) => n[0])
    .join('')
    .toUpperCase() || user.email?.[0]?.toUpperCase() || 'U'

  const userName = user.user_metadata?.full_name || user.email?.split('@')[0] || 'User'

  return (
    <div className="relative">
      <motion.button
        onClick={() => setIsOpen(!isOpen)}
        className="flex items-center gap-2 px-3 py-2 rounded-xl bg-slate-800/60 hover:bg-slate-800/80 transition-all duration-300"
        whileHover={{ scale: 1.02 }}
        whileTap={{ scale: 0.98 }}
      >
        <div className="w-8 h-8 rounded-lg bg-gradient-to-r from-indigo-500 to-purple-500 flex items-center justify-center text-white text-sm font-semibold">
          {userInitials}
        </div>
        <span className="text-sm text-gray-200 hidden md:block">{userName}</span>
        <ChevronDown className={`h-4 w-4 text-cyan-300 transition-transform ${isOpen ? 'rotate-180' : ''}`} />
      </motion.button>

      <AnimatePresence>
        {isOpen && (
          <motion.div
            initial={{ opacity: 0, y: -10, scale: 0.95 }}
            animate={{ opacity: 1, y: 0, scale: 1 }}
            exit={{ opacity: 0, y: -10, scale: 0.95 }}
            transition={{ duration: 0.2 }}
            className="absolute right-0 top-full mt-2 w-48 rounded-2xl shadow-lg shadow-indigo-500/10 border border-slate-700/40 overflow-hidden"
            style={{ 
              background: 'linear-gradient(135deg, rgba(15,23,42,0.9), rgba(2,6,23,0.8))',
              backdropFilter: 'blur(16px)'
            }}
          >
            <div className="p-2">
              <div className="px-3 py-2 text-sm text-gray-300 border-b border-slate-700/40">
                <div className="font-medium">{userName}</div>
                <div className="text-xs text-gray-500">{user.email}</div>
              </div>
              
              <div className="py-1">
                <button className="w-full flex items-center gap-3 px-3 py-2 text-sm text-gray-300 hover:text-white hover:bg-slate-800/50 rounded-lg transition-colors">
                  <User className="h-4 w-4 text-cyan-300" />
                  Profile
                </button>
                <button className="w-full flex items-center gap-3 px-3 py-2 text-sm text-gray-300 hover:text-white hover:bg-slate-800/50 rounded-lg transition-colors">
                  <Settings className="h-4 w-4 text-cyan-300" />
                  Settings
                </button>
                <button 
                  onClick={async () => {
                    await signOut()
                    navigate('/home')
                  }}
                  className="w-full flex items-center gap-3 px-3 py-2 text-sm text-red-400 hover:text-red-300 hover:bg-red-500/10 rounded-lg transition-colors"
                >
                  <LogOut className="h-4 w-4 text-white" />
                  Sign out
                </button>
              </div>
            </div>
          </motion.div>
        )}
      </AnimatePresence>
    </div>
  )
}

export default UserMenu
