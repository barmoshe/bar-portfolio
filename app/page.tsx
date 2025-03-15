import Hero from "@/components/hero-new";
import About from "@/components/about-new";
import Projects from "@/components/projects-new";
import Experience from "@/components/experience-new";
import Skills from "@/components/skills";
import Education from "@/components/education-new";
import Contact from "@/components/contact-new";
import Backend from "@/components/backend";

export default function Home() {
  return (
    <div className="flex flex-col items-center">
      <Hero />
      <About />
      <Projects />
      <Experience />
      <Skills />
      <Education />
      <Backend />
      <Contact />
    </div>
  );
}
