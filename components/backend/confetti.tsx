"use client";

import { useEffect, useState, ReactElement } from "react";

export default function Confetti() {
  const [particles, setParticles] = useState<ReactElement[]>([]);

  useEffect(() => {
    // Create confetti particles
    const colors = [
      "#f44336",
      "#e91e63",
      "#9c27b0",
      "#673ab7",
      "#3f51b5",
      "#2196f3",
      "#03a9f4",
      "#00bcd4",
      "#009688",
      "#4caf50",
      "#8bc34a",
      "#cddc39",
      "#ffeb3b",
      "#ffc107",
      "#ff9800",
      "#ff5722",
    ];

    const newParticles: ReactElement[] = [];
    const particleCount = 100;

    for (let i = 0; i < particleCount; i++) {
      const left = Math.random() * 100;
      const width = Math.random() * 10 + 5;
      const height = Math.random() * 10 + 5;
      const bg = colors[Math.floor(Math.random() * colors.length)];
      const animationDuration = Math.random() * 3 + 2;
      const animationDelay = Math.random() * 0.5;

      newParticles.push(
        <div
          key={i}
          className="absolute top-0 rounded-md"
          style={{
            left: `${left}%`,
            width: `${width}px`,
            height: `${height}px`,
            backgroundColor: bg,
            animation: `confetti-fall ${animationDuration}s ease-in ${animationDelay}s forwards`,
          }}
        />
      );
    }

    setParticles(newParticles);

    // Clean up
    return () => {
      setParticles([]);
    };
  }, []);

  return (
    <div className="fixed inset-0 pointer-events-none z-50">
      <style jsx global>{`
        @keyframes confetti-fall {
          0% {
            transform: translateY(-100px) rotate(0deg);
            opacity: 1;
          }
          100% {
            transform: translateY(100vh) rotate(720deg);
            opacity: 0;
          }
        }
      `}</style>
      {particles}
    </div>
  );
}
