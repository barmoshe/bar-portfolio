"use client";

import { useInView } from "react-intersection-observer";
import { motion } from "framer-motion";
import ExperienceHeading from "@/components/experience/experience-heading";
import ExperienceList from "@/components/experience/experience-list";
import { experienceData } from "@/components/experience/experience-data";

export default function Experience() {
  const { ref, inView } = useInView({
    triggerOnce: true,
    threshold: 0.1,
  });

  return (
    <section id="experience" ref={ref} className="py-20 bg-secondary/30">
      <div className="container mx-auto px-4">
        <motion.div
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: inView ? 1 : 0, y: inView ? 0 : 20 }}
          transition={{ duration: 0.5 }}
          className="max-w-4xl mx-auto"
        >
          <ExperienceHeading title="Professional Experience" inView={inView} />

          <ExperienceList items={experienceData} inView={inView} />
        </motion.div>
      </div>
    </section>
  );
}
