import React from "react";
import { motion } from "framer-motion";

interface FloatingSparklesProps {
  count?: number;
  colorFrom?: string;
  colorTo?: string;
  className?: string;
}

const FloatingSparkles: React.FC<FloatingSparklesProps> = ({
  count = 14,
  colorFrom = "rgba(103,232,249,0.9)",
  colorTo = "rgba(59,130,246,0.4)",
  className,
}) => {
  return (
    <div className={"pointer-events-none absolute inset-0 overflow-hidden " + (className || "")}>
      {[...Array(count)].map((_, i) => (
        <motion.div
          key={i}
          className="absolute w-2 h-2 rounded-full"
          style={{
            left: `${(i * 73) % 100}%`,
            top: `${(i * 41) % 100}%`,
            background: `radial-gradient(circle, ${colorFrom}, ${colorTo})`,
            boxShadow: "0 0 10px rgba(103,232,249,0.8)",
          }}
          animate={{
            y: [0, -12 - (i % 4) * 4, 0],
            opacity: [0.5, 1, 0.5],
            scale: [1, 1.15, 1],
          }}
          transition={{ duration: 2 + (i % 5) * 0.35, repeat: Infinity, ease: "easeInOut", delay: i * 0.08 }}
        />)
      )}
    </div>
  );
};

export default FloatingSparkles;



