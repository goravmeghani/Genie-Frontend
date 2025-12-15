import React from "react";

interface ShimmerBorderProps {
  children: React.ReactNode;
  radius?: string;
  className?: string;
}

const ShimmerBorder: React.FC<ShimmerBorderProps> = ({ children, radius = "1rem", className }) => {
  return (
    <div className={className} style={{ position: 'relative', borderRadius: radius }}> 
      <div
        aria-hidden
        style={{
          position: 'absolute', inset: 0, borderRadius: radius, padding: 1,
          background: 'linear-gradient(90deg, rgba(99,102,241,0.15), rgba(139,92,246,0.25), rgba(6,182,212,0.15))',
          WebkitMask: 'linear-gradient(#000 0 0) content-box, linear-gradient(#000 0 0)',
          WebkitMaskComposite: 'xor' as any,
          maskComposite: 'exclude',
          pointerEvents: 'none'
        }}
        className="shimmer-border"
      />
      <style>{`
        .shimmer-border { animation: shimmerMove 3s linear infinite; background-size: 200% 100%; }
        @keyframes shimmerMove { from { background-position: 0% 0; } to { background-position: 200% 0; } }
      `}</style>
      <div style={{ position: 'relative', borderRadius: radius }}>
        {children}
      </div>
    </div>
  );
};

export default ShimmerBorder;









