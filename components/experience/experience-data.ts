// Experience item interface
export interface ExperienceItem {
  id: number;
  title: string;
  company: string;
  period: string;
  responsibilities: string[];
}

// Experience data
export const experienceData: ExperienceItem[] = [
  {
    id: 1,
    title: "Customer Support Engineer",
    company: "Wochit",
    period: "Oct 2021 - Present",
    responsibilities: [
      "Provide technical support for users of a cloud video editor at scale.",
      "Troubleshoot and resolve issues, ensuring customer satisfaction.",
      "Collaborate with development teams to improve product features based on user feedback.",
    ],
  },
  {
    id: 2,
    title: "Commander & Iron Dome Operator",
    company: "IDF, Israel",
    period: "Mar 2015 - Mar 2018",
    responsibilities: [
      "Served as a commander, operating and managing Iron Dome defense systems.",
      "Leadership and critical decision-making experience under pressure.",
    ],
  },
];
