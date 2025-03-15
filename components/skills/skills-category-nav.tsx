"use client";

import { motion } from "framer-motion";
import { Button } from "@/components/ui/button";
import { SkillCategory } from "./skills-data";
import { Code2, Cloud, Layout, Server, Database, Wrench } from "lucide-react";

interface SkillsCategoryNavProps {
  categories: SkillCategory[];
  activeIndex: number;
  onCategorySelect: (index: number) => void;
  inView: boolean;
}

export default function SkillsCategoryNav({
  categories,
  activeIndex,
  onCategorySelect,
  inView,
}: SkillsCategoryNavProps) {
  // Function to get the appropriate icon based on the iconType
  const getIcon = (iconType: string) => {
    switch (iconType) {
      case "code2":
        return <Code2 className="h-6 w-6" />;
      case "cloud":
        return <Cloud className="h-6 w-6" />;
      case "layout":
        return <Layout className="h-6 w-6" />;
      case "server":
        return <Server className="h-6 w-6" />;
      case "database":
        return <Database className="h-6 w-6" />;
      case "wrench":
        return <Wrench className="h-6 w-6" />;
      default:
        return <Code2 className="h-6 w-6" />;
    }
  };

  return (
    <motion.div
      initial={{ opacity: 0, y: 20 }}
      animate={{ opacity: inView ? 1 : 0, y: inView ? 0 : 20 }}
      transition={{ duration: 0.5, delay: 0.2 }}
      className="flex justify-center mb-8 overflow-x-auto py-2 scrollbar-hide"
    >
      <div className="flex space-x-2">
        {categories.map((category, index) => (
          <Button
            key={category.id}
            variant={activeIndex === index ? "default" : "outline"}
            size="sm"
            onClick={() => onCategorySelect(index)}
            className={`rounded-full transition-all duration-300 flex items-center gap-2 ${
              activeIndex === index
                ? "shadow-md"
                : "opacity-70 hover:opacity-100"
            }`}
          >
            <div className={`p-1 rounded-full ${category.iconBg}`}>
              {getIcon(category.iconType)}
            </div>
            <span className="hidden sm:inline">{category.name}</span>
            <span className="sm:hidden">{category.name.split(" ")[0]}</span>
          </Button>
        ))}
      </div>
    </motion.div>
  );
}
