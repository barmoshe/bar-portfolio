"use client";

import { motion } from "framer-motion";
import { Button } from "@/components/ui/button";
import { Card, CardContent } from "@/components/ui/card";
import { ChevronLeft, ChevronRight } from "lucide-react";
import { SkillCategory } from "./skills-data";
import { Code2, Cloud, Layout, Server, Database, Wrench } from "lucide-react";

interface SkillsCarouselProps {
  categories: SkillCategory[];
  activeIndex: number;
  onNext: () => void;
  onPrev: () => void;
  inView: boolean;
}

export default function SkillsCarousel({
  categories,
  activeIndex,
  onNext,
  onPrev,
  inView,
}: SkillsCarouselProps) {
  const activeCategory = categories[activeIndex];

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
    <>
      {/* Carousel Controls */}
      <div className="flex justify-between items-center mb-6">
        <Button
          variant="outline"
          size="icon"
          onClick={onPrev}
          className="rounded-full border-primary/20 hover:bg-primary/10 hover:border-primary/50"
        >
          <ChevronLeft className="h-5 w-5" />
        </Button>

        <motion.h3
          key={activeCategory.id}
          initial={{ opacity: 0, y: 10 }}
          animate={{ opacity: 1, y: 0 }}
          exit={{ opacity: 0, y: -10 }}
          transition={{ duration: 0.3 }}
          className="text-2xl font-semibold font-poppins flex items-center gap-2"
        >
          <div className={`p-2 rounded-full ${activeCategory.iconBg}`}>
            {getIcon(activeCategory.iconType)}
          </div>
          {activeCategory.name}
        </motion.h3>

        <Button
          variant="outline"
          size="icon"
          onClick={onNext}
          className="rounded-full border-primary/20 hover:bg-primary/10 hover:border-primary/50"
        >
          <ChevronRight className="h-5 w-5" />
        </Button>
      </div>

      {/* Skills Cards */}
      <div className="relative overflow-hidden">
        <motion.div
          key={activeCategory.id}
          initial={{ opacity: 0, x: 100 }}
          animate={{ opacity: 1, x: 0 }}
          exit={{ opacity: 0, x: -100 }}
          transition={{ duration: 0.5 }}
          className="grid grid-cols-2 md:grid-cols-3 lg:grid-cols-4 gap-4"
        >
          {activeCategory.skills.map((skill, index) => (
            <motion.div
              key={skill}
              initial={{ opacity: 0, y: 20 }}
              animate={{ opacity: 1, y: 0 }}
              transition={{ duration: 0.3, delay: index * 0.05 }}
            >
              <Card className="overflow-hidden hover-card-effect border-border/50 h-full">
                <CardContent className="p-4 flex items-center justify-center h-full">
                  <div
                    className={`absolute top-0 right-0 left-0 h-1.5 bg-gradient-to-r ${activeCategory.color}`}
                  ></div>
                  <h3 className="font-medium text-center">{skill}</h3>
                </CardContent>
              </Card>
            </motion.div>
          ))}
        </motion.div>
      </div>
    </>
  );
}
