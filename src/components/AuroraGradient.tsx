import React from "react";

interface AuroraGradientProps {
  className?: string;
}

const AuroraGradient: React.FC<AuroraGradientProps> = ({ className }) => {
  return (
    <div className={"pointer-events-none absolute inset-0 overflow-hidden " + (className || "")}> 
      <div
        className="absolute -top-1/3 -left-1/4 w-[120%] h-[120%] opacity-20"
        style={{
          background:
            "conic-gradient(from 180deg at 50% 50%, #06b6d4, #3b82f6, #8b5cf6, #06b6d4)",
          filter: "blur(80px)",
        }}
      />
    </div>
  );
};

export default AuroraGradient;




