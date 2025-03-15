"use client";

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
import { Project } from "./project-data";

interface ProjectCardProps {
  project: Project;
  index: number;
  inView: boolean;
  categoryEmojis: Record<string, string>;
}

export default function ProjectCard({
  project,
  index,
  inView,
  categoryEmojis,
}: ProjectCardProps) {
  return (
    <motion.div
      key={project.id}
      initial={{ opacity: 0, y: 20 }}
      animate={{ opacity: inView ? 1 : 0, y: inView ? 0 : 20 }}
      transition={{ duration: 0.5, delay: index * 0.1 }}
    >
      <Card className="h-full project-card overflow-hidden border-border/50 hover:border-primary/20">
        <div className="relative h-40 sm:h-48 overflow-hidden emoji-container">
          <div className="absolute inset-0 bg-gradient-to-br from-primary/10 to-primary/5"></div>
          <div className="absolute inset-0 bg-[radial-gradient(circle_at_center,hsl(var(--primary)/0.2),transparent_70%)]"></div>
          <div className="emoji-display">
            {categoryEmojis[project.category] || categoryEmojis.default}
          </div>
          {/* Category badge */}
          <div className="absolute top-2 sm:top-3 right-2 sm:right-3">
            <Badge
              variant="outline"
              className="bg-background/80 backdrop-blur-sm border-primary/20 text-xs capitalize"
            >
              {project.category}
            </Badge>
          </div>
        </div>
        <CardHeader className="pb-1 sm:pb-2 px-3 sm:px-4 pt-3 sm:pt-4">
          <CardTitle className="text-lg sm:text-xl font-bold line-clamp-1">
            {project.title}
          </CardTitle>
          <CardDescription className="line-clamp-2 text-muted-foreground/80 text-sm">
            {project.description}
          </CardDescription>
        </CardHeader>
        <CardContent className="pb-1 sm:pb-2 px-3 sm:px-4">
          <div className="flex flex-wrap gap-1.5 sm:gap-2 mt-1 sm:mt-2">
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
              <Badge variant="outline" className="text-xs font-medium">
                +{project.tags.length - 3}
              </Badge>
            )}
          </div>
        </CardContent>
        <CardFooter className="flex justify-between pt-1 sm:pt-2 px-3 sm:px-4 pb-3 sm:pb-4">
          {project.github && (
            <Button
              asChild
              variant="outline"
              size="sm"
              className="rounded-full text-xs h-8 sm:h-9"
            >
              <a
                href={project.github}
                target="_blank"
                rel="noopener noreferrer"
              >
                <Github className="mr-1 h-3 sm:h-3.5 w-3 sm:w-3.5" />
                Code
              </a>
            </Button>
          )}
          {project.demo && (
            <Button asChild size="sm" className="rounded-full text-xs h-8 sm:h-9">
              <a href={project.demo} target="_blank" rel="noopener noreferrer">
                <ExternalLink className="mr-1 h-3 sm:h-3.5 w-3 sm:w-3.5" />
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
  );
}
