"use client";

import { useInView } from "react-intersection-observer";
import { motion } from "framer-motion";
import EducationHeading from "@/components/education/education-heading";
import EducationList from "@/components/education/education-list";
import { educationData } from "@/components/education/education-data";

export default function Education() {
  const { ref, inView } = useInView({
    triggerOnce: true,
    threshold: 0.1,
  });

  return (
    <section id="education" ref={ref} className="py-20 bg-secondary/30">
      <div className="container-full">
        <motion.div
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: inView ? 1 : 0, y: inView ? 0 : 20 }}
          transition={{ duration: 0.5 }}
          className="max-w-4xl mx-auto"
        >
          <EducationHeading title="Education" inView={inView} />

          <EducationList items={educationData} inView={inView} />
        </motion.div>
      </div>
    </section>
  );
}
