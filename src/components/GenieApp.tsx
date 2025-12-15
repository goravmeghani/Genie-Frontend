import React, { useState } from "react";
import { motion, AnimatePresence, MotionConfig } from "framer-motion";
import { Tabs, TabsList, TabsTrigger, TabsContent } from "./ui/tabs";
import { Button } from "./ui/button";
import { Input } from "./ui/input";
import { ScrollArea } from "./ui/scroll-area";
import FuturisticBackground from "./FuturisticBackground";
import FloatingSparkles from "./FloatingSparkles";
import GlowOrbs from "./GlowOrbs";
import AuroraGradient from "./AuroraGradient";
import { 
  Plus, 
  Send, 
  Settings, 
  Bell, 
  User, 
  Play, 
  Save,
  FileCode2, 
  BookOpen, 
  Monitor,
  MessageSquare,
  Folder,
  MoreHorizontal,
  Menu,
  X,
  Zap,
  Code,
  Sparkles
} from "lucide-react";
import MagneticButton from "./MagneticButton";
import ClickBurst from "./ClickBurst";
import Typewriter from "./Typewriter";
import UserMenu from "./UserMenu";
import Logo from "./Logo";
import Docs from "./Docs";
import { useAuth } from "../contexts/AuthContext";
import { useNavigate } from "react-router-dom";

interface Message {
  id: string;
  type: 'user' | 'assistant';
  content: string;
  timestamp: string;
}

const GenieApp: React.FC = () => {
  const [message, setMessage] = useState("");
  const [sidebarOpen, setSidebarOpen] = useState(true);
  const [activeTab, setActiveTab] = useState("code");
  const { user, signOut } = useAuth();
  const navigate = useNavigate();
  const [messages, setMessages] = useState<Message[]>([
    {
      id: '1',
      type: 'assistant',
      content: 'Hello! I can help scaffold your computer vision project. Do you want a web preview too?',
      timestamp: '09:42'
    },
    {
      id: '2',
      type: 'user',
      content: 'Yes. Create a minimal Vite + React app and add an upload to test images.',
      timestamp: '09:43'
    },
    {
      id: '3',
      type: 'assistant',
      content: 'Great. I prepared starter files and a docs note. Check the Code tab and Preview.',
      timestamp: '09:44'
    }
  ]);

  const handleSendMessage = () => {
    if (message.trim()) {
      const newMessage: Message = {
        id: Date.now().toString(),
        type: 'user',
        content: message,
        timestamp: new Date().toLocaleTimeString('en-US', { 
          hour: '2-digit', 
          minute: '2-digit',
          hour12: false 
        })
      };
      setMessages(prev => [...prev, newMessage]);
      setMessage("");
    }
  };

  const sidebarVariants = {
    open: { x: 0, opacity: 1 },
    closed: { x: -280, opacity: 0.8 }
  };

  const messageVariants = {
    hidden: { opacity: 0, y: 20, scale: 0.95 },
    visible: { 
      opacity: 1, 
      y: 0, 
      scale: 1
    }
  };

  // Enhanced glassmorphism styles
  const glassStyle = {
    background: 'rgba(15, 23, 42, 0.85)',
    backdropFilter: 'blur(24px)',
    border: '1px solid rgba(99, 102, 241, 0.2)',
    boxShadow: `
      0 0 0 1px rgba(99, 102, 241, 0.1),
      0 8px 32px rgba(0, 0, 0, 0.4),
      inset 0 1px 0 rgba(255, 255, 255, 0.1),
      0 0 20px rgba(99, 102, 241, 0.05)
    `
  };

  const enhancedGlassStyle = {
    background: 'rgba(15, 23, 42, 0.9)',
    backdropFilter: 'blur(32px)',
    border: '1px solid rgba(139, 92, 246, 0.3)',
    boxShadow: `
      0 0 0 1px rgba(139, 92, 246, 0.2),
      0 12px 48px rgba(0, 0, 0, 0.5),
      inset 0 1px 0 rgba(255, 255, 255, 0.15),
      0 0 30px rgba(139, 92, 246, 0.1)
    `
  };

  const codeHighlightColors = {
    keyword: '#c792ea',
    string: '#a5f3fc',
    function: '#fbbf24',
    variable: '#60a5fa',
    comment: '#64748b',
    tag: '#f472b6',
    attribute: '#34d399'
  };

  return (
    <MotionConfig reducedMotion="user" transition={{ duration: 0.45, ease: [0.22, 1, 0.36, 1] }}>
    <div className="flex h-screen bg-gray-900 text-white relative overflow-hidden">
      <AuroraGradient />
      <GlowOrbs />
      <FloatingSparkles count={18} />
      {/* Enhanced Futuristic Background */}
      <FuturisticBackground 
        particleCount={120}
        colors={{
          primary: '#06b6d4',
          secondary: '#3b82f6',
          accent: '#8b5cf6'
        }}
      />

      {/* Top Navigation Bar */}
      <motion.div
        className="fixed top-0 right-0 z-50 p-4 transform-gpu"
        initial={{ opacity: 0, y: -20 }}
        animate={{ opacity: 1, y: 0 }}
        transition={{ delay: 0.2 }}
        style={{ willChange: 'transform, opacity' }}
      >
        <div 
          className="flex items-center gap-3 px-4 py-2 rounded-2xl"
          style={{
            background: 'rgba(15, 23, 42, 0.8)',
            backdropFilter: 'blur(20px)',
            border: '1px solid rgba(99, 102, 241, 0.2)',
            boxShadow: '0 8px 32px rgba(0, 0, 0, 0.3), 0 0 20px rgba(99, 102, 241, 0.05)'
          }}
        >
          <motion.div 
            whileHover={{ scale: 1.1, boxShadow: '0 0 20px rgba(59, 130, 246, 0.4)' }} 
            whileTap={{ scale: 0.9 }}
            transition={{ duration: 0.18, ease: 'easeOut' }}
          >
			<Button variant="ghost" size="sm" className="w-9 h-9 p-0 text-gray-400 hover:text-cyan-400 hover:bg-cyan-400/10 rounded-xl transition-all duration-300">
			  <Bell className="h-4 w-4 text-cyan-300" />
			</Button>
          </motion.div>
          <motion.div 
            whileHover={{ scale: 1.1, boxShadow: '0 0 20px rgba(139, 92, 246, 0.4)' }} 
            whileTap={{ scale: 0.9 }}
            transition={{ duration: 0.18, ease: 'easeOut' }}
          >
			<Button variant="ghost" size="sm" className="w-9 h-9 p-0 text-gray-400 hover:text-purple-400 hover:bg-purple-400/10 rounded-xl transition-all duration-300">
			  <Settings className="h-4 w-4 text-cyan-300" />
			</Button>
          </motion.div>
          {user ? (
            <UserMenu />
          ) : (
            <Logo size="md" className="ml-2" />
          )}
        </div>
      </motion.div>

      {/* Mobile menu button */}
      <motion.button
        className="fixed top-4 left-4 z-50 md:hidden p-3 rounded-2xl"
        style={glassStyle}
        onClick={() => setSidebarOpen(!sidebarOpen)}
        whileHover={{ scale: 1.05, boxShadow: '0 0 30px rgba(99, 102, 241, 0.3)' }}
        whileTap={{ scale: 0.95 }}
      >
        {sidebarOpen ? <X className="h-5 w-5 text-white" /> : <Menu className="h-5 w-5 text-white" />}
      </motion.button>

      {/* Enhanced Left Sidebar with glassmorphism */}
      <AnimatePresence mode="popLayout">
        {(sidebarOpen || window.innerWidth >= 768) && (
          <motion.div
            className="w-72 flex flex-col relative z-20 md:relative fixed inset-y-0 left-0 rounded-r-3xl transform-gpu"
            style={{ ...enhancedGlassStyle, willChange: 'transform, opacity' }}
            variants={sidebarVariants}
            initial="closed"
            animate="open"
            exit="closed"
            transition={{ type: "spring", stiffness: 160, damping: 24, mass: 0.9 }}
            layout
          >
            {/* Header */}
            <motion.div 
              className="flex items-center justify-between p-6"
              initial={{ opacity: 0, y: -20 }}
              animate={{ opacity: 1, y: 0 }}
              transition={{ delay: 0.2 }}
            >
              <div className="flex items-center gap-3">
                <Logo size="md" />
                <div>
                  <span className="font-bold text-xl bg-gradient-to-r from-indigo-400 to-purple-400 bg-clip-text text-transparent">
                    Genie
                  </span>
                  <div className="text-xs text-gray-400">AI Assistant</div>
                </div>
              </div>
            </motion.div>

            <ScrollArea className="flex-1 px-6">
              {/* New Project Button */}
              <motion.div
                initial={{ opacity: 0, x: -20 }}
                animate={{ opacity: 1, x: 0 }}
                transition={{ delay: 0.3 }}
              >
                <Button 
                  className="w-full mb-8 h-12 rounded-2xl text-white font-semibold relative overflow-hidden group"
                  style={{ 
                    background: 'linear-gradient(135deg, #3b82f6, #1d4ed8, #1e40af)',
                    boxShadow: '0 0 30px rgba(59, 130, 246, 0.3), 0 8px 24px rgba(0, 0, 0, 0.3)'
                  }}
                >
                  <motion.div
                    className="absolute inset-0 bg-gradient-to-r from-cyan-400/20 via-blue-400/20 to-purple-400/20"
                    initial={{ x: '-100%' }}
                    whileHover={{ x: '100%' }}
                    transition={{ duration: 0.6 }}
                  />
                  <Plus className="h-5 w-5 mr-3 relative z-10 text-white" />
                  <span className="relative z-10">New Project</span>
                  <Zap className="h-4 w-4 ml-auto relative z-10 text-cyan-300" />
                </Button>
              </motion.div>

              {/* Projects Section */}
              <motion.div 
                className="mb-8"
                initial={{ opacity: 0, y: 20 }}
                animate={{ opacity: 1, y: 0 }}
                transition={{ delay: 0.4 }}
              >
                <h3 className="text-sm font-semibold text-gray-400 mb-4 px-2 uppercase tracking-wider">Projects</h3>
                <div className="space-y-2">
                  {/* Vision Assistant - Active */}
                  <motion.div 
                    className="p-4 rounded-2xl text-white cursor-pointer relative overflow-hidden group"
                    style={{
                      background: 'linear-gradient(135deg, #3b82f6, #1d4ed8)',
                      boxShadow: '0 0 30px rgba(59, 130, 246, 0.4), 0 8px 24px rgba(0, 0, 0, 0.2)'
                    }}
                    whileHover={{ scale: 1.02, y: -2 }}
                    whileTap={{ scale: 0.98 }}
                  >
                    <motion.div
                      className="absolute inset-0 bg-gradient-to-r from-cyan-400/10 to-purple-400/10"
                      initial={{ opacity: 0 }}
                      whileHover={{ opacity: 1 }}
                      transition={{ duration: 0.3 }}
                    />
                    <div className="flex items-center gap-4 relative z-10">
                      <motion.div 
                        className="w-3 h-3 rounded-full bg-cyan-300"
                        animate={{ scale: [1, 1.3, 1], opacity: [0.7, 1, 0.7] }}
                        transition={{ duration: 2, repeat: Infinity }}
                        style={{ boxShadow: '0 0 10px rgba(103, 232, 249, 0.6)' }}
                      />
                      <div className="flex-1">
                        <div className="font-semibold text-sm">Vision Assistant</div>
                        <div className="text-xs text-blue-100 opacity-80">5 files • Active</div>
                      </div>
                      <Code className="h-4 w-4 text-cyan-300" />
                    </div>
                  </motion.div>
                  
                  {/* Other Projects */}
                  {[
                    { name: 'Genie Docs', files: 7, color: 'purple', icon: BookOpen },
                    { name: 'Research Agent', files: 2, color: 'emerald', icon: Zap }
                  ].map((project, index) => (
                    <motion.div 
                      key={project.name}
                      className="p-4 rounded-2xl text-gray-300 cursor-pointer relative group"
                      style={{
                        background: 'rgba(30, 41, 59, 0.6)',
                        backdropFilter: 'blur(16px)',
                        border: '1px solid rgba(71, 85, 105, 0.3)'
                      }}
                      whileHover={{ 
                        scale: 1.02, 
                        y: -2,
                        background: 'rgba(30, 41, 59, 0.8)',
                        boxShadow: `0 0 20px rgba(${project.color === 'purple' ? '139, 92, 246' : '16, 185, 129'}, 0.2)`
                      }}
                      whileTap={{ scale: 0.98 }}
                      initial={{ opacity: 0, x: -20 }}
                      animate={{ opacity: 1, x: 0 }}
                      transition={{ delay: 0.5 + index * 0.1 }}
                    >
                      <div className="flex items-center gap-4">
                        <div className={`w-3 h-3 rounded-full bg-${project.color}-400`} 
                             style={{ boxShadow: `0 0 8px rgba(${project.color === 'purple' ? '139, 92, 246' : '16, 185, 129'}, 0.4)` }} />
                        <div className="flex-1">
                          <div className="font-medium text-sm">{project.name}</div>
                          <div className="text-xs text-gray-500">{project.files} files</div>
                        </div>
                        <project.icon className="h-4 w-4 text-cyan-300 group-hover:text-white" />
                      </div>
                    </motion.div>
                  ))}
                </div>
              </motion.div>

              {/* New Chat Button */}
              <motion.div
                initial={{ opacity: 0, x: -20 }}
                animate={{ opacity: 1, x: 0 }}
                transition={{ delay: 0.6 }}
              >
                <Button 
                  variant="outline" 
                  className="w-full mb-8 h-12 rounded-2xl text-gray-300 font-medium hover:text-white transition-all duration-300"
                  style={{ 
                    borderColor: 'rgba(99, 102, 241, 0.3)',
                    background: 'rgba(30, 41, 59, 0.4)',
                    backdropFilter: 'blur(16px)'
                  }}
                >
                  <MessageSquare className="h-5 w-5 mr-3 text-cyan-300" />
                  New Chat
                  <Plus className="h-4 w-4 ml-auto text-white" />
                </Button>
              </motion.div>

              {/* Chats Section */}
              <motion.div
                initial={{ opacity: 0, y: 20 }}
                animate={{ opacity: 1, y: 0 }}
                transition={{ delay: 0.7 }}
              >
                <h3 className="text-sm font-semibold text-gray-400 mb-4 px-2 uppercase tracking-wider">Recent Chats</h3>
                <div className="space-y-2">
                  {[
                    { name: 'Model Tuning', time: 'Yesterday' },
                    { name: 'UI Polish', time: '2d' },
                    { name: 'Roadmap', time: '1w' }
                  ].map((chat, index) => (
                    <motion.div 
                      key={chat.name}
                      className="p-3 rounded-xl hover:bg-slate-800/50 text-gray-400 cursor-pointer group transition-all duration-300"
                      whileHover={{ x: 4, background: 'rgba(30, 41, 59, 0.6)' }}
                      initial={{ opacity: 0, x: -20 }}
                      animate={{ opacity: 1, x: 0 }}
                      transition={{ delay: 0.8 + index * 0.1 }}
                    >
                      <div className="flex items-center gap-3">
                        <MessageSquare className="h-4 w-4 text-cyan-300 transition-colors group-hover:text-white" />
                        <div className="flex-1 min-w-0">
                          <div className="text-sm font-medium truncate group-hover:text-gray-300">{chat.name}</div>
                        </div>
                        <div className="text-xs text-gray-500">{chat.time}</div>
                      </div>
                    </motion.div>
                  ))}
                </div>
              </motion.div>
            </ScrollArea>

            {/* Bottom Section */}
            <motion.div 
              className="p-6 border-t border-slate-700/50"
              initial={{ opacity: 0, y: 20 }}
              animate={{ opacity: 1, y: 0 }}
              transition={{ delay: 0.9 }}
            >
              <Button 
                variant="ghost" 
                className="w-full justify-start text-gray-400 hover:text-white hover:bg-slate-800/50 h-12 rounded-xl transition-all duration-300"
              >
                <Folder className="h-5 w-5 mr-3 text-cyan-300" />
                Compact View
                <Settings className="h-4 w-4 ml-auto text-cyan-300" />
              </Button>
            </motion.div>
          </motion.div>
        )}
      </AnimatePresence>

      {/* Main Content Area */}
      <div className="flex-1 flex relative z-10">
        {/* Enhanced Chat Section */}
        <motion.div 
          className="w-[380px] flex flex-col border-r border-slate-700/30 relative rounded-3xl mr-5 transform-gpu"
          style={{ ...glassStyle, willChange: 'transform, opacity' }}
          initial={{ opacity: 0, x: 50 }}
          animate={{ opacity: 1, x: 0 }}
          transition={{ delay: 0.3 }}
          layout
        >
          {/* Chat Header */}
          <motion.div 
            className="p-6 border-b border-slate-700/30"
            initial={{ opacity: 0, y: -20 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ delay: 0.4 }}
          >
            <h2 className="font-bold text-xl bg-gradient-to-r from-indigo-400 to-cyan-400 bg-clip-text text-transparent">
              Vision Assistant
            </h2>
            <p className="text-sm text-gray-400 mt-1">AI-powered development chat</p>
            {/* Quick suggestions */}
            <div className="mt-4 -mb-2 flex gap-2 overflow-x-auto pb-1">
              {[
                'Generate a React component',
                'Explain this code',
                'Create API route',
                'Add Tailwind styles'
              ].map((s) => (
                <button
                  key={s}
                  onClick={() => setMessage(s)}
                  className="shrink-0 px-3 py-1.5 rounded-xl text-xs font-medium bg-slate-800/60 text-gray-300 hover:text-white border border-slate-700/60 hover:border-slate-600/80 transition-colors"
                >
                  {s}
                </button>
              ))}
            </div>
          </motion.div>

          {/* Messages */}
          <ScrollArea className="flex-1 p-6">
            <motion.div className="space-y-6" layout>
              <AnimatePresence mode="popLayout">
                {messages.map((msg, index) => (
                  <motion.div
                    key={msg.id}
                    variants={messageVariants}
                    initial="hidden"
                    animate="visible"
                    transition={{ 
                      delay: index * 0.1,
                      type: "spring",
                      stiffness: 160,
                      damping: 24,
                      mass: 0.9
                    }}
                    layout
                    style={{ willChange: 'transform, opacity' }}
                    className={`flex gap-4 ${msg.type === 'user' ? 'justify-end' : ''}`}
                  >
                    {msg.type === 'assistant' && (
                      <motion.div 
                        className="w-10 h-10 rounded-2xl flex items-center justify-center flex-shrink-0 relative overflow-hidden bg-slate-800/60"
                        whileHover={{ scale: 1.08 }}
                        transition={{ duration: 0.25 }}
                        style={{ boxShadow: '0 0 18px rgba(139, 92, 246, 0.35)' }}
                      >
                        <img src="/logo.svg" alt="Genie logo" className="w-full h-full object-contain p-1.5" />
                      </motion.div>
                    )}
                    
                    <div className={`flex-1 ${msg.type === 'user' ? 'flex justify-end' : ''}`}>
                      <div className="max-w-xs">
                        <motion.div 
                          className={`p-4 rounded-2xl relative overflow-hidden ${
                            msg.type === 'assistant' 
                              ? 'rounded-tl-md' 
                              : 'rounded-tr-md'
                          }`}
                          style={msg.type === 'assistant' 
                            ? {
                                background: 'linear-gradient(135deg, #3b82f6, #1d4ed8, #1e40af)',
                                boxShadow: '0 0 30px rgba(59, 130, 246, 0.3), 0 8px 24px rgba(0, 0, 0, 0.2)'
                              }
                            : {
                                background: 'rgba(30, 41, 59, 0.8)',
                                backdropFilter: 'blur(16px)',
                                border: '1px solid rgba(6, 182, 212, 0.3)',
                                boxShadow: '0 0 20px rgba(6, 182, 212, 0.2), 0 8px 24px rgba(0, 0, 0, 0.2)'
                              }
                          }
                          whileHover={{ scale: 1.02 }}
                          initial={{ scale: 0.9, opacity: 0 }}
                          animate={{ scale: 1, opacity: 1 }}
                        >
                          <div className="text-white font-medium leading-relaxed">
                            {msg.type === 'assistant' ? (
                              <Typewriter text={msg.content} speedMs={14} />
                            ) : (
                              msg.content
                            )}
                          </div>
                        </motion.div>
                        <div className={`mt-2 flex items-center gap-2 ${msg.type === 'user' ? 'justify-end' : ''}`}>
                          <div className="text-xs text-gray-500 font-mono">{msg.timestamp}</div>
                          {/* Message toolbar */}
                          <div className="flex items-center gap-1 opacity-0 group-hover:opacity-100 transition-opacity">
                            <button
                              onClick={() => navigator.clipboard?.writeText(msg.content)}
                              className="text-[11px] px-2 py-1 rounded-md bg-slate-800/60 text-gray-300 hover:text-white"
                            >
                              Copy
                            </button>
                            <button className="text-[11px] px-2 py-1 rounded-md bg-slate-800/60 text-gray-300 hover:text-white">👍</button>
                          </div>
                        </div>
                      </div>
                    </div>

                    {msg.type === 'user' && (
                      <motion.div 
                        className="w-10 h-10 rounded-2xl bg-gradient-to-r from-emerald-500 to-teal-500 flex items-center justify-center flex-shrink-0"
                        whileHover={{ scale: 1.1 }}
                        style={{ boxShadow: '0 0 20px rgba(16, 185, 129, 0.4)' }}
                      >
                        <User className="h-5 w-5 text-white" />
                      </motion.div>
                    )}
                  </motion.div>
                ))}
              </AnimatePresence>

              {/* Enhanced Typing indicator */}
              <motion.div 
                className="flex gap-4"
                initial={{ opacity: 0, y: 20 }}
                animate={{ opacity: 1, y: 0 }}
                transition={{ delay: 1 }}
                layout
                style={{ willChange: 'transform, opacity' }}
              >
                <motion.div 
                  className="w-10 h-10 rounded-2xl bg-gradient-to-r from-indigo-500 via-purple-500 to-pink-500 flex items-center justify-center flex-shrink-0"
                  animate={{ scale: [1, 1.1, 1] }}
                  transition={{ duration: 2, repeat: Infinity }}
                  style={{ boxShadow: '0 0 20px rgba(139, 92, 246, 0.4)' }}
                >
                  <Sparkles className="h-5 w-5 text-white" />
                </motion.div>
                <div className="flex-1">
                  <div 
                    className="p-4 rounded-2xl rounded-tl-md w-20 h-12 flex items-center justify-center"
                    style={{
                      background: 'linear-gradient(135deg, #3b82f6, #1d4ed8)',
                      boxShadow: '0 0 20px rgba(59, 130, 246, 0.3)'
                    }}
                  >
                    <div className="flex gap-1">
                      {[0, 0.2, 0.4].map((delay, i) => (
                        <motion.div
                          key={i}
                          className="w-2 h-2 rounded-full"
                          style={{ 
                            background: 'radial-gradient(circle, #67e8f9, #06b6d4)',
                            boxShadow: '0 0 8px rgba(103, 232, 249, 0.6)'
                          }}
                          animate={{ 
                            y: [0, -8, 0],
                            scale: [1, 1.2, 1]
                          }}
                          transition={{
                            duration: 0.8,
                            delay,
                            repeat: Infinity,
                            ease: "easeInOut"
                          }}
                        />
                      ))}
                    </div>
                  </div>
                  <div className="text-xs text-gray-500 mt-2 font-mono">
                    Genie is thinking...
                  </div>
                </div>
              </motion.div>
            </motion.div>
          </ScrollArea>

          {/* Enhanced Message Input */}
          <motion.div 
            className="p-6 border-t border-slate-700/30"
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ delay: 0.5 }}
          >
            <div className="flex gap-3">
              <Input
                value={message}
                onChange={(e) => setMessage(e.target.value)}
                placeholder="Ask Genie anything..."
                className="flex-1 h-12 rounded-2xl text-white placeholder-gray-400 font-medium border-0"
                style={{
                  background: 'rgba(30, 41, 59, 0.8)',
                  backdropFilter: 'blur(16px)',
                  boxShadow: 'inset 0 2px 8px rgba(0, 0, 0, 0.3), 0 0 0 1px rgba(99, 102, 241, 0.2)'
                }}
                onKeyPress={(e) => e.key === 'Enter' && handleSendMessage()}
              />
              <MagneticButton>
                <div className="relative inline-block">
                  <ClickBurst />
                  <Button 
                    onClick={handleSendMessage}
                    className="h-12 px-6 rounded-2xl font-semibold relative overflow-hidden"
                    style={{ 
                      background: 'linear-gradient(135deg, #3b82f6, #1d4ed8)',
                      boxShadow: '0 0 20px rgba(59, 130, 246, 0.4)'
                    }}
                  >
                    <motion.div
                      className="absolute inset-0 bg-white/20"
                      initial={{ x: '-100%' }}
                      whileHover={{ x: '100%' }}
                      transition={{ duration: 0.5 }}
                    />
                    <Send className="h-5 w-5 relative z-10 text-white" />
                  </Button>
                </div>
              </MagneticButton>
            </div>
          </motion.div>
        </motion.div>

        {/* Enhanced Right Panel - Code Editor */}
        <motion.div 
          className="flex-1 flex flex-col relative rounded-3xl transform-gpu"
          style={{ ...glassStyle, willChange: 'transform, opacity' }}
          initial={{ opacity: 0, x: 50 }}
          animate={{ opacity: 1, x: 0 }}
          transition={{ delay: 0.4 }}
          layout
        >
          {/* Enhanced Editor Header with Tabs */}
          <motion.div 
            className="flex items-center justify-between p-6 border-b border-slate-700/30"
            initial={{ opacity: 0, y: -20 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ delay: 0.5 }}
          >
            <div className="flex items-center gap-6">
              <Tabs value={activeTab} onValueChange={setActiveTab} className="w-auto">
                <TabsList className="bg-slate-800/50 p-1 rounded-2xl backdrop-blur-16">
                  {[
                    { value: 'code', icon: FileCode2, label: 'Code', color: 'indigo' },
                    { value: 'docs', icon: BookOpen, label: 'Docs', color: 'purple' },
                    { value: 'preview', icon: Monitor, label: 'Preview', color: 'cyan' }
                  ].map((tab) => (
                    <motion.div key={tab.value} whileHover={{ scale: 1.05 }} whileTap={{ scale: 0.95 }} transition={{ duration: 0.18, ease: 'easeOut' }} layout>
                      <TabsTrigger 
                        value={tab.value}
                        className={`px-6 py-3 rounded-xl font-semibold transition-all duration-300 relative overflow-hidden ${
                          activeTab === tab.value 
                            ? 'text-white' 
                            : 'text-gray-400 hover:text-gray-300'
                        }`}
                        style={activeTab === tab.value ? {
                          background: `linear-gradient(135deg, ${
                            tab.color === 'indigo' ? '#3b82f6, #1d4ed8' :
                            tab.color === 'purple' ? '#8b5cf6, #7c3aed' :
                            '#06b6d4, #0891b2'
                          })`,
                          boxShadow: `0 0 20px rgba(${
                            tab.color === 'indigo' ? '59, 130, 246' :
                            tab.color === 'purple' ? '139, 92, 246' :
                            '6, 182, 212'
                          }, 0.4)`
                        } : {}}
                      >
                        {activeTab === tab.value && (
                          <motion.div
                            className="absolute inset-0 bg-white/10"
                            initial={{ x: '-100%' }}
                            animate={{ x: '100%' }}
                            transition={{ duration: 1, repeat: Infinity, repeatDelay: 3 }}
                          />
                        )}
                        <tab.icon className="h-5 w-5 mr-2 relative z-10 text-cyan-300" />
                        <span className="relative z-10">{tab.label}</span>
                      </TabsTrigger>
                    </motion.div>
                  ))}
                </TabsList>
              </Tabs>
            </div>
            <div className="flex items-center gap-3">
              {[
                { icon: Play, label: 'Run', color: 'emerald' },
                { icon: Save, label: 'Save', color: 'blue' }
              ].map((action) => (
                <motion.div key={action.label} whileHover={{ scale: 1.05 }} whileTap={{ scale: 0.95 }}>
                  <Button 
                    variant="ghost" 
                    size="sm" 
                    className={`text-gray-400 hover:text-white hover:bg-${action.color}-500/10 px-4 py-2 rounded-xl font-medium transition-all duration-300`}
                  >
                    <action.icon className="h-4 w-4 mr-2 text-cyan-300" />
                    {action.label}
                  </Button>
                </motion.div>
              ))}
            </div>
          </motion.div>

          {/* Enhanced File Tab */}
          <motion.div 
            className="px-6 py-3 border-b border-slate-700/30"
            style={{ background: 'rgba(0, 0, 0, 0.3)' }}
            initial={{ opacity: 0, x: -20 }}
            animate={{ opacity: 1, x: 0 }}
            transition={{ delay: 0.6 }}
          >
            <div className="flex items-center gap-3 text-sm">
              <FileCode2 className="h-4 w-4 text-cyan-300" />
              <span className="text-gray-300 font-mono">/src/App.tsx</span>
              <div className="w-2 h-2 rounded-full bg-emerald-400" style={{ boxShadow: '0 0 8px rgba(52, 211, 153, 0.6)' }} />
              <span className="text-xs text-emerald-400 font-medium">Saved</span>
            </div>
          </motion.div>

          {/* Workspace Body: Conditional Content */}
          {activeTab === 'code' && (
            <div className="flex flex-1 overflow-hidden">
              {/* File Tree */}
              <motion.aside
                className="w-64 border-r border-slate-700/30 p-4 hidden md:block"
                initial={{ opacity: 0, x: -20 }}
                animate={{ opacity: 1, x: 0 }}
                transition={{ delay: 0.55 }}
                style={{ background: 'rgba(2,6,23,0.3)', backdropFilter: 'blur(10px)', borderTopLeftRadius: 16, borderBottomLeftRadius: 16 }}
              >
                <div className="flex items-center justify-between mb-3">
                  <div className="text-xs uppercase tracking-wider text-gray-400">Files</div>
                  <div className="text-[10px] text-gray-500">/src</div>
                </div>
                <div className="space-y-1 text-sm">
                  {[
                    { path: 'src/App.tsx', active: true },
                    { path: 'src/components/GenieApp.tsx' },
                    { path: 'src/components/Home.tsx' },
                    { path: 'src/index.css' },
                  ].map((f) => (
                    <div
                      key={f.path}
                      className={`px-3 py-2 rounded-xl cursor-pointer flex items-center gap-2 ${
                        f.active ? 'bg-slate-800/70 text-gray-100 ring-1 ring-slate-600/50' : 'text-gray-400 hover:bg-slate-800/40 hover:text-gray-200'
                      }`}
                    >
                      <span className="w-2 h-2 rounded-full bg-cyan-400/70" />
                      <span className="truncate">{f.path}</span>
                    </div>
                  ))}
                </div>
              </motion.aside>

              {/* Enhanced Editor Content with Syntax Highlighting */}
              <motion.div 
                className="flex-1 p-6 font-mono text-sm overflow-auto transform-gpu"
                style={{ background: 'rgba(2, 6, 23, 0.25)', willChange: 'opacity' }}
                initial={{ opacity: 0 }}
                animate={{ opacity: 1 }}
                transition={{ delay: 0.7 }}
                layout
              >
                <div className="max-w-[820px] text-gray-300 leading-relaxed">
                  {[
                  { line: 1, content: `import React from 'react';`, tokens: [
                    { text: 'import', color: codeHighlightColors.keyword },
                    { text: ' React ', color: '#e2e8f0' },
                    { text: 'from', color: codeHighlightColors.keyword },
                    { text: " 'react'", color: codeHighlightColors.string },
                    { text: ';', color: '#e2e8f0' }
                  ]},
                  { line: 2, content: `import './App.css';`, tokens: [
                    { text: 'import', color: codeHighlightColors.keyword },
                    { text: " './App.css'", color: codeHighlightColors.string },
                    { text: ';', color: '#e2e8f0' }
                  ]},
                  { line: 3, content: `` },
                  { line: 4, content: `function App() {`, tokens: [
                    { text: 'function', color: codeHighlightColors.keyword },
                    { text: ' ', color: '#e2e8f0' },
                    { text: 'App', color: codeHighlightColors.function },
                    { text: '() {', color: '#e2e8f0' }
                  ]},
                  { line: 5, content: `  return (`, tokens: [
                    { text: '  ', color: '#e2e8f0' },
                    { text: 'return', color: codeHighlightColors.keyword },
                    { text: ' (', color: '#e2e8f0' }
                  ]},
                  { line: 6, content: `    <div className="App">`, tokens: [
                    { text: '    <', color: '#e2e8f0' },
                    { text: 'div', color: codeHighlightColors.tag },
                    { text: ' ', color: '#e2e8f0' },
                    { text: 'className', color: codeHighlightColors.attribute },
                    { text: '=', color: '#e2e8f0' },
                    { text: '"App"', color: codeHighlightColors.string },
                    { text: '>', color: '#e2e8f0' }
                  ]},
                  { line: 7, content: `      <h1>Hello World!</h1>`, tokens: [
                    { text: '      <', color: '#e2e8f0' },
                    { text: 'h1', color: codeHighlightColors.tag },
                    { text: '>Hello World!</', color: '#e2e8f0' },
                    { text: 'h1', color: codeHighlightColors.tag },
                    { text: '>', color: '#e2e8f0' }
                  ]},
                  { line: 8, content: `    </div>`, tokens: [
                    { text: '    </', color: '#e2e8f0' },
                    { text: 'div', color: codeHighlightColors.tag },
                    { text: '>', color: '#e2e8f0' }
                  ]},
                  { line: 9, content: `  );`, tokens: [
                    { text: '  );', color: '#e2e8f0' }
                  ]},
                  { line: 10, content: `}`, tokens: [
                    { text: '}', color: '#e2e8f0' }
                  ]},
                  { line: 11, content: `` },
                  { line: 12, content: `export default App;`, tokens: [
                    { text: 'export', color: codeHighlightColors.keyword },
                    { text: ' ', color: '#e2e8f0' },
                    { text: 'default', color: codeHighlightColors.keyword },
                    { text: ' ', color: '#e2e8f0' },
                    { text: 'App', color: codeHighlightColors.variable },
                    { text: ';', color: '#e2e8f0' }
                  ]}
                  ].map((codeLine, index) => (
                    <motion.div 
                      key={codeLine.line}
                      className="flex hover:bg-slate-800/30 px-3 py-1.5 rounded-lg transition-colors duration-200"
                      initial={{ opacity: 0, x: -20 }}
                      animate={{ opacity: 1, x: 0 }}
                      transition={{ delay: 0.8 + index * 0.05 }}
                    >
                      <div className="w-10 text-gray-500 text-right pr-4 select-none font-medium">
                        {codeLine.line}
                      </div>
                      <div className="flex-1">
                        {codeLine.tokens ? (
                          codeLine.tokens.map((token, tokenIndex) => (
                            <span key={tokenIndex} style={{ color: token.color }}>
                              {token.text}
                            </span>
                          ))
                        ) : (
                          <span>{codeLine.content}</span>
                        )}
                      </div>
                    </motion.div>
                  ))}
                </div>
              </motion.div>
            </div>
          )}

          {/* Docs Tab Content */}
          {activeTab === 'docs' && (
            <Docs />
          )}

          {/* Preview Tab Content */}
          {activeTab === 'preview' && (
            <div className="flex-1 flex items-center justify-center bg-slate-900/50">
              <div className="text-center">
                <Monitor className="w-16 h-16 text-cyan-300 mx-auto mb-4" />
                <h3 className="text-xl font-semibold text-white mb-2">Preview</h3>
                <p className="text-gray-400">Live preview will appear here</p>
              </div>
            </div>
          )}

          {/* Status Bar */}
          <div className="px-4 py-2 border-t border-slate-700/30 text-xs text-gray-400 flex items-center gap-4">
            <div className="flex items-center gap-1"><span className="w-2 h-2 rounded-full bg-emerald-400" /> Ready</div>
            <div>Branch: main</div>
            <div className="ml-auto">UTF-8 | LF | TSX</div>
          </div>
        </motion.div>
      </div>
    </div>
    </MotionConfig>
  );
};

export default GenieApp;

