"use client";

import { useState } from "react";
import { useInView } from "react-intersection-observer";
import ProjectsHeading from "@/components/projects/projects-heading";
import ProjectFilterTabs from "@/components/projects/project-filter-tabs";
import ProjectGrid from "@/components/projects/project-grid";
import {
  projects,
  categoryEmojis,
  Project,
} from "@/components/projects/project-data";

export default function Projects() {
  const [activeTab, setActiveTab] = useState("all");
  const { ref, inView } = useInView({
    triggerOnce: true,
    threshold: 0.1,
  });

  const filteredProjects =
    activeTab === "all"
      ? projects
      : projects.filter((project: Project) => project.category === activeTab);

  return (
    <section id="projects" ref={ref} className="py-20 relative overflow-hidden">
      {/* Background decorative elements */}
      <div className="absolute top-40 right-0 w-96 h-96 bg-primary/5 rounded-full blur-3xl"></div>
      <div className="absolute bottom-20 left-0 w-80 h-80 bg-primary/5 rounded-full blur-3xl"></div>

      <div className="container mx-auto px-4 relative">
        {/* Projects Heading */}
        <ProjectsHeading title="Projects" inView={inView} />

        {/* Projects Filter Tabs */}
        <ProjectFilterTabs activeTab={activeTab} setActiveTab={setActiveTab}>
          {/* Projects Grid */}
          <ProjectGrid
            projects={filteredProjects}
            inView={inView}
            categoryEmojis={categoryEmojis}
          />
        </ProjectFilterTabs>
      </div>
    </section>
  );
}
