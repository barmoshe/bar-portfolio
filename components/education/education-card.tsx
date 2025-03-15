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
import { EducationItem } from "./education-data";

interface EducationCardProps {
  item: EducationItem;
  index: number;
  inView: boolean;
}

export default function EducationCard({
  item,
  index,
  inView,
}: EducationCardProps) {
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
              <CardTitle>{item.institution}</CardTitle>
              <CardDescription>{item.degree}</CardDescription>
            </div>
            <Badge variant="outline" className="w-fit">
              {item.period}
            </Badge>
          </div>
        </CardHeader>
        <CardContent>
          <p className="mb-4">{item.description}</p>
          <div className="flex flex-wrap gap-2">
            {item.skills.map((skill) => (
              <Badge key={skill} variant="secondary">
                {skill}
              </Badge>
            ))}
          </div>
        </CardContent>
      </Card>
    </motion.div>
  );
}
