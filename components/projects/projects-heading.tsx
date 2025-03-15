"use client";

import { motion } from "framer-motion";
import SectionHeading from "@/components/ui/section-heading";

interface ProjectsHeadingProps {
  title: string;
  subtitle?: string;
  inView: boolean;
}

export default function ProjectsHeading({
  title,
  subtitle = "Explore my recent projects showcasing my skills in software development, DevOps, and more.",
  inView,
}: ProjectsHeadingProps) {
  return (
    <div className="text-center mb-12">
      <SectionHeading inView={inView}>{title}</SectionHeading>

      <motion.p
        initial={{ opacity: 0, y: 20 }}
        animate={{ opacity: inView ? 1 : 0, y: inView ? 0 : 20 }}
        transition={{ duration: 0.5, delay: 0.3 }}
        className="text-lg text-muted-foreground max-w-2xl mx-auto"
      >
        {subtitle}
      </motion.p>
    </div>
  );
}
