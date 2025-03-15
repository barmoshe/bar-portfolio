"use client";

import { useState, useRef } from "react";
import { useInView } from "react-intersection-observer";
import { motion } from "framer-motion";
import CarouselControls from "@/components/skills/carousel-controls";
import CarouselIndicators from "@/components/skills/carousel-indicators";
import SkillCategoryButton from "@/components/skills/skill-category-button";
import {
  skillCategories,
  SkillCategory,
} from "@/components/skills/skill-categories";
import SkillsGrid from "@/components/skills/skills-grid";
import SkillsHeading from "@/components/skills/skills-heading";

export default function Skills() {
  const [activeIndex, setActiveIndex] = useState(0);
  const { ref, inView } = useInView({
    triggerOnce: true,
    threshold: 0.1,
  });

  const carouselRef = useRef<HTMLDivElement>(null);

  const nextCategory = () => {
    setActiveIndex((prev) =>
      prev === skillCategories.length - 1 ? 0 : prev + 1
    );
  };

  const prevCategory = () => {
    setActiveIndex((prev) =>
      prev === 0 ? skillCategories.length - 1 : prev - 1
    );
  };

  const goToCategory = (index: number) => {
    setActiveIndex(index);
  };

  const activeCategory = skillCategories[activeIndex];

  return (
    <section id="skills" ref={ref} className="py-20 relative overflow-hidden">
      {/* Background decorative elements */}
      <div className="absolute top-40 right-0 w-96 h-96 bg-primary/5 rounded-full blur-3xl"></div>
      <div className="absolute bottom-20 left-0 w-80 h-80 bg-primary/5 rounded-full blur-3xl"></div>

      <div className="container mx-auto px-4 relative">
        {/* Section Heading */}
        <SkillsHeading title="Skills & Expertise" inView={inView} />

        {/* Category Navigation */}
        <div className="flex justify-center mb-8 overflow-x-auto py-2 scrollbar-hide">
          <div className="flex space-x-2">
            {skillCategories.map((category: SkillCategory, index: number) => (
              <SkillCategoryButton
                key={category.id}
                id={category.id}
                name={category.name}
                icon={category.icon}
                iconBg={category.iconBg}
                isActive={activeIndex === index}
                onClick={() => goToCategory(index)}
              />
            ))}
          </div>
        </div>

        {/* Carousel Controls */}
        <CarouselControls
          prevCategory={prevCategory}
          nextCategory={nextCategory}
          icon={activeCategory.icon}
          name={activeCategory.name}
          iconBg={activeCategory.iconBg}
        />

        {/* Skills Grid */}
        <div className="relative overflow-hidden" ref={carouselRef}>
          <SkillsGrid
            id={activeCategory.id}
            skills={activeCategory.skills}
            color={activeCategory.color}
          />
        </div>

        {/* Carousel Indicators */}
        <CarouselIndicators
          count={skillCategories.length}
          activeIndex={activeIndex}
          goToCategory={goToCategory}
        />

        <motion.div
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: inView ? 1 : 0, y: inView ? 0 : 20 }}
          transition={{ duration: 0.5, delay: 0.5 }}
          className="mt-12 text-center"
        >
          <p className="text-muted-foreground text-sm max-w-2xl mx-auto">
            I'm constantly learning and expanding my skill set, always eager to
            dive deeper and explore new technologies.
          </p>
        </motion.div>
      </div>
    </section>
  );
}
