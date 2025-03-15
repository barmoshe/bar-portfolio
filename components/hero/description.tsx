"use client";

import { motion } from "framer-motion";

interface DescriptionProps {
  text: string;
  className?: string;
}

export default function Description({
  text,
  className = "text-lg text-muted-foreground max-w-lg",
}: DescriptionProps) {
  return (
    <motion.p
      className={className}
      initial={{ opacity: 0 }}
      animate={{ opacity: 1 }}
      transition={{ duration: 0.7, delay: 1 }}
    >
      {text}
    </motion.p>
  );
}
