"use client";

import { motion } from "framer-motion";
import { Sparkles } from "lucide-react";

interface StatusBadgeProps {
  text: string;
  icon?: React.ReactNode;
  showDot?: boolean;
}

export default function StatusBadge({
  text,
  icon = <Sparkles className="h-3.5 w-3.5 inline-block" />,
  showDot = true,
}: StatusBadgeProps) {
  return (
    <div className="flex items-center gap-3">
      <span className="inline-block px-3 py-1.5 text-sm font-medium bg-primary/10 text-primary rounded-full">
        <motion.span
          animate={{ rotate: [0, 7, 0] }}
          transition={{ duration: 3, repeat: Infinity }}
          className="inline-block mr-1.5"
        >
          {icon}
        </motion.span>
        {text}
      </span>
      {showDot && (
        <span className="h-2 w-2 rounded-full bg-green-500 animate-pulse"></span>
      )}
    </div>
  );
}
