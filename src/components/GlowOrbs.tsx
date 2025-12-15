import React from "react";
import { motion } from "framer-motion";

interface GlowOrbsProps {
  className?: string;
}

const gradients = [
  "radial-gradient(circle at center, rgba(99,102,241,0.35), rgba(2,6,23,0))",
  "radial-gradient(circle at center, rgba(56,189,248,0.35), rgba(2,6,23,0))",
  "radial-gradient(circle at center, rgba(139,92,246,0.35), rgba(2,6,23,0))",
];

const positions = [
  { left: "10%", top: "20%", size: 260 },
  { right: "8%", bottom: "18%", size: 300 },
  { left: "40%", bottom: "10%", size: 220 },
];

const GlowOrbs: React.FC<GlowOrbsProps> = ({ className }) => {
  return (
    <div className={"pointer-events-none absolute inset-0 " + (className || "")}> 
      {positions.map((pos, i) => (
        <motion.div
          key={i}
          className="absolute rounded-full blur-3xl"
          style={{
            ...pos,
            width: positions[i].size,
            height: positions[i].size,
            background: gradients[i % gradients.length],
          }}
          animate={{ scale: [1, 1.06, 1], opacity: [0.8, 1, 0.8] }}
          transition={{ duration: 6 + i * 1, repeat: Infinity, ease: "easeInOut" }}
        />
      ))}
    </div>
  );
};

export default GlowOrbs;




