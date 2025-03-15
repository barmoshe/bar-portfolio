"use client";

import ProjectCard from "./project-card";
import { Project } from "./project-data";

interface ProjectGridProps {
  projects: Project[];
  inView: boolean;
  categoryEmojis: Record<string, string>;
}

export default function ProjectGrid({
  projects,
  inView,
  categoryEmojis,
}: ProjectGridProps) {
  return (
    <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-4 sm:gap-6 md:gap-8">
      {projects.map((project, index) => (
        <ProjectCard
          key={project.id}
          project={project}
          index={index}
          inView={inView}
          categoryEmojis={categoryEmojis}
        />
      ))}
    </div>
  );
}
