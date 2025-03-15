"use client";

import { motion } from "framer-motion";

interface SkillsIndicatorsProps {
  count: number;
  activeIndex: number;
  onSelect: (index: number) => void;
  inView: boolean;
}

export default function SkillsIndicators({
  count,
  activeIndex,
  onSelect,
  inView,
}: SkillsIndicatorsProps) {
  return (
    <motion.div
      initial={{ opacity: 0, y: 20 }}
      animate={{ opacity: inView ? 1 : 0, y: inView ? 0 : 20 }}
      transition={{ duration: 0.5, delay: 0.3 }}
      className="flex justify-center mt-8 space-x-2"
    >
      {Array.from({ length: count }).map((_, index) => (
        <button
          key={index}
          onClick={() => onSelect(index)}
          className={`w-2.5 h-2.5 rounded-full transition-all duration-300 ${
            activeIndex === index
              ? "bg-primary scale-125"
              : "bg-primary/30 hover:bg-primary/50"
          }`}
          aria-label={`Go to category ${index + 1}`}
        />
      ))}
    </motion.div>
  );
}
