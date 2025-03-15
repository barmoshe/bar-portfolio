"use client";

import EducationCard from "./education-card";
import { EducationItem } from "./education-data";

interface EducationListProps {
  items: EducationItem[];
  inView: boolean;
}

export default function EducationList({ items, inView }: EducationListProps) {
  return (
    <div className="space-y-8">
      {items.map((item, index) => (
        <EducationCard
          key={item.id}
          item={item}
          index={index}
          inView={inView}
        />
      ))}
    </div>
  );
}
