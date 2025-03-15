"use client";

import { useState } from "react";
import { useInView } from "react-intersection-observer";
import { motion } from "framer-motion";
import {
  Card,
  CardContent,
  CardDescription,
  CardFooter,
  CardHeader,
  CardTitle,
} from "@/components/ui/card";
import { Badge } from "@/components/ui/badge";
import { Button } from "@/components/ui/button";
import { ExternalLink, Github } from "lucide-react";
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs";

// Emoji mappings for project categories
const categoryEmojis: Record<string, string> = {
  backend: "🔄", // Process flow for Temporal workflow service
  devops: "☁️", // Cloud for AWS/Kubernetes deployment
  fullstack: "🎵", // Music note for Spotify-like app
  ml: "👐", // Hands for sign language translator
  hardware: "🎻", // Violin for MIDI violin project
  audio: "🎚️", // Slider control for audio plugin
  default: "💻", // Laptop for default
};

const projects = [
  {
    id: 1,
    title: "Temporal Data Processing Service",
    description:
      "A practical demonstration of building cross-language microservices with Temporal, orchestrating activities written in Go, Python, and TypeScript in a seamless workflow.",
    tags: ["Temporal", "Go", "Python", "TypeScript", "Microservices"],
    github: "https://github.com/barmoshe/data-processing-service",
    demo: "https://medium.com/@barmoshe/building-a-cross-language-data-processing-service-with-temporal-a-practical-guide-bf0fb1155d46",
    category: "backend",
  },
  {
    id: 2,
    title: "Wix DevOps Workshop Final Project",
    description:
      "Showcases a full-stack application deployed on an AWS EKS cluster using Terraform, Kubernetes, and Docker with a React frontend and Node.js backend.",
    tags: ["AWS", "Terraform", "Kubernetes", "Docker", "React", "Node.js"],
    github: "https://github.com/barmoshe/Wix-devops-workshop-final-project",
    category: "devops",
  },
  {
    id: 3,
    title: "Israelify – Spotify-like Web Application",
    description:
      "A website enabling users to discover and listen to music with features like user authentication, playlist creation, and personalized recommendations.",
    tags: ["React.js", "Node.js", "Express.js", "MongoDB", "WebSockets"],
    category: "fullstack",
  },
  {
    id: 4,
    title: "Hebrew Sign Language Translator",
    description:
      "Capstone project aimed at empowering the hearing-impaired community using computer vision and machine learning for gesture recognition.",
    tags: ["Machine Learning", "Computer Vision", "Python", "CNN"],
    category: "ml",
  },
  {
    id: 5,
    title: "MIDI Violin – Arduino Project",
    description:
      "Award-winning hackathon project that converts input from a rotary encoder and membrane potentiometer into MIDI messages.",
    tags: ["Arduino", "C++", "MIDI", "Hardware"],
    category: "hardware",
  },
  {
    id: 6,
    title: "JUCE Audio Plugin Development",
    description:
      "Developed a live performance audio plugin using C++ and the JUCE framework during a 27-hour hackathon.",
    tags: ["C++", "JUCE", "Audio Programming", "DSP"],
    category: "audio",
  },
];

export default function Projects() {
  const [activeTab, setActiveTab] = useState("all");
  const { ref, inView } = useInView({
    triggerOnce: true,
    threshold: 0.1,
  });

  const filteredProjects =
    activeTab === "all"
      ? projects
      : projects.filter((project) => project.category === activeTab);

  return (
    <section id="projects" ref={ref} className="py-20 relative overflow-hidden">
      {/* Background decorative elements */}
      <div className="absolute top-40 right-0 w-96 h-96 bg-primary/5 rounded-full blur-3xl"></div>
      <div className="absolute bottom-20 left-0 w-80 h-80 bg-primary/5 rounded-full blur-3xl"></div>

      <div className="container mx-auto px-4 relative">
        <motion.div
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: inView ? 1 : 0, y: inView ? 0 : 20 }}
          transition={{ duration: 0.5 }}
          className="text-center mb-12"
        >
          <h2 className="section-heading">Projects</h2>
          <p className="text-lg text-muted-foreground max-w-2xl mx-auto">
            Explore my recent projects showcasing my skills in software
            development, DevOps, and more.
          </p>
        </motion.div>

        <Tabs
          defaultValue="all"
          value={activeTab}
          onValueChange={setActiveTab}
          className="w-full"
        >
          <div className="flex justify-center mb-8">
            <TabsList className="grid grid-cols-2 sm:grid-cols-3 md:grid-cols-7 gap-2 p-1 bg-secondary/50 backdrop-blur-sm overflow-x-auto max-w-full">
              <TabsTrigger
                value="all"
                className="data-[state=active]:bg-background data-[state=active]:shadow-sm transition-all text-xs sm:text-sm"
              >
                All
              </TabsTrigger>
              <TabsTrigger
                value="backend"
                className="data-[state=active]:bg-background data-[state=active]:shadow-sm transition-all text-xs sm:text-sm"
              >
                Backend
              </TabsTrigger>
              <TabsTrigger
                value="devops"
                className="data-[state=active]:bg-background data-[state=active]:shadow-sm transition-all text-xs sm:text-sm"
              >
                DevOps
              </TabsTrigger>
              <TabsTrigger
                value="fullstack"
                className="data-[state=active]:bg-background data-[state=active]:shadow-sm transition-all text-xs sm:text-sm"
              >
                Full Stack
              </TabsTrigger>
              <TabsTrigger
                value="ml"
                className="data-[state=active]:bg-background data-[state=active]:shadow-sm transition-all text-xs sm:text-sm"
              >
                ML
              </TabsTrigger>
              <TabsTrigger
                value="hardware"
                className="data-[state=active]:bg-background data-[state=active]:shadow-sm transition-all text-xs sm:text-sm"
              >
                Hardware
              </TabsTrigger>
              <TabsTrigger
                value="audio"
                className="data-[state=active]:bg-background data-[state=active]:shadow-sm transition-all text-xs sm:text-sm"
              >
                Audio
              </TabsTrigger>
            </TabsList>
          </div>

          <TabsContent value={activeTab} className="mt-0">
            <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-4 sm:gap-6 md:gap-8">
              {filteredProjects.map((project, index) => (
                <motion.div
                  key={project.id}
                  initial={{ opacity: 0, y: 20 }}
                  animate={{ opacity: inView ? 1 : 0, y: inView ? 0 : 20 }}
                  transition={{ duration: 0.5, delay: index * 0.1 }}
                >
                  <Card className="h-full project-card overflow-hidden border-border/50 hover:border-primary/20">
                    <div className="relative h-48 overflow-hidden emoji-container">
                      <div className="absolute inset-0 bg-gradient-to-br from-primary/10 to-primary/5"></div>
                      <div className="absolute inset-0 bg-[radial-gradient(circle_at_center,hsl(var(--primary)/0.2),transparent_70%)]"></div>
                      <div className="emoji-display">
                        {categoryEmojis[project.category] ||
                          categoryEmojis.default}
                      </div>
                      {/* Category badge */}
                      <div className="absolute top-3 right-3">
                        <Badge
                          variant="outline"
                          className="bg-background/80 backdrop-blur-sm border-primary/20 text-xs capitalize"
                        >
                          {project.category}
                        </Badge>
                      </div>
                    </div>
                    <CardHeader className="pb-2">
                      <CardTitle className="text-xl font-bold line-clamp-1">
                        {project.title}
                      </CardTitle>
                      <CardDescription className="line-clamp-2 text-muted-foreground/80">
                        {project.description}
                      </CardDescription>
                    </CardHeader>
                    <CardContent className="pb-2">
                      <div className="flex flex-wrap gap-2 mt-2">
                        {project.tags.slice(0, 3).map((tag) => (
                          <Badge
                            key={tag}
                            variant="secondary"
                            className="text-xs font-medium"
                          >
                            {tag}
                          </Badge>
                        ))}
                        {project.tags.length > 3 && (
                          <Badge
                            variant="outline"
                            className="text-xs font-medium"
                          >
                            +{project.tags.length - 3}
                          </Badge>
                        )}
                      </div>
                    </CardContent>
                    <CardFooter className="flex justify-between pt-2">
                      {project.github && (
                        <Button
                          asChild
                          variant="outline"
                          size="sm"
                          className="rounded-full text-xs"
                        >
                          <a
                            href={project.github}
                            target="_blank"
                            rel="noopener noreferrer"
                          >
                            <Github className="mr-1 h-3.5 w-3.5" />
                            Code
                          </a>
                        </Button>
                      )}
                      {project.demo && (
                        <Button
                          asChild
                          size="sm"
                          className="rounded-full text-xs"
                        >
                          <a
                            href={project.demo}
                            target="_blank"
                            rel="noopener noreferrer"
                          >
                            <ExternalLink className="mr-1 h-3.5 w-3.5" />
                            Demo
                          </a>
                        </Button>
                      )}
                      {!project.github && !project.demo && (
                        <div className="text-xs text-muted-foreground italic">
                          Private project
                        </div>
                      )}
                    </CardFooter>
                  </Card>
                </motion.div>
              ))}
            </div>
          </TabsContent>
        </Tabs>
      </div>
    </section>
  );
}
