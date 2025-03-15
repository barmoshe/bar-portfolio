"use client";

import { motion } from "framer-motion";

interface SubtitleProps {
  text: string;
  className?: string;
}

export default function Subtitle({
  text,
  className = "text-2xl md:text-3xl font-semibold mb-4",
}: SubtitleProps) {
  return (
    <motion.h2
      className={className}
      initial={{ opacity: 0 }}
      animate={{ opacity: 1 }}
      transition={{ duration: 0.7, delay: 0.6 }}
    >
      {text}
    </motion.h2>
  );
}
