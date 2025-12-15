import React, { useEffect, useMemo, useRef, useState } from 'react';
import { motion, AnimatePresence } from 'framer-motion';

interface FuturisticBackgroundProps {
  className?: string;
  particleCount?: number;
  colors?: {
    primary: string;
    secondary: string;
    accent: string;
  };
}

const FuturisticBackground: React.FC<FuturisticBackgroundProps> = ({
  className = '',
  particleCount = 80,
  colors = {
    primary: '#06b6d4',
    secondary: '#3b82f6', 
    accent: '#8b5cf6'
  }
}) => {
  const canvasRef = useRef<HTMLCanvasElement>(null);
  const [dimensions, setDimensions] = useState({ width: 0, height: 0 });

  // Neural network nodes and connections
  const neuralNodesRef = useRef<Array<{
    x: number;
    y: number;
    vx: number;
    vy: number;
    size: number;
    color: string;
    connections: number[];
  }>>([]);

  // Initialize neural network
  useEffect(() => {
    const updateDimensions = () => {
      setDimensions({
        width: window.innerWidth,
        height: window.innerHeight
        });
      };

    updateDimensions();
    window.addEventListener('resize', updateDimensions);

    // Create neural nodes
    const nodes = Array.from({ length: 15 }, (_, i) => ({
      x: Math.random() * window.innerWidth,
      y: Math.random() * window.innerHeight,
      vx: (Math.random() - 0.5) * 0.5,
      vy: (Math.random() - 0.5) * 0.5,
      size: Math.random() * 4 + 2,
      color: [colors.primary, colors.secondary, colors.accent][Math.floor(Math.random() * 3)],
      connections: []
    }));

    // Create connections between nearby nodes
    nodes.forEach((node, i) => {
      nodes.forEach((otherNode, j) => {
        if (i !== j) {
          const distance = Math.sqrt(
            Math.pow(node.x - otherNode.x, 2) + Math.pow(node.y - otherNode.y, 2)
          );
          if (distance < 200 && Math.random() > 0.7) {
            node.connections.push(j);
          }
        }
      });
    });

    neuralNodesRef.current = nodes;

    return () => {
      window.removeEventListener('resize', updateDimensions);
    };
  }, [colors]);

  // Animate neural network
  useEffect(() => {
    const canvas = canvasRef.current;
    if (!canvas) return;

    const ctx = canvas.getContext('2d');
    if (!ctx) return;

    canvas.width = dimensions.width;
    canvas.height = dimensions.height;

    let animationId: number;

    const animate = () => {
      ctx.clearRect(0, 0, canvas.width, canvas.height);

      const nodes = neuralNodesRef.current;
      if (!nodes.length) {
        animationId = requestAnimationFrame(animate);
        return;
      }

      nodes.forEach(node => {
        node.x += node.vx;
        node.y += node.vy;

        if (node.x <= 0 || node.x >= canvas.width) node.vx *= -1;
        if (node.y <= 0 || node.y >= canvas.height) node.vy *= -1;

        node.x = Math.max(0, Math.min(canvas.width, node.x));
        node.y = Math.max(0, Math.min(canvas.height, node.y));
      });

      nodes.forEach((node, i) => {
        node.connections.forEach(connectionIndex => {
          const connectedNode = nodes[connectionIndex];
          if (!connectedNode) {
            return;
          }

          const distance = Math.sqrt(
            Math.pow(node.x - connectedNode.x, 2) + Math.pow(node.y - connectedNode.y, 2)
          );

          if (distance < 250) {
            const opacity = Math.max(0, 1 - distance / 250);
            ctx.strokeStyle = `${node.color}${Math.floor(opacity * 255).toString(16).padStart(2, '0')}`;
            ctx.lineWidth = 1;
            ctx.beginPath();
            ctx.moveTo(node.x, node.y);
            ctx.lineTo(connectedNode.x, connectedNode.y);
            ctx.stroke();

            const pulseIntensity = Math.sin(Date.now() * 0.003 + i) * 0.5 + 0.5;
            ctx.strokeStyle = `${node.color}${Math.floor(opacity * pulseIntensity * 128).toString(16).padStart(2, '0')}`;
            ctx.lineWidth = 2;
            ctx.stroke();
          }
        });
      });

      nodes.forEach((node, i) => {
        const pulseSize = Math.sin(Date.now() * 0.002 + i) * 0.3 + 1;

        const gradient = ctx.createRadialGradient(node.x, node.y, 0, node.x, node.y, node.size * pulseSize * 3);
        gradient.addColorStop(0, `${node.color}80`);
        gradient.addColorStop(0.5, `${node.color}40`);
        gradient.addColorStop(1, 'transparent');

        ctx.fillStyle = gradient;
        ctx.beginPath();
        ctx.arc(node.x, node.y, node.size * pulseSize * 3, 0, Math.PI * 2);
        ctx.fill();

        ctx.fillStyle = node.color;
        ctx.beginPath();
        ctx.arc(node.x, node.y, node.size * pulseSize, 0, Math.PI * 2);
        ctx.fill();

        ctx.fillStyle = '#0ea5e9';
        ctx.beginPath();
        ctx.arc(node.x, node.y, node.size * 0.3, 0, Math.PI * 2);
        ctx.fill();
      });

      animationId = requestAnimationFrame(animate);
    };

    animate();

    return () => {
      if (animationId) {
        cancelAnimationFrame(animationId);
      }
    };
  }, [dimensions, colors]);

  // Generate floating particles
  const floatingParticles = useMemo(
    () =>
      Array.from({ length: particleCount }, (_, i) => ({
        id: i,
        x: Math.random() * 100,
        y: Math.random() * 100,
        size: Math.random() * 3 + 1,
        color: [colors.primary, colors.secondary, colors.accent][Math.floor(Math.random() * 3)],
        duration: Math.random() * 20 + 15,
        delay: Math.random() * 5,
      })),
    [particleCount, colors.primary, colors.secondary, colors.accent]
  );

  return (
    <div className={`fixed inset-0 overflow-hidden pointer-events-none ${className}`} style={{ zIndex: -10 }}>
      {/* Base gradient background */}
      <motion.div 
        className="absolute inset-0"
        initial={{ opacity: 0 }}
        animate={{ opacity: 1 }}
        transition={{ duration: 2 }}
        style={{
          background: `
            radial-gradient(ellipse at top left, rgba(59, 130, 246, 0.15) 0%, transparent 50%),
            radial-gradient(ellipse at top right, rgba(139, 92, 246, 0.15) 0%, transparent 50%),
            radial-gradient(ellipse at bottom left, rgba(6, 182, 212, 0.15) 0%, transparent 50%),
            radial-gradient(ellipse at bottom right, rgba(168, 85, 247, 0.15) 0%, transparent 50%),
            linear-gradient(135deg, #0a0a0a 0%, #1a1a2e 25%, #16213e 50%, #0f0f23 75%, #0a0a0a 100%)
          `
        }}
      />

      {/* Animated gradient overlay */}
      <motion.div 
        className="absolute inset-0 opacity-30"
        animate={{
          background: [
            `linear-gradient(45deg, ${colors.primary}20, ${colors.secondary}20, ${colors.accent}20)`,
            `linear-gradient(135deg, ${colors.accent}20, ${colors.primary}20, ${colors.secondary}20)`,
            `linear-gradient(225deg, ${colors.secondary}20, ${colors.accent}20, ${colors.primary}20)`,
            `linear-gradient(315deg, ${colors.primary}20, ${colors.secondary}20, ${colors.accent}20)`
          ]
        }}
        transition={{
          duration: 8,
          repeat: Infinity,
          ease: "linear"
        }}
      />

      {/* Neural network canvas */}
      <canvas
        ref={canvasRef}
        className="absolute inset-0 w-full h-full opacity-60"
        style={{ mixBlendMode: 'screen' }}
      />

      {/* Holographic grid pattern */}
      <motion.div 
        className="absolute inset-0 opacity-10"
        animate={{
          backgroundPosition: ['0px 0px', '50px 50px']
        }}
        transition={{
          duration: 20,
          repeat: Infinity,
          ease: "linear"
        }}
        style={{
          backgroundImage: `
            linear-gradient(${colors.primary}40 1px, transparent 1px),
            linear-gradient(90deg, ${colors.primary}40 1px, transparent 1px)
          `,
          backgroundSize: '50px 50px'
        }}
      />

      {/* Circuit pattern overlay */}
      <motion.div 
        className="absolute inset-0 opacity-5"
        animate={{
          backgroundPosition: ['0% 0%', '100% 100%']
        }}
        transition={{
          duration: 15,
          repeat: Infinity,
          ease: "linear"
        }}
        style={{
          backgroundImage: `
            radial-gradient(circle at 25% 25%, ${colors.primary}60 2px, transparent 2px),
            radial-gradient(circle at 75% 75%, ${colors.accent}60 2px, transparent 2px),
            radial-gradient(circle at 50% 50%, ${colors.secondary}60 1px, transparent 1px)
          `,
          backgroundSize: '100px 100px, 150px 150px, 75px 75px'
        }}
      />

      {/* Floating AI particles */}
      <AnimatePresence>
        {floatingParticles.map((particle) => (
          <motion.div
            key={particle.id}
            className="absolute rounded-full"
            style={{
              left: `${particle.x}%`,
              top: `${particle.y}%`,
              width: `${particle.size}px`,
              height: `${particle.size}px`,
              backgroundColor: particle.color,
              boxShadow: `0 0 ${particle.size * 3}px ${particle.color}80`
            }}
            animate={{
              y: [0, -100, -50, -150, 0],
              x: [0, 30, -20, 40, 0],
              opacity: [0, 0.8, 0.6, 0.9, 0],
              scale: [0.5, 1.2, 0.8, 1.5, 0.3]
            }}
            transition={{
              duration: particle.duration,
              delay: particle.delay,
              repeat: Infinity,
              ease: "easeInOut"
            }}
          />
        ))}
      </AnimatePresence>

      {/* Genie lamp glow at bottom center */}
      <motion.div 
        className="absolute bottom-0 left-1/2 transform -translate-x-1/2"
        animate={{
          opacity: [0.3, 0.7, 0.3],
          scale: [1, 1.1, 1]
        }}
        transition={{
          duration: 4,
          repeat: Infinity,
          ease: "easeInOut"
        }}
        style={{
          width: '400px',
          height: '200px',
          background: `radial-gradient(ellipse, #fbbf2480 0%, #f59e0b60 30%, ${colors.accent}40 60%, transparent 90%)`,
          filter: 'blur(20px)'
        }}
      />

      {/* AI brain visualization */}
      <motion.div 
        className="absolute top-1/4 right-1/4 opacity-20"
        animate={{
          rotate: [0, 360]
        }}
        transition={{
          duration: 30,
          repeat: Infinity,
          ease: "linear"
        }}
      >
        <svg width="120" height="120" viewBox="0 0 120 120">
          <defs>
            <linearGradient id="brainGradient" x1="0%" y1="0%" x2="100%" y2="100%">
              <stop offset="0%" stopColor={colors.primary} stopOpacity="0.8" />
              <stop offset="50%" stopColor={colors.secondary} stopOpacity="0.6" />
              <stop offset="100%" stopColor={colors.accent} stopOpacity="0.4" />
            </linearGradient>
          </defs>
          
          {/* Concentric circles representing AI layers */}
          {[40, 30, 20, 10].map((radius, index) => (
            <motion.circle
              key={radius}
              cx="60"
              cy="60"
              r={radius}
              fill="none"
              stroke="url(#brainGradient)"
              strokeWidth="1"
              animate={{
                opacity: [0.3, 0.8, 0.3],
                strokeWidth: [1, 2, 1]
              }}
              transition={{
                duration: 3,
                delay: index * 0.5,
                repeat: Infinity,
                ease: "easeInOut"
              }}
            />
          ))}
          
          {/* Neural connection points */}
          {Array.from({ length: 12 }, (_, i) => {
            const angle = (i * 30) * Math.PI / 180;
            const x = 60 + Math.cos(angle) * 35;
            const y = 60 + Math.sin(angle) * 35;
            return (
              <motion.circle
                key={i}
                cx={x}
                cy={y}
                r="2"
                fill={colors.primary}
                animate={{
                  opacity: [0.4, 1, 0.4],
                  r: [2, 4, 2]
                }}
                transition={{
                  duration: 2,
                  delay: i * 0.2,
                  repeat: Infinity,
                  ease: "easeInOut"
                }}
              />
            );
          })}
        </svg>
      </motion.div>

      {/* Data streams */}
      {Array.from({ length: 8 }, (_, i) => (
        <motion.div
          key={`stream-${i}`}
          className="absolute"
          style={{
            left: `${10 + i * 12}%`,
            bottom: '0px',
            width: '2px',
            height: '100px',
            background: `linear-gradient(to top, ${colors.primary}80, ${colors.accent}60, transparent)`,
            borderRadius: '50%'
          }}
          animate={{
            height: ['100px', '200px', '150px', '100px'],
            opacity: [0.3, 0.8, 0.5, 0.3]
          }}
          transition={{
            duration: 4 + i * 0.5,
            delay: i * 0.3,
            repeat: Infinity,
            ease: "easeInOut"
          }}
        />
      ))}

      {/* Holographic energy waves */}
      {Array.from({ length: 3 }, (_, i) => (
        <motion.div
          key={`wave-${i}`}
          className="absolute top-0 left-0 w-full h-1"
          style={{
            background: `linear-gradient(90deg, transparent, ${colors.primary}60, ${colors.accent}60, transparent)`,
            top: `${20 + i * 30}%`
          }}
          animate={{
            x: ['-100%', '100vw']
          }}
          transition={{
            duration: 8 + i * 2,
            delay: i * 2,
            repeat: Infinity,
            ease: "linear"
          }}
        />
      ))}

      {/* Ambient light orbs */}
      {Array.from({ length: 5 }, (_, i) => (
        <motion.div
          key={`orb-${i}`}
          className="absolute rounded-full"
          style={{
            left: `${Math.random() * 100}%`,
            top: `${Math.random() * 100}%`,
            width: `${20 + Math.random() * 40}px`,
            height: `${20 + Math.random() * 40}px`,
            background: `radial-gradient(circle, ${[colors.primary, colors.secondary, colors.accent][i % 3]}40, transparent)`,
            filter: 'blur(10px)'
          }}
          animate={{
            scale: [1, 1.5, 1],
            opacity: [0.2, 0.6, 0.2],
            x: [0, Math.random() * 100 - 50, 0],
            y: [0, Math.random() * 100 - 50, 0]
          }}
          transition={{
            duration: 10 + Math.random() * 10,
            delay: i * 2,
            repeat: Infinity,
            ease: "easeInOut"
          }}
        />
      ))}
    </div>
  );
};

export default FuturisticBackground;
