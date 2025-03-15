"use client";

import { motion } from "framer-motion";

interface ExperienceHeadingProps {
  title: string;
  inView: boolean;
}

export default function ExperienceHeading({
  title,
  inView,
}: ExperienceHeadingProps) {
  return (
    <motion.h2
      initial={{ opacity: 0, y: 20 }}
      animate={{ opacity: inView ? 1 : 0, y: inView ? 0 : 20 }}
      transition={{ duration: 0.5 }}
      className="section-heading"
    >
      {title}
    </motion.h2>
  );
}
