"use client";

import { motion } from "framer-motion";

interface ContactHeadingProps {
  title: string;
  subtitle?: string;
  inView: boolean;
}

export default function ContactHeading({
  title,
  subtitle = "Feel free to reach out for collaboration, project discussions, or potential career opportunities!",
  inView,
}: ContactHeadingProps) {
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
