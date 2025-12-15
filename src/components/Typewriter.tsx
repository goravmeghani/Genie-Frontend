import React, { useEffect, useState } from "react";

interface TypewriterProps {
  text: string;
  speedMs?: number;
  onDone?: () => void;
}

const Typewriter: React.FC<TypewriterProps> = ({ text, speedMs = 18, onDone }) => {
  const [display, setDisplay] = useState("");

  useEffect(() => {
    let i = 0;
    const id = setInterval(() => {
      i++;
      setDisplay(text.slice(0, i));
      if (i >= text.length) {
        clearInterval(id);
        onDone && onDone();
      }
    }, speedMs);
    return () => clearInterval(id);
  }, [text, speedMs, onDone]);

  return <span>{display}</span>;
};

export default Typewriter;









