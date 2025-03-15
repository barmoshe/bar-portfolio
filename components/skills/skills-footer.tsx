"use client";

import { motion } from "framer-motion";

interface SkillsFooterProps {
  message?: string;
  inView: boolean;
}

export default function SkillsFooter({
  message = "I'm constantly learning and expanding my skill set, always eager to dive deeper and explore new technologies.",
  inView,
}: SkillsFooterProps) {
  return (
    <motion.div
      initial={{ opacity: 0, y: 20 }}
      animate={{ opacity: inView ? 1 : 0, y: inView ? 0 : 20 }}
      transition={{ duration: 0.5, delay: 0.5 }}
      className="mt-12 text-center"
    >
      <p className="text-muted-foreground text-sm max-w-2xl mx-auto">
        {message}
      </p>
    </motion.div>
  );
}
