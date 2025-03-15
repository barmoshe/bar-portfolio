"use client";

import { motion } from "framer-motion";
import { Button } from "@/components/ui/button";
import { ArrowDown } from "lucide-react";

interface ScrollIndicatorProps {
  targetId: string;
  isVisible?: boolean;
}

export default function ScrollIndicator({
  targetId,
  isVisible = true,
}: ScrollIndicatorProps) {
  return (
    <motion.div
      initial={{ opacity: 0, y: 10 }}
      animate={{ opacity: isVisible ? 1 : 0, y: isVisible ? 0 : 10 }}
      transition={{ duration: 0.7, delay: 1.6 }}
      className="absolute bottom-10 left-1/2 transform -translate-x-1/2"
    >
      <motion.div
        animate={{ y: [0, 6, 0] }}
        transition={{ duration: 3, repeat: Infinity, ease: "easeInOut" }}
      >
        <Button
          asChild
          variant="ghost"
          size="icon"
          className="rounded-full border border-primary/20 hover:bg-primary/10 hover:border-primary/50 transition-all"
        >
          <a href={`#${targetId}`} aria-label="Scroll down">
            <ArrowDown className="h-6 w-6" />
          </a>
        </Button>
      </motion.div>
    </motion.div>
  );
}
