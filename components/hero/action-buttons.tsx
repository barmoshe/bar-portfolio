"use client";

import { Button } from "@/components/ui/button";
import { motion } from "framer-motion";
import { Mail, Code } from "lucide-react";

interface ActionButtonsProps {
  primaryHref: string;
  primaryText: string;
  primaryIcon?: React.ReactNode;
  secondaryHref: string;
  secondaryText: string;
  secondaryIcon?: React.ReactNode;
}

export default function ActionButtons({
  primaryHref,
  primaryText,
  primaryIcon = <Mail className="h-4 w-4 group-hover:text-white" />,
  secondaryHref,
  secondaryText,
  secondaryIcon = <Code className="h-4 w-4 group-hover:text-primary" />,
}: ActionButtonsProps) {
  return (
    <div className="flex flex-wrap gap-4">
      <Button
        asChild
        size="lg"
        className="rounded-full shadow-md hover:shadow-lg transition-all group"
      >
        <a href={primaryHref} className="flex items-center gap-2">
          {primaryText}
          <motion.span
            animate={{ x: [0, 3, 0] }}
            transition={{
              duration: 2.5,
              repeat: Infinity,
              repeatType: "loop",
            }}
          >
            {primaryIcon}
          </motion.span>
        </a>
      </Button>
      <Button
        asChild
        variant="outline"
        size="lg"
        className="rounded-full border-primary/20 hover:border-primary transition-all group"
      >
        <a href={secondaryHref} className="flex items-center gap-2">
          {secondaryText}
          <motion.span
            animate={{ rotate: [0, 8, 0] }}
            transition={{ duration: 3, repeat: Infinity }}
          >
            {secondaryIcon}
          </motion.span>
        </a>
      </Button>
    </div>
  );
}
