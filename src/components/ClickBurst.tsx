import React, { useState } from "react";
import { motion, AnimatePresence } from "framer-motion";

interface ClickBurstProps {
  triggerKey?: string;
}

const ClickBurst: React.FC<ClickBurstProps> = ({ triggerKey }) => {
  const [bursts, setBursts] = useState<{ id: number; x: number; y: number }[]>([]);

  const onClick = (e: React.MouseEvent<HTMLDivElement>) => {
    const rect = (e.currentTarget as HTMLDivElement).getBoundingClientRect();
    const x = e.clientX - rect.left;
    const y = e.clientY - rect.top;
    setBursts((prev) => [...prev, { id: Date.now(), x, y }]);
    setTimeout(() => setBursts((prev) => prev.slice(1)), 700);
  };

  return (
    <div className="relative" onClick={onClick}>
      <AnimatePresence>
        {bursts.map((b) => (
          <motion.div
            key={b.id}
            className="pointer-events-none absolute"
            initial={{ opacity: 0.8, scale: 0 }}
            animate={{ opacity: 0, scale: 1.8 }}
            exit={{ opacity: 0 }}
            transition={{ duration: 0.6, ease: "easeOut" }}
            style={{ left: b.x, top: b.y, translateX: -8, translateY: -8 }}
          >
            <div className="w-4 h-4 rounded-full" style={{
              background: 'radial-gradient(circle, rgba(103,232,249,0.9), rgba(59,130,246,0.2))',
              boxShadow: '0 0 12px rgba(103,232,249,0.8)'
            }} />
          </motion.div>
        ))}
      </AnimatePresence>
      {/** children go here via composition */}
    </div>
  );
};

export default ClickBurst;









