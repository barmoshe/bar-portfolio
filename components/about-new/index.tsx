"use client";

import { useInView } from "react-intersection-observer";
import { motion } from "framer-motion";
import AboutHeading from "@/components/about/about-heading";
import AboutContent from "@/components/about/about-content";
import AboutAction from "@/components/about/about-action";
import { aboutParagraphs, resumeInfo } from "@/components/about/about-data";

export default function About() {
  const { ref, inView } = useInView({
    triggerOnce: true,
    threshold: 0.1,
  });

  return (
    <section id="about" ref={ref} className="py-20 bg-secondary/30">
      <div className="container-full">
        <motion.div
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: inView ? 1 : 0, y: inView ? 0 : 20 }}
          transition={{ duration: 0.5 }}
          className="max-w-4xl mx-auto"
        >
          <AboutHeading title="About Me" inView={inView} />

          <AboutContent paragraphs={aboutParagraphs} inView={inView} />

          <AboutAction
            buttonText={resumeInfo.buttonText}
            href={resumeInfo.href}
            downloadFileName={resumeInfo.downloadFileName}
            inView={inView}
          />
        </motion.div>
      </div>
    </section>
  );
}
