"use client";

import { useState, useRef } from "react";
import { useInView } from "react-intersection-observer";
import { motion } from "framer-motion";
import { Card, CardContent } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import {
  Code2,
  Cloud,
  Layout,
  Server,
  Database,
  Wrench,
  ChevronLeft,
  ChevronRight,
} from "lucide-react";

// Define skill categories with icons
const skillCategories = [
  {
    id: "languages",
    name: "Programming Languages",
    icon: <Code2 className="h-6 w-6" />,
    color: "from-blue-500/20 to-blue-600/20",
    iconBg: "bg-blue-500/10",
    skills: [
      "JavaScript",
      "TypeScript",
      "Python",
      "Golang",
      "C",
      "C++",
      ".NET",
      "HTML",
    ],
  },
  {
    id: "cloud",
    name: "Cloud & Infrastructure",
    icon: <Cloud className="h-6 w-6" />,
    color: "from-indigo-500/20 to-indigo-600/20",
    iconBg: "bg-indigo-500/10",
    skills: [
      "AWS",
      "Terraform",
      "Kubernetes",
      "Docker",
      "Amazon EKS/ECS",
      "Linux",
      "CLI",
      "Infrastructure as Code (IaC)",
    ],
  },
  {
    id: "frontend",
    name: "Frontend Development",
    icon: <Layout className="h-6 w-6" />,
    color: "from-purple-500/20 to-purple-600/20",
    iconBg: "bg-purple-500/10",
    skills: [
      "React",
      "Redux",
      "Tailwind CSS",
      "HTML5",
      "CSS3",
      "SASS",
      "SCSS",
      "AJAX",
    ],
  },
  {
    id: "backend",
    name: "Backend Development",
    icon: <Server className="h-6 w-6" />,
    color: "from-green-500/20 to-green-600/20",
    iconBg: "bg-green-500/10",
    skills: [
      "Node.js",
      "Express.js",
      "Golang",
      "Python (Flask, FastAPI)",
      "RESTful API",
      "Microservices architecture",
    ],
  },
  {
    id: "databases",
    name: "Databases",
    icon: <Database className="h-6 w-6" />,
    color: "from-amber-500/20 to-amber-600/20",
    iconBg: "bg-amber-500/10",
    skills: ["MongoDB", "SQLite", "MySQL"],
  },
  {
    id: "other",
    name: "Additional Tools & Concepts",
    icon: <Wrench className="h-6 w-6" />,
    color: "from-rose-500/20 to-rose-600/20",
    iconBg: "bg-rose-500/10",
    skills: [
      "Git",
      "Arduino & MIDI",
      "Machine Learning",
      "OpenAI API",
      "Spotify API",
      "YouTube API",
      "WebSockets",
    ],
  },
];

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

      <div className="container-full relative">
        <motion.div
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: inView ? 1 : 0, y: inView ? 0 : 20 }}
          transition={{ duration: 0.5 }}
          className="text-center mb-12"
        >
          <h2 className="section-heading">Skills & Expertise</h2>
          <p className="text-lg text-muted-foreground max-w-2xl mx-auto">
            A comprehensive overview of my technical skills across various
            domains.
          </p>
        </motion.div>

        {/* Category Navigation */}
        <div className="flex justify-center mb-8 overflow-x-auto py-2 scrollbar-hide">
          <div className="flex space-x-2">
            {skillCategories.map((category, index) => (
              <Button
                key={category.id}
                variant={activeIndex === index ? "default" : "outline"}
                size="sm"
                onClick={() => goToCategory(index)}
                className={`rounded-full transition-all duration-300 flex items-center gap-2 ${
                  activeIndex === index
                    ? "shadow-md"
                    : "opacity-70 hover:opacity-100"
                }`}
              >
                <div className={`p-1 rounded-full ${category.iconBg}`}>
                  {category.icon}
                </div>
                <span className="hidden sm:inline">{category.name}</span>
                <span className="sm:hidden">{category.name.split(" ")[0]}</span>
              </Button>
            ))}
          </div>
        </div>

        {/* Carousel Controls */}
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
            key={activeCategory.id}
            initial={{ opacity: 0, y: 10 }}
            animate={{ opacity: 1, y: 0 }}
            exit={{ opacity: 0, y: -10 }}
            transition={{ duration: 0.3 }}
            className="text-2xl font-semibold font-poppins flex items-center gap-2"
          >
            <div className={`p-2 rounded-full ${activeCategory.iconBg}`}>
              {activeCategory.icon}
            </div>
            {activeCategory.name}
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

        {/* Skills Carousel */}
        <div className="relative overflow-hidden" ref={carouselRef}>
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

        {/* Carousel Indicators */}
        <div className="flex justify-center mt-8 space-x-2">
          {skillCategories.map((_, index) => (
            <button
              key={index}
              onClick={() => goToCategory(index)}
              className={`w-2.5 h-2.5 rounded-full transition-all duration-300 ${
                activeIndex === index
                  ? "bg-primary scale-125"
                  : "bg-primary/30 hover:bg-primary/50"
              }`}
              aria-label={`Go to category ${index + 1}`}
            />
          ))}
        </div>

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
