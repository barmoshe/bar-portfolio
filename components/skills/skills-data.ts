// Define skill category and skill interfaces
export interface SkillCategory {
  id: string;
  name: string;
  iconType: string;
  color: string;
  iconBg: string;
  skills: string[];
}

// Define skill categories with icons
export const skillCategories: SkillCategory[] = [
  {
    id: "languages",
    name: "Programming Languages",
    iconType: "code2",
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
    iconType: "cloud",
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
    iconType: "layout",
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
    iconType: "server",
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
    iconType: "database",
    color: "from-amber-500/20 to-amber-600/20",
    iconBg: "bg-amber-500/10",
    skills: ["MongoDB", "SQLite", "MySQL"],
  },
  {
    id: "other",
    name: "Additional Tools & Concepts",
    iconType: "wrench",
    color: "from-rose-500/20 to-rose-600/20",
    iconBg: "bg-rose-500/10",
    skills: [
      "Git",
      "GitHub",
      "CI/CD",
      "VSCode",
      "Agile/Scrum",
      "Testing",
      "Debugging",
      "Documentation",
    ],
  },
];
