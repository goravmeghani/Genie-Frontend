import React from 'react'
import { motion } from 'framer-motion'

interface LogoProps {
  size?: 'sm' | 'md' | 'lg'
  className?: string
}

const Logo: React.FC<LogoProps> = ({ size = 'md', className = '' }) => {
  const sizeClasses = {
    sm: 'w-12 h-12',
    md: 'w-16 h-16', 
    lg: 'w-20 h-20'
  }
  
  const logoSizeClasses = {
    sm: 'w-10 h-10',
    md: 'w-15 h-15',
    lg: 'w-15 h-15'
  }

  return (
    <motion.div 
      className={`${sizeClasses[size]} rounded-2xl flex items-center justify-center relative overflow-hidden ${className}`}
      style={{
        background: 'linear-gradient(135deg, #1e293b, #334155)',
        border: '2px solid rgba(59, 130, 246, 0.3)',
        boxShadow: '0 8px 32px rgba(0, 0, 0, 0.3), 0 0 0 1px rgba(59, 130, 246, 0.1)'
      }}
      whileHover={{ 
        scale: 1.05,
        borderColor: 'rgba(59, 130, 246, 0.6)',
        boxShadow: '0 12px 40px rgba(0, 0, 0, 0.4), 0 0 0 1px rgba(59, 130, 246, 0.2)'
      }}
      transition={{ duration: 0.2 }}
    >
      <div className={`relative ${logoSizeClasses[size]}`}>
        <img 
          src="/logo.svg" 
          alt="Genie logo" 
          className={`${logoSizeClasses[size]} object-contain relative z-10`}
          style={{ 
            filter: 'brightness(1.1) saturate(1.2)',
            color: '#3b82f6'
          }}
        />
        <motion.div
          className="absolute inset-0 bg-gradient-to-br from-blue-400/30 via-purple-500/20 to-cyan-400/30 rounded-full"
          animate={{ opacity: [0.3, 0.7, 0.3] }}
          transition={{ duration: 3, repeat: Infinity, ease: 'easeInOut' }}
        />
      </div>
    </motion.div>
  )
}

export default Logo
