"use client";

import { useEffect, useRef } from "react";

interface Particle {
  x: number;
  y: number;
  size: number;
  color: string;
  speedX: number;
  speedY: number;
  rotation: number;
  rotationSpeed: number;
  shape: "circle" | "square";
}

const COLORS = [
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

export default function Confetti() {
  const canvasRef = useRef<HTMLCanvasElement>(null);
  const animationRef = useRef<number | undefined>(undefined);

  useEffect(() => {
    const canvas = canvasRef.current;
    if (!canvas) return;
    const ctx = canvas.getContext("2d");
    if (!ctx) return;

    // Set canvas dimensions to match viewport.
    let width = canvas.width = window.innerWidth;
    let height = canvas.height = window.innerHeight;

    // Resize canvas when the window is resized.
    const handleResize = () => {
      width = canvas.width = window.innerWidth;
      height = canvas.height = window.innerHeight;
    };
    window.addEventListener("resize", handleResize);

    // Create confetti particles with randomized properties.
    const particles: Particle[] = [];
    const particleCount = 150;
    for (let i = 0; i < particleCount; i++) {
      particles.push({
        x: Math.random() * width,
        y: Math.random() * height - height, // Start above the viewport.
        size: Math.random() * 10 + 5, // Size between 5 and 15 px.
        color: COLORS[Math.floor(Math.random() * COLORS.length)],
        speedX: (Math.random() - 0.5) * 2, // Horizontal drift between -1 and 1.
        speedY: Math.random() * 3 + 2, // Falling speed between 2 and 5.
        rotation: Math.random() * 360,
        rotationSpeed: (Math.random() - 0.5) * 10, // Rotation speed between -5 and 5 deg/frame.
        shape: Math.random() > 0.5 ? "square" : "circle",
      });
    }

    const gravity = 0.05; // Acceleration due to gravity.

    // Animation loop that updates and draws particles.
    const animate = () => {
      ctx.clearRect(0, 0, width, height);
      
      particles.forEach(p => {
        // Update particle physics.
        p.x += p.speedX;
        p.y += p.speedY;
        p.speedY += gravity; // Apply gravity.
        p.rotation += p.rotationSpeed;

        // Reset particle if it goes below the viewport.
        if (p.y > height) {
          p.y = -p.size;
          p.x = Math.random() * width;
          p.speedY = Math.random() * 3 + 2;
        }
        
        // Draw the particle.
        ctx.save();
        ctx.translate(p.x, p.y);
        ctx.rotate((p.rotation * Math.PI) / 180);
        ctx.fillStyle = p.color;
        if (p.shape === "circle") {
          ctx.beginPath();
          ctx.arc(0, 0, p.size / 2, 0, 2 * Math.PI);
          ctx.fill();
        } else {
          ctx.fillRect(-p.size / 2, -p.size / 2, p.size, p.size);
        }
        ctx.restore();
      });
      
      animationRef.current = requestAnimationFrame(animate);
    };

    animate();

    return () => {
      cancelAnimationFrame(animationRef.current!);
      window.removeEventListener("resize", handleResize);
    };
  }, []);

  return (
    <canvas
      ref={canvasRef}
      className="fixed top-0 left-0 pointer-events-none z-50"
      style={{ transform: "translateZ(0)" }} // Hardware acceleration hint.
    />
  );
}
