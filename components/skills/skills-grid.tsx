"use client";

import { motion } from "framer-motion";
import SkillCard from "./skill-card";

interface SkillsGridProps {
  skills: string[];
  color: string;
  id: string;
}

export default function SkillsGrid({ skills, color, id }: SkillsGridProps) {
  return (
    <motion.div
      key={id}
      initial={{ opacity: 0, x: 100 }}
      animate={{ opacity: 1, x: 0 }}
      exit={{ opacity: 0, x: -100 }}
      transition={{ duration: 0.5 }}
      className="grid grid-cols-2 md:grid-cols-3 lg:grid-cols-4 gap-4"
    >
      {skills.map((skill, index) => (
        <SkillCard key={skill} skill={skill} color={color} index={index} />
      ))}
    </motion.div>
  );
}
