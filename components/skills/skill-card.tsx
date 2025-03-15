"use client";

import { motion } from "framer-motion";
import { Card, CardContent } from "@/components/ui/card";

interface SkillCardProps {
  skill: string;
  color: string;
  index: number;
}

export default function SkillCard({ skill, color, index }: SkillCardProps) {
  return (
    <motion.div
      key={skill}
      initial={{ opacity: 0, y: 20 }}
      animate={{ opacity: 1, y: 0 }}
      transition={{ duration: 0.3, delay: index * 0.05 }}
    >
      <Card className="overflow-hidden hover-card-effect border-border/50 h-full">
        <CardContent className="p-4 flex items-center justify-center h-full">
          <div
            className={`absolute top-0 right-0 left-0 h-1.5 bg-gradient-to-r ${color}`}
          ></div>
          <h3 className="font-medium text-center">{skill}</h3>
        </CardContent>
      </Card>
    </motion.div>
  );
}
