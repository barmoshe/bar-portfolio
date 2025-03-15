"use client";

import { motion } from "framer-motion";
import { Button } from "@/components/ui/button";
import { ChevronLeft, ChevronRight } from "lucide-react";
import { ReactNode } from "react";

interface CarouselControlsProps {
  prevCategory: () => void;
  nextCategory: () => void;
  icon: ReactNode;
  name: string;
  iconBg: string;
}

export default function CarouselControls({
  prevCategory,
  nextCategory,
  icon,
  name,
  iconBg,
}: CarouselControlsProps) {
  return (
    <div className="flex justify-between items-center mb-6">
      <Button
        variant="outline"
        size="icon"
        onClick={prevCategory}
        className="rounded-full border-primary/20 hover:bg-primary/10 hover:border-primary/50"
      >
        <ChevronLeft className="h-5 w-5" />
      </Button>

      <motion.h3
        key={name}
        initial={{ opacity: 0, y: 10 }}
        animate={{ opacity: 1, y: 0 }}
        exit={{ opacity: 0, y: -10 }}
        transition={{ duration: 0.3 }}
        className="text-2xl font-semibold font-poppins flex items-center gap-2"
      >
        <div className={`p-2 rounded-full ${iconBg}`}>{icon}</div>
        {name}
      </motion.h3>

      <Button
        variant="outline"
        size="icon"
        onClick={nextCategory}
        className="rounded-full border-primary/20 hover:bg-primary/10 hover:border-primary/50"
      >
        <ChevronRight className="h-5 w-5" />
      </Button>
    </div>
  );
}
