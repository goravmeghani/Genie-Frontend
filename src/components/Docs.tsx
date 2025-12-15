import React from 'react'
import { motion } from 'framer-motion'
import { 
  BookOpen, 
  FileText, 
  Code, 
  Zap, 
  Settings, 
  Play,
  Download,
  ExternalLink,
  ChevronRight,
  Star,
  Clock
} from 'lucide-react'

const Docs: React.FC = () => {
  const docsSections = [
    {
      title: "Getting Started",
      icon: Play,
      color: "blue",
      items: [
        { title: "Quick Start Guide", description: "Get up and running in 5 minutes", time: "3 min read" },
        { title: "Installation", description: "Set up Genie in your environment", time: "2 min read" },
        { title: "First Project", description: "Create your first AI-powered project", time: "5 min read" }
      ]
    },
    {
      title: "API Reference",
      icon: Code,
      color: "purple",
      items: [
        { title: "Authentication", description: "OAuth and session management", time: "4 min read" },
        { title: "Chat API", description: "Interact with the AI assistant", time: "6 min read" },
        { title: "Webhooks", description: "Real-time event handling", time: "3 min read" }
      ]
    },
    {
      title: "Guides",
      icon: BookOpen,
      color: "cyan",
      items: [
        { title: "Best Practices", description: "Optimize your AI workflows", time: "8 min read" },
        { title: "Troubleshooting", description: "Common issues and solutions", time: "5 min read" },
        { title: "Advanced Usage", description: "Power user features", time: "10 min read" }
      ]
    }
  ]

  const quickActions = [
    { title: "API Documentation", icon: ExternalLink, color: "blue" },
    { title: "Download SDK", icon: Download, color: "green" },
    { title: "Community Forum", icon: Star, color: "yellow" },
    { title: "Support Center", icon: Settings, color: "purple" }
  ]

  const getColorClasses = (color: string) => {
    const colors = {
      blue: "from-blue-500 to-blue-600",
      purple: "from-purple-500 to-purple-600", 
      cyan: "from-cyan-500 to-cyan-600",
      green: "from-green-500 to-green-600",
      yellow: "from-yellow-500 to-yellow-600"
    }
    return colors[color as keyof typeof colors] || colors.blue
  }

  return (
    <div className="h-full flex flex-col bg-gray-900 text-white">
      {/* Header */}
      <div className="p-6 border-b border-slate-700/30">
        <div className="flex items-center gap-3 mb-4">
          <div className="w-10 h-10 rounded-xl bg-gradient-to-r from-blue-500 to-purple-500 flex items-center justify-center">
            <BookOpen className="w-6 h-6 text-white" />
          </div>
          <div>
            <h1 className="text-2xl font-bold bg-gradient-to-r from-blue-400 to-purple-400 bg-clip-text text-transparent">
              Documentation
            </h1>
            <p className="text-gray-400 text-sm">Learn how to use Genie effectively</p>
          </div>
        </div>
        
        {/* Search Bar */}
        <div className="relative">
          <input
            type="text"
            placeholder="Search documentation..."
            className="w-full px-4 py-3 pl-12 rounded-xl bg-slate-800/50 border border-slate-700/50 text-white placeholder-gray-400 focus:outline-none focus:ring-2 focus:ring-blue-500/50 focus:border-blue-500/50"
          />
          <BookOpen className="absolute left-4 top-1/2 transform -translate-y-1/2 w-5 h-5 text-cyan-300" />
        </div>
      </div>

      <div className="flex-1 flex overflow-hidden">
        {/* Sidebar */}
        <div className="w-80 overflow-y-auto border-r border-slate-700/30 bg-slate-900/30 p-6">
          <div className="space-y-6">
            {docsSections.map((section, sectionIndex) => (
              <motion.div
                key={section.title}
                initial={{ opacity: 0, x: -20 }}
                animate={{ opacity: 1, x: 0 }}
                transition={{ delay: sectionIndex * 0.1 }}
              >
                <div className="flex items-center gap-3 mb-4">
                  <div className={`w-8 h-8 rounded-lg bg-gradient-to-r ${getColorClasses(section.color)} flex items-center justify-center`}>
                    <section.icon className="w-4 h-4 text-white" />
                  </div>
                  <h3 className="font-semibold text-white">{section.title}</h3>
                </div>
                
                <div className="space-y-2 ml-11">
                  {section.items.map((item, itemIndex) => (
                    <motion.div
                      key={item.title}
                      className="p-3 rounded-lg hover:bg-slate-800/50 cursor-pointer transition-colors group"
                      whileHover={{ x: 4 }}
                      initial={{ opacity: 0, x: -10 }}
                      animate={{ opacity: 1, x: 0 }}
                      transition={{ delay: (sectionIndex * 0.1) + (itemIndex * 0.05) }}
                    >
                      <div className="flex items-start justify-between">
                        <div className="flex-1">
                          <h4 className="font-medium text-white group-hover:text-blue-400 transition-colors">
                            {item.title}
                          </h4>
                          <p className="text-sm text-gray-400 mt-1">{item.description}</p>
                        </div>
                        <div className="flex items-center gap-2 ml-3">
                          <Clock className="w-3 h-3 text-cyan-300" />
                          <span className="text-xs text-gray-500">{item.time}</span>
                        </div>
                      </div>
                    </motion.div>
                  ))}
                </div>
              </motion.div>
            ))}
          </div>
        </div>

        {/* Main Content */}
      <div className="flex-1 overflow-y-auto p-6">
          <div className="max-w-4xl">
            {/* Welcome Section */}
            <motion.div
              initial={{ opacity: 0, y: 20 }}
              animate={{ opacity: 1, y: 0 }}
              transition={{ delay: 0.2 }}
              className="mb-8"
            >
              <h2 className="text-3xl font-bold mb-4 bg-gradient-to-r from-blue-400 via-purple-400 to-cyan-400 bg-clip-text text-transparent">
                Welcome to Genie Docs
              </h2>
              <p className="text-gray-300 text-lg leading-relaxed">
                Genie is your AI-powered development assistant that helps you build, deploy, and manage applications with intelligent automation and real-time collaboration.
              </p>
            </motion.div>

            {/* Quick Actions */}
            <motion.div
              initial={{ opacity: 0, y: 20 }}
              animate={{ opacity: 1, y: 0 }}
              transition={{ delay: 0.3 }}
              className="mb-8"
            >
              <h3 className="text-xl font-semibold mb-4 text-white">Quick Actions</h3>
              <div className="grid grid-cols-2 gap-4">
                {quickActions.map((action, index) => (
                  <motion.div
                    key={action.title}
                    className="p-4 rounded-xl bg-slate-800/50 border border-slate-700/50 hover:border-slate-600/50 cursor-pointer group transition-all"
                    whileHover={{ scale: 1.02, y: -2 }}
                    initial={{ opacity: 0, y: 20 }}
                    animate={{ opacity: 1, y: 0 }}
                    transition={{ delay: 0.4 + index * 0.1 }}
                  >
                    <div className="flex items-center gap-3">
                      <div className={`w-10 h-10 rounded-lg bg-gradient-to-r ${getColorClasses(action.color)} flex items-center justify-center`}>
                        <action.icon className="w-5 h-5 text-white" />
                      </div>
                      <div>
                        <h4 className="font-medium text-white group-hover:text-blue-400 transition-colors">
                          {action.title}
                        </h4>
                      </div>
                      <ChevronRight className="w-4 h-4 text-cyan-300 ml-auto group-hover:text-white transition-colors" />
                    </div>
                  </motion.div>
                ))}
              </div>
            </motion.div>

            {/* Getting Started Guide */}
            <motion.div
              initial={{ opacity: 0, y: 20 }}
              animate={{ opacity: 1, y: 0 }}
              transition={{ delay: 0.5 }}
              className="bg-slate-800/30 rounded-xl p-6 border border-slate-700/50"
            >
              <div className="flex items-center gap-3 mb-4">
                <div className="w-8 h-8 rounded-lg bg-gradient-to-r from-green-500 to-green-600 flex items-center justify-center">
                  <Zap className="w-4 h-4 text-white" />
                </div>
                <h3 className="text-xl font-semibold text-white">Getting Started</h3>
              </div>
              
              <div className="space-y-4">
                <div className="flex items-start gap-4">
                  <div className="w-6 h-6 rounded-full bg-blue-500 flex items-center justify-center text-white text-sm font-bold">1</div>
                  <div>
                    <h4 className="font-medium text-white mb-2">Install Genie CLI</h4>
                    <div className="bg-slate-900/50 rounded-lg p-3 font-mono text-sm text-gray-300">
                      npm install -g @genie/cli
                    </div>
                  </div>
                </div>
                
                <div className="flex items-start gap-4">
                  <div className="w-6 h-6 rounded-full bg-blue-500 flex items-center justify-center text-white text-sm font-bold">2</div>
                  <div>
                    <h4 className="font-medium text-white mb-2">Initialize your project</h4>
                    <div className="bg-slate-900/50 rounded-lg p-3 font-mono text-sm text-gray-300">
                      genie init my-project
                    </div>
                  </div>
                </div>
                
                <div className="flex items-start gap-4">
                  <div className="w-6 h-6 rounded-full bg-blue-500 flex items-center justify-center text-white text-sm font-bold">3</div>
                  <div>
                    <h4 className="font-medium text-white mb-2">Start developing</h4>
                    <div className="bg-slate-900/50 rounded-lg p-3 font-mono text-sm text-gray-300">
                      genie dev
                    </div>
                  </div>
                </div>
              </div>
            </motion.div>
          </div>
        </div>
      </div>
    </div>
  )
}

export default Docs
