"use client";

import ExperienceCard from "./experience-card";
import { ExperienceItem } from "./experience-data";

interface ExperienceListProps {
  items: ExperienceItem[];
  inView: boolean;
}

export default function ExperienceList({ items, inView }: ExperienceListProps) {
  return (
    <div className="space-y-8">
      {items.map((item, index) => (
        <ExperienceCard
          key={item.id}
          item={item}
          index={index}
          inView={inView}
        />
      ))}
    </div>
  );
}
