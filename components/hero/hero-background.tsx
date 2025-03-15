"use client";

import { useRef, useEffect, useState } from "react";
import {
  motion,
  useTransform,
  useMotionValue,
  useSpring,
  useScroll,
} from "framer-motion";

interface HeroBackgroundProps {
  onMouseMove?: (e: React.MouseEvent) => void;
}

export default function HeroBackground({ onMouseMove }: HeroBackgroundProps) {
  const [windowDimensions, setWindowDimensions] = useState({
    width: 1200,
    height: 800,
  });
  const [isClient, setIsClient] = useState(false);
  const containerRef = useRef<HTMLDivElement>(null);

  // Set up motion values for interactive effects
  const mouseX = useMotionValue(0);
  const mouseY = useMotionValue(0);
  const springConfig = { damping: 40, stiffness: 100 };
  const mouseXSpring = useSpring(mouseX, springConfig);
  const mouseYSpring = useSpring(mouseY, springConfig);

  // Parallax scroll effect
  const { scrollY } = useScroll();
  const y1 = useTransform(scrollY, [0, 800], [0, -80]);
  const y2 = useTransform(scrollY, [0, 800], [0, -40]);

  // Set client-side state to avoid hydration mismatch
  useEffect(() => {
    setIsClient(true);

    // Update dimensions after component mounts
    setWindowDimensions({
      width: window.innerWidth,
      height: window.innerHeight,
    });

    // Add resize listener
    const handleResize = () => {
      setWindowDimensions({
        width: window.innerWidth,
        height: window.innerHeight,
      });
    };

    window.addEventListener("resize", handleResize);
    return () => window.removeEventListener("resize", handleResize);
  }, []);

  // Handle mouse movement with throttling
  const handleMouseMove = (e: React.MouseEvent) => {
    if (containerRef.current) {
      const rect = containerRef.current.getBoundingClientRect();
      const x = e.clientX - rect.left;
      const y = e.clientY - rect.top;

      // Only update if mouse has moved significantly (reduces jitter)
      const currentX = mouseX.get();
      const currentY = mouseY.get();
      const distance = Math.sqrt(
        Math.pow(x - currentX, 2) + Math.pow(y - currentY, 2)
      );

      if (distance > 5) {
        mouseX.set(x);
        mouseY.set(y);
      }
    }

    // Call parent onMouseMove if provided
    if (onMouseMove) {
      onMouseMove(e);
    }
  };

  return (
    <div
      ref={containerRef}
      onMouseMove={handleMouseMove}
      className="absolute inset-0 -z-10 w-full"
    >
      {/* Base gradients */}
      <div className="absolute inset-0 w-screen left-0 right-0 bg-gradient-to-br from-primary/10 via-background to-background"></div>
      <div className="absolute inset-0 w-screen left-0 right-0 bg-[radial-gradient(circle_at_30%_20%,hsl(var(--primary)/0.1),transparent_50%)]"></div>

      {/* Interactive gradient that follows mouse */}
      <motion.div
        className="absolute bg-primary/3 rounded-full blur-[150px] opacity-50"
        style={{
          width: Math.max(1200, windowDimensions.width),
          height: Math.max(1200, windowDimensions.height),
          x: useTransform(mouseXSpring, (x) => x - 400),
          y: useTransform(mouseYSpring, (y) => y - 400),
        }}
      />

      {/* Animated background elements */}
      <motion.div
        style={{ y: y1 }}
        className="absolute top-20 -left-20 w-96 h-96 bg-primary/5 rounded-full blur-3xl"
        animate={{ opacity: [0.3, 0.5, 0.3] }}
        transition={{ duration: 8, repeat: Infinity, ease: "easeInOut" }}
      />
      <motion.div
        style={{ y: y2 }}
        className="absolute bottom-20 -right-20 w-96 h-96 bg-primary/5 rounded-full blur-3xl"
        animate={{ opacity: [0.4, 0.6, 0.4] }}
        transition={{ duration: 10, repeat: Infinity, ease: "easeInOut" }}
      />
    </div>
  );
}
