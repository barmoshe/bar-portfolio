"use client";

import { motion } from "framer-motion";
import {
  Card,
  CardContent,
  CardDescription,
  CardHeader,
  CardTitle,
} from "@/components/ui/card";
import { Badge } from "@/components/ui/badge";
import { ExperienceItem } from "./experience-data";

interface ExperienceCardProps {
  item: ExperienceItem;
  index: number;
  inView: boolean;
}

export default function ExperienceCard({
  item,
  index,
  inView,
}: ExperienceCardProps) {
  return (
    <motion.div
      initial={{ opacity: 0, y: 20 }}
      animate={{ opacity: inView ? 1 : 0, y: inView ? 0 : 20 }}
      transition={{ duration: 0.5, delay: index * 0.1 }}
      className="timeline-item"
    >
      <Card>
        <CardHeader>
          <div className="flex flex-col md:flex-row md:justify-between md:items-center gap-2">
            <div>
              <CardTitle>{item.title}</CardTitle>
              <CardDescription>{item.company}</CardDescription>
            </div>
            <Badge variant="outline" className="w-fit">
              {item.period}
            </Badge>
          </div>
        </CardHeader>
        <CardContent>
          <ul className="list-disc pl-5 space-y-2">
            {item.responsibilities.map((responsibility, idx) => (
              <li key={idx}>{responsibility}</li>
            ))}
          </ul>
        </CardContent>
      </Card>
    </motion.div>
  );
}
