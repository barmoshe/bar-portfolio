"use client";

import { motion } from "framer-motion";

interface AboutContentProps {
  paragraphs: string[];
  inView: boolean;
}

export default function AboutContent({
  paragraphs,
  inView,
}: AboutContentProps) {
  return (
    <motion.div
      initial={{ opacity: 0, y: 20 }}
      animate={{ opacity: inView ? 1 : 0, y: inView ? 0 : 20 }}
      transition={{ duration: 0.5, delay: 0.2 }}
      className="space-y-6 text-lg"
    >
      {paragraphs.map((paragraph, index) => (
        <p key={index}>{paragraph}</p>
      ))}
    </motion.div>
  );
}
