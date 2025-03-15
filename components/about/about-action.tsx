"use client";

import { motion } from "framer-motion";
import { Button } from "@/components/ui/button";
import { FileText } from "lucide-react";

interface AboutActionProps {
  buttonText: string;
  href: string;
  downloadFileName?: string;
  icon?: React.ReactNode;
  inView: boolean;
}

export default function AboutAction({
  buttonText,
  href,
  downloadFileName,
  icon = <FileText className="mr-2 h-4 w-4" />,
  inView,
}: AboutActionProps) {
  return (
    <motion.div
      initial={{ opacity: 0, y: 20 }}
      animate={{ opacity: inView ? 1 : 0, y: inView ? 0 : 20 }}
      transition={{ duration: 0.5, delay: 0.4 }}
      className="pt-4"
    >
      <Button asChild className="rounded-full">
        <a href={href} download={downloadFileName}>
          {icon}
          {buttonText}
        </a>
      </Button>
    </motion.div>
  );
}
