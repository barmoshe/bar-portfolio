"use client";

import { motion } from "framer-motion";

interface SkillsHeadingProps {
  title: string;
  subtitle?: string;
  inView: boolean;
}

export default function SkillsHeading({
  title,
  subtitle = "A comprehensive overview of my technical skills across various domains.",
  inView,
}: SkillsHeadingProps) {
  return (
    <motion.div
      initial={{ opacity: 0, y: 20 }}
      animate={{ opacity: inView ? 1 : 0, y: inView ? 0 : 20 }}
      transition={{ duration: 0.5 }}
      className="text-center mb-12"
    >
      <h2 className="section-heading">{title}</h2>
      <p className="text-lg text-muted-foreground max-w-2xl mx-auto">
        {subtitle}
      </p>
    </motion.div>
  );
}
