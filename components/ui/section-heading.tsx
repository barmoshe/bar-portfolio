"use client";

import { motion } from "framer-motion";
import { ReactNode } from "react";

interface SectionHeadingProps {
  children: ReactNode;
  inView?: boolean;
  className?: string;
  underlineClassName?: string;
}

export default function SectionHeading({
  children,
  inView = true,
  className = "",
  underlineClassName = "bg-primary",
}: SectionHeadingProps) {
  return (
    <div className={`relative inline-block text-center mb-8 ${className}`}>
      <motion.h2
        initial={{ opacity: 0, y: 20 }}
        animate={{ opacity: inView ? 1 : 0, y: inView ? 0 : 20 }}
        transition={{ duration: 0.5 }}
        className="text-3xl md:text-4xl font-bold tracking-tight"
      >
        {children}
      </motion.h2>
      <motion.div
        initial={{ width: 0 }}
        animate={{ width: inView ? "100%" : 0 }}
        transition={{ duration: 0.7, delay: 0.3 }}
        className={`h-1 mt-2 rounded-full ${underlineClassName}`}
      />
    </div>
  );
}
