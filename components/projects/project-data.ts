// Define project interface
export interface Project {
  id: number;
  title: string;
  description: string;
  tags: string[];
  github?: string;
  demo?: string;
  category: string;
}

// Emoji mappings for project categories
export const categoryEmojis: Record<string, string> = {
  backend: "🔄", // Process flow for Temporal workflow service
  devops: "☁️", // Cloud for AWS/Kubernetes deployment
  fullstack: "🎵", // Music note for Spotify-like app
  ml: "👐", // Hands for sign language translator
  hardware: "🎻", // Violin for MIDI violin project
  audio: "🎚️", // Slider control for audio plugin
  default: "💻", // Laptop for default
};

// Project data
export const projects: Project[] = [
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
