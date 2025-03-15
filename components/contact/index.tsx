"use client";

import { useInView } from "react-intersection-observer";
import ContactHeading from "@/components/contact/contact-heading";
import ContactInfo from "@/components/contact/contact-info";
import ContactForm from "@/components/contact/contact-form";
import { contactInfoData } from "@/components/contact/contact-data";

export default function Contact() {
  const { ref, inView } = useInView({
    triggerOnce: true,
    threshold: 0.1,
  });

  return (
    <section id="contact" ref={ref} className="py-20 relative overflow-hidden">
      {/* Background decorative elements */}
      <div className="absolute top-20 left-0 w-96 h-96 bg-primary/5 rounded-full blur-3xl"></div>
      <div className="absolute bottom-0 right-0 w-80 h-80 bg-primary/5 rounded-full blur-3xl"></div>

      <div className="container mx-auto px-4 relative">
        <ContactHeading title="Get In Touch" inView={inView} />

        <div className="grid grid-cols-1 lg:grid-cols-2 gap-8 max-w-5xl mx-auto">
          <ContactInfo items={contactInfoData} inView={inView} />
          <ContactForm inView={inView} />
        </div>
      </div>
    </section>
  );
}
