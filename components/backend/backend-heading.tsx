"use client";

import { motion } from "framer-motion";
import { Server } from "lucide-react";

interface BackendHeadingProps {
  title: string;
  subtitle?: string;
  apiEndpoint?: string;
  inView: boolean;
}

export default function BackendHeading({
  title = "Backend API Playground",
  subtitle = "Where API magic meets your fingertips. Tinker with JSON and watch the fun unfold!",
  apiEndpoint = "/api/data",
  inView,
}: BackendHeadingProps) {
  return (
    <div className="flex flex-col items-center text-center mb-12">
      <motion.div
        initial={{ opacity: 0, y: 20 }}
        animate={{ opacity: inView ? 1 : 0, y: inView ? 0 : 20 }}
        transition={{ duration: 0.6 }}
        viewport={{ once: true }}
      >
        <h2 className="text-3xl md:text-4xl font-bold mb-4">{title}</h2>
        <p className="text-muted-foreground max-w-2xl mx-auto mb-6">
          {subtitle}
        </p>
      </motion.div>

      <div className="flex items-center gap-2 mb-8">
        <Server className="h-5 w-5 text-primary" />
        <span className="text-sm font-medium">API endpoint: {apiEndpoint}</span>
      </div>
    </div>
  );
}
