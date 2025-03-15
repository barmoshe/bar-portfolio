"use client";

import { ReactNode } from "react";
import { Code2, Cloud, Layout, Server, Database, Wrench } from "lucide-react";

// Define skill category interface
export interface SkillCategory {
  id: string;
  name: string;
  icon: ReactNode;
  color: string;
  iconBg: string;
  skills: string[];
}

// Define skill categories with icons
export const skillCategories: SkillCategory[] = [
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
