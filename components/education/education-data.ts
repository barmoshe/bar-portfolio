// Education item interface
export interface EducationItem {
  id: number;
  institution: string;
  degree: string;
  period: string;
  description: string;
  skills: string[];
}

// Education data
export const educationData: EducationItem[] = [
  {
    id: 1,
    institution: "Afeka Tel Aviv Academic College of Engineering",
    degree: "Bachelor's Degree in Computer Science",
    period: "2020 - Sep 2023",
    description:
      "Covered a broad spectrum of computer science topics, from low-level assembly to .NET. Gained foundational knowledge in operating systems, data structures, and algorithms.",
    skills: ["Computer Engineering", "HTML", "Git"],
  },
  {
    id: 2,
    institution: "Wix DevOps Workshop",
    degree: "DevOps Training",
    period: "Sep 2024 - Dec 2024",
    description:
      "Participating in a DevOps workshop with Wix and Tech-Career. Hands-on experience with Amazon EKS, Terraform, and microservices. Focus on cloud infrastructure, automation, and scalable deployments.",
    skills: [
      "AWS",
      "Terraform",
      "Amazon ECS",
      "Amazon EKS",
      "Microservices",
      "Docker",
    ],
  },
  {
    id: 3,
    institution: "Coding Academy Israel",
    degree: "FullStack Development Course",
    period: "Feb 2024 - Jun 2024",
    description:
      "Intensive bootcamp focusing on frontend and backend development.",
    skills: [
      "React.js",
      "Redux.js",
      "SASS",
      "Node.js",
      "Express.js",
      "MongoDB",
      "JavaScript",
    ],
  },
  {
    id: 4,
    institution: "BPM College",
    degree: "Music Coursework",
    period: "Feb 2019 - Aug 2019",
    description: "Music coursework, specializing in Ableton and Music Theory.",
    skills: ["Ableton", "Music Theory"],
  },
];
