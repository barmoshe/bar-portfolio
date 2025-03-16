"use client";

import { useState, useEffect } from "react";
import { motion, useScroll, useTransform } from "framer-motion";
import ActionButtons from "@/components/hero/action-buttons";
import Description from "@/components/hero/description";
import HeroBackground from "@/components/hero/hero-background";
import HeroHeading from "@/components/hero/hero-heading";
import ProfileImage from "@/components/hero/profile-image";
import ScrollIndicator from "@/components/hero/scroll-indicator";
import SocialLinks from "@/components/hero/social-links";
import StatusBadge from "@/components/hero/status-badge";
import Subtitle from "@/components/hero/subtitle";
import Typewriter from "@/components/hero/typewriter";

// Typing animation text options
const typingTexts = [
  "Building scalable applications",
  "Crafting cloud solutions",
  "Developing microservices",
  "Automating with DevOps",
  "Architecting infrastructure",
];

export default function Hero() {
  const [isVisible, setIsVisible] = useState(false);
  const [isClient, setIsClient] = useState(false);

  // Parallax effect on scroll (more subtle)
  const { scrollY } = useScroll();
  const opacity = useTransform(scrollY, [0, 400], [1, 0]);

  // Initial animation - delay to ensure proper loading
  useEffect(() => {
    if (!isClient) {
      setIsClient(true);
    }

    const timer = setTimeout(() => {
      setIsVisible(true);
    }, 300);

    return () => clearTimeout(timer);
  }, [isClient]);

  return (
    <section
      id="home"
      className="relative min-h-screen w-full flex items-center justify-center py-16 md:py-20 overflow-hidden"
    >
      {/* Background Component */}
      <HeroBackground />

      <motion.div className="hero-container pt-10 md:pt-16" style={{ opacity }}>
        <div className="grid grid-cols-1 lg:grid-cols-2 gap-12 md:gap-16 items-center">
          <motion.div
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: isVisible ? 1 : 0, y: isVisible ? 0 : 20 }}
            transition={{ duration: 0.8, delay: 0.2 }}
            className="flex flex-col space-y-8 mx-auto lg:mx-0 max-w-xl"
          >
            <div>
              {/* Status Badge */}
              <motion.div
                initial={{ opacity: 0, scale: 0.8 }}
                animate={{ opacity: 1, scale: 1 }}
                transition={{ duration: 0.6, delay: 0.3 }}
                className="mb-6"
              >
                <StatusBadge text="Available for hire" />
              </motion.div>

              {/* Hero Heading */}
              <HeroHeading name="Bar Moshe" />

              {/* Subtitle */}
              <Subtitle text="Software Developer & DevOps Enthusiast" />

              {/* Typewriter */}
              <motion.div
                initial={{ opacity: 0 }}
                animate={{ opacity: 1 }}
                transition={{ duration: 0.7, delay: 0.8 }}
                className="flex flex-col sm:flex-row sm:items-center text-xl text-muted-foreground max-w-lg mb-4"
              >
                <span className="mr-2 mb-1 sm:mb-0">I specialize in</span>
                {isClient && <Typewriter texts={typingTexts} />}
              </motion.div>

              {/* Description */}
              <Description text="Seeking Backend or DevOps roles. Passionate about building robust, scalable systems and cloud infrastructure." />
            </div>

            {/* Action Buttons */}
            <motion.div
              initial={{ opacity: 0, y: 10 }}
              animate={{ opacity: 1, y: 0 }}
              transition={{ duration: 0.7, delay: 1.2 }}
            >
              <ActionButtons
                primaryHref="#contact"
                primaryText="Get in Touch"
                secondaryHref="#projects"
                secondaryText="View Projects"
              />
            </motion.div>

            {/* Social Links */}
            <motion.div
              initial={{ opacity: 0 }}
              animate={{ opacity: 1 }}
              transition={{ duration: 0.7, delay: 1.4 }}
            >
              <SocialLinks />
            </motion.div>
          </motion.div>

          {/* Profile Image */}
          {isClient && <ProfileImage imageSrc="/bar.jpg" altText="Bar Moshe" />}
        </div>

        {/* Scroll Indicator */}
        <ScrollIndicator targetId="about" isVisible={isVisible} />
      </motion.div>
    </section>
  );
}
